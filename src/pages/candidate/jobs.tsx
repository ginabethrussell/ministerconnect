import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ExpressInterestButton from '../../components/ExpressInterestButton';
import { JobListing } from '../../types';

interface JobListingWithStatus extends JobListing {
  status: 'pending' | 'approved' | 'rejected';
  church_name: string;
  church_email: string;
  church_phone: string;
}

export default function CandidateJobs() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobListings, setJobListings] = useState<JobListingWithStatus[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, full-time, part-time
  const [expressedInterest, setExpressedInterest] = useState<number[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);

  useEffect(() => {
    const checkProfileAndLoadJobs = async () => {
      try {
        // Check if candidate profile exists and is approved
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data.success && data.profile) {
          setProfile(data.profile);
          if (data.profile.status !== 'approved') {
            // Redirect to dashboard if profile not approved
            router.push('/candidate');
            return;
          }
        } else {
          // No profile or not approved
          router.push('/candidate');
          return;
        }

        // Load approved job listings
        const jobsResponse = await fetch('/api/job-listings?status=approved');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobListings(jobsData);
        }
      } catch (error) {
        console.error('Failed to load profile or jobs:', error);
        router.push('/candidate');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkProfileAndLoadJobs();
  }, [router]);

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.ministry_type.toLowerCase().includes(search.toLowerCase()) ||
      job.church_name.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'full-time' && job.employment_type.toLowerCase().includes('full')) ||
      (filter === 'part-time' && job.employment_type.toLowerCase().includes('part'));
    
    return matchesSearch && matchesFilter;
  });

  const handleExpressInterest = async (jobId: number) => {
    try {
      // Simulate API call to express interest
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (expressedInterest.includes(jobId)) {
        // Remove interest
        setExpressedInterest(prev => prev.filter(id => id !== jobId));
      } else {
        // Add interest
        setExpressedInterest(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error('Failed to express interest:', error);
      // You could show a toast notification here
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
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How Expressing Interest Works</h3>
          <div className="text-blue-700 space-y-2">
            <p>• Click "Express Interest" to let churches know you're interested in their position</p>
            <p>• Churches will be notified of your interest and can view your profile</p>
            <p>• If there's mutual interest, churches will contact you directly using your profile information</p>
            <p>• You can express interest in multiple positions and withdraw interest at any time</p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by job title, church name, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent bg-white"
              >
                <option value="all">All Positions</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
              </select>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const hasExpressedInterest = expressedInterest.includes(job.id);
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
                              {job.church_name}
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