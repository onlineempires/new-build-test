"use client";
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Check } from 'lucide-react';
import { useTheme, ThemeName } from './ThemeContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { theme, setTheme, colors } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const themeOptions: ThemeName[] = ['Light', 'Dark', 'Pink', 'Blue'];

  return (
    <header className={`${colors.cardBg} ${colors.border} border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DE</span>
            </div>
            <div>
              <h1 className={`${colors.text} font-bold text-xl`}>Digital Era</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textSecondary} w-5 h-5`} />
              <input
                type="text"
                placeholder="Search courses, lessons..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg border
                  ${colors.cardBg} ${colors.text} ${colors.border}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200
                `}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* $1 Trial Badge */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              $1 Trial
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  ${colors.cardBg} ${colors.text} ${colors.border} border
                  hover:bg-opacity-80 transition-all duration-200
                `}
              >
                <span className="text-sm font-medium">{theme}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showThemeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showThemeDropdown && (
                <div className={`
                  absolute right-0 top-full mt-2 w-32 rounded-lg shadow-xl
                  ${colors.cardBg} ${colors.border} border
                  overflow-hidden z-50
                `}>
                  {themeOptions.map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => {
                        setTheme(themeName);
                        setShowThemeDropdown(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm
                        ${colors.text} hover:bg-blue-500 hover:text-white
                        transition-all duration-200
                      `}
                    >
                      <span>{themeName}</span>
                      {theme === themeName && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Community Button */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
              Join The Community
            </button>

            {/* Feedback Button */}
            <button className={`${colors.text} hover:text-blue-500 transition-colors duration-200`}>
              Feedback
            </button>

            {/* Notifications */}
            <button className={`${colors.text} hover:text-blue-500 transition-colors duration-200 relative`}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
              <div className="text-right">
                <p className={`${colors.text} text-sm font-medium`}>Ashley Kemp</p>
              </div>
              <ChevronDown className={`${colors.textSecondary} w-4 h-4`} />
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {showThemeDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowThemeDropdown(false)}
        />
      )}
    </header>
  );
}