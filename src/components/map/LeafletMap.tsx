'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { EventItem } from '@/types';
import { formatEventDateTime } from '@/lib/utils/date';

interface LeafletMapProps {
  events: EventItem[];
  selectedEventId?: string;
  onSelectEvent?: (event: EventItem) => void;
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({
  events,
  selectedEventId,
  onSelectEvent,
  center = [23.8103, 90.4125], // Centered around Dhaka, Bangladesh
  zoom = 12,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically load leaflet
      const L = await import('leaflet');

      // Fix default marker icon issues in Next.js bundler
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      if (!isMounted || !mapInstanceRef.current) return;
      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((marker: any) => marker.remove());
      markersRef.current = {};

      const validEvents = events.filter(
        (e) => typeof e.latitude === 'number' && typeof e.longitude === 'number'
      );

      validEvents.forEach((evt) => {
        const popupContent = `
          <div style="min-width: 220px; max-width: 260px; overflow: hidden; border-radius: 12px; font-family: inherit;">
            <div style="height: 110px; width: 100%; position: relative; background: #f1f5f9;">
              <img src="${evt.poster_url}" alt="${evt.title}" style="width: 100%; height: 100%; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px;" />
              <span style="position: absolute; top: 6px; left: 6px; background: rgba(255,255,255,0.9); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 99px; color: #4338ca;">
                ${evt.category}
              </span>
            </div>
            <div style="padding: 10px 12px;">
              <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${evt.title}
              </h4>
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #4f46e5; font-weight: 600;">
                📅 ${formatEventDateTime(evt.start_datetime, true, evt.timezone)}
              </p>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">
                📍 ${evt.venue_name}, ${evt.city}
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: #059669;">
                  ${evt.ticket_price === 0 ? 'Free Entry' : `${evt.ticket_price} BDT`}
                </span>
                <a href="/events/${evt.slug}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
                  View &rarr;
                </a>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker([evt.latitude, evt.longitude])
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 280 });

        marker.on('click', () => {
          if (onSelectEvent) onSelectEvent(evt);
        });

        markersRef.current[evt.id] = marker;
      });

      // If an event is selected, pan to it
      if (selectedEventId && markersRef.current[selectedEventId]) {
        const marker = markersRef.current[selectedEventId];
        marker.openPopup();
        map.setView(marker.getLatLng(), 14, { animate: true });
      } else if (validEvents.length > 0) {
        // Fit bounds
        const group = L.featureGroup(Object.values(markersRef.current));
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [events, selectedEventId]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden glass-panel shadow-glass border border-white/60 min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" />
    </div>
  );
}
