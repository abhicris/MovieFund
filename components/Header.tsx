'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth-client';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'investor') return '/investor/dashboard';
    if (user.role === 'producer') return '/producer/film-plans';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

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
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
                    >
                      Dashboard
                    </Link>
                    {user.role === 'producer' && (
                      <Link
                        href="/producer/film-plans"
                        className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
                      >
                        Film Plans
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/film-plans"
                        className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
                      >
                        Admin
                      </Link>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-light text-black opacity-70">
                        {user.name}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-light text-black hover:text-green-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                    <Link
                      href="/login"
                      className="text-sm font-light text-black hover:text-green-600 transition-colors tracking-wide"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-black text-white px-6 py-2 text-sm font-light tracking-wide hover:bg-green-600 transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
