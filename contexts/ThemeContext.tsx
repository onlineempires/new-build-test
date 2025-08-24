import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, getTheme } from '../lib/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState('skoolDark'); // Default to Skool Dark theme
  const [currentTheme, setCurrentTheme] = useState(getTheme('skoolDark'));

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('digitalera-theme');
    if (savedTheme) {
      setThemeId(savedTheme);
      setCurrentTheme(getTheme(savedTheme));
    }
  }, []);

  useEffect(() => {
    // Apply all CSS variables to root element for maximum compatibility
    const root = document.documentElement;
    const colors = currentTheme.colors;
    
    // Apply new variable structure
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-background-secondary', colors.backgroundSecondary);
    root.style.setProperty('--color-card-background', colors.cardBackground);
    root.style.setProperty('--color-sidebar-background', colors.sidebarBackground);
    root.style.setProperty('--color-header-background', colors.headerBackground);
    
    // Text colors with high contrast
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-text-inverse', colors.textInverse);
    
    // Interactive colors (fixes blue button problem)
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-secondary-hover', colors.secondaryHover);
    
    // Status colors
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-info', colors.info);
    
    // UI colors
    root.style.setProperty('--color-hover', colors.hover);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-divider', colors.divider);
    root.style.setProperty('--color-overlay', colors.overlay);
    root.style.setProperty('--color-shadow', colors.shadow);

    // Legacy support - map to old CSS variable names for backward compatibility
    root.style.setProperty('--color-card', colors.cardBackground);
    root.style.setProperty('--color-sidebar', colors.sidebarBackground);
    root.style.setProperty('--color-header', colors.headerBackground);

    // Add theme class to body for additional styling
    document.body.className = `theme-${themeId}`;
    
    // Force update of legacy CSS variables that might be cached
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root { 
        --color-background: ${colors.background} !important;
        --color-primary: ${colors.primary} !important;
        --color-text-primary: ${colors.textPrimary} !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up style element after a short delay
    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 100);
  }, [currentTheme, themeId]);

  const setTheme = (newThemeId: string) => {
    setThemeId(newThemeId);
    setCurrentTheme(getTheme(newThemeId));
    localStorage.setItem('digitalera-theme', newThemeId);
    
    // Force immediate DOM update
    setTimeout(() => {
      // Trigger a reflow to ensure all elements update
      document.body.offsetHeight;
    }, 10);
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