import React from 'react';
import { UserFlags, Role } from './access';

/**
 * Single source adapter for getting UserFlags from dev state
 * This bridges the dev context to the access control system
 */
export function getUserFlagsFromDev(): UserFlags {
  if (typeof window === 'undefined') {
    // SSR fallback
    return {
      role: 'free',
      pressedNotReady: false,
      blueprintDone: false,
      purchasedMasterclasses: []
    };
  }

  // Read from localStorage (dev state)
  const role = (localStorage.getItem('dev.role') as Role) || 'free';
  const pressedNotReady = localStorage.getItem('flags.pressedNotReady') === 'true';
  const blueprintDone = localStorage.getItem('flags.blueprintDone') === 'true';
  const purchasedMasterclasses = JSON.parse(localStorage.getItem('purchasedMasterclasses') || '[]');

  return {
    role,
    pressedNotReady,
    blueprintDone,
    purchasedMasterclasses
  };
}

/**
 * Get UserFlags with real-time updates
 * This hook ensures components re-render when dev state changes
 */
export function useUserFlags(): UserFlags {
  const [flags, setFlags] = React.useState<UserFlags>(getUserFlagsFromDev());

  React.useEffect(() => {
    const updateFlags = () => {
      setFlags(getUserFlagsFromDev());
    };

    // Listen for dev state changes
    window.addEventListener('dev:role-changed', updateFlags);
    window.addEventListener('dev:flags-changed', updateFlags);
    window.addEventListener('dev:reset', updateFlags);
    window.addEventListener('storage', updateFlags);

    return () => {
      window.removeEventListener('dev:role-changed', updateFlags);
      window.removeEventListener('dev:flags-changed', updateFlags);
      window.removeEventListener('dev:reset', updateFlags);
      window.removeEventListener('storage', updateFlags);
    };
  }, []);

  return flags;
}

