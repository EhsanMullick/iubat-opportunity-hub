'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Compass,
  MapPin,
  Sparkles,
  BookmarkCheck,
  PlusCircle,
  Menu,
  X,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/events', label: 'Explore Events', icon: Compass },
    { href: '/map', label: 'Map Discovery', icon: MapPin },
    { href: '/student-dashboard', label: 'Student Hub', icon: BookmarkCheck, badge: 'Tracker' },
    { href: '/ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'AI' },
    { href: '/dashboard', label: 'Organizer', icon: Calendar },
    { href: '/admin', label: 'Admin', icon: ShieldAlert },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3 transition-all duration-200">
      <nav className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-glass">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Eventora
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                IUBAT HUB
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-none">
              Universal Opportunity & Event Discovery
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  active
                    ? 'text-indigo-600 bg-indigo-50/80 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      item.badge === 'AI'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xs'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard/events/new"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Event</span>
          </Link>
          <Link
            href="/login"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/60 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto glass-panel rounded-2xl p-4 shadow-xl border border-white/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                    active ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-200/60 flex flex-col gap-2">
              <Link
                href="/dashboard/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
              >
                Publish an Event
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign In / Student Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
