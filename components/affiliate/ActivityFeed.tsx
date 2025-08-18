import React from 'react';
import { 
  User, 
  DollarSign, 
  Eye, 
  UserPlus, 
  TrendingUp, 
  Settings,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { RecentActivity } from '../../types/affiliate';

interface ActivityFeedProps {
  activities: RecentActivity[];
  loading?: boolean;
  maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  maxItems = 10
}) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'conversion':
        return ShoppingCart;
      case 'funnel_created':
        return Settings;
      case 'affiliate_joined':
        return UserPlus;
      case 'commission_paid':
        return DollarSign;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'conversion':
        return 'text-green-600 bg-green-100';
      case 'funnel_created':
        return 'text-blue-600 bg-blue-100';
      case 'affiliate_joined':
        return 'text-purple-600 bg-purple-100';
      case 'commission_paid':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString();
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClasses = getActivityColor(activity.type);
            
            return (
              <div 
                key={activity.id} 
                className={`
                  flex items-start space-x-4 p-3 rounded-lg transition-colors hover:bg-gray-50
                  ${index !== displayActivities.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                {/* Activity Icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${colorClasses}
                `}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {activity.description}
                      </p>
                      {activity.amount && (
                        <p className="text-sm font-semibold text-green-600">
                          {formatAmount(activity.amount)}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activities.length > maxItems && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View All Activity ({activities.length - maxItems} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;