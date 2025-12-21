export default function Services() {
  const services = [
    {
      title: "Diversified Portfolio",
      description: "Invest across multiple movies, genres, and languages to build a diversified entertainment investment portfolio.",
    },
    {
      title: "Transparent Returns",
      description: "Clear revenue projections and regular updates on box office performance, streaming deals, and distribution income.",
    },
    {
      title: "Expert Curation",
      description: "Our team of film industry experts carefully selects projects with strong commercial potential and experienced filmmakers.",
    },
    {
      title: "Low Entry Barrier",
      description: "Start investing with as little as $300. Fractional ownership makes movie investment accessible to everyone.",
    },
  ];

  return (
    <section className="border-b border-black bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Why MovieFund
          </h2>
          <p className="text-sm font-light text-black max-w-2xl leading-relaxed">
            We make movie investment accessible, transparent, and profitable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="border border-black p-8 bg-white">
              <h3 className="text-xl font-light mb-4 tracking-tight text-black">
                {service.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-black">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
