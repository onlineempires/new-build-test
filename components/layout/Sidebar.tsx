import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { hasAccess, getTierDisplayName } from '../../utils/accessControl';
import type { UserTier } from '../../utils/accessControl';
import { useUserRole } from '../../contexts/UserRoleContext';

interface User {
  id: number;
  name: string;
  avatarUrl?: string;
  tier?: UserTier;
}

interface SidebarProps {
  user?: User;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onFeedbackClick?: () => void;
}

export default function Sidebar({ user, isMobileOpen = false, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();
  const { currentRole, roleDetails } = useUserRole();
  
  // Convert UserRole to UserTier for access control compatibility
  const roleToTier = (role: string): UserTier => {
    switch (role) {
      case 'monthly': return 'monthly_99';
      case 'annual': return 'annual_799';
      case 'downsell': return 'downsell_37';
      case 'admin': return 'admin';
      case 'trial':
      case 'free':
      case 'guest':
      default: return 'trial';
    }
  };

  const [safeUser, setSafeUser] = useState<User>({ 
    id: 1, 
    name: roleDetails?.name || 'User', 
    tier: roleToTier(currentRole)
  });

  // Sync with user role context changes
  useEffect(() => {
    setSafeUser(prev => ({
      ...prev,
      name: roleDetails?.name || user?.name || 'User',
      tier: roleToTier(currentRole)
    }));
  }, [currentRole, roleDetails, user]);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠', alwaysVisible: true },
    { href: '/courses', label: 'All Courses', icon: '📚' },
    { href: '/library', label: 'Library (Beta)', icon: '📖' },
    { href: '/experts', label: 'Expert Directory', icon: '👥' },
    { href: '/dmo', label: 'Daily Method (DMO)', icon: '📋' },
    { href: '/affiliate', label: 'Affiliate Portal', icon: '🔗' },
    { href: '/stats', label: 'Statistics', icon: '📊' },
    { href: '/leads', label: 'Leads', icon: '👤' },
    { href: '/profile', label: 'Profile', icon: '⚙️', alwaysVisible: true }
  ];

  const closeMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
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

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-[84vw] max-w-[320px] bg-white shadow-2xl rounded-r-2xl lg:rounded-none z-[90] transform transition-transform duration-300 ease-in-out lg:w-64 lg:shadow-none lg:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">DIGITAL ERA</h1>
          </div>
        </div>

        {/* User Tier Display - SYNCHRONIZED WITH HEADER */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500">Current Plan</div>
              <div className="font-semibold text-sm">
                {roleDetails?.name || getTierDisplayName(safeUser?.tier)}
              </div>
            </div>
            {/* Debug indicator in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400">
                {currentRole}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const userHasAccess = item.alwaysVisible || hasAccess(safeUser?.tier, item.href);
            
            return (
              <div key={item.href} className="relative">
                <Link href={item.href}>
                  <a 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${ 
                      isActive(item.href) 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : userHasAccess
                        ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        : 'text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    onClick={(e) => {
                      if (!userHasAccess) {
                        e.preventDefault();
                        console.log(`Access denied to ${item.href} for tier ${safeUser?.tier}`);
                        return;
                      }
                      closeMobileMenu();
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {!userHasAccess && (
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                        🔒
                      </span>
                    )}
                  </a>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/profile">
            <a 
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {safeUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {safeUser?.name || 'Guest User'}
                </div>
                <div className="text-xs text-gray-500">View Profile</div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}