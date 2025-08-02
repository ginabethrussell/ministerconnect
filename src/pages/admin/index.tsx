import React from 'react';
import Link from 'next/link';

const features = [
  {
    title: 'Review Candidate Profiles',
    description:
      'View, approve, or reject candidate profiles and submitted files before releasing them to church visibility.',
    href: '/admin/review',
    icon: '👥',
  },
  {
    title: 'Review Job Listings',
    description:
      'Review, approve, or reject job listings posted by churches before they become visible to candidates.',
    href: '/admin/jobs',
    icon: '💼',
  },
  {
    title: 'Manage Churches',
    description:
      'Create new churches, edit church information, and manage church user accounts and access.',
    href: '/admin/churches',
    icon: '⛪',
  },
  {
    title: 'Manage Invite Codes',
    description:
      'Create, edit, and delete invite codes for events. Control access for applicants with code-based registration.',
    href: '/admin/codes',
    icon: '🔑',
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Admin Dashboard</h1>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-2">Welcome to the Admin Dashboard</h2>
          <p className="text-gray-600 mb-4">
            Manage the Minister Connect platform by reviewing candidate profiles, job listings, and
            managing church access. Use the tools below to maintain platform quality and security.
          </p>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
            <p className="text-sm">
              <strong>Note:</strong> All candidate profiles and job listings require admin approval
              before becoming visible to other users.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-efcaDark mb-4">Admin Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="block group">
                <div className="h-full bg-gray-50 rounded-lg p-6 hover:bg-efcaAccent/10 transition-colors border border-gray-200 group-hover:border-efcaAccent">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{feature.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-efcaDark mb-2 group-hover:text-efcaAccent transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      <span className="text-efcaAccent font-semibold text-sm group-hover:underline">
                        Access {feature.title} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-efcaDark mb-2">Quick Actions</h3>
          <p className="text-gray-600 mb-4">Common admin tasks to help you get started quickly.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/review"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Review Pending Profiles
            </Link>
            <Link
              href="/admin/jobs"
              className="px-4 py-2 bg-efcaAccent text-white rounded font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Review Job Listings
            </Link>
            <Link
              href="/admin/churches/create"
              className="px-4 py-2 bg-green-600 text-white rounded font-semibold text-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Create New Church
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
