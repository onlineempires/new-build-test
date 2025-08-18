import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../../components/layout/AppLayout';

const mockUser = {
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40'
};

export default function FunnelDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Funnel Details - Online Empires</title>
        <meta name="description" content="Detailed funnel analytics and management" />
      </Head>

      <AppLayout
        user={mockUser}
        title="Funnel Details"
      >
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-blue-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Funnel Details</h2>
              <p className="text-gray-600 mb-6">
                Viewing details for funnel: <strong>{id}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This page will show detailed analytics, conversion funnels, step-by-step performance, and management tools for the selected funnel.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => router.push('/affiliate/stats')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ← Back to Stats
                </button>
                <button 
                  onClick={() => router.push('/affiliate/stats')}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View All Funnels
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}