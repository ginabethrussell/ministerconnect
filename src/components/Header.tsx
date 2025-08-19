'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useProfile } from '@/context/ProfileContext';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const { profile } = useProfile();
  const router = useRouter();
  const path = router.pathname;
  const hideNav = path === '/auth/reset-password';
  const group = user?.groups?.[0] || null;

  let roleHref;
  switch (group) {
    case 'Super Admin':
      roleHref = '/superadmin';
      break;
    case 'Admin':
      roleHref = '/admin';
      break;
    case 'Church User':
      roleHref = '/church';
      break;
    case 'Candidate':
      roleHref = '/candidate';
      break;
    default:
      roleHref = '/';
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-md font-regular md:w-[50%] text-center ${
      router.pathname === path ? 'bg-efcaAccent text-white' : 'text-white hover:bg-efcaAccent/80'
    }`;

  return (
    <header className="bg-efcaBlue px-6 py-4 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between pl-4">
        <Link
          href={roleHref}
          className="flex cursor-pointer items-center text-xl font-bold uppercase tracking-wide opacity-100"
        >
          <span>EFCA MinisterConnect</span>
        </Link>
        {!hideNav && (
          <button
            className="ml-2 text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
        {!hideNav && (
          <nav className="hidden h-16 items-center space-x-6 md:flex">
            {roleHref === '/candidate' && (
              <>
                <Link href="/candidate" className={navLinkClass('/candidate')}>
                  Dashboard
                </Link>
                <Link href="/candidate/profile" className={navLinkClass('/candidate/profile')}>
                  Profile
                </Link>
                {profile?.status === 'approved' && (
                  <Link href="/candidate/jobs" className={navLinkClass('/candidate/jobs')}>
                    Jobs
                  </Link>
                )}
              </>
            )}
            {roleHref === '/church' && (
              <>
                <Link href="/church" className={navLinkClass('/church')}>
                  Dashboard
                </Link>
                <Link href="/church/search" className={navLinkClass('/church/search')}>
                  Candidates
                </Link>
                <Link href="/church/jobs" className={navLinkClass('/church/jobs')}>
                  Jobs
                </Link>
                <Link
                  href="/church/mutual-interests"
                  className={navLinkClass('/church/mutual-interests')}
                >
                  Interests
                </Link>
              </>
            )}
            {roleHref === '/admin' && (
              <>
                <Link href="/admin" className={navLinkClass('/admin')}>
                  Dashboard
                </Link>
                <Link href="/admin/review" className={navLinkClass('/admin/review')}>
                  Candidates
                </Link>
                <Link href="/admin/jobs" className={navLinkClass('/admin/jobs')}>
                  Jobs
                </Link>
                <Link href="/admin/churches" className={navLinkClass('/admin/churches')}>
                  Churches
                </Link>
                <Link href="/admin/codes" className={navLinkClass('/admin/codes')}>
                  Codes
                </Link>
              </>
            )}
            {roleHref === '/superadmin' && (
              <>
                <Link href="/superadmin" className={navLinkClass('/superadmin')}>
                  Dashboard
                </Link>
                <Link href="/superadmin/users" className={navLinkClass('/superadmin/users')}>
                  Users
                </Link>
                <Link href="/superadmin/churches" className={navLinkClass('/superadmin/churches')}>
                  Churches
                </Link>
              </>
            )}
            {user != null && (
              <button
                onClick={handleLogout}
                className="text-md rounded-md px-3 py-2 font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            )}
            {user === null && (
              <>
                <Link href="/auth/login" className={navLinkClass('/auth/login')}>
                  Login
                </Link>
                <Link href="/auth/register" className={navLinkClass('/auth/register')}>
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
      {!hideNav && menuOpen && (
        <nav className="flex flex-col items-center space-y-2 pt-4 md:hidden">
          {roleHref === '/candidate' && (
            <>
              <Link
                href="/candidate"
                className={navLinkClass('/candidate')}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/candidate/profile"
                className={navLinkClass('/candidate/profile')}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              {profile?.status === 'approved' && (
                <Link
                  href="/candidate/jobs"
                  className={navLinkClass('/candidate/jobs')}
                  onClick={() => setMenuOpen(false)}
                >
                  Jobs
                </Link>
              )}
            </>
          )}
          {roleHref === '/church' && (
            <>
              <Link
                href="/church"
                className={navLinkClass('/church')}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/church/search"
                className={navLinkClass('/church/search')}
                onClick={() => setMenuOpen(false)}
              >
                Candidates
              </Link>
              <Link
                href="/church/jobs"
                className={navLinkClass('/church/jobs')}
                onClick={() => setMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href="/church/mutual-interests"
                className={navLinkClass('/church/mutual-interests')}
                onClick={() => setMenuOpen(false)}
              >
                Interests
              </Link>
            </>
          )}
          {roleHref === '/admin' && (
            <>
              <Link
                href="/admin"
                className={navLinkClass('/admin')}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/review"
                className={navLinkClass('/admin/review')}
                onClick={() => setMenuOpen(false)}
              >
                Candidates
              </Link>
              <Link
                href="/admin/jobs"
                className={navLinkClass('/admin/jobs')}
                onClick={() => setMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href="/admin/churches"
                className={navLinkClass('/admin/churches')}
                onClick={() => setMenuOpen(false)}
              >
                Churches
              </Link>
              <Link
                href="/admin/codes"
                className={navLinkClass('/admin/codes')}
                onClick={() => setMenuOpen(false)}
              >
                Codes
              </Link>
            </>
          )}
          {roleHref === '/superadmin' && (
            <>
              <Link
                href="/superadmin"
                className={navLinkClass('/superadmin')}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/superadmin/users"
                className={navLinkClass('/superadmin/users')}
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                href="/superadmin/churches"
                className={navLinkClass('/superadmin/churches')}
                onClick={() => setMenuOpen(false)}
              >
                Churches
              </Link>
            </>
          )}
          {user !== null && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="font-regular rounded-md px-3 py-2 text-center text-lg text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
          {user === null && (
            <>
              <Link
                href="/auth/login"
                className={navLinkClass('/auth/login')}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className={navLinkClass('/auth/register')}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
