import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Users, DollarSign, Eye, MousePointer, ShoppingCart, Download, Filter, ExternalLink, BarChart3, Activity } from 'lucide-react';
import client from '../../../lib/api/client';

// TypeScript interfaces
interface FunnelData {
  id: string;
  name: string;
  visits: number;
  uniqueVisits: number;
  signups: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  salesConversionRate: number;
  avgOrderValue: number;
  trend: 'up' | 'down';
  trendPercentage: number;
}

interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

interface RevenueData {
  date: string;
  revenue: number;
  visits: number;
}

interface StatsData {
  funnels: FunnelData[];
  trafficSources: TrafficSource[];
  revenueData: RevenueData[];
  summary: {
    totalRevenue: number;
    totalVisits: number;
    totalSignups: number;
    avgConversionRate: number;
  };
}

interface MetricCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: React.ComponentType<any>;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendValue, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

interface FunnelTableProps {
  funnels: FunnelData[];
  onFunnelClick: (funnelId: string) => void;
  onViewSales: (funnelId: string) => void;
  onViewLeads: (funnelId: string) => void;
  loading?: boolean;
}

const FunnelTable: React.FC<FunnelTableProps> = ({ funnels, onFunnelClick, onViewSales, onViewLeads, loading = false }) => {
  const [sortField, setSortField] = useState<keyof FunnelData>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedFunnels = useMemo(() => {
    if (!funnels.length) return [];
    
    return [...funnels].sort((a, b) => {
      const aVal = a[sortField] as number;
      const bVal = b[sortField] as number;
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [funnels, sortField, sortDirection]);

  const handleSort = (field: keyof FunnelData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Funnel Performance</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed metrics for each funnel</p>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading funnel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Funnel Performance</h3>
        <p className="text-sm text-gray-600 mt-1">Detailed metrics for each funnel</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Funnel Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('visits')}
              >
                Visits
                {sortField === 'visits' && (
                  <span className="ml-1">
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('uniqueVisits')}
              >
                Unique Visits
                {sortField === 'uniqueVisits' && (
                  <span className="ml-1">
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('signups')}
              >
                Signups
                {sortField === 'signups' && (
                  <span className="ml-1">
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('conversionRate')}
              >
                Conversion Rate
                {sortField === 'conversionRate' && (
                  <span className="ml-1">
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('revenue')}
              >
                Revenue
                {sortField === 'revenue' && (
                  <span className="ml-1">
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFunnels.map((funnel) => (
              <tr key={funnel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <button
                        onClick={() => onFunnelClick(funnel.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline max-w-xs truncate block"
                        title={funnel.name}
                      >
                        {funnel.name}
                      </button>
                      <div className="flex items-center mt-1">
                        {funnel.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${funnel.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {funnel.trendPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {funnel.visits.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {funnel.uniqueVisits.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {funnel.signups.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(funnel.conversionRate, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{funnel.conversionRate}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${funnel.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewSales(funnel.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Sales
                    </button>
                    <button
                      onClick={() => onViewLeads(funnel.id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Leads
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatsDashboard: React.FC = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('7days');
  const [selectedFunnel, setSelectedFunnel] = useState('all');
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stats data from API
  useEffect(() => {
    const loadStatsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await client.get(`/stats/affiliate?dateRange=${dateRange}&funnel=${selectedFunnel}`);
        setStatsData(response.data);
      } catch (err) {
        console.error('Failed to load stats data:', err);
        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStatsData();
  }, [dateRange, selectedFunnel]);

  const handleFunnelClick = (funnelId: string) => {
    router.push(`/affiliate/funnels/${funnelId}`);
  };

  const handleViewSales = (funnelId: string) => {
    router.push(`/affiliate/sales?funnelId=${funnelId}`);
  };

  const handleViewLeads = (funnelId: string) => {
    router.push(`/affiliate/leads?funnelId=${funnelId}`);
  };

  const handleExportReport = async () => {
    try {
      const response = await client.get(`/stats/export?dateRange=${dateRange}&format=csv&type=affiliate`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `funnel-stats-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export report:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading affiliate statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Statistics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No statistics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Funnel Analytics</h1>
            <p className="mt-2 text-gray-600">
              Track your funnel performance, conversion rates, and revenue metrics
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Date Range Selector */}
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {/* Export Button */}
            <button 
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {/* Mobile: Horizontal Scroll */}
      <div className="sm:hidden mb-8">
        <div className="flex gap-3 overflow-x-auto snap-x px-2 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="min-w-[220px] snap-start">
            <MetricCard
              title="Total Revenue"
              value={`$${statsData.summary.totalRevenue.toLocaleString()}`}
              trend="up"
              trendValue="12.5"
              icon={DollarSign}
              color="green"
            />
          </div>
          <div className="min-w-[220px] snap-start">
            <MetricCard
              title="Total Visits"
              value={statsData.summary.totalVisits.toLocaleString()}
              trend="up"
              trendValue="8.3"
              icon={Eye}
              color="blue"
            />
          </div>
          <div className="min-w-[220px] snap-start">
            <MetricCard
              title="Total Signups"
              value={statsData.summary.totalSignups.toLocaleString()}
              trend="up"
              trendValue="15.2"
              icon={Users}
              color="purple"
            />
          </div>
          <div className="min-w-[220px] snap-start">
            <MetricCard
              title="Avg Conversion Rate"
              value={`${statsData.summary.avgConversionRate.toFixed(1)}%`}
              trend="down"
              trendValue="2.1"
              icon={TrendingUp}
              color="orange"
            />
          </div>
        </div>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`$${statsData.summary.totalRevenue.toLocaleString()}`}
          trend="up"
          trendValue="12.5"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Total Visits"
          value={statsData.summary.totalVisits.toLocaleString()}
          trend="up"
          trendValue="8.3"
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Total Signups"
          value={statsData.summary.totalSignups.toLocaleString()}
          trend="up"
          trendValue="15.2"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Avg Conversion Rate"
          value={`${statsData.summary.avgConversionRate.toFixed(1)}%`}
          trend="down"
          trendValue="2.1"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Daily revenue over time</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={statsData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value: any, name: any) => [`$${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Visits']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              <p className="text-sm text-gray-600">Where your visitors come from</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsData.trafficSources}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {statsData.trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel Performance Table */}
      <FunnelTable
        funnels={statsData.funnels}
        onFunnelClick={handleFunnelClick}
        onViewSales={handleViewSales}
        onViewLeads={handleViewLeads}
        loading={loading}
      />

      {/* Smart Insights Panel */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Insights</h3>
            <div className="space-y-2">
              {statsData.funnels.length > 0 && (
                <>
                  <p className="text-sm text-gray-700">
                    • <strong>Best Performer:</strong> "{statsData.funnels.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.name}" has the highest conversion rate at {statsData.funnels.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.conversionRate}%
                  </p>
                  <p className="text-sm text-gray-700">
                    • <strong>Growth Opportunity:</strong> {statsData.funnels.filter(f => f.trend === 'up').length} funnels are trending upward - consider increasing traffic
                  </p>
                  <p className="text-sm text-gray-700">
                    • <strong>Attention Needed:</strong> {statsData.funnels.filter(f => f.trend === 'down').length} funnels need attention - investigate performance issues
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;