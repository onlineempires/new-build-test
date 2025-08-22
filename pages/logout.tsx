import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNotificationActions } from '../contexts/NotificationContext';

export default function Logout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  
  // Use the correct hook with safe fallback
  let notificationActions: ReturnType<typeof useNotificationActions> | null = null;
  try {
    notificationActions = useNotificationActions();
  } catch (error) {
    // If context is not available, we'll handle notifications manually
    console.warn('NotificationContext not available:', error);
  }

  useEffect(() => {
    performLogout();
  }, []);

  const performLogout = async () => {
    try {
      // Clear all client-side storage
      if (typeof window !== 'undefined') {
        // Clear all authentication-related localStorage items
        const authKeys = [
          'auth_token',
          'adminSession',
          'adminLoginTime',
          'adminUser',
          'userRole',
          'userSession',
          'availableRoles',
          'purchasedCourses',
          'userPurchases',
          'affiliateId',
          'currentUser',
        ];
        
        authKeys.forEach(key => {
          localStorage.removeItem(key);
        });

        // Clear sessionStorage as well
        sessionStorage.clear();

        // Clear any cookies from JavaScript (if accessible)
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        });
      }

      // Call the server-side logout API to destroy the session
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookie handling
      });

      if (!response.ok) {
        throw new Error('Failed to logout from server');
      }

      const data = await response.json();
      console.log('[Logout] Server logout response:', data);

      // Reset any global state by reloading the app
      // This ensures all React contexts are reset
      setIsLoggingOut(false);
      
      // Show success notification using the correct method
      if (notificationActions) {
        notificationActions.showSuccess(
          'Logout Successful',
          'You have been successfully logged out',
          'Go to Login',
          '/admin/login'
        );
      }

    } catch (error) {
      console.error('[Logout] Error during logout:', error);
      setLogoutError('There was an error logging out. Please try again.');
      setIsLoggingOut(false);
      
      // Show error notification if available
      if (notificationActions) {
        notificationActions.showError(
          'Logout Error',
          'There was an error logging out. Your local session has been cleared for security.',
          'Try Again',
          '/logout'
        );
      }
      
      // Even if server logout fails, clear client state
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  };

  const handleBackToDashboard = () => {
    // Force a hard refresh to ensure all state is reset
    window.location.href = '/';
  };

  const handleGoToLogin = () => {
    // Redirect to login page with logout flag to ensure clean login
    window.location.href = '/admin/login?logout=true';
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Logging out...</h2>
          <p className="text-gray-500 mt-2">Please wait while we securely log you out</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
        {logoutError ? (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-gray-900">Logout Warning</h1>
            <p className="text-gray-600 mb-6">{logoutError}</p>
            <p className="text-sm text-gray-500 mb-6">Your local session has been cleared for security.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-gray-900">Successfully Logged Out</h1>
            <p className="text-gray-600 mb-6">You have been securely logged out of your account.</p>
            <p className="text-sm text-gray-500 mb-6">Thank you for using Digital Era</p>
          </>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleGoToLogin}
            className="w-full bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          Note: If you're automatically logged back in, please clear your browser cache and cookies.
        </p>
      </div>
    </div>
  );
}