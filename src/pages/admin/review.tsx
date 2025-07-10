import React, { useEffect, useState } from 'react';
import PDFViewer from '../../components/PDFViewer';
import { getSuperAdminProfiles } from '../../utils/api'; // Using the centralized API
import { Profile } from '../../types'; // Using the centralized type

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const liveMatch = url.match(/youtube\.com\/live\/([\w-]+)/);
  const watchMatch = url.match(/[?&]v=([\w-]+)/);
  let videoId = '';
  if (liveMatch) {
    videoId = liveMatch[1];
  } else if (watchMatch) {
    videoId = watchMatch[1];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

const AdminReview = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [filterEvent, setFilterEvent] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });
  const [videoViewer, setVideoViewer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const data: Profile[] = await getSuperAdminProfiles();
        setProfiles(data);
        // Get unique events for filter dropdown
        const uniqueEvents = Array.from(new Set(data.map((p) => p.email))); // Placeholder for event
        setEvents(uniqueEvents);
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Filter profiles based on status and event
  let filtered = profiles;
  if (filterStatus !== 'all') {
    filtered = filtered.filter((p) => p.status === filterStatus);
  }
  if (filterEvent) {
    // This will need to be adjusted once 'event' is on the Profile type
    filtered = filtered.filter((p) => p.email === filterEvent); // Placeholder
  }

  // Sort filtered results
  filtered = [...filtered].sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`;
    const nameB = `${b.first_name} ${b.last_name}`;
    if (sortBy === 'name') return nameA.localeCompare(nameB);
    if (sortBy === 'createdAt') return (b.created_at || '').localeCompare(a.created_at || '');
    return 0;
  });

  const handleStatus = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoadingId(id.toString());
    // Replace with actual API call to update status
    console.log(`Updating profile ${id} to ${status}`);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProfiles((prevProfiles) => prevProfiles.map((p) => (p.id === id ? { ...p, status } : p)));
    setActionLoadingId(null);
  };

  const handleViewResume = (resumeUrl: string, candidateName: string) => {
    setPdfViewer({
      isOpen: true,
      url: resumeUrl,
      title: `${candidateName}'s Resume`,
    });
  };

  const handleViewVideo = (videoUrl: string, candidateName: string) => {
    setVideoViewer({
      isOpen: true,
      url: videoUrl,
      title: `${candidateName}'s Video`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Review Candidate Profiles</h1>
        </header>
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Status Filters */}
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({profiles.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({profiles.filter((p) => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({profiles.filter((p) => p.status === 'approved').length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading profiles...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No candidate profiles found.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((profile) => {
                const fullName = `${profile.first_name} ${profile.last_name}`;
                return (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={profile.photo}
                        alt={`${fullName}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
                        <p
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            profile.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : profile.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {profile.status}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Email:</span>
                          <span className="text-gray-700">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Phone:</span>
                          <span className="text-gray-700">555-123-4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Address:</span>
                          <span className="text-gray-700">{profile.street_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Location:</span>
                          <span className="text-gray-700">{`${profile.city}, ${profile.state} ${profile.zipcode}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Documents</h4>
                      <div className="space-y-2">
                        {profile.resume && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-600 w-16">Resume:</span>
                            <a
                              href={profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleViewResume(profile.resume, fullName)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                        {profile.video_url && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-600 w-16">Video:</span>
                            <a
                              href={profile.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleViewVideo(profile.video_url, fullName)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Placement Preferences Section */}
                    {profile.placement_preferences && profile.placement_preferences.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Placement Preferences</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.placement_preferences.map((preference, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              {preference}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submission Info */}
                    <div className="mb-4 text-xs text-gray-500">
                      <p>Submitted: {new Date(profile.submitted_at).toLocaleDateString()}</p>
                      <p>Last Updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
                    </div>

                    {/* Action Buttons */}
                    {profile.status !== 'approved' && (
                      <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <button
                          onClick={() => handleStatus(profile.id, 'approved')}
                          disabled={actionLoadingId === profile.id.toString()}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                        >
                          {actionLoadingId === profile.id.toString() ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatus(profile.id, 'rejected')}
                          disabled={actionLoadingId === profile.id.toString()}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                        >
                          {actionLoadingId === profile.id.toString() ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer((prev) => ({ ...prev, isOpen: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />

      {videoViewer.isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{videoViewer.title}</h2>
              <button
                onClick={() => setVideoViewer({ isOpen: false, url: '', title: '' })}
                className="text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={getYouTubeEmbedUrl(videoViewer.url)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
