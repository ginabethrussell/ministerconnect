'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobListing } from '@/types';
import { deleteJob, getChurchJobs } from '@/utils/api';

export default function ChurchJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);
  const [loadingError, setLoadingError] = useState('');
  const [deletingError, setDeletingError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobListingsRes = await getChurchJobs();
        setJobs(jobListingsRes.results);
      } catch (error) {
        if (error instanceof Error) {
          setLoadingError(error.message);
        } else {
          setLoadingError('An error occurred while retrieving jobs.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleDeleteJob = async (jobId: number) => {
    setDeletingError('');
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      if (error instanceof Error) {
        setDeletingError(error.message);
      } else {
        setDeletingError('An error occurred while deleting the job.');
      }
    }
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending admin review';
      case 'approved':
        return 'Approved and visible to candidates';
      case 'rejected':
        return 'Rejected by admin';
      default:
        return 'Unknown status';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-efcaGray">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-efcaAccent"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-efcaDark text-3xl font-bold">Job Postings</h1>
          <div className="flex gap-4">
            <Link
              href="/church/jobs/create"
              className="rounded-lg bg-efcaAccent px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              + Post New Job
            </Link>
          </div>
        </header>

        {/* Job Listings */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          {!jobs || jobs?.length === 0 ? (
            <div className="py-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">No jobs posted yet</h3>
              <p className="mb-4 text-gray-600">
                Click &quot;Post New Job&quot; to create your first listing.
              </p>
              {loadingError && (
                <p className="mt-1 text-left text-sm text-[#FF5722]">{loadingError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs &&
                jobs.map((job) => {
                  const isExpanded = expandedJobs.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-start justify-between">
                            <h3 className="text-efcaDark text-xl font-semibold">{job.title}</h3>
                          </div>

                          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-lg font-medium text-gray-800">{job.church.name}</p>
                              <p className="text-md text-gray-600">{job.ministry_type}</p>
                              <p className="text-md text-gray-500">
                                {`${job.church.city}, ${job.church.state}`}
                              </p>
                            </div>
                            <div className="text-right md:text-left">
                              <span
                                className={`inline-block px-3 py-1 ${getStatusColor(job.status)} rounded-full text-sm font-medium`}
                              >
                                {getStatusMessage(job.status)}
                              </span>
                              <p className="text-md mt-2 text-gray-600">{job.employment_type}</p>
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
                                <h4 className="mb-2 font-semibold text-gray-800">Job URL Link</h4>
                                <a
                                  href={job?.job_url_link}
                                  target="_blank"
                                  className="font-regular cursor-pointer text-blue-800 hover:underline"
                                >
                                  {job.job_url_link}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-[200px] flex-col gap-2">
                          <button
                            onClick={() => toggleJobExpansion(job.id)}
                            className="rounded border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          >
                            {isExpanded ? 'Show Less' : 'View Details'}
                          </button>

                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="rounded border border-red-300 px-4 py-2 text-center font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                          >
                            Delete Job
                          </button>
                          {deletingError && (
                            <p className="mt-1 text-left text-sm text-[#FF5722]">{deletingError}</p>
                          )}
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
