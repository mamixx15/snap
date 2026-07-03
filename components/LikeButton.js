import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { hasUserLikedSnippet, markSnippetAsLiked, removeSnippetFromLiked } from '../lib/userIdentifier';
import { formatNumber } from '../lib/utils';

const LikeButton = ({ 
  snippetId, 
  initialLikesCount = 0,
  iconOnly = false,
  size = 'md',
  onLikeChange = () => {}
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if the user has already liked this snippet
    setIsLiked(hasUserLikedSnippet(snippetId));
  }, [snippetId]);

  useEffect(() => {
    setLikesCount(initialLikesCount);
  }, [initialLikesCount]);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        // Unlike
        const response = await fetch(`/api/likes/${snippetId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
          removeSnippetFromLiked(snippetId);
          onLikeChange(false, Math.max(0, likesCount - 1));
        }
      } else {
        // Like with animation
        setIsAnimating(true);
        
        const response = await fetch(`/api/likes/${snippetId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
          markSnippetAsLiked(snippetId);
          onLikeChange(true, likesCount + 1);
        }
        
        // End animation after a short delay
        setTimeout(() => setIsAnimating(false), 500);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };

  // Size classes for the button
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  };

  // Icon size based on button size
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLikeToggle}
      className={`${iconOnly ? 'rounded-full' : 'rounded-md flex items-center'} ${sizeClasses[size]} ${
        isLiked 
          ? 'text-red-500' 
          : 'text-gray-400 hover:text-red-500'
      } transition-all focus:outline-none focus:ring-2 focus:ring-red-500`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <FiHeart 
          className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''}`} 
        />
      </motion.div>
      
      {!iconOnly && (
        <span className="ml-1">{formatNumber(likesCount)}</span>
      )}
    </motion.button>
  );
};

export default LikeButton;
