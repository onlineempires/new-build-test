import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  gradient: 'blue' | 'green' | 'purple' | 'orange';
  onClick?: () => void;
  loading?: boolean;
}

const gradientClasses = {
  blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
  green: 'bg-gradient-to-br from-green-500 to-green-600',
  purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
};

const iconBackgroundClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  gradient,
  onClick,
  loading = false
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-sm border border-gray-200 
        transition-all duration-300 hover:shadow-md hover:scale-105
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {/* Gradient Background */}
      <div className={`${gradientClasses[gradient]} p-6`}>
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/90 text-sm font-medium mb-1">{title}</p>
              <p className="text-white text-3xl font-bold">
                {formatValue(value)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${iconBackgroundClasses[gradient]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center">
              <div className={`
                flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${trend.isPositive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/20 text-white'
                }
              `}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                <span>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              </div>
              <span className="text-white/80 text-xs ml-2">
                vs {trend.period}
              </span>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
    </div>
  );
};

export default MetricCard;