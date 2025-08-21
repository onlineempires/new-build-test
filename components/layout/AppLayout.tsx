import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import NotificationDropdown from '../dashboard/NotificationDropdown';
import GlobalNotificationDropdown from '../dashboard/GlobalNotificationDropdown';
import { useNotifications } from '../../contexts/NotificationContext';
import ProfileDropdown from '../dashboard/ProfileDropdown';
import UpgradeButton from '../upgrades/UpgradeButton';
import RoleSwitcher from '../admin/RoleSwitcher';
import EnvironmentIndicator from '../admin/EnvironmentIndicator';
import GatingStatus from '../dashboard/GatingStatus';
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
  onRemoveNotification?: (id: number) => void;
}

export default function AppLayout({ children, user, title, onFeedbackClick, notifications = [], onClearNotifications, onRemoveNotification }: AppLayoutProps) {
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setNotifications } = useNotifications();
  
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
    <div className="flex h-screen bg-gray-50">
      <EnvironmentIndicator />
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onFeedbackClick={onFeedbackClick}
      />
      
      {/* Fixed Header */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-slate-200 z-[70] shadow-sm">
          {/* Mobile Header */}
          <div className="lg:hidden px-4 h-14 flex items-center">
            <div className="flex items-center justify-between w-full">
              {/* Left: Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                  className="w-full h-10 rounded-xl border-slate-200 px-3 text-[15px] bg-slate-50 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
              
              {/* Right: Role switcher and gating status */}
              <div className="flex items-center gap-2">
                {shouldShowRoleSwitcher() && (
                  <RoleSwitcher />
                )}
                <GatingStatus />
              </div>
            </div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block px-6 py-4 bg-white">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
              
              {/* Right: Search, Bell, Avatar */}
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative w-80 xl:w-[400px]">
                  <input
                    type="text"
                    placeholder="Search courses, lessons..."
                    className="w-full h-10 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                  />
                  <div className="absolute left-3 top-2.5 text-slate-400">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                {/* Community, Upgrade, and Feedback */}
                <div className="flex items-center gap-3">
                  {/* Role Switcher only in development - completely hidden in production */}
                  {shouldShowRoleSwitcher() && <RoleSwitcher />}
                  {/* Gating Status Widget for Desktop */}
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
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    Join The Community
                  </a>
                  <button 
                    onClick={onFeedbackClick || (() => {})} 
                    className="inline-flex items-center px-3 py-2 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Send Feedback"
                  >
                    <i className="fas fa-comment mr-2"></i>
                    <span className="text-sm font-medium">Feedback</span>
                  </button>
                </div>

                {/* Bell with Dropdown - Global Notification System */}
                <GlobalNotificationDropdown />
                
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