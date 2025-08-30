import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useUserRole } from '../../contexts/UserRoleContext';
import ThemeSelector from '../theme/ThemeSelector';

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
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-2 focus-ring"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="text-sm font-medium text-text-primary hidden sm:block">{user.name}</span>
        <span className="text-text-tertiary text-xs hidden sm:block">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover rounded-lg shadow-lg border border-border z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-medium text-text-primary">
                  {isAdminAuthenticated && currentRole === 'admin' ? adminUser?.username : user.name}
                </div>
                <div className="text-sm text-text-secondary">
                  {isAdminAuthenticated && currentRole === 'admin' ? 'Admin User' : 'View Profile'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            {/* Theme Selector */}
            <div className="px-4 py-2 border-b border-border">
              <div className="text-xs font-medium text-text-secondary mb-2">Theme</div>
              <ThemeSelector variant="simple" />
            </div>

            <Link href="/profile">
              <a 
                className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-2"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">👤</span>
                Edit Profile
              </a>
            </Link>
            
            <Link href="/settings">
              <a 
                className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-2"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">⚙️</span>
                Settings
              </a>
            </Link>
            
            <button
              onClick={handleFeedbackClick}
              className="w-full flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-2 text-left"
            >
              <span className="mr-3">💬</span>
              Send Feedback
            </button>
            
            <a
              href="https://www.facebook.com/groups/onlineempiresvip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-2"
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">👥</span>
              Facebook Group
            </a>
            
            <div className="border-t border-border mt-2 pt-2">
              {isAdminAuthenticated && currentRole === 'admin' && (
                <div className="px-4 py-2 bg-info/10 mb-2 rounded mx-2">
                  <div className="flex items-center text-sm text-info-foreground">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Admin Session Active
                  </div>
                </div>
              )}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-2 text-left"
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