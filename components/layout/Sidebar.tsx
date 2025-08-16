import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUserRole } from '../../contexts/UserRoleContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface SidebarProps {
  user: User;
  onLogout: () => void;
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

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { permissions, hasPermission, currentRole, setUserRole } = useUserRole();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout, adminUser } = useAdminAuth();

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
      {/* Mobile hamburger - Higher z-index */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-white text-gray-700 rounded-xl shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-all hover:shadow-xl hover:scale-105"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar - Fixed gaps and transparency */}
      <div className={`fixed left-0 top-0 h-full w-80 lg:w-64 bg-white lg:bg-sidebar-bg text-gray-700 lg:text-sidebar-text transform transition-transform duration-300 ease-in-out lg:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } z-50 shadow-2xl lg:shadow-none border-r border-gray-100 lg:border-none overflow-hidden flex flex-col`}>
        
        {/* Logo - Modern style */}
        <div className="flex items-center p-6 border-b border-gray-100 lg:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 lg:bg-none">
          <div className="w-10 h-10 bg-white lg:bg-brand-primary rounded-xl flex items-center justify-center text-blue-600 lg:text-white font-bold mr-3 text-xl shadow-lg">
            ⚡
          </div>
          <span className="text-white font-bold text-xl">DIGITAL ERA</span>
        </div>

        {/* Menu Items - Completely seamless desktop */}
        <nav className="mt-2 px-4 lg:px-0 lg:mt-6 flex-1">
          {visibleMenuItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`nav-item flex items-center px-4 lg:px-6 py-4 lg:py-3 text-sm transition-colors hover:bg-gray-50 lg:hover:bg-sidebar-hover min-h-[56px] lg:min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset text-white ${
                  // Mobile styles
                  'rounded-xl mx-2 mb-1 lg:rounded-none lg:mx-0 lg:mb-0'
                } ${
                  isActive(item.href) 
                    ? // Mobile active: gradient card, Desktop active: brand background
                      'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm border-l-4 border-blue-500 lg:bg-brand-primary lg:text-white lg:shadow-none lg:border-none lg:from-transparent lg:to-transparent' 
                    : // Mobile inactive: gray text, Desktop inactive: white text
                      'text-gray-700 lg:text-white hover:text-gray-900 lg:hover:text-white lg:bg-transparent'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                {/* Icon container - mobile gets background, desktop gets none */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 lg:w-auto lg:h-auto lg:rounded-none lg:bg-transparent ${
                  isActive(item.href) ? 'bg-blue-100' : 'bg-gray-100'
                } lg:bg-transparent`}>
                  <i className={`${item.icon} text-sm ${
                    isActive(item.href) ? 'text-blue-600 lg:text-white' : 'text-gray-600 lg:text-white'
                  }`}></i>
                </div>
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* User Profile - Modern style */}
        <div className="absolute bottom-0 w-full border-t border-gray-100 lg:border-gray-700 bg-white lg:bg-transparent">
          <Link href="/profile">
            <a className="flex items-center p-4 hover:bg-gray-50 lg:hover:bg-sidebar-hover transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 lg:bg-brand-primary rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <div className="text-gray-700 lg:text-white text-sm font-medium">{user.name}</div>
                <div className="text-gray-500 lg:text-gray-300 text-xs">View Profile</div>
              </div>
            </a>
          </Link>
        </div>
      </div>

      {/* Mobile overlay - Higher z-index, more opaque */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}