import { NextRequest, NextResponse } from 'next/server';
import { getAllLists } from '@/lib/mock-data';

/**
 * GET /api/lists
 * Fetch all public food lists
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    let lists = getAllLists();

    // Filter by category if provided
    if (category) {
      lists = lists.filter((list) => list.category === category);
    }

    // Apply limit
    lists = lists.slice(0, limit);

    return NextResponse.json({
      data: lists,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to fetch lists', code: 'FETCH_ERROR' },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lists
 * Create a new food list
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.category) {
      return NextResponse.json(
        {
          data: null,
          error: { message: 'Title and category are required', code: 'VALIDATION_ERROR' },
        },
        { status: 400 }
      );
    }

    // In production, this would create in Supabase
    // For now, return a mock response
    const newList = {
      id: `list-${Date.now()}`,
      userId: 'mock-user',
      title: body.title,
      description: body.description ?? null,
      isPublic: body.isPublic ?? true,
      shareCode: Math.random().toString(36).substring(2, 10),
      category: body.category,
      coverImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      placeCount: 0,
    };

    return NextResponse.json({
      data: newList,
      error: null,
    });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to create list', code: 'CREATE_ERROR' },
      },
      { status: 500 }
    );
  }
}
