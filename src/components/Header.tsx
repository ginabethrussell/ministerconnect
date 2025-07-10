import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profileStatus, logout } = useUser();
  const router = useRouter();
  const group = user?.groups?.[0] || null;

  let roleHref;
  switch (group) {
    case 'Super Admin':
      roleHref = '/superadmin';
      break;
    case 'Admin':
      roleHref = '/admin';
      break;
    case 'Church Group':
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
    `block px-3 py-2 rounded-md text-lg font-regular w-[50%] text-center ${
      router.pathname === path ? 'bg-efcaAccent text-white' : 'text-white hover:bg-efcaAccent/80'
    }`;

  const mobileNavLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-sm font-medium ${
      router.pathname === path ? 'bg-efcaAccent text-white' : 'text-white hover:bg-efcaAccent/80'
    }`;

  return (
    <header className="bg-efcaBlue text-white py-4 px-6 shadow">
      <div className="flex justify-between items-center max-w-7xl mx-auto pl-4">
        <Link
          href={roleHref}
          className="flex items-center font-bold text-xl uppercase tracking-wide cursor-pointer opacity-100"
        >
          <span>MinisterConnect</span>
        </Link>
        <button
          className="md:hidden text-white ml-2"
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
        <nav className="hidden md:flex items-center space-x-6">
          {roleHref === '/candidate' && (
            <>
              <Link href="/candidate" className={navLinkClass('/candidate')}>
                Dashboard
              </Link>
              <Link href="/candidate/profile" className={navLinkClass('/candidate/profile')}>
                Profile
              </Link>
              {profileStatus === 'approved' && (
                <Link href="/candidate/jobs" className={navLinkClass('/candidate/jobs')}>
                  View Job Listings
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
                Search Candidates
              </Link>
              <Link href="/church/jobs" className={navLinkClass('/church/jobs')}>
                Manage Jobs
              </Link>
              <Link
                href="/church/mutual-interests"
                className={navLinkClass('/church/mutual-interests')}
              >
                Mutual Interests
              </Link>
            </>
          )}
          {roleHref === '/admin' && (
            <>
              <Link href="/admin" className={navLinkClass('/admin')}>
                Dashboard
              </Link>
              <Link href="/admin/review" className={navLinkClass('/admin/review')}>
                Review Candidates
              </Link>
              <Link href="/admin/jobs" className={navLinkClass('/admin/jobs')}>
                Review Jobs
              </Link>
              <Link href="/admin/churches" className={navLinkClass('/admin/churches')}>
                Manage Churches
              </Link>
              <Link href="/admin/codes" className={navLinkClass('/admin/codes')}>
                Manage Codes
              </Link>
            </>
          )}
          {roleHref === '/superadmin' && (
            <>
              <Link href="/superadmin" className={navLinkClass('/superadmin')}>
                Dashboard
              </Link>
              <Link href="/superadmin/users" className={navLinkClass('/superadmin/users')}>
                Manage Users
              </Link>
              <Link href="/superadmin/churches" className={navLinkClass('/superadmin/churches')}>
                Manage Churches
              </Link>
            </>
          )}
          {user != null && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
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
      </div>
      {menuOpen && (
        <nav className="md:hidden flex flex-col items-center pt-4 space-y-2">
          {roleHref === '/candidate' && (
            <>
              <Link href="/candidate" className={navLinkClass('/candidate')}>
                Dashboard
              </Link>
              <Link href="/candidate/profile" className={navLinkClass('/candidate/profile')}>
                Profile
              </Link>
              {profileStatus === 'approved' && (
                <Link href="/candidate/jobs" className={navLinkClass('/candidate/jobs')}>
                  View Job Listings
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
                Search Candidates
              </Link>
              <Link href="/church/jobs" className={navLinkClass('/church/jobs')}>
                Manage Jobs
              </Link>
              <Link
                href="/church/mutual-interests"
                className={navLinkClass('/church/mutual-interests')}
              >
                Mutual Interests
              </Link>
            </>
          )}
          {roleHref === '/admin' && (
            <>
              <Link href="/admin" className={navLinkClass('/admin')}>
                Dashboard
              </Link>
              <Link href="/admin/review" className={navLinkClass('/admin/review')}>
                Review Candidates
              </Link>
              <Link href="/admin/jobs" className={navLinkClass('/admin/jobs')}>
                Review Jobs
              </Link>
              <Link href="/admin/churches" className={navLinkClass('/admin/churches')}>
                Manage Churches
              </Link>
              <Link href="/admin/codes" className={navLinkClass('/admin/codes')}>
                Manage Codes
              </Link>
            </>
          )}
          {roleHref === '/superadmin' && (
            <>
              <Link href="/superadmin" className={navLinkClass('/superadmin')}>
                Dashboard
              </Link>
              <Link href="/superadmin/users" className={navLinkClass('/superadmin/users')}>
                Manage Users
              </Link>
              <Link href="/superadmin/churches" className={navLinkClass('/superadmin/churches')}>
                Manage Churches
              </Link>
            </>
          )}
          {user !== null && (
            <button
              onClick={handleLogout}
              className="w-[50%] text-center px-3 py-2 rounded-md text-lg font-regular text-white hover:bg-red-600"
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
    </header>
  );
};

export default Header;
