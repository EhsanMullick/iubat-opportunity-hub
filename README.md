# Eventora — IUBAT Opportunity Hub 🎓✨

> **Universal Event & Opportunity Discovery Platform with Frosted Glass (Glassmorphism) UI/UX, Built for IUBAT Students, Organizers, and Communities across Bangladesh.**

---

## 🌟 Overview & Product Vision

**Eventora — IUBAT Opportunity Hub** is a full-stack, production-grade web application engineered to bridge the gap between academic learning and real-world opportunities. It empowers university students, student clubs (CSE Club, Robotics Club, Business Society, Cultural Club, Sports Club), faculty departments, tech communities, and external companies across Bangladesh to publish and discover upcoming events.

### Supported Event Types:
- **Hackathons & Programming Contests** (IUBAT National Hackathon, Dev Sprints)
- **Seminars & Academic Conferences** (Sustainable Agriculture, AI Research, Green Computing)
- **Workshops & Technical Training** (Cloud Native, Autonomous Agents, UI/UX Bootcamps)
- **Career Fairs & Networking Expos** (Dhaka Tech Career Summit, Hospitality Showcases)
- **Concerts & Cultural Programs** (Classical Folk Fusion, Drama Nights)
- **Inter-University & Campus Sports** (Vice-Chancellor Champions Football League)
- **Community Volunteering & Youth Drives** (River Cleanup, Tree Plantation)

---

## 💎 Design Direction: Frosted Glass (Glassmorphism) UI/UX

The interface features an editorial glassmorphic visual language:
- **Frosted Glass Panels & Cards**: Layered backdrops with `backdrop-filter: blur(16px)`, `rgba(255, 255, 255, 0.75)` translucency, and crisp subtle borders (`1px solid rgba(255, 255, 255, 0.7)`).
- **Luminous Accent Palette**: Deep Indigo (`#4338ca`) and Violet accents paired with emerald success badges and ambient radial blur glow spheres.
- **Micro-Interactions**: Smooth card lifts (`translateY(-3px)`), active press animations, and responsive navigation drawers.
- **Responsive & Accessible**: Strict contrast ratios, keyboard accessibility, clear error boundaries, and mobile list/map toggles.

---

## ⚡ Key Features

### 1. Bangladesh-First & Authoritative Event Expiration
- **Default Timezone**: `Asia/Dhaka` (`BST`, UTC+6).
- **Core Business Rule**: Expired events (`end_datetime < NOW()`) are automatically and idempotently removed from all upcoming public discovery surfaces, homepages, search results, category pages, and map views.
- **Historical Integrity**: Expired events are **never physically deleted** from PostgreSQL. Their dedicated detail URL `/events/[slug]` remains accessible with an informative **"Event Ended"** badge for archival reference and resume portfolio validation.
- **Dual Expiration Mechanism**:
  1. Primary enforcement via database queries (`status = 'published' AND end_datetime > NOW()`).
  2. Scheduled background worker via `/api/cron/expire-events` or PostgreSQL `pg_cron` stored procedure.

### 2. Personal Student Opportunity & Deadline Tracker (`/student-dashboard`)
- IUBAT students can bookmark opportunities with one click.
- **Application Pipeline**: Track progress through stages:
  `Saved` ➔ `Applied` ➔ `Interviewing / Round 2` ➔ `Accepted / Winner` ➔ `Rejected`
- **Deadline Radar**: Live relative countdown badges (e.g., *"in 3 days"*, *"approaching soon"*).
- **Custom Student Notes**: Keep team rosters, checklist items, and interview prep notes directly attached to opportunities.

### 3. In-App AI Career & Opportunity Matcher (`/ai-advisor`)
- Tailored for IUBAT departments: BCSE, BBA, BSAg (Agriculture), BSEEE, BSCE, BSME, BATHM (Tourism & Hospitality), English, Economics.
- Students input verified skills, interests, and career ambitions.
- Powered by **AI Gateway / Gemini Model** with intelligent deterministic semantic matching fallback.
- Computes percentage match scores (`95% Match`), pinpoints skill overlaps, and provides personalized explanations for why an opportunity fits the student's trajectory.

