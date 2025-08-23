import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '../components/layout/AppLayout';

import StatsCards from '../components/dashboard/StatsCards';
import ContinueJourney from '../components/dashboard/ContinueJourney';
import StartHereGridGated from '../components/dashboard/StartHereGridGated';
import RecentAchievements from '../components/dashboard/RecentAchievements';
import OptimizedTrialUserDashboard from '../components/dashboard/OptimizedTrialUserDashboard';

import FeedbackModal from '../components/dashboard/FeedbackModal';
import LevelBadge from '../components/ui/LevelBadge';
import { StreakUpgradePrompt } from '../components/upgrades/UpgradePrompts';
import { getDashboard, DashboardData } from '../lib/api/dashboard';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';
import { UserFlags } from '../lib/access';
import { useUserFlags } from '../lib/userFlags';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentRole } = useCourseAccess();
  const [error, setError] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { showSuccess, notifyAchievement } = useNotificationHelpers();
  
  // Get user flags for gating (includes dev tools integration)
  const userFlags = useUserFlags();
  
  // Debug role detection
  console.log('🔍 Dashboard userFlags.role:', userFlags.role);
  console.log('🔍 Dashboard localStorage dev.role:', typeof window !== 'undefined' ? localStorage.getItem('dev.role') : 'SSR');

  useEffect(() => {
    loadDashboard();
    
    // Pre-load courses data for faster navigation
    import('../lib/services/progressService').then(({ getCachedCourseData }) => {
      getCachedCourseData().catch(() => {
        // Ignore errors in background preload
      });
    });
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await getDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };



  const handleFeedbackSuccess = () => {
    showSuccess(
      'Feedback Sent! 📝',
      'Thank you for your feedback! We\'ll review it and get back to you soon.',
      'View Status',
      '/support'
    );
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="animate-pulse">
            {/* Welcome Banner Skeleton */}
            <div className="h-20 sm:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-6"></div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-24 sm:h-32 rounded-xl"></div>
              ))}
            </div>
            
            {/* Content Skeletons */}
            <div className="space-y-4">
              <div className="bg-gray-200 h-40 sm:h-48 rounded-xl"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-48 sm:h-64 rounded-xl"></div>
                ))}
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
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl shadow-sm">
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle text-red-500 mt-0.5 mr-3"></i>
              <div className="flex-1">
                <div className="font-medium mb-1">Unable to load dashboard</div>
                <div className="text-sm text-red-600 mb-3">{error || 'Failed to load dashboard data'}</div>
                <button 
                  onClick={loadDashboard}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Check if user is trial/free user to show optimized dashboard
  // Default to 'free' if no role is set (for trial users)
  const userRole = userFlags.role || 'free';
  const isTrialOrFreeUser = userRole === 'free' || userRole === 'trial' || userRole === 'downsell';
  
  console.log('🔍 Dashboard userRole:', userRole);
  console.log('🔍 Dashboard isTrialOrFreeUser:', isTrialOrFreeUser);

  return (
    <>
      <Head>
        <title>{isTrialOrFreeUser ? 'Welcome to Your Business Transformation! - Digital Era' : 'Dashboard - Digital Era'}</title>
        <meta name="description" content="Digital Era Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={data.user} 
        onFeedbackClick={() => setFeedbackModalOpen(true)}
      >
        {/* Show OptimizedTrialUserDashboard for trial/free users */}
        {isTrialOrFreeUser ? (
          <OptimizedTrialUserDashboard 
            onVideoComplete={(videoId) => {
              console.log('Video completed:', videoId);
            }}
          />
        ) : (
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Welcome Banner - Smaller and More Discreet */}
            {data.stats.coursesCompleted > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                      {data.user.name ? data.user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'AK'}
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">Hello, {data.user.name.split(' ')[0]}!</h1>
                      <p className="text-gray-600 text-sm">Welcome back to The Digital Era</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <LevelBadge completedCourses={data.stats.coursesCompleted} size="sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards - Enhanced Visibility */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                    <i className="fas fa-graduation-cap text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.stats.coursesCompleted}</div>
                    <div className="text-sm font-medium text-gray-600">Completed</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                    <i className="fas fa-fire text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.stats.learningStreakDays}</div>
                    <div className="text-sm font-medium text-gray-600">Day Streak</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <i className="fas fa-star text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.stats.xpPoints}</div>
                    <div className="text-sm font-medium text-gray-600">XP Points</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-3">
                    <i className="fas fa-level-up-alt text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.stats.level}</div>
                    <div className="text-sm font-medium text-gray-600">Level</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slim Green Tips Bar */}
            <div className="bg-green-50 rounded-xl py-3 px-4 mt-4 mb-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center text-green-700 text-sm">
                <i className="fas fa-play mr-2"></i>
                <span className="font-medium">15 min lessons</span>
              </div>
              <div className="flex items-center text-green-700 text-sm">
                <i className="fas fa-star mr-2"></i>
                <span className="font-medium">Earn XP rewards</span>
              </div>
              <div className="flex items-center text-green-700 text-sm">
                <i className="fas fa-trophy mr-2"></i>
                <span className="font-medium">Track progress</span>
              </div>
            </div>

            {/* Main Content - Conditional based on user progress */}
            {data.stats.coursesCompleted === 0 ? (
              /* NEW USER EXPERIENCE - Clean and Action-Oriented */
              <>
                {/* Compact Start Here CTA */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 md:p-8 text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Here</h2>
                  <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                    Kick off with The Business Blueprint – it's just 15 minutes and will change how you think about online business.
                  </p>
                  <Link href="/courses/business-blueprint">
                    <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 px-6 rounded-2xl transition-colors w-full sm:w-auto inline-flex items-center justify-center">
                      Start The Business Blueprint
                    </a>
                  </Link>
                </div>

                {/* Start Here - Simplified */}
                <StartHereGridGated courses={data.startHere} user={userFlags} />
              </>
            ) : (
              /* RETURNING USER EXPERIENCE - Show progress and continue */
              <>
                {/* Continue Learning - Only for users with progress */}
                <ContinueJourney course={data.continue} />

                {/* Start Here */}
                <StartHereGridGated courses={data.startHere} user={userFlags} />

                {/* Recent Achievements - Only for users with progress */}
                {data.achievements && data.achievements.length > 0 && (
                  <RecentAchievements achievements={data.achievements} />
                )}

                {/* Streak upgrade prompt - only for trial-like users with progress */}
                {(userFlags.role === 'free' || userFlags.role === 'trial' || userFlags.role === 'downsell') && (
                  <StreakUpgradePrompt days={data.stats.learningStreakDays} />
                )}
              </>
            )}
          </div>
        )}

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          onSuccess={handleFeedbackSuccess}
        />

        {/* Toast - Mobile Optimized */}
        {showToast && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center justify-center sm:justify-start">
            <i className="fas fa-check-circle mr-2"></i>
            <span className="font-medium">Feedback sent successfully!</span>
          </div>
        )}

        {/* Development Tools - GatingStatus now handled in AppLayout header */}
      </AppLayout>
    </>
  );
}