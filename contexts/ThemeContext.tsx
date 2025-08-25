import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'feminine' | 'high-contrast' | 'minimal' | 'neon';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: ThemeInfo[];
}

interface ThemeInfo {
  id: Theme;
  name: string;
  description: string;
  icon: string;
  accessibility?: string;
}

const themes: ThemeInfo[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface with excellent readability',
    icon: '☀️',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes for low-light environments',
    icon: '🌙',
  },
  {
    id: 'feminine',
    name: 'Feminine',
    description: 'Warm pink and purple tones with soft styling',
    icon: '🌸',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum contrast for enhanced accessibility',
    icon: '⚡',
    accessibility: 'WCAG AAA compliant - Enhanced visibility for low vision users',
  },
  {
    id: 'minimal',
    name: 'Minimal Greyscale',
    description: 'Distraction-free monochromatic design',
    icon: '⚪',
  },
  {
    id: 'neon',
    name: 'Neon Pop',
    description: 'Vibrant colors for an energetic feel',
    icon: '⚡',
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.some(t => t.id === savedTheme)) {
      setThemeState(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to get theme-aware classes
export function getThemeClass(baseClass: string, variants?: Partial<Record<Theme, string>>) {
  const context = useContext(ThemeContext);
  if (!context || !variants) return baseClass;
  
  const themeVariant = variants[context.theme];
  return themeVariant ? `${baseClass} ${themeVariant}` : baseClass;
}

// Hook for theme-aware styling
export function useThemeClass(baseClass: string, variants?: Partial<Record<Theme, string>>) {
  const { theme } = useTheme();
  
  if (!variants) return baseClass;
  
  const themeVariant = variants[theme];
  return themeVariant ? `${baseClass} ${themeVariant}` : baseClass;
}

// Feature flag utility for theme canvas system
export function useThemeCanvasV1() {
  return process.env.NEXT_PUBLIC_THEME_CANVAS_V1 === 'true';
}

// Utility function to get theme canvas classes conditionally
export function useThemeCanvasClass(canvasClass: string, fallbackClass?: string) {
  const canvasEnabled = useThemeCanvasV1();
  return canvasEnabled ? canvasClass : (fallbackClass || '');
}