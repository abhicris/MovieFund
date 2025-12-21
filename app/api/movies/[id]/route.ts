import { NextResponse } from 'next/server';
import { mockMovies } from '@/lib/data';

// Public API endpoint for fetching a single movie
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movie = mockMovies.find(m => m.id === id);

  if (!movie) {
    return NextResponse.json(
      { success: false, error: 'Movie not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: movie,
  });
}
