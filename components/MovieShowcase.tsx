import { Movie } from "@/types";
import MovieCard from "./MovieCard";

interface MovieShowcaseProps {
  movies: Movie[];
}

export default function MovieShowcase({ movies }: MovieShowcaseProps) {
  const liveMovies = movies.filter((m) => m.status !== "fully_funded").slice(0, 6);

  return (
    <section className="border-b border-black bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Featured Movies
          </h2>
          <p className="text-sm font-light text-black max-w-2xl leading-relaxed">
            Discover investment opportunities in upcoming films across genres. 
            From blockbusters to independent cinema, invest in stories that matter.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {liveMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
