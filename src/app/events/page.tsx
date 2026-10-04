'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Calendar,
  MapPin,
  Tag,
  ArrowUpDown,
  Sparkles,
  Inbox,
  Loader2,
} from 'lucide-react';
import { EventItem, EventCategory } from '@/types';
import EventCard from '@/components/events/EventCard';
import { EVENT_CATEGORIES } from '@/lib/utils/validation';

export default function ExploreEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center text-slate-500 text-sm">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
          Loading Discovery Filters...
        </div>
      }
    >
      <ExploreEventsContent />
    </Suspense>
  );
}

function ExploreEventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialCity = searchParams.get('city') || 'All';
  const initialPriceType = searchParams.get('priceType') || 'all';
  const initialSortBy = searchParams.get('sortBy') || 'soonest';
  const initialStartDate = searchParams.get('startDate') || '';
  const initialEndDate = searchParams.get('endDate') || '';

  // Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(initialCity);
  const [priceType, setPriceType] = useState(initialPriceType);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Data fetching state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category !== 'All') params.set('category', category);
      if (city !== 'All') params.set('city', city);
      if (priceType !== 'all') params.set('priceType', priceType);
      if (sortBy) params.set('sortBy', sortBy);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to retrieve events');
      const data = await res.json();
      setEvents(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, city, priceType, sortBy, startDate, endDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setCategory('All');
    setCity('All');
    setPriceType('all');
    setSortBy('soonest');
    setStartDate('');
    setEndDate('');
    router.replace('/events');
  };

  const hasActiveFilters =
    debouncedSearch !== '' ||
    category !== 'All' ||
    city !== 'All' ||
    priceType !== 'all' ||
    sortBy !== 'soonest' ||
    startDate !== '' ||
    endDate !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore Opportunities & Events
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">
          Showing real-time verified upcoming events in Bangladesh. Past and expired events are automatically excluded.
        </p>
      </div>

      {/* Glassmorphism Filter Controls Bar */}
      <div className="glass-panel rounded-2xl p-5 shadow-glass space-y-4 border border-white/80">
        {/* Top search & sorting row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Debounced Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, keywords, or venue address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="md:col-span-3 relative">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort events"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl glass-input text-sm text-slate-800 cursor-pointer"
            >
              <option value="soonest">Sort by: Soonest (Approaching)</option>
              <option value="newest">Sort by: Recently Published</option>
              <option value="popular">Sort by: Popularity & Views</option>
            </select>
          </div>

          {/* Price Type */}
          <div className="md:col-span-3 relative">
            <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              aria-label="Filter by price"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl glass-input text-sm text-slate-800 cursor-pointer"
            >
              <option value="all">Entry: All (Free & Paid)</option>
              <option value="free">Entry: Free Only</option>
              <option value="paid">Entry: Paid Tickets</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row (Category, City, Dates) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200/60">
          {/* Category Dropdown */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-800 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              City / Location
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-800 cursor-pointer"
            >
              <option value="All">All Cities</option>
              <option value="Dhaka">Dhaka (Including IUBAT)</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-800"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Filter Summary & Reset Action */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="font-semibold text-slate-600">
            {loading ? 'Searching events...' : `Found ${total} eligible upcoming event${total === 1 ? '' : 's'}`}
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden h-[380px] animate-pulse">
              <div className="h-[200px] bg-slate-200/70" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200/80 rounded w-1/3" />
                <div className="h-6 bg-slate-200/90 rounded w-4/5" />
                <div className="h-4 bg-slate-200/70 rounded w-1/2" />
                <div className="pt-4 flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-16" />
                  <div className="h-4 bg-slate-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="glass-panel rounded-2xl p-8 text-center max-w-md mx-auto space-y-3 border-rose-200">
          <p className="text-sm font-semibold text-rose-600">Failed to load events: {error}</p>
          <button
            onClick={() => fetchEvents()}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Upcoming Events Match Your Search</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We couldn't find any eligible upcoming opportunities for the selected filters. Note that expired events are automatically hidden from active listings.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Clear Filters & View All
          </button>
        </div>
      )}

      {/* Event Card Grid */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
