'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  Link as LinkIcon,
  Ticket,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { eventFormSchema, EventFormValues, EVENT_CATEGORIES } from '@/lib/utils/validation';
import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('@/components/map/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
      Loading OpenStreetMap Picker...
    </div>
  ),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-configured high-quality posters for quick selection
  const posterPresets = [
    { label: 'Hackathon / Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80' },
    { label: 'Conference / Hall', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80' },
    { label: 'Concert / Music', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80' },
    { label: 'Sports / Football', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80' },
    { label: 'Workshop / Lab', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80' },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Hackathons & Contests',
      poster_url: posterPresets[0].url,
      start_datetime: '2026-11-15T10:00',
      end_datetime: '2026-11-15T18:00',
      venue_name: 'IUBAT Main Auditorium',
      venue_address: '4 Embankment Drive Road, Sector 10, Uttara Model Town',
      city: 'Dhaka',
      latitude: 23.8824,
      longitude: 90.3957,
      ticket_price: 0,
      currency: 'BDT',
      capacity: 300,
      registration_url: '',
      contact_email: '',
      contact_url: '',
    },
  });

  const currentPoster = watch('poster_url');
  const lat = watch('latitude');
  const lng = watch('longitude');

  const onSubmit = async (values: EventFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit event');
      }

      setSuccessMessage(data.message || 'Event submitted successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Publish a New Event or Opportunity
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide complete details below. All new submissions are reviewed by administrators before public listing.
        </p>
      </div>

      {serverError && (
        <div className="glass-panel p-4 rounded-2xl border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="glass-panel p-4 rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Event Overview
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Event Title *
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g., IUBAT National Hackathon 2026: Code the Future"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900 font-medium"
              />
              {errors.title && (
                <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900 font-medium cursor-pointer"
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-rose-600 mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Full Description & Agenda *
              </label>
              <textarea
                rows={5}
                {...register('description')}
                placeholder="Detail eligibility, tracks, registration deadlines, rules, awards, food/amenities, and schedule..."
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            2. Date & Schedule (Asia/Dhaka)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('start_datetime')}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900 font-medium"
              />
              {errors.start_datetime && (
                <p className="text-xs text-rose-600 mt-1">{errors.start_datetime.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('end_datetime')}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900 font-medium"
              />
              {errors.end_datetime && (
                <p className="text-xs text-rose-600 mt-1">{errors.end_datetime.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Poster & Visuals */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. Poster Image
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Poster Image URL *
              </label>
              <input
                type="url"
                {...register('poster_url')}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
              {errors.poster_url && (
                <p className="text-xs text-rose-600 mt-1">{errors.poster_url.message}</p>
              )}
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">Or pick a curated banner:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {posterPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setValue('poster_url', p.url)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium border border-indigo-200/50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Poster Preview */}
            {currentPoster && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Live Preview:</span>
                <div className="relative aspect-[16/9] max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src={currentPoster}
                    alt="Preview poster"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location & Map Coordinates Picker */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            4. Venue & Map Location
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  {...register('venue_name')}
                  placeholder="e.g. IUBAT Open Amphitheater"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
                />
                {errors.venue_name && (
                  <p className="text-xs text-rose-600 mt-1">{errors.venue_name.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  {...register('city')}
                  placeholder="Dhaka"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
                />
                {errors.city && (
                  <p className="text-xs text-rose-600 mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Full Venue Street Address *
              </label>
              <input
                type="text"
                {...register('venue_address')}
                placeholder="4 Embankment Drive Road, Sector 10, Uttara Model Town, Dhaka"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
              {errors.venue_address && (
                <p className="text-xs text-rose-600 mt-1">{errors.venue_address.message}</p>
              )}
            </div>

            {/* Interactive OpenStreetMap Coordinate Picker */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Exact Venue Pin on Map *
              </label>
              <LocationPickerMap
                latitude={lat}
                longitude={lng}
                onChange={({ lat, lng }) => {
                  setValue('latitude', lat);
                  setValue('longitude', lng);
                }}
              />
            </div>
          </div>
        </div>

        {/* Tickets & Registration Link */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            5. Registration & Entry Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Ticket Price (BDT) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                {...register('ticket_price', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900 font-medium"
              />
              <span className="text-[11px] text-slate-400">Set to 0 for Free Entry</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                min="1"
                {...register('capacity', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Contact Email
              </label>
              <input
                type="email"
                {...register('contact_email')}
                placeholder="organizer@club.edu"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              External Registration / Ticketing URL
            </label>
            <input
              type="url"
              {...register('registration_url')}
              placeholder="https://forms.gle/... or https://ticketplatform.com"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
            />
            {errors.registration_url && (
              <p className="text-xs text-rose-600 mt-1">{errors.registration_url.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3.5 rounded-xl glass-input font-bold text-sm text-slate-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating & Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Event for Moderation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
