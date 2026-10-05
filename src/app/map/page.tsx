'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Layers,
  Filter,
  List,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { EventItem } from '@/types';
import { EVENT_CATEGORIES } from '@/lib/utils/validation';
import { formatEventDateTime } from '@/lib/utils/date';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '@/lib/data/districts';

// Dynamic import for LeafletMap
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-100 text-slate-500 font-medium">
      Loading OpenStreetMap Navigation...
    </div>
  ),
});

export default function DedicatedMapPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); // for mobile toggle
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        if (selectedDistrict !== 'All') params.set('city', selectedDistrict);
        if (selectedDate) params.set('startDate', selectedDate);
        params.set('limit', '50');

        const res = await fetch(`/api/events?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setEvents(json.data || []);
        }
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [selectedCategory, selectedDistrict, selectedDate]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-4">
      {/* Top Header & Filters Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Interactive Opportunity Map
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synchronized geographic discovery of verified upcoming events across all 64 districts of Bangladesh
          </p>
        </div>

        {/* Filter Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="All">All 64 Districts</option>
            {BANGLADESH_DIVISIONS.map((division) => (
              <optgroup key={division} label={`${division} Division`}>
                {BANGLADESH_DISTRICTS.filter((d) => d.division === division).map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name} ({district.bnName})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-800"
          />

          {/* Mobile List/Map Toggle */}
          <div className="flex md:hidden rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Synchronized Map + Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[550px]">
        {/* Synchronized Side List (Desktop, or Mobile when list view is active) */}
        <div
          className={`lg:col-span-5 h-full overflow-y-auto space-y-3 pr-1.5 ${
            viewMode === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            {events.length} Upcoming Venue Markers
          </div>

          {events.map((evt) => {
            const isSelected = evt.id === selectedEventId;
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`glass-card rounded-2xl p-3.5 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                    : 'hover:border-indigo-300'
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={evt.poster_url}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {evt.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {evt.ticket_price === 0 ? 'Free' : `${evt.ticket_price} BDT`}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {evt.title}
                    </h3>
                    <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatEventDateTime(evt.start_datetime, true, evt.timezone)}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{evt.venue_name}, {evt.city}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100/80 flex items-center justify-end">
                  <Link
                    href={`/events/${evt.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>View Event Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}

          {events.length === 0 && (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-500 text-xs">
              No active events found for this filter.
            </div>
          )}
        </div>

        {/* Map View Container */}
        <div
          className={`lg:col-span-7 h-full relative ${
            viewMode === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <LeafletMap
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={(e) => setSelectedEventId(e.id)}
          />
        </div>
      </div>
    </div>
  );
}
