import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserRole } from '../../contexts/UserRoleContext';
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
    requiredPermission: null, // Always visible
  },
  {
    name: 'All Courses',
    href: '/courses',
    icon: 'fas fa-book',
    section: 'courses',
    requiredPermission: null, // Always visible, but content filtered by role
  },
  {
    name: 'Library (Beta)',
    href: '/library',
    icon: 'fas fa-film',
    section: 'library',
    requiredPermission: null, // Always visible when feature flag is enabled
  },
  {
    name: 'Expert Directory',
    href: '/experts',
    icon: 'fas fa-users',
    section: 'experts',
    requiredPermission: 'canAccessExpertDirectory', // Only for paid members
  },
  {
    name: 'Daily Method (DMO)',
    href: '/dmo',
    icon: 'fas fa-tasks',
    section: 'dmo',
    requiredPermission: 'canAccessDMO', // Only for paid members
  },
  {
    name: 'Affiliate Portal',
    href: '/affiliate',
    icon: 'fas fa-link',
    section: 'affiliate',
    requiredPermission: 'canAccessAffiliate', // Only for paid members and downsell
  },
  {
    name: 'Sales Closer',
    href: '/sales_closer',
    icon: 'fas fa-handshake',
    section: 'sales-closer',
    requiredPermission: 'canAccessSalesCloser', // New permission for sales closer access
  },
  {
    name: 'My Funnels',
    href: 'member/funnels',
    icon: 'fas fa-funnel',
    section: 'member-funnels',
    requiredPermission: 'canAccessMyFunnels', // New permission for my funnels access
  },
  {
    name: 'Statistics',
    href: '/stats',
    icon: 'fas fa-chart-bar',
    section: 'statistics',
    requiredPermission: 'canAccessStats', // Only for paid members
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: 'fas fa-user-plus',
    section: 'leads',
    requiredPermission: 'canAccessLeads', // Only for paid members
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: 'fas fa-cog',
    section: 'admin',
    requiredPermission: 'isAdmin', // Only for admin role
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: 'fas fa-user',
    section: 'profile',
    requiredPermission: null, // Always visible
  },
];

export default function Sidebar({
  user,
  isMobileOpen = false,
  setIsMobileOpen,
  onFeedbackClick,
}: SidebarProps) {
  const router = useRouter();
  const { currentRole } = useUserRole();

  const closeMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Filter menu items based on role directly
  const visibleMenuItems = menuItems.filter((item) => {
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

      case 'Sales Closer Setup':
        // Paid members and downsell users can see this
        return currentRole === 'monthly' || currentRole === 'annual' || currentRole === 'downsell';

      case 'My Funnels':
        // Paid members and downsell users can see this
        return currentRole === 'monthly' || currentRole === 'annual' || currentRole === 'downsell';

      default:
        return false;
    }
  });

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
        <div className="fixed inset-0 z-[80] bg-black/40 lg:hidden" onClick={closeMobileMenu} />
      )}

      {/* Sidebar drawer */}
      <div
        data-sidebar
        className={`theme-sidebar fixed inset-y-0 left-0 z-[90] w-[84vw] max-w-[320px] transform rounded-r-2xl shadow-2xl transition-transform duration-300 ease-in-out lg:w-64 lg:transform-none lg:rounded-none lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col overflow-hidden`}
      >
        {/* Brand row */}
        <div className="theme-border theme-sidebar flex items-center border-b p-4">
          <div
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            ⚡
          </div>
          <span className="theme-text-primary text-lg font-bold">DIGITAL ERA</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4">
          {visibleMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`mx-2 flex min-h-[48px] items-center rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  isActive(item.href) ? 'text-white shadow-md' : 'theme-text-primary theme-hover'
                }`}
                style={isActive(item.href) ? { backgroundColor: 'var(--color-primary)' } : {}}
                onClick={closeMobileMenu}
              >
                <i
                  className={`${item.icon} mr-4 w-5 flex-shrink-0 text-base ${
                    isActive(item.href) ? 'text-white' : 'theme-text-secondary'
                  }`}
                ></i>
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* Feedback Button - Only visible on mobile */}
        <div className="theme-border theme-sidebar border-t lg:hidden">
          {onFeedbackClick && (
            <button
              onClick={() => {
                onFeedbackClick();
                closeMobileMenu();
              }}
              className="theme-text-primary theme-hover flex min-h-[48px] w-full items-center px-4 py-3 text-sm transition-colors"
            >
              <i className="fas fa-comment theme-text-secondary mr-4 w-5 flex-shrink-0 text-base"></i>
              <span className="font-medium">Send Feedback</span>
            </button>
          )}

          {/* Mobile Dev Tools */}
          <MobileRoleSwitcher onSelect={closeMobileMenu} />
        </div>

        {/* User Profile */}
        <div className="theme-border theme-sidebar border-t">
          <Link href="/profile">
            <a className="theme-hover flex items-center p-4 transition-colors">
              <div
                className="mr-3 flex h-10 w-10 items-center justify-center rounded-full font-bold text-white shadow-lg"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <div className="theme-text-primary text-sm font-medium">{user.name}</div>
                <div className="theme-text-secondary text-xs">View Profile</div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
