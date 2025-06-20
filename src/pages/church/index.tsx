import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ChurchDashboard() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if church profile is complete
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
      
      // If profile is not complete, redirect to settings
      if (!isComplete) {
        router.push('/church/settings?incomplete=true');
      }
    };

    checkProfileCompletion();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If profile is not complete, don't render the dashboard
  if (!isProfileComplete) {
    return null; // Will redirect to settings
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Church Dashboard</h1>
          <div className="flex gap-2">
            <Link
              href="/church/jobs"
              className="px-4 py-2 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Manage Jobs
            </Link>
            <Link
              href="/church/settings"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('userRole');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('churchName');
                localStorage.removeItem('churchEmail');
                localStorage.removeItem('churchPhone');
                localStorage.removeItem('churchStreetAddress');
                localStorage.removeItem('churchCity');
                localStorage.removeItem('churchState');
                localStorage.removeItem('churchZipCode');
                window.location.href = '/auth/login';
              }}
              className="px-4 py-2 bg-efcaDark text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-2">Welcome to Your Church Dashboard</h2>
          <p className="text-gray-600 mb-4">
            As a church user, you can post job openings, search for qualified candidates, save your favorites, and
            contact them directly. Use the links below to get started.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/church/jobs"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Post Job Openings
            </Link>
            <Link
              href="/church/search"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Search Candidates
            </Link>
            <Link
              href="/church/candidates"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              View Saved Candidates
            </Link>
            <Link
              href="/church/jobs"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-semibold text-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Manage Job Applications
            </Link>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-efcaDark mb-2">How It Works</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Post job openings to attract qualified candidates to your ministry.</li>
            <li>Search for candidates that match your ministry needs.</li>
            <li>Save/favorite candidates to view them later.</li>
            <li>Review applications and contact candidates directly.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
