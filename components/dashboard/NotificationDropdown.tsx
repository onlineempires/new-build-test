import { useState, useRef, useEffect } from 'react';
import { SafeLink } from '../ui/SafeLink';

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
  onRemove?: (id: number) => void;
}

export default function NotificationDropdown({ notifications, onClear, onRemove }: NotificationDropdownProps) {
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
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return time.toLocaleDateString();
    }
  };

  const getNotificationIcon = (title: string) => {
    if (title.includes('Lead') || title.includes('signed up')) {
      return 'fas fa-user-plus text-green-500';
    } else if (title.includes('Commission') || title.includes('earned')) {
      return 'fas fa-dollar-sign text-green-500';
    } else if (title.includes('Course') || title.includes('Completed')) {
      return 'fas fa-graduation-cap text-blue-500';
    } else if (title.includes('Achievement') || title.includes('Streak')) {
      return 'fas fa-trophy text-yellow-500';
    } else {
      return 'fas fa-bell text-gray-400';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={`notification-bell relative p-2 rounded-lg transition-all duration-200 ${
          isOpen 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`} 
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas fa-bell transition-transform duration-200 ${
          notifications.length > 0 ? 'animate-pulse' : ''
        }`}></i>
        {notifications.length > 0 && (
          <span className="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm animate-pulse">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 transform animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <i className="fas fa-bell mr-2 text-blue-500"></i>
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check-circle text-2xl text-gray-400"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
                <p className="text-gray-500 text-sm">You have no new notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${
                  index !== notifications.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center mr-3">
                      <i className={`${getNotificationIcon(notification.title)} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">{notification.title}</h4>
                        {onRemove && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(notification.id);
                            }}
                            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Remove notification"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{notification.body}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 flex items-center">
                          <i className="fas fa-clock mr-1"></i>
                          {formatTime(notification.ts)}
                        </span>
                        <SafeLink 
                          href={notification.actionHref}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {notification.actionLabel}
                        </SafeLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <SafeLink 
                href="/notifications"
                className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                View All Notifications
              </SafeLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
}