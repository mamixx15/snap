import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  FiCode, FiUser, FiLogOut, FiHome, FiPlusCircle, 
  FiBarChart2, FiEye, FiHeart, FiFileText, FiRefreshCw
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAdmin } from '../../lib/hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import supabase from '../../lib/supabase';
import { formatDate, formatNumber } from '../../lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, adminUser, logoutAdmin, isLoading } = useAdmin();
  
  const [stats, setStats] = useState({
    totalSnippets: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [recentSnippets, setRecentSnippets] = useState([]);
  const [popularSnippets, setPopularSnippets] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/myadmin2025/login');
    }
  }, [isAdmin, isLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAdmin) return;
      
      try {
        setIsLoadingData(true);
        
        // Fetch stats
        const [
          { count: snippetsCount },
          { data: viewsData },
          { data: likesData }
        ] = await Promise.all([
          // Total snippets
          supabase
            .from('snippets')
            .select('*', { count: 'exact', head: true }),
          
          // Total views
          supabase
            .from('snippets')
            .select('views_count'),
          
          // Total likes
          supabase
            .from('snippets')
            .select('likes_count')
        ]);
        
        // Calculate total views and likes
        const totalViews = viewsData.reduce((sum, item) => sum + (item.views_count || 0), 0);
        const totalLikes = likesData.reduce((sum, item) => sum + (item.likes_count || 0), 0);
        
        setStats({
          totalSnippets: snippetsCount || 0,
          totalViews,
          totalLikes
        });
        
        // Fetch recent snippets
        const { data: recent } = await supabase
          .from('snippets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        setRecentSnippets(recent || []);
        
        // Fetch popular snippets
        const { data: popular } = await supabase
          .from('snippets')
          .select('*')
          .order('views_count', { ascending: false })
          .limit(5);
        
        setPopularSnippets(popular || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchDashboardData();
  }, [isAdmin]);

  // Handle logout
  const handleLogout = () => {
    logoutAdmin();
    router.push('/myadmin2025/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Admin Dashboard - CodeSnapX</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* Admin header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FiCode className="text-blue-500 text-2xl mr-2" />
              <span className="text-xl font-bold text-white">CodeSnapX Admin</span>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:flex items-center mr-4">
                <FiUser className="text-gray-400 mr-2" />
                <span className="text-gray-300">{adminUser?.display_name || 'Admin'}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="btn btn-ghost text-sm"
              >
                <FiLogOut className="mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="bg-gray-800 rounded-lg p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'dashboard' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <FiBarChart2 className="mr-2" /> Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('snippets')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'snippets' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <FiCode className="mr-2" /> All Snippets
                  </button>
                </li>
                <li>
                  <Link href="/new" className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-300 hover:bg-gray-700">
                    <FiPlusCircle className="mr-2" /> Create Snippet
                  </Link>
                </li>
                <li>
                  <Link href="/" className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-300 hover:bg-gray-700">
                    <FiHome className="mr-2" /> View Site
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
                
                {isLoadingData ? (
                  <LoadingSpinner size="lg" text="Loading dashboard data..." />
                ) : (
                  <>
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-gray-400 font-medium">Total Snippets</h3>
                          <FiFileText className="text-blue-500 text-xl" />
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.totalSnippets)}</p>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-gray-400 font-medium">Total Views</h3>
                          <FiEye className="text-green-500 text-xl" />
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.totalViews)}</p>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-gray-400 font-medium">Total Likes</h3>
                          <FiHeart className="text-red-500 text-xl" />
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.totalLikes)}</p>
                      </motion.div>
                    </div>
                    
                    {/* Recent snippets */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Snippets</h2>
                        <button 
                          onClick={() => setActiveTab('snippets')}
                          className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                        >
                          View all <FiRefreshCw className="ml-1" />
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-700">
                              <th className="py-2 px-4">Title</th>
                              <th className="py-2 px-4">Author</th>
                              <th className="py-2 px-4">Language</th>
                              <th className="py-2 px-4">Created</th>
                              <th className="py-2 px-4">Views</th>
                              <th className="py-2 px-4">Likes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentSnippets.map(snippet => (
                              <tr key={snippet.id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="py-3 px-4">
                                  <Link href={`/snippet/${snippet.id}`} className="text-blue-500 hover:text-blue-400">
                                    {snippet.title || 'Untitled'}
                                  </Link>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    {snippet.author || 'Anonymous'}
                                    {snippet.is_verified && (
                                      <span className="ml-1 text-blue-500">✓</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 capitalize">{snippet.language || 'text'}</td>
                                <td className="py-3 px-4">{formatDate(snippet.created_at)}</td>
                                <td className="py-3 px-4">{formatNumber(snippet.views_count || 0)}</td>
                                <td className="py-3 px-4">{formatNumber(snippet.likes_count || 0)}</td>
                              </tr>
                            ))}
                            
                            {recentSnippets.length === 0 && (
                              <tr>
                                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                                  No snippets found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Popular snippets */}
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Popular Snippets</h2>
                        <button 
                          onClick={() => setActiveTab('snippets')}
                          className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                        >
                          View all <FiRefreshCw className="ml-1" />
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-700">
                              <th className="py-2 px-4">Title</th>
                              <th className="py-2 px-4">Author</th>
                              <th className="py-2 px-4">Language</th>
                              <th className="py-2 px-4">Created</th>
                              <th className="py-2 px-4">Views</th>
                              <th className="py-2 px-4">Likes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {popularSnippets.map(snippet => (
                              <tr key={snippet.id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="py-3 px-4">
                                  <Link href={`/snippet/${snippet.id}`} className="text-blue-500 hover:text-blue-400">
                                    {snippet.title || 'Untitled'}
                                  </Link>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    {snippet.author || 'Anonymous'}
                                    {snippet.is_verified && (
                                      <span className="ml-1 text-blue-500">✓</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 capitalize">{snippet.language || 'text'}</td>
                                <td className="py-3 px-4">{formatDate(snippet.created_at)}</td>
                                <td className="py-3 px-4">{formatNumber(snippet.views_count || 0)}</td>
                                <td className="py-3 px-4">{formatNumber(snippet.likes_count || 0)}</td>
                              </tr>
                            ))}
                            
                            {popularSnippets.length === 0 && (
                              <tr>
                                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                                  No snippets found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'snippets' && (
              <SnippetsTable />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for all snippets table
function SnippetsTable() {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  
  const ITEMS_PER_PAGE = 10;
  
  // Fetch snippets
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true);
        
        // Build query
        let query = supabase
          .from('snippets')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });
        
        // Apply search if any
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
        }
        
        // Apply pagination
        query = query.range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);
        
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        setSnippets(data || []);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching snippets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippets();
  }, [page, searchQuery]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInputValue);
    setPage(1);
  };

  // Handle snippet deletion
  const handleDeleteSnippet = async (id) => {
    if (!confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state to remove the deleted snippet
      setSnippets(snippets.filter(snippet => snippet.id !== id));
      setTotalCount(prev => prev - 1);
      
      toast.success('Snippet deleted successfully');
    } catch (error) {
      console.error('Error deleting snippet:', error);
      toast.error('Failed to delete snippet');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Snippets</h1>
      
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          className="input flex-grow"
          placeholder="Search snippets by title, content or author..."
        />
        <button type="submit" className="btn btn-primary ml-2">Search</button>
      </form>
      
      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading snippets..." />
      ) : (
        <>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-700">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Author</th>
                    <th className="py-2 px-4">Language</th>
                    <th className="py-2 px-4">Created</th>
                    <th className="py-2 px-4">Views</th>
                    <th className="py-2 px-4">Likes</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {snippets.map(snippet => (
                    <tr key={snippet.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <Link href={`/snippet/${snippet.id}`} className="text-blue-500 hover:text-blue-400">
                          {snippet.title || 'Untitled'}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {snippet.author || 'Anonymous'}
                          {snippet.is_verified && (
                            <span className="ml-1 text-blue-500">✓</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">{snippet.language || 'text'}</td>
                      <td className="py-3 px-4">{formatDate(snippet.created_at)}</td>
                      <td className="py-3 px-4">{formatNumber(snippet.views_count || 0)}</td>
                      <td className="py-3 px-4">{formatNumber(snippet.likes_count || 0)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/snippet/${snippet.id}`} 
                            className="text-gray-400 hover:text-blue-500"
                            title="View"
                          >
                            <FiEye />
                          </Link>
                          <button
                            onClick={() => handleDeleteSnippet(snippet.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                              <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {snippets.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                        No snippets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          {totalCount > ITEMS_PER_PAGE && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-gray-500">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalCount)} of {totalCount} snippets
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`btn ${page === 1 ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-ghost'}`}
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * ITEMS_PER_PAGE >= totalCount}
                  className={`btn ${page * ITEMS_PER_PAGE >= totalCount ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-ghost'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}