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
              
              {/* Facebook and Feedback Icons */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-white hover:opacity-90" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M22 12.06A10 10 0 1 0 10.25 22v-6.99H7.7v-3h2.55v-2.3c0-2.53 1.5-3.94 3.8-3.94 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v2.01h2.77l-.44 3H13.4V22A10 10 0 0 0 22 12.06z"/>
                  </svg>
                </button>
                <button onClick={onFeedbackClick || (() => {})} className="p-2 text-white hover:opacity-90" aria-label="Send Feedback">
                  💬
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