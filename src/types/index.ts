export type EventCategory =
  | 'Concerts & Cultural'
  | 'Seminars & Conferences'
  | 'Workshops & Training'
  | 'Hackathons & Contests'
  | 'University & Club'
  | 'Career & Networking'
  | 'Sports & Fitness'
  | 'Community & Social';

export type EventStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'rejected'
  | 'cancelled'
  | 'expired';

export type UserRole = 'user' | 'organizer' | 'admin';

export type AttendanceStatus = 'interested' | 'going';

export type ApplicationStatus =
  | 'interested'
  | 'going'
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'accepted'
  | 'rejected';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  organizer_verified: boolean;
  student_id?: string;
  department?: string;
  skills: string[];
  interests: string[];
  career_goals?: string;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  organizer_id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  poster_url: string;
  start_datetime: string; // ISO 8601 (timestamptz)
  end_datetime: string;   // ISO 8601 (timestamptz)
  timezone: string;       // e.g. 'Asia/Dhaka'
  venue_name: string;
  venue_address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  registration_url?: string;
  ticket_price: number;
  currency: string;
  capacity?: number;
  contact_email?: string;
  contact_url?: string;
  status: EventStatus;
  is_featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  cancelled_at?: string;
  organizer?: {
    display_name: string;
    avatar_url?: string;
    organizer_verified?: boolean;
  };
}

export interface EventSaveItem {
  id: string;
  user_id: string;
  event_id: string;
  status: ApplicationStatus;
  notes?: string;
  deadline_reminder: boolean;
  created_at: string;
  updated_at: string;
  event?: EventItem;
}

export interface EventFilterParams {
  search?: string;
  category?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  priceType?: 'all' | 'free' | 'paid';
  sortBy?: 'soonest' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface RecommendationResult {
  event: EventItem;
  matchScore: number; // 0 - 100%
  reasons: string[];
  skillAlignment: string[];
}
