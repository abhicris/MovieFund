'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';
import { FilmPlanStatus } from '@/types';

export default function FilmPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [filmPlan, setFilmPlan] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, [id]);

  const checkAuthAndFetch = async () => {
    const user = await getCurrentUser();
    if (!user || user.role !== 'producer') {
      router.push('/login');
      return;
    }
    await Promise.all([fetchFilmPlan(), fetchDocuments()]);
  };

  const fetchFilmPlan = async () => {
    try {
      const response = await authenticatedFetch(`/api/film-plans/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFilmPlan(data.data);
      } else {
        setError(data.error || 'Failed to fetch film plan');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch film plan');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await authenticatedFetch(`/api/film-plans/${id}/documents`);
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (err) {
      // Documents fetch failed, but not critical
    }
  };

  const handleSubmit = async () => {
    if (filmPlan.status !== 'draft') {
      setError('Only draft film plans can be submitted');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await authenticatedFetch(`/api/film-plans/${id}/submit`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        router.refresh();
        fetchFilmPlan();
      } else {
        setError(data.error || 'Failed to submit film plan');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit film plan');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (!filmPlan) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-light text-black mb-4">Film plan not found</h1>
          <Link href="/producer/film-plans" className="text-sm font-light text-black hover:text-green-600">
            Back to Film Plans
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/producer/film-plans"
          className="text-sm font-light text-black hover:text-green-600 mb-8 inline-block"
        >
          ← Back to Film Plans
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl font-light text-black tracking-tight">{filmPlan.title}</h1>
              <span className={`text-xs px-3 py-1 rounded ${getStatusColor(filmPlan.status)}`}>
                {filmPlan.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            {filmPlan.tagline && (
              <p className="text-lg font-light text-black italic">{filmPlan.tagline}</p>
            )}
          </div>
          {filmPlan.status === 'draft' && (
            <div className="flex gap-4">
              <Link
                href={`/producer/film-plans/${id}/edit`}
                className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-black text-white px-6 py-3 text-sm font-light tracking-wide hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-8">
            {error}
          </div>
        )}

        {filmPlan.rejectionReason && (
          <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-8">
            <strong>Rejection Reason:</strong> {filmPlan.rejectionReason}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Details */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-light text-black mb-4 tracking-tight">Details</h2>
              <div className="space-y-4 text-sm font-light text-black">
                <div>
                  <span className="opacity-70">Director:</span> {filmPlan.director}
                </div>
                <div>
                  <span className="opacity-70">Producer:</span> {filmPlan.producer}
                </div>
                <div>
                  <span className="opacity-70">Production Company:</span> {filmPlan.productionCompany}
                </div>
                <div>
                  <span className="opacity-70">Language:</span> {filmPlan.language}
                </div>
                <div>
                  <span className="opacity-70">Genre:</span> {filmPlan.genre.join(', ')}
                </div>
                <div>
                  <span className="opacity-70">Release Date:</span> {new Date(filmPlan.releaseDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="opacity-70">Budget:</span> {formatCurrency(filmPlan.budget)}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-black mb-4 tracking-tight">Description</h2>
              <p className="text-sm font-light text-black leading-relaxed">{filmPlan.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-black mb-4 tracking-tight">Cast</h2>
              <div className="flex flex-wrap gap-2">
                {filmPlan.cast.map((actor: string, index: number) => (
                  <span
                    key={index}
                    className="border border-black px-4 py-2 text-sm font-light text-black"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Financial Projections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-light text-black mb-4 tracking-tight">Revenue Projections</h2>
              <div className="space-y-4">
                <div className="border border-black p-4">
                  <div className="text-xs font-light text-black mb-2 opacity-70">Box Office</div>
                  <div className="text-2xl font-light text-black">{formatCurrency(filmPlan.revenueProjection.boxOffice)}</div>
                </div>
                <div className="border border-black p-4">
                  <div className="text-xs font-light text-black mb-2 opacity-70">Streaming</div>
                  <div className="text-2xl font-light text-black">{formatCurrency(filmPlan.revenueProjection.streaming)}</div>
                </div>
                <div className="border border-black p-4">
                  <div className="text-xs font-light text-black mb-2 opacity-70">Distribution</div>
                  <div className="text-2xl font-light text-black">{formatCurrency(filmPlan.revenueProjection.distribution)}</div>
                </div>
                <div className="border border-black p-4 bg-black text-white">
                  <div className="text-xs font-light mb-2 opacity-70">Total Projected</div>
                  <div className="text-2xl font-light">{formatCurrency(filmPlan.revenueProjection.total)}</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-black mb-4 tracking-tight">Returns Projection</h2>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((year) => (
                  <div key={year} className="border border-black p-4 text-center">
                    <div className="text-xs font-light text-black mb-2 opacity-70">Year {year}</div>
                    <div className="text-xl font-light text-green-600">
                      {filmPlan.returnsProjection[`year${year}`]}%
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Documents */}
        <section className="border-t border-black pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-black tracking-tight">Documents</h2>
            {filmPlan.status === 'draft' && (
              <Link
                href={`/producer/film-plans/${id}/documents`}
                className="border border-black px-4 py-2 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
              >
                + Upload Document
              </Link>
            )}
          </div>
          {documents.length === 0 ? (
            <p className="text-sm font-light text-black opacity-70">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-black p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-light text-black">{doc.title}</div>
                    <div className="text-xs font-light text-black opacity-70">
                      {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {doc.isVerified && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        Verified
                      </span>
                    )}
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-light text-black hover:text-green-600 underline"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
