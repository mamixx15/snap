import { v4 as uuidv4 } from 'uuid';

// Get or create a unique user identifier using localStorage
export const getUserId = () => {
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }

  let userId = localStorage.getItem('codesnap_user_id');
  
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('codesnap_user_id', userId);
  }
  
  return userId;
};

// Function to get IP address through an API call (as fallback)
export const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return null;
  }
};

// Get best available user identifier (localStorage UUID or IP)
export const getBestUserIdentifier = async () => {
  const localId = getUserId();
  
  if (localId) {
    return `local_${localId}`;
  }
  
  const ipAddress = await getIpAddress();
  if (ipAddress) {
    return `ip_${ipAddress}`;
  }
  
  // If all else fails, generate a temporary random ID
  return `temp_${uuidv4()}`;
};

// Check if user has liked a snippet
export const hasUserLikedSnippet = (snippetId) => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const likedSnippets = JSON.parse(localStorage.getItem('codesnap_liked_snippets') || '[]');
  return likedSnippets.includes(snippetId);
};

// Mark a snippet as liked by the user
export const markSnippetAsLiked = (snippetId) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const likedSnippets = JSON.parse(localStorage.getItem('codesnap_liked_snippets') || '[]');
  
  if (!likedSnippets.includes(snippetId)) {
    likedSnippets.push(snippetId);
    localStorage.setItem('codesnap_liked_snippets', JSON.stringify(likedSnippets));
  }
};

// Remove a snippet from the liked list
export const removeSnippetFromLiked = (snippetId) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const likedSnippets = JSON.parse(localStorage.getItem('codesnap_liked_snippets') || '[]');
  const updatedLikes = likedSnippets.filter(id => id !== snippetId);
  localStorage.setItem('codesnap_liked_snippets', JSON.stringify(updatedLikes));
};
