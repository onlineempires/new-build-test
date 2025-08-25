import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../components/layout/AppLayout';

export default function AffiliatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the affiliate index page
    router.push('/affiliate/');
  }, [router]);

  // Fallback content while redirecting
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold theme-text-primary mb-6">Affiliate Portal</h1>
          <p className="theme-text-secondary">Redirecting to affiliate dashboard...</p>
          
          {/* Fallback content if redirect fails */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold mb-4">Affiliate Marketing Hub</h2>
              <p className="text-lg opacity-90">
                Manage your affiliate links, track performance, and boost your earnings.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Link Management</h3>
                  <p className="text-sm opacity-90">Create and organize your affiliate links</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Performance Analytics</h3>
                  <p className="text-sm opacity-90">Track clicks, conversions, and earnings</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Commission Tracking</h3>
                  <p className="text-sm opacity-90">Monitor your revenue and payouts</p>
                </div>
              </div>
              
              <div className="mt-6">
                <a 
                  href="/affiliate/" 
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Affiliate Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}