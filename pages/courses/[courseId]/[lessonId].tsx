import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../../components/layout/AppLayout';
import { useUpgrade } from '../../../contexts/UpgradeContext';
import { useCourseAccess } from '../../../hooks/useCourseAccess';
import { useCourseGating } from '../../../hooks/useCourseGating';
import { getCourse, updateLessonProgress, Course, Lesson, handleButtonClick, isLessonUnlocked, handleNotReadyYetClick } from '../../../lib/api/courses';
import { roleToUpgradeContext } from '../../../utils/upgrade';
import { getCourseMapping } from '../../../lib/sections';
import { useUserFlags } from '../../../lib/userFlags';
import { canStartCourse, isLessonUnlocked as isLessonUnlockedAccess, requiresUpgradeCTA } from '../../../lib/access';
import FeedbackModal from '../../../components/dashboard/FeedbackModal';
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
  ChevronRight,
  Lock
} from 'lucide-react';

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { showUpgradeModal } = useUpgrade();
  const { isPurchased, currentRole } = useCourseAccess();
  const { setNotReadyFlag } = useCourseGating();
  
  // Use centralized user flags
  const userFlags = useUserFlags();

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
    
    // Get course mapping from centralized system
    const courseMapping = getCourseMapping(course.id);
    if (!courseMapping) return false;
    
    // First check if user can access the course at all
    const canAccessCourse = canStartCourse(courseMapping.sectionId, courseMapping.courseIndex ?? 1, userFlags);
    if (!canAccessCourse) return false;
    
    // Then check lesson-level access within the course
    // Find lesson index within the course
    let lessonIndex = 0;
    let completedLessons = 0;
    let foundLesson = false;
    
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.id === currentLesson.id) {
          foundLesson = true;
          break;
        }
        lessonIndex++;
        if (lesson.isCompleted) completedLessons++;
      }
      if (foundLesson) break;
    }
    
    // Use centralized lesson access logic (lessonIndex is 1-based)
    return isLessonUnlockedAccess(
      courseMapping.sectionId, 
      courseMapping.courseIndex ?? 1, 
      lessonIndex + 1, 
      userFlags, 
      completedLessons
    );
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
      // Track button click for analytics and unlock Discovery Process
      await handleButtonClick('skills', currentLesson.id, 'discovery-process');
      
      // Set the not ready flag for all users to unlock video 1 of Discovery Process
      setNotReadyFlag();
      
      // CRITICAL: Also set the flag that the access control system expects
      if (typeof window !== 'undefined') {
        localStorage.setItem('flags.pressedNotReady', 'true');
        
        // Also set in the main userFlags for consistency
        const userFlags = JSON.parse(localStorage.getItem('userFlags') || '{}');
        userFlags.pressedNotReady = true;
        userFlags.pressedNotReadyTimestamp = Date.now();
        localStorage.setItem('userFlags', JSON.stringify(userFlags));
      }
      
      // Redirect all users to Discovery Process lesson 1-1 (video 1, course 2)
      router.push('/courses/discovery-process/lesson-1-1');
    } catch (error) {
      console.error('Failed to handle Skills flow:', error);
    }
  };

  const handleNotReadyYet = async () => {
    try {
      // Use the courses API function to handle "Not Ready Yet" click
      await handleNotReadyYetClick();
      
      // Redirect to Discovery Process Lesson 1 Video 1
      router.push('/courses/discovery-process/lesson-1-1');
    } catch (error) {
      console.error('Failed to handle Not Ready Yet:', error);
    }
  };

  const handleFeedbackSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

  // Route guard: Check lesson access using centralized system
  if (!hasAccess()) {
    // Get course mapping to determine the proper access panel
    const courseMapping = getCourseMapping(course.id);
    const canAccessCourse = courseMapping && canStartCourse(courseMapping.sectionId, courseMapping.courseIndex ?? 1, userFlags);
    
    if (!canAccessCourse) {
      // If user can't access the course at all, redirect to course page which will show the proper access panel
      return (
        <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Course access required. Redirecting to course page...
              <button 
                onClick={() => router.push(`/courses/${courseId}`)}
                className="ml-4 underline hover:no-underline"
              >
                Go to Course
              </button>
            </div>
          </div>
        </AppLayout>
      );
    }
    
    // User has course access but not lesson access - show progress lock panel
    // Special handling for Business Blueprint lessons - show "Not Ready Yet" option
    if (course.id === 'business-blueprint' && (userFlags.role === 'free' || userFlags.role === 'trial') && currentLesson.id !== 'lesson-1-1') {
      return (
        <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Locked</h3>
              <p className="text-gray-600 mb-6">
                Complete the previous lesson in your Business Blueprint journey to unlock this content.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/courses/business-blueprint/lesson-1-1')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Lesson 1 Video 1
                </button>
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Course
                </button>
              </div>
            </div>
          </div>
        </AppLayout>
      );
    }

    // Default progress lock panel for sequential lessons
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-yellow-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Locked</h3>
            <p className="text-gray-600 mb-6">
              Complete the previous lessons to unlock this content.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 32;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-[72px] h-[72px] flex-shrink-0">
        <svg className="w-[72px] h-[72px] transform -rotate-90" viewBox="0 0 72 72">
          <circle
            cx="36"
            cy="36"
            r="32"
            stroke="#e5e7eb"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="36"
            cy="36"
            r="32"
            stroke="#3b82f6"
            strokeWidth="5"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-gray-900">{Math.round(percentage)}%</span>
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
        onFeedbackClick={() => setFeedbackModalOpen(true)}
      >
        <div className="min-h-screen bg-white">
          {/* Breadcrumb Navigation */}
          <div className="border-b border-black/5 px-6 py-4 bg-white">
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
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column - Video and Overview */}
              <div className="lg:col-span-8 space-y-6 z-0">
                
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

                {/* Action Buttons Under Video - Only for Discovery Course */}
                {courseId === 'discovery-process' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Interested in Enagic Button */}
                      <button
                        onClick={() => handleEnagicFlow()}
                        className="w-full h-14 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Rocket className="w-4 h-4" />
                        <span>Yes, I'm Interested in Enagic</span>
                      </button>
                      
                      {/* Not Ready/Interested - Continue Learning Button */}
                      <button
                        onClick={() => {
                          // Redirect to VSL page for All Access Courses Bundle
                          router.push('/vsl-all-access');
                        }}
                        className="w-full h-14 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Not Ready/Interested - Continue Learning</span>
                      </button>
                    </div>
                  </div>
                )}

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

                {/* Choose Your Path Card - Only for Business Blueprint lessons */}
                {(currentLesson.hasEnagicButton || currentLesson.hasSkillsButton) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 md:p-7 mt-4">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-semibold text-[#0F172A] mb-2">Choose Your Path</h3>
                      <p className="text-[#64748B]">Ready to take action or want to explore more lessons first?</p>
                    </div>
                    
                    <div className="space-y-4">
                      {currentLesson.hasEnagicButton && (
                        <button
                          onClick={() => handleEnagicFlow()}
                          className="w-full h-14 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold flex items-center justify-center gap-3 transition-colors"
                        >
                          <Rocket className="w-5 h-5" />
                          <span>I'm Ready! Start Enagic Fast Track</span>
                        </button>
                      )}
                      
                      {currentLesson.hasSkillsButton && (
                        <button
                          onClick={() => handleSkillsFlow()}
                          className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold flex items-center justify-center gap-3 transition-colors"
                        >
                          <GraduationCap className="w-5 h-5" />
                          <span>Continue Learning - Explore More</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4 space-y-6 z-0">
                
                {/* Progress Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 md:p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h3>
                  <div className="grid grid-cols-[72px_1fr] gap-3 items-center">
                    <CircularProgress percentage={course.progress} />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 text-sm">Module Progress</span>
                        <span className="font-semibold text-slate-900 text-sm">1 of {course.moduleCount} lessons</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 text-sm">Course Progress</span>
                        <span className="font-semibold text-slate-900 text-sm">{course.modules.reduce((acc, module) => acc + module.lessons.filter(l => l.isCompleted).length, 0)} of {course.lessonCount} lessons</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 text-sm">XP Earned</span>
                        <span className="font-semibold text-emerald-600 text-sm">+25 XP</span>
                      </div>
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

                {/* What's Next? Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">What's Next?</h3>
                    <p className="text-gray-600 text-sm">Choose how you want to continue</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Primary blue button - Continue to Next Lesson */}
                    {nextLesson && (
                      <button
                        onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                        className="w-full h-14 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Continue to Next Lesson</span>
                      </button>
                    )}
                    
                    {/* Previous Lesson Button */}
                    {previousLesson && (
                      <button
                        onClick={() => router.push(`/courses/${courseId}/${previousLesson.id}`)}
                        className="w-full h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Lesson</span>
                      </button>
                    )}
                    
                    {/* Ghost white button - Back to Course Overview */}
                    <button
                      onClick={() => router.push(`/courses/${courseId}`)}
                      className="w-full h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Course</span>
                    </button>
                    
                    {/* Success mint button - Download Resources */}
                    <button className="w-full h-10 rounded-xl bg-[#E7F6EF] text-[#166534] hover:bg-[#DDF0E8] flex items-center justify-center gap-2 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      <span>Download Resources</span>
                    </button>
                  </div>
                  
                  {/* Lesson Completion - moved to bottom of What's Next */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentLesson.isCompleted}
                        onChange={markLessonComplete}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-700 font-medium">Mark lesson as complete</span>
                    </label>
                  </div>
                </div>



                {/* Upgrade Card - Properly contained */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-sm p-6 text-white relative">
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
                    onClick={() => showUpgradeModal(roleToUpgradeContext(currentRole))}
                    className="w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upgrade Now
                  </button>
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