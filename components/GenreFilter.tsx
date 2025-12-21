"use client";

import { MovieGenre } from "@/types";
import { genreNames } from "@/lib/data";

interface GenreFilterProps {
  selectedGenre: MovieGenre | "all";
  onGenreChange: (genre: MovieGenre | "all") => void;
}

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  const genres: (MovieGenre | "all")[] = [
    "all",
    "action",
    "drama",
    "comedy",
    "thriller",
    "romance",
    "horror",
    "sci-fi",
    "animation",
    "fantasy",
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all duration-200 ${
              selectedGenre === genre
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            {genre === "all" ? "All Genres" : genreNames[genre] || genre}
          </button>
        ))}
      </div>
    </div>
  );
}
