import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useNavigationHelper } from '../../utils/navigationHelpers';
import { useUserRole } from '../../contexts/UserRoleContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { MobileRoleSwitcher } from '../dev/RoleSwitcher';
import { SafeLink } from '../ui/SafeLink';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  section: string;
  requiredPermission: keyof import('../../contexts/UserRoleContext').UserPermissions | null;
  roles?: import('../../contexts/UserRoleContext').UserRole[]; // Optional: specific roles that can see this
}

interface SidebarProps {
  user?: User;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onFeedbackClick?: () => void;
}

// Define menu items with their required permissions
const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: 'fas fa-home', 
    section: 'dashboard', 
    requiredPermission: null // Always visible
  },
  { 
    name: 'All Courses', 
    href: '/courses', 
    icon: 'fas fa-book', 
    section: 'courses', 
    requiredPermission: null // Always visible, but content filtered by role
  },
  { 
    name: 'Library (Beta)', 
    href: '/library', 
    icon: 'fas fa-film', 
    section: 'library', 
    requiredPermission: null // Always visible when feature flag is enabled
  },
  { 
    name: 'Expert Directory', 
    href: '/experts', 
    icon: 'fas fa-users', 
    section: 'experts', 
    requiredPermission: 'canAccessExpertDirectory' // Only for paid members
  },
  { 
    name: 'Daily Method (DMO)', 
    href: '/dmo', 
    icon: 'fas fa-tasks', 
    section: 'dmo', 
    requiredPermission: 'canAccessDMO' // Only for paid members
  },
  { 
    name: 'Affiliate Portal', 
    href: '/affiliate', 
    icon: 'fas fa-link', 
    section: 'affiliate', 
    requiredPermission: 'canAccessAffiliate' // Only for paid members and downsell
  },
  { 
    name: 'Statistics', 
    href: '/stats', 
    icon: 'fas fa-chart-bar', 
    section: 'statistics', 
    requiredPermission: 'canAccessStats' // Only for paid members
  },
  { 
    name: 'Leads', 
    href: '/leads', 
    icon: 'fas fa-user-plus', 
    section: 'leads', 
    requiredPermission: 'canAccessLeads' // Only for paid members
  },
  { 
    name: 'Admin', 
    href: '/admin', 
    icon: 'fas fa-cog', 
    section: 'admin', 
    requiredPermission: 'isAdmin' // Only for admin role
  },
  { 
    name: 'Profile', 
    href: '/profile', 
    icon: 'fas fa-user', 
    section: 'profile', 
    requiredPermission: null // Always visible
  },
];

