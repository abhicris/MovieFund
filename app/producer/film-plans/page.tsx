'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';
import { FilmPlanStatus } from '@/types';

interface FilmPlan {
  id: string;
  title: string;
  status: FilmPlanStatus;
  budget: number;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function FilmPlansPage() {
  const router = useRouter();
  const [filmPlans, setFilmPlans] = useState<FilmPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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
    fetchFilmPlans(currentUser.id);
  };

  const fetchFilmPlans = async (userId: string) => {
    try {
      const response = await authenticatedFetch('/api/film-plans?producer_id=' + userId);
      const data = await response.json();
      
      if (data.success) {
        setFilmPlans(data.data);
      } else {
        setError(data.error || 'Failed to fetch film plans');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch film plans');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: FilmPlanStatus) => {
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
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
              Film Plans
            </h1>
            <p className="text-sm font-light text-black opacity-70">
              Manage your film plan submissions
            </p>
          </div>
          <Link
            href="/producer/film-plans/new"
            className="bg-black text-white px-6 py-3 text-sm font-light tracking-wide hover:bg-green-600 transition-colors"
          >
            + New Film Plan
          </Link>
        </div>

        {error && (
          <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-8">
            {error}
          </div>
        )}

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
            {filmPlans.map((plan) => (
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
                      <span>Budget: {formatCurrency(plan.budget)}</span>
                      {plan.submittedAt && (
                        <span>Submitted: {new Date(plan.submittedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {plan.rejectionReason && (
                      <p className="text-sm font-light text-red-600 mt-2">
                        Rejection: {plan.rejectionReason}
                      </p>
                    )}
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
      <Footer />
    </main>
  );
}
