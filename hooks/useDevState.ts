import { useEffect, useState } from 'react';
import { Role, UserFlags } from '../lib/access';
import { useDevContext } from '../contexts/DevContext';

export interface DevStateHook {
  role: Role;
  pressedNotReady: boolean;
  blueprintDone: boolean;
  purchasedMasterclasses: string[];
  setRole: (role: Role) => void;
  setPressedNotReady: (value: boolean) => void;
  setBlueprintDone: (value: boolean) => void;
  setPurchasedMasterclasses: (masterclasses: string[]) => void;
  resetAll: () => void;
  getUserFlags: () => UserFlags;
  isDevToolsEnabled: boolean;
}

export function useDevState(): DevStateHook {
  const devContext = useDevContext();
  const [isDevToolsEnabled, setIsDevToolsEnabled] = useState(false);

  useEffect(() => {
    const checkDevTools = () => {
      // Always enable in development mode
      const isDev = process.env.NODE_ENV === 'development';
      const envFlag = process.env.NEXT_PUBLIC_DEV_TOOLS === 'true';
      const localFlag = typeof window !== 'undefined' && localStorage.getItem('devTools') === 'on';
      
      // Enable if any condition is met
      setIsDevToolsEnabled(isDev || envFlag || localFlag);
    };

    checkDevTools();
    
    // Listen for localStorage changes
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', checkDevTools);
      // Also check on focus to catch manual localStorage changes
      window.addEventListener('focus', checkDevTools);
      return () => {
        window.removeEventListener('storage', checkDevTools);
        window.removeEventListener('focus', checkDevTools);
      };
    }
  }, []);

  const getUserFlags = (): UserFlags => {
    return {
      role: devContext.role,
      pressedNotReady: devContext.pressedNotReady,
      blueprintDone: devContext.blueprintDone,
      purchasedMasterclasses: devContext.purchasedMasterclasses
    };
  };

  return {
    ...devContext,
    getUserFlags,
    isDevToolsEnabled
  };
}