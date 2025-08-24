import { useState } from 'react';
import { LibraryItem } from '../../types/library';
import LibraryCard from './LibraryCard';

interface LibraryGridProps {
  items: LibraryItem[];
  isLoading?: boolean;
  onItemClick: (item: LibraryItem) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const SkeletonCard = () => (
  <div className="bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-slate-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-slate-700 rounded w-16"></div>
        <div className="h-4 bg-slate-700 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export default function LibraryGrid({ 
  items, 
  isLoading = false, 
  onItemClick,
  onLoadMore,
  hasMore = false
}: LibraryGridProps) {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (loadingMore || !onLoadMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  };

  // Show skeleton cards when initially loading
  if (isLoading && items.length === 0) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-search text-slate-400 text-xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No results match your filters
          </h3>
          <p className="text-slate-400 mb-6">
            Try adjusting your search terms or filters to find more content.
          </p>
          <button
            onClick={() => {
              // This would trigger reset filters
              window.dispatchEvent(new CustomEvent('reset-library-filters'));
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <i className="fas fa-undo mr-2"></i>
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Results Grid - Enhanced spacing for expanded cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 max-w-screen-2xl mx-auto px-4 sm:px-6" style={{ marginBottom: '200px' }}>
        {items.map((item, index) => (
          <div key={item.id} className="relative" style={{ marginBottom: index >= items.length - 4 ? '150px' : '0px' }}>
            <LibraryCard
              item={item}
              onClick={onItemClick}
            />
          </div>
        ))}
        
        {/* Show loading skeleton cards while loading more */}
        {loadingMore && Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={`loading-${index}`} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && !loadingMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-plus mr-2"></i>
            Load More
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center items-center mt-12">
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}

      {/* No More Items Message */}
      {!hasMore && items.length > 0 && !isLoading && (
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            You've reached the end of the library
          </p>
        </div>
      )}
    </div>
  );
}