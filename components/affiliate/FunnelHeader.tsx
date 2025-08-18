import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft,
  Edit,
  Copy,
  Archive,
  Share,
  Play,
  Pause,
  Settings,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Funnel } from '../../types/affiliate';

interface FunnelHeaderProps {
  funnel: Funnel;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (name: string, description: string) => void;
  onCancel?: () => void;
  onToggleStatus?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onShare?: () => void;
}

export const FunnelHeader: React.FC<FunnelHeaderProps> = ({
  funnel,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onToggleStatus,
  onDuplicate,
  onArchive,
  onShare
}) => {
  const [editName, setEditName] = useState(funnel.name);
  const [editDescription, setEditDescription] = useState(funnel.description || '');

  const getPerformanceBadge = (conversionRate: number) => {
    if (conversionRate >= 15) {
      return {
        label: 'High Converting',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <TrendingUp className="w-4 h-4" />
      };
    } else if (conversionRate >= 5) {
      return {
        label: 'Medium Converting',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Minus className="w-4 h-4" />
      };
    } else {
      return {
        label: 'Low Converting',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <TrendingDown className="w-4 h-4" />
      };
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    onSave?.(editName, editDescription);
  };

  const handleCancel = () => {
    setEditName(funnel.name);
    setEditDescription(funnel.description || '');
    onCancel?.();
  };

  const performance = getPerformanceBadge(funnel.conversionRate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 mb-6">
        <Link href="/affiliate" className="text-gray-500 hover:text-gray-700 transition-colors">
          <span>Affiliate Dashboard</span>
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/affiliate/funnels" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          <span>Funnels</span>
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {funnel.name}
        </span>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left Side - Funnel Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 w-full"
                placeholder="Funnel name..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="text-gray-600 bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full resize-none"
                placeholder="Add a description for this funnel..."
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div>
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {funnel.name}
                </h1>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mt-1"
                    title="Edit funnel"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>

              {funnel.description && (
                <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                  {funnel.description}
                </p>
              )}

              {/* Status and Performance Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
                  ${getStatusColor(funnel.status)}
                `}>
                  {funnel.status === 'active' ? (
                    <Play className="w-4 h-4 mr-1" />
                  ) : funnel.status === 'inactive' ? (
                    <Pause className="w-4 h-4 mr-1" />
                  ) : (
                    <Settings className="w-4 h-4 mr-1" />
                  )}
                  {funnel.status.charAt(0).toUpperCase() + funnel.status.slice(1)}
                </span>

                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${getTypeColor(funnel.type)}
                `}>
                  {funnel.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>

                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
                  ${performance.color}
                `}>
                  {performance.icon}
                  <span className="ml-1">{performance.label}</span>
                </span>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Created {formatDate(funnel.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <span>Last modified {formatDate(funnel.lastModified)}</span>
                </div>
                <div className="flex items-center">
                  <span>Commission: {funnel.affiliateCommission}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Action Buttons */}
        {!isEditing && (
          <div className="flex flex-wrap items-center gap-3">
            {onToggleStatus && (
              <button
                onClick={onToggleStatus}
                className={`
                  px-4 py-2 rounded-lg transition-colors flex items-center font-medium
                  ${funnel.status === 'active'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }
                `}
              >
                {funnel.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Funnel
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activate Funnel
                  </>
                )}
              </button>
            )}

            {onDuplicate && (
              <button
                onClick={onDuplicate}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                title="Duplicate funnel"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Duplicate</span>
              </button>
            )}

            {onShare && (
              <button
                onClick={onShare}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                title="Share funnel"
              >
                <Share className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            {funnel.landingPageUrl && (
              <Link href={funnel.landingPageUrl} target="_blank" rel="noopener noreferrer">
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">View Live</span>
                </button>
              </Link>
            )}

            {onArchive && (
              <button
                onClick={onArchive}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                title="Archive funnel"
              >
                <Archive className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Archive</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelHeader;