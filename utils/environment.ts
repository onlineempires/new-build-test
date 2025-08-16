/**
 * Environment utility functions
 * Provides safe environment variable access and development mode detection
 */

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isTest = () => {
  return process.env.NODE_ENV === 'test';
};

/**
 * Check if we should show development-only features
 * This includes role switcher, debug tools, etc.
 * 
 * Features will only show if:
 * 1. NODE_ENV is 'development' AND
 * 2. NEXT_PUBLIC_SHOW_DEV_TOOLS is not explicitly set to 'false'
 */
export const shouldShowDevFeatures = () => {
  if (!isDevelopment()) return false;
  
  // Allow explicitly hiding dev features even in development
  const showDevTools = process.env.NEXT_PUBLIC_SHOW_DEV_TOOLS;
  if (showDevTools === 'false') return false;
  
  return true;
};

/**
 * Check if admin role switcher should be visible
 * This is for development/testing only
 */
export const shouldShowRoleSwitcher = () => {
  return shouldShowDevFeatures() && process.env.NEXT_PUBLIC_ENABLE_ROLE_SWITCHER !== 'false';
};

/**
 * Get API base URL based on environment
 */
export const getApiBaseUrl = () => {
  if (isProduction()) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.digitalera.com';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

/**
 * Get current environment name for display
 */
export const getEnvironmentName = () => {
  if (isProduction()) return 'Production';
  if (isTest()) return 'Test';
  return 'Development';
};