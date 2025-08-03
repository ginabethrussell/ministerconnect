'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProfile } from '@/context/ProfileContext';
import ExpressInterestButton from '@/components/ExpressInterestButton';
import { JobWithInterest, MutualInterest } from '@/types';
import {
  getApprovedJobs,
  getCandidateInterests,
  expressCandidateInterest,
  withdrawInterest,
} from '@/utils/api';
import { mergeJobsWithInterest } from '@/utils/helpers';

export default function CandidateJobs() {
  const router = useRouter();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<Record<number, MutualInterest>>({});
  const [jobsWithInterest, setJobsWithInterest] = useState<JobWithInterest[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);
  const [loadingError, setLoadingError] = useState('');
  const [toggleInterestError, setToggleInterestError] = useState('');

  useEffect(() => {
    if (!profile || !(profile?.status === 'approved')) {
      router.push('/candidate');
    }
    const loadJobsAndInterests = async () => {
      try {
        const [jobsResponse, interestsResponse] = await Promise.all([
          await getApprovedJobs(),
          await getCandidateInterests(),
        ]);

        const combined = mergeJobsWithInterest(jobsResponse.results, interestsResponse.results);
        setJobsWithInterest(combined);

        const interestMap: Record<number, MutualInterest> = {};
        interestsResponse.results.forEach((interest) => {
          interestMap[interest.job_listing] = interest;
        });
        setInterests(interestMap);
      } catch (error) {
        if (error instanceof Error) {
          setLoadingError(error.message);
        } else {
          setLoadingError('Failed to load jobs and/or interests.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadJobsAndInterests();
  }, [router, profile]);

  const handleToggleInterest = async (jobId: number) => {
    setToggleInterestError('');
    const existingInterest = interests[jobId];

    try {
      if (existingInterest) {
        // Interest already exists — withdraw it
        await withdrawInterest(existingInterest.id);
        setInterests((prev) => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      } else {
        // Express new interest
        if (profile?.id) {
          const newInterest = await expressCandidateInterest(jobId, profile.id);
          setInterests((prev) => ({
            ...prev,
            [jobId]: newInterest,
          }));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setToggleInterestError(error.message);
      } else {
        setToggleInterestError('Failed to update expressed interest.');
      }
    }
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-efcaGray">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-efcaAccent"></div>
          <p className="text-gray-600">Loading job listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-efcaDark text-3xl font-bold">Available Positions</h1>
        </header>

        {/* Information Section */}
        <section className="my-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">
            How Expressing Interest Works
          </h3>
          <div className="space-y-2 text-blue-700">
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
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Job Listings</h2>
          {jobsWithInterest && jobsWithInterest.length === 0 ? (
            <div className="py-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">No positions found</h3>
              <p className="text-gray-600">Check back soon for new opportunities.</p>
              {loadingError && (
                <p className="mt-1 text-left text-sm text-[#FF5722]">{loadingError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobsWithInterest &&
                jobsWithInterest.map((job) => {
                  const hasExpressedInterest = !!interests[job.id];
                  const isExpanded = expandedJobs.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <h3 className="text-efcaDark mb-2 text-xl font-semibold">{job.title}</h3>

                          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-lg font-medium text-gray-800">{job.church.name}</p>
                              <p className="text-gray-600">{job.ministry_type}</p>
                              <p className="text-sm text-gray-500">{`${job.church.city}, ${job.church.state}`}</p>
                            </div>
                            <div className="text-right md:text-left">
                              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                {job.employment_type}
                              </span>
                              <p className="mt-2 text-sm text-gray-500">
                                Posted on: {new Date(job.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Expandable Content */}
                          {isExpanded && (
                            <div className="mt-4 space-y-4 border-t pt-4">
                              <div>
                                <h4 className="mb-2 font-semibold text-gray-800">
                                  Job Description
                                </h4>
                                <p className="leading-relaxed text-gray-700">
                                  {job.job_description}
                                </p>
                              </div>
                              <div>
                                <h4 className="mb-2 font-semibold text-gray-800">
                                  About This Church
                                </h4>
                                <p className="leading-relaxed text-gray-700">{job.about_church}</p>
                              </div>
                              <div>
                                <h4 className="mb-2 font-semibold text-gray-800">Job Link</h4>
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

                        <div className="flex min-w-[200px] flex-col gap-2">
                          {profile?.id && (
                            <ExpressInterestButton
                              id={job.id.toString()}
                              hasExpressedInterest={hasExpressedInterest}
                              onExpressInterest={() => handleToggleInterest(job.id)}
                              className="w-full"
                              size="md"
                              variant="primary"
                              disabled={false}
                            />
                          )}
                          {toggleInterestError && (
                            <p className="mt-1 text-left text-sm text-[#FF5722]">{loadingError}</p>
                          )}
                          <button
                            onClick={() => toggleJobExpansion(job.id)}
                            className="rounded border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
