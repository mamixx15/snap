import { format } from 'date-fns';

// Format dates in a human-readable way
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

// Format time elapsed since a date in a human-readable way
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  return format(date, 'MMM d, yyyy');
};

// Generate a random identifier for new snippets
export const generateSnippetId = () => {
  // Generate a random string for snippet ID
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Format numbers with K, M for thousands, millions
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

// Get language icon based on file extension or language name
export const getLanguageIcon = (language) => {
  if (!language) return 'code';
  
  const lang = language.toLowerCase();
  
  // Map languages to icons
  const iconMap = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    html: 'html',
    css: 'css',
    java: 'java',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    csharp: 'cs',
    'c#': 'cs',
    c: 'c',
    'c++': 'cpp',
    cpp: 'cpp',
    swift: 'swift',
    kotlin: 'kotlin',
    dart: 'dart',
    sql: 'sql',
  };
  
  return iconMap[lang] || 'code';
};

// Create a truncated version of text with ... if it exceeds maxLength
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
