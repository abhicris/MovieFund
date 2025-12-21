import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight text-black">
            MovieFund
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/opportunities"
              className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
            >
              Movies
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
            >
              Dashboard
            </Link>
            <Link
              href="/about"
              className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
            >
              FAQ
            </Link>
            <a
              href="https://docs.moviebitfund.kcolbchain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
            >
              Docs
            </a>
            <Link
              href="/invest"
              className="bg-black text-white px-6 py-2 text-sm font-light tracking-wide hover:bg-green-600 transition-colors"
            >
              Invest Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
