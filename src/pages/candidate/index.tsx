import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { useProfile, Profile } from '@/context/ProfileContext';
import Link from 'next/link';
import { getProfile } from '@/utils/api';

export default function CandidateDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, []);

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
        return 'Your profile is visible to churches';
      case 'rejected':
        return 'Your profile needs updates';
      case 'pending':
        return 'Your profile is under review';
      default:
        return 'Complete your profile to view churches and open positions';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-efcaGray p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-efcaDark mb-8">Candidate Dashboard</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-8 text-center">
          Once your profile has been submitted and approved, you will be able to view open church
          positions and indicate your interest on individual church job listings. If there is mutual
          interest, churches will contact you directly.
        </div>

        {/* Profile Status Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-2">Profile Status</h2>
          <p className="text-gray-500 mb-4">
            Check the current status of your profile and see if any action is needed.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile?.status ?? 'draft')}`}
              >
                {profile?.status && typeof profile.status === 'string'
                  ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1)
                  : 'Unknown'}
              </span>
              <span className="text-gray-600">{getStatusMessage(profile?.status ?? 'draft')}</span>
            </div>
            <Link
              href="/candidate/profile"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              {profile?.status === 'pending' ? 'View Profile' : 'Edit Profile'}
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Last updated:{' '}
            {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Profiles will be retained for 1 year after your last update.
          </p>
        </section>

        {/* Profile Actions & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-efcaDark mb-2">Profile Actions</h3>
            <p className="text-gray-500 mb-4">
              Update your profile or submit it for review when ready.
            </p>
            <div className="space-y-3">
              <Link
                href="/candidate/profile"
                className="block w-full px-4 py-2 text-center bg-efcaAccent text-white rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
              >
                {profile?.status === 'pending' ? 'View Profile' : 'Edit Profile'}
              </Link>
              {profile?.status === 'approved' && (
                <Link
                  href="/candidate/jobs"
                  className="block w-full px-4 py-2 text-center bg-green-600 text-white rounded font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  View Job Listings
                </Link>
              )}
              {profile?.status === 'draft' && (
                <button
                  onClick={() => router.push('/candidate/profile?submit=true')}
                  className="block w-full px-4 py-2 text-center bg-green-600 text-white rounded font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Submit for Review
                </button>
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-efcaDark mb-2">Contact Information</h3>
            <p className="text-gray-500 mb-4">
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
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-efcaDark mb-4">How It Works</h3>
          <p className="text-gray-500 mb-6">
            Follow these steps to get your profile in front of churches with open positions.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-efcaAccent/10 rounded-full flex items-center justify-center">
                <span className="text-efcaAccent font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-efcaDark">Create Your Profile</h4>
                <p className="text-gray-600">
                  Fill out your profile with your experience, resume, and contact information.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-efcaAccent/10 rounded-full flex items-center justify-center">
                <span className="text-efcaAccent font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-efcaDark">Submit for Review</h4>
                <p className="text-gray-600">Submit your profile for admin review and approval.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-efcaAccent/10 rounded-full flex items-center justify-center">
                <span className="text-efcaAccent font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-efcaDark">Get Noticed</h4>
                <p className="text-gray-600">
                  Churches can view your approved profile and express interest in you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-efcaAccent/10 rounded-full flex items-center justify-center">
                <span className="text-efcaAccent font-semibold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-efcaDark">View and Indicate Interest</h4>
                <p className="text-gray-600">
                  You can view open church positions and indicate your interest on individual job
                  listings.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-efcaAccent/10 rounded-full flex items-center justify-center">
                <span className="text-efcaAccent font-semibold">5</span>
              </div>
              <div>
                <h4 className="font-medium text-efcaDark">Connect for Ministry</h4>
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
