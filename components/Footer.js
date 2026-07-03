import Link from 'next/link';
import { FiCode, FiGithub, FiTwitter, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <FiCode className="text-primary text-2xl mr-2" />
              <span className="font-bold text-xl text-white">CodeSnapX</span>
            </Link>
            <p className="mt-2 text-gray-400 text-sm">
              Share your code snippets easily and beautifully.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase text-white tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/explore" className="text-gray-400 hover:text-primary">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/new" className="text-gray-400 hover:text-primary">
                    Create New
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase text-white tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase text-white tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col items-center">
          <div className="flex space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-primary">
              <span className="sr-only">GitHub</span>
              <FiGithub className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary">
              <span className="sr-only">Twitter</span>
              <FiTwitter className="h-6 w-6" />
            </a>
          </div>
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} CodeSnapX. All rights reserved. Made with
            <FiHeart className="h-4 w-4 inline mx-1 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
