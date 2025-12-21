// TMDB API integration for movie data
// Free API: https://www.themoviedb.org/documentation/api

// TMDB API Key - Get free key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string }>;
  cast?: Array<{ name: string; character: string }>;
  director?: string;
}

// Search for movies by title
export async function searchMovie(query: string): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not found. Using fallback data.');
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return [];
  }
}

// Get movie details by TMDB ID
export async function getMovieDetails(tmdbId: number): Promise<TMDBMovieDetails | null> {
  if (!TMDB_API_KEY) {
    return null;
  }

  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`),
      fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}&language=en-US`)
    ]);

    if (!movieResponse.ok) {
      throw new Error(`TMDB API error: ${movieResponse.status}`);
    }

    const movie = await movieResponse.json();
    const credits = creditsResponse.ok ? await creditsResponse.json() : { crew: [], cast: [] };

    // Find director
    const director = credits.crew?.find((person: any) => person.job === 'Director')?.name || '';

    return {
      ...movie,
      director,
      cast: credits.cast?.slice(0, 5).map((actor: any) => ({
        name: actor.name,
        character: actor.character
      })) || []
    };
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error);
    return null;
  }
}

// Get popular movies
export async function getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error);
    return [];
  }
}

// Get upcoming movies
export async function getUpcomingMovies(page: number = 1): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching upcoming movies from TMDB:', error);
    return [];
  }
}

// Helper to get image URL
export function getImageUrl(path: string | null, size: 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Helper to get poster URL
export function getPosterUrl(path: string | null): string {
  return getImageUrl(path, 'w500');
}

// Helper to get backdrop URL
export function getBackdropUrl(path: string | null): string {
  return getImageUrl(path, 'w1280');
}
