'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';

export default function PortfolioPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'investor') {
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    // TODO: Fetch investments from API when endpoint is ready
    // For now, show placeholder
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredInvestments = investments.filter((inv) => {
    if (filter === 'all') return true;
    if (filter === 'active') return inv.status === 'active' || inv.status === 'confirmed';
    if (filter === 'completed') return inv.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <p className="text-sm font-light text-black">Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
            Investment Portfolio
          </h1>
          <p className="text-sm font-light text-black opacity-70">
            Track your investments and returns
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all ${
              filter === 'active'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 text-sm font-light tracking-wide border border-black transition-all ${
              filter === 'completed'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Investments List */}
        {investments.length === 0 ? (
          <div className="border border-black p-12 text-center">
            <p className="text-sm font-light text-black mb-4">
              No investments yet
            </p>
            <Link
              href="/opportunities"
              className="text-sm font-light text-black hover:text-green-600 underline"
            >
              Browse investment opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <div key={investment.id} className="border border-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-light text-black mb-2">
                      {investment.movieTitle}
                    </h3>
                    <div className="flex items-center gap-6 text-sm font-light text-black opacity-70">
                      <span>{investment.lots} lots</span>
                      <span>Invested: {formatCurrency(investment.totalAmount)}</span>
                      <span>Returns: {formatCurrency(investment.returnsEarned)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded ${
                      investment.status === 'active' ? 'bg-green-100 text-green-800' :
                      investment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {investment.status}
                    </span>
                    <Link
                      href={`/opportunities/${investment.movieId}`}
                      className="text-sm font-light text-black hover:text-green-600"
                    >
                      View →
                    </Link>
                  </div>
                </div>
                {investment.returnsEarned > 0 && (
                  <div className="border-t border-black pt-4 mt-4">
                    <div className="text-sm font-light text-black">
                      <span className="opacity-70">Total Returns Earned:</span>{' '}
                      <span className="text-green-600 font-medium">
                        {formatCurrency(investment.returnsEarned)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Summary */}
        {investments.length > 0 && (
          <div className="mt-12 border-t border-black pt-12">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Portfolio Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-black p-6">
                <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                  Total Invested
                </div>
                <div className="text-2xl font-light text-black">
                  {formatCurrency(
                    investments.reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0)
                  )}
                </div>
              </div>
              <div className="border border-black p-6">
                <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                  Total Returns
                </div>
                <div className="text-2xl font-light text-green-600">
                  {formatCurrency(
                    investments.reduce((sum, inv) => sum + (parseFloat(inv.returnsEarned) || 0), 0)
                  )}
                </div>
              </div>
              <div className="border border-black p-6">
                <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                  Active Investments
                </div>
                <div className="text-2xl font-light text-black">
                  {investments.filter(inv => inv.status === 'active' || inv.status === 'confirmed').length}
                </div>
              </div>
              <div className="border border-black p-6">
                <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                  Total Lots
                </div>
                <div className="text-2xl font-light text-black">
                  {investments.reduce((sum, inv) => sum + (parseInt(inv.lots) || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
