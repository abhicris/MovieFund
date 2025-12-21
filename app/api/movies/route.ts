import { NextResponse } from 'next/server';
import { mockMovies } from '@/lib/data';

// Public API endpoint for fetching movies (for frontend)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const genre = searchParams.get('genre');
  const language = searchParams.get('language');

  let filteredMovies = [...mockMovies];

  // Apply filters
  if (status) {
    filteredMovies = filteredMovies.filter(m => m.status === status);
  }
  if (genre) {
    filteredMovies = filteredMovies.filter(m => m.genre.includes(genre));
  }
  if (language) {
    filteredMovies = filteredMovies.filter(m => m.language === language);
  }

  return NextResponse.json({
    success: true,
    data: filteredMovies,
    total: filteredMovies.length,
  });
}
