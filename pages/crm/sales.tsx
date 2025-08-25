import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../components/layout/AppLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserRole } from '../../contexts/UserRoleContext';
import { 
  Sale, 
  Lead,
  PaymentStatus,
  SortOptions
} from '../../types/crm';

// Sales Tracking Page - Revenue analysis and sales management
const SalesTracking: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedTimeframe, setSelectedTimeframe] = useState('this_month');
  
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'created_at',
    direction: 'desc'
  });

  const { currentTheme } = useTheme();
  const { currentRole } = useUserRole();
  const router = useRouter();

  // Mock sales data
  const mockSales: Sale[] = [
    {
      id: '1',
      lead_id: '1',
      customer_id: 'cust_001',
      product_id: 'prod_dm_001',
      product_name: 'Digital Marketing Mastery Course',
      product_sku: 'DMM-COURSE-001',
      amount: 497.00,
      currency: 'USD',
      commission_rate: 30,
      commission_earned: 149.10,
      payment_method: 'Credit Card',
      payment_processor: 'stripe',
      transaction_id: 'txn_1234567890',
      invoice_id: 'inv_001',
      payment_status: 'completed',
      sale_date: new Date('2024-08-24T16:30:00Z'),
      funnel_id: '1',
      funnel_name: 'Digital Marketing Mastery',
      affiliate_id: 'aff_001',
      affiliate_name: 'John Smith',
      utm_data: {
        source: 'google',
        medium: 'cpc',
        campaign: 'digital_marketing_q3',
        term: 'affiliate marketing course'
      },
      days_to_conversion: 4,
      touchpoints_to_conversion: 3,
      last_touchpoint: 'email',
      custom_fields: {}
    },
    {
      id: '2',
      lead_id: '2',
      product_id: 'prod_af_001',
      product_name: 'Affiliate Success Blueprint',
      amount: 297.00,
      currency: 'USD',
      commission_rate: 25,
      commission_earned: 74.25,
      payment_method: 'PayPal',
      payment_processor: 'paypal',
      transaction_id: 'pp_987654321',
      payment_status: 'completed',
      sale_date: new Date('2024-08-23T14:15:00Z'),
      funnel_id: '2',
      funnel_name: 'Affiliate Success Blueprint',
      utm_data: {
        source: 'facebook',
        medium: 'social',
        campaign: 'affiliate_promo'
      },
      days_to_conversion: 7,
      touchpoints_to_conversion: 5,
      last_touchpoint: 'phone',
      custom_fields: {}
    },
    {
      id: '3',
      lead_id: '3',
      product_id: 'prod_lg_001',
      product_name: 'Lead Generation Secrets',
      amount: 197.00,
      currency: 'USD',
      commission_rate: 35,
      commission_earned: 68.95,
      payment_method: 'Credit Card',
      payment_processor: 'stripe',
      transaction_id: 'txn_555666777',
      payment_status: 'pending',
      sale_date: new Date('2024-08-25T09:20:00Z'),
      funnel_id: '3',
      funnel_name: 'Lead Generation Secrets',
      utm_data: {
        source: 'email',
        medium: 'newsletter',
        campaign: 'august_promo'
      },
      days_to_conversion: 2,
      touchpoints_to_conversion: 2,
      last_touchpoint: 'email',
      custom_fields: {}
    },
    {
      id: '4',
      lead_id: '4',
      product_id: 'prod_sm_001',
      product_name: 'Social Media Authority',
      amount: 397.00,
      currency: 'USD',
      commission_rate: 30,
      commission_earned: 119.10,
      payment_method: 'Credit Card',
      payment_processor: 'stripe',
      transaction_id: 'txn_888999000',
      payment_status: 'refunded',
      sale_date: new Date('2024-08-22T11:45:00Z'),
      refund_date: new Date('2024-08-24T10:30:00Z'),
      refund_amount: 397.00,
      refund_reason: 'Customer requested refund within 48 hours',
      funnel_id: '4',
      funnel_name: 'Social Media Authority',
      utm_data: {
        source: 'instagram',
        medium: 'social',
        campaign: 'influencer_collab'
      },
      days_to_conversion: 14,
      touchpoints_to_conversion: 8,
      last_touchpoint: 'whatsapp',
      custom_fields: {}
    },
    {
      id: '5',
      lead_id: '5',
      product_id: 'prod_dm_001',
      product_name: 'Digital Marketing Mastery Course',
      amount: 497.00,
      currency: 'USD',
      commission_rate: 30,
      commission_earned: 149.10,
      payment_method: 'Credit Card',
      payment_processor: 'stripe',
      transaction_id: 'txn_111222333',
      payment_status: 'completed',
      sale_date: new Date('2024-08-21T13:20:00Z'),
      funnel_id: '1',
      funnel_name: 'Digital Marketing Mastery',
      utm_data: {
        source: 'linkedin',
        medium: 'social',
        campaign: 'professional_network'
      },
      days_to_conversion: 5,
      touchpoints_to_conversion: 4,
      last_touchpoint: 'linkedin',
      custom_fields: {}
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setSales(mockSales);
      setFilteredSales(mockSales);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = sales.filter(sale => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          sale.product_name.toLowerCase().includes(searchLower) ||
          sale.transaction_id?.toLowerCase().includes(searchLower) ||
          sale.funnel_name.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (sale.payment_status !== statusFilter) return false;
      }

      // Date range filter
      const now = new Date();
      const saleDate = new Date(sale.sale_date);
      
      switch (dateRange) {
        case '7d':
          if (now.getTime() - saleDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case '30d':
          if (now.getTime() - saleDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        case '90d':
          if (now.getTime() - saleDate.getTime() > 90 * 24 * 60 * 60 * 1000) return false;
          break;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case 'created_at':
          aValue = new Date(a.sale_date).getTime();
          bValue = new Date(b.sale_date).getTime();
          break;
        default:
          return 0;
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSales(filtered);
  }, [sales, searchTerm, statusFilter, dateRange, sortOptions]);

  if (!isMounted) {
    return null;
  }

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Sales Tracking - CRM System</title>
        </Head>
        <AppLayout>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div 
              className="max-w-md w-full mx-4 p-8 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <i className="fas fa-lock text-6xl text-yellow-500 mb-4"></i>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Premium Feature
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Sales tracking is available for premium members only.
              </p>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  // Calculate summary stats
  const completedSales = filteredSales.filter(s => s.payment_status === 'completed');
  const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalCommissions = completedSales.reduce((sum, sale) => sum + sale.commission_earned, 0);
  const averageOrderValue = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;
  const averageConversionTime = completedSales.length > 0 
    ? completedSales.reduce((sum, sale) => sum + sale.days_to_conversion, 0) / completedSales.length 
    : 0;

  return (
    <>
      <Head>
        <title>Sales Tracking - CRM System</title>
        <meta name="description" content="Track sales performance, revenue, and commissions" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Sales Tracking
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Monitor sales performance, revenue trends, and commission earnings.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--text-on-primary)'
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    +12.5%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    vs last period
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Total Revenue
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {completedSales.length} completed sales
                </p>
              </div>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-hand-holding-usd text-blue-600 text-xl"></i>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    +8.3%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    vs last period
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Commission Earned
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(totalCommissions)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {((totalCommissions / totalRevenue) * 100).toFixed(1)}% avg rate
                </p>
              </div>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-bar text-purple-600 text-xl"></i>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-600">
                    +5.2%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    vs last period
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Average Order Value
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(averageOrderValue)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  per transaction
                </p>
              </div>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-orange-600 text-xl"></i>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-600">
                    -2.1 days
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    improvement
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Avg. Conversion Time
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {averageConversionTime.toFixed(1)} days
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  lead to sale
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div 
            className="mb-6 p-6 rounded-lg border"
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                  <option value="disputed">Disputed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                  onChange={(e) => setSortOptions({...sortOptions, direction: e.target.value as 'asc' | 'desc'})}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div 
            className="rounded-lg border overflow-hidden"
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--color-border)'
            }}
          >
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p style={{ color: 'var(--text-secondary)' }}>Loading sales data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr 
                      className="border-b"
                      style={{ 
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--bg-secondary)'
                      }}
                    >
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Commission
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Conversion
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr 
                        key={sale.id}
                        className="border-b hover:bg-gray-50"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {sale.product_name}
                            </h4>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {sale.funnel_name}
                            </p>
                            {sale.transaction_id && (
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {sale.transaction_id}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(sale.amount, sale.currency)}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {sale.payment_method}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold" style={{ color: 'var(--color-success)' }}>
                            {formatCurrency(sale.commission_earned)}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {sale.commission_rate}% rate
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.payment_status)}`}>
                            {sale.payment_status}
                          </span>
                          {sale.payment_status === 'refunded' && sale.refund_date && (
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                              Refunded {formatTimeAgo(sale.refund_date)}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div style={{ color: 'var(--text-primary)' }}>
                            {sale.sale_date.toLocaleDateString()}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {formatTimeAgo(sale.sale_date)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div style={{ color: 'var(--text-primary)' }}>
                              {sale.days_to_conversion} days
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>
                              {sale.touchpoints_to_conversion} touchpoints
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                              title="View Details"
                            >
                              <i className="fas fa-eye text-blue-600"></i>
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
                              title="View Lead"
                              onClick={() => router.push(`/crm/lead/${sale.lead_id}`)}
                            >
                              <i className="fas fa-user text-green-600"></i>
                            </button>
                            {sale.invoice_id && (
                              <button
                                className="p-2 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                                title="Download Invoice"
                              >
                                <i className="fas fa-download text-purple-600"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex justify-between items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>
              Showing {filteredSales.length} of {sales.length} sales
            </span>
            <div className="flex items-center gap-4">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Total: {formatCurrency(totalRevenue)}
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border" style={{ borderColor: 'var(--color-border)' }}>
                  Previous
                </button>
                <button className="px-3 py-1 rounded border" style={{ borderColor: 'var(--color-border)' }}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default SalesTracking;