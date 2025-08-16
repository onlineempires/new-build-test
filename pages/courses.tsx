import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import StatsCards from '../components/dashboard/StatsCards';
import UpgradeButton from '../components/upgrades/UpgradeButton';
import IndividualCourseModal from '../components/courses/IndividualCourseModal';
import { ProgressMilestoneUpgrade } from '../components/upgrades/UpgradePrompts';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { useUserRole } from '../contexts/UserRoleContext';
import { getAllCourses, loadProgressFromStorage, CourseData } from '../lib/api/courses';
import { getFastStats } from '../lib/services/progressService';

export default function AllCourses() {
  const [data, setData] = useState<CourseData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showIndividualPurchase, setShowIndividualPurchase] = useState(false);
  const { isPurchased, purchaseCourse, refreshPurchases, currentRole } = useCourseAccess();
  const { permissions } = useUserRole();

  const handleIndividualPurchase = (course: any) => {
    setSelectedCourse(course);
    setShowIndividualPurchase(true);
  };

  const handlePurchaseSuccess = (courseId: string) => {
    purchaseCourse(courseId);
    refreshPurchases(); // Refresh state from localStorage
    setShowIndividualPurchase(false);
    setSelectedCourse(null);
    
    // Force page refresh to ensure UI updates correctly
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Helper function to render course button based on status
  const getCourseButton = (course: any) => {
    // Check if user has purchased this individual course
    if (isPurchased(course.id)) {
      if (course.isCompleted) {
        return (
          <a 
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded font-medium hover:bg-green-600 transition-colors text-sm w-full"
          >
            <i className="fas fa-redo mr-2"></i>Completed - Watch Again
          </a>
        );
      }
      
      if (course.progress > 0) {
        const completedLessons = Math.round((course.progress / 100) * course.lessonCount);
        return (
          <a 
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors text-sm w-full"
          >
            <i className="fas fa-play mr-2"></i>Continue Learning ({completedLessons}/{course.lessonCount})
          </a>
        );
      }
      
      return (
        <a 
          href={`/courses/${course.id}`}
          className="inline-flex items-center justify-center bg-gray-600 text-white py-2 px-4 rounded font-medium hover:bg-gray-700 transition-colors text-sm w-full"
        >
          <i className="fas fa-rocket mr-2"></i>Start Course
        </a>
      );
    }
    
    // Special masterclasses (paid only, no premium option)
    const paidMasterclasses = ['email-marketing-secrets', 'advanced-funnel-mastery'];
    if (paidMasterclasses.includes(course.id)) {
      const coursePrice = 49;
      return (
        <button
          onClick={() => handleIndividualPurchase({...course, price: coursePrice})}
          className="inline-flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded font-medium hover:bg-orange-600 transition-colors text-sm w-full"
        >
          <i className="fas fa-shopping-cart mr-2"></i>Buy Masterclass - ${coursePrice}
        </button>
      );
    }
    
    // Regular courses - check if user has access to all courses
    if (permissions.canAccessAllCourses) {
      // User has paid access - show course access button
      if (course.isCompleted) {
        return (
          <a 
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded font-medium hover:bg-green-600 transition-colors text-sm w-full"
          >
            <i className="fas fa-redo mr-2"></i>Completed - Watch Again
          </a>
        );
      }
      
      if (course.progress > 0) {
        const completedLessons = Math.round((course.progress / 100) * course.lessonCount);
        return (
          <a 
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors text-sm w-full"
          >
            <i className="fas fa-play mr-2"></i>Continue Learning ({completedLessons}/{course.lessonCount})
          </a>
        );
      }
      
      return (
        <a 
          href={`/courses/${course.id}`}
          className="inline-flex items-center justify-center bg-gray-600 text-white py-2 px-4 rounded font-medium hover:bg-gray-700 transition-colors text-sm w-full"
        >
          <i className="fas fa-rocket mr-2"></i>Start Course
        </a>
      );
    }

    // Users without full access - show appropriate upgrade option
    return (
      <UpgradeButton 
        variant="secondary" 
        className="text-sm py-2 px-4 w-full"
        currentPlan={currentRole}
      >
        <span className="flex items-center justify-center">
          <i className="fas fa-crown mr-2"></i>
          {currentRole === 'free' || currentRole === 'trial' ? 'Upgrade to Access' : 'Unlock with Premium'}
        </span>
      </UpgradeButton>
    );
  };

  useEffect(() => {
    // Load progress from storage first
    loadProgressFromStorage();
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load both courses data and stats in parallel for better performance
      const [coursesData, fastStats] = await Promise.all([
        getAllCourses(),
        getFastStats()
      ]);
      setData(coursesData);
      setStats(fastStats);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
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
            {error || 'Failed to load courses data'}
            <button 
              onClick={loadCourses}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>All Courses - Online Empires</title>
        <meta name="description" content="Browse all courses available in Online Empires" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={data.user} 
        notifications={data.notifications}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gray-50 pb-8">
          
          {/* Statistics Cards */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
            <StatsCards stats={stats || {
              coursesCompleted: 0,
              coursesTotal: 0,
              learningStreakDays: 0,
              commissions: 0,
              newLeads: 0,
              xpPoints: 0,
              level: 'Rookie'
            }} />
          </div>

          {/* Progress-based upgrade prompts - only for limited access users */}
          {stats && stats.coursesCompleted >= 2 && !permissions.canAccessAllCourses && (
            <div className="px-6 pt-4">
              <ProgressMilestoneUpgrade milestone={`${stats.coursesCompleted} courses completed`} />
            </div>
          )}

          {/* Compact Achievement Banner */}
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <i className="fas fa-trophy text-white text-sm"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm sm:text-base font-bold truncate">"Course Crusher" Unlocked!</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full ml-2 flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold">+350 XP</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8">
            
            {/* Your Learning Journey Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Your Learning Journey</h1>
              <div className="text-sm text-blue-600 font-medium">18 courses available</div>
            </div>

            {/* Start Here Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  1
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Start Here</h2>
                <span className="ml-3 text-sm text-gray-500">Required</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                {data?.startHereCourses.map((course, index) => {
                  const getStatusBadge = () => {
                    if (course.isCompleted) {
                      return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">COMPLETED</span>;
                    }
                    if (course.progress > 0) {
                      return <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">IN PROGRESS</span>;
                    }
                    return <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">NOT STARTED</span>;
                  };

                  const getIcon = () => {
                    if (course.id === 'business-blueprint') return 'fas fa-building';
                    if (course.id === 'discovery-process') return 'fas fa-search';
                    return 'fas fa-arrow-right';
                  };

                  const getGradient = () => {
                    if (course.id === 'business-blueprint') return 'from-purple-500 to-purple-600';
                    if (course.id === 'discovery-process') return 'from-pink-400 to-pink-500';
                    return 'from-cyan-400 to-cyan-500';
                  };

                  return (
                    <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className={`h-32 bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
                        <i className={`${getIcon()} text-white text-3xl`}></i>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          {getStatusBadge()}
                          <span className="text-xs text-gray-500">BEGINNER</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span><i className="fas fa-play-circle mr-1"></i>{course.lessonCount}&nbsp;lessons</span>
                          <span><i className="fas fa-clock mr-1"></i>{Math.round(course.lessonCount * 0.17)}&nbsp;hours</span>
                          <span className="text-green-600 font-medium">+{course.lessonCount * 15}&nbsp;XP</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${course.isCompleted ? "bg-green-500" : course.progress > 0 ? "bg-blue-600" : "bg-gray-400"}`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        {getCourseButton(course)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advanced Training Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  2
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Advanced Training</h2>
                <span className="ml-3 text-sm text-purple-600 font-medium">Skill Builder</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {data?.socialMediaCourses.map((course, index) => {
                  const getStatusBadge = () => {
                    if (course.isCompleted) {
                      return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">COMPLETED</span>;
                    }
                    if (course.progress > 0) {
                      return <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">IN PROGRESS</span>;
                    }
                    return <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">NOT STARTED</span>;
                  };

                  const getIcon = () => {
                    if (course.id === 'tiktok-mastery') return 'fab fa-tiktok';
                    if (course.id === 'facebook-advertising') return 'fab fa-facebook';
                    if (course.id === 'instagram-marketing') return 'fab fa-instagram';
                    if (course.id === 'sales-funnel-mastery') return 'fas fa-brain';
                    return 'fas fa-users';
                  };

                  const getGradient = () => {
                    if (course.id === 'tiktok-mastery') return 'from-green-400 to-green-500';
                    if (course.id === 'facebook-advertising') return 'from-pink-400 to-orange-400';
                    if (course.id === 'instagram-marketing') return 'from-gray-400 to-gray-500';
                    if (course.id === 'sales-funnel-mastery') return 'from-orange-400 to-yellow-400';
                    return 'from-purple-500 to-purple-600';
                  };

                  const getDifficulty = () => {
                    if (course.id === 'tiktok-mastery' || course.id === 'instagram-marketing') return 'INTERMEDIATE';
                    return 'ADVANCED';
                  };

                  return (
                    <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                      <div className={`h-32 bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
                        <i className={`${getIcon()} text-white text-3xl`}></i>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          {getStatusBadge()}
                          <span className="text-xs text-gray-500">{getDifficulty()}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 flex-1">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span><i className="fas fa-play-circle mr-1"></i>{course.lessonCount} lessons</span>
                          <span><i className="fas fa-clock mr-1"></i>{Math.round(course.lessonCount * 0.2)} hours</span>
                          <span className="text-green-600 font-medium">+{course.lessonCount * 20} XP</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${course.isCompleted ? "bg-green-500" : course.progress > 0 ? "bg-blue-600" : "bg-gray-400"}`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        {getCourseButton(course)}
                      </div>
                    </div>
                  );
                })}
                
                {/* Add Email Marketing Secrets as a locked course */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                    <i className="fas fa-envelope text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">LOCKED</span>
                      <span className="text-xs text-gray-500">INTERMEDIATE</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Marketing Secrets</h3>
                    <p className="text-sm text-gray-600 mb-3">Build profitable email sequences and automated funnels</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>16 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>5 hours</span>
                      <span className="text-yellow-600 font-medium">+400 XP</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>Locked</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIndividualPurchase({
                        id: 'email-marketing-secrets',
                        title: 'Email Marketing Secrets',
                        description: 'Build profitable email sequences and automated funnels',
                        lessonCount: 16,
                        price: 49
                      })}
                      className="w-full inline-flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded font-medium hover:bg-orange-600 transition-colors text-sm"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>Buy Masterclass - $49
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 13 Preview */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Level 13 Preview</h3>
              <p className="text-purple-100 mb-4">Complete 2 more courses to unlock advanced business scaling strategies!</p>
              
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>XP Progress</span>
                  <span>{data ? `${3450 - data.stats.xpPoints} XP needed for next level` : '153 XP needed for next level'}</span>
                </div>
                <div className="w-full bg-purple-800 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full" style={{ width: data ? `${Math.min(100, (data.stats.xpPoints / 3450) * 100)}%` : '75%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Course Purchase Modal */}
          {selectedCourse && (
            <IndividualCourseModal
              isOpen={showIndividualPurchase}
              onClose={() => {
                setShowIndividualPurchase(false);
                setSelectedCourse(null);
              }}
              course={selectedCourse}
              onPurchaseSuccess={handlePurchaseSuccess}
            />
          )}
        </div>
      </AppLayout>
    </>
  );
}
