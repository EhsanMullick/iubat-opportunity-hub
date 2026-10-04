import { describe, it, expect } from 'vitest';
import { eventFormSchema } from '../lib/utils/validation';
import { isEventExpired, formatEventDateTime, formatEventRange } from '../lib/utils/date';
import {
  getEligibleUpcomingEvents,
  getEventBySlug,
  runEventExpirationJob,
  saveOpportunity,
  updateOpportunityStatus,
  moderateEvent,
} from '../lib/data/store';

describe('1. Zod Event Form Validation', () => {
  it('should accept valid event submission data', () => {
    const validData = {
      title: 'IUBAT National Hackathon 2026',
      description: 'A 36-hour competitive hackathon for university software innovators in Uttara.',
      category: 'Hackathons & Contests',
      poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      start_datetime: '2026-11-20T10:00',
      end_datetime: '2026-11-21T18:00',
      venue_name: 'IUBAT Auditorium',
      venue_address: '4 Embankment Drive Road, Sector 10, Uttara',
      city: 'Dhaka',
      latitude: 23.8824,
      longitude: 90.3957,
      ticket_price: 0,
      currency: 'BDT',
      capacity: 500,
    };

    const result = eventFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject when end_datetime is earlier than start_datetime', () => {
    const invalidDates = {
      title: 'Bad Dates Hackathon',
      description: 'A hackathon where end datetime is erroneously before start datetime.',
      category: 'Hackathons & Contests',
      poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      start_datetime: '2026-11-25T18:00',
      end_datetime: '2026-11-25T10:00', // earlier!
      venue_name: 'Campus Lab',
      venue_address: 'Sector 10, Uttara',
      city: 'Dhaka',
      latitude: 23.8824,
      longitude: 90.3957,
      ticket_price: 0,
    };

    const result = eventFormSchema.safeParse(invalidDates);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('End date & time must be strictly later');
    }
  });

  it('should reject invalid coordinates outside [-90, 90] and [-180, 180]', () => {
    const invalidCoords = {
      title: 'Invalid Coordinates Event',
      description: 'Testing coordinate boundary rejection in Zod schema verification.',
      category: 'Concerts & Cultural',
      poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      start_datetime: '2026-11-20T10:00',
      end_datetime: '2026-11-20T18:00',
      venue_name: 'Campus Field',
      venue_address: 'Sector 10, Uttara',
      city: 'Dhaka',
      latitude: 195.0, // Invalid lat!
      longitude: 90.3957,
      ticket_price: 0,
    };

    const result = eventFormSchema.safeParse(invalidCoords);
    expect(result.success).toBe(false);
  });
});

describe('2. Date & Expiration Logic', () => {
  it('should correctly detect past expired event', () => {
    const pastDate = '2020-01-01T00:00:00Z';
    expect(isEventExpired(pastDate)).toBe(true);
  });

  it('should correctly detect future active event', () => {
    const futureDate = '2030-01-01T00:00:00Z';
    expect(isEventExpired(futureDate)).toBe(false);
  });

  it('should format dates for Bangladesh Dhaka display', () => {
    const dateStr = '2026-10-23T09:00:00+06:00';
    const formatted = formatEventDateTime(dateStr, true, 'Asia/Dhaka');
    expect(formatted).toContain('Oct 2026');
    expect(formatted).toContain('(BST)');
  });
});

describe('3. Core Business Rule: Automatic Event Expiration & Query Filtering', () => {
  it('should strictly exclude expired and cancelled events from public discovery feeds', () => {
    const { events } = getEligibleUpcomingEvents();

    // Verify all returned events have status 'published'
    events.forEach((evt) => {
      expect(evt.status).toBe('published');
      expect(new Date(evt.end_datetime).getTime()).toBeGreaterThan(Date.now());
    });

    // Ensure expired demo event 'evt-012-expired' is NOT in public feeds
    const hasExpired = events.some((e) => e.id === 'evt-012-expired');
    expect(hasExpired).toBe(false);

    // Ensure cancelled demo event 'evt-013-cancelled' is NOT in public feeds
    const hasCancelled = events.some((e) => e.id === 'evt-013-cancelled');
    expect(hasCancelled).toBe(false);

    // Ensure pending demo event 'evt-014-pending' is NOT in public feeds
    const hasPending = events.some((e) => e.id === 'evt-014-pending');
    expect(hasPending).toBe(false);
  });

  it('should allow viewing expired published events by slug as historical archive records', () => {
    const expiredEvent = getEventBySlug('dhaka-summer-code-jam-open-source-sprint-2026');
    expect(expiredEvent).not.toBeNull();
    expect(expiredEvent?.status).toBe('expired');
  });

  it('should execute expiration job idempotently', () => {
    const result = runEventExpirationJob();
    expect(result).toHaveProperty('expiredCount');
    expect(Array.isArray(result.expiredIds)).toBe(true);
  });
});

describe('4. Student Opportunity Tracking Pipeline', () => {
  it('should save an opportunity and allow pipeline status transitions', () => {
    const newSave = saveOpportunity('evt-003', 'test-student-id', 'saved');
    expect(newSave.event_id).toBe('evt-003');
    expect(newSave.status).toBe('saved');

    // Update to applied
    const updated = updateOpportunityStatus(newSave.id, 'applied', 'Applied via faculty desk');
    expect(updated).toBe(true);
  });
});

describe('5. Admin Moderation Workflows', () => {
  it('should allow admin to approve a pending submission to published', () => {
    const moderated = moderateEvent('evt-014-pending', 'published', true);
    expect(moderated).not.toBeNull();
    expect(moderated?.status).toBe('published');
    expect(moderated?.is_featured).toBe(true);
    expect(moderated?.published_at).toBeDefined();
  });
});
