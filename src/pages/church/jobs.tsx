import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { JobListing } from '../../types';

interface JobListingWithStatus extends JobListing {
  status: 'pending' | 'approved' | 'rejected';
}

export default function ChurchJobs() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListingWithStatus[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);

  useEffect(() => {
    // Profile completion check
    const churchName = localStorage.getItem('churchName');
    const isComplete = !!churchName; // Simplified check for this example
    setIsProfileComplete(isComplete);
    setLoading(false);
      
    if (!isComplete) {
      router.push('/church/settings?incomplete=true');
    } else {
      loadJobs();
    }
  }, [router]);

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/job-listings');
      if (response.ok) {
        const data = await response.json();
        // Filter to only show jobs for this church (church_id: 1 for now)
        const churchJobs = data.filter((job: JobListingWithStatus) => job.church_id === 1);
        setJobs(churchJobs);
      } else {
        console.error('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleDeleteJob = (jobId: number) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
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
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Job Postings</h1>
          <div className="flex gap-4">
            <Link
              href="/church/jobs/create"
              className="px-4 py-2 bg-efcaAccent text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              + Post New Job
            </Link>
          </div>
        </header>

        {/* Job Listings */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-4">Click "Post New Job" to create your first listing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => {
                const isExpanded = expandedJobs.includes(job.id);
                
                return (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-efcaDark">
                            {job.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-lg font-medium text-gray-800">
                              {job.church_id === 1 ? 'Grace Fellowship Church' : 'New Hope Community Church'}
                            </p>
                            <p className="text-gray-600">{job.ministry_type}</p>
                            <p className="text-sm text-gray-500">
                              {job.church_id === 1 ? 'Springfield, IL' : 'Shelbyville, IL'}
                            </p>
                          </div>
                          <div className="text-right md:text-left">
                            <span className={`inline-block px-3 py-1 ${getStatusColor(job.status)} text-sm font-medium rounded-full`}>
                              {getStatusMessage(job.status)}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Content */}
                        {isExpanded && (
                          <div className="mt-4 space-y-4 border-t pt-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
                              <p className="text-gray-700 leading-relaxed">{job.job_description}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">About This Church</h4>
                              <p className="text-gray-700 leading-relaxed">{job.about_church}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <button
                          onClick={() => toggleJobExpansion(job.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-center"
                        >
                          {isExpanded ? 'Show Less' : 'View Details'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors text-center"
                        >
                          Delete Job
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