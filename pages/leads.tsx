import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AccessDenied from '../components/AccessDenied';
import { hasAccess, getAccessRule } from '../utils/accessControl';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'cold';
  score: number;
  created_at: string;
  last_contact?: string;
  notes: string;
}

// Mock user data - in real app, get from auth context
const getMockUser = () => ({
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40',
  tier: 'monthly_99' as const // Change to test access: 'trial' | 'downsell_37' | 'monthly_99' | 'annual_799' | 'admin'
});

export default function LeadsPage() {
  const [user] = useState(getMockUser());
  const [activeView, setActiveView] = useState<'dashboard' | 'leads' | 'sales' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      source: 'Landing Page A',
      status: 'qualified',
      score: 85,
      created_at: '2024-08-20',
      last_contact: '2024-08-22',
      notes: 'Very interested in premium course'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      source: 'Facebook Ad',
      status: 'new',
      score: 72,
      created_at: '2024-08-23',
      notes: 'Downloaded free guide'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      phone: '+1 (555) 987-6543',
      source: 'Referral',
      status: 'converted',
      score: 95,
      created_at: '2024-08-15',
      last_contact: '2024-08-25',
      notes: 'Purchased annual subscription'
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john.smith@business.com',
      phone: '+1 (555) 456-7890',
      source: 'Google Ads',
      status: 'contacted',
      score: 78,
      created_at: '2024-08-21',
      last_contact: '2024-08-24',
      notes: 'Scheduled demo call for next week'
    },
    {
      id: '5',
      name: 'Lisa Wilson',
      email: 'lisa.w@email.com',
      source: 'Webinar',
      status: 'cold',
      score: 45,
      created_at: '2024-08-18',
      last_contact: '2024-08-19',
      notes: 'Not responsive to follow-ups'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check access to leads page
  const pageAccess = hasAccess(user.tier, '/leads');
  const accessRule = getAccessRule('/leads');

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading CRM System...</span>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-orange-100 text-orange-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'cold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const TabButton = ({ tabId, label, icon, count }: { tabId: string, label: string, icon: string, count?: number }) => (
    <button
      onClick={() => setActiveView(tabId as any)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeView === tabId 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      {count && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          activeView === tabId ? 'bg-blue-500' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const conversions = leads.filter(l => l.status === 'converted').length;
  const qualified = leads.filter(l => l.status === 'qualified').length;

  return (
    <AppLayout user={user}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
          <p className="text-gray-600">Manage leads, track sales, and grow your business</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <TabButton tabId="dashboard" label="Dashboard" icon="📊" />
          <TabButton tabId="leads" label="Leads" icon="👥" count={leads.length} />
          <TabButton tabId="sales" label="Sales" icon="💰" count={conversions} />
          <TabButton tabId="analytics" label="Analytics" icon="📈" />
        </div>

        {/* Dashboard Tab */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Total Leads</h3>
                <div className="text-3xl font-bold mt-2">{leads.length}</div>
                <p className="text-xs opacity-75 mt-1">+12% this week</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Qualified</h3>
                <div className="text-3xl font-bold mt-2">{qualified}</div>
                <p className="text-xs opacity-75 mt-1">{Math.round((qualified / leads.length) * 100)}% of total</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Conversions</h3>
                <div className="text-3xl font-bold mt-2">{conversions}</div>
                <p className="text-xs opacity-75 mt-1">{Math.round((conversions / leads.length) * 100)}% conversion rate</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90">Revenue</h3>
                <div className="text-3xl font-bold mt-2">$12.4K</div>
                <p className="text-xs opacity-75 mt-1">This month</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm"><strong>Emma Davis</strong> converted to Annual subscription</span>
                  <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">📧</span>
                  <span className="text-sm">Follow-up email sent to <strong>Sarah Johnson</strong></span>
                  <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600">👤</span>
                  <span className="text-sm">New lead: <strong>Mike Chen</strong> from Facebook Ad</span>
                  <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600">📞</span>
                  <span className="text-sm">Demo call scheduled with <strong>John Smith</strong></span>
                  <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeView === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Lead Management</h2>
              <div className="flex space-x-3">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Filter
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Lead
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Lead</th>
                      <th className="text-left p-4 font-semibold">Source</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Score</th>
                      <th className="text-left p-4 font-semibold">Last Contact</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-semibold">{lead.name}</div>
                            <div className="text-sm text-gray-600">{lead.email}</div>
                            {lead.phone && <div className="text-xs text-gray-500">{lead.phone}</div>}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {lead.source}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {lead.last_contact || 'Never'}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm" title="Email">📧</button>
                            <button className="text-green-600 hover:text-green-800 text-sm" title="Call">📱</button>
                            <button className="text-purple-600 hover:text-purple-800 text-sm" title="Notes">💬</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeView === 'sales' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sales Pipeline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4">New Leads</h3>
                <div className="space-y-2">
                  {leads.filter(l => l.status === 'new').map(lead => (
                    <div key={lead.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-600">{lead.source}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4">Contacted</h3>
                <div className="space-y-2">
                  {leads.filter(l => l.status === 'contacted').map(lead => (
                    <div key={lead.id} className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-600">{lead.source}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4">Qualified</h3>
                <div className="space-y-2">
                  {leads.filter(l => l.status === 'qualified').map(lead => (
                    <div key={lead.id} className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-600">Score: {lead.score}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4">Converted</h3>
                <div className="space-y-2">
                  {leads.filter(l => l.status === 'converted').map(lead => (
                    <div key={lead.id} className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-600">Closed deal</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeView === 'analytics' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">CRM Analytics</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 mb-6">Detailed insights into your lead generation and conversion performance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Lead Sources</h4>
                  <div className="text-sm text-gray-600">
                    <div>Facebook Ads: 40%</div>
                    <div>Google Ads: 25%</div>
                    <div>Landing Pages: 20%</div>
                    <div>Referrals: 15%</div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Conversion Funnel</h4>
                  <div className="text-sm text-gray-600">
                    <div>Leads → Contacted: 80%</div>
                    <div>Contacted → Qualified: 60%</div>
                    <div>Qualified → Converted: 30%</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Performance</h4>
                  <div className="text-sm text-gray-600">
                    <div>Avg. Lead Score: 72</div>
                    <div>Response Time: 2.5h</div>
                    <div>Close Rate: 24%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}