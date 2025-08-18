import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';

const mockUser = {
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40'
};

export default function AffiliateLeadsPage() {
  const router = useRouter();
  const { funnelId } = router.query;

  return (
    <>
      <Head>
        <title>Affiliate Leads - Online Empires</title>
        <meta name="description" content="View and manage your affiliate leads" />
      </Head>

      <AppLayout
        user={mockUser}
        title="Affiliate Leads"
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-purple-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Affiliate Leads</h2>
              {funnelId && (
                <p className="text-gray-600 mb-4">
                  Showing leads for funnel: <strong>{funnelId}</strong>
                </p>
              )}
              <p className="text-gray-600 mb-6">
                Manage your lead generation, track signups, and nurture prospects.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This page will show lead capture data, email signups, contact information, 
                lead scoring, conversion tracking, and lead nurturing campaigns for your funnels.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => router.push('/affiliate/stats')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ← Back to Stats
                </button>
                <button 
                  onClick={() => router.push('/affiliate/sales')}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}