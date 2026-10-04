-- ==============================================================================
-- EVENTORA / IUBAT OPPORTUNITY HUB - DEMO SEED SCRIPT
-- Contains 14 realistic fictional events for local development and testing:
-- - 11 upcoming published events across Dhaka, Chittagong, Sylhet, and IUBAT
-- - 1 expired event ('Dhaka Summer Code Jam 2026')
-- - 1 cancelled event ('Metro Monsoon Soundfest Live 2026')
-- - 1 pending moderation event ('National AI in Medicine Poster Showcase')
-- ==============================================================================

-- 1. Insert Demo Profiles
INSERT INTO public.profiles (id, display_name, role, organizer_verified, department)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'IUBAT Computer Society', 'organizer', true, 'CSE'),
    ('a0000000-0000-0000-0000-000000000002', 'Bangladesh Tech Talent Network', 'organizer', true, 'Career Services'),
    ('a0000000-0000-0000-0000-000000000003', 'IUBAT Faculty of Agricultural Sciences', 'organizer', true, 'Agriculture'),
    ('a0000000-0000-0000-0000-000000000004', 'Bengal Cultural Society', 'organizer', true, 'Cultural Affairs'),
    ('a0000000-0000-0000-0000-000000000005', 'IUBAT Robotics Club', 'organizer', true, 'EEE & CSE'),
    ('a0000000-0000-0000-0000-000000000006', 'IUBAT Sports Club', 'organizer', true, 'Physical Education'),
    ('a0000000-0000-0000-0000-000000000007', 'IUBAT Business Society', 'organizer', true, 'BBA'),
    ('a0000000-0000-0000-0000-000000000008', 'IUBAT Tourism & Hospitality Club', 'organizer', true, 'CTHM'),
    ('a0000000-0000-0000-0000-000000000098', 'Ehsan Mullick (Platform Creator)', 'admin', true, 'Lead Architecture'),
    ('a0000000-0000-0000-0000-000000000099', 'Admin Moderator', 'admin', true, 'Administration')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Events
INSERT INTO public.events (
    id, organizer_id, title, slug, description, category, poster_url,
    start_datetime, end_datetime, timezone, venue_name, venue_address,
    city, country, latitude, longitude, registration_url, ticket_price,
    currency, capacity, contact_email, status, is_featured
) VALUES
-- 1. IUBAT National Hackathon 2026
(
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'IUBAT National Hackathon 2026: Code the Future',
    'iubat-national-hackathon-2026',
    'Join over 500+ passionate undergraduate developers, UI/UX designers, and problem solvers from all across Bangladesh for 36 hours of non-stop innovation! Tracks include Smart University, AI in Agriculture, and FinTech.',
    'Hackathons & Contests',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    '2026-10-23 09:00:00+06',
    '2026-10-24 21:00:00+06',
    'Asia/Dhaka',
    'IUBAT Open Amphitheater & Computing Labs',
    '4 Embankment Drive Road, Sector 10, Uttara Model Town',
    'Dhaka', 'Bangladesh', 23.8824, 90.3957,
    'https://hackathon.iubat.edu/register', 0, 'BDT', 600, 'cse.club@iubat.edu', 'published', true
),

-- 2. Dhaka Tech Career Summit
(
    'e0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Dhaka Tech Career Summit & Networking Expo',
    'dhaka-tech-career-summit-networking-expo',
    'Connect with hiring managers and CTOs from 40+ leading software companies, multinationals, and startups across Bangladesh. Walk-in interviews and portfolio reviews.',
    'Career & Networking',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    '2026-10-30 10:00:00+06',
    '2026-10-30 18:00:00+06',
    'Asia/Dhaka',
    'Bangabandhu International Conference Centre (BICC)',
    'Agargaon, Sher-E-Bangla Nagar',
    'Dhaka', 'Bangladesh', 23.7709, 90.3789,
    'https://dhakatechcareers.org', 250, 'BDT', 1500, 'careers@dhakatechcareers.org', 'published', true
),

-- 3. International Conference on Sustainable Agriculture
(
    'e0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'International Conference on Sustainable Agriculture & Green Tech',
    'international-conference-sustainable-agri-green-tech',
    'A 2-day multidisciplinary conference bringing together researchers, scientists, and climate innovators focusing on precision farming, soil organic health, and green technologies.',
    'Seminars & Conferences',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    '2026-11-05 09:30:00+06',
    '2026-11-06 17:00:00+06',
    'Asia/Dhaka',
    'IUBAT Conference Hall & Green Research Fields',
    '4 Embankment Drive Road, Sector 10, Uttara',
    'Dhaka', 'Bangladesh', 23.8824, 90.3957,
    'https://agritech.iubat.edu', 500, 'BDT', 350, 'agri.conference@iubat.edu', 'published', false
),

