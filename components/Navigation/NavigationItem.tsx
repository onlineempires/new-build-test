import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationItemProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavigationItem({ href, icon, children, onClick }: NavigationItemProps) {
  const router = useRouter();
  
  // Simple, reliable active state detection
  const isActive = () => {
    const currentPath = router.pathname;
    
    // Exact match for root
    if (href === '/' && currentPath === '/') return true;
    
    // Special handling for courses routes
    if (href === '/courses' && (currentPath === '/courses' || currentPath.startsWith('/courses/'))) {
      return true;
    }
    
    // For other routes, match the base path
    if (href !== '/' && currentPath.startsWith(href)) {
      return true;
    }
    
    return false;
  };

  const active = isActive();

  const handleClick = (e: React.MouseEvent) => {
    // Clear any existing navigation conflicts
    e.preventDefault();
    
    // Execute any additional onClick handler
    if (onClick) {
      onClick();
    }
    
    // Simple, reliable navigation
    router.push(href);
  };

  return (
    <Link href={href}>
      <a
        className={`
          nav-item flex items-center gap-3 px-4 py-3 mx-2 rounded-xl 
          transition-all duration-200 ease-in-out
          ${active 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
          }
        `}
        onClick={handleClick}
      >
        <i className={`${icon} w-5 text-center flex-shrink-0`} />
        <span className="font-medium">{children}</span>
      </a>
    </Link>
  );
}