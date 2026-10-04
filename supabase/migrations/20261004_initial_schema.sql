-- ==============================================================================
-- EVENTORA / IUBAT OPPORTUNITY HUB - DATABASE INITIALIZATION SCHEMA
-- Complete normalized schema with constraints, indexes, RLS, and expiration job
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
    organizer_verified BOOLEAN NOT NULL DEFAULT FALSE,
    student_id TEXT,
    department TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    career_goals TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Concerts & Cultural',
        'Seminars & Conferences',
        'Workshops & Training',
        'Hackathons & Contests',
        'University & Club',
        'Career & Networking',
        'Sports & Fitness',
        'Community & Social'
    )),
    poster_url TEXT NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Dhaka',
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    latitude NUMERIC(10, 7) NOT NULL CHECK (latitude >= -90.0 AND latitude <= 90.0),
    longitude NUMERIC(10, 7) NOT NULL CHECK (longitude >= -180.0 AND longitude <= 180.0),
    registration_url TEXT,
    ticket_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (ticket_price >= 0),
    currency TEXT NOT NULL DEFAULT 'BDT',
    capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
    contact_email TEXT,
    contact_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN (
        'draft',
        'pending_review',
        'published',
        'rejected',
        'cancelled',
        'expired'
    )),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INTEGER NOT NULL DEFAULT 0 CHECK (views_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    published_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    CONSTRAINT chk_event_dates CHECK (end_datetime > start_datetime)
);

-- 4. Event Saves & Student Application Tracker Table
CREATE TABLE IF NOT EXISTS public.event_saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN (
        'saved',
        'applied',
        'interviewing',
        'accepted',
        'rejected'
    )),
    notes TEXT,
    deadline_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_user_event_save UNIQUE (user_id, event_id)
);

-- 5. Event Reports Table
CREATE TABLE IF NOT EXISTS public.event_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'reviewed',
        'dismissed',
        'action_taken'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_events_published_upcoming 
ON public.events (start_datetime ASC, end_datetime ASC) 
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_events_category 
ON public.events (category) 
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_events_city 
ON public.events (city) 
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_events_slug 
ON public.events (slug);

CREATE INDEX IF NOT EXISTS idx_events_organizer 
ON public.events (organizer_id);

CREATE INDEX IF NOT EXISTS idx_events_is_featured 
ON public.events (is_featured) 
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_event_saves_user 
ON public.event_saves (user_id);

CREATE INDEX IF NOT EXISTS idx_event_saves_event 
ON public.event_saves (event_id);

CREATE INDEX IF NOT EXISTS idx_events_search_tsv 
ON public.events USING GIN (to_tsvector('english', title || ' ' || description || ' ' || venue_name || ' ' || city));

-- ==============================================================================
-- AUTOMATIC EXPIRATION STORED PROCEDURE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.expire_past_events()
RETURNS integer AS $$
DECLARE
    updated_count integer;
BEGIN
    UPDATE public.events
    SET status = 'expired',
        updated_at = timezone('utc', now())
    WHERE status = 'published' 
      AND end_datetime < timezone('utc', now());
      
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_event_saves_updated_at ON public.event_saves;
CREATE TRIGGER trg_event_saves_updated_at
BEFORE UPDATE ON public.event_saves
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Auto create profile on auth signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url, role, organizer_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        -- Automatically provision platform creator Ehsan Mullick as Master Admin
        CASE 
            WHEN LOWER(NEW.email) = 'em.uha.36@gmail.com' THEN 'admin'
            ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'user')
        END,
        CASE 
            WHEN LOWER(NEW.email) = 'em.uha.36@gmail.com' THEN TRUE
            ELSE FALSE
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        role = CASE WHEN LOWER(NEW.email) = 'em.uha.36@gmail.com' THEN 'admin' ELSE profiles.role END,
        organizer_verified = CASE WHEN LOWER(NEW.email) = 'em.uha.36@gmail.com' THEN TRUE ELSE profiles.organizer_verified END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reports ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- 1. Anyone can view public profile info
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- 2. Users can update their own profile, BUT cannot self-promote to admin or verified
CREATE POLICY "Users can update own profile without privilege escalation" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND organizer_verified = (SELECT organizer_verified FROM public.profiles WHERE id = auth.uid())
);

-- 3. Admins can update any profile
CREATE POLICY "Admins have full access to profiles" 
ON public.profiles FOR ALL 
TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- EVENTS POLICIES
-- 1. Public visitors can view only published, non-expired events on public feeds
-- (Expired events can be viewed by slug for historical record if published)
CREATE POLICY "Public can view published events" 
ON public.events FOR SELECT 
USING (
    status = 'published' OR status = 'expired'
);

-- 2. Organizers can view their own events regardless of status
CREATE POLICY "Organizers can view own events" 
ON public.events FOR SELECT 
TO authenticated 
USING (
    organizer_id = auth.uid()
);

-- 3. Authenticated users can insert events (defaults to pending_review)
CREATE POLICY "Authenticated users can submit events" 
ON public.events FOR INSERT 
TO authenticated 
WITH CHECK (
    organizer_id = auth.uid() 
    AND status IN ('draft', 'pending_review')
    AND is_featured = FALSE
);

-- 4. Organizers can update their own events (draft, pending, or published)
CREATE POLICY "Organizers can update own events" 
ON public.events FOR UPDATE 
TO authenticated 
USING (organizer_id = auth.uid())
WITH CHECK (
    organizer_id = auth.uid()
    AND is_featured = (SELECT is_featured FROM public.events WHERE id = events.id)
);

-- 5. Organizers can cancel or delete own draft events
CREATE POLICY "Organizers can delete own draft events" 
ON public.events FOR DELETE 
TO authenticated 
USING (
    organizer_id = auth.uid() AND status IN ('draft', 'pending_review')
);

-- 6. Admins can perform any action on events
CREATE POLICY "Admins have full control on events" 
ON public.events FOR ALL 
TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- EVENT_SAVES (APPLICATION TRACKER) POLICIES
CREATE POLICY "Users can view own saved events" 
ON public.event_saves FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can create own saved events" 
ON public.event_saves FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own saved events" 
ON public.event_saves FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own saved events" 
ON public.event_saves FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- EVENT_REPORTS POLICIES
CREATE POLICY "Authenticated users can report events" 
ON public.event_reports FOR INSERT 
TO authenticated 
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can view and manage event reports" 
ON public.event_reports FOR ALL 
TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('event-posters', 'event-posters', true)
-- ON CONFLICT (id) DO NOTHING;
