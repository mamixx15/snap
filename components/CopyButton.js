import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CopyButton = ({ 
  text,
  className = '',
  iconOnly = false,
  size = 'md',
  onCopy = () => {},
  successMessage = 'Copied to clipboard!'
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!text) {
      toast.error('Nothing to copy!');
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast.success(successMessage);
        onCopy(text);
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy to clipboard');
      });
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
      onClick={copyToClipboard}
      className={`${className} ${sizeClasses[size]} ${iconOnly ? 'rounded-full' : 'rounded-md flex items-center'} ${
        copied 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
      } transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <FiCheck className={iconSizes[size]} />
          {!iconOnly && <span className="ml-2">Copied!</span>}
        </>
      ) : (
        <>
          <FiCopy className={iconSizes[size]} />
          {!iconOnly && <span className="ml-2">Copy</span>}
        </>
      )}
    </motion.button>
  );
};

export default CopyButton;
