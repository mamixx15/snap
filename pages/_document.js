import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0F172A" />
        <meta
          name="description"
          content="CodeSnapX - Share your code snippets easily"
        />
        {/* Add Open Graph meta tags for better social sharing */}
        <meta property="og:title" content="CodeSnapX - Code Sharing Made Simple" />
        <meta property="og:description" content="Share your code snippets beautifully with syntax highlighting and more" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codesnap-x.vercel.app" />
        <meta property="og:image" content="https://codesnap-x.vercel.app/og-image.png" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-background-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
