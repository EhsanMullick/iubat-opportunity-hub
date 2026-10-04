import { EventItem, EventFilterParams, EventSaveItem, ApplicationStatus, EventStatus } from '@/types';
import { INITIAL_MOCK_EVENTS } from './mockEvents';
import { isEventExpired } from '../utils/date';

// In-memory runtime cache for server/client consistency in dev mode
let inMemoryEvents: EventItem[] = [...INITIAL_MOCK_EVENTS];
let inMemorySaves: EventSaveItem[] = [
  {
    id: 'save-01',
    user_id: 'current-student',
    event_id: 'evt-001',
    status: 'applied',
    notes: 'Submitted team registration for track 1: Smart University. Awaiting confirmation email.',
    deadline_reminder: true,
    created_at: '2026-10-02T10:00:00Z',
    updated_at: '2026-10-02T10:00:00Z',
  },
  {
    id: 'save-02',
    user_id: 'current-student',
    event_id: 'evt-002',
    status: 'saved',
    notes: 'Need to print 5 updated CV copies and review data structures before attending.',
    deadline_reminder: true,
    created_at: '2026-10-03T14:00:00Z',
    updated_at: '2026-10-03T14:00:00Z',
  },
  {
    id: 'save-03',
    user_id: 'current-student',
    event_id: 'evt-005',
    status: 'interviewing',
    notes: 'Line Follower bot prototype passed preliminary calibration tests!',
    deadline_reminder: true,
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-03T11:00:00Z',
  },
];

/**
 * Executes automatic event expiration.
 * Scans published events and marks those whose end_datetime is earlier than current UTC as 'expired'.
 * Idempotent and safe to run repeatedly.
 */
export function runEventExpirationJob(): { expiredCount: number; expiredIds: string[] } {
  let count = 0;
  const expiredIds: string[] = [];

  inMemoryEvents = inMemoryEvents.map((evt) => {
    if (evt.status === 'published' && isEventExpired(evt.end_datetime)) {
      count++;
      expiredIds.push(evt.id);
      return {
        ...evt,
        status: 'expired' as EventStatus,
        updated_at: new Date().toISOString(),
      };
    }
    return evt;
  });

  return { expiredCount: count, expiredIds };
}

/**
 * Get eligible upcoming events for public discovery feeds, homepage, explore, map, and categories.
 * STRICT BUSINESS RULE:
 * - Status MUST be 'published'
 * - end_datetime MUST be in the future (not expired)
 * - Excludes pending_review, rejected, cancelled, and expired events
 */
