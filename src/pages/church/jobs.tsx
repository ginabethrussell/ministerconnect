import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { JobPosting } from '../../types';

export default function ChurchJobs() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

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
    const mockJobs: JobPosting[] = [
      {
        id: '1',
        churchId: 'church-1',
        churchName: 'Ainsworth EFC',
        title: 'Associate Pastor of Family Ministries',
        position: 'Family ministry',
        employmentType: 'Full Time with Benefits',
        location: { city: 'Ainsworth', state: 'NE' },
        jobUrl: 'https://jobs.efca.org/jobs/1047',
        isActive: true,
        createdAt: '2024-07-21',
        updatedAt: '2024-07-21',
      },
      {
        id: '2',
        churchId: 'church-1',
        churchName: 'Grace Community Church',
        title: 'Worship Leader',
        position: 'Worship & Arts',
        employmentType: 'Part Time',
        location: { city: 'Springfield', state: 'IL' },
        jobUrl: 'https://jobs.efca.org/jobs/1048', // Example URL
        isActive: true,
        createdAt: '2024-07-20',
        updatedAt: '2024-07-20',
      },
    ];
    setJobs(mockJobs);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
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
            <Link
              href="/church"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <li className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-600 mb-4">Click "Post New Job" to create your first listing.</p>
              </li>
            ) : (
              jobs.map(job => (
                <li key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-efcaDark hover:text-efcaAccent hover:underline">
                        {job.title}
                      </a>
                      <p className="text-md text-gray-800">{job.position}</p>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">{job.employmentType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-medium text-gray-900">{job.churchName}</p>
                      <p className="text-sm text-gray-600">{job.location.city}, {job.location.state}</p>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 