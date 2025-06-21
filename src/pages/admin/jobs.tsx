import React, { useEffect, useState } from 'react';

interface JobListingWithChurch {
  id: number;
  church_id: number;
  title: string;
  ministry_type: string;
  employment_type: string;
  job_description: string;
  about_church: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  church_name: string;
  church_email: string;
  church_phone: string;
}

// Mock fetch function (replace with real API call or MSW handler)
const fetchJobListings = async (status?: string): Promise<JobListingWithChurch[]> => {
  const url = status ? `/api/job-listings?status=${status}` : '/api/job-listings';
  const res = await fetch(url);
  return res.json();
};

const updateJobStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
  await fetch(`/api/job-listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

const AdminJobReview = () => {
  const [jobListings, setJobListings] = useState<JobListingWithChurch[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  useEffect(() => {
    loadJobListings();
  }, [filterStatus]);

  const loadJobListings = async () => {
    setLoading(true);
    try {
      const data = await fetchJobListings(filterStatus === 'all' ? undefined : filterStatus);
      setJobListings(data);
    } catch (error) {
      console.error('Error loading job listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    try {
      await updateJobStatus(id, status);
      await loadJobListings(); // Reload the list
    } catch (error) {
      console.error('Error updating job status:', error);
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

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Review Job Listings</h1>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'all'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({jobListings.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'pending'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({jobListings.filter((j) => j.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'approved'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({jobListings.filter((j) => j.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'rejected'
                  ? 'bg-efcaAccent text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected ({jobListings.filter((j) => j.status === 'rejected').length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job listings...</p>
            </div>
          ) : jobListings.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No job listings found.
            </div>
          ) : (
            <div className="space-y-4">
              {jobListings.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-efcaDark mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        <span><strong>Church:</strong> {job.church_name}</span>
                        <span><strong>Ministry Type:</strong> {job.ministry_type}</span>
                        <span><strong>Employment Type:</strong> {job.employment_type}</span>
                        <span><strong>Posted:</strong> {formatDate(job.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {job.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(job.id, 'approved')}
                            disabled={actionLoadingId === job.id}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {actionLoadingId === job.id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(job.id, 'rejected')}
                            disabled={actionLoadingId === job.id}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {actionLoadingId === job.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => toggleExpanded(job.id)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                      >
                        {expandedJob === job.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <h4 className="font-semibold text-efcaDark mb-2">Church Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><strong>Name:</strong> {job.church_name}</div>
                          <div><strong>Email:</strong> {job.church_email}</div>
                          <div><strong>Phone:</strong> {job.church_phone}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-efcaDark mb-2">Job Description</h4>
                        <div className="bg-gray-50 p-4 rounded-lg text-sm">
                          {job.job_description}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-efcaDark mb-2">About This Church</h4>
                        <div className="bg-gray-50 p-4 rounded-lg text-sm">
                          {job.about_church}
                        </div>
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