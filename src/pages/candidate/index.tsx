'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { useProfile, Profile } from '@/context/ProfileContext';
import { getProfile } from '@/utils/api';

export default function CandidateDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();
  const { profile, setProfile } = useProfile();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
      } catch (err) {
        setError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setProfile]);

  const getStatusColor = (status: Profile['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: Profile['status']) => {
    switch (status) {
      case 'approved':
        return 'Your profile is visible to churches.';
      case 'rejected':
        return 'Your profile needs updates. Contact the site admin for more information.';
      case 'pending':
        return 'Your profile is under review.';
      default:
        return 'Complete your profile to view churches and open positions.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray p-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/4 rounded bg-gray-200"></div>
            <div className="mb-4 h-32 rounded bg-gray-200"></div>
            <div className="h-8 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-efcaGray p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-efcaDark mb-8 text-3xl font-bold">Candidate Dashboard</h1>
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-blue-800">
          Once your profile has been submitted and approved, you will be able to view open church
          positions and indicate your interest on individual church job listings. If there is mutual
          interest, churches will contact you directly.
        </div>

        {/* Profile Status Section */}
        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-efcaDark mb-2 text-xl font-bold">Profile Status</h2>
          <p className="mb-4 text-gray-500">
            Check the current status of your profile and see if any action is needed.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(profile?.status ?? 'draft')}`}
              >
                {profile?.status && typeof profile.status === 'string'
                  ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1)
                  : 'Unknown'}
              </span>
              <span className="text-gray-600">{getStatusMessage(profile?.status ?? 'draft')}</span>
            </div>
            <Link
              href="/candidate/profile"
              className="rounded bg-efcaAccent px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              {profile?.status === 'pending' ? 'View Profile' : 'Edit Profile'}
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Last updated:{' '}
            {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Profiles will be retained for 1 year after your last update.
          </p>
        </section>

        {/* Profile Actions & Contact Info */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-efcaDark mb-2 text-lg font-bold">Profile Actions</h3>
            <p className="mb-4 text-gray-500">
              Update your profile or submit it for review when ready.
            </p>
            <div className="space-y-3">
              <Link
                href="/candidate/profile"
                className="block w-full rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              >
                {profile?.status === 'pending' ? 'View Profile' : 'Edit Profile'}
              </Link>
              {profile?.status === 'approved' && (
                <Link
                  href="/candidate/jobs"
                  className="block w-full rounded bg-green-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  View Job Listings
                </Link>
              )}
              {profile?.status === 'draft' && (
                <button
                  onClick={() => router.push('/candidate/profile?submit=true')}
                  className="block w-full rounded bg-green-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Submit for Review
                </button>
              )}
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-efcaDark mb-2 text-lg font-bold">Contact Information</h3>
            <p className="mb-4 text-gray-500">
              If there is mutual interest, churches will reach out to you directly using your
              contact information.
            </p>
            {profile ? (
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                {profile.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {profile.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Complete your profile to add contact information.</p>
            )}
          </section>
        </div>

        {/* How It Works Info Card */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-efcaDark mb-4 text-lg font-bold">How It Works</h3>
          <p className="mb-6 text-gray-500">
            Follow these steps to get your profile in front of churches with open positions.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-efcaAccent/10">
                <span className="font-semibold text-efcaAccent">1</span>
              </div>
              <div>
                <h4 className="text-efcaDark font-medium">Create Your Profile</h4>
                <p className="text-gray-600">
                  Fill out your profile with your experience, resume, and contact information.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-efcaAccent/10">
                <span className="font-semibold text-efcaAccent">2</span>
              </div>
              <div>
                <h4 className="text-efcaDark font-medium">Submit for Review</h4>
                <p className="text-gray-600">Submit your profile for admin review and approval.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-efcaAccent/10">
                <span className="font-semibold text-efcaAccent">3</span>
              </div>
              <div>
                <h4 className="text-efcaDark font-medium">Get Noticed</h4>
                <p className="text-gray-600">
                  Churches can view your approved profile and express interest in you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-efcaAccent/10">
                <span className="font-semibold text-efcaAccent">4</span>
              </div>
              <div>
                <h4 className="text-efcaDark font-medium">View and Indicate Interest</h4>
                <p className="text-gray-600">
                  You can view open church positions and indicate your interest on individual job
                  listings.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-efcaAccent/10">
                <span className="font-semibold text-efcaAccent">5</span>
              </div>
              <div>
                <h4 className="text-efcaDark font-medium">Connect for Ministry</h4>
                <p className="text-gray-600">
                  If there is mutual interest, churches will reach out to you directly using your
                  contact information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
