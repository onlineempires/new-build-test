import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useCourseAccess } from '../../hooks/useCourseAccess';
import { useCourseGating } from '../../hooks/useCourseGating';
import { getCourse, updateLessonProgress, Course, Lesson, isModuleUnlocked, isCourseUnlocked, isLessonUnlocked, loadProgressFromStorage } from '../../lib/api/courses';
import { roleToUpgradeContext } from '../../utils/upgrade';
import { canStartCourse, isLessonUnlocked as isLessonUnlockedAccess, UserFlags, requiresUpgradeCTA, requiresPurchaseMasterclass } from '../../lib/access';
import { getCourseMapping } from '../../lib/sections';
import { useUserFlags } from '../../lib/userFlags';
import FeedbackModal from '../../components/dashboard/FeedbackModal';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { showUpgradeModal } = useUpgrade();
  const { isPurchased, currentRole } = useCourseAccess();
  const { isTrial, canAccessDiscovery } = useCourseGating();
  
  // Use centralized user flags
  const userFlags = useUserFlags();
  


  useEffect(() => {
    if (courseId) {
      loadCourse(courseId as string);
    }
  }, [courseId]);

  const loadCourse = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const courseData = await getCourse(id);
      setCourse(courseData);
    } catch (err) {
      console.error('Failed to load course:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (!course) return { courseProgress: 0, completedLessons: 0, totalLessons: 0 };
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(l => l.isCompleted).length, 0
    );
    
    return {
      courseProgress: Math.round((completedLessons / totalLessons) * 100),
      completedLessons,
      totalLessons
    };
  };

  const getNextIncompleteLesson = () => {
    if (!course) return null;
    
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.isCompleted) {
          return lesson;
        }
      }
    }
    return null;
  };

  const handleFeedbackSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-6 theme-bg">
          <div className="animate-pulse">
            <div className="h-4 theme-card rounded w-96 mb-6"></div>
            <div className="theme-card h-64 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 theme-card h-96 rounded-lg"></div>
              <div className="theme-card h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !course) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6 theme-bg">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Course not found'}
            <button 
              onClick={() => router.push('/courses')}
              className="ml-4 underline hover:no-underline"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Route guard: Check if course exists in COURSE_MAP and validate access
  const courseMapping = getCourseMapping(course.id);
  if (!courseMapping) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Course not found
            <button 
              onClick={() => router.push('/courses')}
              className="ml-4 underline hover:no-underline"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const canStart = canStartCourse(courseMapping.sectionId, courseMapping.courseIndex ?? 1, userFlags);
  
  // If user cannot start the course, show appropriate access panel
  if (!canStart) {
    const requiresUpgrade = requiresUpgradeCTA(courseMapping.sectionId, courseMapping.courseIndex!, userFlags);
    const isMasterclass = courseMapping.sectionId === 's3';
    
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-yellow-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isMasterclass ? 'Masterclass Purchase Required' : requiresUpgrade ? 'Upgrade Required' : 'Course Locked'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isMasterclass 
                ? 'This masterclass requires a separate purchase to access.' 
                : requiresUpgrade 
                ? 'Upgrade to Premium to access this course and unlock your full potential.'
                : 'Complete previous courses to unlock this content.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/courses')}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Courses
              </button>
              {isMasterclass ? (
                <button
                  onClick={() => router.push('/courses')}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Purchase Masterclass - $49
                </button>
              ) : requiresUpgrade ? (
                <button
                  onClick={() => showUpgradeModal(roleToUpgradeContext(currentRole))}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i className="fas fa-crown mr-2"></i>Upgrade to Premium
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }



  const progress = calculateProgress();
  const nextLesson = getNextIncompleteLesson();

  return (
    <>
      <Head>
        <title>{course.title} - Digital Era</title>
        <meta name="description" content={course.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}
        notifications={[]}
        onClearNotifications={() => {}}
        onFeedbackClick={() => setFeedbackModalOpen(true)}
      >
        <div className="min-h-screen theme-bg pb-8">
          
          {/* Breadcrumb Navigation */}
          <div className="theme-header theme-border border-b px-4 sm:px-6 py-3 sm:py-4">
            <Breadcrumbs 
              items={[
                { label: 'Dashboard', href: '/' },
                { label: 'All Courses', href: '/courses' },
                { label: course.title, current: true }
              ]}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column - Course Content */}
              <div className="lg:col-span-2">
                
                {/* Course Header */}
                <div className="theme-card rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold theme-text-primary mb-2">{course.title}</h1>
                      <p className="theme-text-secondary mb-2">{course.description}</p>
                      <div className="flex items-center text-sm theme-text-muted flex-wrap gap-2 sm:gap-4">
                        <span className="whitespace-nowrap">{course.moduleCount}&nbsp;Modules</span>
                        <span className="whitespace-nowrap">{course.lessonCount}&nbsp;Lessons</span>
                        <span className="whitespace-nowrap">{progress.courseProgress}%&nbsp;Complete</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full theme-border rounded-full h-3 mb-4">
                    <div
                      className="theme-progress-fill h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress.courseProgress}%` }}
                    ></div>
                  </div>

                  {nextLesson && (
                    <div className="flex items-center justify-between theme-bg-secondary rounded-lg p-4">
                      <div>
                        <h3 className="font-medium theme-text-primary">Continue Learning</h3>
                        <p className="text-sm theme-text-secondary">Next: {nextLesson.title}</p>
                      </div>
                      <button
                        onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                        className="theme-button-primary px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <i className="fas fa-play mr-2"></i>
                        Continue
                      </button>
                    </div>
                  )}
                </div>

                {/* Course Modules */}
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => {
                    const completedInModule = module.lessons.filter(l => l.isCompleted).length;
                    const moduleProgress = Math.round((completedInModule / module.lessons.length) * 100);
                    const isUnlocked = isModuleUnlocked(module.id, course, currentRole);
                    const isLocked = module.isLocked || !isUnlocked;
                    
                    return (
                      <div key={module.id} className={`theme-card rounded-lg shadow-sm p-4 sm:p-6 relative ${
                        isLocked ? 'opacity-60' : ''
                      }`}>
                        {isLocked && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white text-sm"></i>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <span className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center mr-3 ${
                              isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {moduleIndex + 1}
                            </span>
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold theme-text-primary">{module.title}</h3>
                                {isLocked && (
                                  <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                    Locked
                                  </span>
                                )}
                              </div>
                              <p className="text-sm theme-text-muted">{module.lessons.length} lessons</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium theme-text-secondary">{moduleProgress}%</div>
                            <div className="text-xs theme-text-muted">{completedInModule}/{module.lessons.length}</div>
                          </div>
                        </div>
                        
                        <div className="w-full theme-border rounded-full h-2 mb-4">
                          <div
                            className="theme-progress-fill h-2 rounded-full transition-all duration-300"
                            style={{ width: `${moduleProgress}%` }}
                          ></div>
                        </div>

                        <p className="theme-text-secondary mb-4">{module.description}</p>
                        
                        {isLocked && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-2 text-yellow-700">
                              <i className="fas fa-lock"></i>
                              <span className="text-sm font-medium">
                                Complete this course to unlock the next one.
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-0 divide-y divide-gray-100">
                          {module.lessons.map((lesson, lessonIndex) => {
                            // CRITICAL FIX: Calculate total completed lessons in the ENTIRE COURSE
                            let globalLessonIndex = 0;
                            let totalCompletedLessons = 0;
                            
                            // First, calculate the global lesson index for the current lesson
                            for (let mi = 0; mi < course.modules.length; mi++) {
                              for (let li = 0; li < course.modules[mi].lessons.length; li++) {
                                if (mi === moduleIndex && li === lessonIndex) {
                                  // Found our current lesson position, stop here
                                  break;
                                }
                                globalLessonIndex++;
                              }
                              if (mi === moduleIndex) break; // Don't go beyond current module
                            }
                            
                            // Now count ALL completed lessons in the entire course that come BEFORE this lesson
                            for (let mi = 0; mi < course.modules.length; mi++) {
                              for (let li = 0; li < course.modules[mi].lessons.length; li++) {
                                // Stop counting when we reach the current lesson
                                if (mi === moduleIndex && li === lessonIndex) {
                                  break;
                                }
                                if (course.modules[mi].lessons[li].isCompleted) {
                                  totalCompletedLessons++;
                                }
                              }
                              if (mi === moduleIndex) break; // Don't go beyond current module
                            }
                            
                            // Use centralized lesson-level gating logic with corrected parameters
                            const lessonUnlocked = isLessonUnlockedAccess(
                              courseMapping.sectionId, 
                              courseMapping.courseIndex ?? 1, 
                              globalLessonIndex + 1, // Convert to 1-based indexing
                              userFlags, 
                              totalCompletedLessons
                            );
                            const isLessonLocked = !lessonUnlocked;
                            

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  if (!isLessonLocked) {
                                    router.push(`/courses/${courseId}/${lesson.id}`);
                                  }
                                }}
                                disabled={isLessonLocked}
                                className={`w-full flex items-center p-3 transition-colors text-left first:rounded-t-lg last:rounded-b-lg ${
                                  isLessonLocked 
                                    ? 'cursor-not-allowed opacity-50' 
                                    : 'theme-hover cursor-pointer'
                                }`}
                              >
                                <span className="w-6 h-6 mr-3">
                                  {isLessonLocked ? (
                                    <i className="fas fa-lock theme-text-muted"></i>
                                  ) : lesson.isCompleted ? (
                                    <i className="fas fa-check-circle text-green-500"></i>
                                  ) : (
                                    <i className="fas fa-play-circle theme-text-muted"></i>
                                  )}
                                </span>
                                <div className="flex-1">
                                  <div className="font-medium theme-text-primary">
                                    {lessonIndex + 1}. {lesson.title}
                                  </div>
                                  <div className="text-sm theme-text-secondary">
                                    {lesson.description}
                                  </div>
                                  {isLessonLocked && (
                                    <div className="text-xs text-orange-600 mt-1 font-medium">
                                      Complete previous lessons to unlock
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm theme-text-secondary ml-4">
                                  {formatDuration(lesson.duration)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inline Notice for Next Course - Only for Business Blueprint */}
                {courseId === 'business-blueprint' && isTrial && !canAccessDiscovery && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <div className="flex items-center text-yellow-800">
                      <i className="fas fa-info-circle mr-2"></i>
                      <span className="text-sm">
                        Complete this course to unlock the next one.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 lg:top-8 space-y-4 lg:space-y-6">
                  
                  {/* Course Progress */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Course Progress</h3>
                    
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray={`${progress.courseProgress}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold" style={{color: 'var(--color-primary)'}}>{progress.courseProgress}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed Lessons</span>
                        <span className="text-sm font-medium text-gray-900">
                          {progress.completedLessons}/{progress.totalLessons}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Modules</span>
                        <span className="text-sm font-medium text-gray-900">{course.moduleCount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm theme-text-secondary">Estimated Time</span>
                        <span className="text-sm font-medium theme-text-primary">
                          {Math.round(course.modules.reduce((acc, module) => 
                            acc + module.lessons.reduce((total, lesson) => total + lesson.duration, 0), 0
                          ) / 3600 * 10) / 10} hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => router.push('/courses')}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to Courses
                      </button>
                      
                      {nextLesson && (
                        <button
                          onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                          className="w-full flex items-center justify-center px-4 py-2 theme-button-primary rounded-lg transition-colors"
                        >
                          <i className="fas fa-play mr-2"></i>
                          Continue Learning
                        </button>
                      )}
                      
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <i className="fas fa-download mr-2"></i>
                        Download Materials
                      </button>

                      {/* Upgrade prompt for free users only */}
                      {currentRole === 'free' && !isPurchased(courseId as string) && (
                        <button
                          onClick={() => showUpgradeModal(roleToUpgradeContext('free'))}
                          className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors mt-2"
                        >
                          <i className="fas fa-crown mr-2"></i>
                          Unlock All Courses
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          onSuccess={handleFeedbackSuccess}
        />

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center justify-center sm:justify-start">
            <i className="fas fa-check-circle mr-2"></i>
            <span className="font-medium">Feedback sent successfully!</span>
          </div>
        )}
      </AppLayout>
    </>
  );
}