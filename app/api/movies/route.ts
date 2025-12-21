import { NextResponse } from 'next/server';
import { searchMovie, getMovieDetails, getPopularMovies, getUpcomingMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const query = searchParams.get('query');
  const id = searchParams.get('id');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
        }
        const searchResults = await searchMovie(query);
        return NextResponse.json({ results: searchResults });

      case 'details':
        if (!id) {
          return NextResponse.json({ error: 'ID parameter required' }, { status: 400 });
        }
        const details = await getMovieDetails(parseInt(id));
        if (!details) {
          return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
        }
        return NextResponse.json(details);

      case 'popular':
        const popular = await getPopularMovies(page);
        return NextResponse.json({ results: popular, page });

      case 'upcoming':
        const upcoming = await getUpcomingMovies(page);
        return NextResponse.json({ results: upcoming, page });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
