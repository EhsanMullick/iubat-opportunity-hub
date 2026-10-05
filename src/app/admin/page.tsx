'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  Clock,
  Eye,
  AlertTriangle,
  ExternalLink,
  Users,
  Award,
  Layers,
  ShieldCheck,
  Mail,
  Phone,
} from 'lucide-react';
import { EventItem, EventStatus } from '@/types';
import { formatEventDateTime, isEventExpired } from '@/lib/utils/date';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningJob, setRunningJob] = useState(false);
  const [cronFeedback, setCronFeedback] = useState<string | null>(null);

  const fetchAdminEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?limit=100');
      if (res.ok) {
        const json = await res.json();
        setEvents(json.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const handleModerateStatus = async (eventId: string, newStatus: EventStatus) => {
    try {
      const res = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleToggleFeatured = async (eventId: string, currentState: boolean) => {
    try {
      const res = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !currentState }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, is_featured: !currentState } : e))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleTriggerExpirationJob = async () => {
    setRunningJob(true);
    setCronFeedback(null);
    try {
      const res = await fetch('/api/cron/expire-events', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer dev-cron-secret-key-12345',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCronFeedback(
          `Success: Processed database. ${data.expiredCount} event(s) reached expiration threshold.`
        );
        fetchAdminEvents();
      } else {
        setCronFeedback(`Error: ${data.error}`);
      }
    } catch {
      setCronFeedback('Failed to execute expiration endpoint.');
    } finally {
      setRunningJob(false);
    }
  };

  // Metrics
  const publishedCount = events.filter((e) => e.status === 'published').length;
  const pendingCount = events.filter((e) => e.status === 'pending_review').length;
  const expiredCount = events.filter((e) => e.status === 'expired' || isEventExpired(e.end_datetime)).length;
  const pendingSubmissions = events.filter((e) => e.status === 'pending_review');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-lg shadow-indigo-950/20 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                System Administrator Console
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Admin Role
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review public submissions, moderate content, feature marquee events, and execute database maintenance jobs.
            </p>
          </div>
        </div>

        {/* Trigger Cron Background Job */}
        <button
          onClick={handleTriggerExpirationJob}
          disabled={runningJob}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${runningJob ? 'animate-spin' : ''}`} />
          <span>Run Auto-Expiration Job</span>
        </button>
      </div>

      {cronFeedback && (
        <div className="glass-panel p-4 rounded-2xl border-indigo-200 bg-indigo-50/80 text-indigo-900 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>{cronFeedback}</span>
        </div>
      )}

      {/* Creator & Master Administrator Ownership Card */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-indigo-200/90 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Platform Creator & Master Admin
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Verified Owner
                </span>
              </div>
              <h2 className="text-xl font-black text-white">Ehsan Mullick</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="mailto:em.uha.36@gmail.com"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-300" />
              <span>em.uha.36@gmail.com</span>
            </a>
            <a
              href="https://wa.me/8801703186195"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-xs font-semibold text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>01703186195</span>
            </a>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border-emerald-200/50">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Live Published
          </span>
          <div className="text-3xl font-black text-emerald-900 mt-1">{publishedCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-amber-200/50">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Pending Review
          </span>
          <div className="text-3xl font-black text-amber-900 mt-1">{pendingCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-slate-200/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Archived / Expired
          </span>
          <div className="text-3xl font-black text-slate-800 mt-1">{expiredCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-indigo-200/50">
          <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
            Active Organizers
          </span>
          <div className="text-3xl font-black text-indigo-900 mt-1">12</div>
        </div>
      </div>

      {/* Pending Moderation Queue */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Pending Submissions Queue ({pendingSubmissions.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Requires Admin Approval</span>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-medium">
            ✅ All submissions have been reviewed. Queue is empty!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingSubmissions.map((evt) => (
              <div
                key={evt.id}
                className="glass-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-amber-200 bg-amber-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={evt.poster_url}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {evt.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{evt.title}</h3>
                    <p className="text-xs text-slate-600">
                      Host: {evt.organizer?.display_name || 'Organizer'} • 📍 {evt.venue_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleModerateStatus(evt.id, 'published')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>

                  <button
                    onClick={() => handleModerateStatus(evt.id, 'rejected')}
                    className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <Link
                    href={`/events/${evt.slug}`}
                    className="p-2 rounded-xl glass-input text-slate-600 hover:bg-white"
                    title="Inspect details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Events Moderation Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Manage All Events ({events.length})
        </h2>

        <div className="divide-y divide-slate-100 space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      evt.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : evt.status === 'expired'
                        ? 'bg-slate-100 text-slate-700'
                        : evt.status === 'pending_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {evt.status}
                  </span>
                  {evt.is_featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-yellow-600" /> Featured
                    </span>
                  )}
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{evt.category}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate">{evt.title}</h4>
                <p className="text-xs text-slate-400">
                  {formatEventDateTime(evt.start_datetime, true, evt.timezone)}
                </p>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleFeatured(evt.id, evt.is_featured)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    evt.is_featured
                      ? 'bg-amber-100 text-amber-800'
                      : 'glass-input text-slate-600 hover:bg-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{evt.is_featured ? 'Unfeature' : 'Feature'}</span>
                </button>

                {evt.status === 'published' && (
                  <button
                    onClick={() => handleModerateStatus(evt.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}

                {evt.status === 'cancelled' && (
                  <button
                    onClick={() => handleModerateStatus(evt.id, 'published')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold"
                  >
                    Re-publish
                  </button>
                )}

                <Link
                  href={`/events/${evt.slug}`}
                  className="px-3 py-1.5 rounded-lg glass-input text-xs font-semibold text-slate-700 hover:bg-white"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
