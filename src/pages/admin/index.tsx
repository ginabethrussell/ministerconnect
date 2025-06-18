import React from 'react';
import Link from 'next/link';

const features = [
  {
    title: 'Manage Invite Codes',
    description:
      'Create, edit, and delete invite codes for events. Control access for applicants with code-based registration.',
    href: '/admin/codes',
  },
  {
    title: 'Manage Church Users',
    description:
      'Add new church credentials, edit church user info, and remove access for churches as needed.',
    href: '/admin/churches',
  },
  {
    title: 'Review Candidate Profiles',
    description:
      'View, approve, or reject candidate profiles and submitted files and videos before releasing them to church visibility.',
    href: '/admin/review',
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-3xl w-full mx-auto p-8 bg-white rounded-xl shadow">
        <h2 className="text-3xl font-bold mb-4 text-efcaBlue">Admin Dashboard</h2>
        <p className="mb-8 text-efcaMuted text-lg">
          Welcome! Use the tools below to manage invite codes, church users, and applicant reviews.
          Click a card to get started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="block group">
              <div className="h-full bg-efcaLight rounded-lg shadow-sm p-6 hover:bg-efcaAccent/10 transition border border-efcaGray/30 group-hover:border-efcaAccent">
                <h3 className="text-xl font-semibold text-efcaBlue mb-2 group-hover:text-efcaAccent transition">
                  {feature.title}
                </h3>
                <p className="text-efcaMuted text-sm">{feature.description}</p>
                <span className="inline-block mt-4 text-efcaAccent font-semibold group-hover:underline">
                  Go to {feature.title} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
