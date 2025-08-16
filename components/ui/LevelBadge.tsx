import React from 'react';
import { LEVEL_TIERS, calculateUserLevel } from '../../lib/api/courses';

interface LevelBadgeProps {
  completedCourses: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  completedCourses, 
  size = 'md', 
  showProgress = false 
}) => {
  const currentLevel = calculateUserLevel(completedCourses);
  
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'text-xs',
      text: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'text-sm',
      text: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'text-base',
      text: 'text-base'
    }
  };
  
  const classes = sizeClasses[size];
  
  const getProgressToNextLevel = () => {
    // Find next level tier
    const tiers = Object.values(LEVEL_TIERS);
    const currentTierIndex = tiers.findIndex(tier => 
      completedCourses >= tier.min && completedCourses <= tier.max
    );
    
    if (currentTierIndex === -1 || currentTierIndex === tiers.length - 1) {
      return { current: completedCourses, max: completedCourses, nextLevel: null };
    }
    
    const nextTier = tiers[currentTierIndex + 1];
    return {
      current: completedCourses,
      max: nextTier.min,
      nextLevel: nextTier.name,
      progress: Math.min(100, (completedCourses / nextTier.min) * 100)
    };
  };
  
  const progress = getProgressToNextLevel();

  return (
    <div className="flex flex-col">
      <div className={`inline-flex items-center justify-center rounded-full border font-medium ${currentLevel.tailwind} ${classes.container}`}>
        <i className={`${currentLevel.icon} ${classes.icon} mr-1.5`}></i>
        <span className={classes.text}>{currentLevel.name}</span>
      </div>
      
      {showProgress && progress.nextLevel && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1">
            <span>Progress to {progress.nextLevel}</span>
            <span>{progress.current}/{progress.max} courses</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LevelBadge);