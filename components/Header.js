import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiCode, FiPlus, FiSearch, FiCompass, FiHome } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome className="mr-2" /> },
    { name: 'Explore', href: '/explore', icon: <FiCompass className="mr-2" /> },
    { name: 'New Snippet', href: '/new', icon: <FiPlus className="mr-2" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-background-dark shadow-md py-2' : 'bg-background-dark py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-primary text-3xl mr-2"
            >
              <FiCode />
            </motion.div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CodeSnapX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`btn btn-ghost rounded-md ${
                  router.pathname === link.href
                    ? 'bg-gray-800 text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center">
                  {link.icon}
                  {link.name}
                </span>
              </Link>
            ))}

            {/* New Snippet Button with Animation */}
            <Link href="/new" className="ml-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                <FiPlus className="mr-1" /> New Snippet
              </motion.button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost p-2"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pb-4 md:hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`btn btn-ghost rounded-md ${
                    router.pathname === link.href
                      ? 'bg-gray-800 text-primary'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    {link.icon}
                    {link.name}
                  </span>
                </Link>
              ))}
              
              <Link href="/new" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <FiPlus className="mr-1" /> New Snippet
              </Link>
              
              <div className="pt-2 flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