-- 4. Dhaka Autumn Classical & Folk Fusion Concert
(
    'e0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000004',
    'Dhaka Autumn Classical & Folk Fusion Concert',
    'dhaka-autumn-classical-folk-fusion-concert',
    'An enchanting evening celebrating Bengali folk traditions blended with acoustic fusion, Baul instruments, and student musicians.',
    'Concerts & Cultural',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    '2026-10-28 18:00:00+06',
    '2026-10-28 22:30:00+06',
    'Asia/Dhaka',
    'Rabindra Sarobar Open Stage',
    'Dhanmondi Lake, Road 8/A',
    'Dhaka', 'Bangladesh', 23.7508, 90.3753,
    'https://dhakafolkfest.org', 150, 'BDT', 1200, 'tickets@dhakafolkfest.org', 'published', true
),

-- 5. Inter-University Line Follower & Sumo Robotics Challenge
(
    'e0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000005',
    'Inter-University Line Follower & Sumo Robotics Challenge',
    'inter-university-robotics-sumo-challenge',
    'Autonomous robots engineered by university teams compete in high-speed obstacle tracks and heavyweight sumo rings.',
    'Hackathons & Contests',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    '2026-11-12 10:00:00+06',
    '2026-11-12 19:00:00+06',
    'Asia/Dhaka',
    'IUBAT Engineering Complex',
    'Sector 10, Uttara',
    'Dhaka', 'Bangladesh', 23.8824, 90.3957,
    'https://robotics.iubat.edu', 300, 'BDT', 400, 'robotics@iubat.edu', 'published', false
),

-- 6. Chittagong Developers Meetup: Cloud Native & AI Agents
(
    'e0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000002',
    'Chittagong Developers Meetup: Cloud Native & AI Agents',
    'chittagong-developers-meetup-cloud-ai-agents',
    'A technical evening exploring Kubernetes architectures, vector databases, and autonomous AI agents.',
    'Workshops & Training',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    '2026-11-18 16:00:00+06',
    '2026-11-18 20:30:00+06',
    'Asia/Dhaka',
    'Radisson Blu Chittagong Bay View',
    'SS Khaled Road, Lalkhan Bazar',
    'Chittagong', 'Bangladesh', 22.3475, 91.8123,
    'https://ctgdevs.com', 200, 'BDT', 250, 'contact@ctgdevs.com', 'published', false
),

-- 7. IUBAT Inter-Department Football League
(
    'e0000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000006',
    'IUBAT Inter-Department Champions Football League 2026',
    'iubat-inter-department-champions-football-league-2026',
    '16 department squads clash for the Vice-Chancellor Trophy at the central green turf.',
    'Sports & Fitness',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    '2026-11-20 14:00:00+06',
    '2026-11-22 19:00:00+06',
    'Asia/Dhaka',
    'IUBAT Central Sports Ground',
    'Sector 10, Uttara',
    'Dhaka', 'Bangladesh', 23.8824, 90.3957,
    NULL, 0, 'BDT', 2000, 'sports@iubat.edu', 'published', false
),

-- 8. National Student Case Competition
(
    'e0000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000007',
    'National Student Case Competition & Business Model Expo',
    'national-student-case-competition-business-model-expo',
    'Undergraduate business students solve complex market and financial crises evaluated by corporate directors.',
    'University & Club',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    '2026-11-27 09:00:00+06',
    '2026-11-27 18:00:00+06',
    'Asia/Dhaka',
    'IUBAT BBA Auditorium',
    'Sector 10, Uttara',
    'Dhaka', 'Bangladesh', 23.8824, 90.3957,
    'https://bba-case.iubat.edu', 0, 'BDT', 300, 'bba@iubat.edu', 'published', false
),

-- 9. Dhaka River Clean-up Volunteer Drive
(
    'e0000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000004',
    'Dhaka River Clean-up & Environmental Youth Volunteer Drive',
    'dhaka-river-cleanup-environmental-youth-drive',
    'Youth volunteer initiative to plant native trees and remove non-biodegradable waste along Turag river.',
    'Community & Social',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    '2026-12-05 08:00:00+06',
    '2026-12-05 13:00:00+06',
    'Asia/Dhaka',
    'Turag Riverfront Green Park',
    'Ashulia Embankment, Savar/Uttara',
    'Dhaka', 'Bangladesh', 23.8967, 90.3541,
    'https://ecoyouth.org.bd', 0, 'BDT', 500, 'volunteer@ecoyouth.org.bd', 'published', false
),

