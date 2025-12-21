import { Movie } from "@/types";
import { mockMovies } from "./data";
import { searchMovie, getMovieDetails, getPosterUrl, getBackdropUrl } from "./tmdb";

// Helper function to calculate lot price (0.1% of budget)
function calculateLotPrice(budget: number): number {
  return budget / 1000;
}

// Map TMDB genre IDs to our genre names
const genreMap: Record<number, string> = {
  28: "action",
  12: "adventure",
  16: "animation",
  35: "comedy",
  80: "crime",
  99: "documentary",
  18: "drama",
  10751: "family",
  14: "fantasy",
  36: "history",
  27: "horror",
  10402: "music",
  9648: "mystery",
  10749: "romance",
  878: "sci-fi",
  10770: "tv",
  53: "thriller",
  10752: "war",
  37: "western",
};

// Convert TMDB movie to our Movie format
export async function enrichMovieWithTMDB(movie: Movie): Promise<Movie> {
  // If no API key, return original movie
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    return movie;
  }

  try {
    // Search for the movie by title
    const searchResults = await searchMovie(movie.title);
    
    if (searchResults.length === 0) {
      return movie; // Return original if not found
    }

    // Get the first result (most relevant)
    const tmdbMovie = searchResults[0];
    
    // Get detailed movie info
    const details = await getMovieDetails(tmdbMovie.id);
    
    if (!details) {
      return movie;
    }

    // Map TMDB genres to our genres
    const genres = details.genres
      ?.map((g) => genreMap[g.id]).filter(Boolean) || movie.genre;

    // Get cast names
    const cast = details.cast?.map((c) => c.name) || movie.cast;

    // Update movie with TMDB data
    return {
      ...movie,
      poster: getPosterUrl(tmdbMovie.poster_path),
      images: [
        getBackdropUrl(tmdbMovie.backdrop_path),
        getBackdropUrl(tmdbMovie.backdrop_path),
      ].filter(Boolean),
      description: details.overview || movie.description,
      genre: genres.length > 0 ? genres : movie.genre,
      cast: cast.length > 0 ? cast : movie.cast,
      director: details.director || movie.director,
      releaseDate: details.release_date 
        ? new Date(details.release_date) 
        : movie.releaseDate,
    };
  } catch (error) {
    console.error(`Error enriching movie ${movie.title} with TMDB:`, error);
    return movie; // Return original on error
  }
}

// Get all movies with TMDB enrichment
export async function getMoviesWithTMDB(): Promise<Movie[]> {
  // If no API key, return mock data
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    return mockMovies;
  }

  try {
    // Enrich all movies with TMDB data
    const enrichedMovies = await Promise.all(
      mockMovies.map((movie) => enrichMovieWithTMDB(movie))
    );
    return enrichedMovies;
  } catch (error) {
    console.error('Error enriching movies with TMDB:', error);
    return mockMovies; // Fallback to mock data
  }
}

// Get a single movie with TMDB enrichment
export async function getMovieWithTMDB(movieId: string): Promise<Movie | null> {
  const movie = mockMovies.find((m) => m.id === movieId);
  if (!movie) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    return movie;
  }

  return enrichMovieWithTMDB(movie);
}
