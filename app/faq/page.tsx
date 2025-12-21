import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is fractional movie investment?",
      answer: "Fractional movie investment allows you to purchase lots in a film project. Each lot represents 0.1% of the movie's total budget. Instead of investing the full budget, you can invest in multiple lots and own a portion of the movie. Returns are distributed based on your lot ownership.",
    },
    {
      question: "What is the minimum investment?",
      answer: "The minimum investment is one lot, which equals 0.1% of the movie's budget. Lot prices vary by movie budget - smaller films may have lots priced at $2,000-$5,000, while blockbusters may have lots at $200,000-$350,000. You can purchase multiple lots.",
    },
    {
      question: "How do I earn returns?",
      answer: "Returns are generated from multiple revenue sources: box office ticket sales, streaming platform licensing deals, and distribution revenue (international, home video, etc.). Returns are distributed to investors based on their lot ownership.",
    },
    {
      question: "What happens if a movie doesn't perform well?",
      answer: "Movie investment carries risks, and returns are not guaranteed. If a movie underperforms, investors may receive lower returns or no returns. We provide detailed risk disclosures and encourage investors to diversify their portfolio across multiple movies.",
    },
    {
      question: "Can I sell my lots?",
      answer: "Currently, lots are held until the movie is released and returns are distributed. We are working on a secondary market feature that will allow lot trading in the future.",
    },
    {
      question: "How long does it take to see returns?",
      answer: "Returns typically begin after a movie is released. Box office returns come first (within weeks of release), followed by streaming revenue (usually 3-6 months after release), and distribution revenue (ongoing over several years).",
    },
    {
      question: "What information do I receive about my investment?",
      answer: "You'll receive regular updates on production progress, release dates, box office performance, and revenue reports. All information is available in your dashboard.",
    },
    {
      question: "Are there any fees?",
      answer: "Yes, there are platform fees including structuring fees, management fees, and transaction fees. All fees are clearly disclosed before you invest.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-12 tracking-tight">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-black pb-8">
                <h2 className="text-xl font-light text-black mb-4 tracking-tight">
                  {faq.question}
                </h2>
                <p className="text-sm font-light text-black leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