### 4. Interactive OpenStreetMap & Leaflet Discovery (`/map`)
- Dedicated map view with custom markers for all upcoming venues across Dhaka, Chittagong, Sylhet, and the IUBAT campus.
- Popups featuring poster thumbnails, date, venue, ticket price, and direct detail links.
- Real-time category and date filtering.
- Synchronized dual-pane event list on desktop with mobile-friendly list/map toggle.

### 5. Organizer & Club Hub (`/dashboard`)
- Create new events with client & server-side **Zod** schema validation.
- **Interactive OpenStreetMap Coordinate Picker**: Click or drag pins to select exact venue latitude and longitude.
- Moderation workflow: New public submissions enter `pending_review` status.
- Real-time view counts, engagement tracking, and single-click public URL copying.

### 6. Admin Moderation Portal (`/admin`)
- Review submissions queue: Approve & Publish or Reject with one click.
- Toggle `is_featured` badges for marquee university opportunities.
- Manual trigger for the database auto-expiration worker.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript (Strict Mode)](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Frosted Glass tokens
- **Maps**: [Leaflet](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/)
- **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/) & Supabase Auth
- **Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- Git

### 2. Installation
```bash
git clone https://github.com/your-username/iubat-opportunity-hub.git
cd iubat-opportunity-hub
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=your-secure-random-cron-secret
AI_GATEWAY_API_KEY=your-optional-gemini-key
```
*(Note: If you run locally without connecting a Supabase project, the app seamlessly uses its integrated in-memory data store loaded with 14 demo events!)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Run the test suite:
```bash
npm test
```
The test suite validates:
- Zod schema validation (title bounds, coordinate ranges, date constraints)
- Date formatting and timezone conversion for `Asia/Dhaka`
- Core business rule: Expiration logic and automatic exclusion of expired/cancelled events from public feeds
- Historical slug preservation for expired records
- Student application pipeline transitions
- Admin approval moderation workflows

---

## 🗄️ Database Architecture & Migrations

The database migration is located at:
`supabase/migrations/20261004_initial_schema.sql`

Demo seed data is located at:
`supabase/seed.sql`

### Tables:
1. `profiles`: User information, student ID, department, skills, and role (`user`, `organizer`, `admin`).
2. `events`: Primary events table with coordinates, price, timestamps, category, and status.
3. `event_saves`: Student application pipeline tracker (`saved`, `applied`, `interviewing`, `accepted`, `rejected`) and notes.
4. `event_reports`: Moderation reports for flagged events.

### Running Migrations in Supabase:
1. Navigate to your Supabase project's **SQL Editor**.
2. Run the SQL from `supabase/migrations/20261004_initial_schema.sql`.
3. Run the SQL from `supabase/seed.sql` to populate sample events.

### Setting Up the Scheduled Expiration Job:
#### Option A: Supabase `pg_cron` (Database native)
In Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('expire-events-hourly', '*/15 * * * *', 'SELECT public.expire_past_events()');
```

#### Option B: Vercel Cron (HTTP endpoint)
Add a `vercel.json` file in the root:
```json
{
  "crons": [
    {
      "path": "/api/cron/expire-events",
      "schedule": "0 * * * *"
    }
  ]
}
```
Set the `CRON_SECRET` environment variable in your Vercel project settings.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Eventora IUBAT Opportunity Hub platform"
   git push origin main
   ```
2. In [Vercel](https://vercel.com/):
   - Import the repository.
   - Configure the Environment Variables from `.env.example`.
   - Click **Deploy**.

---

## 📜 License & Copyright
Developed for **IUBAT — International University of Business Agriculture and Technology**, Dhaka, Bangladesh.
Distributed under the MIT License.
