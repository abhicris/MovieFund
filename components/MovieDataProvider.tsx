"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types";
import { mockMovies } from "@/lib/data";

interface MovieDataProviderProps {
  children: (movies: Movie[]) => React.ReactNode;
}

export default function MovieDataProvider({ children }: MovieDataProviderProps) {
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to fetch enriched data from API if available
    const fetchEnrichedMovies = async () => {
      // Check if TMDB API is configured
      if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
        return; // Use mock data if no API key
      }

      setLoading(true);
      try {
        // For now, use mock data but could fetch from API
        // In production, you'd call your API route here
        setMovies(mockMovies);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setMovies(mockMovies); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchEnrichedMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm font-light text-black">Loading movies...</div>
      </div>
    );
  }

  return <>{children(movies)}</>;
}
