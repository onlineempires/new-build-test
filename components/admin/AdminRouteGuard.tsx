import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminRouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string;
}

/**
 * Enhanced Route Guard component with server-side session validation
 * Protects admin routes and logs access attempts for audit purposes
 */
export default function AdminRouteGuard({ 
  children, 
  fallback,
  requiredRole = 'admin' 
}: AdminRouteGuardProps) {
  const { isAuthenticated, isLoading, checkSession, user } = useAdminAuth();
  const router = useRouter();
  const [sessionValidated, setSessionValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Server-side session validation
  useEffect(() => {
    const validateServerSession = async () => {
      try {
        // Skip validation if we're on the logout page
        if (router.pathname === '/logout' || router.pathname === '/admin/login') {
          setSessionValidated(false);
          setIsValidating(false);
          return;
        }

        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Log failed access attempt
          console.log('[Security] Invalid session detected, redirecting to login');
          
          // Clear any stale local storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('adminSession');
            localStorage.removeItem('adminLoginTime');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('auth_token');
          }
          
          const currentPath = router.asPath;
          const redirectUrl = currentPath !== '/admin' 
            ? `?redirect=${encodeURIComponent(currentPath)}&security=invalid` 
            : '?security=invalid';
          router.replace(`/admin/login${redirectUrl}`);
          return;
        }

        const data = await response.json();
        
        // Additional role check
        if (requiredRole && data.user?.role !== requiredRole && !data.user?.isAdmin) {
          console.log('[Security] Insufficient permissions for route');
          router.replace('/admin/unauthorized');
          return;
        }

        setSessionValidated(true);
        
        // Log successful access for audit
        console.log(`[Audit] Admin access granted: ${router.asPath}`);
      } catch (error) {
        console.error('[Security] Session validation error:', error);
        
        // Clear local storage on validation error
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminSession');
          localStorage.removeItem('adminLoginTime');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('auth_token');
        }
        
        router.replace('/admin/login?error=validation_failed');
      } finally {
        setIsValidating(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      validateServerSession();
    } else if (!isAuthenticated && !isLoading) {
      setIsValidating(false);
    }
  }, [isAuthenticated, isLoading, router, requiredRole]);

  // Client-side session check
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isValidating) {
      const currentPath = router.asPath;
      
      // Don't redirect if we're already on login or logout pages
      if (currentPath === '/admin/login' || currentPath === '/logout') {
        return;
      }
      
      const redirectUrl = currentPath !== '/admin' 
        ? `?redirect=${encodeURIComponent(currentPath)}` 
        : '';
      router.replace(`/admin/login${redirectUrl}`);
    }
  }, [isAuthenticated, isLoading, isValidating, router]);

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (isAuthenticated && sessionValidated) {
      const interval = setInterval(async () => {
        const isValid = checkSession();
        
        if (!isValid) {
          // Log session expiry
          console.log('[Security] Session expired, redirecting to login');
          
          // Clear all local storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('adminSession');
            localStorage.removeItem('adminLoginTime');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('auth_token');
          }
          
          const currentPath = router.asPath;
          const redirectUrl = currentPath !== '/admin' 
            ? `?redirect=${encodeURIComponent(currentPath)}&expired=true` 
            : '?expired=true';
          router.replace(`/admin/login${redirectUrl}`);
          return;
        }

        // Refresh server session
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });
          
          if (!response.ok) {
            console.log('[Security] Failed to refresh session');
            
            // Clear local storage on refresh failure
            if (typeof window !== 'undefined') {
              localStorage.removeItem('adminSession');
              localStorage.removeItem('adminLoginTime');
              localStorage.removeItem('adminUser');
              localStorage.removeItem('auth_token');
            }
            
            router.replace('/admin/login?expired=true');
          }
        } catch (error) {
          console.error('[Security] Session refresh error:', error);
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, sessionValidated, checkSession, router]);

  // Loading state
  if (isLoading || isValidating || (isAuthenticated && !sessionValidated)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Access</h3>
          <p className="text-gray-600">Validating your admin credentials...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !sessionValidated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h3>
          <p className="text-gray-600 mb-4">You need admin privileges to access this area.</p>
          <div className="space-y-2">
            <svg className="w-5 h-5 text-blue-600 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-500">Redirecting to admin login...</p>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}