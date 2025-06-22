import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Initialize MSW
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('../mocks/browser').then(({ worker }) => {
    worker.start({ onUnhandledRequest: 'bypass' });
  });
}

// Define public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/force-password-change',
];

// Define role-based paths
const roleBasedPaths = {
  candidate: ['/candidate', '/candidate/profile', '/candidate/jobs'],
  church: [
    '/church',
    '/church/jobs',
    '/church/jobs/create',
    '/church/search',
    '/church/mutual-interests',
  ],
  admin: [
    '/admin',
    '/admin/review',
    '/admin/churches',
    '/admin/churches/create',
    '/admin/churches/edit',
    '/admin/codes',
    '/admin/jobs',
  ],
  superadmin: [
    '/superadmin',
    '/superadmin/users',
    '/superadmin/profiles',
    '/superadmin/churches',
    '/superadmin/invite-codes'
  ],
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<'draft' | 'pending' | 'approved' | 'rejected' | undefined>(undefined);

  useEffect(() => {
    // Check if user is authenticated
    // TODO: update this to check to see if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);

    // Fetch profile status for candidates
    if (userRole === 'candidate' && isAuthenticated) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            setProfileStatus(data.profile.status);
          }
        })
        .catch(() => {
          // If profile fetch fails, assume draft status
          setProfileStatus('draft');
        });
    }

    // Get current path
    const currentPath = router.pathname;

    // Allow access to public paths
    if (publicPaths.includes(currentPath)) {
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check role-based access
    if (userRole && roleBasedPaths[userRole as keyof typeof roleBasedPaths]) {
      const allowedPaths = roleBasedPaths[userRole as keyof typeof roleBasedPaths];
      if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
        router.push('/');
      }
    }
  }, [router.pathname, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // TODO: update this to logout the user
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      setRole(null);
      setProfileStatus(undefined);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-efcaGray font-sans">
      <Header role={role} onLogout={handleLogout} profileStatus={profileStatus} />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
