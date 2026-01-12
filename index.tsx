
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PursuitApp from './pursuit/PursuitApp';

/**
 * Application Router
 * - Default route: Original Banana Scan App
 * - #pursuit route: Universal Pursuit Protocol Dashboard
 */
const AppRouter: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<'banana' | 'pursuit'>('pursuit');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#banana' || hash === '#scan') {
        setCurrentApp('banana');
      } else {
        // Default to pursuit protocol
        setCurrentApp('pursuit');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentApp === 'pursuit') {
    return <PursuitApp />;
  }

  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
