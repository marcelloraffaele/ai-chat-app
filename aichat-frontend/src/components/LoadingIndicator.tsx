import React from 'react';

/**
 * Loading indicator component - Displays an animated dots indicator
 * when the AI is generating a response
 */
const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 message-animation">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-[80%] shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2 items-center">
          <div className="text-sm text-gray-600 dark:text-gray-300 mr-2">AI thinking</div>
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;