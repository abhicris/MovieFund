import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import MovieShowcase from "@/components/MovieShowcase";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { platformStats, mockMovies } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats stats={platformStats} />
      <Services />
      <MovieShowcase movies={mockMovies} />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
