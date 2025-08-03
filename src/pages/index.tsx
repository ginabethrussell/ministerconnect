'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

const HomePage = () => {
  const { user } = useUser();

  // A logged in user arrives here if the user has not been
  // assigned a backend group. This user needs to contact the
  // site admin to have the proper group assigned to control
  // site access and functionality.

  if (user)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-efcaGray font-sans">
        <div className="max-w-xl rounded bg-white p-8 text-center shadow">
          <h1 className="mb-4 text-3xl font-bold text-efcaBlue">
            Welcome to EFCA Great Lakes District Minister Connect
          </h1>
          <p className="mb-6 text-gray-700">
            Hi, {user.name}! You have successfully logged into Minister Connect but we are unable to
            determine your role as a candidate, church user, or admin.
          </p>
          <p>
            Please{' '}
            <a
              // TODO: update this to the correct email address
              href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
              className="hover:text-efcaAccent-dark text-efcaAccent underline"
            >
              contact the site admin
            </a>{' '}
            to be granted the correct access.
          </p>
        </div>
      </div>
    );
  // Landing Page for an Anonymous User
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-xl rounded bg-white p-8 text-center shadow">
        <h1 className="mb-4 text-3xl font-bold text-efcaBlue">
          Welcome to EFCA Great Lakes District Minister Connect
        </h1>
        <p className="mb-6 text-gray-700">
          Minister Connect provides job candidates and churches a secure, admin-approved platform
          for expressing mutual interest.
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block rounded bg-efcaAccent px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
          >
            Login (All Users)
          </Link>
          <Link
            href="/auth/register"
            className="block rounded bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Candidate Registration
          </Link>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Churches: Please{' '}
            <a
              // TODO: update this to the correct email address
              href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
              className="hover:text-efcaAccent-dark text-efcaAccent underline"
            >
              contact the admin
            </a>{' '}
            for access.
          </p>
          <p>Admins: Use your pre-assigned credentials to log in.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
