import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiCode, FiEye, FiHeart, FiClock } from 'react-icons/fi';
import Layout from '../components/Layout';
import SnippetCard from '../components/SnippetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import supabase from '../lib/supabase';

export default function Explore() {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    searchQuery: ''
  });

  const ITEMS_PER_PAGE = 10;

  // Language options for filter
  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'created_at', label: 'Newest', icon: <FiClock /> },
    { value: 'views_count', label: 'Most Viewed', icon: <FiEye /> },
    { value: 'likes_count', label: 'Most Liked', icon: <FiHeart /> }
  ];

  // Fetch snippets based on current filters and pagination
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true);
        
        // Build query
        let query = supabase
          .from('snippets')
          .select('*', { count: 'exact' });
        
        // Apply language filter if selected
        if (filters.language) {
          query = query.eq('language', filters.language);
        }
        
        // Apply search query if any
        if (filters.searchQuery) {
          query = query.or(`title.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`);
        }
        
        // Apply sorting
        query = query.order(filters.sortBy, { 
          ascending: filters.sortOrder === 'asc' 
        });
        
        // Apply pagination
        query = query
          .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setSnippets(prevSnippets => page === 1 ? data : [...prevSnippets, ...data]);
        setTotalCount(count || 0);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching snippets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippets();
  }, [page, filters]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Only update on enter key or clear
    if (e.key === 'Enter' || value === '') {
      setFilters(prev => ({ ...prev, searchQuery: value }));
      setPage(1); // Reset to first page when search changes
    }
  };

  // Handle language filter change
  const handleLanguageChange = (e) => {
    setFilters(prev => ({ ...prev, language: e.target.value }));
    setPage(1); // Reset to first page when filter changes
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue }));
    setPage(1); // Reset to first page when sort changes
  };

  // Load more snippets
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <Layout title="Explore Code Snippets - CodeSnapX">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Snippets</h1>
        
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search snippets..."
              className="input pl-10 w-full"
              onKeyDown={handleSearchChange}
              defaultValue={filters.searchQuery}
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2">
            {/* Filter Toggle Button (Mobile) */}
            <button
              className="md:hidden btn btn-ghost flex items-center"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter className="mr-2" />
              Filters
              <FiChevronDown className={`ml-1 transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Filters */}
            <div className="hidden md:flex space-x-2">
              <select
                value={filters.language}
                onChange={handleLanguageChange}
                className="select"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex space-x-1">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`btn ${
                      filters.sortBy === option.value
                        ? 'btn-primary'
                        : 'btn-ghost'
                    }`}
                  >
                    {option.icon}
                    <span className="ml-1">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Filter Panel */}
        {filterOpen && (
          <div className="md:hidden bg-card-dark rounded-lg p-4 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={filters.language}
                onChange={handleLanguageChange}
                className="select w-full"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`btn ${
                      filters.sortBy === option.value
                        ? 'btn-primary'
                        : 'btn-ghost'
                    } text-sm py-1`}
                  >
                    {option.icon}
                    <span className="ml-1">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Results Info */}
        <div className="text-gray-400 text-sm mb-6">
          {!isLoading && (
            <p>Showing {snippets.length} of {totalCount} snippets</p>
          )}
        </div>
      </div>
      
      {/* Snippets Grid */}
      {isLoading && page === 1 ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Loading snippets..." />
        </div>
      ) : snippets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {snippets.map(snippet => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="btn btn-outline py-2 px-8"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="blue" text={null} />
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-card-dark rounded-lg">
          <FiCode className="mx-auto h-16 w-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
          <p className="text-gray-400 mb-6">
            {filters.searchQuery
              ? `No results for "${filters.searchQuery}"`
              : "Couldn't find any snippets matching your filters"}
          </p>
          <button
            onClick={() => {
              setFilters({
                language: '',
                sortBy: 'created_at',
                sortOrder: 'desc',
                searchQuery: ''
              });
              setPage(1);
            }}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </Layout>
  );
}
