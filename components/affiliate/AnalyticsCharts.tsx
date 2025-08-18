import React, { useState } from 'react';
import { 
  TrendingUp,
  PieChart,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  BarChart3
} from 'lucide-react';

interface ChartDataPoint {
  date: string;
  revenue: number;
  visits: number;
  conversions: number;
}

interface TrafficSource {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface DeviceBreakdown {
  device: string;
  visits: number;
  percentage: number;
  icon: React.ReactNode;
}

interface AnalyticsChartsProps {
  revenueData: ChartDataPoint[];
  trafficSources: TrafficSource[];
  deviceData: DeviceBreakdown[];
  timeData: 'hourly' | 'daily' | 'weekly';
  onTimeDataChange: (time: 'hourly' | 'daily' | 'weekly') => void;
  loading?: boolean;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  revenueData,
  trafficSources,
  deviceData,
  timeData,
  onTimeDataChange,
  loading = false
}) => {
  const [activeChart, setActiveChart] = useState<'revenue' | 'traffic' | 'devices'>('revenue');

  // Simple chart implementation (would use a proper chart library in production)
  const RevenueChart = () => {
    if (loading) {
      return (
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Loading chart...</div>
        </div>
      );
    }

    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
    const maxVisits = Math.max(...revenueData.map(d => d.visits));

    return (
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 600 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={40 + (i * 30)}
              x2="600"
              y2={40 + (i * 30)}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Revenue Area Chart */}
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area Path */}
          <path
            d={`M 0 ${180 - (revenueData[0]?.revenue || 0) / maxRevenue * 120} 
                ${revenueData.map((d, i) => 
                  `L ${(i / (revenueData.length - 1)) * 600} ${180 - (d.revenue / maxRevenue * 120)}`
                ).join(' ')} 
                L 600 180 L 0 180 Z`}
            fill="url(#revenueGradient)"
          />

          {/* Revenue Line */}
          <path
            d={`M 0 ${180 - (revenueData[0]?.revenue || 0) / maxRevenue * 120} 
                ${revenueData.map((d, i) => 
                  `L ${(i / (revenueData.length - 1)) * 600} ${180 - (d.revenue / maxRevenue * 120)}`
                ).join(' ')}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />

          {/* Data Points */}
          {revenueData.map((d, i) => (
            <circle
              key={i}
              cx={(i / (revenueData.length - 1)) * 600}
              cy={180 - (d.revenue / maxRevenue * 120)}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all cursor-pointer"
            />
          ))}
        </svg>

        {/* Hover tooltips would be implemented here */}
      </div>
    );
  };

  const TrafficSourcesChart = () => {
    if (loading) {
      return (
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Loading chart...</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-48 h-48">
          {/* Simple pie chart representation */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {trafficSources.map((source, index) => {
              const total = trafficSources.reduce((sum, s) => sum + s.value, 0);
              const percentage = (source.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = trafficSources.slice(0, index).reduce((sum, s) => 
                sum + ((s.value / total) * 360), 0
              );
              
              const radius = 80;
              const centerX = 100;
              const centerY = 100;
              
              const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const endX = centerX + radius * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const endY = centerY + radius * Math.sin(((startAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={source.name}
                  d={`M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                  fill={source.color}
                  className="hover:opacity-80 cursor-pointer transition-opacity"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="ml-8 space-y-3">
          {trafficSources.map((source) => (
            <div key={source.name} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: source.color }}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{source.name}</div>
                <div className="text-xs text-gray-500">{source.percentage}% • {source.value.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DeviceChart = () => {
    if (loading) {
      return (
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Loading chart...</div>
        </div>
      );
    }

    const maxVisits = Math.max(...deviceData.map(d => d.visits));

    return (
      <div className="h-64 p-6">
        <div className="space-y-6">
          {deviceData.map((device, index) => (
            <div key={device.device} className="flex items-center">
              <div className="flex items-center w-24">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  {device.icon}
                </div>
                <span className="text-sm font-medium text-gray-900">{device.device}</span>
              </div>
              
              <div className="flex-1 mx-6">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(device.visits / maxVisits) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-right w-20">
                <div className="text-sm font-semibold text-gray-900">
                  {device.visits.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{device.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const timeLabels = {
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-500">Performance over time</p>
            </div>
          </div>

          {/* Time Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['hourly', 'daily', 'weekly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => onTimeDataChange(period)}
                className={`
                  px-3 py-1 rounded-md text-xs font-medium transition-colors
                  ${timeData === period 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {timeLabels[period]}
              </button>
            ))}
          </div>
        </div>

        <RevenueChart />
      </div>

      {/* Traffic Sources Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <PieChart className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Traffic Sources</h3>
            <p className="text-sm text-gray-500">Where visitors come from</p>
          </div>
        </div>

        <TrafficSourcesChart />
      </div>

      {/* Device Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Monitor className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Device Breakdown</h3>
              <p className="text-sm text-gray-500">Visitor device preferences</p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Total: {deviceData.reduce((sum, d) => sum + d.visits, 0).toLocaleString()} visits
          </div>
        </div>

        <DeviceChart />
      </div>
    </div>
  );
};

export default AnalyticsCharts;