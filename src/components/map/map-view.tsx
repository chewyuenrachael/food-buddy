'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { useMapStore } from '@/stores';
import { env } from '@/lib/env';
import type { Place, Coordinates } from '@/types';

// Dynamic import to avoid SSR issues with mapbox
import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.Map),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.Marker),
  { ssr: false }
);
const NavigationControl = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.NavigationControl),
  { ssr: false }
);
const GeolocateControl = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.GeolocateControl),
  { ssr: false }
);

interface MapViewProps {
  places?: Place[];
  selectedPlaceId?: string | null;
  onPlaceSelect?: (placeId: string) => void;
  interactive?: boolean;
  className?: string;
}

export function MapView({
  places = [],
  selectedPlaceId,
  onPlaceSelect,
  interactive = true,
  className,
}: MapViewProps) {
  const { viewState, setViewState } = useMapStore();

  // If no Mapbox token, show placeholder
  if (!env.mapbox.accessToken) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            Map unavailable - Add NEXT_PUBLIC_MAPBOX_TOKEN
          </p>
        </div>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={env.mapbox.accessToken}
      style={{ width: '100%', height: '100%' }}
      interactive={interactive}
      attributionControl={false}
    >
      {/* Navigation controls */}
      <NavigationControl position="top-right" />
      <GeolocateControl
        position="top-right"
        trackUserLocation
        showUserHeading
      />

      {/* Place markers */}
      {places.map((place, index) => (
        <Marker
          key={place.id}
          longitude={place.location.lng}
          latitude={place.location.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onPlaceSelect?.(place.id);
          }}
        >
          <PlaceMarker
            index={index}
            isSelected={place.id === selectedPlaceId}
          />
        </Marker>
      ))}
    </Map>
  );
}

interface PlaceMarkerProps {
  index: number;
  isSelected?: boolean;
}

function PlaceMarker({ index, isSelected }: PlaceMarkerProps) {
  return (
    <div
      className={`
        flex h-8 w-8 cursor-pointer items-center justify-center rounded-full
        border-2 border-white shadow-lg transition-transform
        ${isSelected ? 'scale-125 bg-orange-600' : 'bg-orange-500 hover:scale-110'}
      `}
    >
      <span className="text-xs font-bold text-white">{index + 1}</span>
    </div>
  );
}

// Export a static map for thumbnails
interface StaticMapProps {
  center: Coordinates;
  zoom?: number;
  className?: string;
}

export function StaticMap({ center, zoom = 14, className }: StaticMapProps) {
  if (!env.mapbox.accessToken) {
    return (
      <div className={`bg-gray-200 ${className}`}>
        <MapPin className="h-6 w-6 text-gray-400 m-auto" />
      </div>
    );
  }

  const staticUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${center.lng},${center.lat},${zoom}/300x200@2x?access_token=${env.mapbox.accessToken}`;

  return (
    <img
      src={staticUrl}
      alt="Map preview"
      className={`object-cover ${className}`}
    />
  );
}
