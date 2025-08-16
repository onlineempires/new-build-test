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

  const calculateProgress = () => {
    if (!data) return { courseProgress: 0, moduleProgress: 0, completedLessons: 0, totalLessons: 0, completedInModule: 0, totalInModule: 0 };
    
    const totalLessons = data.course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = data.course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(l => l.isCompleted).length, 0
    );
    
    const totalInModule = data.currentModule.lessons.length;
    const completedInModule = data.currentModule.lessons.filter(l => l.isCompleted).length;
    
    return {
      courseProgress: Math.round((completedLessons / totalLessons) * 100),
      moduleProgress: Math.round((completedInModule / totalInModule) * 100),
      completedLessons,
      totalLessons,
      completedInModule,
      totalInModule
    };
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
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

  const progress = calculateProgress();

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
          
          {/* Breadcrumb Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <nav className="flex text-sm text-gray-500">
              <button 
                onClick={() => router.push('/')}
                className="hover:text-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <span className="mx-2">></span>
              <button 
                onClick={() => router.push('/courses')}
                className="hover:text-gray-700 transition-colors"
              >
                All Courses
              </button>
              <span className="mx-2">></span>
              <button 
                onClick={() => router.push(`/courses/${courseId}`)}
                className="hover:text-gray-700 transition-colors"
              >
                {data.course.title}
              </button>
              <span className="mx-2">></span>
              <span className="text-gray-900 font-medium">{data.currentLesson.title}</span>
            </nav>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Video Player and Content */}
              <div className="lg:col-span-2">
                
                {/* Video Player */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="aspect-video bg-gray-900 relative">
                    {/* Video Player Interface */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop')`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-800 hover:bg-opacity-100 transition-all">
                          <i className="fas fa-play text-xl ml-1"></i>
                        </button>
                      </div>
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <div className="flex items-center justify-between text-white text-sm mb-2">
                          <span>3:44 / {formatDuration(data.currentLesson.duration)}</span>
                          <div className="flex items-center space-x-2">
                            <button><i className="fas fa-volume-up"></i></button>
                            <button><i className="fas fa-expand"></i></button>
                            <button><i className="fas fa-ellipsis-v"></i></button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Overview</h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {data.currentLesson.description || 
                    "In this lesson, you'll learn how to identify and understand your target market. We'll cover market research techniques, customer personas, and how to position your business for maximum impact in your chosen niche."}
                  </p>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Takeaways:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span className="text-gray-700">How to conduct effective market research</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span className="text-gray-700">Creating detailed customer personas</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span className="text-gray-700">Positioning strategies for your business</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  
                  {/* Your Progress */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">Your Progress</h3>
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
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
                          <span className="text-sm font-bold text-blue-600">{progress.courseProgress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Module Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {progress.completedInModule} of {progress.totalInModule} lessons
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Course Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {progress.completedLessons} of {progress.totalLessons} lessons
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">XP Earned</span>
                        <span className="text-sm font-medium text-green-600">+50 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Materials */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Lesson Materials</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-file-pdf text-red-600 text-sm"></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Market Research Works...</div>
                            <div className="text-xs text-gray-500">PDF • 1.2 MB</div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-file-word text-blue-600 text-sm"></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Customer Persona Temp...</div>
                            <div className="text-xs text-gray-500">DOCX • 856 KB</div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Completion */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-4">
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

                    {/* Upgrade Banner - Directly Below Blue Button */}
                    {showUpgradeBanner && (
                      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
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