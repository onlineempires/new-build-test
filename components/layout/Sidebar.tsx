import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUserRole } from '../../contexts/UserRoleContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { MobileRoleSwitcher } from '../dev/RoleSwitcher';

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
  user: User;
  onLogout: () => void;
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
  const { permissions, hasPermission, currentRole, setUserRole } = useUserRole();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout, adminUser } = useAdminAuth();
  
  const closeMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
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
  
  // Debug logging - ALWAYS log to see what's happening
  useEffect(() => {
    console.log('=== SIDEBAR DEBUG ===');
    console.log('Current role:', currentRole);
    console.log('Permissions object:', permissions);
    console.log('All menu items:', menuItems.map(i => i.name));
    console.log('Filtered menu items:', visibleMenuItems.map(i => i.name));
    console.log('Should see DMO?', currentRole === 'monthly' || currentRole === 'annual');
    console.log('Should see Expert Directory?', currentRole === 'monthly' || currentRole === 'annual');
    console.log('===================');
  }, [currentRole, permissions, visibleMenuItems]);

  const isActive = (href: string) => {
    if (href === '/courses') {
      return router.pathname === '/courses' || router.pathname.startsWith('/courses/');
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
      <div className={`fixed inset-y-0 left-0 w-[84vw] max-w-[320px] bg-card lg:bg-surface shadow-xl rounded-r-2xl lg:rounded-none z-[90] transform transition-transform duration-300 ease-in-out lg:w-64 lg:shadow-none lg:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } overflow-hidden flex flex-col border-r border-border`}>
        
        {/* Brand row */}
        <div className="flex items-center p-4 border-b border-border bg-card lg:bg-surface">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mr-2 text-lg">
            ⚡
          </div>
          <span className="text-text-primary font-bold text-lg">DIGITAL ERA</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4">
          {visibleMenuItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center px-4 py-3 text-sm transition-colors min-h-[48px] focus-ring ${
                  isActive(item.href) 
                    ? 'bg-primary text-primary-foreground mx-2 rounded-xl shadow-md lg:mx-0 lg:rounded-none' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={closeMobileMenu}
              >
                <i className={`${item.icon} text-base mr-4 w-5 flex-shrink-0 ${
                  isActive(item.href) ? 'text-primary-foreground' : 'text-text-tertiary'
                }`}></i>
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* Feedback Button - Only visible on mobile */}
        <div className="lg:hidden border-t border-slate-200 bg-white">
          {onFeedbackClick && (
            <button
              onClick={() => {
                onFeedbackClick();
                closeMobileMenu();
              }}
              className="w-full flex items-center px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors min-h-[48px]"
            >
              <i className="fas fa-comment text-base mr-4 w-5 flex-shrink-0 text-slate-500"></i>
              <span className="font-medium">Send Feedback</span>
            </button>
          )}
          
          {/* Mobile Dev Tools */}
          <MobileRoleSwitcher onSelect={closeMobileMenu} />
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-200 lg:border-slate-700 bg-white lg:bg-slate-900">
          <Link href="/profile">
            <a className="flex items-center p-4 hover:bg-slate-50 lg:hover:bg-slate-800 transition-colors">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <div className="text-slate-700 lg:text-white text-sm font-medium">{user.name}</div>
                <div className="text-slate-500 lg:text-slate-300 text-xs">View Profile</div>
              </div>
            </a>
          </Link>
        </div>
      </div>


    </>
  );
}