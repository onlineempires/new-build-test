import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { getAllThemes } from '../lib/themes';
import { ChevronDown, User, Settings, LogOut, Palette, Check } from 'lucide-react';

interface UserDropdownProps {
  user?: {
    id: number;
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  // Provide default user object if none is provided
  const defaultUser = {
    id: 0,
    name: 'Guest User',
    email: 'guest@example.com'
  };
  
  const currentUser = user || defaultUser;
  
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentTheme, setTheme, themeId } = useTheme();
  const allThemes = getAllThemes();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowThemeSelector(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowThemeSelector(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  const handleThemeChange = (newThemeId: string) => {
    setTheme(newThemeId);
    setShowThemeSelector(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg theme-hover transition-all duration-200"
        aria-label="User menu"
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="theme-text-primary text-sm font-medium hidden sm:inline">
          {currentUser?.name || 'Guest User'}
        </span>
        <ChevronDown className="w-4 h-4 theme-text-secondary transition-transform duration-200" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div 
            className="absolute right-0 top-full mt-2 w-72 rounded-lg shadow-xl border z-50 theme-card overflow-hidden"
          >
            {/* User Info Section */}
            <div className="p-4 border-b theme-divider">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="theme-text-primary font-medium">{currentUser?.name || 'Guest User'}</div>
                  <div className="theme-text-secondary text-sm">{currentUser?.email || 'guest@example.com'}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link href="/profile">
                <a 
                  className="w-full flex items-center space-x-3 px-4 py-3 theme-hover transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 theme-text-secondary" />
                  <span className="theme-text-primary">Profile Settings</span>
                </a>
              </Link>
              
              <Link href="/settings">
                <a 
                  className="w-full flex items-center space-x-3 px-4 py-3 theme-hover transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 theme-text-secondary" />
                  <span className="theme-text-primary">Account Settings</span>
                </a>
              </Link>

              {/* Theme Selector Section */}
              <div className="relative">
                <button 
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className="w-full flex items-center justify-between px-4 py-3 theme-hover transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Palette className="w-4 h-4 theme-text-secondary" />
                    <span className="theme-text-primary">Theme</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="theme-text-secondary text-sm">{currentTheme.name}</span>
                    <ChevronDown className={`w-4 h-4 theme-text-secondary transition-transform duration-200 ${
                      showThemeSelector ? 'rotate-180' : 'rotate-0'
                    }`} />
                  </div>
                </button>

                {/* Theme Options */}
                {showThemeSelector && (
                  <div className="px-4 pb-2">
                    <div className="space-y-1">
                      {allThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg theme-hover transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {/* Theme Preview */}
                            <div className="flex space-x-1">
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ 
                                  backgroundColor: theme.colors.background, 
                                  borderColor: 'var(--color-border)' 
                                }}
                              />
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ 
                                  backgroundColor: theme.colors.primary, 
                                  borderColor: 'var(--color-border)' 
                                }}
                              />
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ 
                                  backgroundColor: theme.colors.cardBackground, 
                                  borderColor: 'var(--color-border)' 
                                }}
                              />
                            </div>
                            <span className="theme-text-primary text-sm">{theme.name}</span>
                          </div>
                          
                          {themeId === theme.id && (
                            <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t theme-divider">
                      <Link href="/profile">
                        <a 
                          className="text-xs theme-text-secondary hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          More theme options in Profile Settings →
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <hr className="my-2 theme-divider" />
              
              <button 
                onClick={handleLogoutClick}
                className="w-full flex items-center space-x-3 px-4 py-3 theme-hover transition-colors"
              >
                <LogOut className="w-4 h-4 theme-text-secondary" />
                <span className="theme-text-primary">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;