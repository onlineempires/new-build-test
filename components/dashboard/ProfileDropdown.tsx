import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

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
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
        <span className="text-gray-400 text-xs hidden sm:block">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">View Profile</div>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <Link href="/profile">
              <a 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">👤</span>
                Edit Profile
              </a>
            </Link>
            
            <Link href="/settings">
              <a 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">⚙️</span>
                Settings
              </a>
            </Link>
            
            <button
              onClick={handleFeedbackClick}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              <span className="mr-3">💬</span>
              Send Feedback
            </button>
            
            <a
              href="https://www.facebook.com/groups/onlineempiresvip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">👥</span>
              Facebook Group
            </a>
            
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <span className="mr-3">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}