import React, { useState } from 'react';
import Link from 'next/link';

const dummyApplicants = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-123-4567',
    status: 'Approved',
    event: 'Ministry Match',
    createdAt: '2024-06-01',
    streetAddress: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    resumeUrl: 'https://example.com/resume-jane.pdf',
    videoUrl: 'https://example.com/video-jane.mp4',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-987-6543',
    status: 'Approved',
    event: 'Old Event',
    createdAt: '2024-05-20',
    streetAddress: '456 Oak Ave',
    city: 'Lincoln',
    state: 'NE',
    zipCode: '68508',
    resumeUrl: '',
    videoUrl: '',
  },
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
          <h1 className="text-3xl font-bold text-efcaDark">Search Candidates</h1>
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
          {filteredApplicants.length === 0 ? (
            <div className="py-4 text-gray-500">No candidates found.</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white rounded shadow p-4 flex flex-col h-full"
                >
                  <div className="font-bold text-lg text-efcaText mb-1">{applicant.name}</div>
                  <div className="text-sm text-gray-600 mb-1 break-all">{applicant.email}</div>
                  <div className="text-xs text-efcaMuted mb-1">Phone: {applicant.phone}</div>
                  <div className="text-xs text-efcaMuted mb-1">Status: {applicant.status}</div>
                  <div className="text-xs text-efcaMuted mb-1">Event: {applicant.event}</div>
                  <div className="text-xs text-efcaMuted mb-1">
                    Submitted: {applicant.createdAt}
                  </div>
                  <div className="text-xs text-efcaMuted mb-1">
                    Address: {applicant.streetAddress}, {applicant.city}, {applicant.state}{' '}
                    {applicant.zipCode}
                  </div>
                  {applicant.resumeUrl && (
                    <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline text-xs mb-1"
                    >
                      View Resume
                    </a>
                  )}
                  {applicant.videoUrl && (
                    <a
                      href={applicant.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline text-xs mb-1"
                    >
                      View Video
                    </a>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      onClick={() => handleSave(applicant.id)}
                      className="btn-primary flex-1 disabled:opacity-50"
                      disabled={saved.includes(applicant.id)}
                    >
                      {saved.includes(applicant.id) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
