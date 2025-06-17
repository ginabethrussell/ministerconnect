import React, { useEffect, useState } from 'react';

interface ApplicantProfile {
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
const fetchApplicants = async (): Promise<ApplicantProfile[]> => {
  const res = await fetch('/api/applicants?status=pending');
  return res.json();
};

const fetchApplicantProfile = async (id: string): Promise<ApplicantProfile> => {
  // For now, just return the same mock data as the table row
  // In a real app, fetch `/api/applicants/:id` for full details
  const res = await fetch('/api/applicants?status=pending');
  const all = await res.json();
  return all.find((p: ApplicantProfile) => p.id === id);
};

const patchApplicantStatus = async (id: string, status: string) => {
  await fetch(`/api/applicants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

const AdminReview = () => {
  const [profiles, setProfiles] = useState<ApplicantProfile[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [filterEvent, setFilterEvent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerProfile, setDrawerProfile] = useState<ApplicantProfile | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplicants().then((data) => {
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

  // Open drawer and fetch full profile
  const openDrawer = async (id: string) => {
    setSelectedId(id);
    setDrawerLoading(true);
    const profile = await fetchApplicantProfile(id);
    setDrawerProfile(profile);
    setDrawerLoading(false);
  };

  // Approve or reject
  const handleStatus = async (status: 'approved' | 'rejected') => {
    if (!drawerProfile) return;
    setActionLoading(true);
    await patchApplicantStatus(drawerProfile.id, status);
    setActionLoading(false);
    setDrawerProfile(null);
    setSelectedId(null);
    // Refresh list
    setLoading(true);
    fetchApplicants().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow relative">
      <h1 className="text-3xl font-bold text-efcaText mb-6">Review Applicant Profiles</h1>
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
        <div className="text-efcaMuted">No applicant profiles found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm bg-efcaLight">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-efcaBlue/90 text-white">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Event</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile, idx) => (
                <tr key={profile.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="py-3 px-4 align-middle">{profile.name}</td>
                  <td className="py-3 px-4 align-middle">{profile.email}</td>
                  <td className="py-3 px-4 align-middle">{profile.event}</td>
                  <td className="py-3 px-4 align-middle">{profile.status}</td>
                  <td className="py-3 px-4 align-middle">{profile.createdAt}</td>
                  <td className="py-3 px-4 align-middle text-center">
                    <button
                      className="px-3 py-1 bg-efcaAccent text-white text-sm rounded-md hover:bg-efcaAccent/80 transition"
                      title="View"
                      onClick={() => openDrawer(profile.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Side Drawer */}
      {selectedId && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => {
              setSelectedId(null);
              setDrawerProfile(null);
            }}
          />
          {/* Drawer */}
          <div className="ml-auto w-full max-w-md h-full bg-white shadow-xl p-6 overflow-y-auto relative z-50">
            <button
              className="absolute top-4 right-4 text-2xl text-efcaMuted hover:text-efcaAccent"
              onClick={() => {
                setSelectedId(null);
                setDrawerProfile(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
            {drawerLoading || !drawerProfile ? (
              <div className="mt-20 text-center text-efcaMuted">Loading profile...</div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-efcaText mb-2">{drawerProfile.name}</h2>
                <div className="mb-4 text-efcaMuted">{drawerProfile.email}</div>
                <div className="mb-2">
                  <span className="font-semibold">Event:</span> {drawerProfile.event}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span> {drawerProfile.status}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Created:</span> {drawerProfile.createdAt}
                </div>
                {drawerProfile.phone && (
                  <div className="mb-2">
                    <span className="font-semibold">Phone:</span> {drawerProfile.phone}
                  </div>
                )}
                {/* Resume */}
                {drawerProfile.resumeUrl && (
                  <div className="mb-2">
                    <span className="font-semibold">Resume:</span>{' '}
                    <a
                      href={drawerProfile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
                {/* Video */}
                {drawerProfile.videoUrl && (
                  <div className="mb-2">
                    <span className="font-semibold">Video:</span>{' '}
                    <a
                      href={drawerProfile.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline"
                    >
                      View Video
                    </a>
                  </div>
                )}
                {/* Add more fields as needed */}
                <div className="flex gap-4 mt-8">
                  <button
                    className="btn-primary flex-1"
                    disabled={actionLoading}
                    onClick={() => handleStatus('approved')}
                  >
                    {actionLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    className="btn-secondary flex-1"
                    disabled={actionLoading}
                    onClick={() => handleStatus('rejected')}
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
