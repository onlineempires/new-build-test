import React from 'react';
import NavigationItem from './NavigationItem';

interface NavigationMenuProps {
  onMobileClose?: () => void;
}

export default function NavigationMenu({ onMobileClose }: NavigationMenuProps) {
  
  // Clean, simple menu items - no complex permissions or filtering
  const menuItems = [
    {
      href: '/',
      icon: 'fas fa-home',
      label: 'Dashboard'
    },
    {
      href: '/courses',
      icon: 'fas fa-book',
      label: 'All Courses'
    },
    {
      href: '/library',
      icon: 'fas fa-film',
      label: 'Library (Beta)'
    },
    {
      href: '/experts',
      icon: 'fas fa-users',
      label: 'Expert Directory'
    },
    {
      href: '/dmo',
      icon: 'fas fa-tasks',
      label: 'Daily Method (DMO)'
    },
    {
      href: '/affiliate',
      icon: 'fas fa-link',
      label: 'Affiliate Portal'
    },
    {
      href: '/stats',
      icon: 'fas fa-chart-bar',
      label: 'Statistics'
    },
    {
      href: '/leads',
      icon: 'fas fa-user-plus',
      label: 'Leads'
    },
    {
      href: '/profile',
      icon: 'fas fa-user',
      label: 'Profile'
    }
  ];

  return (
    <nav className="nav-menu flex-1 py-4 space-y-1">
      {menuItems.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          onClick={onMobileClose}
        >
          {item.label}
        </NavigationItem>
      ))}
    </nav>
  );
}