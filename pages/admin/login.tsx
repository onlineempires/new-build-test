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

  // Check for session expired or redirect parameters
  useEffect(() => {
    if (router.query.expired === 'true') {
      setShowSessionExpiredMessage(true);
    }
  }, [router.query]);

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirectTo = router.query.redirect as string || '/admin';
      router.replace(redirectTo);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSessionExpiredMessage(false);

    const success = await login(credentials.username, credentials.password);
    
    if (success) {
      const redirectTo = router.query.redirect as string || '/admin';
      router.push(redirectTo);
    }
    
    setIsSubmitting(false);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show redirecting message
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <i className="fas fa-check-circle text-4xl text-green-600 mb-4"></i>
          <p className="text-gray-600">Already authenticated. Redirecting...</p>
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
                    <i className="fas fa-clock mr-2"></i>
                    Your session has expired. Please login again.
                  </div>
                </div>
              )}
              
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
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
                    required
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter admin username"
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
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter admin password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shield-alt mr-2"></i>
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