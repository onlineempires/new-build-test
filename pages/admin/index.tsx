import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to actual admin dashboard (use the backup file)
        console.log('Admin Index: Redirecting authenticated user to admin.backup');
        router.replace('/admin.backup').catch(() => {
          // Fallback to hard navigation if router fails
          console.log('Admin Index: Router redirect failed, using window.location');
          window.location.href = '/admin.backup';
        });
      } else {
        // Redirect to admin login page
        console.log('Admin Index: Redirecting unauthenticated user to login');
        router.replace('/admin/login').catch(() => {
          // Fallback to hard navigation if router fails
          console.log('Admin Index: Router redirect failed, using window.location');
          window.location.href = '/admin/login';
        });
      }
    }
  }, [router, isAuthenticated, isLoading]);

  // Add timeout fallback for redirects
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        console.log('Admin Index: Timeout redirect executing');
        if (isAuthenticated) {
          window.location.href = '/admin.backup';
        } else {
          window.location.href = '/admin/login';
        }
      }, 3000); // 3 second timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isLoading ? 'Checking authentication...' : 'Redirecting...'}
        </p>
        {!isLoading && (
          <button
            onClick={() => {
              if (isAuthenticated) {
                window.location.href = '/admin.backup';
              } else {
                window.location.href = '/admin/login';
              }
            }}
            className="mt-4 text-sm text-blue-600 hover:text-blue-500 underline"
          >
            Click here if redirect doesn't work
          </button>
        )}
      </div>
    </div>
  );
}