/**
 * Utility to set the user role for development testing
 * This allows testing different permission levels
 */

export function setDevRole(role: 'free' | 'trial' | 'monthly' | 'annual' | 'downsell' | 'admin') {
  if (typeof window === 'undefined') return;
  
  // Set the role in localStorage
  localStorage.setItem('userRole', role);
  
  // Dispatch event to notify components
  const event = new CustomEvent('roleChanged', { detail: { role } });
  window.dispatchEvent(event);
  
  // Log for debugging
  console.log(`Dev role set to: ${role}`);
  
  // Reload to apply changes
  window.location.reload();
}

// Expose to window for easy console access in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).setDevRole = setDevRole;
  console.log('Dev helper: Use window.setDevRole("admin") to change user role');
}