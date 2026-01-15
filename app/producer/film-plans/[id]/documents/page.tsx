'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticatedFetch, getCurrentUser } from '@/lib/auth-client';
import { DocumentType } from '@/types';

export default function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [filmPlan, setFilmPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    type: 'other' as DocumentType,
    title: '',
    file: null as File | null,
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
    await Promise.all([fetchFilmPlan(), fetchDocuments()]);
  };

  const fetchFilmPlan = async () => {
    try {
      const response = await authenticatedFetch(`/api/film-plans/${id}`);
      const data = await response.json();
      if (data.success) {
        setFilmPlan(data.data);
        if (data.data.status !== 'draft' && data.data.status !== 'submitted') {
          setShowUploadForm(false);
        }
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`/api/film-plans/${id}/documents`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      setUploadData({ ...uploadData, file });
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) {
      setError('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('type', uploadData.type);
      formData.append('title', uploadData.title);

      const token = localStorage.getItem('sessionToken');
      const response = await fetch(`/api/film-plans/${id}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadData({ type: 'other', title: '', file: null });
        setShowUploadForm(false);
        await fetchDocuments();
      } else {
        setError(data.error || 'Failed to upload document');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'script', label: 'Script' },
    { value: 'budget_breakdown', label: 'Budget Breakdown' },
    { value: 'production_agreement', label: 'Production Agreement' },
    { value: 'distribution_agreement', label: 'Distribution Agreement' },
    { value: 'legal_clearance', label: 'Legal Clearance' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'tax_document', label: 'Tax Document' },
    { value: 'other', label: 'Other' },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading && !documents.length) {
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
        <Link
          href={`/producer/film-plans/${id}`}
          className="text-sm font-light text-black hover:text-green-600 mb-8 inline-block"
        >
          ← Back to Film Plan
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-light text-black mb-2 tracking-tight">
              Documents
            </h1>
            <p className="text-sm font-light text-black opacity-70">
              {filmPlan?.title}
            </p>
          </div>
          {(filmPlan?.status === 'draft' || filmPlan?.status === 'submitted') && (
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-black text-white px-6 py-3 text-sm font-light tracking-wide hover:bg-green-600 transition-colors"
            >
              {showUploadForm ? 'Cancel' : '+ Upload Document'}
            </button>
          )}
        </div>

        {error && (
          <div className="border border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-8">
            {error}
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (filmPlan?.status === 'draft' || filmPlan?.status === 'submitted') && (
          <div className="border border-black p-6 mb-8">
            <h2 className="text-xl font-light text-black mb-6 tracking-tight">Upload Document</h2>
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-light text-black mb-2">
                  Document Type *
                </label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as DocumentType })}
                  required
                  className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-light text-black mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                  className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Document title"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-black mb-2">
                  File * (Max 50MB)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="w-full border border-black px-4 py-3 text-sm font-light text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                {uploadData.file && (
                  <p className="text-xs font-light text-black opacity-70 mt-2">
                    Selected: {uploadData.file.name} ({formatFileSize(uploadData.file.size)})
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading || !uploadData.file || !uploadData.title}
                  className="bg-black text-white px-6 py-3 text-sm font-light tracking-wide hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadData({ type: 'other', title: '', file: null });
                    setError('');
                  }}
                  className="border border-black px-6 py-3 text-sm font-light tracking-wide text-black hover:bg-black hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Documents List */}
        <div>
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Uploaded Documents</h2>
          {documents.length === 0 ? (
            <div className="border border-black p-12 text-center">
              <p className="text-sm font-light text-black mb-4">
                No documents uploaded yet
              </p>
              {(filmPlan?.status === 'draft' || filmPlan?.status === 'submitted') && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="text-sm font-light text-black hover:text-green-600 underline"
                >
                  Upload your first document
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-black p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-light text-black">{doc.title}</h3>
                        <span className="text-xs px-3 py-1 border border-black text-black">
                          {doc.type.replace('_', ' ')}
                        </span>
                        {doc.isVerified && (
                          <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm font-light text-black opacity-70">
                        <span>{doc.fileName}</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        {doc.verifiedAt && (
                          <span>Verified: {new Date(doc.verifiedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
