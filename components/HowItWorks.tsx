export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse Movies",
      description: "Explore curated film projects across genres, languages, and budgets. Review detailed information about directors, cast, and revenue projections.",
    },
    {
      number: "02",
      title: "Invest in Shares",
      description: "Purchase fractional shares in movies that align with your investment goals. Minimum investment starts at ₹25,000 per share.",
    },
    {
      number: "03",
      title: "Track Production",
      description: "Follow your investment as the movie moves through pre-production, production, and post-production phases.",
    },
    {
      number: "04",
      title: "Earn Returns",
      description: "Receive returns from box office revenue, streaming deals, and distribution income based on your share ownership.",
    },
  ];

  return (
    <section className="border-b border-black bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm font-light text-black max-w-2xl leading-relaxed">
            Simple, transparent, and accessible. Invest in movies in four easy steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="border border-black p-8 bg-white hover:bg-black hover:text-white transition-all duration-300 group">
              <div className="text-6xl font-light text-black group-hover:text-white mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-light mb-4 tracking-tight text-black group-hover:text-white">
                {step.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-black group-hover:text-white">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
