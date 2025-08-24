import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import NotificationDropdown from '../dashboard/NotificationDropdown';
import GlobalNotificationDropdown from '../dashboard/GlobalNotificationDropdown';
import { useNotifications } from '../../contexts/NotificationContext';
import UserDropdown from '../UserDropdown';
import UpgradeButton from '../upgrades/UpgradeButton';
import { RoleSwitcher, MobileRoleSwitcher } from '../dev/RoleSwitcher';
import { GatingStatus } from '../dev/GatingStatus';
import EnvironmentIndicator from '../admin/EnvironmentIndicator';
import { useTheme } from '../../contexts/ThemeContext';
// Removed unused import - shouldShowRoleSwitcher

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
  onRemoveNotification?: (id: number) => void;
}

export default function AppLayout({ children, user, title, onFeedbackClick, notifications = [], onClearNotifications, onRemoveNotification }: AppLayoutProps) {
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setNotifications } = useNotifications();
  const { currentTheme } = useTheme();
  
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Sync prop notifications to global store for backward compatibility
  useEffect(() => {
    if (notifications.length > 0) {
      const globalNotifications = notifications.map(n => ({
        ...n,
        isRead: false,
        type: 'info' as const
      }));
      setNotifications(globalNotifications);
    }
  }, [notifications, setNotifications]);
  
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
    <div className="flex h-screen theme-bg">
      <EnvironmentIndicator />
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onFeedbackClick={onFeedbackClick}
      />
      
      {/* Fixed Header */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 border-b z-[70] shadow-sm theme-header">
          {/* Mobile Header */}
          <div className="lg:hidden px-4 h-14 flex items-center">
            <div className="flex items-center justify-between w-full">
              {/* Left: Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 theme-text-primary theme-hover rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Center: Search */}
              <div className="flex-1 mx-4">
                <input
                  type="text"
                  placeholder="Search courses, lessons..."
                  className="w-full h-10 rounded-xl px-3 text-[15px] theme-input focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              
              {/* Right: Dev tools - Always show in development */}
              <div className="flex items-center gap-2">
                <RoleSwitcher />
                <GatingStatus />
              </div>
            </div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block px-6 py-4 theme-header">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <h1 className="text-2xl font-bold theme-text-primary">
                {getPageTitle()}
              </h1>
              
              {/* Right: Search, Actions, and User Menu */}
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative w-80 xl:w-[400px]">
                  <input
                    type="text"
                    placeholder="Search courses, lessons..."
                    className="w-full h-10 pl-10 pr-4 text-sm rounded-lg theme-input focus:outline-none focus:ring-2"
                  />
                  <div className="absolute left-3 top-2.5 theme-text-muted">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                {/* Action Items */}
                <div className="flex items-center gap-3">
                  {/* Dev Tools - Always show in development */}
                  <RoleSwitcher />
                  <GatingStatus />
                  <UpgradeButton 
                    variant="compact"
                    context="premium"
                    currentPlan="free"
                    className="hidden sm:inline-flex w-10 h-10 !px-0 !py-0 rounded-full"
                  >
                    <i className="fas fa-crown text-sm"></i>
                  </UpgradeButton>
                  <a 
                    href="https://www.facebook.com/groups/onlineempiresvip" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 theme-button-primary text-sm font-medium rounded-lg transition-colors"
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    Join The Community
                  </a>
                  <button 
                    onClick={onFeedbackClick || (() => {})} 
                    className="inline-flex items-center px-3 py-2 theme-text-secondary theme-hover rounded-lg transition-colors"
                    aria-label="Send Feedback"
                  >
                    <i className="fas fa-comment mr-2"></i>
                    <span className="text-sm font-medium">Feedback</span>
                  </button>
                </div>

                {/* Notifications */}
                <GlobalNotificationDropdown />
                
                {/* User Dropdown with Theme Selector */}
                <UserDropdown 
                  user={user}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
      </div>
      
      {/* Main Content Area */}
      <main id="content-portal-root" className="relative isolate flex-1 lg:ml-64 pt-16 lg:pt-20 overflow-auto pb-4">
        {children}
      </main>
    </div>
  );
}