export default function Sidebar({ user, onLogout, isMobileOpen = false, setIsMobileOpen, onFeedbackClick }: SidebarProps) {
  const router = useRouter();
  const { navigate, preload, isNavigating } = useNavigationHelper(router);
  const { permissions, hasPermission, currentRole, setUserRole } = useUserRole();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout, adminUser } = useAdminAuth();
  
  const closeMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Handle navigation with enhanced error handling and logging
  const handleNavigation = async (href: string, itemName: string) => {
    // Prevent navigation if already in progress
    if (isNavigating()) {
      console.log('⚠️ Navigation already in progress, ignoring click');
      return;
    }

    // Close mobile menu first
    closeMobileMenu();
    
    // Use enhanced navigation helper
    const success = await navigate(href, {
      delay: 50, // Small delay for mobile menu to close
      fallbackToWindowLocation: true,
      retries: 2,
      onError: (error, url) => {
        console.error(`❌ Navigation failed to ${itemName} (${url}):`, error);
        // Could show user notification here
      },
      onSuccess: (url) => {
        console.log(`✅ Successfully navigated to ${itemName} (${url})`);
      }
    });
    
    if (!success) {
      console.error(`❌ All navigation attempts failed for ${itemName} (${href})`);
    }
  };

  // Filter menu items based on role directly
  const visibleMenuItems = menuItems.filter(item => {
    // Admin sees everything
    if (currentRole === 'admin') return true;
    
    // Check specific items by name for clarity
    switch (item.name) {
      case 'Dashboard':
      case 'All Courses':  
      case 'Profile':
        return true; // Everyone sees these
      
      case 'Library (Beta)':
        // Only show if feature flag is enabled
        return process.env.NEXT_PUBLIC_LIBRARY_BETA === 'true';
      
      case 'Expert Directory':
      case 'Daily Method (DMO)':
      case 'Statistics':
      case 'Leads':
        // Only paid members (monthly/annual) can see these
        return currentRole === 'monthly' || currentRole === 'annual';
      
      case 'Affiliate Portal':
        // Paid members and downsell users can see this
        return currentRole === 'monthly' || currentRole === 'annual' || currentRole === 'downsell';
      
      case 'Admin':
        // Only admin role
        return currentRole === 'admin';
      
      default:
        return false;
    }
  });
  
  // Navigation debugging and preloading
  useEffect(() => {
    console.log('=== SIDEBAR DEBUG ===');
    console.log('Current role:', currentRole);
    console.log('Router pathname:', router.pathname);
    console.log('Router ready:', router.isReady);
    console.log('Navigation in progress:', isNavigating());
    console.log('Filtered menu items:', visibleMenuItems.map(i => ({ name: i.name, href: i.href })));
    console.log('===================');
    
    // Preload visible menu items for better performance
    visibleMenuItems.forEach(item => {
      preload(item.href).catch(err => 
        console.warn(`Failed to preload ${item.name}:`, err)
      );
    });
  }, [currentRole, router.pathname, router.isReady, visibleMenuItems, isNavigating, preload]);

  // Navigation event tracking
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      console.log('🚀 Navigation started to:', url);
    };
    
    const handleRouteChangeComplete = (url: string) => {
      console.log('✅ Navigation completed to:', url);
    };
    
    const handleRouteChangeError = (err: Error, url: string) => {
      console.error('❌ Navigation failed to:', url, err);
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  const isActive = (href: string) => {
    if (href === '/courses') {
      return router.pathname === '/courses' || router.pathname.startsWith('/courses/');
    }
    if (href === '/dashboard') {
      return router.pathname === '/' || router.pathname === '/dashboard';
    }
    return router.pathname === href;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-[80]"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar drawer */}
      <div className={`fixed inset-y-0 left-0 w-[84vw] max-w-[320px] theme-sidebar shadow-2xl rounded-r-2xl lg:rounded-none z-[90] transform transition-transform duration-300 ease-in-out lg:w-64 lg:shadow-none lg:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } overflow-hidden flex flex-col`}>
        
        {/* Brand row */}
        <div className="flex items-center p-4 border-b theme-border theme-sidebar">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold mr-2 text-lg"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            ⚡
          </div>
          <span className="theme-text-primary font-bold text-lg">DIGITAL ERA</span>
        </div>

        {/* Nav items - FIXED: Using SafeLink to prevent multiple children error */}
        <nav className="flex-1 py-4">
          {visibleMenuItems.map((item) => (
            <SafeLink 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm transition-colors min-h-[48px] focus:outline-none focus:ring-2 mx-2 rounded-xl cursor-pointer ${
                isActive(item.href) 
                  ? 'text-white shadow-md' 
                  : 'theme-text-primary theme-hover'
              }`}
              style={isActive(item.href) ? { backgroundColor: 'var(--color-primary)' } : {}}
              onClick={closeMobileMenu}
            >
              <i className={`${item.icon} text-base mr-4 w-5 flex-shrink-0 ${
                isActive(item.href) ? 'text-white' : 'theme-text-secondary'
              }`}></i>
              <span className="font-medium">{item.name}</span>
            </SafeLink>
          ))}
        </nav>

        {/* Feedback Button - Only visible on mobile */}
        <div className="lg:hidden border-t theme-border theme-sidebar">
          {onFeedbackClick && (
            <button
              onClick={() => {
                onFeedbackClick();
                closeMobileMenu();
              }}
              className="w-full flex items-center px-4 py-3 text-sm theme-text-primary theme-hover transition-colors min-h-[48px]"
            >
              <i className="fas fa-comment text-base mr-4 w-5 flex-shrink-0 theme-text-secondary"></i>
              <span className="font-medium">Send Feedback</span>
            </button>
          )}
          
          {/* Mobile Dev Tools */}
          <MobileRoleSwitcher onSelect={closeMobileMenu} />
        </div>

        {/* User Profile - FIXED: Using SafeLink to prevent multiple children error */}
        <div className="border-t theme-border theme-sidebar">
          <SafeLink 
            href="/profile"
            className="flex items-center p-4 theme-hover transition-colors cursor-pointer"
            onClick={closeMobileMenu}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-lg"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <div className="theme-text-primary text-sm font-medium">{user?.name || 'Guest User'}</div>
              <div className="theme-text-secondary text-xs">View Profile</div>
            </div>
          </SafeLink>
        </div>
      </div>


    </>
  );
}