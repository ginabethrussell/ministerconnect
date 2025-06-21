import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { JobListing } from '../../types';

export default function ChurchJobs() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
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

  const loadJobs = () => {
    const mockJobs: JobListing[] = [
      {
        id: 1,
        church_id: 1,
        title: 'Youth Pastor',
        ministry_type: 'Youth',
        employment_type: 'Full Time with Benefits',
        job_description: 'We are seeking a passionate and experienced Youth Pastor to lead our growing youth ministry. The ideal candidate will have a heart for discipling young people, experience in youth ministry, and strong leadership skills. Responsibilities include planning and leading weekly youth services, organizing events and retreats, mentoring youth leaders, and collaborating with parents and church leadership.',
        about_church: 'Grace Fellowship Church is a vibrant, multi-generational congregation located in Springfield, IL. We are committed to making disciples who make disciples, with a strong emphasis on family ministry and community outreach. Our church values authentic relationships, biblical teaching, and serving our community with the love of Christ.',
        created_at: '2024-07-21',
        updated_at: '2024-07-21',
      },
      {
        id: 2,
        church_id: 1,
        title: 'Worship Leader',
        ministry_type: 'Worship',
        employment_type: 'Part Time',
        job_description: 'We are looking for a gifted Worship Leader to help create meaningful worship experiences for our congregation. The role involves leading worship during Sunday services, rehearsing with the worship team, selecting appropriate songs, and helping to develop other worship leaders. Musical proficiency and a heart for worship are essential.',
        about_church: 'Grace Fellowship Church is a vibrant, multi-generational congregation located in Springfield, IL. We are committed to making disciples who make disciples, with a strong emphasis on family ministry and community outreach. Our church values authentic relationships, biblical teaching, and serving our community with the love of Christ.',
        created_at: '2024-07-20',
        updated_at: '2024-07-20',
      },
    ];
    setJobs(mockJobs);
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
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {job.employment_type}
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