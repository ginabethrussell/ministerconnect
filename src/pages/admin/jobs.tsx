'use client';

import React, { useEffect, useState } from 'react';
import { JobListing } from '@/types';
import { getAllJobs, reviewChurchJobs } from '@/utils/api';
import { titleCase } from '@/utils/helpers';

export default function AdminJobReview() {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [loadingError, setLoadingError] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    loadJobListings();
  }, []);

  const loadJobListings = async () => {
    setLoading(true);
    try {
      const jobsRes = await getAllJobs();
      setJobListings(jobsRes.results);
    } catch (error) {
      if (error instanceof Error) {
        setLoadingError(error.message);
      } else {
        setLoadingError('Failed to load job listings.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    setReviewError('');
    try {
      await reviewChurchJobs(id, status);
      setJobListings((prevListings) =>
        prevListings.map((job) => (job.id === id ? { ...job, status: status } : job))
      );
    } catch (error) {
      if (error instanceof Error) {
        setReviewError(error.message);
      } else {
        setReviewError('Failed to update job status.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const toggleExpanded = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredListings =
    filterStatus === 'all' ? jobListings : jobListings.filter((j) => j.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Review Job Listings</h1>
        </header>

        <section className="rounded-lg bg-white shadow-md">
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({jobListings.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  filterStatus === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({jobListings.filter((j) => j.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  filterStatus === 'approved'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved ({jobListings.filter((j) => j.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  filterStatus === 'rejected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected ({jobListings.filter((j) => j.status === 'rejected').length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">Loading job listings...</p>
            </div>
          ) : !filteredListings || filteredListings.length === 0 ? (
            <>
              {loadingError ? (
                <p className="mt-1 text-left text-sm text-[#FF5722]">{loadingError}</p>
              ) : (
                <div className="py-20 text-center text-gray-500">
                  No job listings found for this filter.
                </div>
              )}
            </>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredListings.map((job) => (
                <div key={job.id} className="mb-4 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-semibold text-gray-800">{job.title}</h3>
                      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                        <span>
                          <strong>Church:</strong> {job.church.name}
                        </span>
                        <span>
                          <strong>Ministry:</strong> {job.ministry_type}
                        </span>
                        <span>
                          <strong>Employment Type:</strong> {job.employment_type}
                        </span>
                        <span>
                          <strong>Posted:</strong> {formatDate(job.created_at)}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {titleCase(job.status)}
                      </span>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      {job.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(job.id, 'approved')}
                            disabled={actionLoadingId === job.id}
                            className="btn-primary-sm"
                          >
                            {actionLoadingId === job.id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(job.id, 'rejected')}
                            disabled={actionLoadingId === job.id}
                            className="btn-danger-sm"
                          >
                            {actionLoadingId === job.id ? 'Rejecting...' : 'Reject'}
                          </button>
                          {reviewError && (
                            <p className="mt-1 text-left text-sm text-[#FF5722]">{reviewError}</p>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => toggleExpanded(job.id)}
                        className="rounded-md bg-gray-200 p-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                      >
                        {expandedJob === job.id ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="mt-6 space-y-6 border-t border-gray-200 pt-6 text-sm">
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-700">Church Information</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <p>
                            <strong>Name:</strong> {job.church.name}
                          </p>
                          <p>
                            <strong>Location:</strong> {`${job.church.city}, ${job.church.state}`}
                          </p>
                          <p>
                            <strong>Website:</strong>{' '}
                            <a
                              href={job.church.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {job.church.website}
                            </a>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 font-semibold text-gray-700">Job Description</h4>
                        <div className="prose prose-sm max-w-none rounded-md bg-gray-50 p-4">
                          {job.job_description}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 font-semibold text-gray-700">About This Church</h4>
                        <div className="prose prose-sm max-w-none rounded-md bg-gray-50 p-4">
                          {job.about_church}
                        </div>
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
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
