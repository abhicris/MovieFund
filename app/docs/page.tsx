import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type DocItem = 
  | {
      title: string;
      description: string;
      file: string;
      icon: string;
    }
  | {
      title: string;
      description: string;
      file: null;
      icon: string;
      external: boolean;
      link: string;
      comingSoon?: boolean;
    };

export default function DocsPage() {
  const docs: Array<{
    category: string;
    items: DocItem[];
  }> = [
    {
      category: "Business & Strategy",
      items: [
        {
          title: "CEO & Product Roadmap",
          description: "Comprehensive roadmap for legal, pricing, onboarding, seed round, and pilot launch. Timeline: 3-6 months to launch.",
          file: "CEO_PRODUCT_ROADMAP.md",
          icon: "📋",
        },
        {
          title: "Business Model",
          description: "Detailed business model, revenue streams, pricing strategy, and financial projections.",
          file: "BUSINESS_MODEL.md",
          icon: "💼",
        },
        {
          title: "Platform Plan",
          description: "Technical platform planning, features, architecture, and development considerations.",
          file: "PLATFORM_PLAN.md",
          icon: "🏗️",
        },
      ],
    },
    {
      category: "Operations",
      items: [
        {
          title: "Movie Operations Guide",
          description: "Complete guide for onboarding movies, managing production lifecycle, revenue tracking, and distribution.",
          file: "MOVIE_OPERATIONS.md",
          icon: "🎬",
        },
        {
          title: "Legal Agreements & Templates",
          description: "All required legal agreements, templates, compliance requirements, and regulatory considerations.",
          file: "LEGAL_AGREEMENTS.md",
          icon: "⚖️",
        },
        {
          title: "Partnership Strategy",
          description: "Partnership models, target partners, relationship management, and partnership development process.",
          file: "PARTNERSHIPS.md",
          icon: "🤝",
        },
      ],
    },
    {
      category: "Marketing & Launch",
      items: [
        {
          title: "Marketing & Launch Plan",
          description: "Complete marketing strategy, launch plan, channels, budget, and success metrics for 6-month launch.",
          file: "MARKETING_LAUNCH_PLAN.md",
          icon: "🚀",
        },
      ],
    },
    {
      category: "Development",
      items: [
        {
          title: "Developer Roadmap",
          description: "Technical development roadmap from alpha demo to production. 6 phases over 6-12 months.",
          file: "DEV_ROADMAP.md",
          icon: "💻",
        },
        {
          title: "Demo Status",
          description: "Current alpha demo status, what's working, what's planned for later, and how to add movies.",
          file: "DEMO_STATUS.md",
          icon: "🔬",
        },
      ],
    },
    {
      category: "Investor Materials",
      items: [
        {
          title: "Investor Deck",
          description: "Pitch deck and presentation for seed round investors. Link to Gamma presentation will be added here.",
          file: null,
          icon: "📊",
          external: true,
          link: "#", // Update this link when Gamma presentation is ready
          comingSoon: true,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-black mb-4 tracking-wide">
            Documentation
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Comprehensive documentation for MovieFund operations, development, and business strategy.
          </p>
        </div>

        {docs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-light text-black mb-6 tracking-wide border-b border-gray-200 pb-2">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((doc, docIndex) => (
                <div
                  key={docIndex}
                  className="border border-gray-200 rounded-lg p-6 hover:border-green-600 transition-colors bg-white"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{doc.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-light text-black mb-2 tracking-wide">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-light mb-4 leading-relaxed">
                        {doc.description}
                      </p>
                      {doc.file === null ? (
                        doc.comingSoon ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Coming Soon
                            </span>
                            {doc.link && doc.link !== "#" && (
                              <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-green-600 hover:text-green-700 font-light"
                              >
                                View Deck →
                              </a>
                            )}
                          </div>
                        ) : (
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-700 font-light inline-flex items-center gap-1"
                          >
                            View Document →
                          </a>
                        )
                      ) : (
                        <a
                          href={`https://github.com/abhicris/MovieFund/blob/main/${doc.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-700 font-light inline-flex items-center gap-1"
                        >
                          View on GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-light text-black mb-4 tracking-wide">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-black mb-2">For Investors</h4>
              <ul className="space-y-1 text-gray-600 font-light">
                <li>• Business Model</li>
                <li>• CEO & Product Roadmap</li>
                <li>• Investor Deck (Coming Soon)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-2">For Production Companies</h4>
              <ul className="space-y-1 text-gray-600 font-light">
                <li>• Movie Operations Guide</li>
                <li>• Partnership Strategy</li>
                <li>• Legal Agreements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-2">For Developers</h4>
              <ul className="space-y-1 text-gray-600 font-light">
                <li>• Developer Roadmap</li>
                <li>• Platform Plan</li>
                <li>• Demo Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-2">For Marketing</h4>
              <ul className="space-y-1 text-gray-600 font-light">
                <li>• Marketing & Launch Plan</li>
                <li>• Partnership Strategy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 font-light">
          <p>
            All documentation is maintained in the repository and updated regularly.
            Last updated: December 2025
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
