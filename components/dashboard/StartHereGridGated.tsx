import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useCourseAccess } from '../../hooks/useCourseAccess';
import { courseLockState, getLockMessage, UserFlags, canStartCourse, requiresUpgradeCTA } from '../../lib/access';
import { getCourseMapping } from '../../lib/sections';
import clsx from 'clsx';
import { useState } from 'react';
import { loadProgressFromStorage } from '../../lib/api/courses';

interface Course {
  id: string;
  title: string;
  desc: string;
  modules: number;
  thumbnailUrl: string;
  href: string;
}

interface StartHereGridGatedProps {
  courses: Course[];
  user: UserFlags; // Accept user flags from parent
}

export default function StartHereGridGated({ courses, user }: StartHereGridGatedProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Use centralized access control for consistent gating
  const isCourseLocked = (courseId: string): boolean => {
    const mapping = getCourseMapping(courseId);
    if (!mapping) return true; // Hide unknown courses
    return !canStartCourse(mapping.sectionId, mapping.courseIndex ?? 1, user);
  };

  // Get lock state for styling
  const getLockState = (courseId: string) => {
    const mapping = getCourseMapping(courseId);
    if (!mapping) return 'locked-upgrade';
    return courseLockState(mapping.sectionId, mapping.courseIndex ?? 1, user);
  };

  // Get tooltip text for locked courses
  const getTooltipText = (courseId: string): string => {
    const mapping = getCourseMapping(courseId);
    const lockState = getLockState(courseId);
    return getLockMessage(lockState, user, mapping?.sectionId);
  };



  return (
    <div className="mb-6 sm:mb-8">
      {/* Section Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mr-3">
          <i className="fas fa-rocket text-green-600 text-lg"></i>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Start Here</h2>
          <p className="text-xs sm:text-sm text-gray-600">Essential courses to build your online business foundation</p>
        </div>
      </div>
      
      {/* Course Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isLocked = isCourseLocked(course.id);
          const tooltipText = getTooltipText(course.id);

          return (
            <div key={course.id} className="relative">
              {isLocked ? (
                // Locked Card
                <div 
                  className="block bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden relative cursor-not-allowed"
                  aria-disabled="true"
                  title={tooltipText}
                  onMouseEnter={() => setHoveredCard(course.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Course Image */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Course Content */}
                  <div className="p-4 sm:p-5">
                    <div className="mb-3">
                      <h3 className="font-bold text-base sm:text-lg text-gray-500 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{course.desc}</p>
                    </div>
                    
                    {/* Course Meta */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs sm:text-sm text-gray-400">
                        <i className="fas fa-book mr-1"></i>
                        <span className="font-medium">{course.modules} modules</span>
                      </div>
                      <div className="bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold">
                        Locked
                      </div>
                    </div>
                  </div>

                  {/* Locked Overlay */}
                  <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-sm ring-1 ring-black/10 flex items-center justify-center p-4">
                    {/* Center Badge */}
                    <div className="rounded-xl bg-white shadow-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 flex items-center gap-3 text-center max-w-full">
                      <Lock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Course Locked</div>
                        <div className="text-xs text-gray-600 mt-1 max-w-48">
                          {tooltipText}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Tooltip */}
                  {hoveredCard === course.id && tooltipText && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs text-center">
                      {tooltipText}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              ) : (
                // Unlocked Card
                <Link href={course.href}>
                  <a className={clsx(
                    'block group rounded-2xl overflow-hidden bg-white border border-black/5 transition-all duration-200',
                    isLocked ? 'pointer-events-none' : 'shadow-sm hover:shadow-lg hover:scale-[1.02]'
                  )}
                  aria-disabled={isLocked}
                  tabIndex={isLocked ? -1 : 0}>
                    {/* Course Image */}
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className={clsx(
                          'w-full h-full object-cover transition-transform duration-300',
                          !isLocked && 'group-hover:scale-105'
                        )}
                        loading="lazy"
                      />
                      {/* Play Overlay */}
                      <div className={clsx(
                        'absolute inset-0 transition-all duration-200 flex items-center justify-center',
                        !isLocked && 'bg-black bg-opacity-0 group-hover:bg-opacity-20'
                      )}>
                        <div className={clsx(
                          'w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-200',
                          !isLocked ? 'bg-opacity-0 group-hover:bg-opacity-90 transform scale-75 group-hover:scale-100' : 'bg-opacity-0'
                        )}>
                          <i className="fas fa-play text-blue-600 text-lg ml-1"></i>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Content */}
                    <div className="p-4 sm:p-5">
                      <div className="mb-3">
                        <h3 className={clsx(
                          'font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 transition-colors duration-200',
                          !isLocked && 'group-hover:text-blue-600'
                        )}>
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{course.desc}</p>
                      </div>
                      
                      {/* Course Meta */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <i className="fas fa-book mr-1"></i>
                          <span className="font-medium">{course.modules} modules</span>
                        </div>
                        <div className={clsx(
                          'text-blue-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200',
                          !isLocked ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-blue-50'
                        )}>
                          Start Course
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
}