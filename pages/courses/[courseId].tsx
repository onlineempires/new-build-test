import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';
import { getCourse, updateLessonProgress, Course, Lesson } from '../../lib/api/courses';

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showVideo, setShowVideo] = useState(false);

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
      
      // Set first incomplete lesson as current
      for (const module of courseData.modules) {
        const firstIncomplete = module.lessons.find(l => !l.isCompleted);
        if (firstIncomplete) {
          setCurrentLesson(firstIncomplete);
          break;
        }
      }
      
      // If all lessons complete, set first lesson
      if (!currentLesson && courseData.modules.length > 0 && courseData.modules[0].lessons.length > 0) {
        setCurrentLesson(courseData.modules[0].lessons[0]);
      }
    } catch (err) {
      console.error('Failed to load course:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!course || !currentLesson) return;
    
    try {
      await updateLessonProgress(course.id, lessonId, true);
      
      // Update local state
      setCourse(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.modules = updated.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
          )
        }));
        return updated;
      });

      setCurrentLesson(prev => prev ? { ...prev, isCompleted: true } : prev);
      
      // Calculate new progress
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedLessons = course.modules.reduce((acc, module) => 
        acc + module.lessons.filter(l => l.isCompleted || l.id === lessonId).length, 0
      );
      const newProgress = Math.round((completedLessons / totalLessons) * 100);
      
      setCourse(prev => prev ? { ...prev, progress: newProgress } : prev);
      
    } catch (err) {
      console.error('Failed to update lesson progress:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="lg:col-span-2 bg-gray-200 h-96 rounded-lg"></div>
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
        <div className="p-4 sm:p-6">
          
          {/* Course Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => router.push('/courses')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Courses
              </button>
              
              <div className="text-sm text-gray-600">
                {course.progress}% Complete
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start mb-4 lg:mb-0">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover mr-4 flex-shrink-0"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-2">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">{course.moduleCount} Modules</span>
                    <span>{course.lessonCount} Lessons</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-64">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Course Content Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Course Content</h3>
                
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center mr-2">
                          {moduleIndex + 1}
                        </span>
                        {module.title}
                      </h4>
                      
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              router.push(`/courses/${courseId}/${lesson.id}`);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                              currentLesson?.id === lesson.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="w-4 h-4 mr-2">
                                  {lesson.isCompleted ? (
                                    <i className="fas fa-check-circle text-green-500"></i>
                                  ) : (
                                    <i className="fas fa-play-circle text-gray-400"></i>
                                  )}
                                </span>
                                <span className="truncate">{lessonIndex + 1}. {lesson.title}</span>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDuration(lesson.duration)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                
                {currentLesson && (
                  <>
                    {/* Video Area */}
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      {showVideo ? (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <div className="text-center">
                            <i className="fas fa-play text-6xl mb-4 opacity-50"></i>
                            <p className="text-lg">Video Player</p>
                            <p className="text-sm opacity-75">Playing: {currentLesson.title}</p>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowVideo(true)}
                          className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                        >
                          <i className="fas fa-play text-2xl ml-1"></i>
                        </button>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-1">{currentLesson.title}</h2>
                          <p className="text-gray-600">{currentLesson.description}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentLesson.isCompleted}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleLessonComplete(currentLesson.id);
                                }
                              }}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-2 transition-colors ${
                              currentLesson.isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400'
                            }`}>
                              {currentLesson.isCompleted && (
                                <i className="fas fa-check text-sm"></i>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Mark as Complete
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Lesson Navigation */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                          <i className="fas fa-chevron-left mr-2"></i>
                          Previous Lesson
                        </button>
                        
                        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Next Lesson
                          <i className="fas fa-chevron-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}