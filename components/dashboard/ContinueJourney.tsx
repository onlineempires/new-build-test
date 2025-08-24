import Link from 'next/link';
import { COURSE_CONFIG } from '../../lib/config/courseConfig';

interface ContinueJourneyProps {
  course: {
    courseTitle: string;
    moduleTitle: string;
    lessonTitle: string;
    progressPercent: number;
    href: string;
    thumbnailUrl?: string;
    isNewUser?: boolean;
  };
}

export default function ContinueJourney({ course }: ContinueJourneyProps) {
  return (
    <div className="theme-card rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
            <i className="fas fa-play text-blue-600 text-sm"></i>
          </div>
          <h2 className="text-lg sm:text-xl font-bold theme-text-primary">Continue Learning</h2>
        </div>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          {course.isNewUser ? (
            <span className="text-xs sm:text-sm text-green-600 font-bold">
              <i className="fas fa-star mr-1"></i>
              New Journey
            </span>
          ) : course.progressPercent === 100 ? (
            <span className="text-xs sm:text-sm text-green-600 font-bold">
              <i className="fas fa-trophy mr-1"></i>
              Completed
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-bold" style={{color: 'var(--color-primary)'}}>{course.progressPercent}% Complete</span>
          )}
        </div>
      </div>
      
      {/* Course Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center mb-4">
          {/* Course Thumbnail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl mr-3 sm:mr-4 overflow-hidden flex-shrink-0 shadow-sm">
            {course.thumbnailUrl ? (
              <img 
                src={course.thumbnailUrl} 
                alt={course.courseTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                <i className="fas fa-graduation-cap"></i>
              </div>
            )}
          </div>
          
          {/* Course Info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg theme-text-primary mb-1 truncate">{course.courseTitle}</h3>
            <p className="text-xs sm:text-sm theme-text-secondary mb-1 truncate">
              <i className="fas fa-book-open mr-1"></i>
              {course.moduleTitle}
            </p>
            <p className="text-xs theme-text-muted truncate">
              <i className="fas fa-video mr-1"></i>
              {course.lessonTitle}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-white bg-opacity-50 rounded-full h-3 shadow-inner">
            <div 
              className="h-3 rounded-full transition-all duration-500 shadow-sm theme-progress-fill"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>
        
        {/* Continue Button */}
        <Link href={course.href}>
          <a className="w-full theme-button-primary px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-center block transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]">
            {course.isNewUser ? (
              <>
                <i className={`${COURSE_CONFIG.NEW_USER_MESSAGES.continueButtonIcon} mr-2`}></i>
                {COURSE_CONFIG.NEW_USER_MESSAGES.continueButtonText}
              </>
            ) : course.progressPercent === 100 ? (
              <>
                <i className={`${COURSE_CONFIG.COMPLETED_COURSE_MESSAGES.continueButtonIcon} mr-2`}></i>
                {COURSE_CONFIG.COMPLETED_COURSE_MESSAGES.continueButtonText}
              </>
            ) : (
              <>
                <i className={`${COURSE_CONFIG.RETURNING_USER_MESSAGES.continueButtonIcon} mr-2`}></i>
                {COURSE_CONFIG.RETURNING_USER_MESSAGES.continueButtonText}
              </>
            )}
          </a>
        </Link>
      </div>
    </div>
  );
}