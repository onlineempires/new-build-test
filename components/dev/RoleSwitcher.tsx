import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Role } from '../../lib/access';
import { useDevState } from '../../hooks/useDevState';

const ROLE_LABELS: Record<Role, string> = {
  free: 'Free User',
  trial: '$1 Trial',
  monthly: 'Monthly Member',
  annual: 'Annual Member', 
  downsell: 'Downsell',
  admin: 'Admin'
};

const ROLE_COLORS: Record<Role, string> = {
  free: 'bg-gray-100 text-gray-700 border-gray-200',
  trial: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  monthly: 'bg-blue-100 text-blue-700 border-blue-200',
  annual: 'bg-green-100 text-green-700 border-green-200',
  downsell: 'bg-orange-100 text-orange-700 border-orange-200',
  admin: 'bg-purple-100 text-purple-700 border-purple-200'
};

export function RoleSwitcher() {
  // Compute flags at top level (no early returns before hooks)
  const devEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try { 
      return process.env.NEXT_PUBLIC_DEV_TOOLS === 'true' || localStorage.getItem('devTools') === 'on'; 
    } catch { 
      return false; 
    }
  }, []);

  // Always declare hooks (unconditional)
  const { role, setRole, isDevToolsEnabled } = useDevState();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: effect always defined; internally guards when disabled/SSR
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!devEnabled || !isDevToolsEnabled) return;
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setIsOpen(v => !v);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!devEnabled || !isDevToolsEnabled) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [devEnabled, isDevToolsEnabled]);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setIsOpen(false);
  };

  const roles: Role[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];

  return (
    <>
      {/* Render nothing visible when disabled, but keep hooks stable */}
      {!devEnabled || !isDevToolsEnabled ? null : (
        <div className="relative" ref={dropdownRef}>
          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border
              transition-colors duration-200 hover:opacity-80
              ${ROLE_COLORS[role]}
            `}
            title="Dev Role Switcher (Alt+D)"
          >
            <span>{ROLE_LABELS[role]}</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                {roles.map((roleOption) => (
                  <button
                    key={roleOption}
                    onClick={() => handleRoleChange(roleOption)}
                    className={`
                      w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors
                      ${role === roleOption ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[roleOption].split(' ')[0]}`} />
                      <span>{ROLE_LABELS[roleOption]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Mobile version for header overflow menu
export function MobileRoleSwitcher({ onSelect }: { onSelect?: () => void }) {
  // Compute flags at top level (no early returns before hooks)
  const devEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try { 
      return process.env.NEXT_PUBLIC_DEV_TOOLS === 'true' || localStorage.getItem('devTools') === 'on'; 
    } catch { 
      return false; 
    }
  }, []);

  // Always declare hooks (unconditional)
  const { role, setRole, isDevToolsEnabled } = useDevState();

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    onSelect?.();
  };

  const roles: Role[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];

  return (
    <>
      {/* Render nothing visible when disabled, but keep hooks stable */}
      {!devEnabled || !isDevToolsEnabled ? null : (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="px-3 py-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Dev Role
            </div>
            <div className="space-y-1">
              {roles.map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => handleRoleChange(roleOption)}
                  className={`
                    w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors
                    ${role === roleOption 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[roleOption].split(' ')[0]}`} />
                    <span>{ROLE_LABELS[roleOption]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}