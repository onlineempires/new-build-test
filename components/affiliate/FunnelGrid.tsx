import React, { useState } from 'react';
import { Funnel } from '../../types/affiliate';
import FunnelCard from './FunnelCard';

interface FunnelGridProps {
  funnels: Funnel[];
  loading?: boolean;
  onToggleStatus?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onBulkSelect?: (selectedIds: string[]) => void;
  bulkSelectMode?: boolean;
  selectedIds?: string[];
}

export const FunnelGrid: React.FC<FunnelGridProps> = ({
  funnels,
  loading = false,
  onToggleStatus,
  onEdit,
  onDelete,
  onDuplicate,
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <FunnelCard key={index} funnel={{} as Funnel} loading={true} />
        ))}
      </div>
    );
  }

  if (funnels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No funnels found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or create a new funnel to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Selection Header */}
      {bulkSelectMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

      {/* Funnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {funnels.map((funnel) => (
          <div key={funnel.id} className="relative">
            {/* Bulk Select Checkbox */}
            {bulkSelectMode && (
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={localSelectedIds.includes(funnel.id)}
                  onChange={(e) => handleSelectFunnel(funnel.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white shadow-sm"
                />
              </div>
            )}
            
            {/* Funnel Card */}
            <FunnelCard
              funnel={funnel}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              showBulkSelect={bulkSelectMode}
              isSelected={localSelectedIds.includes(funnel.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelGrid;