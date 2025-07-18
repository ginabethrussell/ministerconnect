import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PDFViewer from '../../components/PDFViewer';
import { getMutualInterests } from '../../utils/api';
import { MutualInterest, JobListing, Profile, InviteCode } from '../../types';

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
    {
      interest: MutualInterest;
      profile: Profile;
      jobListing: JobListing;
      inviteCode?: InviteCode;
    }[]
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
  const [copyStatus, setCopyStatus] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchMutualInterests = async () => {
      try {
        const data: any = await getMutualInterests();
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
    new Map(mutualInterests.map((item) => [item.jobListing.id, item.jobListing])).values()
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

  const handleViewVideo = (videoUrl: string | null, candidateName: string) => {
    if (!videoUrl) return;
    setVideoViewer({
      isOpen: true,
      url: videoUrl,
      title: `${candidateName}'s Video`,
    });
  };

  const handleCopyContact = (profile: Profile) => {
    const contactInfo = `Name: ${profile.first_name} ${profile.last_name}\nEmail: ${profile.email}\nPhone: ${profile.phone}`;
    navigator.clipboard.writeText(contactInfo).then(() => {
      setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Copied!' }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [profile.id]: '' }));
      }, 2000);
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getJobTitle = (jobId: number) => {
    const job = jobListings.find((j) => j.id === jobId);
    return job ? job.title : 'Unknown Position';
  };

  const getTotalInterests = () => mutualInterests.length;

  const getInterestsByJob = (jobId: number) =>
    mutualInterests.filter((c) => c.jobListing.id === jobId).length;

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
              {
                mutualInterests.filter((c) => {
                  const interestDate = new Date(c.interest.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return interestDate > weekAgo;
                }).length
              }
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
              {jobListings.map((job) => (
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
            <ul className="space-y-6">
              {filteredCandidates.map(({ profile, interest, jobListing, inviteCode }) => (
                <li
                  key={profile.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    {/* Candidate Info */}
                    <div className="flex items-start gap-6 flex-grow">
                      <div className="w-24 h-24 flex-shrink-0">
                        {profile.photo ? (
                          <Image
                            src={profile.photo}
                            alt={`${profile.first_name} ${profile.last_name}`}
                            className="w-24 h-24 object-cover rounded-lg"
                            height={200}
                            width={200}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-efcaDark">{`${profile.first_name} ${profile.last_name}`}</h3>
                        <p className="text-gray-600">
                          Interested in: <span className="font-semibold">{jobListing.title}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Interest expressed: {new Date(interest.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full md:w-[200px] flex-shrink-0 flex flex-col gap-3">
                      <a
                        href={`mailto:${profile.email}`}
                        className="px-4 py-2 bg-blue-600 text-white text-center rounded-md font-semibold hover:bg-blue-700 transition flex-1"
                      >
                        Send Email
                      </a>
                      <button
                        onClick={() => handleCopyContact(profile)}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 text-center rounded-md font-semibold hover:bg-gray-50 transition flex-1"
                      >
                        {copyStatus[profile.id] || 'Copy Contact Info'}
                      </button>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <p className="text-sm text-gray-600">Email: {profile.email}</p>
                      <p className="text-sm text-gray-600">Phone: {profile.phone}</p>
                      <p className="text-sm text-gray-600">
                        Location:{' '}
                        {`${profile.street_address}, ${profile.city}, ${profile.state} ${profile.zipcode}`}
                      </p>
                    </div>

                    {/* Documents & Media */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Documents & Media</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <a
                            href={profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-efcaAccent hover:underline"
                          >
                            View Resume
                          </a>
                          <button
                            onClick={() =>
                              handleViewResume(
                                profile.resume,
                                `${profile.first_name} ${profile.last_name}`
                              )
                            }
                            className="ml-3 text-efcaAccent hover:underline"
                          >
                            Preview
                          </button>
                        </div>
                        {profile.video_url && (
                          <div>
                            <a
                              href={profile.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-efcaAccent hover:underline"
                            >
                              View Video
                            </a>
                            <button
                              onClick={() =>
                                handleViewVideo(
                                  profile.video_url,
                                  `${profile.first_name} ${profile.last_name}`
                                )
                              }
                              className="ml-3 text-efcaAccent hover:underline"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                      </div>
                      {profile.placement_preferences &&
                        profile.placement_preferences.length > 0 && (
                          <div className="mt-2">
                            <h5 className="font-semibold text-gray-700 mb-1">Preferences</h5>
                            <div className="flex flex-wrap gap-1">
                              {profile.placement_preferences.map((pref) => (
                                <span
                                  key={pref}
                                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                                >
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Profile Details</h4>
                      <p className="text-sm text-gray-600">
                        Status: {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                      </p>
                      {inviteCode && (
                        <p className="text-sm text-gray-600">Event: {inviteCode.event}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        Profile Created: {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                      {profile.submitted_at && (
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(profile.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Last Updated: {new Date(profile.updated_at).toLocaleDateString()}
                      </p>
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
        onClose={() => setPdfViewer((prev) => ({ ...prev, isOpen: false }))}
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
