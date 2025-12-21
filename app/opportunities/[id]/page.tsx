"use client";

import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { mockMovies } from "@/lib/data";
import { formatCurrency, genreNames, languageNames, statusNames } from "@/lib/data";
import Link from "next/link";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movie = mockMovies.find((m) => m.id === id);

  if (!movie) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-light text-black mb-4">Movie not found</h1>
          <Link href="/opportunities" className="text-sm font-light text-black hover:text-green-600">
            Back to Movies
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const isFullyFunded = movie.status === "fully_funded";
  const fundingProgress = ((movie.totalLots - movie.availableLots) / movie.totalLots) * 100;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/opportunities"
          className="text-sm font-light text-black hover:text-green-600 mb-8 inline-block"
        >
          ← Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Movie Poster */}
          <div className="relative h-[600px] border border-black">
            {movie.poster && movie.poster.startsWith("http") ? (
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎬</div>
                  <div className="text-2xl font-light text-black">{movie.title}</div>
                </div>
              </div>
            )}
          </div>

          {/* Movie Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-light text-black uppercase tracking-wider border border-black px-3 py-1">
                  {statusNames[movie.status] || movie.status}
                </span>
                <span className="text-xs font-light text-black uppercase tracking-wider">
                  {movie.genre.map((g) => genreNames[g] || g).join(", ")}
                </span>
              </div>
              <h1 className="text-5xl font-light text-black mb-2 tracking-tight">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-lg font-light text-black italic mb-4">{movie.tagline}</p>
              )}
            </div>

            <div className="border-t border-b border-black py-8 mb-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-xs text-black mb-2 font-light uppercase tracking-wider">Price per Lot</div>
                  <div className="text-3xl font-light text-black">{formatCurrency(movie.pricePerLot)}</div>
                  <div className="text-xs text-black font-light mt-1">(0.1% of budget)</div>
                </div>
                <div>
                  <div className="text-xs text-black mb-2 font-light uppercase tracking-wider">Projected ROI</div>
                  <div className="text-3xl font-light text-green-600">{movie.projectedROI}% p.a.</div>
                </div>
              </div>

              {!isFullyFunded && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-light text-black mb-2">
                    <span>Funding Progress</span>
                    <span>
                      {movie.totalLots - movie.availableLots} / {movie.totalLots} lots
                    </span>
                  </div>
                  <div className="w-full bg-white border border-black h-2">
                    <div
                      className="bg-black h-full transition-all duration-500"
                      style={{ width: `${fundingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm font-light text-black">
                <div>
                  <span className="opacity-70">Director:</span> {movie.director}
                </div>
                <div>
                  <span className="opacity-70">Producer:</span> {movie.producer}
                </div>
                <div>
                  <span className="opacity-70">Language:</span> {languageNames[movie.language]}
                </div>
                <div>
                  <span className="opacity-70">Release:</span> {movie.releaseDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            {!isFullyFunded && (
              <Link
                href={`/invest/${movie.id}`}
                className="block w-full text-center py-4 bg-black text-white text-sm font-light tracking-wide hover:bg-green-600 transition-colors border border-black"
              >
                Invest Now
              </Link>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">About the Film</h2>
          <p className="text-sm font-light text-black leading-relaxed max-w-3xl">{movie.description}</p>
        </div>

        {/* Cast */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Cast</h2>
          <div className="flex flex-wrap gap-4">
            {movie.cast.map((actor, index) => (
              <div
                key={index}
                className="border border-black px-6 py-3 text-sm font-light text-black"
              >
                {actor}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Projections */}
        <div className="mb-16 border-t border-black pt-12">
          <h2 className="text-2xl font-light text-black mb-8 tracking-tight">Revenue Projections</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border border-black p-6">
              <div className="text-xs font-light text-black mb-2 uppercase tracking-wider opacity-70">
                Box Office
              </div>
              <div className="text-2xl font-light text-black">
                {formatCurrency(movie.revenueProjection.boxOffice)}
              </div>
            </div>
            <div className="border border-black p-6">
              <div className="text-xs font-light text-black mb-2 uppercase tracking-wider opacity-70">
                Streaming
              </div>
              <div className="text-2xl font-light text-black">
                {formatCurrency(movie.revenueProjection.streaming)}
              </div>
            </div>
            <div className="border border-black p-6">
              <div className="text-xs font-light text-black mb-2 uppercase tracking-wider opacity-70">
                Distribution
              </div>
              <div className="text-2xl font-light text-black">
                {formatCurrency(movie.revenueProjection.distribution)}
              </div>
            </div>
            <div className="border border-black p-6 bg-black text-white">
              <div className="text-xs font-light mb-2 uppercase tracking-wider opacity-70">
                Total Projected
              </div>
              <div className="text-2xl font-light">
                {formatCurrency(movie.revenueProjection.total)}
              </div>
            </div>
          </div>
        </div>

        {/* Returns Projection */}
        <div className="border-t border-black pt-12">
          <h2 className="text-2xl font-light text-black mb-8 tracking-tight">5-Year Returns Projection</h2>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((year) => (
              <div key={year} className="border border-black p-6 text-center">
                <div className="text-xs font-light text-black mb-2 uppercase tracking-wider opacity-70">
                  Year {year}
                </div>
                <div className="text-2xl font-light text-green-600">
                  {movie.returnsProjection[`year${year}` as keyof typeof movie.returnsProjection]}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
