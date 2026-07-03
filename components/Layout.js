import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, title = 'CodeSnapX - Share Your Code Snippets' }) => {
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Share your code snippets easily with CodeSnapX" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <main className="flex-grow container-custom py-8">
        {mounted && children}
      </main>

      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#1E293B',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#1E293B',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
