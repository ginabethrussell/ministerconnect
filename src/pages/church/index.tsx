import Link from 'next/link';

export default function ChurchDashboard() {

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Church Dashboard</h1>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-2">Welcome to Your Church Dashboard</h2>
          <p className="text-gray-600 mb-4">
            As a church user, you can post job openings, search for qualified candidates, save your favorites, and
            contact them directly. Use the links below to get started.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/church/jobs/create"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Post Job Openings
            </Link>
            <Link
              href="/church/jobs"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Manage Jobs
            </Link>
            <Link
              href="/church/search"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Search Candidates
            </Link>
            <Link
              href="/church/mutual-interests"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              View Mutual Interests
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
