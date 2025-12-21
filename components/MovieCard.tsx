import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types";
import { formatCurrency, genreNames, statusNames } from "@/lib/data";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isFullyFunded = movie.status === "fully_funded";
  const lotsRemaining = movie.availableLots;

  return (
    <div className="group bg-white border border-black overflow-hidden hover:bg-black transition-all duration-300">
      <div className="relative h-96 bg-white overflow-hidden">
        {movie.poster && movie.poster.startsWith("http") ? (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white border-b border-black">
            <div className="text-center">
              <div className="text-6xl mb-2">🎬</div>
              <div className="text-sm font-light text-black">{movie.title}</div>
            </div>
          </div>
        )}
        {isFullyFunded && (
          <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 text-xs font-light tracking-wide">
            Sold out
          </div>
        )}
        {!isFullyFunded && (
          <div className="absolute top-4 left-4 bg-white text-black border border-black px-3 py-1 text-xs font-light tracking-wide">
            {statusNames[movie.status] || movie.status}
          </div>
        )}
      </div>
      <div className="p-8 border-t border-black">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-black font-light uppercase tracking-widest">
            {movie.genre.map((g) => genreNames[g] || g).join(", ")}
          </div>
          <div className="text-xs text-black font-light uppercase tracking-widest">
            {movie.language}
          </div>
        </div>
        <h3 className="text-2xl font-light text-black mb-2 leading-tight tracking-tight">
          {movie.title}
        </h3>
        {movie.tagline && (
          <p className="text-sm font-light text-black mb-4 italic">
            {movie.tagline}
          </p>
        )}
        <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-black">
          <div>
            <div className="text-xs text-black mb-2 font-light uppercase tracking-wider">Investment</div>
            <div className="text-xl font-light text-black">
              {formatCurrency(movie.pricePerLot)}
            </div>
            <div className="text-xs text-black font-light mt-1">/lot</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-black mb-2 font-light uppercase tracking-wider">ROI</div>
            <div className="text-xl font-light text-green-600">
              {movie.projectedROI}% p.a.
            </div>
          </div>
        </div>
        {!isFullyFunded && (
          <div className="mb-6">
            <div className="text-xs text-black font-light mb-2">
              {lotsRemaining}/{movie.totalLots} lots remaining
            </div>
            <div className="text-xs text-black font-light">Director: {movie.director}</div>
          </div>
        )}
        {isFullyFunded && (
          <div className="mb-6">
            <div className="text-xs text-black font-light">
              All lots are full
            </div>
          </div>
        )}
        <Link
          href={`/opportunities/${movie.id}`}
          className={`block w-full text-center py-4 text-sm font-light tracking-wide transition-all duration-200 ${
            isFullyFunded
              ? "bg-white text-black border border-black cursor-not-allowed"
              : "bg-black text-white hover:bg-green-600 hover:border-green-600 border border-black"
          }`}
        >
          {isFullyFunded ? "View Details" : "Invest Now"}
        </Link>
      </div>
    </div>
  );
}
