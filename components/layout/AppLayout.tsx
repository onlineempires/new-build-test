import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import NotificationDropdown from '../dashboard/NotificationDropdown';
import ProfileDropdown from '../dashboard/ProfileDropdown';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface AppLayoutProps {
  children: ReactNode;
  user: User;
  onFeedbackClick?: () => void;
  notifications?: Array<{
    id: number;
    title: string;
    body: string;
    ts: string;
    actionLabel: string;
    actionHref: string;
  }>;
  onClearNotifications?: () => void;
}

export default function AppLayout({ children, user, onFeedbackClick, notifications = [], onClearNotifications }: AppLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear auth token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    // Redirect to logout route
    router.push('/logout');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-64 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Title */}
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
            {/* Right: Search, Bell, Avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="relative hidden sm:block sm:w-80 lg:w-[360px]">
                <input
                  type="text"
                  placeholder="Search courses, lessons..."
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  🔍
                </div>
              </div>
              
              {/* Community and Feedback */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.facebook.com/groups/573287586948119" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fab fa-facebook-f mr-2"></i>
                  Join The Community
                </a>
                <button 
                  onClick={onFeedbackClick || (() => {})} 
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Send Feedback"
                >
                  <i className="fas fa-comment mr-2"></i>
                  <span className="text-sm font-medium">Feedback</span>
                </button>
              </div>

              {/* Bell with Dropdown */}
              <NotificationDropdown 
                notifications={notifications}
                onClear={onClearNotifications || (() => {})}
              />
              
              {/* Avatar + Name + Dropdown */}
              <ProfileDropdown 
                user={user}
                onLogout={handleLogout}
                onFeedbackClick={onFeedbackClick || (() => {})}
              />
            </div>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
}