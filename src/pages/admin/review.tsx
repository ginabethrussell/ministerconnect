import React, { useEffect, useState } from 'react';
import PDFViewer from '../../components/PDFViewer';

interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  event: string;
  status: string;
  createdAt: string;
  phone?: string;
  resumeUrl?: string;
  videoUrl?: string;
  // Add more fields as needed
}

// Mock fetch function (replace with real API call or MSW handler)
const fetchCandidates = async (): Promise<CandidateProfile[]> => {
  const res = await fetch('/api/candidates?status=pending');
  return res.json();
};

const patchCandidateStatus = async (id: string, status: string) => {
  await fetch(`/api/candidates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

const AdminReview = () => {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [filterEvent, setFilterEvent] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    fetchCandidates().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  // Get unique events for filter dropdown
  const events = Array.from(new Set(profiles.map((p) => p.event)));

  // Filter profiles based on status and event
  let filtered = profiles;
  if (filterStatus !== 'all') {
    filtered = filtered.filter((p) => p.status === filterStatus);
  }
  if (filterEvent) {
    filtered = filtered.filter((p) => p.event === filterEvent);
  }
  
  // Sort filtered results
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'createdAt') return b.createdAt.localeCompare(a.createdAt);
    return 0;
  });

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    await patchCandidateStatus(id, status);
    setActionLoadingId(null);
    setLoading(true);
    fetchCandidates().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  };

  const handleViewResume = (resumeUrl: string, candidateName: string) => {
    setPdfViewer({
      isOpen: true,
      url: resumeUrl,
      title: `${candidateName}'s Resume`,
    });
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Review Candidate Profiles</h1>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'all'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({profiles.length})
            </button>
            <button
              onClick={() => setFilterStatus('Pending')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'Pending'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({profiles.filter((p) => p.status === 'Pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('Approved')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'Approved'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({profiles.filter((p) => p.status === 'Approved').length})
            </button>
          </div>

          {loading ? (
            <div className="text-efcaMuted">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-efcaMuted">No candidate profiles found.</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((profile) => (
                <div key={profile.id} className="bg-white rounded shadow p-4 flex flex-col h-full">
                  <div className="font-bold text-lg text-efcaText mb-1">{profile.name}</div>
                  <div className="text-sm text-gray-600 mb-1 break-all">{profile.email}</div>
                  <div className="text-xs text-efcaMuted mb-2">Event: {profile.event}</div>
                  <div className="text-xs text-efcaMuted mb-2">Submitted: {profile.createdAt}</div>
                  <div className="text-xs text-efcaMuted mb-2">Status: {profile.status}</div>
                  {profile.phone && (
                    <div className="text-xs text-gray-500 mb-2">Phone: {profile.phone}</div>
                  )}
                  {profile.resumeUrl && (
                    <div className="flex gap-2 mb-2">
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-efcaAccent underline text-xs"
                      >
                        View Resume
                      </a>
                      <button
                        onClick={() => handleViewResume(profile.resumeUrl!, profile.name)}
                        className="text-efcaAccent underline text-xs"
                      >
                        Preview
                      </button>
                    </div>
                  )}
                  {profile.videoUrl && (
                    <a
                      href={profile.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline text-xs mb-2"
                    >
                      View Video
                    </a>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      className="btn-primary flex-1 disabled:opacity-50"
                      disabled={actionLoadingId === profile.id}
                      onClick={() => handleStatus(profile.id, 'approved')}
                    >
                      {actionLoadingId === profile.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      className="btn-secondary flex-1 disabled:opacity-50"
                      disabled={actionLoadingId === profile.id}
                      onClick={() => handleStatus(profile.id, 'rejected')}
                    >
                      {actionLoadingId === profile.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      
      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer(prev => ({ ...prev, isOpen: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
    </div>
  );
};

export default AdminReview;
