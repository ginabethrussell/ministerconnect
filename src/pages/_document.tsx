// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

        {/* Basic metadata */}
        <meta
          name="description"
          content="A secure platform for churches and job candidates to express mutual interest."
        />
        <meta name="theme-color" content="#2b6cb1" />

        {/* Open Graph */}
        <meta property="og:title" content="Minister Connect" />
        <meta
          property="og:description"
          content="A secure platform for churches and job candidates to express mutual interest."
        />
        <meta property="og:image" content="https://www.ministerconnect.org/og-image.png" />
        <meta property="og:url" content="https://www.ministerconnect.org" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minister Connect" />
        <meta
          name="twitter:description"
          content="A secure platform for churches and job candidates to express mutual interest."
        />
        <meta name="twitter:image" content="https://www.ministerconnect.org/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
