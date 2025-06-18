import React, { useState } from 'react';
import Link from 'next/link';

const dummySaved = [{ id: '1', name: 'Jane Doe', email: 'jane@example.com', status: 'Approved' }];

export default function SavedApplicants() {
  const [saved, setSaved] = useState(dummySaved);

  const handleRemove = (id: string) => {
    setSaved(saved.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Saved Applicants</h1>
          <Link
            href="/church"
            className="px-4 py-2 bg-efcaDark text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            Dashboard
          </Link>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <ul className="divide-y divide-gray-200">
            {saved.length === 0 && <li className="py-4 text-gray-500">No saved applicants.</li>}
            {saved.map((applicant) => (
              <li key={applicant.id} className="py-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-efcaDark">{applicant.name}</div>
                  <div className="text-gray-600 text-sm">{applicant.email}</div>
                </div>
                <button
                  onClick={() => handleRemove(applicant.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
