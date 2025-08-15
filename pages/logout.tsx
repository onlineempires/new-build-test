import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear any auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    // In a real app, you might redirect to a login page
    // For now, just show a logout message
  }, []);

  const handleBackToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">You have been logged out</h1>
        <p className="text-gray-600 mb-6">Thank you for using Digital Era</p>
        <button
          onClick={handleBackToDashboard}
          className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}