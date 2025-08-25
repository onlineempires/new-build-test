import { useState } from 'react';
import { LibraryItem } from '../../types/library';
import { LibraryCourse } from '../../lib/courseMapping';
import { User } from '../../utils/accessControl';
import LibraryCard from './LibraryCard';
import AdvancedLibraryCard from './AdvancedLibraryCard';

interface LibraryGridProps {
  items: LibraryItem[];
  mappedCourses?: (LibraryCourse & { id: string })[];
  user?: User | null;
  isLoading?: boolean;
  onItemClick: (item: LibraryItem) => void;
  onAdvancedCourseClick?: (courseSlug: string, lessonSlug: string, courseId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  showMappedCourses?: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export default function LibraryGrid({ 
  items, 
  mappedCourses = [],
  user = null,
  isLoading = false, 
  onItemClick,
  onAdvancedCourseClick,
  onLoadMore,
  hasMore = false,
  showMappedCourses = false
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
  if (!isLoading && items.length === 0 && (!showMappedCourses || mappedCourses.length === 0)) {
    return (
      <div className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-search text-gray-400 text-xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No results match your filters
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find more content.
          </p>
          <button
            onClick={() => {
              // This would trigger reset filters
              window.dispatchEvent(new CustomEvent('reset-library-filters'));
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            <i className="fas fa-undo mr-2"></i>
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  const handleAdvancedCourseNavigate = (courseSlug: string, lessonSlug: string, courseId: string) => {
    if (onAdvancedCourseClick) {
      onAdvancedCourseClick(courseSlug, lessonSlug, courseId);
    }
  };

  return (
    <div className="py-8">
      {/* Mapped Advanced Training Courses Section */}
      {showMappedCourses && mappedCourses.length > 0 && (
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Advanced Training Library
            </h2>
            <p className="text-gray-600 text-sm">
              Premium courses mapped from your library content with direct access to lessons
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mappedCourses.map((course) => (
              <AdvancedLibraryCard
                key={course.id}
                course={course}
                user={user}
                onNavigate={handleAdvancedCourseNavigate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Traditional Library Items Section */}
      {items.length > 0 && (
        <div>
          {showMappedCourses && mappedCourses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Traditional Library
              </h2>
              <p className="text-gray-600 text-sm">
                Original library content and courses
              </p>
            </div>
          )}
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
        </div>
      )}

      {/* Load More Button */}
      {hasMore && onLoadMore && !loadingMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-plus mr-2"></i>
            Load More
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center items-center mt-12">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}

      {/* No More Items Message */}
      {!hasMore && items.length > 0 && !isLoading && (
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            You've reached the end of the library
          </p>
        </div>
      )}
    </div>
  );
}