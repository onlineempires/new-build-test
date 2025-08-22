import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLogin() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError } = useAdminAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSessionExpiredMessage, setShowSessionExpiredMessage] = useState(false);
  const [forceLogin, setForceLogin] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Check for session expired, logout, or redirect parameters
  useEffect(() => {
    const { expired, logout, forceLogin: force, security } = router.query;
    
    if (expired === 'true') {
      setShowSessionExpiredMessage(true);
    }
    
    // If coming from logout or with forceLogin flag, clear any residual session
    if (logout === 'true' || force === 'true') {
      setForceLogin(true);
      clearResidualSession();
    }
    
    // If security validation failed
    if (security === 'invalid') {
      clearResidualSession();
    }
  }, [router.query]);

  // Clear any residual session data
  const clearResidualSession = async () => {
    setIsClearing(true);
    
    if (typeof window !== 'undefined') {
      // Clear all authentication-related localStorage items
      const authKeys = [
        'adminSession',
        'adminLoginTime',
        'adminUser',
        'auth_token',
        'userRole',
        'userSession',
      ];
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear sessionStorage as well
      sessionStorage.removeItem('adminAuth');
      sessionStorage.removeItem('sessionValidated');
      
      // Clear cookies if accessible
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name && (name.includes('admin') || name.includes('session') || name.includes('auth'))) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });
    }
    
    // Small delay to ensure clearing completes
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsClearing(false);
  };

  // Redirect to admin dashboard if already authenticated
  // BUT skip if forceLogin is true or coming from logout
  useEffect(() => {
    const shouldRedirect = 
      isAuthenticated && 
      !authLoading && 
      !forceLogin && 
      !isClearing &&
      router.query.logout !== 'true' &&
      router.query.forceLogin !== 'true';
    
    if (shouldRedirect) {
      const redirectTo = router.query.redirect as string || '/admin';
      
      // Use replace to prevent back button issues
      router.replace(redirectTo);
    }
  }, [isAuthenticated, authLoading, forceLogin, isClearing, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSessionExpiredMessage(false);

    // Clear any existing session before attempting new login
    await clearResidualSession();

    // Attempt login
    const success = await login(credentials.username, credentials.password);
    
    if (success) {
      const redirectTo = router.query.redirect as string || '/admin';
      
      // Use window.location for a hard navigation to ensure clean state
      window.location.href = redirectTo;
    } else {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication or clearing
  if ((authLoading || isClearing) && !forceLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">
            {isClearing ? 'Clearing session...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // If already authenticated and not forcing login, show redirecting message
  // This should rarely be seen due to the effect above
  if (isAuthenticated && !forceLogin && router.query.logout !== 'true') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Already authenticated. Redirecting...</p>
          <button
            onClick={() => {
              setForceLogin(true);
              clearResidualSession();
            }}
            className="text-sm text-blue-600 hover:text-blue-500 underline"
          >
            Login as different user
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login - Digital Era</title>
        <meta name="description" content="Admin login for Digital Era platform" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-3 text-xl shadow-lg">
                ⚡
              </div>
              <span className="text-gray-900 font-bold text-2xl">DIGITAL ERA</span>
            </div>
          </div>
          
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your administrator account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
            <form className="space-y-6" onSubmit={handleLogin}>
              {showSessionExpiredMessage && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Your session has expired. Please login again.
                  </div>
                </div>
              )}

              {router.query.logout === 'true' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    You have been successfully logged out.
                  </div>
                </div>
              )}
              
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {authError}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter admin username"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter admin password"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isClearing}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Admin Sign In
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div><strong>Username:</strong> admin</div>
                <div><strong>Password:</strong> admin123</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <a
                  href="/"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ← Back to Member Area
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}