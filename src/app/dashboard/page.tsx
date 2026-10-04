'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  TrendingUp,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { EventItem, EventStatus } from '@/types';
import { formatEventDateTime, isEventExpired } from '@/lib/utils/date';

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizerEvents() {
      try {
        const res = await fetch('/api/events?limit=50');
        if (res.ok) {
          const json = await res.json();
          // Filter to show owned events or sample organizer events
          setEvents(json.data || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadOrganizerEvents();
  }, []);

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/events/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Published
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3" /> Expired
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Draft
          </span>
        );
    }
  };

  const publishedCount = events.filter((e) => e.status === 'published').length;
  const pendingCount = events.filter((e) => e.status === 'pending_review').length;
  const totalViews = events.reduce((acc, curr) => acc + (curr.views_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Welcome & Actions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Organizer Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your submissions, upload posters, review public URL engagement, and publish new events.
          </p>
        </div>

        <Link
          href="/dashboard/events/new"
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Event</span>
        </Link>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Published Events
          </span>
          <div className="text-3xl font-black text-slate-900">{publishedCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1 border-amber-200/60">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Pending Admin Moderation
          </span>
          <div className="text-3xl font-black text-amber-800">{pendingCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1 border-indigo-200/60">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Total Student Reach & Views
          </span>
          <div className="text-3xl font-black text-indigo-900 flex items-center gap-2">
            <span>{totalViews.toLocaleString()}</span>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Events List Table / Card View */}
      <div className="glass-panel rounded-3xl p-6 shadow-glass border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Submitted Events</h2>
          <span className="text-xs font-semibold text-slate-500">
            {events.length} Total Submissions
          </span>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="glass-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <Image
                    src={evt.poster_url}
                    alt={evt.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(evt.status)}
                    <span className="text-[11px] font-semibold text-slate-500">
                      {evt.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>📅 {formatEventDateTime(evt.start_datetime, true, evt.timezone)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" /> {evt.views_count} views
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => handleCopyLink(evt.slug, evt.id)}
                  title="Copy Public URL"
                  className="px-3 py-1.5 rounded-lg glass-input text-xs font-semibold text-slate-700 hover:bg-white flex items-center gap-1 transition-colors"
                >
                  {copiedId === evt.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/events/${evt.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
