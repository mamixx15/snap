 import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiDownload, FiCopy, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CopyButton from '../../../components/CopyButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import supabase from '../../../lib/supabase';

export default function RawSnippet() {
  const router = useRouter();
  const { id } = router.query;
  
  const [snippet, setSnippet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch snippet data for raw view
  useEffect(() => {
    const fetchSnippet = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the snippet data
        const { data, error } = await supabase
          .from('snippets')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError('Snippet not found');
          return;
        }
        
        setSnippet(data);
        
      } catch (err) {
        console.error('Error fetching snippet:', err);
        setError(err.message || 'Failed to load snippet');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippet();
  }, [id]);

  // Close raw view and go back
  const handleClose = () => {
    router.back();
  };

  // Download the snippet as a file
  const downloadSnippet = () => {
    if (!snippet) return;
    
    // Determine file extension based on language
    const getFileExtension = (lang) => {
      const extensions = {
        javascript: 'js',
        typescript: 'ts',
        python: 'py',
        java: 'java',
        csharp: 'cs',
        cpp: 'cpp',
        c: 'c',
        php: 'php',
        ruby: 'rb',
        go: 'go',
        swift: 'swift',
        kotlin: 'kt',
        rust: 'rs',
        html: 'html',
        css: 'css',
        sql: 'sql',
        bash: 'sh',
        plaintext: 'txt',
        text: 'txt',
      };
      
      return extensions[lang?.toLowerCase()] || 'txt';
    };
    
    // Create a blob with the content
    const blob = new Blob([snippet.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create filename
    const fileName = `${snippet.title || 'snippet'}.${getFileExtension(snippet.language)}`;
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Snippet downloaded');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <Head>
          <title>Loading Raw Snippet - CodeSnapX</title>
        </Head>
        <LoadingSpinner size="xl" text="Loading raw snippet..." />
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 p-4">
        <Head>
          <title>Snippet Not Found - CodeSnapX</title>
        </Head>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Snippet Not Found</h1>
          <p className="text-gray-400 mb-8">
            The snippet you are looking for doesn't exist or has been removed.
          </p>
          <button onClick={handleClose} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Head>
        <title>
          {snippet.title ? `${snippet.title} (Raw) - CodeSnapX` : 'Raw Snippet - CodeSnapX'}
        </title>
      </Head>
      
      {/* Floating toolbar */}
      <div className="fixed top-4 right-4 z-10 flex space-x-2">
        <CopyButton
          text={snippet.content}
          className="bg-gray-800 hover:bg-gray-700"
          iconOnly={true}
          size="md"
        />
        
        <button
          onClick={downloadSnippet}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Download snippet"
        >
          <FiDownload className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Close raw view"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content */}
      <pre className="flex-1 p-4 sm:p-8 overflow-auto text-gray-200 font-mono text-sm whitespace-pre-wrap">
        {snippet.content}
      </pre>
    </div>
  );
}
