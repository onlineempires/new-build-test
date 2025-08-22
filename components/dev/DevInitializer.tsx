import { useEffect } from 'react';
import { useDevQueryOverrides } from '../../utils/devQuery';

/**
 * DevInitializer handles URL query overrides and global dev state initialization
 * This should be mounted at the app level to ensure proper initialization
 */
export function DevInitializer() {
  // Apply URL query overrides on first render
  useDevQueryOverrides();

  useEffect(() => {
    // Ensure dev tools are properly initialized
    const devTools = process.env.NEXT_PUBLIC_DEV_TOOLS === 'true' || 
      (typeof window !== 'undefined' && localStorage.getItem('devTools') === 'on');

    if (devTools && typeof window !== 'undefined') {
      // Initialize dev state listeners
      console.log('🔧 Dev Tools initialized');
    }
  }, []);

  return null; // This component doesn't render anything
}