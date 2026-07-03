import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCode, FiCopy, FiPlus, FiArrowRight, FiFileText, FiEye } from 'react-icons/fi';
import Layout from '../components/Layout';
import SnippetCard from '../components/SnippetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import supabase from '../lib/supabase';

export default function Home() {
  const [popularSnippets, setPopularSnippets] = useState([]);
  const [recentSnippets, setRecentSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true);
        
        // Fetch popular snippets (most viewed)
        const { data: popularData, error: popularError } = await supabase
          .from('snippets')
          .select('*')
          .order('views_count', { ascending: false })
          .limit(4);
        
        if (popularError) throw popularError;
        
        // Fetch recent snippets
        const { data: recentData, error: recentError } = await supabase
          .from('snippets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (recentError) throw recentError;
        
        setPopularSnippets(popularData || []);
        setRecentSnippets(recentData || []);
      } catch (error) {
        console.error('Error fetching snippets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippets();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  const features = [
    {
      icon: <FiCode />,
      title: 'Syntax Highlighting',
      description: 'Beautiful syntax highlighting for a wide range of programming languages.'
    },
    {
      icon: <FiCopy />,
      title: 'Easy Sharing',
      description: 'Share your code snippets with a simple link, no login required.'
    },
    {
      icon: <FiFileText />,
      title: 'Raw View',
      description: 'Access raw code for easy copying and downloading.'
    },
    {
      icon: <FiEye />,
      title: 'View Stats',
      description: 'Track popularity with view counts and likes.'
    }
  ];

  return (
    <Layout title="CodeSnapX - Share Your Code Snippets">
      {/* Hero Section */}
      <motion.section
        className="text-center py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Share Your Code Beautifully
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-gray-300 mb-10">
            Simple, fast, and beautiful code snippet sharing without the hassle.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <Link href="/new">
              <motion.button 
                className="btn btn-primary text-lg py-3 px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="mr-2" /> Create Snippet
              </motion.button>
            </Link>
            <Link href="/explore">
              <motion.button 
                className="btn btn-outline text-lg py-3 px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Snippets
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900 bg-opacity-70 rounded-xl my-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose CodeSnapX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-card-dark rounded-lg text-center"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={featureVariants}
              >
                <div className="text-4xl text-blue-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Snippets Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Snippets</h2>
            <Link href="/explore" className="text-blue-500 hover:text-blue-400 flex items-center">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : popularSnippets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularSnippets.map(snippet => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card-dark rounded-lg">
              <p className="text-gray-400 mb-4">No popular snippets found</p>
              <Link href="/new">
                <button className="btn btn-primary">Create the first snippet</button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recent Snippets Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Snippets</h2>
            <Link href="/explore" className="text-blue-500 hover:text-blue-400 flex items-center">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : recentSnippets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentSnippets.map(snippet => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card-dark rounded-lg">
              <p className="text-gray-400 mb-4">No recent snippets found</p>
              <Link href="/new">
                <button className="btn btn-primary">Create the first snippet</button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 mt-8">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to share your code?</h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Join thousands of developers sharing and discovering code snippets every day.
            </p>
            <Link href="/new">
              <motion.button 
                className="btn btn-primary text-lg py-3 px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="mr-2" /> Create Your First Snippet
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
