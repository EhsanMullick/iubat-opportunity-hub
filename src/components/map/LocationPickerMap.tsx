'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (coords: { lat: number; lng: number }) => void;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [currentCoords, setCurrentCoords] = useState({ lat: latitude, lng: longitude });

  // Common Bangladesh campus and city presets
  const presets = [
    { name: 'IUBAT Uttara Campus', lat: 23.8824, lng: 90.3957 },
    { name: 'Dhanmondi / BICC', lat: 23.7709, lng: 90.3789 },
    { name: 'Gulshan / Banani', lat: 23.7937, lng: 90.4066 },
    { name: 'Chittagong Center', lat: 22.3475, lng: 91.8123 },
    { name: 'Sylhet Center', lat: 24.8949, lng: 91.8687 },
  ];

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = await import('leaflet');

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
        const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          const newLat = parseFloat(pos.lat.toFixed(6));
          const newLng = parseFloat(pos.lng.toFixed(6));
          setCurrentCoords({ lat: newLat, lng: newLng });
          onChange({ lat: newLat, lng: newLng });
        });

        map.on('click', (e: any) => {
          const newLat = parseFloat(e.latlng.lat.toFixed(6));
          const newLng = parseFloat(e.latlng.lng.toFixed(6));
          marker.setLatLng([newLat, newLng]);
          setCurrentCoords({ lat: newLat, lng: newLng });
          onChange({ lat: newLat, lng: newLng });
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApplyPreset = (lat: number, lng: number) => {
    setCurrentCoords({ lat, lng });
    onChange({ lat, lng });
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
    }
  };

  return (
    <div className="space-y-3">
      {/* Presets Bar */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-indigo-500" /> Quick Presets:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleApplyPreset(preset.lat, preset.lng)}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors border border-indigo-200/50"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Map Element */}
      <div className="w-full h-[280px] rounded-xl overflow-hidden border border-slate-200 relative shadow-sm">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Lat / Lng Display & Instruction */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Click anywhere or drag marker to set coordinates</span>
        </div>
        <div className="font-mono font-medium text-slate-700">
          Lat: {currentCoords.lat.toFixed(4)}, Lng: {currentCoords.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
}
