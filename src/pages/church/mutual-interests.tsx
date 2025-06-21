import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PDFViewer from '../../components/PDFViewer';

interface JobListing {
  id: string;
  title: string;
  position: string;
  employmentType: string;
  jobUrl: string;
}

interface InterestedCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Approved';
  event: string;
  createdAt: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  resumeUrl: string;
  videoUrl?: string;
  pictureUrl: string;
  jobListingId: string;
  interestExpressedAt: string;
}

// Mock data - in real app, this would come from API
const mockJobListings: JobListing[] = [
  {
    id: '1',
    title: 'Associate Pastor of Family Ministries',
    position: 'Family ministry',
    employmentType: 'Full Time with Benefits',
    jobUrl: 'https://jobs.efca.org/jobs/1047',
  },
  {
    id: '2',
    title: 'Worship Leader',
    position: 'Worship & Arts',
    employmentType: 'Part Time',
    jobUrl: 'https://jobs.efca.org/jobs/1048',
  },
];

const mockInterestedCandidates: InterestedCandidate[] = [
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
    jobListingId: '1',
    interestExpressedAt: '2024-07-22T10:30:00Z',
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
    jobListingId: '1',
    interestExpressedAt: '2024-07-21T14:15:00Z',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-456-7890',
    status: 'Approved',
    event: 'Job Fair 2025',
    createdAt: '2024-06-15',
    streetAddress: '789 Pine St',
    city: 'Omaha',
    state: 'NE',
    zipCode: '68102',
    resumeUrl: '/worship-leader-resume.pdf',
    pictureUrl: '/woman.jpg',
    jobListingId: '2',
    interestExpressedAt: '2024-07-20T09:45:00Z',
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

export default function MutualInterests() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>('all');
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

  const filteredCandidates = mockInterestedCandidates.filter(candidate => 
    selectedJob === 'all' || candidate.jobListingId === selectedJob
  );

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

  const getJobTitle = (jobId: string) => {
    const job = mockJobListings.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Position';
  };

  const getTotalInterests = () => mockInterestedCandidates.length;

  const getInterestsByJob = (jobId: string) => 
    mockInterestedCandidates.filter(c => c.jobListingId === jobId).length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mutual interests...</p>
        </div>
      </div>
    );
  }

  // If profile is not complete, don't render the page
  if (!isProfileComplete) {
    return null; // Will redirect to settings
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-efcaDark">Mutual Interests</h1>
            <p className="text-gray-600 mt-2">
              Candidates who have expressed interest in your job listings
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Total Interests</h3>
            <p className="text-3xl font-bold text-efcaAccent">{getTotalInterests()}</p>
            <p className="text-sm text-gray-600">Candidates interested in your positions</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Active Listings</h3>
            <p className="text-3xl font-bold text-efcaAccent">{mockJobListings.length}</p>
            <p className="text-sm text-gray-600">Job positions currently posted</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Recent Activity</h3>
            <p className="text-3xl font-bold text-efcaAccent">
              {mockInterestedCandidates.filter(c => {
                const interestDate = new Date(c.interestExpressedAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return interestDate > weekAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-600">Interests in the last 7 days</p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by Position:</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent bg-white"
            >
              <option value="all">All Positions ({getTotalInterests()})</option>
              {mockJobListings.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({getInterestsByJob(job.id)})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Candidates List */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interested candidates</h3>
              <p className="text-gray-600">
                {selectedJob === 'all' 
                  ? "No candidates have expressed interest in your job listings yet."
                  : "No candidates have expressed interest in this position yet."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        {candidate.pictureUrl && (
                          <img
                            src={candidate.pictureUrl}
                            alt={`${candidate.name}'s profile`}
                            className="h-20 w-20 object-cover rounded-lg border"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-efcaDark mb-1">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Interested in: <span className="font-medium">{getJobTitle(candidate.jobListingId)}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Interest expressed: {new Date(candidate.interestExpressedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Email:</span> {candidate.email}</p>
                            <p><span className="font-medium">Phone:</span> {candidate.phone}</p>
                            <p><span className="font-medium">Location:</span> {candidate.city}, {candidate.state}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Profile Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Status:</span> {candidate.status}</p>
                            <p><span className="font-medium">Event:</span> {candidate.event}</p>
                            <p><span className="font-medium">Profile Created:</span> {new Date(candidate.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="flex gap-4">
                        {candidate.resumeUrl && (
                          <div className="flex gap-2">
                            <a
                              href={candidate.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-efcaAccent underline text-sm"
                            >
                              View Resume
                            </a>
                            <button
                              onClick={() => handleViewResume(candidate.resumeUrl, candidate.name)}
                              className="text-efcaAccent underline text-sm"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                        {candidate.videoUrl && (
                          <div className="flex gap-2">
                            <a
                              href={candidate.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-efcaAccent underline text-sm"
                            >
                              View Video
                            </a>
                            <button
                              onClick={() => handleViewVideo(candidate.videoUrl!, candidate.name)}
                              className="text-efcaAccent underline text-sm"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <a
                        href={`mailto:${candidate.email}?subject=Interest in ${getJobTitle(candidate.jobListingId)} Position`}
                        className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors text-center"
                      >
                        Send Email
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${candidate.name}\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nPosition: ${getJobTitle(candidate.jobListingId)}`);
                          alert('Contact information copied to clipboard!');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                      >
                        Copy Contact Info
                      </button>
                    </div>
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