import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Play, 
  Pause, 
  BarChart3,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Funnel } from '../../types/affiliate';

interface FunnelListProps {
  funnels: Funnel[];
  loading?: boolean;
  onToggleStatus?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onBulkSelect?: (selectedIds: string[]) => void;
  bulkSelectMode?: boolean;
  selectedIds?: string[];
}

export const FunnelList: React.FC<FunnelListProps> = ({
  funnels,
  loading = false,
  onToggleStatus,
  onEdit,
  onDelete,
  onDuplicate,
  onSort,
  sortColumn,
  sortDirection = 'desc',
  onBulkSelect,
  bulkSelectMode = false,
  selectedIds = []
}) => {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);

  const handleSelectFunnel = (funnelId: string, isSelected: boolean) => {
    let newSelectedIds: string[];
    
    if (isSelected) {
      newSelectedIds = [...localSelectedIds, funnelId];
    } else {
      newSelectedIds = localSelectedIds.filter(id => id !== funnelId);
    }
    
    setLocalSelectedIds(newSelectedIds);
    onBulkSelect?.(newSelectedIds);
  };

  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedIds = isSelected ? funnels.map(f => f.id) : [];
    setLocalSelectedIds(newSelectedIds);
    onBulkSelect?.(newSelectedIds);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSort?.(column)}
    >
      <div className="flex items-center justify-between">
        {children}
        {sortColumn === column && (
          <span className="ml-1">
            {sortDirection === 'asc' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (funnels.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No funnels found</h3>
        <p className="text-gray-600">
          Try adjusting your filters or create a new funnel to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Bulk Selection Header */}
      {bulkSelectMode && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={localSelectedIds.length === funnels.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {localSelectedIds.length === 0 
                  ? 'Select all funnels' 
                  : `${localSelectedIds.length} of ${funnels.length} funnels selected`
                }
              </span>
            </div>
            {localSelectedIds.length > 0 && (
              <button
                onClick={() => {
                  setLocalSelectedIds([]);
                  onBulkSelect?.([]);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {bulkSelectMode && <th className="px-6 py-3 w-12"></th>}
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="type">Type</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="visits">Visits</SortableHeader>
              <SortableHeader column="conversions">Conversions</SortableHeader>
              <SortableHeader column="conversionRate">Conv. Rate</SortableHeader>
              <SortableHeader column="revenue">Revenue</SortableHeader>
              <SortableHeader column="lastModified">Last Modified</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {funnels.map((funnel) => (
              <tr 
                key={funnel.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  localSelectedIds.includes(funnel.id) ? 'bg-blue-50' : ''
                }`}
              >
                {/* Bulk Select Checkbox */}
                {bulkSelectMode && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={localSelectedIds.includes(funnel.id)}
                      onChange={(e) => handleSelectFunnel(funnel.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate" title={funnel.name}>
                      {funnel.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {formatDate(funnel.createdAt)}
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${getTypeColor(funnel.type)}
                  `}>
                    {funnel.type.replace('-', ' ')}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${getStatusColor(funnel.status)}
                  `}>
                    {funnel.status}
                  </span>
                </td>

                {/* Visits */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {funnel.visits.toLocaleString()}
                </td>

                {/* Conversions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {funnel.conversions.toLocaleString()}
                </td>

                {/* Conversion Rate */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    text-sm font-medium
                    ${funnel.conversionRate >= 15 ? 'text-green-600' : 
                      funnel.conversionRate >= 5 ? 'text-yellow-600' : 'text-red-600'}
                  `}>
                    {funnel.conversionRate.toFixed(1)}%
                  </span>
                </td>

                {/* Revenue */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {formatCurrency(funnel.revenue)}
                </td>

                {/* Last Modified */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(funnel.lastModified)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Link href={`/affiliate/funnels/${funnel.id}`}>
                      <button 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(funnel.id)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Edit Funnel"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    <Link href={`/stats?section=affiliate&funnel=${funnel.id}`}>
                      <button 
                        className="text-gray-600 hover:text-green-600 transition-colors"
                        title="View Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </Link>

                    {onToggleStatus && (
                      <button
                        onClick={() => onToggleStatus(funnel.id)}
                        className="text-gray-600 hover:text-green-600 transition-colors"
                        title={funnel.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {funnel.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    {onDuplicate && (
                      <button
                        onClick={() => onDuplicate(funnel.id)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(funnel.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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

export default FunnelList;