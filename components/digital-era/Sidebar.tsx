"use client";
import React from 'react';
import { Home, BookOpen, Library, User } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface SidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'all-courses', label: 'All Courses', icon: BookOpen },
  { id: 'library', label: 'Library (Beta)', icon: Library },
  { id: 'profile', label: 'Profile', icon: User }
];

export function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  const { colors } = useTheme();

  return (
    <aside className={`${colors.cardBg} ${colors.border} border-r w-64 h-screen sticky top-16 overflow-y-auto`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : `${colors.text} hover:bg-blue-500 hover:text-white`
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'library' && (
                    <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Beta
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}