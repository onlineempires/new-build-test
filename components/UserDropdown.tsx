import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { getAllThemes } from '../lib/themes';
import { ChevronDown, User, Settings, LogOut, Palette, Check } from 'lucide-react';

interface UserDropdownProps {
  user: {
    id: number;
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
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
    <div className="user-dropdown-container" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-dropdown-trigger"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="user-name">
          {user.name}
        </span>
        <ChevronDown className={`user-dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="user-dropdown-menu">
          {/* User Info Section */}
          <div className="user-dropdown-header">
            <div className="user-dropdown-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-dropdown-info">
              <div className="user-dropdown-name">{user.name}</div>
              <div className="user-dropdown-email">{user.email || 'user@example.com'}</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="user-dropdown-menu-items">
            <Link href="/profile">
              <a 
                className="user-dropdown-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <User className="user-dropdown-menu-icon" />
                <span>Profile Settings</span>
              </a>
            </Link>
            
            <Link href="/settings">
              <a 
                className="user-dropdown-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="user-dropdown-menu-icon" />
                <span>Account Settings</span>
              </a>
            </Link>

            {/* Theme Selector Section */}
            <div className="user-dropdown-theme-section">
              <button 
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="user-dropdown-menu-item user-dropdown-theme-toggle"
              >
                <div className="user-dropdown-menu-item-content">
                  <Palette className="user-dropdown-menu-icon" />
                  <span>Theme</span>
                </div>
                <div className="user-dropdown-theme-current">
                  <span className="user-dropdown-theme-name">{currentTheme.name}</span>
                  <ChevronDown className={`user-dropdown-theme-icon ${showThemeSelector ? 'open' : ''}`} />
                </div>
              </button>

              {/* Theme Options */}
              {showThemeSelector && (
                <div className="user-dropdown-theme-options">
                  <div className="user-dropdown-theme-list">
                    {allThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`user-dropdown-theme-option ${themeId === theme.id ? 'active' : ''}`}
                      >
                        <div className="user-dropdown-theme-preview">
                          <div 
                            className="user-dropdown-theme-dot"
                            style={{ backgroundColor: theme.colors.background }}
                          />
                          <div 
                            className="user-dropdown-theme-dot"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div 
                            className="user-dropdown-theme-dot"
                            style={{ backgroundColor: theme.colors.cardBackground }}
                          />
                        </div>
                        <span className="user-dropdown-theme-label">{theme.name}</span>
                        {themeId === theme.id && (
                          <Check className="user-dropdown-theme-check" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="user-dropdown-theme-more">
                    <Link href="/profile">
                      <a 
                        className="user-dropdown-theme-link"
                        onClick={() => setIsOpen(false)}
                      >
                        More theme options in Profile Settings →
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="user-dropdown-divider" />
            
            <button 
              onClick={handleLogoutClick}
              className="user-dropdown-menu-item user-dropdown-logout"
            >
              <LogOut className="user-dropdown-menu-icon" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;