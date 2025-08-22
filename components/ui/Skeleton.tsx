import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
  inline?: boolean;
}

/**
 * Reusable skeleton loader component for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  count = 1,
  inline = false,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };
  
  const defaultDimensions = {
    text: { width: '100%', height: '1.2em' },
    circular: { width: '40px', height: '40px' },
    rectangular: { width: '100%', height: '120px' },
    rounded: { width: '100%', height: '120px' },
  };
  
  const finalWidth = width ?? defaultDimensions[variant].width;
  const finalHeight = height ?? defaultDimensions[variant].height;
  
  const skeletonClass = clsx(
    baseClasses,
    animationClasses[animation],
    variantClasses[variant],
    className,
    {
      'inline-block': inline,
      'block': !inline,
    }
  );
  
  const style = {
    width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
    height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight,
  };
  
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={skeletonClass}
            style={style}
            aria-hidden="true"
          />
        ))}
      </>
    );
  }
  
  return (
    <div
      className={skeletonClass}
      style={style}
      aria-hidden="true"
    />
  );
};

// Skeleton container for complex layouts
interface SkeletonContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export const SkeletonContainer: React.FC<SkeletonContainerProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) {
    return <>{children}</>;
  }
  return null;
};

// Pre-built skeleton templates
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-4 border border-gray-200 rounded-lg', className)}>
    <Skeleton variant="rectangular" height={200} className="mb-4" />
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" width="60%" />
  </div>
);

export const SkeletonList: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className 
}) => (
  <div className={clsx('space-y-3', className)}>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" className="mb-1" />
          <Skeleton variant="text" width="70%" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number; className?: string }> = ({ 
  rows = 5, 
  cols = 4,
  className 
}) => (
  <div className={clsx('w-full', className)}>
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: cols }).map((_, index) => (
            <Skeleton key={index} variant="text" height={20} />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-200 last:border-0 p-3">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" height={16} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);