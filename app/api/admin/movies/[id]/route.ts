import { NextRequest, NextResponse } from 'next/server';
import { Movie } from '@/types';

// TODO: Replace with actual database in production
let moviesData: Movie[] = [];

async function initializeMovies() {
  if (moviesData.length === 0) {
    const { mockMovies } = await import('@/lib/data');
    moviesData = [...mockMovies];
  }
}

// GET - Get a specific movie by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initializeMovies();
  
  const { id } = await params;
  const movie = moviesData.find(m => m.id === id);

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

// PUT - Update a movie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initializeMovies();
  
  const { id } = await params;
  const movieIndex = moviesData.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Movie not found' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const existingMovie = moviesData[movieIndex];

    // Update movie (preserve ID and timestamps)
    const updatedMovie: Movie = {
      ...existingMovie,
      ...body,
      id: existingMovie.id, // Don't allow ID changes
      createdAt: existingMovie.createdAt, // Preserve creation date
      updatedAt: new Date(),
      // Recalculate lot price if budget changed
      pricePerLot: body.budget ? body.budget / 1000 : existingMovie.pricePerLot,
      minimumInvestment: body.budget ? body.budget / 1000 : existingMovie.minimumInvestment,
    };

    moviesData[movieIndex] = updatedMovie;

    return NextResponse.json({
      success: true,
      data: updatedMovie,
      message: 'Movie updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a movie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initializeMovies();
  
  const { id } = await params;
  const movieIndex = moviesData.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Movie not found' },
      { status: 404 }
    );
  }

  moviesData.splice(movieIndex, 1);

  return NextResponse.json({
    success: true,
    message: 'Movie deleted successfully',
  });
}
