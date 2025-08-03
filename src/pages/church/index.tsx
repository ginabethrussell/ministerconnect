import Link from 'next/link';

export default function ChurchDashboard() {
  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-efcaDark text-3xl font-bold">Church Dashboard</h1>
        </header>
        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-efcaDark mb-2 text-xl font-bold">Welcome to Your Church Dashboard</h2>
          <p className="mb-4 text-gray-600">
            As a church user, you can post job openings, search for qualified candidates, save your
            favorites, and contact them directly. Use the links below to get started.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/church/jobs/create"
              className="rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              Post Job Openings
            </Link>
            <Link
              href="/church/jobs"
              className="rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              Manage Jobs
            </Link>
            <Link
              href="/church/search"
              className="rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              Search Candidates
            </Link>
            <Link
              href="/church/mutual-interests"
              className="rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              View Mutual Interests
            </Link>
          </div>
        </section>
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-efcaDark mb-2 text-lg font-bold">How It Works</h3>
          <ol className="list-inside list-decimal space-y-2 text-gray-700">
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
