import React, { useState, useEffect } from 'react';
import PDFViewer from '../../components/PDFViewer';
import { getMutualInterests } from '../../utils/api';
import { MutualInterest, JobListing, Profile } from '../../types';

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

export default function MutualInterests() {
  const [loading, setLoading] = useState(true);
  const [mutualInterests, setMutualInterests] = useState<
    { interest: MutualInterest; profile: Profile; jobListing: JobListing }[]
  >([]);
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
    const fetchMutualInterests = async () => {
      try {
        const data = await getMutualInterests();
        setMutualInterests(data);
      } catch (error) {
        console.error('Failed to fetch mutual interests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMutualInterests();
  }, []);

  const jobListings = Array.from(
    new Map(
      mutualInterests.map(item => [item.jobListing.id, item.jobListing])
    ).values()
  );

  const filteredCandidates = mutualInterests.filter(
    ({ jobListing }) => selectedJob === 'all' || jobListing.id.toString() === selectedJob
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

  const getJobTitle = (jobId: number) => {
    const job = jobListings.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Position';
  };

  const getTotalInterests = () => mutualInterests.length;

  const getInterestsByJob = (jobId: number) =>
    mutualInterests.filter(c => c.jobListing.id === jobId).length;

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
            <p className="text-3xl font-bold text-efcaAccent">{jobListings.length}</p>
            <p className="text-sm text-gray-600">Job positions currently posted</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Recent Activity</h3>
            <p className="text-3xl font-bold text-efcaAccent">
              {mutualInterests.filter(c => {
                const interestDate = new Date(c.interest.created_at);
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
              {jobListings.map(job => (
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
                  ? 'No candidates have expressed interest in your job listings yet.'
                  : 'No candidates have expressed interest in this position yet.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredCandidates.map(({ profile, interest, jobListing }) => (
                <li key={profile.id} className="py-6 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4 flex-shrink-0">
                    <img
                      src={profile.photo}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                  <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-efcaDark">{`${profile.first_name} ${profile.last_name}`}</h3>
                        <p className="text-gray-600">
                          Interested in:{' '}
                          <span className="font-semibold">{getJobTitle(jobListing.id)}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Expressed Interest on:{' '}
                          {new Date(interest.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-700">
                          <strong className="font-medium">Email:</strong> {profile.email}
                        </p>
                        <p className="text-gray-700">
                          <strong className="font-medium">Location:</strong>{' '}
                          {`${profile.city}, ${profile.state}`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleViewResume(profile.resume, `${profile.first_name} ${profile.last_name}`)}
                        className="px-4 py-2 bg-efcaAccent text-white rounded hover:bg-efcaDark transition"
                      >
                        View Resume
                      </button>
                      {profile.video_url && (
                        <button
                          onClick={() => handleViewVideo(profile.video_url, `${profile.first_name} ${profile.last_name}`)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                        >
                          View Video
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{videoViewer.title}</h2>
              <button
                onClick={() => setVideoViewer({ isOpen: false, url: '', title: '' })}
                className="text-2xl font-bold"
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
} 