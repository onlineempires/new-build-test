import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShieldCheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Role } from '../../lib/access';
import { useDevState } from '../../hooks/useDevState';
import { canStartCourse, isLessonUnlocked } from '../../lib/access';

const ROLE_LABELS: Record<Role, string> = {
  free: 'Free User',
  trial: '$1 Trial',
  monthly: 'Monthly Member',
  annual: 'Annual Member', 
  downsell: 'Downsell',
  admin: 'Admin'
};

export function GatingStatus() {
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
  const {
    role,
    setRole,
    pressedNotReady,
    setPressedNotReady,
    blueprintDone,
    setBlueprintDone,
    resetAll,
    getUserFlags,
    isDevToolsEnabled
  } = useDevState();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Check mobile and handle clicks outside - effect always defined; internally guards when disabled/SSR
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!devEnabled || !isDevToolsEnabled) return;
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      checkMobile();
    };

    checkMobile();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [devEnabled, isDevToolsEnabled]);

  // Get derived gating states
  const userFlags = getUserFlags();
  const isTrialUser = role === 'free' || role === 'trial' || role === 'downsell';
  const canAccessDiscovery = isLessonUnlocked('s1', 2, 1, userFlags); // Section 1, Course 2, Lesson 1
  const canAccessNextSteps = canStartCourse('s2', 1, userFlags); // Section 2, Course 1

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
  };

  const handleResetAll = () => {
    if (confirm('Reset all dev states? This will clear all progress and reload the page.')) {
      resetAll();
    }
  };

  const roles: Role[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];

  // Flag chip component
  const FlagChip = ({ label, isActive }: { label: string; isActive: boolean }) => (
    <span className={`
      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
      ${isActive 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-red-100 text-red-700 border border-red-200'
      }
    `}>
      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}
    </span>
  );

  // Desktop popover content
  const PopoverContent = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-80 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Dev Gating Status</h3>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <XMarkIcon className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Role Selector */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => handleRoleChange(e.target.value as Role)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {roles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {ROLE_LABELS[roleOption]}
            </option>
          ))}
        </select>
      </div>

      {/* Flags */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Flags</label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FlagChip label="Trial User" isActive={isTrialUser} />
          </div>
          
          <div className="flex items-center justify-between">
            <FlagChip label="Pressed Not Ready" isActive={pressedNotReady} />
            <button
              onClick={() => setPressedNotReady(!pressedNotReady)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Toggle
            </button>
          </div>

          <div className="flex items-center justify-between">
            <FlagChip label="Blueprint Done" isActive={blueprintDone} />
            <button
              onClick={() => setBlueprintDone(!blueprintDone)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Toggle
            </button>
          </div>

          <div className="flex items-center justify-between">
            <FlagChip label="Can Access Discovery" isActive={canAccessDiscovery} />
          </div>

          <div className="flex items-center justify-between">
            <FlagChip label="Can Access Next Steps" isActive={canAccessNextSteps} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleResetAll}
          className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          Reset All States
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Render nothing visible when disabled, but keep hooks stable */}
      {!devEnabled || !isDevToolsEnabled ? null : (
        <div className="relative" ref={popoverRef}>
          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
            title="Dev Gating Status"
          >
            <ShieldCheckIcon className="w-3 h-3" />
            <span className="hidden sm:inline">Dev</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover/Modal */}
          {isOpen && (
            <>
              {isMobile ? (
                // Mobile: Full-width bottom sheet
                <div className="fixed inset-0 z-50 flex items-end">
                  <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                  <div className="relative w-full bg-white rounded-t-lg">
                    {/* Handle */}
                    <div className="flex justify-center pt-2 pb-4">
                      <div className="w-10 h-1 bg-gray-300 rounded-full" />
                    </div>
                    <div className="px-4 pb-6">
                      <PopoverContent />
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop: Positioned popover
                <div className="absolute top-full right-0 mt-2 z-50">
                  <PopoverContent />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}