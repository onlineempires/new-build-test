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
  title?: string;
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

export default function AppLayout({ children, user, title, onFeedbackClick, notifications = [], onClearNotifications }: AppLayoutProps) {
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Dynamic title based on current route
  const getPageTitle = () => {
    if (title) return title;
    if (router.pathname === '/') return 'Dashboard';
    if (router.pathname === '/courses') return 'All Courses';
    if (router.pathname.startsWith('/courses/')) return 'Course';
    if (router.pathname === '/experts') return 'Expert Directory';
    if (router.pathname === '/dmo') return 'Daily Method';
    if (router.pathname === '/affiliate') return 'Affiliate Portal';
    if (router.pathname === '/stats') return 'Statistics';
    if (router.pathname === '/leads') return 'Leads';
    if (router.pathname === '/profile') return 'Profile';
    return 'Digital Era';
  };

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
        <div className="bg-white border-b border-gray-200">
          {/* Mobile Header */}
          <div className="lg:hidden px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Hamburger + Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10"> {/* Spacer for hamburger */}</div>
                <h1 className="text-lg font-bold text-gray-900 truncate">{getPageTitle()}</h1>
              </div>
              
              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {/* Search Toggle */}
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                  aria-label="Search"
                >
                  <i className="fas fa-search"></i>
                </button>
                
                {/* Community - Mobile Icon Only */}
                <a 
                  href="https://www.facebook.com/groups/573287586948119" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                  aria-label="Join Community"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                
                {/* Feedback - Mobile Icon Only */}
                <button 
                  onClick={onFeedbackClick || (() => {})} 
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                  aria-label="Feedback"
                >
                  <i className="fas fa-comment"></i>
                </button>
                
                {/* Bell */}
                <NotificationDropdown 
                  notifications={notifications}
                  onClear={onClearNotifications || (() => {})}
                />
                
                {/* Avatar */}
                <ProfileDropdown 
                  user={user}
                  onLogout={handleLogout}
                  onFeedbackClick={onFeedbackClick || (() => {})}
                />
              </div>
            </div>
            
            {/* Mobile Search Bar (Expandable) */}
            {showMobileSearch && (
              <div className="mt-3 relative">
                <input
                  type="text"
                  placeholder="Search courses, lessons..."
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  autoFocus
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              
              {/* Right: Search, Bell, Avatar */}
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative w-80 xl:w-[400px]">
                  <input
                    type="text"
                    placeholder="Search courses, lessons..."
                    className="w-full h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                {/* Community and Feedback */}
                <div className="flex items-center gap-3">
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
                    className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
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
        </div>
        
        {children}
      </main>
    </div>
  );
}