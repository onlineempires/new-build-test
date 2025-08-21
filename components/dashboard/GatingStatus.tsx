import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCourseGating } from '../../hooks/useCourseGating';

export default function GatingStatus() {
  const {
    isTrial,
    hasPressedNotReady,
    businessBlueprintDone,
    canAccessDiscovery,
    canAccessNextSteps,
    resetGatingState
  } = useCourseGating();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  // Close dropdown when mobile drawer opens
  useEffect(() => {
    const handleDrawerOpen = () => setIsOpen(false);
    window.addEventListener('mobile-drawer-open', handleDrawerOpen);
    return () => window.removeEventListener('mobile-drawer-open', handleDrawerOpen);
  }, []);

  // Show in development, staging, or when explicitly enabled in production
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SHOW_GATING_WIDGET) {
    return null; // Don't show in production unless explicitly enabled
  }

  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 320; // Estimated dropdown height
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    
    return {
      top: spaceBelow >= dropdownHeight + 8 
        ? rect.bottom + 8 
        : rect.top - dropdownHeight - 8,
      right: window.innerWidth - rect.right
    };
  };

  const position = isOpen ? getDropdownPosition() : { top: 0, right: 0 };

  const dropdown = mounted && isOpen ? createPortal(
    <div 
      ref={dropdownRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[1100] max-w-sm w-64"
      style={{
        top: position.top,
        right: position.right
      }}
    >
      <div className="text-xs font-semibold text-gray-600 mb-2">🔒 Gating Status</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Trial User:</span>
          <span className={isTrial ? 'text-orange-600 font-bold' : 'text-gray-500'}>{isTrial ? 'YES' : 'NO'}</span>
        </div>
        <div className="flex justify-between">
          <span>Pressed Not Ready:</span>
          <span className={hasPressedNotReady ? 'text-green-600 font-bold' : 'text-gray-500'}>{hasPressedNotReady ? 'YES' : 'NO'}</span>
        </div>
        <div className="flex justify-between">
          <span>Blueprint Done:</span>
          <span className={businessBlueprintDone ? 'text-green-600 font-bold' : 'text-gray-500'}>{businessBlueprintDone ? 'YES' : 'NO'}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>Can Access Discovery:</span>
          <span className={canAccessDiscovery ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{canAccessDiscovery ? 'YES' : 'NO'}</span>
        </div>
        <div className="flex justify-between">
          <span>Can Access Next Steps:</span>
          <span className={canAccessNextSteps ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{canAccessNextSteps ? 'YES' : 'NO'}</span>
        </div>
      </div>
      <hr className="my-3" />
      <button
        onClick={() => {
          resetGatingState();
          setIsOpen(false);
        }}
        className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 px-3 rounded transition-colors"
      >
        🔄 Reset All States
      </button>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
          isOpen 
            ? 'bg-orange-50 text-orange-700 border-orange-200' 
            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
        }`}
      >
        🔒 Dev
      </button>
      {dropdown}
    </>
  );
}