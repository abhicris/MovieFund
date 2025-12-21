"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { mockMovies } from "@/lib/data";
import { Movie, MovieGenre } from "@/types";

type FilterType = "all" | "live" | "fully_funded";

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre | "all">("all");

  const filteredMovies = mockMovies.filter((movie) => {
    // Genre filter
    if (selectedGenre !== "all" && !movie.genre.includes(selectedGenre)) {
      return false;
    }
    // Status filter
    if (filter === "live") return movie.status !== "fully_funded";
    if (filter === "fully_funded") return movie.status === "fully_funded";
    return true;
  });

  const liveMovies = filteredMovies.filter((m) => m.status !== "fully_funded");
  const fullyFundedMovies = filteredMovies.filter((m) => m.status === "fully_funded");

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-6 tracking-tight">
            Movie Opportunities
          </h1>
          <p className="text-sm font-light text-black max-w-xl leading-relaxed">
            Browse available investment opportunities in upcoming films. 
            From blockbusters to independent cinema, find your next investment.
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all duration-200 ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            All Movies
          </button>
          <button
            onClick={() => setFilter("live")}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all duration-200 ${
              filter === "live"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            Live Opportunities
          </button>
          <button
            onClick={() => setFilter("fully_funded")}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all duration-200 ${
              filter === "fully_funded"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            Fully Funded
          </button>
        </div>

        {/* Genre Filter */}
        <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />

        {/* Live Opportunities */}
        {liveMovies.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-light text-black mb-8 tracking-tight">Live opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {liveMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Fully Funded */}
        {fullyFundedMovies.length > 0 && (
          <section className="border-t border-black pt-20">
            <h2 className="text-2xl font-light text-black mb-8 tracking-tight">Fully funded</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {fullyFundedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
