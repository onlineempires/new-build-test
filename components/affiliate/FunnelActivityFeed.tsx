import React, { useState } from 'react';
import { 
  Activity,
  Eye,
  ShoppingCart,
  UserPlus,
  Share,
  Filter,
  Download,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'visit' | 'conversion' | 'share' | 'affiliate_signup';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    amount?: number;
    source?: string;
    location?: string;
    device?: string;
  };
}

interface FunnelActivityFeedProps {
  activities: ActivityItem[];
  onExport?: () => void;
  loading?: boolean;
}

export const FunnelActivityFeed: React.FC<FunnelActivityFeedProps> = ({
  activities,
  onExport,
  loading = false
}) => {
  const [filter, setFilter] = useState<'all' | 'conversions' | 'visits' | 'affiliates'>('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Eye className="w-4 h-4" />;
      case 'conversion':
        return <ShoppingCart className="w-4 h-4" />;
      case 'share':
        return <Share className="w-4 h-4" />;
      case 'affiliate_signup':
        return <UserPlus className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'text-blue-600 bg-blue-100';
      case 'conversion':
        return 'text-green-600 bg-green-100';
      case 'share':
        return 'text-purple-600 bg-purple-100';
      case 'affiliate_signup':
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
    return `${diffInDays}d ago`;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'conversions') return activity.type === 'conversion';
    if (filter === 'visits') return activity.type === 'visit';
    if (filter === 'affiliates') return activity.type === 'affiliate_signup';
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['all', 'conversions', 'visits', 'affiliates'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-3 py-1 rounded-md text-xs font-medium transition-colors
                  ${filter === f 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {onExport && (
            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export activity log"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`
              flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors
              ${index !== filteredActivities.length - 1 ? 'border-b border-gray-100' : ''}
            `}
          >
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${getActivityColor(activity.type)}
            `}>
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.description}
                  </p>
                  
                  {activity.metadata && (
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {activity.metadata.amount && (
                        <span className="font-medium text-green-600">
                          ${activity.metadata.amount.toFixed(2)}
                        </span>
                      )}
                      {activity.metadata.source && (
                        <span>from {activity.metadata.source}</span>
                      )}
                      {activity.metadata.location && (
                        <span>{activity.metadata.location}</span>
                      )}
                      {activity.metadata.device && (
                        <span>{activity.metadata.device}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {filter === 'all' ? '' : filter} activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelActivityFeed;