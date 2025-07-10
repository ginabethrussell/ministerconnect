import React, { useState, useEffect } from 'react';
import PDFViewer from '../../components/PDFViewer';
import ExpressInterestButton from '../../components/ExpressInterestButton';
import { Profile, JobListing } from '../../types'; // Assuming types for Profile and JobListing exist
import { apiClient } from '../../utils/api';

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

export default function ChurchSearch() {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [expressedInterest, setExpressedInterest] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<JobListing[]>([]); // To associate with interest
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: '', title: '' });
  const [videoViewer, setVideoViewer] = useState({ isOpen: false, url: '', title: '' });
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profilesRes, interestsRes, jobsRes] = await Promise.all([
          apiClient.get<Profile[]>('/api/profiles/approved'),
          apiClient.get<{ profile_id: number }[]>('/api/church/interests'),
          apiClient.get<JobListing[]>('/api/church/job-listings'),
        ]);
        setProfiles(profilesRes);
        setExpressedInterest(interestsRes.map((i) => String(i.profile_id)));

        if (jobsRes.length > 0) {
          setJobListings(jobsRes);
          setSelectedJobId(String(jobsRes[0].id)); // Default to the first job
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const filteredProfiles = profiles.filter(
    (p) =>
      (p.first_name + ' ' + p.last_name).toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExpressInterest = async (candidateId: string) => {
    if (!selectedJobId) {
      alert('Please select a job to express interest for.');
      return;
    }
    try {
      await apiClient.post('/api/church/interest', {
        profileId: candidateId,
        jobId: selectedJobId,
      });

      if (expressedInterest.includes(candidateId)) {
        setExpressedInterest((prev) => prev.filter((id) => id !== candidateId));
      } else {
        setExpressedInterest((prev) => [...prev, candidateId]);
      }
    } catch (error) {
      console.error('Failed to express interest:', error);
      alert('There was an error expressing interest. Please try again.');
    }
  };

  const handleViewResume = (resumeUrl: string | null, candidateName: string) => {
    if (resumeUrl) {
      setPdfViewer({
        isOpen: true,
        url: resumeUrl,
        title: `${candidateName}'s Resume`,
      });
    }
  };

  const handleViewVideo = (videoUrl: string | null, candidateName: string) => {
    if (videoUrl) {
      setVideoViewer({
        isOpen: true,
        url: videoUrl,
        title: `${candidateName}'s Video`,
      });
    }
  };

  const handleCopyContact = (profile: Profile) => {
    const contactInfo = `Name: ${profile.first_name} ${profile.last_name}\nEmail: ${profile.email}\nPhone: ${profile.phone}`;
    navigator.clipboard.writeText(contactInfo).then(
      () => {
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Copied!' }));
        setTimeout(() => {
          setCopyStatus((prev) => ({ ...prev, [profile.id]: '' }));
        }, 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Failed' }));
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Search Candidates</h1>
          {jobListings.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="job-select" className="font-semibold text-gray-700">
                Expressing interest for:
              </label>
              <select
                id="job-select"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              >
                {jobListings.map((job) => (
                  <option key={job.id} value={String(job.id)}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            How Expressing Interest Works
          </h3>
          <div className="text-blue-700 space-y-2 text-sm">
            <p>• When you express interest, the candidate is NOT notified.</p>
            <p>• A candidate must first express interest in one of your job listings.</p>
            <p>• If you also express interest in them, it becomes a "Mutual Interest."</p>
            <p>• You can view all Mutual Interests on the dashboard.</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          {filteredProfiles.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No candidates found matching your criteria.
            </div>
          ) : (
            <ul className="space-y-6">
              {filteredProfiles.map((profile) => (
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
                          <img
                            src={profile.photo}
                            alt={`${profile.first_name} ${profile.last_name}`}
                            className="w-24 h-24 object-cover rounded-lg"
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
                        <h3 className="text-2xl font-bold text-gray-800">{`${profile.first_name} ${profile.last_name}`}</h3>
                        {/* Placeholder for interest details if needed in future */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full md:w-[250px] flex-shrink-0 flex flex-col gap-3">
                      <ExpressInterestButton
                        id={String(profile.id)}
                        hasExpressedInterest={expressedInterest.includes(String(profile.id))}
                        onExpressInterest={handleExpressInterest}
                        size="lg"
                      />
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <p className="text-sm text-gray-600">Email: {profile.email}</p>
                      <p className="text-sm text-gray-600">Phone: {profile.phone}</p>
                      <p className="text-sm text-gray-600">
                        Location:{' '}
                        {profile.street_address &&
                          `${profile.street_address}, ${profile.city}, ${profile.state} ${profile.zipcode}`}
                      </p>
                    </div>

                    {/* Documents & Media */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Documents & Media</h4>
                      <div className="text-sm space-y-1">
                        {profile.resume && (
                          <div>
                            <a
                              href={profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
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
                              className="ml-3 text-blue-600 hover:underline"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                        {profile.video_url && (
                          <div>
                            <a
                              href={profile.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
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
                              className="ml-3 text-blue-600 hover:underline"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                      </div>
                      {profile.placement_preferences &&
                        profile.placement_preferences.length > 0 && (
                          <div className="mt-4">
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

      {videoViewer.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{videoViewer.title}</h3>
              <button
                onClick={() => setVideoViewer((prev) => ({ ...prev, isOpen: false }))}
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
                title="YouTube video player"
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
