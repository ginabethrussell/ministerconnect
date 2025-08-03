'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createJob } from '@/utils/api';

export default function CreateJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    ministry_type: '',
    employment_type: '',
    job_description: '',
    about_church: '',
    job_url_link: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (
      !formData.title ||
      !formData.ministry_type ||
      !formData.employment_type ||
      !formData.job_description ||
      !formData.about_church
    ) {
      alert('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      await createJob(formData);
      router.push('/church/jobs');
    } catch {
      setError(
        'Failed to create job listing. Please try again later or contact the site admin for assistance.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-efcaDark text-3xl font-bold">Create Job Posting</h1>
          <Link
            href="/church/jobs"
            className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Jobs
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
          <p className="text-gray-600">
            Create a job posting to attract ministry candidates. Provide detailed information about
            the position and your church.
          </p>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              placeholder="e.g., Associate Pastor of Family Ministries"
              required
            />
          </div>

          <div>
            <label htmlFor="ministry_type" className="mb-2 block text-sm font-medium text-gray-700">
              Ministry Type <span className="text-red-500">*</span>
            </label>
            <select
              id="ministry_type"
              name="ministry_type"
              value={formData.ministry_type}
              onChange={(e) => handleInputChange('ministry_type', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              required
            >
              <option value="" disabled>
                Select a ministry type
              </option>
              {[
                'Solo pastor',
                'Church-planting pastor',
                'Senior pastor (plus one or two full-time staff)',
                'Senior pastor (plus three or more full-time staff)',
                'Administration/operations/business',
                'Adult education/small groups/discipleship',
                'Associate pastor',
                "Children's ministry",
                'Christian education (all ages)',
                'College ministries',
                'Communications/technology',
                'Executive pastor',
                'Family/community life',
                "Men's ministry",
                'Multicultural ministry',
                'Music and worship',
                'Outreach/evangelism',
                'Pastoral care/counseling',
                'Residency',
                'Internship',
                'Seniors ministry',
                'Singles ministry',
                'Student/youth ministry',
                "Women's ministry",
              ].map((ministry, idx) => (
                <option key={`${ministry}-${idx}`} value={ministry}>
                  {ministry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="employment_type"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={(e) => handleInputChange('employment_type', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
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
            <label
              htmlFor="job_description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="job_description"
              name="job_description"
              value={formData.job_description}
              onChange={(e) => handleInputChange('job_description', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              required
            />
          </div>

          <div>
            <label htmlFor="about_church" className="mb-2 block text-sm font-medium text-gray-700">
              About This Church <span className="text-red-500">*</span>
            </label>
            <textarea
              id="about_church"
              name="about_church"
              value={formData.about_church}
              onChange={(e) => handleInputChange('about_church', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              placeholder="Tell candidates about your church, mission, values, and community..."
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="job_url_link" className="mb-2 block text-sm font-medium text-gray-700">
              Job URL Link
            </label>
            <input
              id="job_url_link"
              name="job_url_link"
              type="text"
              value={formData.job_url_link}
              onChange={(e) => handleInputChange('job_url_link', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              placeholder="Job URL Link"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/church/jobs"
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-efcaAccent px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Create Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
