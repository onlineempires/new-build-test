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
    // Load saved theme from localStorage - non-blocking
    try {
      const savedTheme = localStorage.getItem('digitalera-theme');
      if (savedTheme && savedTheme !== themeId) {
        setThemeId(savedTheme);
        setCurrentTheme(getTheme(savedTheme));
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    // Apply CSS variables using requestAnimationFrame for non-blocking updates
    const applyTheme = () => {
      try {
        const root = document.documentElement;
        const colors = currentTheme.colors;
        
        // Apply all CSS variables in batches to prevent blocking
        const applyVariables = (variables: Array<[string, string]>) => {
          variables.forEach(([property, value]) => {
            root.style.setProperty(property, value);
          });
        };
        
        // Background Variables
        applyVariables([
          ['--bg-primary', colors.background],
          ['--bg-secondary', colors.backgroundSecondary],
          ['--bg-tertiary', colors.backgroundTertiary],
          ['--bg-card', colors.cardBackground],
          ['--bg-sidebar', colors.sidebarBackground],
          ['--bg-header', colors.headerBackground],
          ['--color-background', colors.background],
          ['--color-background-secondary', colors.backgroundSecondary],
          ['--color-background-tertiary', colors.backgroundTertiary],
          ['--color-card-background', colors.cardBackground],
          ['--color-sidebar-background', colors.sidebarBackground],
          ['--color-header-background', colors.headerBackground]
        ]);
        
        // Text Variables
        applyVariables([
          ['--text-primary', colors.textPrimary],
          ['--text-secondary', colors.textSecondary],
          ['--text-muted', colors.textMuted],
          ['--text-inverse', colors.textInverse],
          ['--text-on-primary', colors.textOnPrimary],
          ['--text-on-secondary', colors.textOnSecondary],
          ['--text-on-success', colors.textOnSuccess],
          ['--text-on-warning', colors.textOnWarning],
          ['--text-on-error', colors.textOnError],
          ['--text-on-info', colors.textOnInfo],
          ['--color-text-primary', colors.textPrimary],
          ['--color-text-secondary', colors.textSecondary],
          ['--color-text-muted', colors.textMuted],
          ['--color-text-inverse', colors.textInverse],
          ['--color-text-on-primary', colors.textOnPrimary],
          ['--color-text-on-secondary', colors.textOnSecondary],
          ['--color-text-on-success', colors.textOnSuccess],
          ['--color-text-on-warning', colors.textOnWarning],
          ['--color-text-on-error', colors.textOnError],
          ['--color-text-on-info', colors.textOnInfo]
        ]);
        
        // Brand Variables
        applyVariables([
          ['--color-primary', colors.primary],
          ['--color-primary-hover', colors.primaryHover],
          ['--color-primary-light', colors.primaryLight],
          ['--color-primary-dark', colors.primaryDark],
          ['--color-secondary', colors.secondary],
          ['--color-secondary-hover', colors.secondaryHover]
        ]);
        
        // Status Variables
        applyVariables([
          ['--color-success', colors.success],
          ['--color-success-hover', colors.successHover],
          ['--color-warning', colors.warning],
          ['--color-warning-hover', colors.warningHover],
          ['--color-error', colors.error],
          ['--color-error-hover', colors.errorHover],
          ['--color-info', colors.info],
          ['--color-info-hover', colors.infoHover]
        ]);
        
        // Interactive Variables
        applyVariables([
          ['--color-hover', colors.hover],
          ['--color-active', colors.active],
          ['--color-focus', colors.focus],
          ['--color-disabled', colors.disabled],
          ['--color-disabled-text', colors.disabledText]
        ]);
        
        // Structure Variables
        applyVariables([
          ['--color-border', colors.border],
          ['--color-border-light', colors.borderLight],
          ['--color-border-strong', colors.borderStrong],
          ['--color-divider', colors.divider],
          ['--color-overlay', colors.overlay],
          ['--color-shadow', colors.shadow]
        ]);
        
        // Legacy support
        applyVariables([
          ['--color-card', colors.cardBackground],
          ['--color-sidebar', colors.sidebarBackground],
          ['--color-header', colors.headerBackground],
          ['--primary', colors.primary],
          ['--primary-hover', colors.primaryHover],
          ['--secondary', colors.secondary],
          ['--text-color', colors.textPrimary],
          ['--background-color', colors.background],
          ['--card-bg', colors.cardBackground]
        ]);
        
        // Update body class
        document.body.className = `theme-${themeId}`;
        
      } catch (error) {
        console.warn('Failed to apply theme variables:', error);
      }
    };
    
    // Use requestAnimationFrame for non-blocking theme application
    requestAnimationFrame(applyTheme);
  }, [currentTheme, themeId]);

  const setTheme = (newThemeId: string) => {
    // Non-blocking theme change
    requestAnimationFrame(() => {
      setThemeId(newThemeId);
      setCurrentTheme(getTheme(newThemeId));
      
      // Non-blocking localStorage save
      try {
        localStorage.setItem('digitalera-theme', newThemeId);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    });
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