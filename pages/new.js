import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiCode, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import CodeEditor from '../components/CodeEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBestUserIdentifier } from '../lib/userIdentifier';
import { generateSnippetId } from '../lib/utils';
import { useAdmin } from '../lib/hooks/useAdmin';
import supabase from '../lib/supabase';

export default function NewSnippet() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAdmin, adminUser, isLoading: isAdminLoading } = useAdmin();

  // Handle code changes from the editor
  const handleCodeChange = (newCode) => {
    setContent(newCode);
    validateField('content', newCode);
  };

  // Handle language changes from the editor
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Validate a specific field
  const validateField = (field, value) => {
    let newErrors = { ...errors };
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.length > 100) {
          newErrors.title = 'Title cannot exceed 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'content':
        if (!value.trim()) {
          newErrors.content = 'Code content is required';
        } else {
          delete newErrors.content;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update validateForm to include author validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Code content is required';
    }
    
    if (!isAdmin && !author.trim()) {
      newErrors.author = 'Author name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a unique ID for the snippet
      const snippetId = generateSnippetId();
      
      // Get user identifier (from localStorage or IP)
      const userId = await getBestUserIdentifier();
      
      // Create snippet in Supabase
      const { data, error } = await supabase
        .from('snippets')
        .insert([
          {
            id: snippetId,
            title,
            content,
            language,
            description: description.trim() || null,
            is_private: isPrivate,
            user_id: userId,
            // Use admin's name if logged in, otherwise use the entered author name
            author: isAdmin ? adminUser.display_name : author.trim(),
            // Only mark as verified if admin is creating the snippet
            is_verified: isAdmin,
            views_count: 0,
            likes_count: 0
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success('Snippet created successfully!');
      
      // Redirect to the new snippet page
      router.push(`/snippet/${snippetId}`);
    } catch (error) {
      console.error('Error creating snippet:', error);
      toast.error('Failed to create snippet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create New Snippet - CodeSnapX">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Snippet</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                validateField('title', e.target.value);
              }}
              className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter a title for your snippet"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea w-full h-20"
              placeholder="Add a brief description of your code snippet"
            />
          </div>
          
          {/* Author Input - Only show if not logged in as admin */}
          {!isAdmin && (
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    validateAuthorField(e.target.value);
                  }}
                  className={`input w-full pl-10 ${errors.author ? 'border-red-500' : ''}`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author}</p>
              )}
            </div>
          )}
          
          {/* Show admin author badge if logged in as admin */}
          {isAdmin && adminUser && (
            <div className="bg-gray-800 p-4 rounded-lg flex items-center">
              <FiUser className="text-blue-500 mr-2" />
              <span className="text-gray-300 mr-2">Author:</span>
              <span className="font-medium flex items-center">
                {adminUser.display_name}
                <span className="inline-flex ml-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Verified
                </span>
              </span>
            </div>
          )}
          
          {/* Code Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Code <span className="text-red-500">*</span>
            </label>
            <CodeEditor
              code={content}
              language={language}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              readOnly={false}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>
          
          {/* Privacy Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is-private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
            />
            <label htmlFor="is-private" className="ml-2 block text-sm text-gray-300">
              Make this snippet private (only accessible with direct link)
            </label>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <motion.button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              <FiX className="mr-2" /> Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" color="white" text={null} />
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Snippet
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </Layout>
  );
}