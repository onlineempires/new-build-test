import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AccessDenied from '../components/AccessDenied';
import { hasAccess, getAccessRule } from '../utils/accessControl';

interface AffiliateStats {
  totalClicks: number;
  conversions: number;
  earnings: number;
  conversionRate: number;
  pendingCommissions: number;
}

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  clicks: number;
  conversions: number;
  earnings: number;
  status: 'active' | 'paused';
  created_at: string;
}

// Mock user data - in real app, get from auth context
const getMockUser = () => ({
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40',
  tier: 'monthly_99' as const // Change to test access: 'trial' | 'downsell_37' | 'monthly_99' | 'annual_799' | 'admin'
});

export default function AffiliatePage() {
  const [user] = useState(getMockUser());
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'analytics' | 'payouts'>('overview');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<AffiliateStats>({
    totalClicks: 2847,
    conversions: 89,
    earnings: 4293.50,
    conversionRate: 3.13,
    pendingCommissions: 847.20
  });

  const [affiliateLinks] = useState<AffiliateLink[]>([
    {
      id: '1',
      name: 'Main Course Promotion',
      url: 'https://digitalera.com/ref/user123',
      clicks: 1243,
      conversions: 34,
      earnings: 1547.80,
      status: 'active',
      created_at: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Expert Consultation',
      url: 'https://digitalera.com/experts/ref/user123',
      clicks: 892,
      conversions: 28,
      earnings: 1890.30,
      status: 'active',
      created_at: '2024-01-20'
    },
    {
      id: '3',
      name: 'Premium Library Access',
      url: 'https://digitalera.com/library/ref/user123',
      clicks: 712,
      conversions: 27,
      earnings: 855.40,
      status: 'active',
      created_at: '2024-02-01'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check access to affiliate page
  const pageAccess = hasAccess(user.tier, '/affiliate');
  const accessRule = getAccessRule('/affiliate');

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading Affiliate Portal...</span>
        </div>
      </AppLayout>
    );
  }

  // Show access denied if user doesn't have access
  if (!pageAccess) {
    return (
      <AccessDenied 
        requiredTier="Monthly ($99) or Annual ($799)"
        currentTier={user.tier}
        upgradeMessage={accessRule?.upgradeMessage}
      />
    );
  }

  const TabButton = ({ tabId, label, icon }: { tabId: string, label: string, icon: string }) => (
    <button
      onClick={() => setActiveTab(tabId as any)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === tabId 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <AppLayout user={user}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Portal</h1>
          <p className="text-gray-600">Manage your affiliate links and track your earnings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <TabButton tabId="overview" label="Overview" icon="📊" />
          <TabButton tabId="links" label="My Links" icon="🔗" />
          <TabButton tabId="analytics" label="Analytics" icon="📈" />
          <TabButton tabId="payouts" label="Payouts" icon="💰" />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Total Clicks</h3>
                <div className="text-2xl font-bold mt-2">{stats.totalClicks.toLocaleString()}</div>
                <p className="text-xs opacity-75 mt-1">+12% this month</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Conversions</h3>
                <div className="text-2xl font-bold mt-2">{stats.conversions}</div>
                <p className="text-xs opacity-75 mt-1">+8% this month</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Total Earnings</h3>
                <div className="text-2xl font-bold mt-2">${stats.earnings.toFixed(2)}</div>
                <p className="text-xs opacity-75 mt-1">+15% this month</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Conversion Rate</h3>
                <div className="text-2xl font-bold mt-2">{stats.conversionRate}%</div>
                <p className="text-xs opacity-75 mt-1">Above average</p>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Pending</h3>
                <div className="text-2xl font-bold mt-2">${stats.pendingCommissions.toFixed(2)}</div>
                <p className="text-xs opacity-75 mt-1">Next payout: 15th</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">🔗</span>
                  <div className="text-left">
                    <div className="font-semibold">Create New Link</div>
                    <div className="text-sm text-gray-600">Generate affiliate link</div>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <div className="font-semibold">View Analytics</div>
                    <div className="text-sm text-gray-600">Detailed performance</div>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-2xl">💰</span>
                  <div className="text-left">
                    <div className="font-semibold">Request Payout</div>
                    <div className="text-sm text-gray-600">Withdraw earnings</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Affiliate Links</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Create New Link
              </button>
            </div>

            <div className="grid gap-4">
              {affiliateLinks.map((link) => (
                <div key={link.id} className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{link.name}</h3>
                      <p className="text-gray-600 text-sm">{link.url}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      link.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{link.clicks}</div>
                      <div className="text-sm text-gray-500">Clicks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{link.conversions}</div>
                      <div className="text-sm text-gray-500">Conversions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">${link.earnings}</div>
                      <div className="text-sm text-gray-500">Earnings</div>
                    </div>
                    <div className="text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics Coming Soon</h3>
              <p className="text-gray-600">Advanced analytics and reporting features are in development.</p>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">Payout History</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Payout Management</h3>
              <p className="text-gray-600 mb-6">Request withdrawals and view payout history.</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Request Payout (${stats.pendingCommissions.toFixed(2)} available)
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}