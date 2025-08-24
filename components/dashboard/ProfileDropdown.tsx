import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useUserRole } from '../../contexts/UserRoleContext';
import { ThemeSelector } from '../ThemeSelector';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
  onFeedbackClick: () => void;
}

export default function ProfileDropdown({ user, onLogout, onFeedbackClick }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout, adminUser } = useAdminAuth();
  const { currentRole, setUserRole } = useUserRole();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
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

  const handleFeedbackClick = () => {
    onFeedbackClick();
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    // If admin is authenticated, handle admin logout
    if (isAdminAuthenticated && currentRole === 'admin') {
      adminLogout();
      setUserRole('free'); // Reset to free user after admin logout
    } else {
      // Regular user logout
      onLogout();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300"
        style={{
          backgroundColor: isOpen ? 'var(--color-hover)' : 'transparent',
          ':hover': { backgroundColor: 'var(--color-hover)' },
          ringColor: 'var(--color-primary)'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'var(--color-hover)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent';
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span 
          className="text-sm font-medium hidden sm:block transition-colors duration-300"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {user.name}
        </span>
        <span 
          className="text-xs hidden sm:block transition-colors duration-300"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 transition-colors duration-300"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div 
            className="p-4 border-b transition-colors duration-300"
            style={{ borderColor: 'var(--color-divider)' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div 
                  className="font-medium transition-colors duration-300"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {isAdminAuthenticated && currentRole === 'admin' ? adminUser?.username : user.name}
                </div>
                <div 
                  className="text-sm transition-colors duration-300"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {isAdminAuthenticated && currentRole === 'admin' ? 'Admin User' : 'View Profile'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <Link href="/profile">
              <a 
                className="flex items-center px-4 py-2 text-sm transition-colors duration-300"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">👤</span>
                Edit Profile
              </a>
            </Link>
            
            <Link href="/settings">
              <a 
                className="flex items-center px-4 py-2 text-sm transition-colors duration-300"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">⚙️</span>
                Settings
              </a>
            </Link>
            
            {/* Theme Selector Divider */}
            <div 
              className="mx-4 my-2 border-t transition-colors duration-300"
              style={{ borderColor: 'var(--color-divider)' }}
            />
            
            {/* Inline Theme Selector */}
            <div className="px-4 py-2">
              <div 
                className="text-xs font-medium mb-2 transition-colors duration-300"
                style={{ color: 'var(--color-text-muted)' }}
              >
                THEME
              </div>
              <ThemeSelector variant="dropdown" className="w-full" />
            </div>
            
            <div 
              className="mx-4 my-2 border-t transition-colors duration-300"
              style={{ borderColor: 'var(--color-divider)' }}
            />
            
            <button
              onClick={handleFeedbackClick}
              className="w-full flex items-center px-4 py-2 text-sm text-left transition-colors duration-300"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="mr-3">💬</span>
              Send Feedback
            </button>
            
            <a
              href="https://www.facebook.com/groups/onlineempiresvip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm transition-colors duration-300"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">👥</span>
              Facebook Group
            </a>
            
            <div 
              className="border-t mt-2 pt-2 transition-colors duration-300"
              style={{ borderColor: 'var(--color-divider)' }}
            >
              {isAdminAuthenticated && currentRole === 'admin' && (
                <div 
                  className="px-4 py-2 mb-2 rounded mx-2 transition-colors duration-300"
                  style={{ 
                    backgroundColor: 'var(--color-primary)20',
                    color: 'var(--color-primary)'
                  }}
                >
                  <div className="flex items-center text-sm">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Admin Session Active
                  </div>
                </div>
              )}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-left transition-colors duration-300"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="mr-3">🚪</span>
                {isAdminAuthenticated && currentRole === 'admin' ? 'Admin Logout' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}