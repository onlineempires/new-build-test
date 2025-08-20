import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useCourseAccess } from '../../hooks/useCourseAccess';
import { getCourse, updateLessonProgress, Course, Lesson, isModuleUnlocked } from '../../lib/api/courses';

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showUpgradeModal } = useUpgrade();
  const { isPurchased, currentRole } = useCourseAccess();

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

  // Access control check
  const hasAccess = () => {
    if (!course) return false;
    
    // Special masterclasses require individual purchase
    const paidMasterclasses = ['email-marketing-secrets', 'advanced-funnel-mastery'];
    if (paidMasterclasses.includes(course.id)) {
      return isPurchased(course.id);
    }
    
    // Use the updated isPurchased logic which handles role-based access
    return isPurchased(course.id);
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
            <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-200 h-96 rounded-lg"></div>
              <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !course) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
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

  // Check access after course is loaded
  if (!hasAccess()) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-yellow-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Course Access Required</h3>
            <p className="text-gray-600 mb-6">
              You need to purchase this course or upgrade your plan to access this content.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/courses')}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Courses
              </button>
              {course.id === 'email-marketing-secrets' || course.id === 'advanced-funnel-mastery' ? (
                <button
                  onClick={() => router.push('/courses')}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Purchase Course - $49
                </button>
              ) : (
                <button
                  onClick={() => showUpgradeModal(currentRole)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i className="fas fa-crown mr-2"></i>Upgrade to Premium
                </button>
              )}
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
      >
        <div className="min-h-screen bg-gray-50 pb-8">
          
          {/* Breadcrumb Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <nav className="flex flex-wrap text-sm text-gray-500">
              <button 
                onClick={() => router.push('/')}
                className="hover:text-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <span className="mx-2">&gt;</span>
              <button 
                onClick={() => router.push('/courses')}
                className="hover:text-gray-700 transition-colors"
              >
                All Courses
              </button>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">{course.title}</span>
            </nav>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column - Course Content */}
              <div className="lg:col-span-2">
                
                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                      <p className="text-gray-600 mb-2">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2 sm:gap-4">
                        <span className="whitespace-nowrap">{course.moduleCount}&nbsp;Modules</span>
                        <span className="whitespace-nowrap">{course.lessonCount}&nbsp;Lessons</span>
                        <span className="whitespace-nowrap">{progress.courseProgress}%&nbsp;Complete</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress.courseProgress}%` }}
                    ></div>
                  </div>

                  {nextLesson && (
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                      <div>
                        <h3 className="font-medium text-blue-900">Continue Learning</h3>
                        <p className="text-sm text-blue-700">Next: {nextLesson.title}</p>
                      </div>
                      <button
                        onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
                    const isUnlocked = isModuleUnlocked(module.id, course);
                    const isLocked = module.isLocked || !isUnlocked;
                    
                    return (
                      <div key={module.id} className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 relative ${
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
                                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                                {isLocked && (
                                  <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                    Locked
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-600">{moduleProgress}%</div>
                            <div className="text-xs text-gray-500">{completedInModule}/{module.lessons.length}</div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${moduleProgress}%` }}
                          ></div>
                        </div>

                        <p className="text-gray-600 mb-4">{module.description}</p>
                        
                        {isLocked && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-2 text-yellow-700">
                              <i className="fas fa-lock"></i>
                              <span className="text-sm font-medium">
                                {course.id === 'business-blueprint' && moduleIndex === 1 
                                  ? `Complete Module ${moduleIndex} or click "Build Skills First" to unlock this module`
                                  : `Complete Module ${moduleIndex} to unlock this module`
                                }
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-0 divide-y divide-gray-100">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                if (!isLocked) {
                                  router.push(`/courses/${courseId}/${lesson.id}`);
                                }
                              }}
                              disabled={isLocked}
                              className={`w-full flex items-center p-3 transition-colors text-left first:rounded-t-lg last:rounded-b-lg ${
                                isLocked 
                                  ? 'cursor-not-allowed opacity-50' 
                                  : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                            >
                              <span className="w-6 h-6 mr-3">
                                {lesson.isCompleted ? (
                                  <i className="fas fa-check-circle text-green-500"></i>
                                ) : (
                                  <i className="fas fa-play-circle text-gray-400"></i>
                                )}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {lessonIndex + 1}. {lesson.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {lesson.description}
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 ml-4">
                                {formatDuration(lesson.duration)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                        <span className="text-lg font-bold text-blue-600">{progress.courseProgress}%</span>
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
                        <span className="text-sm text-gray-600">Estimated Time</span>
                        <span className="text-sm font-medium text-gray-900">
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
                          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                          onClick={() => showUpgradeModal('free')}
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
      </AppLayout>
    </>
  );
}