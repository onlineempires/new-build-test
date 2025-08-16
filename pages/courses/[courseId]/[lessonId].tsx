import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../../components/layout/AppLayout';
import { getCourse, updateLessonProgress, Course, Lesson, Module } from '../../../lib/api/courses';

interface LessonPageData {
  course: Course;
  currentLesson: Lesson;
  currentModule: Module;
  lessonIndex: number;
  moduleIndex: number;
  nextLesson?: Lesson;
  prevLesson?: Lesson;
}

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = router.query;
  const [data, setData] = useState<LessonPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (courseId && lessonId) {
      loadLessonData(courseId as string, lessonId as string);
    }
  }, [courseId, lessonId]);

  const loadLessonData = async (cId: string, lId: string) => {
    try {
      setLoading(true);
      setError(null);
      const course = await getCourse(cId);
      
      // Find current lesson and module
      let currentLesson: Lesson | null = null;
      let currentModule: Module | null = null;
      let moduleIndex = -1;
      let lessonIndex = -1;
      
      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const module = course.modules[mIdx];
        for (let lIdx = 0; lIdx < module.lessons.length; lIdx++) {
          if (module.lessons[lIdx].id === lId) {
            currentLesson = module.lessons[lIdx];
            currentModule = module;
            moduleIndex = mIdx;
            lessonIndex = lIdx;
            break;
          }
        }
        if (currentLesson) break;
      }

      if (!currentLesson || !currentModule) {
        throw new Error('Lesson not found');
      }

      // Find next and previous lessons
      let nextLesson: Lesson | undefined;
      let prevLesson: Lesson | undefined;

      // Get all lessons in order
      const allLessons: Array<{lesson: Lesson, moduleIdx: number, lessonIdx: number}> = [];
      course.modules.forEach((module, mIdx) => {
        module.lessons.forEach((lesson, lIdx) => {
          allLessons.push({ lesson, moduleIdx: mIdx, lessonIdx: lIdx });
        });
      });

      const currentPosition = allLessons.findIndex(item => item.lesson.id === lId);
      if (currentPosition > 0) {
        prevLesson = allLessons[currentPosition - 1].lesson;
      }
      if (currentPosition < allLessons.length - 1) {
        nextLesson = allLessons[currentPosition + 1].lesson;
      }

      setData({
        course,
        currentLesson,
        currentModule,
        lessonIndex,
        moduleIndex,
        nextLesson,
        prevLesson
      });
      setIsCompleted(currentLesson.isCompleted);
      
    } catch (err) {
      console.error('Failed to load lesson:', err);
      setError('Failed to load lesson data');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async () => {
    if (!data) return;
    
    try {
      await updateLessonProgress(data.course.id, data.currentLesson.id, true);
      setIsCompleted(true);
    } catch (err) {
      console.error('Failed to update lesson progress:', err);
    }
  };

  const navigateToLesson = (lesson: Lesson) => {
    router.push(`/courses/${courseId}/${lesson.id}`);
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
            <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
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

  return (
    <>
      <Head>
        <title>{data.currentLesson.title} - {data.course.title} - Digital Era</title>
        <meta name="description" content={data.currentLesson.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}
        notifications={[]}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Header Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Course
                </button>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                    {data.moduleIndex + 1}
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">{data.currentModule.title}</h1>
                    <p className="text-sm text-gray-500">
                      Lesson {data.lessonIndex + 1} of {data.currentModule.lessons.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {data.course.progress}% Course Complete
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                  
                  {/* Video Player */}
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <i className="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                      <p className="text-lg font-medium">Video Player</p>
                      <p className="text-sm opacity-75">{data.currentLesson.title}</p>
                      <p className="text-xs opacity-50 mt-2">{formatDuration(data.currentLesson.duration)}</p>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">{data.currentLesson.title}</h1>
                      <p className="text-gray-600 text-lg leading-relaxed">{data.currentLesson.description}</p>
                    </div>

                    {/* Lesson Transcript/Content Area */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <h3 className="font-semibold text-gray-900 mb-4">Lesson Content</h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {data.currentLesson.transcripts || 
                          "In this lesson, you'll learn the fundamental concepts and practical strategies that will help you master this topic. We'll cover key techniques, best practices, and real-world applications that you can implement immediately."}
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                          This comprehensive lesson is designed to give you actionable insights and practical knowledge that you can apply to your own projects and business goals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  
                  {/* Lesson Progress */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Lesson Progress</h3>
                    
                    <div className="mb-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleLessonComplete();
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}>
                          {isCompleted && (
                            <i className="fas fa-check text-xs"></i>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">Mark lesson as complete</span>
                      </label>
                    </div>

                    {/* Continue Button */}
                    {data.nextLesson && (
                      <button
                        onClick={() => navigateToLesson(data.nextLesson!)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
                      >
                        Continue to Next Lesson
                      </button>
                    )}

                    {/* Previous/Next Navigation */}
                    <div className="flex gap-2">
                      {data.prevLesson && (
                        <button
                          onClick={() => navigateToLesson(data.prevLesson!)}
                          className="flex-1 text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-sm"
                        >
                          <i className="fas fa-chevron-left mr-1"></i>
                          Previous
                        </button>
                      )}
                      {data.nextLesson && (
                        <button
                          onClick={() => navigateToLesson(data.nextLesson!)}
                          className="flex-1 text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-sm"
                        >
                          Next
                          <i className="fas fa-chevron-right ml-1"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Upgrade Banner - Bottom Right Corner Seamless Integration */}
                  {showUpgradeBanner && (
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-lg">
                      <button
                        onClick={() => setShowUpgradeBanner(false)}
                        className="float-right text-white hover:text-gray-200 transition-colors mb-2"
                      >
                        <i className="fas fa-times text-sm"></i>
                      </button>
                      
                      <div className="mb-4">
                        <div className="inline-flex items-center bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold mb-3">
                          <i className="fas fa-crown mr-1"></i>
                          LIMITED TIME
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                        <p className="text-purple-100 text-sm mb-4">Get unlimited access to all courses</p>
                        
                        <div className="text-center mb-4">
                          <span className="text-3xl font-bold">$799</span>
                          <span className="text-purple-200 text-lg">/year</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                        Upgrade Now
                      </button>
                    </div>
                  )}

                  {/* Course Modules Overview */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Course Modules</h3>
                    
                    <div className="space-y-3">
                      {data.course.modules.map((module, mIdx) => (
                        <div key={module.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <div className={`flex items-center p-2 rounded-lg ${
                            mIdx === data.moduleIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}>
                            <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full text-xs font-bold flex items-center justify-center mr-3">
                              {mIdx + 1}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{module.title}</div>
                              <div className="text-xs text-gray-500">
                                {module.lessons.length} lessons
                              </div>
                            </div>
                          </div>
                          
                          {mIdx === data.moduleIndex && (
                            <div className="ml-9 mt-2 space-y-1">
                              {module.lessons.map((lesson, lIdx) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => navigateToLesson(lesson)}
                                  className={`w-full text-left p-2 rounded text-xs transition-colors ${
                                    lesson.id === data.currentLesson.id
                                      ? 'bg-blue-100 text-blue-700 font-medium'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <span className="w-3 h-3 mr-2">
                                      {lesson.isCompleted ? (
                                        <i className="fas fa-check-circle text-green-500"></i>
                                      ) : (
                                        <i className="fas fa-circle text-gray-300"></i>
                                      )}
                                    </span>
                                    <span className="truncate">{lIdx + 1}. {lesson.title}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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