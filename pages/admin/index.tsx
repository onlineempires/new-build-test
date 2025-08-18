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
        router.replace('/admin.backup');
      } else {
        // Redirect to admin login page
        router.replace('/admin/login');
      }
    }
  }, [router, isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isLoading ? 'Checking authentication...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
}