-- 10. Sylhet AI Symposium
(
    'e0000000-0000-0000-0000-000000000010',
    'a0000000-0000-0000-0000-000000000002',
    'Sylhet Artificial Intelligence & Machine Vision Symposium',
    'sylhet-ai-machine-vision-symposium',
    'Academic presentations on computer vision and diagnostic clinical neural networks.',
    'Seminars & Conferences',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    '2026-12-15 10:00:00+06',
    '2026-12-15 17:30:00+06',
    'Asia/Dhaka',
    'Sylhet Convention Hall',
    'Subidbazar Main Road',
    'Sylhet', 'Bangladesh', 24.8949, 91.8687,
    'https://sylhetai.org', 350, 'BDT', 220, 'symposium@sylhetai.org', 'published', false
),

-- 11. Hospitality & Tourism Career Showcase
(
    'e0000000-0000-0000-0000-000000000011',
    'a0000000-0000-0000-0000-000000000008',
    'Hospitality & Tourism Career Showcase: Connecting Global Hoteliers',
    'hospitality-tourism-career-showcase-2026',
    'Connecting graduating hospitality and tourism students with recruitment panels from premier international hotels.',
    'Career & Networking',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    '2026-12-20 10:00:00+06',
    '2026-12-20 17:00:00+06',
    'Asia/Dhaka',
    'IUBAT Tourism Training Lounge & Banquet Hall',
    'Sector 10, Uttara',
    'Dhaka', 'Bangladesh', 23.8824, 90.3957,
    NULL, 0, 'BDT', 250, 'cthm@iubat.edu', 'published', false
),

-- 12. EXPIRED EVENT (Historical Record, automatically excluded from discovery feeds)
(
    'e0000000-0000-0000-0000-000000000012',
    'a0000000-0000-0000-0000-000000000001',
    'Dhaka Summer Code Jam & Open Source Sprint 2026',
    'dhaka-summer-code-jam-open-source-sprint-2026',
    'Historical record: A 48-hour competitive sprint focused on contributing bug fixes and enhancements to popular global open-source libraries. This event ended in August 2026.',
    'Hackathons & Contests',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    '2026-08-14 09:00:00+06',
    '2026-08-16 18:00:00+06',
    'Asia/Dhaka',
    'Dhanmondi IT Innovation Lab',
    'Road 27, Dhanmondi',
    'Dhaka', 'Bangladesh', 23.7548, 90.3725,
    NULL, 0, 'BDT', 200, NULL, 'expired', false
),

-- 13. CANCELLED EVENT
(
    'e0000000-0000-0000-0000-000000000013',
    'a0000000-0000-0000-0000-000000000004',
    'Metro Monsoon Soundfest Live 2026',
    'metro-monsoon-soundfest-live-2026',
    'Notice: This event was cancelled by organizers due to heavy monsoon weather forecasts.',
    'Concerts & Cultural',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    '2026-11-10 17:00:00+06',
    '2026-11-10 23:00:00+06',
    'Asia/Dhaka',
    'Army Stadium',
    'Airport Road, Banani',
    'Dhaka', 'Bangladesh', 23.8115, 90.4072,
    NULL, 800, 'BDT', 5000, NULL, 'cancelled', false
),

-- 14. PENDING MODERATION EVENT
(
    'e0000000-0000-0000-0000-000000000014',
    'a0000000-0000-0000-0000-000000000001',
    'National AI in Medicine & Clinical Health Poster Showcase 2026',
    'national-ai-medicine-clinical-health-poster-showcase-2026',
    'Submitted for moderation review: An inter-university poster presentation highlighting automated radiological diagnosis and telemedicine in rural clinics.',
    'Seminars & Conferences',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    '2026-11-28 09:30:00+06',
    '2026-11-28 16:00:00+06',
    'Asia/Dhaka',
    'Uttara Health Science Complex',
    'Sector 3, Uttara',
    'Dhaka', 'Bangladesh', 23.8687, 90.3984,
    NULL, 100, 'BDT', 180, 'medtech@studentorg.org', 'pending_review', false
)
ON CONFLICT (id) DO NOTHING;
