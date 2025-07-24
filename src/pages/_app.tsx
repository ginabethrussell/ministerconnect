import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { UserProvider } from '@/context/UserContext';
import { ProfileProvider } from '@/context/ProfileContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Initialize MSW or not for local testing with BE service
const shouldStartMSW =
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_MSW === 'true';

console.log('MSW Debug:', {
  window: typeof window !== 'undefined',
  nodeEnv: process.env.NODE_ENV,
  useMsw: process.env.NEXT_PUBLIC_USE_MSW,
  useMswType: typeof process.env.NEXT_PUBLIC_USE_MSW,
  shouldStart: shouldStartMSW,
});

if (shouldStartMSW) {
  import('../mocks/browser').then(({ worker }) => {
    worker.start({ onUnhandledRequest: 'bypass' });
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ProfileProvider>
        <div className="min-h-screen flex flex-col bg-efcaGray font-sans">
          <Header />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </ProfileProvider>
    </UserProvider>
  );
}
