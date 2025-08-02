import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { UserProvider } from '@/context/UserContext';
import { ProfileProvider } from '@/context/ProfileContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
