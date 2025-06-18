import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface HeaderProps {
  role: string | null;
  onLogout: () => void;
}

const Header = ({ role, onLogout }: HeaderProps) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-sm font-medium ${
      router.pathname === path ? 'bg-efcaAccent text-white' : 'text-white hover:bg-efcaAccent/80'
    }`;

  const LogoHref = !role ? '/' : `/${role}`;

  return (
    <header className="bg-efcaBlue text-white py-4 px-6 shadow">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href={LogoHref}>
          <span
            className="flex items-center font-bold text-xl uppercase tracking-wide cursor-default opacity-100"
            aria-disabled="true"
          >
            Ministry Match
          </span>
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
          {role === 'candidate' && (
            <>
              <Link href="/candidate" className={navLinkClass('/candidate')}>
                Dashboard
              </Link>
              <Link href="/candidate/profile" className={navLinkClass('/candidate/profile')}>
                Profile
              </Link>
            </>
          )}
          {role === 'church' && (
            <>
              <Link href="/church" className={navLinkClass('/church')}>
                Dashboard
              </Link>
              <Link href="/church/search" className={navLinkClass('/church/search')}>
                Search Candidates
              </Link>
              <Link href="/church/candidates" className={navLinkClass('/church/candidates')}>
                Saved Candidates
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link href="/admin" className={navLinkClass('/admin')}>
                Dashboard
              </Link>
              <Link href="/admin/review" className={navLinkClass('/admin/review')}>
                Review Candidates
              </Link>
              <Link href="/admin/churches" className={navLinkClass('/admin/churches')}>
                Manage Churches
              </Link>
              <Link href="/admin/codes" className={navLinkClass('/admin/codes')}>
                Manage Codes
              </Link>
            </>
          )}
          {role && (
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
          {!role && (
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
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {role === 'candidate' && (
            <>
              <Link href="/candidate" className={navLinkClass('/candidate')}>
                Dashboard
              </Link>
              <Link href="/candidate/profile" className={navLinkClass('/candidate/profile')}>
                Profile
              </Link>
            </>
          )}
          {role === 'church' && (
            <>
              <Link href="/church" className={navLinkClass('/church')}>
                Dashboard
              </Link>
              <Link href="/church/candidates" className={navLinkClass('/church/candidates')}>
                Applications
              </Link>
              <Link href="/church/search" className={navLinkClass('/church/search')}>
                Jobs
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link href="/admin" className={navLinkClass('/admin')}>
                Dashboard
              </Link>
              <Link href="/admin/review" className={navLinkClass('/admin/review')}>
                Review Candidates
              </Link>
              <Link href="/admin/churches" className={navLinkClass('/admin/churches')}>
                Manage Churches
              </Link>
              <Link href="/admin/codes" className={navLinkClass('/admin/codes')}>
                Manage Codes
              </Link>
            </>
          )}
          {role && (
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
          {!role && (
            <>
              <Link href="/auth/login" className={navLinkClass('/auth/login')}>
                Login
              </Link>
              <Link href="/auth/register" className={navLinkClass('/auth/register')}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
