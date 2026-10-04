import React from 'react';
import Link from 'next/link';
import {
  Search,
  Compass,
  PlusCircle,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building,
  GraduationCap,
  BrainCircuit,
} from 'lucide-react';
import { getEligibleUpcomingEvents } from '@/lib/data/store';
import EventCard from '@/components/events/EventCard';
import dynamic from 'next/dynamic';

// Leaflet map must be dynamically imported on client
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-slate-100/60 animate-pulse flex items-center justify-center text-slate-400">
      Loading OpenStreetMap Interactive Discovery...
    </div>
  ),
});

export const revalidate = 60; // ISR cache revalidation

export default function HomePage() {
  const { events: allUpcoming } = getEligibleUpcomingEvents({ limit: 20 });

  // Featured upcoming
  const featuredEvents = allUpcoming.filter((e) => e.is_featured).slice(0, 3);

  // Happening soon (ordered by soonest start_datetime)
  const happeningSoon = [...allUpcoming]
    .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
    .slice(0, 6);

  // Events on IUBAT Campus
  const iubatCampusEvents = allUpcoming.filter((e) =>
    e.venue_name.toLowerCase().includes('iubat')
  );

  const categoriesList = [
    { name: 'Hackathons & Contests', count: '3 active', icon: BrainCircuit, color: 'from-purple-500 to-indigo-600' },
    { name: 'Seminars & Conferences', count: '4 active', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { name: 'Workshops & Training', count: '5 active', icon: Sparkles, color: 'from-blue-500 to-cyan-600' },
    { name: 'Career & Networking', count: '3 active', icon: Award, color: 'from-amber-500 to-orange-600' },
    { name: 'Concerts & Cultural', count: '2 active', icon: Calendar, color: 'from-pink-500 to-rose-600' },
    { name: 'Sports & Fitness', count: '2 active', icon: TrendingUp, color: 'from-red-500 to-amber-600' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* IUBAT Campus Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge text-xs font-extrabold shadow-sm border border-indigo-300/70 bg-white/90">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-900">IUBAT Opportunity Hub</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600">Uttara, Dhaka</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-black">100% Verified Programs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.12]">
            Discover What’s Happening{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Around You
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            The premier platform connecting university students, innovators, faculty clubs, and tech communities across Bangladesh. Discover hackathons, international conferences, job expos, cultural nights, and track your applications.
          </p>

          {/* Frosted Glass Search Bar */}
          <div className="max-w-3xl mx-auto pt-2">
            <form
              action="/events"
              method="GET"
              className="glass-panel p-3 rounded-2xl shadow-glass flex flex-col sm:flex-row items-center gap-2.5 border-2 border-white/90"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search events by title, keyword, or company..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/90 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="h-8 w-px bg-slate-300 hidden sm:block" />

              <div className="relative w-full sm:w-48">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                <select
                  name="city"
                  defaultValue="All"
                  aria-label="Filter by city"
                  className="w-full pl-9 pr-8 py-3 rounded-xl bg-white/90 text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Cities</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-95"
              >
                <span>Find Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
            <Link
              href="/events"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-white/90 hover:bg-white border border-slate-200 transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Explore All Events</span>
            </Link>

            <Link
              href="/ai-advisor"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Opportunity Matcher</span>
            </Link>

            <Link
              href="/dashboard/events/new"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100 transition-all border border-indigo-200/60 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish an Event</span>
            </Link>
          </div>

          {/* Eye-catching Live Metric Bar */}
          <div className="pt-6 flex items-center justify-center gap-6 sm:gap-12 flex-wrap text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              <span className="text-xs font-bold">14+ Verified Campus Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
              <span className="text-xs font-bold">Default Timezone: Asia/Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
              <span className="text-xs font-bold">Auto-Expired Business Rule Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Featured Opportunities
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Hand-picked marquee competitions, conferences, and festivals
              </p>
            </div>
            <Link
              href="/events"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Popular Categories Frosted Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Browse by Opportunity Domain
          </h2>
          <p className="text-sm text-slate-500">
            Tailored tracks for engineering, business, agriculture, arts, and competitive coding
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/events?category=${encodeURIComponent(cat.name)}`}
                className="glass-card rounded-2xl p-5 flex flex-col items-center text-center group transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Happening Soon Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Happening Soon in Dhaka
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Events with approaching dates — mark your calendars!
            </p>
          </div>
          <Link
            href="/events?sortBy=soonest"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>See Upcoming</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {happeningSoon.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* 5. Interactive Upcoming Events Map Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Interactive Event Discovery Map
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Pinpoint verified event venues across IUBAT Uttara campus and Greater Dhaka
              </p>
            </div>
            <Link
              href="/map"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <LeafletMap events={allUpcoming} />
          </div>
        </div>
      </section>

      {/* 6. IUBAT Campus Spotlight */}
      {iubatCampusEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="glass-panel-subtle rounded-3xl p-6 sm:p-8 border border-emerald-200/60 bg-gradient-to-r from-emerald-50/60 via-white/80 to-teal-50/60">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Live at IUBAT Uttara Campus
                  </h2>
                  <p className="text-xs text-slate-500">
                    4 Embankment Drive Road, Sector 10, Uttara Model Town
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {iubatCampusEvents.length} Events on Campus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {iubatCampusEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Organizer & Student Club Call-to-Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border-0 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              For Clubs, Faculties & Organizers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Hosting a Seminar, Hackathon, or Cultural Festival?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Reach thousands of students and professionals across Bangladesh. Enjoy automatic coordinate mapping, poster hosting, registration tracking, and verified organizer badges.
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <Link
                href="/dashboard/events/new"
                className="px-6 py-3 rounded-xl text-sm font-bold bg-white text-indigo-950 hover:bg-slate-100 transition-all shadow-lg active:scale-95"
              >
                Submit Event for Free
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 transition-all backdrop-blur-md"
              >
                Organizer Guidelines
              </Link>
            </div>
          </div>

          {/* Decorative graphic background element */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
            <Building className="w-80 h-80 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
