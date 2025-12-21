import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-black bg-white">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-light text-black mb-6 leading-tight tracking-tight">
            Invest in
            <br />
            <span className="font-normal">Cinema</span>
          </h1>
          <p className="text-lg font-light text-black mb-8 leading-relaxed max-w-2xl">
            Fractional ownership in movies. Earn returns from box office, streaming, and distribution revenue. 
            Support independent filmmakers and be part of the next big hit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/opportunities"
              className="bg-black text-white px-8 py-4 text-sm font-light tracking-wide hover:bg-green-600 transition-colors text-center"
            >
              Browse Movies
            </Link>
            <Link
              href="/about"
              className="bg-white text-black border border-black px-8 py-4 text-sm font-light tracking-wide hover:bg-black hover:text-white transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
