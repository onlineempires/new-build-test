import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';

interface OverallStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalLeads: number;
  conversionRate: number;
  totalCoursesSold: number;
  totalAffiliateEarnings: number;
  totalUsers: number;
  activeUsers: number;
}

interface ChartData {
  period: string;
  revenue: number;
  leads: number;
  conversions: number;
  affiliateEarnings: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  conversionRate: number;
}

const Statistics: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<OverallStats>({
    totalRevenue: 125750.00,
    monthlyRevenue: 23450.50,
    totalLeads: 1247,
    conversionRate: 18.5,
    totalCoursesSold: 432,
    totalAffiliateEarnings: 15680.25,
    totalUsers: 2156,
    activeUsers: 847
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();

  // Mock chart data
  const mockChartData: ChartData[] = [
    { period: 'Week 1', revenue: 5250, leads: 85, conversions: 12, affiliateEarnings: 1875 },
    { period: 'Week 2', revenue: 6850, leads: 102, conversions: 18, affiliateEarnings: 2125 },
    { period: 'Week 3', revenue: 4320, leads: 76, conversions: 8, affiliateEarnings: 1650 },
    { period: 'Week 4', revenue: 7030, leads: 118, conversions: 22, affiliateEarnings: 2430 }
  ];

  // Mock top products
  const mockTopProducts: TopProduct[] = [
    { name: 'Digital Marketing Mastery', sales: 147, revenue: 73150, conversionRate: 21.5 },
    { name: 'Affiliate Marketing Pro', sales: 98, revenue: 29400, conversionRate: 18.2 },
    { name: 'Sales Funnel Optimization', sales: 76, revenue: 15200, conversionRate: 16.8 },
    { name: 'Lead Generation Secrets', sales: 54, revenue: 10800, conversionRate: 14.3 },
    { name: 'Social Media Authority', sales: 43, revenue: 8600, conversionRate: 12.7 }
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setChartData(mockChartData);
      setTopProducts(mockTopProducts);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Statistics - Digital Era Learning Platform</title>
          <meta name="description" content="View detailed business statistics and analytics" />
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
                  Advanced Statistics are available for premium members only.
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
        <title>Statistics - Digital Era Learning Platform</title>
        <meta name="description" content="View detailed business statistics and analytics" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Business Statistics
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Comprehensive analytics and insights into your business performance.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
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

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              subtitle="All time"
              icon="fas fa-dollar-sign"
              color="green"
              trend="+12.5%"
              trendUp={true}
            />
            <MetricCard
              title="Monthly Revenue"
              value={formatCurrency(stats.monthlyRevenue)}
              subtitle="This month"
              icon="fas fa-chart-line"
              color="blue"
              trend="+8.2%"
              trendUp={true}
            />
            <MetricCard
              title="Total Leads"
              value={stats.totalLeads.toLocaleString()}
              subtitle="All time"
              icon="fas fa-users"
              color="purple"
              trend="+15.7%"
              trendUp={true}
            />
            <MetricCard
              title="Conversion Rate"
              value={formatPercentage(stats.conversionRate)}
              subtitle="Lead to sale"
              icon="fas fa-percentage"
              color="orange"
              trend="-2.1%"
              trendUp={false}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Courses Sold"
              value={stats.totalCoursesSold.toString()}
              subtitle="All time"
              icon="fas fa-graduation-cap"
              color="indigo"
              trend="+18.3%"
              trendUp={true}
            />
            <MetricCard
              title="Affiliate Earnings"
              value={formatCurrency(stats.totalAffiliateEarnings)}
              subtitle="All time"
              icon="fas fa-handshake"
              color="teal"
              trend="+25.4%"
              trendUp={true}
            />
            <MetricCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              subtitle="Registered"
              icon="fas fa-user-plus"
              color="pink"
              trend="+7.8%"
              trendUp={true}
            />
            <MetricCard
              title="Active Users"
              value={stats.activeUsers.toString()}
              subtitle="Last 30 days"
              icon="fas fa-user-check"
              color="cyan"
              trend="+5.2%"
              trendUp={true}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
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
                Revenue Trend
              </h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t min-h-[20px] transition-all duration-500"
                      style={{ 
                        height: `${(data.revenue / Math.max(...chartData.map(d => d.revenue))) * 200}px` 
                      }}
                    ></div>
                    <span 
                      className="text-xs mt-2 text-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {data.period}
                    </span>
                    <span 
                      className="text-xs font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {formatCurrency(data.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads & Conversions Chart */}
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
                Leads & Conversions
              </h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                    {/* Leads Bar */}
                    <div 
                      className="w-1/2 bg-purple-400 rounded-t min-h-[10px] transition-all duration-500"
                      style={{ 
                        height: `${(data.leads / Math.max(...chartData.map(d => d.leads))) * 150}px` 
                      }}
                    ></div>
                    {/* Conversions Bar */}
                    <div 
                      className="w-1/2 bg-green-500 rounded-t min-h-[10px] transition-all duration-500"
                      style={{ 
                        height: `${(data.conversions / Math.max(...chartData.map(d => d.conversions))) * 150}px` 
                      }}
                    ></div>
                    <span 
                      className="text-xs mt-2 text-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {data.period}
                    </span>
                    <div className="text-center">
                      <div 
                        className="text-xs"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {data.leads}L
                      </div>
                      <div 
                        className="text-xs font-semibold"
                        style={{ color: 'var(--color-success)' }}
                      >
                        {data.conversions}C
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded mr-2"></div>
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Leads
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Conversions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
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
                Top Performing Products
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
                      Product Name
                    </th>
                    <th 
                      className="text-left py-3 px-6 text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Sales
                    </th>
                    <th 
                      className="text-left py-3 px-6 text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Revenue
                    </th>
                    <th 
                      className="text-left py-3 px-6 text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Conversion Rate
                    </th>
                    <th 
                      className="text-left py-3 px-6 text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr 
                      key={index}
                      className="border-b hover:bg-gray-50"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td 
                        className="py-4 px-6 font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              #{index + 1}
                            </span>
                          </div>
                          {product.name}
                        </div>
                      </td>
                      <td 
                        className="py-4 px-6"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {product.sales}
                      </td>
                      <td 
                        className="py-4 px-6 font-semibold"
                        style={{ color: 'var(--color-success)' }}
                      >
                        {formatCurrency(product.revenue)}
                      </td>
                      <td 
                        className="py-4 px-6"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {formatPercentage(product.conversionRate)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${product.conversionRate * 4}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend, 
  trendUp 
}) => {
  return (
    <div 
      className="p-6 rounded-lg border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-${color}-600 text-xl`}></i>
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trendUp ? 'text-green-600' : 'text-red-600'
          }`}>
            <i className={`fas fa-arrow-${trendUp ? 'up' : 'down'} mr-1`}></i>
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 
          className="text-sm font-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </h3>
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
    </div>
  );
};

export default Statistics;