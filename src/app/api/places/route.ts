import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces, mockPlaces } from '@/lib/mock-data';

/**
 * GET /api/places
 * Search for places
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    let places = query ? searchPlaces(query) : mockPlaces;

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      places = places.filter((place) =>
        tags.some((tag) => place.tags.includes(tag as any))
      );
    }

    // Apply limit
    places = places.slice(0, limit);

    return NextResponse.json({
      data: places,
      error: null,
    });
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to search places', code: 'SEARCH_ERROR' },
      },
      { status: 500 }
    );
  }
}
