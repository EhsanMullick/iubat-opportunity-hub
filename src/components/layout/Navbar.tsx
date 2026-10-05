'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  Compass,
  MapPin,
  Sparkles,
  BookmarkCheck,
  PlusCircle,
  Menu,
  X,
  GraduationCap,
  Clock,
  CheckCircle2,
  User,
  LogOut,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);

  // Clock in Asia/Dhaka
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Check Supabase authentication state
  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email || '';
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.display_name ||
            email.split('@')[0];
          const isMasterAdmin =
            email.toLowerCase().includes('em.uha.36') ||
            session.user.user_metadata?.role === 'admin';

          setCurrentUser({
            id: session.user.id,
            email,
            name,
            role: isMasterAdmin ? 'admin' : (session.user.user_metadata?.role || 'user'),
          });
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.display_name ||
          email.split('@')[0];
        const isMasterAdmin =
          email.toLowerCase().includes('em.uha.36') ||
          session.user.user_metadata?.role === 'admin';

        setCurrentUser({
          id: session.user.id,
          email,
          name,
          role: isMasterAdmin ? 'admin' : (session.user.user_metadata?.role || 'user'),
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  // Public base navigation links - Student Hub is ONLY visible when user is logged in
  const baseLinks = [
    { href: '/events', label: 'Explore Events', icon: Compass },
    { href: '/map', label: 'Map Discovery', icon: MapPin },
    {
      href: '/ai-advisor',
      label: 'AI Advisor',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    { href: '/dashboard', label: 'Organizer', icon: Calendar },
  ];

  // If user is logged in, include Student Hub (Interested & Going)
  const navLinks = currentUser
    ? [
        { href: '/events', label: 'Explore Events', icon: Compass },
        { href: '/map', label: 'Map Discovery', icon: MapPin },
        {
          href: '/student-dashboard',
          label: 'Student Hub',
          icon: BookmarkCheck,
        },
        {
          href: '/ai-advisor',
          label: 'AI Advisor',
          icon: Sparkles,
          badge: 'AI',
          badgeColor: 'bg-purple-100 text-purple-800',
        },
        { href: '/dashboard', label: 'Organizer', icon: Calendar },
      ]
    : baseLinks;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 py-3 transition-all duration-200">
      <nav className="max-w-7xl mx-auto glass-panel rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-glass border-2 border-white/95">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform shrink-0 ring-2 ring-white">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-xl lg:text-2xl text-slate-950 tracking-tight leading-none drop-shadow-xs">
                IUBAT Opportunity Hub
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs tracking-wider hidden sm:inline-block">
                Eventora
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] sm:text-xs font-bold text-indigo-700 leading-tight">
                Universal Campus & National Platform
              </p>
              {currentTimeStr && (
                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100/90 px-2 py-0.2 rounded-full">
                  <Clock className="w-2.5 h-2.5 text-indigo-600" />
                  <span>{currentTimeStr} BST</span>
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Center Desktop Navigation Links (Admin option excluded from public) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/60 p-1 rounded-full border border-slate-200/50">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/25'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
                      active ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Only render Admin Console link if authenticated admin user is signed in */}
          {currentUser?.role === 'admin' && (
            <Link
              href="/admin"
              className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'text-white bg-slate-900 shadow-md'
                  : 'text-slate-900 hover:bg-slate-200/80 bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>

        {/* Right Actions: Clean Organization with proper spacing, Publish Event, Sign In, and Sign Up */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">

          {/* Publish Event Primary Action */}
          <Link
            href="/dashboard/events/new"
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/25 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Event</span>
          </Link>

          {/* Clear Visual Divider between Publish Event and Auth Group */}
          <div className="h-6 w-px bg-slate-300/80 mx-1 hidden sm:block" />

          {/* Authentication Actions Group */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={
                  currentUser.role === 'admin'
                    ? '/admin'
                    : currentUser.role === 'organizer'
                    ? '/dashboard'
                    : '/student-dashboard'
                }
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[110px] truncate">{currentUser.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-200 text-indigo-900 font-extrabold uppercase">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'organizer' ? 'Club' : 'Student'}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200/70"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-white transition-colors border border-slate-200/80 bg-white/70 shadow-xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto glass-panel rounded-2xl p-4 shadow-2xl border-2 border-white/95 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                    active ? 'text-white bg-indigo-600' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Authenticated Admin link only */}
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 bg-slate-900 text-white"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Console</span>
              </Link>
            )}


            {/* Mobile Action Buttons */}
            <div className="pt-3 mt-2 border-t border-slate-200/60 flex flex-col gap-2">
              <Link
                href="/dashboard/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish an Event</span>
              </Link>

              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({currentUser.name})</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 border border-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
