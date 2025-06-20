import React, { useState } from 'react';
import Link from 'next/link';

const dummySaved = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-123-4567',
    status: 'Approved',
    event: 'Job Fair 2025',
    createdAt: '2024-06-01',
    streetAddress: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    resumeUrl: '/student-pastor-resume.pdf',
    videoUrl: 'https://example.com/video-jane.mp4',
    pictureUrl: '/sampleman.jpg',
  },
];

export default function SavedCandidates() {
  const [saved, setSaved] = useState(dummySaved);

  const handleRemove = (id: string) => {
    setSaved(saved.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Saved Candidates</h1>
          <Link
            href="/church"
            className="px-4 py-2 bg-efcaDark text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            Dashboard
          </Link>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6">
          {saved.length === 0 ? (
            <div className="py-4 text-gray-500">No saved candidates.</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white rounded shadow p-4 flex flex-col h-full"
                >
                  {candidate.pictureUrl && (
                    <img
                      src={candidate.pictureUrl}
                      alt={`${candidate.name}'s profile`}
                      className="h-24 w-24 object-cover rounded-lg border mx-auto mb-2"
                    />
                  )}
                  <div className="font-bold text-lg text-efcaText mb-1">{candidate.name}</div>
                  <div className="text-sm text-gray-600 mb-1 break-all">{candidate.email}</div>
                  <div className="text-xs text-efcaMuted mb-1">Phone: {candidate.phone}</div>
                  <div className="text-xs text-efcaMuted mb-1">Status: {candidate.status}</div>
                  <div className="text-xs text-efcaMuted mb-1">Event: {candidate.event}</div>
                  <div className="text-xs text-efcaMuted mb-1">
                    Submitted: {candidate.createdAt}
                  </div>
                  <div className="text-xs text-efcaMuted mb-1">
                    Address: {candidate.streetAddress}, {candidate.city}, {candidate.state}{' '}
                    {candidate.zipCode}
                  </div>
                  {candidate.resumeUrl && (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline text-xs mb-1"
                    >
                      View Resume
                    </a>
                  )}
                  {candidate.videoUrl && (
                    <a
                      href={candidate.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-efcaAccent underline text-xs mb-1"
                    >
                      View Video
                    </a>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      onClick={() => handleRemove(candidate.id)}
                      className="btn-secondary flex-1"
                    >
                      Remove
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
