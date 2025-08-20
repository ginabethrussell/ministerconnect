// components/CanonicalHead.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CanonicalHead() {
  const router = useRouter();
  const canonicalUrl = `https://ministerconnect.org${router.asPath}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
