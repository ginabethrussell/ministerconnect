import React, { useState } from 'react';
import Link from 'next/link';

const dummyApplicants = [
  { id: '1', name: 'Jane Doe', email: 'jane@example.com', status: 'Approved' },
  { id: '2', name: 'John Smith', email: 'john@example.com', status: 'Approved' },
];

export default function ChurchSearch() {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const filteredApplicants = dummyApplicants.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (id: string) => {
    if (!saved.includes(id)) {
      setSaved([...saved, id]);
    }
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Search Applicants</h1>
          <Link
            href="/church"
            className="px-4 py-2 bg-efcaDark text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            Dashboard
          </Link>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent mb-4"
          />
          <ul className="divide-y divide-gray-200">
            {filteredApplicants.length === 0 && (
              <li className="py-4 text-gray-500">No applicants found.</li>
            )}
            {filteredApplicants.map((applicant) => (
              <li key={applicant.id} className="py-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-efcaDark">{applicant.name}</div>
                  <div className="text-gray-600 text-sm">{applicant.email}</div>
                </div>
                <button
                  onClick={() => handleSave(applicant.id)}
                  className="px-3 py-1 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent text-sm"
                  disabled={saved.includes(applicant.id)}
                >
                  {saved.includes(applicant.id) ? 'Saved' : 'Save'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
