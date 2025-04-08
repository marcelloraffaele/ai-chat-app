import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'

// Set up dark mode on initial load before rendering
const setInitialTheme = () => {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Execute immediately to prevent flash of wrong theme
setInitialTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
