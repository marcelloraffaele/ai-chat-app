import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

/**
 * ThemeToggle component - Toggle between light and dark mode
 */
const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user previously set a preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    // Update the document class when theme changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FiSun className="text-yellow-400" size={20} />
      ) : (
        <FiMoon className="text-gray-600" size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;