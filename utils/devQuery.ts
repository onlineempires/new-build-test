import { Role } from '../lib/access';

/**
 * URL query parameter overrides for QA testing
 * Allows setting dev state via URL parameters
 */
export interface DevQueryParams {
  role?: Role;
  pressedNotReady?: boolean;
  blueprintDone?: boolean;
}

/**
 * Parse URL query parameters for dev overrides
 */
export function parseDevQuery(): DevQueryParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const urlParams = new URLSearchParams(window.location.search);
  const params: DevQueryParams = {};

  // Role override: ?role=trial
  const role = urlParams.get('role');
  if (role && ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'].includes(role)) {
    params.role = role as Role;
  }

  // Pressed Not Ready override: ?pressedNotReady=1 or ?pressedNotReady=0
  const pressedNotReady = urlParams.get('pressedNotReady');
  if (pressedNotReady !== null) {
    params.pressedNotReady = pressedNotReady === '1' || pressedNotReady === 'true';
  }

  // Blueprint Done override: ?blueprintDone=1 or ?blueprintDone=0
  const blueprintDone = urlParams.get('blueprintDone');
  if (blueprintDone !== null) {
    params.blueprintDone = blueprintDone === '1' || blueprintDone === 'true';
  }

  return params;
}

/**
 * Apply URL query overrides to localStorage and persist them
 */
export function applyDevQueryOverrides(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const overrides = parseDevQuery();

  // Apply role override
  if (overrides.role) {
    localStorage.setItem('dev.role', overrides.role);
    window.dispatchEvent(new CustomEvent('dev:role-changed', { detail: overrides.role }));
  }

  // Apply pressedNotReady override
  if (overrides.pressedNotReady !== undefined) {
    localStorage.setItem('flags.pressedNotReady', overrides.pressedNotReady.toString());
    window.dispatchEvent(new CustomEvent('dev:flags-changed', { 
      detail: { pressedNotReady: overrides.pressedNotReady } 
    }));
  }

  // Apply blueprintDone override
  if (overrides.blueprintDone !== undefined) {
    localStorage.setItem('flags.blueprintDone', overrides.blueprintDone.toString());
    window.dispatchEvent(new CustomEvent('dev:flags-changed', { 
      detail: { blueprintDone: overrides.blueprintDone } 
    }));
  }
}

/**
 * Hook to automatically apply URL overrides on first client render
 */
export function useDevQueryOverrides(): void {
  const [hasApplied, setHasApplied] = React.useState(false);

  React.useEffect(() => {
    if (!hasApplied) {
      applyDevQueryOverrides();
      setHasApplied(true);
    }
  }, [hasApplied]);
}

/**
 * Get current URL with dev query parameters for sharing
 */
export function getDevQueryUrl(params: DevQueryParams): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  
  // Clear existing dev params
  url.searchParams.delete('role');
  url.searchParams.delete('pressedNotReady');
  url.searchParams.delete('blueprintDone');

  // Add new params
  if (params.role) {
    url.searchParams.set('role', params.role);
  }
  if (params.pressedNotReady !== undefined) {
    url.searchParams.set('pressedNotReady', params.pressedNotReady ? '1' : '0');
  }
  if (params.blueprintDone !== undefined) {
    url.searchParams.set('blueprintDone', params.blueprintDone ? '1' : '0');
  }

  return url.toString();
}

// Import React for hooks
import React from 'react';