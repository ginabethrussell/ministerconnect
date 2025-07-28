import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProfile } from '../../context/ProfileContext';
import ExpressInterestButton from '../../components/ExpressInterestButton';
import { JobListing } from '../../types';
import { getApprovedJobs, getExpressedInterests } from '@/utils/api';

export default function CandidateJobs() {
  const router = useRouter();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [expressedInterest, setExpressedInterest] = useState<number[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);

  useEffect(() => {
    if (!(profile?.status === 'approved')) {
      router.push('/candidate');
    }
    const loadJobs = async () => {
      try {
        // Load approved job listings
        const response = await getApprovedJobs();
        setJobListings(response.results);

        // Load user's expressed interests
        const interestsResponse = await getExpressedInterests();
        console.log('MUTUALINTERESTS', interestsResponse);
      } catch (error) {
        console.error('Failed to load jobs and interests', error);
        router.push('/candidate');
        return;
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [router, profile]);

  const handleExpressInterest = async (jobId: number) => {
    try {
      const response = await fetch(`/api/job-listings/${jobId}/express-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.expressed) {
          // Add interest
          setExpressedInterest((prev) => [...prev, jobId]);
        } else {
          // Remove interest
          setExpressedInterest((prev) => prev.filter((id) => id !== jobId));
        }
      } else {
        console.error('Failed to express interest:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to express interest:', error);
      // You could show a toast notification here
    }
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Available Positions</h1>
        </header>

        {/* Information Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            How Expressing Interest Works
          </h3>
          <div className="text-blue-700 space-y-2">
            <p>
              • Click &quot;Express Interest&quot; to let churches know you&apos;re interested in
              their position
            </p>
            <p>• Churches will be notified of your interest and can view your profile</p>
            <p>
              • If there&apos;s mutual interest, churches will contact you directly using your
              profile information
            </p>
            <p>
              • You can express interest in multiple positions and withdraw interest at any time
            </p>
          </div>
        </section>

        {/* Job Listings */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Job Listings</h2>
          {jobListings && jobListings.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600">Check back soon for new opportunities.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobListings &&
                jobListings.map((job) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const hasExpressedInterest = expressedInterest.includes(job.id);
                  const isExpanded = expandedJobs.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-efcaDark mb-2">{job.title}</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-lg font-medium text-gray-800">{job.church.name}</p>
                              <p className="text-gray-600">{job.ministry_type}</p>
                              <p className="text-sm text-gray-500">{`${job.church.city}, ${job.church.state}`}</p>
                            </div>
                            <div className="text-right md:text-left">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {job.employment_type}
                              </span>
                              <p className="text-sm text-gray-500 mt-2">
                                Posted on: {new Date(job.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Expandable Content */}
                          {isExpanded && (
                            <div className="mt-4 space-y-4 border-t pt-4">
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  Job Description
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {job.job_description}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  About This Church
                                </h4>
                                <p className="text-gray-700 leading-relaxed">{job.about_church}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Job Link</h4>
                                <a
                                  href={job.job_url_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-efcaAccent hover:underline"
                                >
                                  {job.job_url_link}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <ExpressInterestButton
                            id={job.id.toString()}
                            hasExpressedInterest={expressedInterest.includes(job.id)}
                            onExpressInterest={() => handleExpressInterest(job.id)}
                            className="w-full"
                            size="md"
                            variant="primary"
                          />

                          <button
                            onClick={() => toggleJobExpansion(job.id)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-center"
                          >
                            {isExpanded ? 'Show Less' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
