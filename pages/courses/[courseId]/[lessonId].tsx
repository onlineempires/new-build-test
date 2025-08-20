import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../../components/layout/AppLayout';
import { useUpgrade } from '../../../contexts/UpgradeContext';
import { useCourseAccess } from '../../../hooks/useCourseAccess';
import { getCourse, updateLessonProgress, Course, Lesson, handleButtonClick } from '../../../lib/api/courses';
import { 
  Play, 
  Check, 
  Clock, 
  Download, 
  Rocket, 
  GraduationCap,
  FileText,
  File,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
    if (!course || !currentLesson) return false;
    
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
      // Track button click - Enagic button goes directly to calendar
      await handleButtonClick('enagic', currentLesson.id);
      
      // Redirect to calendar scheduler
      router.push('/enagic-scheduler');
    } catch (error) {
      console.error('Failed to handle Enagic flow:', error);
    }
  };

  const handleSkillsFlow = async () => {
    if (!currentLesson) return;
    
    try {
      // Track button click and unlock Discovery Process course
      await handleButtonClick('skills', currentLesson.id, 'discovery-process');
      
      // Redirect to Discovery Process course
      router.push('/courses/discovery-process');
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

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{Math.round(course.progress)}%</span>
        </div>
      </div>
    );
  };

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
        <div className="min-h-screen bg-white">
          {/* Breadcrumb Navigation */}
          <div className="border-b border-black/5 px-6 py-4">
            <nav className="text-sm text-gray-500">
              <button onClick={() => router.push('/')} className="hover:text-gray-700 transition-colors">
                Dashboard
              </button>
              <span className="mx-2">{'>'}</span>
              <button onClick={() => router.push('/courses')} className="hover:text-gray-700 transition-colors">
                All Courses
              </button>
              <span className="mx-2">{'>'}</span>
              <button onClick={() => router.push(`/courses/${courseId}`)} className="hover:text-gray-700 transition-colors">
                {course.title}
              </button>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-900">{currentLesson.title}</span>
            </nav>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column - Video and Overview */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Video Player */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={course.thumbnailUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"}
                      alt={currentLesson.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                      >
                        <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                      </button>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" />
                          </button>
                          <span>3:44 / {formatDuration(currentLesson.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="hover:text-blue-400 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.772L4.17 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.17l4.213-3.772z" clipRule="evenodd" />
                              <path d="M12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                          <button className="hover:text-blue-400 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full" style={{ width: '46%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Overview</h2>
                  <p className="text-gray-600 mb-6">{currentLesson.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Key Takeaways:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Understanding the core concepts</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Practical implementation strategies</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Real-world examples and case studies</span>
                      </li>
                    </ul>
                  </div>
                  
                  <hr className="border-gray-200 mb-4" />
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Estimated time: {formatDuration(currentLesson.duration)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Progress Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                  <div className="flex items-center justify-between mb-6">
                    <CircularProgress percentage={course.progress} />
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Module Progress</div>
                      <div className="font-medium text-gray-900">1 of {course.moduleCount} lessons</div>
                      <div className="text-sm text-gray-600 mb-1 mt-2">Course Progress</div>
                      <div className="font-medium text-gray-900">{course.modules.reduce((acc, module) => acc + module.lessons.filter(l => l.isCompleted).length, 0)} of {course.lessonCount} lessons</div>
                      <div className="text-sm text-gray-600 mb-1 mt-2">XP Earned</div>
                      <div className="font-medium text-green-600">+25 XP</div>
                    </div>
                  </div>
                </div>

                {/* Lesson Materials */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Materials</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded flex items-center justify-center mr-3 bg-red-100">
                          <FileText className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">Lesson Workbook</div>
                          <div className="text-xs text-gray-500">PDF • 2.3 MB</div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded flex items-center justify-center mr-3 bg-blue-100">
                          <File className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">Additional Resources</div>
                          <div className="text-xs text-gray-500">DOCX • 856 KB</div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Completion Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <label className="flex items-center mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentLesson.isCompleted}
                      onChange={markLessonComplete}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-700">Mark lesson as complete</span>
                  </label>
                  {nextLesson && (
                    <button
                      onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Continue to Next Lesson
                    </button>
                  )}
                </div>

                {/* Navigation Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/courses/${courseId}`)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back to Course
                    </button>
                    
                    {previousLesson && (
                      <button
                        onClick={() => router.push(`/courses/${courseId}/${previousLesson.id}`)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous Lesson
                      </button>
                    )}
                  </div>
                </div>

                {/* Upgrade Card */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-sm p-6 text-white">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold mb-4">
                    ⚡ LIMITED TIME
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-purple-100 mb-4 text-sm">Get unlimited access to all courses</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$799</span>
                    <span className="text-purple-200">/year</span>
                  </div>
                  <button
                    onClick={() => showUpgradeModal(currentRole)}
                    className="w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Action Panel - Only for Business Blueprint lessons */}
            {(currentLesson.hasEnagicButton || currentLesson.hasSkillsButton) && (
              <div className="mt-12 bg-gray-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Path</h3>
                  <p className="text-gray-600">Ready to take action or want to build more skills first?</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-4">
                  {currentLesson.hasEnagicButton && (
                    <button
                      onClick={() => handleEnagicFlow()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                    >
                      <Rocket className="w-5 h-5" />
                      <span>I'm Ready! Start Enagic Fast Track</span>
                    </button>
                  )}
                  
                  {currentLesson.hasSkillsButton && (
                    <button
                      onClick={() => handleSkillsFlow()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Not Ready Yet - Build Skills First</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
}