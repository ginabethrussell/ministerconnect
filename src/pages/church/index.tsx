import Link from 'next/link';

export default function ChurchDashboard() {
  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Church Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('userRole');
              window.location.href = '/auth/login';
            }}
            className="px-4 py-2 bg-efcaDark text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            Logout
          </button>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-2">Welcome to Your Church Dashboard</h2>
          <p className="text-gray-600 mb-4">
            As a church user, you can search for qualified candidates, save your favorites, and
            contact them directly. Use the links below to get started.
          </p>
          <div className="flex flex-col gap-4">
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
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-efcaDark mb-2">How It Works</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Search for candidates that match your ministry needs.</li>
            <li>Save/favorite candidates to view them later.</li>
            <li>Contact candidates directly using their profile information.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
