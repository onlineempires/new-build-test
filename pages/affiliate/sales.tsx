import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';

const mockUser = {
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40'
};

export default function AffiliatesSalesPage() {
  const router = useRouter();
  const { funnelId } = router.query;

  return (
    <>
      <Head>
        <title>Affiliate Sales - Online Empires</title>
        <meta name="description" content="View and manage your affiliate sales" />
      </Head>

      <AppLayout
        user={mockUser}
        title="Affiliate Sales"
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Affiliate Sales</h2>
              {funnelId && (
                <p className="text-gray-600 mb-4">
                  Showing sales for funnel: <strong>{funnelId}</strong>
                </p>
              )}
              <p className="text-gray-600 mb-6">
                Track your affiliate commissions, sales performance, and payment history.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This page will display sales transactions, commission calculations, payment status, 
                customer details, and sales analytics for your affiliate marketing efforts.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => router.push('/affiliate/stats')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ← Back to Stats
                </button>
                <button 
                  onClick={() => router.push('/affiliate/leads')}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Leads
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}