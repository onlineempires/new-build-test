"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'Light' | 'Dark' | 'Pink' | 'Blue';

export interface ThemeColors {
  background: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  shadow: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  Light: {
    background: 'bg-gray-50',
    cardBg: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    border: 'border-gray-200',
    shadow: 'shadow-lg'
  },
  Dark: {
    background: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    accent: 'bg-blue-400',
    accentHover: 'hover:bg-blue-500',
    border: 'border-gray-700',
    shadow: 'shadow-2xl'
  },
  Pink: {
    background: 'bg-pink-950',
    cardBg: 'bg-pink-900',
    text: 'text-pink-50',
    textSecondary: 'text-pink-200',
    accent: 'bg-pink-400',
    accentHover: 'hover:bg-pink-500',
    border: 'border-pink-800',
    shadow: 'shadow-2xl shadow-pink-900/50'
  },
  Blue: {
    background: 'bg-slate-900',
    cardBg: 'bg-slate-800',
    text: 'text-slate-100',
    textSecondary: 'text-slate-300',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    border: 'border-slate-700',
    shadow: 'shadow-2xl'
  }
};

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>('Blue');

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('digitalera-theme') as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digitalera-theme', newTheme);
    }
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      <div className={`min-h-screen transition-all duration-300 ${colors.background} ${colors.text}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}