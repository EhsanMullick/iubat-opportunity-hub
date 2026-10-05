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
  UploadCloud,
  Trash2,
  Eye,
  Compass,
  FileImage,
} from 'lucide-react';
import Link from 'next/link';
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
  const [createdEvent, setCreatedEvent] = useState<any | null>(null);

  // Poster Tab selection: 'upload' (local file), 'url' (web link), 'preset'
  const [posterTab, setPosterTab] = useState<'upload' | 'url' | 'preset'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setServerError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setServerError('File size exceeds 5MB limit. Please select an image under 5MB.');
      return;
    }
    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setValue('poster_url', dataUrl, { shouldValidate: true, shouldDirty: true });
      setServerError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setValue('poster_url', '', { shouldValidate: true });
    setUploadedFileName(null);
    setUploadedFileSize(null);
  };

  const onSubmit = async (values: EventFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, status: 'published' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit event');
      }

      setCreatedEvent(data.event);
      setSuccessMessage(data.message || 'Event published successfully! It is now live across the platform.');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Celebration & Direct Navigation Screen once Event is Created
  if (createdEvent) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-glass border-2 border-emerald-300 bg-white/95 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ⚡ Live On Website Now
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Event Published Successfully!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your opportunity <strong className="text-slate-900">&quot;{createdEvent.title}&quot;</strong> is immediately live and visible on the Homepage, Explore Events catalog, and Interactive Map.
            </p>
          </div>

          {/* Event Preview Card */}
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 text-left p-4 flex items-center gap-4 shadow-sm">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200">
              <img
                src={createdEvent.poster_url}
                alt={createdEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {createdEvent.category}
              </span>
              <h3 className="font-bold text-sm text-slate-900 truncate">
                {createdEvent.title}
              </h3>
              <p className="text-xs text-slate-500">
                📍 {createdEvent.venue_name}, {createdEvent.city}
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/events/${createdEvent.slug}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4" />
              <span>View Live Event Page</span>
            </Link>

            <Link
              href="/events"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>See in Explore Events</span>
            </Link>

            <Link
              href="/map"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Locate on Map</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => {
                setCreatedEvent(null);
                setSuccessMessage(null);
                setUploadedFileName(null);
              }}
              className="font-bold text-indigo-600 hover:underline"
            >
              + Publish Another Event
            </button>
            <span className="text-slate-300">•</span>
            <Link href="/dashboard" className="font-bold text-slate-600 hover:underline">
              Organizer Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                3. Poster Image
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a poster directly from your computer/phone, or provide an image link.
              </p>
            </div>

            {/* Source Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPosterTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  posterTab === 'upload'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Device</span>
              </button>
              <button
                type="button"
                onClick={() => setPosterTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  posterTab === 'url'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image Link</span>
              </button>
              <button
                type="button"
                onClick={() => setPosterTab('preset')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  posterTab === 'preset'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presets</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tab 1: Local Device Upload */}
            {posterTab === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <input
                    type="file"
                    id="localPosterUpload"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="localPosterUpload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800">
                        Click to choose poster from your local device or drag & drop here
                      </p>
                      <p className="text-xs text-slate-500">
                        Supports PNG, JPG, JPEG, WEBP from your computer or phone (Max 5MB)
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5">
                      <FileImage className="w-4 h-4" />
                      <span>Browse Image File</span>
                    </span>
                  </label>
                </div>

                {uploadedFileName && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{uploadedFileName}</span>
                      <span className="text-emerald-600 shrink-0">({uploadedFileSize})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 shrink-0 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: URL Input */}
            {posterTab === 'url' && (
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Poster Image URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    {...register('poster_url')}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Presets */}
            {posterTab === 'preset' && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500">Choose from curated event categories:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {posterPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setValue('poster_url', p.url, { shouldValidate: true, shouldDirty: true });
                        setUploadedFileName(null);
                      }}
                      className="text-xs px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200/50 transition-all flex items-center gap-1.5"
                    >
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errors.poster_url && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.poster_url.message}</span>
              </p>
            )}

            {/* Poster Live Preview */}
            {currentPoster && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Poster Live Preview:
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Image</span>
                  </button>
                </div>
                <div className="relative aspect-[16/9] max-w-md rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-md bg-slate-100">
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
