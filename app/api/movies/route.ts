import { NextResponse } from 'next/server';
import { mockMovies } from '@/lib/data';
import { MovieGenre, MovieLanguage } from '@/types';

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
    const genreFilter = genre as MovieGenre;
    filteredMovies = filteredMovies.filter(m => 
      m.genre.includes(genreFilter)
    );
  }
  if (language) {
    const languageFilter = language as MovieLanguage;
    filteredMovies = filteredMovies.filter(m => 
      m.language === languageFilter
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredMovies,
    total: filteredMovies.length,
  });
}
