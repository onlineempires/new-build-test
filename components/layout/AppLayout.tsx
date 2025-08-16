import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import NotificationDropdown from '../dashboard/NotificationDropdown';
import ProfileDropdown from '../dashboard/ProfileDropdown';
import UpgradeButton from '../upgrades/UpgradeButton';
import RoleSwitcher from '../admin/RoleSwitcher';
import EnvironmentIndicator from '../admin/EnvironmentIndicator';
import { shouldShowRoleSwitcher } from '../../utils/environment';

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
      <EnvironmentIndicator />
      <Sidebar user={user} onLogout={handleLogout} />
      
      {/* Fixed Header */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-gray-200 z-30">
          {/* Mobile Header - Modern clean style */}
          <div className="lg:hidden px-4 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Left: Logo (centered, modern style) */}
              <div className="flex items-center flex-1 justify-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-2 text-lg shadow-md">
                    ⚡
                  </div>
                  <span className="text-gray-900 font-bold text-lg">DIGITAL ERA</span>
                </div>
              </div>
              
              {/* Right: Actions - Modern icons */}
              <div className="flex items-center gap-2">
                <UpgradeButton 
                  variant="compact" 
                  currentPlan="free"
                  className="sm:hidden w-8 h-8 !px-0 !py-0 rounded-full"
                >
                  <i className="fas fa-crown text-xs"></i>
                </UpgradeButton>
                {/* Search Toggle - Modern */}
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* Community - Modern */}
                <a 
                  href="https://www.facebook.com/groups/onlineempiresvip" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-blue-500 hover:text-blue-700 rounded-xl hover:bg-blue-50 transition-all"
                  aria-label="Join Community"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Bell - Modern */}
                <NotificationDropdown 
                  notifications={notifications}
                  onClear={onClearNotifications || (() => {})}
                />
                
                {/* Avatar - Modern */}
                <ProfileDropdown 
                  user={user}
                  onLogout={handleLogout}
                  onFeedbackClick={onFeedbackClick || (() => {})}
                />
              </div>
            </div>
            
            {/* Mobile Search Bar (Expandable) - Modern */}
            {showMobileSearch && (
              <div className="mt-4 relative animate-slideDown">
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="w-full h-12 pl-12 pr-4 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  autoFocus
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                
                {/* Community, Upgrade, and Feedback */}
                <div className="flex items-center gap-3">
                  {/* Role Switcher only in development - completely hidden in production */}
                  {shouldShowRoleSwitcher() && <RoleSwitcher />}
                  <UpgradeButton 
                    variant="compact" 
                    currentPlan="free"
                    className="hidden sm:inline-flex w-10 h-10 !px-0 !py-0 rounded-full"
                  >
                    <i className="fas fa-crown text-sm"></i>
                  </UpgradeButton>
                  <a 
                    href="https://www.facebook.com/groups/onlineempiresvip" 
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
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-20 overflow-auto pb-4">
        {children}
      </main>
    </div>
  );
}