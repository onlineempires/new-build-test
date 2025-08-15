import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'All Courses', href: '/courses', icon: '📚' },
  { name: 'Expert Directory', href: '/experts', icon: '👥' },
  { name: 'Daily Method (DMO)', href: '/dmo', icon: '📅' },
  { name: 'Affiliate Portal', href: '/affiliate', icon: '🤝' },
  { name: 'Statistics', href: '/stats', icon: '📈' },
  { name: 'Leads', href: '/leads', icon: '🎯' },
  { name: 'Profile', href: '/profile', icon: '👤' },
];

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar-bg text-white rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-sidebar-bg text-sidebar-text transform transition-transform lg:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } z-40`}>
        
        {/* Logo */}
        <div className="flex items-center p-6 border-b border-gray-700">
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold mr-3 text-xl">
            ⚡
          </div>
          <span className="text-white font-bold text-xl">DIGITAL ERA</span>
        </div>

        {/* Menu Items */}
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center px-6 py-3 text-sm transition-colors hover:bg-sidebar-hover min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset text-white ${
                  isActive(item.href) 
                    ? 'bg-brand-primary' 
                    : ''
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="text-xl mr-3 text-white">{item.icon}</span>
                <span className="font-medium text-white">{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-full border-t border-gray-700">
          <Link href="/profile">
            <a className="flex items-center p-4 hover:bg-sidebar-hover transition-colors">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{user.name}</div>
              </div>
            </a>
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-sidebar-hover transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}