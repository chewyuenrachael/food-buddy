'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Route,
  MapPin,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { Header } from '@/components/layout';
import { MapView } from '@/components/map';
import { PlaceCard, ShareModal } from '@/components/lists';
import { Button, Badge } from '@/components/ui';
import { useMapStore } from '@/stores';
import { getListById, getListPlaces } from '@/lib/mock-data';
import { formatDistance, formatWalkingTime } from '@/lib/utils';
import { LIST_CATEGORIES } from '@/types';
import type { PlaceWithNote } from '@/types';

export default function ListDetailPage() {
  const params = useParams();
  const listId = params.id as string;
  
  const [isShareOpen, setShareOpen] = React.useState(false);
  const [isRouteOptimized, setRouteOptimized] = React.useState(false);
  const [routeData, setRouteData] = React.useState<{
    totalDistance: number;
    totalWalkingTime: number;
    optimizedOrder: string[];
  } | null>(null);
  
  const { selectedPlaceId, setSelectedPlace, flyTo } = useMapStore();

  // Fetch list data
  const list = getListById(listId);
  const places = getListPlaces(listId);

  // Sort places by route if optimized
  const displayPlaces = React.useMemo(() => {
    if (!routeData || !isRouteOptimized) return places;
    
    const orderMap = new Map(
      routeData.optimizedOrder.map((id, index) => [id, index])
    );
    
    return [...places].sort(
      (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
    );
  }, [places, routeData, isRouteOptimized]);

  // Handle route optimization
  const handleOptimizeRoute = async () => {
    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId }),
      });
      
      const result = await response.json();
      
      if (result.data) {
        setRouteData(result.data);
        setRouteOptimized(true);
      }
    } catch (error) {
      console.error('Failed to optimize route:', error);
    }
  };

  // Handle place selection
  const handlePlaceClick = (place: PlaceWithNote) => {
    setSelectedPlace(place.id);
    flyTo(place.location, 16);
  };

  // Open in Google Maps
  const openInGoogleMaps = (place: PlaceWithNote) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name}, ${place.address}`
    )}`;
    window.open(url, '_blank');
  };

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">List not found</h1>
          <p className="mt-2 text-gray-600">
            This list may have been deleted or doesn&apos;t exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/lists">Browse Lists</Link>
          </Button>
        </main>
      </div>
    );
  }

  const category = LIST_CATEGORIES[list.category];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full overflow-y-auto border-r border-gray-200 bg-white lg:w-[420px]">
          {/* Back button and actions */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/lists">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* List header */}
          <div className="p-4">
            <Badge variant="default" className="mb-2">
              {category.emoji} {category.label}
            </Badge>
            <h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
            {list.description && (
              <p className="mt-2 text-gray-600">{list.description}</p>
            )}

            {/* Curator info */}
            {list.user && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                {list.user.avatarUrl ? (
                  <img
                    src={list.user.avatarUrl}
                    alt={list.user.name ?? ''}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span>Curated by {list.user.name}</span>
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{places.length} places</span>
              </div>
              {routeData && (
                <>
                  <div className="flex items-center gap-1">
                    <Route className="h-4 w-4" />
                    <span>{formatDistance(routeData.totalDistance)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatWalkingTime(routeData.totalWalkingTime)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Route optimization button */}
            {places.length > 1 && (
              <Button
                className="mt-4 w-full"
                variant={isRouteOptimized ? 'secondary' : 'default'}
                onClick={handleOptimizeRoute}
              >
                <Route className="h-4 w-4" />
                {isRouteOptimized ? 'Route Optimized' : 'Optimize Walking Route'}
              </Button>
            )}
          </div>

          {/* Places list */}
          <div className="p-4 pt-0">
            <h2 className="mb-3 font-semibold text-gray-900">
              {isRouteOptimized ? 'Optimized Route' : 'Places'}
            </h2>
            <div className="space-y-3">
              {displayPlaces.map((place, index) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  index={isRouteOptimized ? index : undefined}
                  isSelected={place.id === selectedPlaceId}
                  onClick={() => handlePlaceClick(place)}
                  onDirections={() => openInGoogleMaps(place)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-[50vh] flex-1 lg:h-auto">
          <MapView
            places={displayPlaces}
            selectedPlaceId={selectedPlaceId}
            onPlaceSelect={(id) => {
              setSelectedPlace(id);
              const place = places.find((p) => p.id === id);
              if (place) flyTo(place.location, 16);
            }}
          />
        </div>
      </main>

      {/* Share modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        shareCode={list.shareCode}
        title={list.title}
      />
    </div>
  );
}
