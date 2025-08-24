import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, getTheme } from '../lib/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState('light');
  const [currentTheme, setCurrentTheme] = useState(getTheme('light'));

  useEffect(() => {
    // Load saved theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('digitalera-theme');
      if (savedTheme) {
        setThemeId(savedTheme);
        setCurrentTheme(getTheme(savedTheme));
      }
    }
  }, []);

  useEffect(() => {
    // Apply CSS variables to root element
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      Object.entries(currentTheme.cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Add theme class to body for additional styling
      document.body.className = document.body.className.replace(/theme-\w+/g, '') + ` theme-${themeId}`;
    }
  }, [currentTheme, themeId]);

  const setTheme = (newThemeId: string) => {
    setThemeId(newThemeId);
    setCurrentTheme(getTheme(newThemeId));
    if (typeof window !== 'undefined') {
      localStorage.setItem('digitalera-theme', newThemeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};