import { NextRequest, NextResponse } from 'next/server';
import { getListById, getListPlaces } from '@/lib/mock-data';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/lists/[id]
 * Fetch a specific food list with its places
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const list = getListById(id);

    if (!list) {
      return NextResponse.json(
        {
          data: null,
          error: { message: 'List not found', code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    // Get places for this list
    const places = getListPlaces(id);

    return NextResponse.json({
      data: {
        ...list,
        places,
      },
      error: null,
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to fetch list', code: 'FETCH_ERROR' },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lists/[id]
 * Update a food list
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const list = getListById(id);

    if (!list) {
      return NextResponse.json(
        {
          data: null,
          error: { message: 'List not found', code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    // In production, this would update in Supabase
    const updatedList = {
      ...list,
      ...body,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      data: updatedList,
      error: null,
    });
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to update list', code: 'UPDATE_ERROR' },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lists/[id]
 * Delete a food list
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const list = getListById(id);

    if (!list) {
      return NextResponse.json(
        {
          data: null,
          error: { message: 'List not found', code: 'NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    // In production, this would delete from Supabase
    return NextResponse.json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Failed to delete list', code: 'DELETE_ERROR' },
      },
      { status: 500 }
    );
  }
}
