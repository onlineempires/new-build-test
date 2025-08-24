import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getAllThemes } from '../lib/themes';
import { Check, Palette, ChevronDown } from 'lucide-react';

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'grid';
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  variant = 'dropdown', 
  className = '' 
}) => {
  const { currentTheme, setTheme, themeId } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const allThemes = getAllThemes();

  if (variant === 'grid') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Choose Theme
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {allThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: themeId === theme.id ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              <div className="flex items-center space-x-4">
                {/* Theme Preview */}
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.background, borderColor: 'var(--color-border)' }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.primary, borderColor: 'var(--color-border)' }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.cardBackground, borderColor: 'var(--color-border)' }}
                  />
                </div>
                
                <div className="text-left">
                  <div 
                    className="font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {theme.name}
                  </div>
                  <div 
                    className="text-sm opacity-75"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {theme.description}
                  </div>
                </div>
              </div>
              
              {themeId === theme.id && (
                <Check className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">{currentTheme.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-2">
              {allThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: themeId === theme.id ? 'var(--color-hover)' : 'transparent',
                  }}
                >
                  {/* Theme Preview */}
                  <div className="flex space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.colors.background, borderColor: 'var(--color-border)' }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.colors.primary, borderColor: 'var(--color-border)' }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.colors.cardBackground, borderColor: 'var(--color-border)' }}
                    />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div 
                      className="font-medium text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {theme.name}
                    </div>
                    <div 
                      className="text-xs opacity-75 truncate"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {theme.description}
                    </div>
                  </div>
                  
                  {themeId === theme.id && (
                    <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};