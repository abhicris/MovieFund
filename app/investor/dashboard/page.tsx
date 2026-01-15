'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    totalLots: 0,
  });

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
            Investor Dashboard
          </h1>
          <p className="text-sm font-light text-black opacity-70">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Account Status */}
        {user?.accountStatus === 'pending' && (
          <div className="border border-yellow-500 bg-yellow-50 p-4 text-sm text-yellow-800 mb-8">
            Your account is pending verification. You'll be able to invest once verified.
          </div>
        )}

        {user?.kycStatus === 'pending' && user?.accountStatus === 'verified' && (
          <div className="border border-blue-500 bg-blue-50 p-4 text-sm text-blue-800 mb-8">
            <div className="flex items-center justify-between">
              <span>KYC verification required to make investments</span>
              <Link
                href="/investor/kyc"
                className="underline hover:text-blue-900"
              >
                Complete KYC
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Total Invested
            </div>
            <div className="text-3xl font-light text-black">
              {formatCurrency(stats.totalInvested)}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Total Returns
            </div>
            <div className="text-3xl font-light text-green-600">
              {formatCurrency(stats.totalReturns)}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Active Investments
            </div>
            <div className="text-3xl font-light text-black">
              {stats.activeInvestments}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Total Lots Owned
            </div>
            <div className="text-3xl font-light text-black">
              {stats.totalLots}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/opportunities"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              Browse Movies
            </Link>
            <Link
              href="/investor/portfolio"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              href="/investor/kyc"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              KYC Verification
            </Link>
            <Link
              href="/investor/settings"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Recent Investments */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-black tracking-tight">Recent Investments</h2>
            <Link
              href="/investor/portfolio"
              className="text-sm font-light text-black hover:text-green-600"
            >
              View All →
            </Link>
          </div>

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
              {investments.map((investment) => (
                <div key={investment.id} className="border border-black p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-light text-black mb-2">
                        {investment.movieTitle}
                      </h3>
                      <div className="flex items-center gap-6 text-sm font-light text-black opacity-70">
                        <span>{investment.lots} lots</span>
                        <span>{formatCurrency(investment.totalAmount)}</span>
                        <span className={`px-2 py-1 rounded ${
                          investment.status === 'active' ? 'bg-green-100 text-green-800' :
                          investment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {investment.status}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/opportunities/${investment.movieId}`}
                      className="text-sm font-light text-black hover:text-green-600"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="mt-12 border-t border-black pt-12">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                Email
              </div>
              <div className="text-sm font-light text-black">{user?.email}</div>
            </div>
            <div>
              <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                Account Status
              </div>
              <div className="text-sm font-light text-black">
                <span className={`px-2 py-1 rounded ${
                  user?.accountStatus === 'verified' ? 'bg-green-100 text-green-800' :
                  user?.accountStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user?.accountStatus}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                KYC Status
              </div>
              <div className="text-sm font-light text-black">
                <span className={`px-2 py-1 rounded ${
                  user?.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                  user?.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user?.kycStatus || 'pending'}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                Member Since
              </div>
              <div className="text-sm font-light text-black">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
