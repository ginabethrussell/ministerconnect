import React, { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  // Get unique events for filter dropdown
  const events = Array.from(new Set(profiles.map((p) => p.event)));

  // Only show profiles with status 'Pending' (not yet reviewed for release)
  let filtered = profiles.filter((p) => p.status === 'Pending');
  if (filterEvent) filtered = filtered.filter((p) => p.event === filterEvent);
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

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow relative">
      <h1 className="text-3xl font-bold text-efcaText mb-6">Review Candidate Profiles</h1>
      <p className="mb-4 text-efcaMuted">
        Showing only profiles submitted and awaiting review for release to church visibility.
      </p>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div>
          <label className="block text-efcaMuted text-sm font-semibold mb-1">Sort By</label>
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt')}
          >
            <option value="name">Name (A-Z)</option>
            <option value="createdAt">Newest</option>
          </select>
        </div>
        <div>
          <label className="block text-efcaMuted text-sm font-semibold mb-1">Filter by Event</label>
          <select
            className="input-field"
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>
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
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-efcaAccent underline text-xs mb-2"
                >
                  View Resume
                </a>
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
    </div>
  );
};

export default AdminReview;