export function getEligibleUpcomingEvents(params: EventFilterParams = {}): {
  events: EventItem[];
  total: number;
} {
  // First run runtime check
  const now = new Date();

  let filtered = inMemoryEvents.filter((evt) => {
    if (evt.status !== 'published') return false;
    const end = new Date(evt.end_datetime);
    return end.getTime() > now.getTime();
  });

  // Search filter
  if (params.search && params.search.trim() !== '') {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue_name.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (params.category && params.category !== 'All') {
    filtered = filtered.filter((e) => e.category === params.category);
  }

  // City filter
  if (params.city && params.city !== 'All') {
    filtered = filtered.filter((e) => e.city.toLowerCase() === params.city?.toLowerCase());
  }

  // Price type filter
  if (params.priceType === 'free') {
    filtered = filtered.filter((e) => e.ticket_price === 0);
  } else if (params.priceType === 'paid') {
    filtered = filtered.filter((e) => e.ticket_price > 0);
  }

  // Date range filter
  if (params.startDate) {
    const startConstraint = new Date(params.startDate).getTime();
    filtered = filtered.filter((e) => new Date(e.start_datetime).getTime() >= startConstraint);
  }
  if (params.endDate) {
    const endConstraint = new Date(params.endDate).getTime();
    filtered = filtered.filter((e) => new Date(e.end_datetime).getTime() <= endConstraint);
  }

  // Sort
  if (params.sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (params.sortBy === 'popular') {
    filtered.sort((a, b) => b.views_count - a.views_count);
  } else {
    // Default: 'soonest'
    filtered.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
  }

  const total = filtered.length;

  if (params.limit) {
    const page = params.page || 1;
    const startIndex = (page - 1) * params.limit;
    filtered = filtered.slice(startIndex, startIndex + params.limit);
  }

  return { events: filtered, total };
}

/**
 * Get an event by its slug.
 * Public visitors can access published and expired events.
 */
export function getEventBySlug(slug: string): EventItem | null {
  const event = inMemoryEvents.find((e) => e.slug === slug);
  if (!event) return null;

  // If published but expired, update its runtime status flag
  if (event.status === 'published' && isEventExpired(event.end_datetime)) {
    event.status = 'expired';
  }

  return event;
}

/**
 * Get similar upcoming events for the detail page
 */
export function getSimilarUpcomingEvents(currentEventId: string, category: string, limit = 3): EventItem[] {
  const { events } = getEligibleUpcomingEvents({ category });
  return events.filter((e) => e.id !== currentEventId).slice(0, limit);
}

/**
 * Student Application & Opportunity Saves
 */
export function getStudentSaves(userId: string = 'current-student'): EventSaveItem[] {
  return inMemorySaves
    .filter((s) => s.user_id === userId)
    .map((s) => {
      const event = inMemoryEvents.find((e) => e.id === s.event_id);
      return { ...s, event };
    });
}

export function saveOpportunity(
  eventId: string,
  userId: string = 'current-student',
  initialStatus: ApplicationStatus = 'saved'
): EventSaveItem {
  const existing = inMemorySaves.find((s) => s.user_id === userId && s.event_id === eventId);
  if (existing) {
    return existing;
  }

  const newSave: EventSaveItem = {
    id: `save-${Date.now()}`,
    user_id: userId,
    event_id: eventId,
    status: initialStatus,
    notes: '',
    deadline_reminder: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemorySaves.push(newSave);
  return newSave;
}

export function updateOpportunityStatus(
  saveId: string,
  status: ApplicationStatus,
  notes?: string
): boolean {
  const save = inMemorySaves.find((s) => s.id === saveId);
  if (!save) return false;
  save.status = status;
  if (notes !== undefined) save.notes = notes;
  save.updated_at = new Date().toISOString();
  return true;
}

export function removeSavedOpportunity(saveId: string): boolean {
  const index = inMemorySaves.findIndex((s) => s.id === saveId);
  if (index === -1) return false;
  inMemorySaves.splice(index, 1);
  return true;
}

/**
 * Organizer Events
 */
export function getOrganizerEvents(organizerId: string = 'current-user'): EventItem[] {
  return inMemoryEvents.filter((e) => e.organizer_id === organizerId || e.organizer_id === 'org-iubat-cse');
}

export function addEvent(event: Omit<EventItem, 'id' | 'created_at' | 'updated_at' | 'views_count'>): EventItem {
  const newEvent: EventItem = {
    ...event,
    id: `evt-${Date.now()}`,
    views_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inMemoryEvents.unshift(newEvent);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<EventItem>): EventItem | null {
  const idx = inMemoryEvents.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  inMemoryEvents[idx] = {
    ...inMemoryEvents[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return inMemoryEvents[idx];
}

/**
 * Admin Moderation
 */
export function getAllEventsForAdmin(): EventItem[] {
  return [...inMemoryEvents];
}

export function moderateEvent(id: string, status: EventStatus, is_featured?: boolean): EventItem | null {
  const evt = inMemoryEvents.find((e) => e.id === id);
  if (!evt) return null;
  evt.status = status;
  if (status === 'published' && !evt.published_at) {
    evt.published_at = new Date().toISOString();
  }
  if (status === 'cancelled' && !evt.cancelled_at) {
    evt.cancelled_at = new Date().toISOString();
  }
  if (typeof is_featured === 'boolean') {
    evt.is_featured = is_featured;
  }
  evt.updated_at = new Date().toISOString();
  return evt;
}
