import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'blue', text = 'Loading...' }) => {
  // Size classes for different spinner sizes
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  // Color classes for the spinner
  const colorMap = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          repeat: Infinity, 
          duration: 1,
          ease: "linear"
        }}
        className={`${sizeMap[size]} rounded-full border-t-transparent ${colorMap[color]}`}
      />
      {text && (
        <p className="mt-4 text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
