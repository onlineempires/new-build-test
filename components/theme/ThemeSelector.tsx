import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'grid' | 'compact' | 'simple';
  className?: string;
}

export default function ThemeSelector({ variant = 'dropdown', className = '' }: ThemeSelectorProps) {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTheme = themes.find(t => t.id === theme);

  if (variant === 'simple') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center justify-between w-full px-3 py-2 text-sm text-text-primary 
            hover:bg-surface-2 transition-colors duration-200 rounded-lg
          "
        >
          <div className="flex items-center gap-2">
            <span>{currentTheme?.icon}</span>
            <span>{currentTheme?.name}</span>
          </div>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="
            absolute top-full left-0 right-0 mt-1 bg-popover border border-border 
            rounded-lg shadow-lg overflow-hidden z-50
          ">
            {themes.map((themeInfo) => (
              <button
                key={themeInfo.id}
                onClick={() => {
                  setTheme(themeInfo.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left hover:bg-surface-2 transition-colors duration-200
                  flex items-center gap-2 text-sm
                  ${theme === themeInfo.id ? 'bg-accent/10 text-accent' : 'text-text-primary'}
                `}
              >
                <span>{themeInfo.icon}</span>
                <span>{themeInfo.name}</span>
                {theme === themeInfo.id && (
                  <CheckIcon className="w-3 h-3 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${className}`}>
        {themes.map((themeInfo) => (
          <button
            key={themeInfo.id}
            onClick={() => setTheme(themeInfo.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              ${theme === themeInfo.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-border/60 hover:bg-surface-2'
              }
            `}
          >
            <div className="text-2xl mb-2">{themeInfo.icon}</div>
            <div className="text-sm font-medium text-text-primary mb-1">
              {themeInfo.name}
            </div>
            <div className="text-xs text-text-secondary leading-tight">
              {themeInfo.description}
            </div>
            {themeInfo.accessibility && (
              <div className="text-xs text-accent mt-1 font-medium">
                {themeInfo.accessibility}
              </div>
            )}
            {theme === themeInfo.id && (
              <div className="absolute top-2 right-2">
                <CheckIcon className="w-4 h-4 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {themes.map((themeInfo) => (
          <button
            key={themeInfo.id}
            onClick={() => setTheme(themeInfo.id)}
            title={`${themeInfo.name}: ${themeInfo.description}`}
            className={`
              w-8 h-8 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm
              ${theme === themeInfo.id 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-border/60 hover:bg-surface-2'
              }
            `}
          >
            {themeInfo.icon}
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between w-full px-4 py-2 bg-surface border border-border 
          rounded-xl text-text-primary hover:bg-surface-2 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-ring
        "
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{currentTheme?.icon}</span>
          <div className="text-left">
            <div className="text-sm font-medium">{currentTheme?.name}</div>
            <div className="text-xs text-text-secondary">
              {currentTheme?.description}
            </div>
          </div>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="
          absolute top-full left-0 right-0 mt-2 bg-popover border border-border 
          rounded-xl shadow-lg overflow-hidden z-50
        ">
          {themes.map((themeInfo) => (
            <button
              key={themeInfo.id}
              onClick={() => {
                setTheme(themeInfo.id);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left hover:bg-surface-2 transition-colors duration-200
                flex items-center gap-3
                ${theme === themeInfo.id ? 'bg-accent/10' : ''}
              `}
            >
              <span className="text-lg">{themeInfo.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-medium ${theme === themeInfo.id ? 'text-accent' : 'text-text-primary'}`}>
                  {themeInfo.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {themeInfo.description}
                </div>
                {themeInfo.accessibility && (
                  <div className="text-xs text-accent mt-1">
                    {themeInfo.accessibility}
                  </div>
                )}
              </div>
              {theme === themeInfo.id && (
                <CheckIcon className="w-4 h-4 text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}