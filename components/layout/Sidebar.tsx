import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUserRole } from '../../contexts/UserRoleContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { MobileRoleSwitcher } from '../dev/RoleSwitcher';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onFeedbackClick?: () => void;
}

const menuItems = [
  { name: 'Dashboard', href: '/', icon: 'fas fa-home', section: 'dashboard', requiredPermission: null },
  { name: 'All Courses', href: '/courses', icon: 'fas fa-book', section: 'courses', requiredPermission: null },
  { name: 'Expert Directory', href: '/experts', icon: 'fas fa-users', section: 'experts', requiredPermission: 'canAccessExpertDirectory' },
  { name: 'Daily Method (DMO)', href: '/dmo', icon: 'fas fa-tasks', section: 'dmo', requiredPermission: 'canAccessDMO' },
  { name: 'Affiliate Portal', href: '/affiliate', icon: 'fas fa-link', section: 'affiliate', requiredPermission: 'canAccessAffiliate' },
  { name: 'Statistics', href: '/stats', icon: 'fas fa-chart-bar', section: 'statistics', requiredPermission: 'canAccessStats' },
  { name: 'Leads', href: '/leads', icon: 'fas fa-user-plus', section: 'leads', requiredPermission: 'canAccessLeads' },
  { name: 'Admin', href: '/admin', icon: 'fas fa-cog', section: 'admin', requiredPermission: 'isAdmin' },
  { name: 'Profile', href: '/profile', icon: 'fas fa-user', section: 'profile', requiredPermission: null },
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

  const visibleMenuItems = menuItems.filter(item => 
    !item.requiredPermission || hasPermission(item.requiredPermission as any)
  );

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
      <div className={`fixed inset-y-0 left-0 w-[84vw] max-w-[320px] bg-white lg:bg-slate-900 shadow-2xl rounded-r-2xl lg:rounded-none z-[90] transform transition-transform duration-300 ease-in-out lg:w-64 lg:shadow-none lg:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } overflow-hidden flex flex-col`}>
        
        {/* Brand row */}
        <div className="flex items-center p-4 border-b border-slate-200 lg:border-slate-700 bg-white lg:bg-slate-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2 text-lg">
            ⚡
          </div>
          <span className="text-slate-900 lg:text-white font-bold text-lg">DIGITAL ERA</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4">
          {visibleMenuItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center px-4 py-3 text-sm transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                  isActive(item.href) 
                    ? 'bg-blue-600 text-white mx-2 rounded-xl shadow-md lg:mx-0 lg:rounded-none lg:bg-blue-600' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 lg:text-slate-300 lg:hover:text-white lg:hover:bg-slate-800'
                }`}
                onClick={closeMobileMenu}
              >
                <i className={`${item.icon} text-base mr-4 w-5 flex-shrink-0 ${
                  isActive(item.href) ? 'text-white' : 'text-slate-500 lg:text-slate-300'
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