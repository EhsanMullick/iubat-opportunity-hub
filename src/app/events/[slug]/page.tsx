import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  ExternalLink,
  Share2,
  Mail,
  AlertCircle,
  Sparkles,
  Ticket,
  Users,
  Navigation,
  ArrowLeft,
} from 'lucide-react';
import { getEventBySlug, getSimilarUpcomingEvents } from '@/lib/data/store';
import { formatEventDateTime, formatEventRange, isEventExpired } from '@/lib/utils/date';
import EventCard from '@/components/events/EventCard';
import dynamic from 'next/dynamic';
import ShareButtons from './ShareButtons';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
      Loading Venue Map...
    </div>
  ),
});

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const expired = isEventExpired(event.end_datetime) || event.status === 'expired';
  const similarEvents = getSimilarUpcomingEvents(event.id, event.category, 3);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Back Button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Expired Event Banner */}
      {expired && (
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border-amber-300/80 bg-amber-50/90 flex items-start gap-3 text-amber-950 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm">Notice: This Event Has Ended</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              This event concluded on {formatEventDateTime(event.end_datetime, true, event.timezone)}. It has been automatically archived from active discovery feeds and search results, and is preserved here as a historical record.
            </p>
          </div>
        </div>
      )}

      {/* Hero Header & Poster Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Poster */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden glass-panel shadow-glass border border-white/80">
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            {event.is_featured && !expired && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Featured Opportunity</span>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About This Opportunity</h2>
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Organizer Profile Box */}
            {event.organizer && (
              <div className="pt-6 mt-6 border-t border-slate-200/70 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden relative">
                  {event.organizer.avatar_url ? (
                    <Image
                      src={event.organizer.avatar_url}
                      alt={event.organizer.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900">
                      {event.organizer.display_name}
                    </h3>
                    {event.organizer.organizer_verified && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        Verified Host
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Official Event Organizer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6 sticky top-24">
            {/* Title & Category */}
            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {event.title}
              </h1>
            </div>

            {/* Key Metadata List */}
            <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Schedule</h4>
                  <p className="font-semibold text-slate-900">
                    {formatEventRange(event.start_datetime, event.end_datetime)}
                  </p>
                  <p className="text-xs text-slate-500">Timezone: {event.timezone}</p>
                </div>
              </div>

              {/* Venue & Location */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Location</h4>
                  <p className="font-semibold text-slate-900">{event.venue_name}</p>
                  <p className="text-xs text-slate-600">{event.venue_address}, {event.city}</p>
                </div>
              </div>

              {/* Admission / Ticket Fee */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entry & Registration Fee</h4>
                  <p className="font-bold text-slate-900">
                    {event.ticket_price === 0 ? 'Free Entry / No Registration Cost' : `${event.ticket_price} ${event.currency}`}
                  </p>
                  {event.capacity && (
                    <p className="text-xs text-slate-500">Max Capacity: {event.capacity} seats</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(event.contact_email || event.contact_url) && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact & Inquiries</h4>
                    {event.contact_email && (
                      <p className="text-xs text-indigo-600 font-medium">
                        <a href={`mailto:${event.contact_email}`}>{event.contact_email}</a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Registration CTA & Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {!expired && event.registration_url && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Register / Get Tickets</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Directions Button */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl glass-input hover:bg-white text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                <span>Open Directions & Navigation</span>
              </a>

              {/* Social Share & Copy Link Client Component */}
              <ShareButtons title={event.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Marker for the Venue */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Interactive Venue Location</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {event.latitude}, {event.longitude}
          </span>
        </div>
        <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200">
          <LeafletMap
            events={[event]}
            selectedEventId={event.id}
            center={[event.latitude, event.longitude]}
            zoom={15}
          />
        </div>
      </section>

      {/* Similar Upcoming Events */}
      {!expired && similarEvents.length > 0 && (
        <section className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-slate-900">Similar Upcoming Opportunities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarEvents.map((sim) => (
              <EventCard key={sim.id} event={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
