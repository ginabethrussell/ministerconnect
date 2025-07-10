import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { JobListing } from '../../../types';

export default function CreateJob() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    ministry_type: '',
    employment_type: '',
    job_description: '',
    about_church: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (
      !formData.title ||
      !formData.ministry_type ||
      !formData.employment_type ||
      !formData.job_description ||
      !formData.about_church
    ) {
      alert('Please fill in all required fields.');
      setSaving(false);
      return;
    }

    const newJob: Partial<JobListing> = {
      church_id: 1, // Mocked
      title: formData.title,
      ministry_type: formData.ministry_type,
      employment_type: formData.employment_type,
      job_description: formData.job_description,
      about_church: formData.about_church,
    };

    try {
      const response = await fetch('/api/job-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        alert(
          'Job posting created successfully! It will be reviewed by an administrator before becoming visible to candidates.'
        );
        router.push('/church/jobs');
      } else {
        alert('Error creating job posting. Please try again.');
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      alert('Error creating job posting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
            Create a job posting to attract ministry candidates. Provide detailed information about
            the position and your church.
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
              value={formData.ministry_type}
              onChange={(e) => handleInputChange('ministry_type', e.target.value)}
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
              value={formData.employment_type}
              onChange={(e) => handleInputChange('employment_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent bg-white"
              required
            >
              <option value="" disabled>
                Select an employment type
              </option>
              <option value="Full Time with Benefits">Full Time with Benefits</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.job_description}
              onChange={(e) => handleInputChange('job_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About This Church <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.about_church}
              onChange={(e) => handleInputChange('about_church', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              placeholder="Tell candidates about your church, mission, values, and community..."
              rows={4}
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
