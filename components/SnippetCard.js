import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiCopy, FiCode, FiMoreHorizontal } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import toast from 'react-hot-toast';
import { formatTimeAgo, truncateText, formatNumber } from '../lib/utils';
import { hasUserLikedSnippet, markSnippetAsLiked, removeSnippetFromLiked } from '../lib/userIdentifier';

const SnippetCard = ({ snippet }) => {
  const [isLiked, setIsLiked] = useState(hasUserLikedSnippet(snippet.id));
  const [likesCount, setLikesCount] = useState(snippet.likes_count || 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle like status
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        // Unlike
        const response = await fetch(`/api/likes/${snippet.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
          removeSnippetFromLiked(snippet.id);
        }
      } else {
        // Like
        const response = await fetch(`/api/likes/${snippet.id}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
          markSnippetAsLiked(snippet.id);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };

  // Copy snippet to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.content);
    toast.success('Code copied to clipboard!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:translate-y-[-4px]"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <Link href={`/snippet/${snippet.id}`} className="font-medium text-lg hover:text-primary">
          {truncateText(snippet.title, 40) || 'Untitled Snippet'}
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <FiMoreHorizontal />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card-dark rounded-md shadow-lg z-10 border border-gray-700">
              <div className="py-1">
                <Link href={`/snippet/${snippet.id}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  View Full Snippet
                </Link>
                <Link href={`/snippet/raw/${snippet.id}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Raw View
                </Link>
                <button onClick={handleCopyCode} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Code Preview */}
      <div className="max-h-60 overflow-hidden relative">
        <SyntaxHighlighter
          language={snippet.language || 'javascript'}
          style={atomOneDark}
          customStyle={{ 
            margin: 0, 
            borderRadius: 0,
            background: '#1A1E2D',
            padding: '1rem',
            fontSize: '0.9rem'
          }}
          showLineNumbers={true}
          lineNumberStyle={{ color: '#4B5563' }}
        >
          {truncateText(snippet.content, 500)}
        </SyntaxHighlighter>
        
        {/* Fade out effect at the bottom */}
        {snippet.content.length > 500 && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent" />
        )}
      </div>
      
      {/* Card Footer */}
      <div className="p-4 flex flex-col space-y-2">
        {/* Author row */}
        {snippet.author && (
          <div className="text-sm text-gray-400 flex items-center">
            <FiUser className="mr-1" />
            <span className="mr-1">By:</span>
            <span className="font-medium text-gray-300 flex items-center">
              {snippet.author}
              {snippet.is_verified && (
                <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
            </span>
          </div>
        )}
        
        {/* Stats row */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <span className="flex items-center mr-4">
              <FiCode className="mr-1" />
              {snippet.language || 'Text'}
            </span>
            <span>{formatTimeAgo(snippet.created_at)}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FiEye className="mr-1" />
              {formatNumber(snippet.views_count || 0)}
            </span>
            
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <FiHeart className={`mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {formatNumber(likesCount)}
            </button>
            
            <button 
              onClick={handleCopyCode}
              className="flex items-center hover:text-primary"
            >
              <FiCopy className="mr-1" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SnippetCard;