import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import StatsCards from '../components/dashboard/StatsCards';
import UpgradeButton from '../components/upgrades/UpgradeButton';
import IndividualCourseModal from '../components/courses/IndividualCourseModal';
import TrialUpgradePrompt from '../components/courses/TrialUpgradePrompt';
import { ProgressMilestoneUpgrade } from '../components/upgrades/UpgradePrompts';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { getAllCourses, loadProgressFromStorage, CourseData } from '../lib/api/courses';
import { getFastStats } from '../lib/services/progressService';

export default function AllCourses() {
  const [data, setData] = useState<CourseData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showIndividualPurchase, setShowIndividualPurchase] = useState(false);
  const { isPurchased, purchaseCourse, refreshPurchases, currentRole, canAccessCourse, getCourseUpgradeMessage, purchasedCourses, permissions } = useCourseAccess();

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
    // Check if user can access this course using the new system
    if (canAccessCourse && canAccessCourse(course.id)) {
      if (course.isCompleted) {
        return (
          <a 
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm w-full"
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
            className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm w-full"
          >
            <i className="fas fa-play mr-2"></i>Continue ({completedLessons}/{course.lessonCount})
          </a>
        );
      }
      
      return (
        <a 
          href={`/courses/${course.id}`}
          className="inline-flex items-center justify-center bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm w-full"
        >
          <i className="fas fa-rocket mr-2"></i>Start Course
        </a>
      );
    }
    
    // Check if it's a masterclass that requires individual purchase
    if (purchasedCourses.includes(course.id)) {
      // User has purchased this masterclass individually
      return (
        <a 
          href={`/courses/${course.id}`}
          className="inline-flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:purple-700 transition-colors text-sm w-full"
        >
          <i className="fas fa-crown mr-2"></i>Access Masterclass
        </a>
      );
    }

    // Special masterclasses (require separate purchase)
    const paidMasterclasses = ['advanced-copywriting-masterclass', 'scaling-systems-masterclass'];
    if (paidMasterclasses.includes(course.id)) {
      const coursePrice = 49;
      return (
        <button
          onClick={() => handleIndividualPurchase({...course, price: coursePrice})}
          className="inline-flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm w-full"
        >
          <i className="fas fa-shopping-cart mr-2"></i>Buy Masterclass - ${coursePrice}
        </button>
      );
    }

    // Users without access - show appropriate upgrade option with messaging
    const upgradeMessage = getCourseUpgradeMessage ? getCourseUpgradeMessage(course.id) : 'Upgrade to Access';
    
    return (
      <UpgradeButton 
        variant="secondary" 
        className="text-sm py-2 px-4 w-full font-semibold rounded-lg"
        currentPlan={currentRole}
      >
        <span className="flex items-center justify-center">
          <i className="fas fa-crown mr-2"></i>
          {currentRole === 'trial' ? 'Upgrade to Unlock' : 'Start Trial to Access'}
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
          
          {/* Statistics Cards - Clean Layout */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
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

          {/* Main Content */}
          <div className="px-6 py-6">
            
            {/* Your Learning Journey Header */}
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold text-gray-900">Your Learning Journey</h1>
              <div className="text-sm text-blue-600 font-semibold">18 courses available</div>
            </div>

            {/* Start Here Section - Enhanced for Trial Users */}
            <div className="mb-6">
              {/* Special message for new users (0 courses completed) */}
              {(currentRole === 'free' || currentRole === 'trial') && stats && stats.coursesCompleted === 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-play text-green-600"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-bold text-green-900 mr-2">
                          👋 Welcome! Let's Get You Started
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          <i className="fas fa-video mr-1"></i>Ready to Watch
                        </span>
                      </div>
                      <p className="text-green-800 text-sm mb-3">
                        Click <strong>"Start Course"</strong> on "The Business Blueprint" below to begin your journey. Each lesson is just 10-15 minutes and will transform how you think about building an online business.
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center text-green-700">
                          <i className="fas fa-clock mr-1"></i>
                          <span className="font-medium">Just 10-15 min per lesson</span>
                        </div>
                        <div className="flex items-center text-green-700">
                          <i className="fas fa-trophy mr-1"></i>
                          <span className="font-medium">Earn XP as you learn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress message for users who have started - REMOVED for cleaner UX */}

              <div className="flex items-center mb-3">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                  <i className="fas fa-play"></i>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">Start Here - Foundation Training</h2>
                  <p className="text-xs text-gray-500">Essential courses to build your online business foundation</p>
                </div>
                {(currentRole === 'free' || currentRole === 'trial') && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                    <i className="fas fa-unlock mr-1"></i>INCLUDED
                  </span>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

                  // Special highlighting for Business Blueprint for new users
                  const isFirstCourse = course.id === 'business-blueprint';
                  const isNewUser = stats && stats.coursesCompleted === 0;
                  const shouldHighlight = isFirstCourse && isNewUser;

                  return (
                    <div key={course.id} className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                      shouldHighlight 
                        ? 'border-2 border-green-400 shadow-lg ring-2 ring-green-400 ring-opacity-20' 
                        : 'border border-gray-200'
                    }`}>
                      {shouldHighlight && (
                        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 text-xs font-bold text-center">
                          <i className="fas fa-star mr-1"></i>START HERE FIRST
                        </div>
                      )}
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        <img 
                          src={`https://via.placeholder.com/400x240/${
                            course.id === 'business-blueprint' ? '8B5CF6/FFFFFF' : 
                            course.id === 'discovery-process' ? 'EC4899/FFFFFF' : 
                            '06B6D4/FFFFFF'
                          }?text=${encodeURIComponent(course.title.split(' ')[0])}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Use a simple gradient background with emoji as fallback
                            const gradientClass = course.id === 'business-blueprint' ? 'from-purple-500 to-purple-600' : 
                                                 course.id === 'discovery-process' ? 'from-pink-500 to-pink-600' : 
                                                 'from-cyan-500 to-cyan-600';
                            const emoji = getIcon().includes('building') ? '🏢' : getIcon().includes('search') ? '🔍' : '📈';
                            
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center">
                                  <div class="text-4xl">${emoji}</div>
                                </div>
                              `;
                            }
                          }}
                        />
                        {shouldHighlight && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            <i className="fas fa-arrow-down mr-1"></i>WATCH NOW
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          {getStatusBadge()}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">BEGINNER</span>
                          <span className="text-green-600 font-semibold text-sm">+{course.lessonCount * 15} XP</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span><i className="fas fa-play-circle mr-1"></i>{course.lessonCount} lessons</span>
                          <span><i className="fas fa-clock mr-1"></i>{Math.round(course.lessonCount * 0.17)}h</span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">Progress</span>
                            <span className="font-semibold text-gray-900">{course.progress}%</span>
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

            {/* Enhanced Upgrade Section for Trial/Free Users */}
            {(currentRole === 'free' || currentRole === 'trial') && (
              <div className="mb-6">
                <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Header Section */}
                  <div className="px-6 pt-6 pb-4 text-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-pink-400/10"></div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                        <i className="fas fa-crown text-white text-3xl"></i>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Unlock Advanced Training</h3>
                      <p className="text-purple-100 text-lg max-w-lg mx-auto">
                        Join <span className="text-yellow-300 font-bold">2,847+ entrepreneurs</span> scaling their businesses with our complete system
                      </p>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <div className="px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <i className="fas fa-graduation-cap text-white text-sm"></i>
                          </div>
                          <h4 className="text-white font-bold">Advanced Courses</h4>
                        </div>
                        <ul className="text-purple-100 text-sm space-y-1">
                          <li><i className="fas fa-check text-green-400 mr-2"></i>TikTok Mastery System</li>
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Facebook Advertising Secrets</li>
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Instagram Growth Blueprint</li>
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Sales Funnel Mastery</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <i className="fas fa-users text-white text-sm"></i>
                          </div>
                          <h4 className="text-white font-bold">Premium Features</h4>
                        </div>
                        <ul className="text-purple-100 text-sm space-y-1">
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Expert Directory Access</li>
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Done-For-You Templates</li>
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Priority Support</li>
                          <li><i className="fas fa-check text-green-400 mr-2"></i>Affiliate Portal (30% commissions)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Value Proposition */}
                    <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-center text-center">
                        <div className="mr-4">
                          <div className="text-yellow-300 text-lg font-bold">$2,497 Value</div>
                          <div className="text-purple-100 text-sm">Course Library</div>
                        </div>
                        <div className="text-white text-2xl">+</div>
                        <div className="mx-4">
                          <div className="text-yellow-300 text-lg font-bold">$997 Value</div>
                          <div className="text-purple-100 text-sm">Expert Directory</div>
                        </div>
                        <div className="text-white text-2xl">=</div>
                        <div className="ml-4">
                          <div className="text-green-300 text-xl font-bold">$3,494 Total</div>
                          <div className="text-purple-100 text-sm">Your Price: ${currentRole === 'trial' ? '99/mo' : '$1 trial'}</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                      {currentRole === 'trial' ? (
                        <div>
                          <TrialUpgradePrompt 
                            message="Your trial expires soon - upgrade now to keep access to all courses and unlock advanced training!"
                          />
                          <div className="mt-3 text-purple-200 text-sm">
                            <i className="fas fa-clock mr-1"></i>
                            Limited time: Complete Start Here courses and save 50% on annual plan
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto mb-3">
                            <UpgradeButton 
                              variant="secondary" 
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 px-8 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
                              currentPlan={currentRole}
                            >
                              <i className="fas fa-rocket mr-2"></i>Start $1 Trial Now
                            </UpgradeButton>
                          </div>
                          <div className="text-purple-200 text-sm">
                            <i className="fas fa-shield-alt mr-1"></i>
                            30-day money-back guarantee • Cancel anytime • No setup fees
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Training Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">Advanced Training</h2>
                  <p className="text-xs text-gray-500">Specialized courses for scaling your business</p>
                </div>
                {(currentRole === 'free' || currentRole === 'trial') ? (
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                    <i className="fas fa-lock mr-1"></i>UPGRADE REQUIRED
                  </span>
                ) : (
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                    <i className="fas fa-unlock mr-1"></i>INCLUDED
                  </span>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
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
                    <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        <img 
                          src={`https://via.placeholder.com/400x240/${
                            course.id === 'tiktok-mastery' ? '10B981/FFFFFF' : 
                            course.id === 'facebook-advertising' ? 'F59E0B/FFFFFF' : 
                            course.id === 'instagram-marketing' ? '6B7280/FFFFFF' : 
                            course.id === 'sales-funnel-mastery' ? 'F97316/FFFFFF' : 
                            '8B5CF6/FFFFFF'
                          }?text=${encodeURIComponent(course.title.split(' ')[0])}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Use simple gradient background with emoji as fallback
                            const gradientClass = course.id === 'tiktok-mastery' ? 'from-green-500 to-green-600' : 
                                                 course.id === 'facebook-advertising' ? 'from-orange-500 to-orange-600' : 
                                                 course.id === 'instagram-marketing' ? 'from-gray-500 to-gray-600' : 
                                                 course.id === 'sales-funnel-mastery' ? 'from-orange-500 to-yellow-500' : 'from-purple-500 to-purple-600';
                            const emoji = course.id === 'tiktok-mastery' ? '🎵' : 
                                         course.id === 'facebook-advertising' ? '📱' : 
                                         course.id === 'instagram-marketing' ? '📸' : 
                                         course.id === 'sales-funnel-mastery' ? '🧠' : '👥';
                            
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center">
                                  <div class="text-4xl">${emoji}</div>
                                </div>
                              `;
                            }
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          {getStatusBadge()}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">{getDifficulty()}</span>
                          <span className="text-green-600 font-semibold text-sm">+{course.lessonCount * 20} XP</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 flex-1 leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span><i className="fas fa-play-circle mr-1"></i>{course.lessonCount} lessons</span>
                          <span><i className="fas fa-clock mr-1"></i>{Math.round(course.lessonCount * 0.2)}h</span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">Progress</span>
                            <span className="font-semibold text-gray-900">{course.progress}%</span>
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

            {/* Masterclass Training Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">Masterclass Training</h2>
                  <p className="text-xs text-gray-500">Premium courses for advanced business growth</p>
                </div>
                <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-300">
                  <i className="fas fa-star mr-1"></i>PREMIUM
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {/* Email Marketing Secrets */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src="https://via.placeholder.com/400x240/EC4899/FFFFFF?text=Email+Marketing"
                      alt="Email Marketing Secrets"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                              <div class="text-4xl">📧</div>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">LOCKED</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300">
                        <i className="fas fa-crown mr-1"></i>PREMIUM
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">INTERMEDIATE</span>
                      <span className="text-yellow-600 font-semibold text-sm">+400 XP</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">Email Marketing Secrets</h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">Build profitable email sequences and automated funnels that convert</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>16 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>5h</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-semibold text-gray-900">Locked</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIndividualPurchase({
                        id: 'email-marketing-secrets',
                        title: 'Email Marketing Secrets',
                        description: 'Build profitable email sequences and automated funnels that convert',
                        lessonCount: 16,
                        price: 49
                      })}
                      className="w-full inline-flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>Buy Masterclass - $49
                    </button>
                  </div>
                </div>

                {/* Advanced Copywriting Masterclass */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src="https://via.placeholder.com/400x240/8B5CF6/FFFFFF?text=Copywriting"
                      alt="Advanced Copywriting Masterclass"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <div class="text-4xl">✍️</div>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">LOCKED</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300">
                        <i className="fas fa-crown mr-1"></i>PREMIUM
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">ADVANCED</span>
                      <span className="text-yellow-600 font-semibold text-sm">+500 XP</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">Advanced Copywriting Masterclass</h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">Master the art of persuasive writing that sells and converts at scale</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>20 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>8h</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-semibold text-gray-900">Locked</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIndividualPurchase({
                        id: 'advanced-copywriting-masterclass',
                        title: 'Advanced Copywriting Masterclass',
                        description: 'Master the art of persuasive writing that sells and converts at scale',
                        lessonCount: 20,
                        price: 97
                      })}
                      className="w-full inline-flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>Buy Masterclass - $97
                    </button>
                  </div>
                </div>

                {/* Scaling Systems Masterclass */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src="https://via.placeholder.com/400x240/059669/FFFFFF?text=Scaling+Systems"
                      alt="Scaling Systems Masterclass"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                              <div class="text-4xl">⚙️</div>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">LOCKED</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300">
                        <i className="fas fa-crown mr-1"></i>PREMIUM
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">EXPERT</span>
                      <span className="text-yellow-600 font-semibold text-sm">+600 XP</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">Scaling Systems Masterclass</h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">Build automated systems and processes to scale your business to 7-figures</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>24 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>12h</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-semibold text-gray-900">Locked</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIndividualPurchase({
                        id: 'scaling-systems-masterclass',
                        title: 'Scaling Systems Masterclass',
                        description: 'Build automated systems and processes to scale your business to 7-figures',
                        lessonCount: 24,
                        price: 197
                      })}
                      className="w-full inline-flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>Buy Masterclass - $197
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
