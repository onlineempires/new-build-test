import React, { useState } from 'react';
import { 
  Eye,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Target,
  TrendingDown,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface MetricData {
  value: number;
  previousValue: number;
  format: 'number' | 'currency' | 'percentage';
}

interface MetricsGridProps {
  totalVisits: MetricData;
  uniqueVisitors: MetricData;
  conversions: MetricData;
  revenue: MetricData;
  conversionRate: MetricData;
  avgOrderValue: MetricData;
  period: '7d' | '30d' | '90d';
  onPeriodChange: (period: '7d' | '30d' | '90d') => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  totalVisits,
  uniqueVisitors,
  conversions,
  revenue,
  conversionRate,
  avgOrderValue,
  period,
  onPeriodChange,
  onRefresh,
  loading = false
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const formatValue = (value: number, format: 'number' | 'currency' | 'percentage'): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const calculateChange = (current: number, previous: number): { percentage: number; isPositive: boolean } => {
    if (previous === 0) return { percentage: 0, isPositive: true };
    const percentage = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(percentage),
      isPositive: percentage >= 0
    };
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const MetricCard = ({ 
    title, 
    data, 
    icon, 
    color 
  }: { 
    title: string; 
    data: MetricData; 
    icon: React.ReactNode; 
    color: string;
  }) => {
    const change = calculateChange(data.value, data.previousValue);
    
    if (loading) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatValue(data.value, data.format)}
          </span>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center">
          <div className={`
            flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${change.isPositive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {change.isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>
              {change.isPositive ? '+' : '-'}{change.percentage.toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            vs previous {period}
          </span>
        </div>
      </div>
    );
  };

  const periodLabels = {
    '7d': '7 Days',
    '30d': '30 Days',
    '90d': '90 Days'
  };

  return (
    <div className="mb-8">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
        
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-colors
                  ${period === p 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh metrics"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Last Updated */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Updated 2m ago</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Visits"
          data={totalVisits}
          icon={<Eye className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
        />

        <MetricCard
          title="Unique Visitors"
          data={uniqueVisitors}
          icon={<Users className="w-5 h-5" />}
          color="bg-green-100 text-green-600"
        />

        <MetricCard
          title="Conversions"
          data={conversions}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="bg-purple-100 text-purple-600"
        />

        <MetricCard
          title="Revenue"
          data={revenue}
          icon={<DollarSign className="w-5 h-5" />}
          color="bg-emerald-100 text-emerald-600"
        />

        <MetricCard
          title="Conversion Rate"
          data={conversionRate}
          icon={<Target className="w-5 h-5" />}
          color="bg-orange-100 text-orange-600"
        />

        <MetricCard
          title="Avg Order Value"
          data={avgOrderValue}
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-pink-100 text-pink-600"
        />
      </div>
    </div>
  );
};

export default MetricsGrid;