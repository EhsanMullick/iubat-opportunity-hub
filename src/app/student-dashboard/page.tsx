'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Star,
  Ticket,
  MapPin,
  LogIn,
} from 'lucide-react';
import { EventSaveItem } from '@/types';
import { formatEventDateTime, isEventExpired } from '@/lib/utils/date';
import { createClient } from '@/lib/supabase/client';

export default function StudentDashboardPage() {
  const [saves, setSaves] = useState<EventSaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'interested' | 'going'>('all');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication
  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          fetchSaves();
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      } catch {
        setCurrentUser(null);
        setLoading(false);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  const fetchSaves = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/saves');
      if (res.ok) {
        const json = await res.json();
        setSaves(json.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (saveId: string, newStatus: 'interested' | 'going') => {
    try {
      const res = await fetch('/api/student/saves', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveId, status: newStatus }),
      });
      if (res.ok) {
        setSaves((prev) =>
          prev.map((s) => (s.id === saveId ? { ...s, status: newStatus } : s))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (saveId: string) => {
    if (!confirm('Remove this event from your list?')) return;
    try {
      const res = await fetch(`/api/student/saves?saveId=${saveId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSaves((prev) => prev.filter((s) => s.id !== saveId));
      }
    } catch {
      // ignore
    }
  };

  // Filter based on tab: "interested" includes 'interested' and legacy 'saved'; "going" includes 'going' and legacy 'applied'
  const isInterested = (status: string) => status === 'interested' || status === 'saved';
  const isGoing = (status: string) => status === 'going' || status === 'applied' || status === 'accepted';

  const filteredSaves = saves.filter((s) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'interested') return isInterested(s.status);
    if (activeTab === 'going') return isGoing(s.status);
    return true;
  });

  const interestedCount = saves.filter((s) => isInterested(s.status)).length;
  const goingCount = saves.filter((s) => isGoing(s.status)).length;

  // Unauthenticated view
  if (authChecked && !currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 shadow-glass border border-white/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Hub Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Student Hub is available exclusively for signed-in students. Sign in to save events, indicate interest, and mark events you are attending.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Student Account</span>
            </Link>
            <Link
              href="/signup"
              className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all text-center"
            >
              Don't have an account? Register Free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Student Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                IUBAT Student Hub
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Logged In
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your personalized space for events you are interested in and confirmed to attend across campus and Bangladesh.
            </p>
          </div>
        </div>

        <Link
          href="/events"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Explore More Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Two Main Cards: Interested & Going Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('interested')}
          className={`glass-card rounded-2xl p-5 text-left transition-all border ${
            activeTab === 'interested'
              ? 'ring-2 ring-indigo-500 bg-indigo-50/40 border-indigo-200'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700">
              <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              <span className="font-bold text-sm uppercase tracking-wider">Interested</span>
            </div>
            <span className="text-3xl font-black text-slate-950">{interestedCount}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Upcoming opportunities and workshops you bookmarked to keep on your radar.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('going')}
          className={`glass-card rounded-2xl p-5 text-left transition-all border ${
            activeTab === 'going'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/40 border-emerald-200'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <Ticket className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm uppercase tracking-wider">Going (Attending)</span>
            </div>
            <span className="text-3xl font-black text-slate-950">{goingCount}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Confirmed events, hackathons, and seminars you plan to physically or virtually attend.
          </p>
        </button>
      </div>

      {/* Tab Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Events ({saves.length})
        </button>
        <button
          onClick={() => setActiveTab('interested')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'interested'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Interested ({interestedCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('going')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'going'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Going ({goingCount})</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading && (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-sm">
            Loading your events...
          </div>
        )}

        {!loading && filteredSaves.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">
              No events in {activeTab === 'all' ? 'your list' : activeTab === 'interested' ? 'Interested' : 'Going'}
            </h3>
            <p className="text-xs text-slate-500">
              Explore upcoming university and national events, then click Interested or Going to save them here.
            </p>
            <Link
              href="/events"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
            >
              Browse Events
            </Link>
          </div>
        )}

        {!loading &&
          filteredSaves.map((save) => {
            const event = save.event;
            if (!event) return null;

            const isCurrentlyGoing = isGoing(save.status);
            const expired = isEventExpired(event.end_datetime);

            return (
              <div
                key={save.id}
                className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-slate-300 transition-all"
              >
                {/* Event Information */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {event.category}
                      </span>
                      {isCurrentlyGoing ? (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          <span>Going</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Interested</span>
                        </span>
                      )}
                      {expired && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          Ended
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/events/${event.slug}`}
                      className="font-bold text-base sm:text-lg text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                    >
                      {event.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {formatEventDateTime(event.start_datetime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {event.venue_name}, {event.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher & Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  {/* Toggle between Interested and Going */}
                  {isCurrentlyGoing ? (
                    <button
                      onClick={() => handleUpdateStatus(save.id, 'interested')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors"
                      title="Switch status to Interested"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Switch to Interested</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(save.id, 'going')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Confirm you are Going to this event"
                    >
                      <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark as Going</span>
                    </button>
                  )}

                  <Link
                    href={`/events/${event.slug}`}
                    className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="View Event Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(save.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                    title="Remove from Student Hub"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
