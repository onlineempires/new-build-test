import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';

import StatsCards from '../components/dashboard/StatsCards';
import ContinueJourney from '../components/dashboard/ContinueJourney';
import StartHereGrid from '../components/dashboard/StartHereGrid';
import RecentAchievements from '../components/dashboard/RecentAchievements';
import FeedbackModal from '../components/dashboard/FeedbackModal';
import { getDashboard, DashboardData } from '../lib/api/dashboard';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadDashboard();
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

  const handleClearNotifications = () => {
    if (data) {
      setData({
        ...data,
        notifications: []
      });
    }
  };

  const handleFeedbackSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

  return (
    <>
      <Head>
        <title>Dashboard - Digital Era</title>
        <meta name="description" content="Digital Era Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={data.user} 
        onFeedbackClick={() => setFeedbackModalOpen(true)}
        notifications={data.notifications}
        onClearNotifications={handleClearNotifications}
      >
        <div className="p-3 sm:p-4 lg:p-6">

          {/* Welcome Banner - Mobile Optimized */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <div className="flex items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mr-3 sm:mr-4 shadow-lg">
                {data.user.name ? data.user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'AK'}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">Hello, {data.user.name.split(' ')[0]}!</h1>
                <p className="text-purple-100 text-sm sm:text-base font-medium">Welcome back to The Digital Era!</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={data.stats} />

          {/* Continue Your Journey */}
          <ContinueJourney course={data.continue} />

          {/* Start Here */}
          <StartHereGrid courses={data.startHere} />

          {/* Recent Achievements */}
          <RecentAchievements achievements={data.achievements} />
        </div>

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
      </AppLayout>
    </>
  );
}