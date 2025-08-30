import React from 'react';
import NavigationMenu from './NavigationMenu';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface SidebarProps {
  user: User;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ user, isMobileOpen = false, onMobileClose }: SidebarProps) {
  
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-[80]"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar drawer */}
      <div className={`
        fixed inset-y-0 left-0 w-[84vw] max-w-[320px] lg:w-64
        bg-card lg:bg-surface shadow-xl rounded-r-2xl lg:rounded-none
        border-r border-border z-[90] 
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-hidden flex flex-col
      `}>
        
        {/* Brand Header */}
        <div className="flex items-center p-4 border-b border-border bg-card lg:bg-surface">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mr-2 text-lg">
            ⚡
          </div>
          <span className="text-text-primary font-bold text-lg">DIGITAL ERA</span>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu onMobileClose={onMobileClose} />

        {/* Footer - Mobile only feedback */}
        <div className="lg:hidden border-t border-border bg-card p-4">
          <button className="w-full text-left text-text-secondary hover:text-text-primary py-2">
            💬 Send Feedback
          </button>
        </div>
        
      </div>
    </>
  );
}