export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Investor",
      quote: "I've invested in three movies through MovieFund and already received returns from two. The platform is transparent and the returns are real.",
    },
    {
      name: "Priya Sharma",
      role: "Film Enthusiast",
      quote: "As a movie lover, being able to invest in films I believe in is a dream come true. Plus, the returns have been excellent.",
    },
    {
      name: "Amit Patel",
      role: "Portfolio Investor",
      quote: "MovieFund has become a key part of my alternative investment strategy. The diversification and returns are impressive.",
    },
  ];

  return (
    <section className="border-b border-black bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            What Investors Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border border-black p-8 bg-white">
              <p className="text-sm font-light leading-relaxed text-black mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="text-sm font-light text-black">{testimonial.name}</div>
                <div className="text-xs font-light text-black opacity-70">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
