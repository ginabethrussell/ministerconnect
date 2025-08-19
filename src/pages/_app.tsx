import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { UserProvider } from '@/context/UserContext';
import { ProfileProvider } from '@/context/ProfileContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeedbackWidget from '@/components/FeedbackWidget';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ProfileProvider>
        <div className="flex min-h-screen flex-col bg-efcaGray font-sans">
          <Header />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <FeedbackWidget />
          <Footer />
        </div>
      </ProfileProvider>
    </UserProvider>
  );
}
