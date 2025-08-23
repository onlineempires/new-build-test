import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../components/layout/AppLayout';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const StatsDashboard = dynamic(
  () => import('../components/Affiliate/Stats/StatsDashboard'),
  { 
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    ),
    ssr: false  // Disable SSR for heavy chart components
  }
);
import { useCourseAccess } from '../hooks/useCourseAccess';
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

// Mock user data - replace with real user context
const mockUser = {
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40'
};

// Mock notifications - replace with real notifications
const mockNotifications = [
  {
    id: 1,
    title: 'New Performance Alert',
    body: 'Your affiliate funnels are performing well this week',
    ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionLabel: 'View Stats',
    actionHref: '/stats'
  }
];

type StatsSection = 'overview' | 'affiliate' | 'courses' | 'engagement';

interface StatsSectionInfo {
  id: StatsSection;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  requiresPermission?: string;
}

const statsSections: StatsSectionInfo[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: BarChart3,
    description: 'General platform statistics and summary metrics'
  },
  {
    id: 'affiliate',
    name: 'Affiliate Funnels',
    icon: TrendingUp,
    description: 'Track funnel performance, conversion rates, and revenue',
    requiresPermission: 'canAccessAffiliate'
  },
  {
    id: 'courses',
    name: 'Course Progress',
    icon: Users,
    description: 'Learning progress and course completion statistics'
  },
  {
    id: 'engagement',
    name: 'Platform Engagement',
    icon: Activity,
    description: 'User activity and engagement metrics'
  }
];

export default function StatsPage() {
  const router = useRouter();
  const { permissions } = useCourseAccess();
  const [activeSection, setActiveSection] = useState<StatsSection>('overview');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Check URL hash or query parameter for initial section
  useEffect(() => {
    const { section } = router.query;
    if (section && typeof section === 'string') {
      setActiveSection(section as StatsSection);
    } else if (router.asPath.includes('#')) {
      const hash = router.asPath.split('#')[1];
      if (hash && ['overview', 'affiliate', 'courses', 'engagement'].includes(hash)) {
        setActiveSection(hash as StatsSection);
      }
    }
  }, [router.query, router.asPath]);

  // Check if user has access to stats features
  useEffect(() => {
    if (!permissions?.canAccessStats) {
      router.push('/courses'); // Redirect to courses if no stats access
      return;
    }
  }, [permissions?.canAccessStats, router]);

  const handleSectionChange = (section: StatsSection) => {
    setActiveSection(section);
    // Update URL without page reload
    router.push(`/stats?section=${section}`, undefined, { shallow: true });
  };

  const handleFeedbackClick = useCallback(() => {
    setFeedbackModalOpen(true);
  }, []);

  const handleClearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Filter sections based on permissions
  const availableSections = statsSections.filter(section => 
    !section.requiresPermission || permissions?.[section.requiresPermission as keyof typeof permissions]
  );

  // Don't render if user doesn't have stats access
  if (!permissions?.canAccessStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">You need statistics access to view this page.</p>
          <button 
            onClick={() => router.push('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Courses
          </button>
        </div>
      </div>
    );
  }

  // Overview Dashboard Component
  const OverviewDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">$13,135</p>
              <p className="text-xs text-green-600 mt-1">+12.5% this month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Funnels</p>
              <p className="text-3xl font-bold text-blue-600">5</p>
              <p className="text-xs text-blue-600 mt-1">2 new this week</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Course Progress</p>
              <p className="text-3xl font-bold text-purple-600">67%</p>
              <p className="text-xs text-purple-600 mt-1">3 courses active</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Activity</p>
              <p className="text-3xl font-bold text-orange-600">89%</p>
              <p className="text-xs text-orange-600 mt-1">Above average</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access to Other Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSections.slice(1).map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <Icon className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">{section.name}</span>
                </div>
                <p className="text-sm text-gray-600">{section.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Placeholder components for other sections
  const CoursesStatsDashboard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-purple-500 mb-4">
        <Users className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Progress Statistics</h3>
      <p className="text-gray-600 mb-4">Track your learning journey and course completion rates</p>
      <p className="text-sm text-gray-500">This section will display course progress analytics, completion rates, time spent learning, and achievement tracking.</p>
    </div>
  );

  const EngagementStatsDashboard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-orange-500 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Engagement</h3>
      <p className="text-gray-600 mb-4">Monitor your activity and engagement with the platform</p>
      <p className="text-sm text-gray-500">This section will show login frequency, feature usage, time on platform, and engagement trends.</p>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewDashboard />;
      case 'affiliate':
        return <StatsDashboard />;
      case 'courses':
        return <CoursesStatsDashboard />;
      case 'engagement':
        return <EngagementStatsDashboard />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <>
      <Head>
        <title>Statistics - Online Empires</title>
        <meta name="description" content="Comprehensive analytics dashboard for your Online Empires journey" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AppLayout
        user={mockUser}
        title="Statistics"
        onFeedbackClick={handleFeedbackClick}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
      >
        <div className="p-6">
          {/* Section Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {availableSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {section.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Section Content */}
          {renderActiveSection()}
        </div>

        {/* Feedback Modal */}
        {feedbackModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Send Feedback</h3>
                <button 
                  onClick={() => setFeedbackModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <textarea
                placeholder="What can we improve about the statistics dashboard?"
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button 
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setFeedbackModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </>
  );
}