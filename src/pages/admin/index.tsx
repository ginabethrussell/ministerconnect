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
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-efcaDark text-3xl font-bold">Admin Dashboard</h1>
        </header>

        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-efcaDark mb-2 text-xl font-bold">Welcome to the Admin Dashboard</h2>
          <p className="mb-4 text-gray-600">
            Manage the Minister Connect platform by reviewing candidate profiles, job listings, and
            managing church access. Use the tools below to maintain platform quality and security.
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
            <p className="text-sm">
              <strong>Note:</strong> All candidate profiles and job listings require admin approval
              before becoming visible to other users.
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-efcaDark mb-4 text-lg font-bold">Admin Tools</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group block">
                <div className="h-full rounded-lg border border-gray-200 bg-gray-50 p-6 transition-colors hover:bg-efcaAccent/10 group-hover:border-efcaAccent">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{feature.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-efcaDark mb-2 text-lg font-semibold transition-colors group-hover:text-efcaAccent">
                        {feature.title}
                      </h4>
                      <p className="mb-3 text-sm text-gray-600">{feature.description}</p>
                      <span className="text-sm font-semibold text-efcaAccent group-hover:underline">
                        Access {feature.title} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-efcaDark mb-2 text-lg font-bold">Quick Actions</h3>
          <p className="mb-4 text-gray-600">Common admin tasks to help you get started quickly.</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/admin/review"
              className="rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              Review Pending Profiles
            </Link>
            <Link
              href="/admin/jobs"
              className="rounded bg-efcaAccent px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              Review Job Listings
            </Link>
            <Link
              href="/admin/churches/create"
              className="rounded bg-green-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create New Church
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
