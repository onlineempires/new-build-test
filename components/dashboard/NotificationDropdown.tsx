import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: number;
  title: string;
  body: string;
  ts: string;
  actionLabel: string;
  actionHref: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClear: () => void;
}

export default function NotificationDropdown({ notifications, onClear }: NotificationDropdownProps) {
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="notification-bell relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg" 
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bell"></i>
        {notifications.length > 0 && (
          <span className="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="text-brand-primary hover:text-blue-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                You are all caught up
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{notification.body}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{formatTime(notification.ts)}</span>
                    <Link href={notification.actionHref}>
                      <a 
                        className="text-brand-primary hover:text-blue-700 text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {notification.actionLabel}
                      </a>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Link href="/notifications">
                <a 
                  className="text-brand-primary hover:text-blue-700 font-medium text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  View All Notifications
                </a>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}