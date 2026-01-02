import { NextRequest, NextResponse } from 'next/server';
import { getListPlaces } from '@/lib/mock-data';
import { calculateDistance, estimateWalkingTime } from '@/lib/utils';
import type { Coordinates, PlaceWithNote } from '@/types';

/**
 * POST /api/routes/optimize
 * Optimize the walking route for a list of places
 * Uses a greedy nearest-neighbor algorithm for simplicity
 * In production, this would call a Python service with OR-Tools
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listId, startLocation } = body as {
      listId: string;
      startLocation?: Coordinates;
    };

    if (!listId) {
      return NextResponse.json(
        {
          data: null,
          error: { message: 'listId is required', code: 'VALIDATION_ERROR' },
        },
        { status: 400 }
      );
    }

    const places = getListPlaces(listId);

    if (places.length === 0) {
      return NextResponse.json(
        {
          data: null,
          error: { message: 'No places in this list', code: 'EMPTY_LIST' },
        },
        { status: 400 }
      );
    }

    // Default start location to Singapore center if not provided
    const start: Coordinates = startLocation ?? { lat: 1.3521, lng: 103.8198 };

    // Optimize route using nearest neighbor algorithm
    const optimizedRoute = optimizeRoute(places, start);

    // Calculate total distance and time
    let totalDistance = 0;
    let totalWalkingTime = 0;
    const steps = [];

    let currentLocation = start;
    for (const place of optimizedRoute) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        place.location.lat,
        place.location.lng
      );
      const walkingTime = estimateWalkingTime(distance);

      totalDistance += distance;
      totalWalkingTime += walkingTime;

      steps.push({
        placeId: place.id,
        name: place.name,
        distance: Math.round(distance),
        walkingTime: Math.round(walkingTime),
      });

      currentLocation = place.location;
    }

    return NextResponse.json({
      data: {
        listId,
        optimizedOrder: optimizedRoute.map((p) => p.id),
        totalDistance: Math.round(totalDistance),
        totalWalkingTime: Math.round(totalWalkingTime),
        steps,
      },
      error: null,
    });
  } catch (error) {
    console.error('Error optimizing route:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to optimize route', code: 'OPTIMIZE_ERROR' },
      },
      { status: 500 }
    );
  }
}

/**
 * Nearest neighbor algorithm for route optimization
 * This is a greedy approximation - in production, use OR-Tools for optimal solution
 */
function optimizeRoute(
  places: PlaceWithNote[],
  start: Coordinates
): PlaceWithNote[] {
  if (places.length <= 2) {
    return places;
  }

  const remaining = [...places];
  const route: PlaceWithNote[] = [];
  let currentLocation = start;

  while (remaining.length > 0) {
    // Find nearest unvisited place
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        remaining[i].location.lat,
        remaining[i].location.lng
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Add nearest place to route
    const nextPlace = remaining.splice(nearestIndex, 1)[0];
    route.push(nextPlace);
    currentLocation = nextPlace.location;
  }

  return route;
}
