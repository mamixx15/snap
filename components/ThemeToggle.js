import { useState, useEffect } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  // Default to dark theme
  const [isDark, setIsDark] = useState(true);

  // Initialize theme on component mount
  useEffect(() => {
    // Check local storage or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else if (savedTheme === 'dark' || prefersDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      // Switch to light theme
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark theme
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
      aria-label="Toggle theme"
    >
      {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </motion.button>
  );
};

export default ThemeToggle;
