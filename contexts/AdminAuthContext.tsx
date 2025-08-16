import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AdminUser {
  id: string;
  username: string;
  loginTime: string;
  sessionExpiry: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  checkSession: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

// Demo credentials - in production, this would come from secure backend
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // In production: use hashed passwords and secure authentication
};

// Session duration: 8 hours
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
    
    // Set up periodic session validation
    const sessionInterval = setInterval(() => {
      if (isAuthenticated && !checkSession()) {
        handleSessionExpiry();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(sessionInterval);
  }, [isAuthenticated]);

  const checkExistingSession = () => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      const adminLoginTime = localStorage.getItem('adminLoginTime');
      const storedAdminUser = localStorage.getItem('adminUser');

      if (adminSession === 'true' && adminLoginTime && storedAdminUser) {
        const loginTime = new Date(adminLoginTime);
        const now = new Date();
        const timeDiff = now.getTime() - loginTime.getTime();

        if (timeDiff < SESSION_DURATION) {
          // Valid session
          const user = JSON.parse(storedAdminUser);
          setAdminUser(user);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        } else {
          // Session expired
          clearSession();
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      clearSession();
    }
    setIsLoading(false);
  };

  const checkSession = (): boolean => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      const adminLoginTime = localStorage.getItem('adminLoginTime');

      if (adminSession !== 'true' || !adminLoginTime) {
        return false;
      }

      const loginTime = new Date(adminLoginTime);
      const now = new Date();
      const timeDiff = now.getTime() - loginTime.getTime();

      return timeDiff < SESSION_DURATION;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would be a secure API call
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const loginTime = new Date();
        const sessionExpiry = new Date(loginTime.getTime() + SESSION_DURATION);
        
        const user: AdminUser = {
          id: 'admin_1',
          username: username,
          loginTime: loginTime.toISOString(),
          sessionExpiry: sessionExpiry.toISOString()
        };

        // Store session data
        localStorage.setItem('adminSession', 'true');
        localStorage.setItem('adminLoginTime', loginTime.toISOString());
        localStorage.setItem('adminUser', JSON.stringify(user));

        setAdminUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        return true;
      } else {
        setError('Invalid credentials. Use admin/admin123 for demo.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    clearSession();
    router.push('/admin/login');
  };

  const clearSession = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
    setError(null);
  };

  const handleSessionExpiry = () => {
    clearSession();
    setError('Session expired. Please login again.');
    if (router.pathname.startsWith('/admin') && router.pathname !== '/admin/login') {
      router.push('/admin/login?expired=true');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout,
        isLoading,
        error,
        checkSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Higher-order component for protecting admin routes
export function withAdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedAdminRoute(props: P) {
    const { isAuthenticated, isLoading } = useAdminAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        const currentPath = router.asPath;
        const redirectUrl = currentPath !== '/admin' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
        router.replace(`/admin/login${redirectUrl}`);
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-shield-alt text-4xl text-red-500 mb-4"></i>
            <p className="text-gray-600">Redirecting to admin login...</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}