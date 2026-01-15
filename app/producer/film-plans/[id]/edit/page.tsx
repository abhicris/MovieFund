'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';
import { MovieGenre, MovieLanguage } from '@/types';

export default function EditFilmPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filmPlan, setFilmPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    director: '',
    producer: '',
    productionCompany: '',
    genre: [] as MovieGenre[],
    language: 'hindi' as MovieLanguage,
    budget: '',
    description: '',
    cast: '',
    releaseDate: '',
    revenueProjection: {
      boxOffice: '',
      streaming: '',
      distribution: '',
    },
    returnsProjection: {
      year1: '',
      year2: '',
      year3: '',
      year4: '',
      year5: '',
    },
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, [id]);

  const checkAuthAndFetch = async () => {
    const user = await getCurrentUser();
    if (!user || user.role !== 'producer') {
      router.push('/login');
      return;
    }
    await fetchFilmPlan();
  };

  const fetchFilmPlan = async () => {
    try {
      const response = await authenticatedFetch(`/api/film-plans/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const plan = data.data;
        setFilmPlan(plan);
        
        // Check if can edit
        if (plan.status !== 'draft' && plan.status !== 'submitted') {
          router.push(`/producer/film-plans/${id}`);
          return;
        }

        // Pre-fill form
        setFormData({
          title: plan.title || '',
          tagline: plan.tagline || '',
          director: plan.director || '',
          producer: plan.producer || '',
          productionCompany: plan.productionCompany || '',
          genre: plan.genre || [],
          language: plan.language || 'hindi',
          budget: plan.budget?.toString() || '',
          description: plan.description || '',
          cast: plan.cast?.join(', ') || '',
          releaseDate: plan.releaseDate ? new Date(plan.releaseDate).toISOString().split('T')[0] : '',
          revenueProjection: {
            boxOffice: plan.revenueProjection?.boxOffice?.toString() || '',
            streaming: plan.revenueProjection?.streaming?.toString() || '',
            distribution: plan.revenueProjection?.distribution?.toString() || '',
          },
          returnsProjection: {
            year1: plan.returnsProjection?.year1?.toString() || '',
            year2: plan.returnsProjection?.year2?.toString() || '',
            year3: plan.returnsProjection?.year3?.toString() || '',
            year4: plan.returnsProjection?.year4?.toString() || '',
            year5: plan.returnsProjection?.year5?.toString() || '',
          },
        });
      } else {
        setError(data.error || 'Failed to fetch film plan');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch film plan');
    } finally {
      setLoading(false);
    }
  };

  const genres: MovieGenre[] = [
    'action', 'drama', 'comedy', 'thriller', 'romance',
    'horror', 'sci-fi', 'documentary', 'animation', 'fantasy'
  ];

  const languages: MovieLanguage[] = [
    'hindi', 'english', 'spanish', 'tamil', 'telugu',
    'malayalam', 'kannada', 'bengali', 'marathi'
  ];

  const handleGenreToggle = (genre: MovieGenre) => {
    setFormData({
      ...formData,
      genre: formData.genre.includes(genre)
        ? formData.genre.filter(g => g !== genre)
        : [...formData.genre, genre],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validation
    if (formData.genre.length === 0) {
      setError('Please select at least one genre');
      setSaving(false);
      return;
    }

    if (!formData.cast.trim()) {
      setError('Please enter at least one cast member');
      setSaving(false);
      return;
    }

    try {
      const castArray = formData.cast.split(',').map(c => c.trim()).filter(c => c);

      const revenueTotal = 
        parseFloat(formData.revenueProjection.boxOffice) +
        parseFloat(formData.revenueProjection.streaming) +
        parseFloat(formData.revenueProjection.distribution);

      const response = await authenticatedFetch(`/api/film-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: formData.title,
          tagline: formData.tagline || undefined,
          director: formData.director,
          producer: formData.producer,
          productionCompany: formData.productionCompany,
          genre: formData.genre,
          language: formData.language,
          budget: parseFloat(formData.budget),
          description: formData.description,
          cast: castArray,
          releaseDate: formData.releaseDate,
          revenueProjection: {
            boxOffice: parseFloat(formData.revenueProjection.boxOffice),
            streaming: parseFloat(formData.revenueProjection.streaming),
            distribution: parseFloat(formData.revenueProjection.distribution),
            total: revenueTotal,
          },
          returnsProjection: {
            year1: parseFloat(formData.returnsProjection.year1),
            year2: parseFloat(formData.returnsProjection.year2),
            year3: parseFloat(formData.returnsProjection.year3),
            year4: parseFloat(formData.returnsProjection.year4),
            year5: parseFloat(formData.returnsProjection.year5),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/producer/film-plans/${id}`);
      } else {
        setError(data.error || 'Failed to update film plan');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update film plan');
    } finally {
      setSaving(false);
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
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/producer/film-plans/${id}`}
            className="text-sm font-light text-black hover:text-green-600 mb-8 inline-block"
          >
            ← Back to Film Plan
          </Link>

          <h1 className="text-5xl md:text-6xl font-light text-black mb-8 tracking-tight">
            Edit Film Plan
          </h1>

          {error && (
            <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section className="border-t border-black pt-8">
              <h2 className="text-2xl font-light text-black mb-6 tracking-tight">
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-black mb-2">
                      Director *
                    </label>
                    <input
                      type="text"
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      required
                      className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-black mb-2">
                      Producer *
                    </label>
                    <input
                      type="text"
                      value={formData.producer}
                      onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                      required
                      className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Production Company *
                  </label>
                  <input
                    type="text"
                    value={formData.productionCompany}
                    onChange={(e) => setFormData({ ...formData, productionCompany: e.target.value })}
                    required
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </section>

            {/* Classification */}
            <section className="border-t border-black pt-8">
              <h2 className="text-2xl font-light text-black mb-6 tracking-tight">
                Classification
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Genre * (Select at least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-4 py-2 text-sm font-light border border-black transition-colors ${
                          formData.genre.includes(genre)
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Language *
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as MovieLanguage })}
                    required
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Financial Information */}
            <section className="border-t border-black pt-8">
              <h2 className="text-2xl font-light text-black mb-6 tracking-tight">
                Financial Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Budget (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                    min="0"
                    step="1000"
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-4">
                    Revenue Projections (USD) *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-light text-black mb-2 opacity-70">
                        Box Office
                      </label>
                      <input
                        type="number"
                        value={formData.revenueProjection.boxOffice}
                        onChange={(e) => setFormData({
                          ...formData,
                          revenueProjection: { ...formData.revenueProjection, boxOffice: e.target.value }
                        })}
                        required
                        min="0"
                        className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light text-black mb-2 opacity-70">
                        Streaming
                      </label>
                      <input
                        type="number"
                        value={formData.revenueProjection.streaming}
                        onChange={(e) => setFormData({
                          ...formData,
                          revenueProjection: { ...formData.revenueProjection, streaming: e.target.value }
                        })}
                        required
                        min="0"
                        className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light text-black mb-2 opacity-70">
                        Distribution
                      </label>
                      <input
                        type="number"
                        value={formData.revenueProjection.distribution}
                        onChange={(e) => setFormData({
                          ...formData,
                          revenueProjection: { ...formData.revenueProjection, distribution: e.target.value }
                        })}
                        required
                        min="0"
                        className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-4">
                    Returns Projection (%) *
                  </label>
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((year) => (
                      <div key={year}>
                        <label className="block text-xs font-light text-black mb-2 opacity-70">
                          Year {year}
                        </label>
                        <input
                          type="number"
                          value={formData.returnsProjection[`year${year}` as keyof typeof formData.returnsProjection]}
                          onChange={(e) => setFormData({
                            ...formData,
                            returnsProjection: {
                              ...formData.returnsProjection,
                              [`year${year}`]: e.target.value
                            }
                          })}
                          required
                          min="0"
                          max="1000"
                          step="0.1"
                          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Cast & Release */}
            <section className="border-t border-black pt-8">
              <h2 className="text-2xl font-light text-black mb-6 tracking-tight">
                Cast & Release
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Cast * (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.cast}
                    onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    required
                    placeholder="Actor 1, Actor 2, Actor 3"
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Release Date *
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    required
                    className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </section>

            <div className="flex gap-4 pt-8 border-t border-black">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-8 py-4 text-sm font-light tracking-wide hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/producer/film-plans/${id}`}
                className="border border-black px-8 py-4 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
