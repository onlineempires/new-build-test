import React from 'react';
import Link from 'next/link';
import { 
  ExternalLink, 
  Eye, 
  Users, 
  TrendingUp, 
  DollarSign, 
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import { Funnel } from '../../types/affiliate';

interface FunnelCardProps {
  funnel: Funnel;
  onToggleStatus?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  loading?: boolean;
  showBulkSelect?: boolean;
  isSelected?: boolean;
}

export const FunnelCard: React.FC<FunnelCardProps> = ({
  funnel,
  onToggleStatus,
  onEdit,
  onDelete,
  onDuplicate,
  loading = false,
  showBulkSelect = false,
  isSelected = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lead-magnet':
        return 'bg-blue-100 text-blue-800';
      case 'sales-page':
        return 'bg-purple-100 text-purple-800';
      case 'webinar':
        return 'bg-orange-100 text-orange-800';
      case 'course-promo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {funnel.name}
            </h3>
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
              ${getStatusColor(funnel.status)}
            `}>
              {funnel.status}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${getTypeColor(funnel.type)}
            `}>
              {funnel.type.replace('-', ' ')}
            </span>
            <span className="text-gray-500 text-sm">
              Created {new Date(funnel.createdAt).toLocaleDateString()}
            </span>
          </div>

          {funnel.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {funnel.description}
            </p>
          )}
        </div>

        {/* Action Menu */}
        <div className="flex items-center gap-1 ml-4">
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(funnel.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={funnel.status === 'active' ? 'Pause funnel' : 'Activate funnel'}
            >
              {funnel.status === 'active' ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(funnel.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit funnel"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={() => onDuplicate(funnel.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Duplicate funnel"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(funnel.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Delete funnel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Link href={`/affiliate/funnels/${funnel.id}`}>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Eye className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500">Visits</span>
          </div>
          <span className="font-semibold text-gray-900">
            {funnel.visits.toLocaleString()}
          </span>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500">Conversions</span>
          </div>
          <span className="font-semibold text-gray-900">
            {funnel.conversions.toLocaleString()}
          </span>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500">Conv. Rate</span>
          </div>
          <span className="font-semibold text-gray-900">
            {funnel.conversionRate.toFixed(1)}%
          </span>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <span className="font-semibold text-gray-900">
            {formatCurrency(funnel.revenue)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Commission: {funnel.affiliateCommission}%
        </div>
        <div className="text-sm text-gray-500">
          Updated {new Date(funnel.lastModified).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default FunnelCard;