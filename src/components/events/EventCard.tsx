'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Sparkles,
  Building2,
  Clock,
  ArrowUpRight,
  Star,
} from 'lucide-react';
import { EventItem } from '@/types';
import { formatEventDateTime, isEventExpired, isEventLive } from '@/lib/utils/date';

interface EventCardProps {
  event: EventItem;
  onSave?: (event: EventItem) => void;
  isSaved?: boolean;
}

export default function EventCard({ event, onSave, isSaved = false }: EventCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const expired = isEventExpired(event.end_datetime) || event.status === 'expired';
  const live = !expired && isEventLive(event.start_datetime, event.end_datetime);

  const handleQuickSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    try {
      const res = await fetch('/api/student/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, status: 'interested' }),
      });
      if (res.ok) {
        setSaved(true);
        if (onSave) onSave(event);
      }
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Hackathons & Contests':
        return 'bg-purple-600 text-white border-purple-400 shadow-sm';
      case 'Career & Networking':
        return 'bg-blue-600 text-white border-blue-400 shadow-sm';
      case 'Seminars & Conferences':
        return 'bg-emerald-600 text-white border-emerald-400 shadow-sm';
      case 'Concerts & Cultural':
        return 'bg-amber-600 text-white border-amber-400 shadow-sm';
      case 'Workshops & Training':
        return 'bg-indigo-600 text-white border-indigo-400 shadow-sm';
      case 'Sports & Fitness':
        return 'bg-rose-600 text-white border-rose-400 shadow-sm';
      default:
        return 'bg-slate-700 text-white border-slate-500 shadow-sm';
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative h-full">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-md ${getCategoryTheme(
                event.category
              )}`}
            >
              {event.category}
            </span>

            {event.is_featured && !expired && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-xs backdrop-blur-md">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Quick Interested Button */}
          <button
            onClick={handleQuickSave}
            title={saved ? 'Marked Interested in Student Hub' : 'Mark Interested'}
            aria-label={saved ? 'Marked Interested in Student Hub' : 'Mark Interested'}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all active:scale-90 flex items-center justify-center ${
              saved
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-amber-600 shadow-sm'
            }`}
          >
            <Star className={`w-4 h-4 ${saved ? 'fill-white stroke-white' : ''}`} />
          </button>
        </div>

        {/* Status Pills */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {expired ? (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/85 text-slate-300 backdrop-blur-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Event Ended</span>
            </span>
          ) : live ? (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Happening Now</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/90 text-slate-900 backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Calendar className="w-3 h-3 text-indigo-600" />
              <span>{formatEventDateTime(event.start_datetime, true, event.timezone)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <Link href={`/events/${event.slug}`} className="block group/link">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug line-clamp-2 group-hover/link:text-indigo-600 transition-colors">
              {event.title}
            </h3>
          </Link>

          {/* Venue & Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{event.venue_name}, {event.city}</span>
          </div>

          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1 font-medium">{event.organizer.display_name}</span>
            </div>
          )}
        </div>

        {/* Footer row: Fee and Action */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {event.ticket_price === 0 ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                Free Entry
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-800">
                {event.ticket_price} {event.currency}
              </span>
            )}
          </div>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:gap-1.5 transition-all"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
