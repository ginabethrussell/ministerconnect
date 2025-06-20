import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { JobPosting } from '../../../types';

export default function CreateJob() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    employmentType: '' as JobPosting['employmentType'] | '',
    jobUrl: '',
  });

  useEffect(() => {
    const checkProfileCompletion = () => {
      const churchName = localStorage.getItem('churchName');
      const churchEmail = localStorage.getItem('churchEmail');
      const churchPhone = localStorage.getItem('churchPhone');
      const streetAddress = localStorage.getItem('churchStreetAddress');
      const city = localStorage.getItem('churchCity');
      const state = localStorage.getItem('churchState');
      const zipCode = localStorage.getItem('churchZipCode');
      
      const isComplete = !!(churchName && churchEmail && churchPhone && streetAddress && city && state && zipCode);
      setIsProfileComplete(isComplete);
      setLoading(false);
      
      if (!isComplete) {
        router.push('/church/settings?incomplete=true');
      }
    };

    checkProfileCompletion();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.title || !formData.position || !formData.employmentType || !formData.jobUrl) {
      alert('Please fill in all required fields.');
      setSaving(false);
      return;
    }

    const newJob: Partial<JobPosting> = {
      churchId: 'church-1', // Mocked
      churchName: localStorage.getItem('churchName') || 'Sample Church',
      title: formData.title,
      position: formData.position,
      employmentType: formData.employmentType as JobPosting['employmentType'],
      location: {
        city: localStorage.getItem('churchCity') || '',
        state: localStorage.getItem('churchState') || '',
      },
      jobUrl: formData.jobUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating simplified job posting:', newJob);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setSaving(false);
      router.push('/church/jobs');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Create Job Posting</h1>
          <Link
            href="/church/jobs"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Back to Jobs
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <p className="text-gray-600">
            Link to an existing job posting on the 
            {" "}<Link href="https://jobs.efca.org" target="_blank" className="text-efcaAccent hover:underline">EFCA Jobs </Link>{" "}website. 
            This information will be displayed to candidates.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              placeholder="e.g., Associate Pastor of Family Ministries"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ministry Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              placeholder="e.g., Family ministry"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent bg-white"
              required
            >
              <option value="" disabled>Select an employment type</option>
              <option value="Full Time with Benefits">Full Time with Benefits</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Posting URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.jobUrl}
              onChange={(e) => handleInputChange('jobUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              placeholder="https://jobs.efca.org/jobs/..."
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/church/jobs"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-efcaAccent text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Creating...' : 'Create Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 