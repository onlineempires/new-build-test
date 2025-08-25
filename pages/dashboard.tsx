import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import StatsCards from '../components/dashboard/StatsCards';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  hoursLearned: number;
  streakDays: number;
  totalProgress: number;
  expertSessions: number;
  affiliateEarnings: number;
  leadsGenerated: number;
}

const Dashboard: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 12,
    completedCourses: 8,
    hoursLearned: 47.5,
    streakDays: 15,
    totalProgress: 67,
    expertSessions: 3,
    affiliateEarnings: 1250.00,
    leadsGenerated: 24
  });

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current course',
      icon: 'fas fa-play-circle',
      href: '/courses',
      color: 'primary'
    },
    {
      title: 'Expert Directory',
      description: 'Connect with industry experts',
      icon: 'fas fa-users',
      href: '/expert-directory',
      color: 'secondary',
      requiresPremium: true
    },
    {
      title: 'Daily Method',
      description: 'Today\'s DMO tasks',
      icon: 'fas fa-tasks',
      href: '/daily-method',
      color: 'success',
      requiresPremium: true
    },
    {
      title: 'Affiliate Portal',
      description: 'Track your earnings',
      icon: 'fas fa-link',
      href: '/affiliate-portal',
      color: 'info',
      requiresPremium: true
    }
  ];

  const recentActivity = [
    {
      type: 'course_completed',
      title: 'Completed "Advanced Marketing Strategies"',
      time: '2 hours ago',
      icon: 'fas fa-trophy',
      color: 'success'
    },
    {
      type: 'expert_session',
      title: 'Booked session with Sarah Chen',
      time: '1 day ago',
      icon: 'fas fa-calendar-check',
      color: 'primary'
    },
    {
      type: 'affiliate_earning',
      title: 'Earned $125 in affiliate commissions',
      time: '2 days ago',
      icon: 'fas fa-dollar-sign',
      color: 'success'
    },
    {
      type: 'new_lead',
      title: '3 new leads generated',
      time: '3 days ago',
      icon: 'fas fa-user-plus',
      color: 'info'
    }
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Digital Era Learning Platform</title>
        <meta name="description" content="Your personalized learning dashboard" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold mb-2" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  {getWelcomeMessage()}, {roleDetails?.displayName || 'Learner'}!
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Welcome to your Digital Era dashboard. Continue your learning journey.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <i className="fas fa-fire text-orange-400"></i>
                    <span className="font-semibold">{stats.streakDays} day streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Courses"
                value={stats.totalCourses.toString()}
                subtitle={`${stats.completedCourses} completed`}
                icon="fas fa-book"
                color="primary"
              />
              <StatsCard
                title="Learning Hours"
                value={stats.hoursLearned.toString()}
                subtitle="This month"
                icon="fas fa-clock"
                color="success"
              />
              <StatsCard
                title="Progress"
                value={`${stats.totalProgress}%`}
                subtitle="Overall completion"
                icon="fas fa-chart-line"
                color="info"
              />
              <StatsCard
                title="Expert Sessions"
                value={stats.expertSessions.toString()}
                subtitle="This month"
                icon="fas fa-user-tie"
                color="secondary"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  href={action.href}
                  color={action.color}
                  requiresPremium={action.requiresPremium}
                  currentRole={currentRole}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Recent Activity
            </h2>
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${activity.color}-100`}>
                      <i className={`${activity.icon} text-${activity.color}-600`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {activity.title}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <div 
      className="rounded-lg p-6 border transition-all duration-200 hover:shadow-lg"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </h3>
          <p 
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {subtitle}
          </p>
        </div>
        <div className={`text-2xl text-${color}-500`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

// Quick Action Card Component
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  requiresPremium?: boolean;
  currentRole: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  color, 
  requiresPremium = false,
  currentRole 
}) => {
  const isAccessible = !requiresPremium || currentRole !== 'trial';
  
  return (
    <a
      href={isAccessible ? href : '#'}
      className={`block rounded-lg p-6 border transition-all duration-200 hover:shadow-lg ${
        isAccessible ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-60'
      }`}
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center`}>
          <i className={`${icon} text-xl text-${color}-600`}></i>
        </div>
        <div>
          <h4 
            className="font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
            {requiresPremium && currentRole === 'trial' && (
              <i className="fas fa-lock ml-2 text-yellow-500"></i>
            )}
          </h4>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default Dashboard;