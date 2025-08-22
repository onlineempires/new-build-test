/**
 * Initialize dev tools settings for development environment
 * This ensures dev tools are enabled by default in development
 */

export function initializeDevTools() {
  if (typeof window === 'undefined') return;
  
  // Only initialize in development mode
  if (process.env.NODE_ENV !== 'development') return;
  
  // Check if already initialized
  const devToolsState = localStorage.getItem('devTools');
  
  // If not set, enable by default in development
  if (!devToolsState) {
    localStorage.setItem('devTools', 'on');
    console.log('Dev tools enabled for development environment');
  }
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  initializeDevTools();
}