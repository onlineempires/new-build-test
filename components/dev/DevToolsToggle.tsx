import React, { useState, useEffect } from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export function DevToolsToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    setIsVisible(process.env.NODE_ENV === 'development');
    
    // Check current state
    const checkState = () => {
      const devToolsState = localStorage.getItem('devTools');
      setIsEnabled(devToolsState === 'on');
    };
    
    checkState();
    
    // Listen for changes
    window.addEventListener('storage', checkState);
    window.addEventListener('focus', checkState);
    
    return () => {
      window.removeEventListener('storage', checkState);
      window.removeEventListener('focus', checkState);
    };
  }, []);

  const toggleDevTools = () => {
    const newState = !isEnabled;
    localStorage.setItem('devTools', newState ? 'on' : 'off');
    setIsEnabled(newState);
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    // Reload to apply changes
    if (confirm(`Dev tools will be ${newState ? 'enabled' : 'disabled'}. Reload page to apply changes?`)) {
      window.location.reload();
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={toggleDevTools}
      className={`
        fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-[100]
        transition-all duration-200 hover:scale-110
        ${isEnabled 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-600 hover:bg-gray-700 text-white'
        }
      `}
      title={`Dev Tools: ${isEnabled ? 'Enabled' : 'Disabled'} (Click to toggle)`}
    >
      <WrenchScrewdriverIcon className="w-5 h-5" />
    </button>
  );
}