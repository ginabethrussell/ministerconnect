'use client';
import React, { useEffect, useState } from 'react';
import { getAllJobs, reviewChurchJobs } from '../../utils/api';
import { JobListing } from '../../types';
import { titleCase } from '@/utils/helpers';

const AdminJobReview = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  useEffect(() => {
    loadJobListings();
  }, []);

  const loadJobListings = async () => {
    setLoading(true);
    try {
      const jobsRes = await getAllJobs();
      setJobListings(jobsRes.results);
    } catch (error) {
      console.error('Error loading job listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    try {
      await reviewChurchJobs(id, status);
      setJobListings((prevListings) =>
        prevListings.map((job) => (job.id === id ? { ...job, status: status } : job))
      );
    } catch (error) {
      console.error('Error updating job status:', error);
      // Optionally, revert the change on error
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
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Review Job Listings</h1>
        </header>

        <section className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({jobListings.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filterStatus === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({jobListings.filter((j) => j.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filterStatus === 'approved'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved ({jobListings.filter((j) => j.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
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
            <div className="text-center py-20">
              <p className="text-gray-500">Loading job listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No job listings found for this filter.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredListings.map((job) => (
                <div key={job.id} className="p-6  mb-4">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
                        <span>
                          <strong>Church:</strong> {job.church.name}
                        </span>
                        <span>
                          <strong>Ministry:</strong> {job.ministry_type}
                        </span>
                        <span>
                          <strong>Posted:</strong> {formatDate(job.created_at)}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {titleCase(job.status)}
                      </span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
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
                        </>
                      )}
                      <button
                        onClick={() => toggleExpanded(job.id)}
                        className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm font-medium"
                      >
                        {expandedJob === job.id ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Church Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <h4 className="font-semibold text-gray-700 mb-3">Job Description</h4>
                        <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md">
                          {job.job_description}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">About This Church</h4>
                        <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md">
                          {job.about_church}
                        </div>
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
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminJobReview;
