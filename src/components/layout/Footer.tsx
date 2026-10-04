import React from 'react';
import Link from 'next/link';
import { GraduationCap, Heart, MapPin, Globe, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-slate-200/80 bg-white/50 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Eventora
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>IUBAT Opportunity Hub</strong> is the dedicated universal gateway for students, tech clubs, researchers, and event organizers across Bangladesh to discover, publish, and track life-changing opportunities.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Standard Time: Asia/Dhaka (UTC+6)</span>
            </div>
          </div>

          {/* Column 2: Event Categories */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Explore by Category
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/events?category=Hackathons+%26+Contests" className="hover:text-indigo-600 transition-colors">
                  Hackathons & Contests
                </Link>
              </li>
              <li>
                <Link href="/events?category=Seminars+%26+Conferences" className="hover:text-indigo-600 transition-colors">
                  Seminars & Conferences
                </Link>
              </li>
              <li>
                <Link href="/events?category=Career+%26+Networking" className="hover:text-indigo-600 transition-colors">
                  Career Fairs & Expos
                </Link>
              </li>
              <li>
                <Link href="/events?category=Workshops+%26+Training" className="hover:text-indigo-600 transition-colors">
                  Workshops & Bootcamps
                </Link>
              </li>
              <li>
                <Link href="/events?category=Concerts+%26+Cultural" className="hover:text-indigo-600 transition-colors">
                  Concerts & Cultural Fests
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Tools */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Student & Organizer Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/student-dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <span>Student Application Tracker</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">New</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-advisor" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <span>AI Career Opportunity Matcher</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-indigo-600 transition-colors">
                  Interactive OpenStreetMap View
                </Link>
              </li>
              <li>
                <Link href="/dashboard/events/new" className="hover:text-indigo-600 transition-colors">
                  Submit Event for Review
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">
                  Admin Moderation Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: IUBAT Campus & Contacts */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Campus Headquarters
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>4 Embankment Drive Road, Sector 10, Uttara Model Town, Dhaka 1230, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <a href="mailto:info@iubat.edu" className="hover:underline">info@iubat.edu</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>+880 2 55091801-5</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://iubat.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  <span>Visit Official University Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright, credit & legal */}
        <div className="mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Eventora — IUBAT Opportunity Hub. Engineered for students and organizers.</p>
            <p className="font-bold text-indigo-600 tracking-wide">
              All credit goes to Ehsan Mullick
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <span className="flex items-center gap-1 text-slate-500">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for IUBATians
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
