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
            <div className="h-20 sm:h-24 theme-bg-secondary rounded-2xl mb-6"></div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="theme-bg-secondary h-24 sm:h-32 rounded-xl"></div>
              ))}
            </div>
            
            {/* Content Skeletons */}
            <div className="space-y-4">
              <div className="theme-bg-secondary h-40 sm:h-48 rounded-xl"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="theme-bg-secondary h-48 sm:h-64 rounded-xl"></div>
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
          <div className="theme-card px-4 py-4 rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: 'var(--color-error)', backgroundColor: 'var(--bg-card)', color: 'var(--color-error)' }}>
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle mt-0.5 mr-3" style={{ color: 'var(--color-error)' }}></i>
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ color: 'var(--color-error)' }}>Unable to load dashboard</div>
                <div className="text-sm mb-3 theme-text-secondary">{error || 'Failed to load dashboard data'}</div>
                <button 
                  onClick={loadDashboard}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 theme-button-secondary"
                  style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
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
              <div className="theme-card rounded-xl shadow-sm p-3 sm:p-4 mb-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3"
                      style={{ background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))' }}
                    >
                      {data.user.name ? data.user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'AK'}
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold theme-text-primary">Hello, {data.user.name.split(' ')[0]}!</h1>
                      <p className="theme-text-secondary text-sm">Welcome back to The Digital Era</p>
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
              <div className="theme-card rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <i className="fas fa-graduation-cap text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold theme-text-primary">{data.stats.coursesCompleted}</div>
                    <div className="text-sm font-medium theme-text-secondary">Completed</div>
                  </div>
                </div>
              </div>
              <div className="theme-card rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ backgroundColor: 'var(--color-success)' }}
                  >
                    <i className="fas fa-fire text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold theme-text-primary">{data.stats.learningStreakDays}</div>
                    <div className="text-sm font-medium theme-text-secondary">Day Streak</div>
                  </div>
                </div>
              </div>
              <div className="theme-card rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ backgroundColor: 'var(--color-warning)' }}
                  >
                    <i className="fas fa-star text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold theme-text-primary">{data.stats.xpPoints}</div>
                    <div className="text-sm font-medium theme-text-secondary">XP Points</div>
                  </div>
                </div>
              </div>
              <div className="theme-card rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ backgroundColor: 'var(--color-info)' }}
                  >
                    <i className="fas fa-level-up-alt text-white text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold theme-text-primary">{data.stats.level}</div>
                    <div className="text-sm font-medium theme-text-secondary">Level</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Bar */}
            <div className="theme-card rounded-xl py-3 px-4 mt-4 mb-6 flex flex-wrap justify-center gap-3 border-l-4" style={{ borderLeftColor: 'var(--color-success)' }}>
              <div className="flex items-center theme-text-primary text-sm">
                <i className="fas fa-play mr-2" style={{ color: 'var(--color-success)' }}></i>
                <span className="font-medium">15 min lessons</span>
              </div>
              <div className="flex items-center theme-text-primary text-sm">
                <i className="fas fa-star mr-2" style={{ color: 'var(--color-success)' }}></i>
                <span className="font-medium">Earn XP rewards</span>
              </div>
              <div className="flex items-center theme-text-primary text-sm">
                <i className="fas fa-trophy mr-2" style={{ color: 'var(--color-success)' }}></i>
                <span className="font-medium">Track progress</span>
              </div>
            </div>

            {/* Main Content - Conditional based on user progress */}
            {data.stats.coursesCompleted === 0 ? (
              /* NEW USER EXPERIENCE - Clean and Action-Oriented */
              <>
                {/* Compact Start Here CTA */}
                <div className="theme-card rounded-2xl shadow-sm p-6 md:p-8 text-center mb-8">
                  <h2 className="text-2xl font-bold theme-text-primary mb-3">Start Here</h2>
                  <p className="theme-text-secondary text-base mb-6 max-w-md mx-auto">
                    Kick off with The Business Blueprint – it's just 15 minutes and will change how you think about online business.
                  </p>
                  <Link href="/courses/business-blueprint">
                    <a className="theme-button-primary h-14 px-6 rounded-2xl w-full sm:w-auto inline-flex items-center justify-center">
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