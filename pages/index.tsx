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
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-200 h-48 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
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
            {error || 'Failed to load dashboard data'}
            <button 
              onClick={loadDashboard}
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
        <div className="p-4 sm:p-6">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                AK
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Hello, {data.user.name}!</h1>
                <p className="text-purple-100">Welcome back {data.user.name} to The Digital Era!</p>
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

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            Feedback sent
          </div>
        )}
      </AppLayout>
    </>
  );
}