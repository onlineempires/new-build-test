import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminRouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Route Guard component that protects admin routes
 * Can be used to wrap any admin component/page that needs protection
 */
export default function AdminRouteGuard({ children, fallback }: AdminRouteGuardProps) {
  const { isAuthenticated, isLoading, checkSession } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = router.asPath;
      const redirectUrl = currentPath !== '/admin' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
      router.replace(`/admin/login${redirectUrl}`);
    }
  }, [isAuthenticated, isLoading, router]);

  // Validate session periodically
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        if (!checkSession()) {
          const currentPath = router.asPath;
          const redirectUrl = currentPath !== '/admin' ? `?redirect=${encodeURIComponent(currentPath)}&expired=true` : '?expired=true';
          router.replace(`/admin/login${redirectUrl}`);
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, checkSession, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Access</h3>
          <p className="text-gray-600">Please wait while we verify your admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-red-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h3>
          <p className="text-gray-600 mb-4">You need admin privileges to access this area.</p>
          <div className="space-y-2">
            <i className="fas fa-spinner fa-spin text-blue-600"></i>
            <p className="text-sm text-gray-500">Redirecting to admin login...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}