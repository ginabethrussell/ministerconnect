import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PDFViewer from '../../components/PDFViewer';

const dummyApplicants = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-123-4567',
    status: 'Approved',
    event: 'Job Fair 2025',
    createdAt: '2024-06-01',
    streetAddress: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    resumeUrl: '/student-pastor-resume.pdf',
    videoUrl: 'https://www.youtube.com/live/w-6-z8w0Zv4?si=KcAy1iRb-Ss4zrPd',
    pictureUrl: '/sampleman.jpg',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-987-6543',
    status: 'Approved',
    event: 'Old Event',
    createdAt: '2024-05-20',
    streetAddress: '456 Oak Ave',
    city: 'Lincoln',
    state: 'NE',
    zipCode: '68508',
    resumeUrl: '/assistant-pastor-resume.pdf',
    videoUrl: 'https://www.youtube.com/live/w-6-z8w0Zv4?si=KcAy1iRb-Ss4zrPd',
    pictureUrl: '/sampleman.jpg',
  },
];

function getYouTubeEmbedUrl(url: string): string {
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

export default function ChurchSearch() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
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
    // Check if church profile is complete
    const checkProfileCompletion = () => {
      const churchName = localStorage.getItem('churchName');
      const churchEmail = localStorage.getItem('churchEmail');
      const churchPhone = localStorage.getItem('churchPhone');
      const streetAddress = localStorage.getItem('churchStreetAddress');
      const city = localStorage.getItem('churchCity');
      const state = localStorage.getItem('churchState');
      const zipCode = localStorage.getItem('churchZipCode');
      
      const isComplete = !!(churchName && churchEmail && churchPhone && streetAddress && city && state && zipCode);
      setIsProfileComplete(isComplete);
      setLoading(false);
      
      // If profile is not complete, redirect to settings
      if (!isComplete) {
        router.push('/church/settings?incomplete=true');
      }
    };

    checkProfileCompletion();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search page...</p>
        </div>
      </div>
    );
  }

  // If profile is not complete, don't render the search page
  if (!isProfileComplete) {
    return null; // Will redirect to settings
  }

  const filteredApplicants = dummyApplicants.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (id: string) => {
    if (!saved.includes(id)) {
      setSaved([...saved, id]);
    }
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
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Search Candidates</h1>
          <Link
            href="/church"
            className="px-4 py-2 bg-efcaDark text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            Dashboard
          </Link>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent mb-4"
          />
          {filteredApplicants.length === 0 ? (
            <div className="py-4 text-gray-500">No candidates found.</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white rounded shadow p-4 flex flex-col h-full"
                >
                  {applicant.pictureUrl && (
                    <img
                      src={applicant.pictureUrl}
                      alt={applicant.name + ' profile'}
                      className="h-24 w-24 object-cover rounded-lg border mx-auto mb-2"
                    />
                  )}
                  <div className="font-bold text-lg text-efcaText mb-1">{applicant.name}</div>
                  <div className="text-sm text-gray-600 mb-1 break-all">{applicant.email}</div>
                  <div className="text-xs text-efcaMuted mb-1">Phone: {applicant.phone}</div>
                  <div className="text-xs text-efcaMuted mb-1">Status: {applicant.status}</div>
                  <div className="text-xs text-efcaMuted mb-1">Event: {applicant.event}</div>
                  <div className="text-xs text-efcaMuted mb-1">Submitted: {applicant.createdAt}</div>
                  <div className="text-xs text-efcaMuted mb-1">Address: {applicant.streetAddress}, {applicant.city}, {applicant.state} {applicant.zipCode}</div>
                  <div className="text-xs text-efcaMuted mb-1">ID: {applicant.id}</div>
                  {applicant.resumeUrl && (
                    <div className="flex gap-2 mb-1">
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-efcaAccent underline text-xs"
                      >
                        View Resume
                      </a>
                      <button
                        onClick={() => handleViewResume(applicant.resumeUrl, applicant.name)}
                        className="text-efcaAccent underline text-xs"
                      >
                        Preview
                      </button>
                    </div>
                  )}
                  {applicant.videoUrl && (
                    <div className="flex gap-2 mb-1">
                      <a
                        href={applicant.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-efcaAccent underline text-xs"
                      >
                        View Video
                      </a>
                      <button
                        onClick={() => handleViewVideo(applicant.videoUrl, applicant.name)}
                        className="text-efcaAccent underline text-xs"
                      >
                        Preview
                      </button>
                    </div>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      onClick={() => handleSave(applicant.id)}
                      className="btn-primary flex-1 disabled:opacity-50"
                      disabled={saved.includes(applicant.id)}
                    >
                      {saved.includes(applicant.id) ? 'Saved' : 'Save'}
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

      {/* Video Preview Modal */}
      {videoViewer.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{videoViewer.title}</h3>
              <button 
                onClick={() => setVideoViewer(prev => ({ ...prev, isOpen: false }))} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe 
                src={getYouTubeEmbedUrl(videoViewer.url)} 
                className="w-full h-[70vh] border-0" 
                title={videoViewer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <a
                href={videoViewer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
              >
                Open in New Tab
              </a>
              <button
                onClick={() => setVideoViewer(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
