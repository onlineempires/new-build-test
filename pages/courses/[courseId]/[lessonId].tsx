import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../../components/layout/AppLayout';
import { useUpgrade } from '../../../contexts/UpgradeContext';
import { useCourseAccess } from '../../../hooks/useCourseAccess';
import { getCourse, updateLessonProgress, Course, Lesson, handleButtonClick } from '../../../lib/api/courses';

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { showUpgradeModal } = useUpgrade();
  const { isPurchased, currentRole } = useCourseAccess();

  useEffect(() => {
    if (courseId && lessonId) {
      loadCourseAndLesson(courseId as string, lessonId as string);
    }
  }, [courseId, lessonId]);

  const loadCourseAndLesson = async (cId: string, lId: string) => {
    try {
      setLoading(true);
      setError(null);
      const courseData = await getCourse(cId);
      setCourse(courseData);
      
      // Find the lesson in the course
      let foundLesson: Lesson | null = null;
      for (const module of courseData.modules) {
        const lesson = module.lessons.find(l => l.id === lId);
        if (lesson) {
          foundLesson = lesson;
          break;
        }
      }
      
      if (!foundLesson) {
        throw new Error('Lesson not found');
      }
      
      setCurrentLesson(foundLesson);
    } catch (err) {
      console.error('Failed to load lesson:', err);
      setError('Failed to load lesson data');
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = () => {
    if (!course) return false;
    
    // Check if course requires purchase or upgrade
    if (course.id === 'email-marketing-secrets' || course.id === 'advanced-funnel-mastery') {
      return isPurchased(course.id);
    }
    
    // Check role-based access
    switch (currentRole) {
      case 'free':
      case 'trial':
        // Allow access to Start Here courses including Business Launch Blueprint
        return course.id === 'business-blueprint' || course.id === 'discovery-process' || course.id === 'next-steps' || course.id === 'start-here' || course.id === 'digital-marketing-fundamentals';
      case 'downsell':
        return course.id === 'business-blueprint' || course.id === 'discovery-process' || course.id === 'next-steps' || course.id === 'start-here' || course.id === 'digital-marketing-fundamentals' || course.id === 'daily-method';
      case 'monthly':
      case 'annual':
      case 'admin':
        return true;
      default:
        return false;
    }
  };

  const markLessonComplete = async () => {
    if (currentLesson && course) {
      try {
        await updateLessonProgress(course.id, currentLesson.id, true);
        setCurrentLesson(prev => prev ? { ...prev, isCompleted: true } : null);
        
        // Update course data
        const updatedCourse = await getCourse(course.id);
        setCourse(updatedCourse);
      } catch (err) {
        console.error('Failed to update lesson progress:', err);
      }
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    
    let foundCurrent = false;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          return lesson;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    
    let previousLesson: Lesson | null = null;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.id === currentLesson.id) {
          return previousLesson;
        }
        previousLesson = lesson;
      }
    }
    return null;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEnagicFlow = async () => {
    if (!currentLesson) return;
    
    try {
      // Track button click and unlock Module 2 if needed
      const moduleToUnlock = currentLesson.id.startsWith('lesson-1-') ? 'business-module-2' : undefined;
      await handleButtonClick('enagic', currentLesson.id, moduleToUnlock);
      
      // Redirect to calendar scheduler (placeholder for now)
      router.push('/enagic-scheduler');
    } catch (error) {
      console.error('Failed to handle Enagic flow:', error);
    }
  };

  const handleSkillsFlow = async () => {
    if (!currentLesson) return;
    
    try {
      // Track button click and unlock Module 2
      await handleButtonClick('skills', currentLesson.id, 'business-module-2');
      
      // Redirect to Module 2 or Skills VSL depending on lesson
      if (currentLesson.id === 'lesson-2-1') {
        router.push('/skills-vsl');
      } else {
        router.push(`/courses/${courseId}/lesson-2-1`);
      }
    } catch (error) {
      console.error('Failed to handle Skills flow:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Lesson not found'}
            <button 
              onClick={() => router.push(`/courses/${courseId}`)}
              className="ml-4 underline hover:no-underline"
            >
              Back to Course
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Check access after lesson is loaded
  if (!hasAccess()) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-yellow-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Access Required</h3>
            <p className="text-gray-600 mb-6">
              You need to purchase this course or upgrade your plan to access this lesson.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Course
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

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <>
      <Head>
        <title>{currentLesson.title} - {course.title} - Digital Era</title>
        <meta name="description" content={currentLesson.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}
        notifications={[]}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gray-900">
          
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
              <button 
                onClick={() => router.push(`/courses/${courseId}`)}
                className="hover:text-gray-700 transition-colors"
              >
                {course.title}
              </button>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">{currentLesson.title}</span>
            </nav>
          </div>

          {/* Video Player Section */}
          <div className="relative">
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isPlaying ? (
                    <i className="fas fa-pause text-3xl"></i>
                  ) : (
                    <i className="fas fa-play text-3xl ml-1"></i>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{currentLesson.title}</h2>
                <p className="text-gray-300 mb-4">{currentLesson.description}</p>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'} Video
                </button>
                
                <div className="mt-6 text-sm text-gray-400">
                  <p>📺 Demo Mode: Video player would be integrated here</p>
                  <p>Duration: {formatDuration(currentLesson.duration)} • {currentLesson.isCompleted ? '✅ Completed' : '⏸️ In Progress'}</p>
                </div>
                
                {/* Action Buttons Below Video */}
                {(currentLesson.hasEnagicButton || currentLesson.hasSkillsButton) && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                    {currentLesson.hasEnagicButton && (
                      <button
                        onClick={() => handleEnagicFlow()}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3"
                      >
                        <i className="fas fa-rocket"></i>
                        <span>I'm ready! Start Enagic Fast Track</span>
                      </button>
                    )}
                    
                    {currentLesson.hasSkillsButton && (
                      <button
                        onClick={() => handleSkillsFlow()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3"
                      >
                        <i className="fas fa-graduation-cap"></i>
                        <span>Not ready/interested - Build Skills First</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  {previousLesson && (
                    <button
                      onClick={() => router.push(`/courses/${courseId}/${previousLesson.id}`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <i className="fas fa-step-backward"></i>
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <i className="fas fa-pause text-lg"></i>
                    ) : (
                      <i className="fas fa-play text-lg ml-0.5"></i>
                    )}
                  </button>
                  
                  {!currentLesson.isCompleted && (
                    <button
                      onClick={markLessonComplete}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <i className="fas fa-check"></i>
                      <span className="hidden sm:inline">Mark Complete</span>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  {currentLesson.isCompleted && (
                    <span className="flex items-center space-x-2 px-3 py-1 bg-green-600 rounded-full text-sm">
                      <i className="fas fa-check"></i>
                      <span>Completed</span>
                    </span>
                  )}
                  
                  {nextLesson && (
                    <button
                      onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <i className="fas fa-step-forward"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentLesson.title}</h1>
                      <p className="text-lg text-gray-600 leading-relaxed">{currentLesson.description}</p>
                    </div>
                    
                    {/* Lesson Notes */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Lesson Notes</h3>
                      <div className="prose text-gray-600">
                        <p>In this lesson, you'll learn about {currentLesson.title.toLowerCase()}. Key topics covered include:</p>
                        <ul className="mt-4 space-y-2">
                          <li>• Understanding the core concepts</li>
                          <li>• Practical implementation strategies</li>
                          <li>• Real-world examples and case studies</li>
                          <li>• Common pitfalls to avoid</li>
                          <li>• Next steps for implementation</li>
                        </ul>
                        <p className="mt-4"><strong>Duration:</strong> {formatDuration(currentLesson.duration)}</p>
                      </div>
                    </div>
                    
                    {/* Resources */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Lesson Resources</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <i className="fas fa-file-pdf text-red-500"></i>
                          <div>
                            <div className="font-medium text-gray-900">Lesson Workbook</div>
                            <div className="text-sm text-gray-500">PDF • 2.3 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <i className="fas fa-link text-blue-500"></i>
                          <div>
                            <div className="font-medium text-gray-900">Additional Resources</div>
                            <div className="text-sm text-gray-500">External links and tools</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    
                    {/* Course Progress */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">🎯 Your Progress</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Course Progress</span>
                          <span className="text-sm font-medium text-blue-600">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">📍 Navigation</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push(`/courses/${courseId}`)}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-arrow-left mr-2"></i>
                          Back to Course
                        </button>
                        
                        {previousLesson && (
                          <button
                            onClick={() => router.push(`/courses/${courseId}/${previousLesson.id}`)}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <i className="fas fa-chevron-left mr-2"></i>
                            Previous Lesson
                          </button>
                        )}
                        
                        {nextLesson && (
                          <button
                            onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Next Lesson
                            <i className="fas fa-chevron-right ml-2"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">📖 Course Info</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Course</span>
                          <span className="font-medium text-gray-900">{course.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level</span>
                          <span className="font-medium text-gray-900">{course.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">{formatDuration(currentLesson.duration)}</span>
                        </div>
                      </div>
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