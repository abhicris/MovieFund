'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'investor' | 'producer'>('role');
  const [selectedRole, setSelectedRole] = useState<'investor' | 'producer' | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
            Register
          </h1>
          <p className="text-sm font-light text-black mb-8 opacity-70">
            Create your MovieFund account
          </p>

          {step === 'role' && (
            <div className="space-y-4 mt-12">
              <button
                onClick={() => {
                  setSelectedRole('investor');
                  setStep('investor');
                }}
                className="w-full border border-black p-8 text-left hover:bg-black hover:text-white transition-colors"
              >
                <div className="text-xl font-light mb-2">Investor</div>
                <div className="text-sm font-light opacity-70">
                  Invest in movies and earn returns
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedRole('producer');
                  setStep('producer');
                }}
                className="w-full border border-black p-8 text-left hover:bg-black hover:text-white transition-colors"
              >
                <div className="text-xl font-light mb-2">Producer</div>
                <div className="text-sm font-light opacity-70">
                  Submit film plans and raise funding
                </div>
              </button>
            </div>
          )}

          {step === 'investor' && (
            <InvestorRegistrationForm
              onBack={() => setStep('role')}
              onSuccess={() => router.push('/dashboard')}
            />
          )}

          {step === 'producer' && (
            <ProducerRegistrationForm
              onBack={() => setStep('role')}
              onSuccess={() => router.push('/dashboard')}
            />
          )}

          <div className="mt-8 text-center">
            <p className="text-sm font-light text-black opacity-70">
              Already have an account?{' '}
              <Link href="/login" className="text-black hover:text-green-600 underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function InvestorRegistrationForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { register } = await import('@/lib/auth-client');
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'investor',
        phone: formData.phone || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-12">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-light text-black hover:text-green-600 mb-4"
      >
        ← Back
      </button>

      {error && (
        <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-light text-black mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light text-black mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-light text-black mb-2">
          Phone (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-light text-black mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-xs font-light text-black opacity-70 mt-1">
          Minimum 8 characters
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-light text-black mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white px-6 py-4 text-sm font-light tracking-wide hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create Investor Account'}
      </button>
    </form>
  );
}

function ProducerRegistrationForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    productionCompany: '',
    companyRegistration: '',
    taxId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { register } = await import('@/lib/auth-client');
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'producer',
        phone: formData.phone || undefined,
        productionCompany: formData.productionCompany,
        companyRegistration: formData.companyRegistration || undefined,
        taxId: formData.taxId || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-12">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-light text-black hover:text-green-600 mb-4"
      >
        ← Back
      </button>

      {error && (
        <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-light text-black mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light text-black mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-light text-black mb-2">
          Phone (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="productionCompany" className="block text-sm font-light text-black mb-2">
          Production Company Name *
        </label>
        <input
          id="productionCompany"
          type="text"
          value={formData.productionCompany}
          onChange={(e) => setFormData({ ...formData, productionCompany: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="companyRegistration" className="block text-sm font-light text-black mb-2">
          Company Registration Number (Optional)
        </label>
        <input
          id="companyRegistration"
          type="text"
          value={formData.companyRegistration}
          onChange={(e) => setFormData({ ...formData, companyRegistration: e.target.value })}
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="taxId" className="block text-sm font-light text-black mb-2">
          Tax ID (Optional)
        </label>
        <input
          id="taxId"
          type="text"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-light text-black mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-xs font-light text-black opacity-70 mt-1">
          Minimum 8 characters
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-light text-black mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white px-6 py-4 text-sm font-light tracking-wide hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create Producer Account'}
      </button>
    </form>
  );
}
