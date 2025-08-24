import React, { useState } from 'react';
import { LibraryCourse } from '../../lib/courseMapping';
import { User, checkAdvancedTrainingAccess, getMembershipBadgeText } from '../../utils/accessControl';
import { useRouter } from 'next/router';

interface AdvancedLibraryCardProps {
  course: LibraryCourse & { id: string };
  user: User | null;
  onNavigate: (courseSlug: string, lessonSlug: string, courseId: string) => void;
}

const AdvancedLibraryCard: React.FC<AdvancedLibraryCardProps> = ({ course, user, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  
  const accessResult = checkAdvancedTrainingAccess(user, course.accessLevel);
  const hasAccess = accessResult.hasAccess;

  const handleClick = () => {
    if (!hasAccess && accessResult.upgradeUrl) {
      // Navigate to upgrade page if no access
      router.push(accessResult.upgradeUrl);
      return;
    }
    
    if (hasAccess) {
      onNavigate(course.courseSlug, course.lessonSlug, course.id);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'MC+':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DE+':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CR+':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAccessBadgeColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'monthly':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'yearly':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (progress?: number) => {
    if (!progress) return 'bg-gray-200';
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getProgressText = (progress?: number) => {
    if (progress === 100) return 'Completed';
    if (progress && progress > 0) return `${progress}% Complete`;
    return 'Not Started';
  };

  return (
    <div 
      className={`
        relative bg-white border border-gray-200 rounded-xl overflow-hidden
        transition-all duration-300 ease-out cursor-pointer group
        hover:shadow-lg hover:border-gray-300 hover:-translate-y-1
        ${!hasAccess ? 'opacity-75' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Access Control Overlay */}
      {!hasAccess && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">{accessResult.reason}</p>
            <p className="text-xs text-gray-500 mt-1">Click to upgrade</p>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelBadgeColor(course.level)}`}>
              {course.level}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAccessBadgeColor(course.accessLevel)}`}>
              {getMembershipBadgeText(course.accessLevel)}
            </span>
          </div>
          
          {/* Duration */}
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Progress Section */}
        {course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className={`font-medium ${course.progress === 100 ? 'text-green-600' : 'text-gray-700'}`}>
                {getProgressText(course.progress)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Category and Video indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
              {course.category}
            </span>
            {course.hasVideo && (
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video
              </div>
            )}
          </div>

          {/* Action Indicator */}
          <div className={`flex items-center text-xs transition-all duration-200 ${
            isHovered 
              ? hasAccess 
                ? 'text-blue-600 translate-x-1' 
                : 'text-gray-600 translate-x-1'
              : 'text-gray-400'
          }`}>
            {hasAccess ? 'Continue Learning' : 'Upgrade to Access'}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className={`absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none transition-all duration-300 ${
        isHovered && hasAccess ? 'border-blue-200' : ''
      }`} />
    </div>
  );
};

export default AdvancedLibraryCard;