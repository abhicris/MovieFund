import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-8 tracking-tight">
            About MovieFund
          </h1>
          
          <div className="space-y-8 text-sm font-light text-black leading-relaxed">
            <section>
              <h2 className="text-2xl font-light mb-4 tracking-tight">Our Mission</h2>
              <p>
                MovieFund democratizes movie investment by making it accessible to everyone. 
                We believe that great stories deserve great support, and investors should 
                have the opportunity to be part of the filmmaking process while earning 
                returns from their investments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4 tracking-tight">How We Work</h2>
              <p>
                We carefully curate film projects from experienced filmmakers and production 
                companies. Each project undergoes thorough due diligence, including script 
                review, director and cast evaluation, budget analysis, and revenue projections. 
                Once approved, projects are listed on our platform where investors can purchase 
                fractional lots (each lot represents 0.1% of the movie's budget).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4 tracking-tight">Transparency</h2>
              <p>
                We believe in complete transparency. Investors receive regular updates on 
                movie production progress, release information, and revenue performance. 
                All returns are calculated and distributed based on actual revenue from 
                box office, streaming, and distribution sources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4 tracking-tight">Our Team</h2>
              <p>
                Our team combines expertise in finance, technology, and the film industry. 
                We work closely with filmmakers, production companies, and distribution 
                networks to ensure the best outcomes for both investors and creators.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
