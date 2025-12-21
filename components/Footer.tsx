import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black bg-white mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-light text-black mb-4 tracking-tight">MovieFund</h3>
            <p className="text-sm font-light text-black leading-relaxed">
              Fractional movie investment platform. Invest in films and earn returns from box office, streaming, and distribution revenue.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-light text-black mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/opportunities" className="text-sm font-light text-black hover:text-green-600 transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm font-light text-black hover:text-green-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-light text-black hover:text-green-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-light text-black mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm font-light text-black hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm font-light text-black hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm font-light text-black hover:text-green-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-light text-black mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm font-light text-black">hi@moviefund.in</li>
              <li className="text-sm font-light text-black">+91 70042 80285</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black pt-8">
          <p className="text-xs font-light text-black text-center">
            © {new Date().getFullYear()} MovieFund. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
