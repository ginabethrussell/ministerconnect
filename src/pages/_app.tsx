import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import Header from '../components/Header';

// Define public paths that don't require authentication
const publicPaths = ['/', '/auth/login', '/auth/register'];

// Define role-based paths
const roleBasedPaths = {
  applicant: ['/applicant', '/applicant/profile'],
  church: ['/church'],
  admin: ['/admin', '/admin/review', '/admin/churches', '/admin/codes'],
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

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
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-efcaGray font-sans">
      <Header role={localStorage.getItem('userRole')} onLogout={handleLogout} />
      <Component {...pageProps} />
    </div>
  );
}
