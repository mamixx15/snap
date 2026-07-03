import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiLock, FiUser, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAdmin } from '../../lib/hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminLogin() {
  const router = useRouter();
  const { loginAsAdmin, isAdmin, isLoading } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to dashboard if already logged in
  if (!isLoading && isAdmin) {
    router.push('/myadmin2025/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setLoginError('Username and password are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setLoginError('');
      
      const { success, error } = await loginAsAdmin(username, password);
      
      if (success) {
        router.push('/myadmin2025/dashboard');
      } else {
        setLoginError(error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Head>
        <title>Admin Login - CodeSnapX</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CodeSnapX Admin</h1>
          <p className="text-gray-400">Log in to access admin features</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginError && (
              <div className="bg-red-900 text-white p-3 rounded-md text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="Enter admin username"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="Enter admin password"
                />
              </div>
            </div>
            
            <div>
              <motion.button
                type="submit"
                className="btn btn-primary w-full py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" text={null} />
                ) : (
                  <>
                    <FiLogIn className="mr-2" /> Log In
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}