import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';

interface AffiliateStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingCommissions: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  clickThroughRate: number;
  averageOrderValue: number;
}

interface Commission {
  id: string;
  referralName: string;
  orderValue: number;
  commissionAmount: number;
  commissionRate: number;
  status: 'pending' | 'approved' | 'paid';
  orderDate: string;
  payoutDate?: string;
}

interface MarketingMaterial {
  id: string;
  title: string;
  type: 'banner' | 'email' | 'social' | 'landing-page';
  description: string;
  dimensions?: string;
  previewUrl: string;
  downloadUrl: string;
}

const AffiliatePortal: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [affiliateId] = useState('DE-AFF-001257');
  const [referralLink] = useState('https://digitalera.com/ref/ashley-kemp-001257');
  
  const [stats, setStats] = useState<AffiliateStats>({
    totalEarnings: 4250.00,
    thisMonthEarnings: 1125.50,
    pendingCommissions: 675.25,
    totalReferrals: 47,
    activeReferrals: 23,
    conversionRate: 12.5,
    clickThroughRate: 8.3,
    averageOrderValue: 297
  });

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [marketingMaterials, setMarketingMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();

  // Mock commissions data
  const mockCommissions: Commission[] = [
    {
      id: '1',
      referralName: 'John Smith',
      orderValue: 497,
      commissionAmount: 149.10,
      commissionRate: 30,
      status: 'approved',
      orderDate: '2024-08-20',
      payoutDate: '2024-08-27'
    },
    {
      id: '2',
      referralName: 'Maria Garcia',
      orderValue: 297,
      commissionAmount: 89.10,
      commissionRate: 30,
      status: 'paid',
      orderDate: '2024-08-18',
      payoutDate: '2024-08-25'
    },
    {
      id: '3',
      referralName: 'David Johnson',
      orderValue: 497,
      commissionAmount: 149.10,
      commissionRate: 30,
      status: 'pending',
      orderDate: '2024-08-22'
    },
    {
      id: '4',
      referralName: 'Sarah Chen',
      orderValue: 197,
      commissionAmount: 59.10,
      commissionRate: 30,
      status: 'pending',
      orderDate: '2024-08-23'
    },
    {
      id: '5',
      referralName: 'Michael Brown',
      orderValue: 797,
      commissionAmount: 239.10,
      commissionRate: 30,
      status: 'approved',
      orderDate: '2024-08-19',
      payoutDate: '2024-08-26'
    }
  ];

  // Mock marketing materials
  const mockMaterials: MarketingMaterial[] = [
    {
      id: '1',
      title: 'Hero Banner - Digital Era Course',
      type: 'banner',
      description: 'High-converting banner for the main course offering',
      dimensions: '728x90',
      previewUrl: 'https://via.placeholder.com/728x90/3B82F6/FFFFFF?text=Digital+Era+Banner',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Social Media Post Template',
      type: 'social',
      description: 'Instagram/Facebook post template with course highlights',
      dimensions: '1080x1080',
      previewUrl: 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Social+Post',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Email Campaign Template',
      type: 'email',
      description: 'Professional email template for promoting courses',
      previewUrl: 'https://via.placeholder.com/600x800/10B981/FFFFFF?text=Email+Template',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Landing Page Template',
      type: 'landing-page',
      description: 'Complete landing page template with your affiliate link',
      previewUrl: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Landing+Page',
      downloadUrl: '#'
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setCommissions(mockCommissions);
      setMarketingMaterials(mockMaterials);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'banner': return 'fas fa-image';
      case 'email': return 'fas fa-envelope';
      case 'social': return 'fas fa-share-alt';
      case 'landing-page': return 'fas fa-desktop';
      default: return 'fas fa-file';
    }
  };

  // Check if user has access
  const hasAccess = currentRole === 'paid' || currentRole === 'downsell';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Affiliate Portal - Digital Era Learning Platform</title>
          <meta name="description" content="Earn money by referring others to Digital Era courses" />
        </Head>

        <AppLayout>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div 
              className="max-w-md w-full mx-4 p-8 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="mb-6">
                <i className="fas fa-lock text-6xl text-yellow-500 mb-4"></i>
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Premium Feature
                </h2>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Affiliate Portal is available for premium members only.
                </p>
              </div>
              <a
                href="/upgrade"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-on-primary)'
                }}
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Upgrade Now
              </a>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Affiliate Portal - Digital Era Learning Platform</title>
        <meta name="description" content="Earn money by referring others to Digital Era courses" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Affiliate Portal
            </h1>
            <p 
              className="text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Earn commissions by referring others to Digital Era courses and programs.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div 
              className="border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <nav className="flex space-x-8">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-line' },
                  { id: 'commissions', name: 'Commissions', icon: 'fas fa-dollar-sign' },
                  { id: 'marketing', name: 'Marketing Materials', icon: 'fas fa-palette' },
                  { id: 'settings', name: 'Settings', icon: 'fas fa-cog' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <i className={tab.icon}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Earnings"
                  value={`$${stats.totalEarnings.toLocaleString()}`}
                  subtitle="All time"
                  icon="fas fa-chart-line"
                  color="green"
                />
                <StatsCard
                  title="This Month"
                  value={`$${stats.thisMonthEarnings.toLocaleString()}`}
                  subtitle="August 2024"
                  icon="fas fa-calendar-alt"
                  color="blue"
                />
                <StatsCard
                  title="Pending"
                  value={`$${stats.pendingCommissions.toLocaleString()}`}
                  subtitle="Awaiting approval"
                  icon="fas fa-clock"
                  color="yellow"
                />
                <StatsCard
                  title="Total Referrals"
                  value={stats.totalReferrals.toString()}
                  subtitle={`${stats.activeReferrals} active`}
                  icon="fas fa-users"
                  color="purple"
                />
              </div>

              {/* Performance Metrics */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div 
                      className="text-sm font-medium mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Conversion Rate
                    </div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {stats.conversionRate}%
                    </div>
                  </div>
                  <div>
                    <div 
                      className="text-sm font-medium mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Click-Through Rate
                    </div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {stats.clickThroughRate}%
                    </div>
                  </div>
                  <div>
                    <div 
                      className="text-sm font-medium mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Avg. Order Value
                    </div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      ${stats.averageOrderValue}
                    </div>
                  </div>
                </div>
              </div>

              {/* Affiliate Link */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Your Affiliate Link
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Affiliate ID: {affiliateId}
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 px-4 py-2 border rounded-l-lg"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <button
                        onClick={() => copyToClipboard(referralLink)}
                        className="px-4 py-2 border-l-0 border rounded-r-lg font-medium transition-colors duration-200"
                        style={{ 
                          backgroundColor: 'var(--color-primary)',
                          borderColor: 'var(--color-primary)',
                          color: 'var(--text-on-primary)'
                        }}
                      >
                        <i className="fas fa-copy mr-2"></i>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <div 
              className="rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Commission History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr 
                      className="border-b"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <th 
                        className="text-left py-3 px-6 text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Referral
                      </th>
                      <th 
                        className="text-left py-3 px-6 text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Order Value
                      </th>
                      <th 
                        className="text-left py-3 px-6 text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Commission
                      </th>
                      <th 
                        className="text-left py-3 px-6 text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Status
                      </th>
                      <th 
                        className="text-left py-3 px-6 text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((commission) => (
                      <tr 
                        key={commission.id}
                        className="border-b hover:bg-gray-50"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <td 
                          className="py-4 px-6"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {commission.referralName}
                        </td>
                        <td 
                          className="py-4 px-6"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          ${commission.orderValue}
                        </td>
                        <td 
                          className="py-4 px-6 font-medium"
                          style={{ color: 'var(--color-success)' }}
                        >
                          ${commission.commissionAmount} ({commission.commissionRate}%)
                        </td>
                        <td className="py-4 px-6">
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}
                          >
                            {commission.status}
                          </span>
                        </td>
                        <td 
                          className="py-4 px-6 text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {new Date(commission.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Marketing Materials
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Download professional marketing materials to promote Digital Era courses with your affiliate link.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketingMaterials.map((material) => (
                  <div 
                    key={material.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <img 
                        src={material.previewUrl} 
                        alt={material.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 
                            className="font-semibold text-lg mb-1"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {material.title}
                          </h4>
                          {material.dimensions && (
                            <p 
                              className="text-sm"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {material.dimensions}
                            </p>
                          )}
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <i className={`${getMaterialIcon(material.type)} text-blue-600`}></i>
                        </div>
                      </div>
                      <p 
                        className="text-sm mb-4"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {material.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                          style={{ 
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--text-on-primary)'
                          }}
                        >
                          <i className="fas fa-download mr-2"></i>
                          Download
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg font-medium border transition-colors duration-200"
                          style={{ 
                            borderColor: 'var(--color-border)',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Affiliate Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Payment Information
                  </label>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Commissions are paid monthly via PayPal or bank transfer.
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg font-medium border transition-colors duration-200"
                    style={{ 
                      borderColor: 'var(--color-border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Update Payment Method
                  </button>
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Custom Link Slug
                  </label>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Customize your affiliate link for better branding.
                  </p>
                  <div className="flex max-w-md">
                    <span 
                      className="px-3 py-2 border border-r-0 rounded-l-lg text-sm"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      digitalera.com/ref/
                    </span>
                    <input
                      type="text"
                      value="ashley-kemp-001257"
                      className="flex-1 px-3 py-2 border rounded-r-lg"
                      style={{ 
                        borderColor: 'var(--color-border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <div 
      className="p-6 rounded-lg border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </h3>
        <div className={`text-${color}-500`}>
          <i className={icon}></i>
        </div>
      </div>
      <p 
        className="text-2xl font-bold mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </p>
      <p 
        className="text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default AffiliatePortal;