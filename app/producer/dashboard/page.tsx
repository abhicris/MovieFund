'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';

export default function ProducerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [filmPlans, setFilmPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    submittedPlans: 0,
    approvedPlans: 0,
    rejectedPlans: 0,
    totalBudget: 0,
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
    if (currentUser.role !== 'producer') {
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    await fetchFilmPlans(currentUser.id);
  };

  const fetchFilmPlans = async (userId: string) => {
    try {
      const response = await authenticatedFetch(`/api/film-plans?producer_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        const plans = data.data;
        setFilmPlans(plans);
        
        // Calculate stats
        setStats({
          totalPlans: plans.length,
          submittedPlans: plans.filter((p: any) => p.status === 'submitted' || p.status === 'under_review').length,
          approvedPlans: plans.filter((p: any) => p.status === 'approved' || p.status === 'published').length,
          rejectedPlans: plans.filter((p: any) => p.status === 'rejected').length,
          totalBudget: plans.reduce((sum: number, p: any) => sum + (parseFloat(p.budget) || 0), 0),
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch film plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'published':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            Producer Dashboard
          </h1>
          <p className="text-sm font-light text-black opacity-70">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Account Status */}
        {user?.accountStatus === 'pending' && (
          <div className="border border-yellow-500 bg-yellow-50 p-4 text-sm text-yellow-800 mb-8">
            Your account is pending verification. You'll be able to submit film plans once verified by an admin.
          </div>
        )}

        {user?.accountStatus === 'verified' && (
          <div className="border border-green-500 bg-green-50 p-4 text-sm text-green-800 mb-8">
            ✓ Your account is verified. You can now submit film plans for review.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Total Film Plans
            </div>
            <div className="text-3xl font-light text-black">
              {stats.totalPlans}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Under Review
            </div>
            <div className="text-3xl font-light text-yellow-600">
              {stats.submittedPlans}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Approved
            </div>
            <div className="text-3xl font-light text-green-600">
              {stats.approvedPlans}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Rejected
            </div>
            <div className="text-3xl font-light text-red-600">
              {stats.rejectedPlans}
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
              Total Budget
            </div>
            <div className="text-2xl font-light text-black">
              {formatCurrency(stats.totalBudget)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/producer/film-plans/new"
              className="bg-black text-white px-6 py-3 text-sm font-light tracking-wide hover:bg-green-600 transition-colors"
            >
              + New Film Plan
            </Link>
            <Link
              href="/producer/film-plans"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              View All Film Plans
            </Link>
            <Link
              href="/producer/payments"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              Payment Setup
            </Link>
            <Link
              href="/producer/settings"
              className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Recent Film Plans */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-black tracking-tight">Recent Film Plans</h2>
            <Link
              href="/producer/film-plans"
              className="text-sm font-light text-black hover:text-green-600"
            >
              View All →
            </Link>
          </div>

          {filmPlans.length === 0 ? (
            <div className="border border-black p-12 text-center">
              <p className="text-sm font-light text-black mb-4">
                No film plans yet
              </p>
              <Link
                href="/producer/film-plans/new"
                className="text-sm font-light text-black hover:text-green-600 underline"
              >
                Create your first film plan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filmPlans.slice(0, 5).map((plan) => (
                <Link
                  key={plan.id}
                  href={`/producer/film-plans/${plan.id}`}
                  className="block border border-black p-6 hover:bg-black hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-light">{plan.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded ${getStatusColor(plan.status)}`}>
                          {plan.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-light opacity-70">
                        <span>Budget: {formatCurrency(parseFloat(plan.budget))}</span>
                        {plan.submittedAt && (
                          <span>Submitted: {new Date(plan.submittedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-light opacity-70">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="mt-12 border-t border-black pt-12">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-light text-black mb-2 opacity-70 uppercase tracking-wider">
                Production Company
              </div>
              <div className="text-sm font-light text-black">{user?.productionCompany || 'N/A'}</div>
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
                Payment Account
              </div>
              <div className="text-sm font-light text-black">
                {user?.bankAccountConnected ? (
                  <span className="text-green-600">Connected</span>
                ) : (
                  <span className="opacity-70">Not connected</span>
                )}
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
