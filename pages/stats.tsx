import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../components/layout/AppLayout';
import AccessDenied from '../components/AccessDenied';
import { hasAccess, getAccessRule } from '../utils/accessControl';
import dynamic from 'next/dynamic';
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

// Lazy load heavy components with safe loading
const StatsDashboard = dynamic(
  () => import('../components/Affiliate/Stats/StatsDashboard').catch(() => 
    // Fallback component if import fails
    ({ default: () => <div className="p-8 text-center">Affiliate stats temporarily unavailable</div> })
  ),
  { 
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    ),
    ssr: false
  }
);

// Mock user data - in real app, get from auth context
const getMockUser = () => ({
  id: 1,
  name: 'Online Empire Member',
  avatarUrl: '/api/placeholder/40/40',
  tier: 'monthly_99' as const // Change this to test different access levels: 'trial' | 'downsell_37' | 'monthly_99' | 'annual_799' | 'admin'
});

type StatsSection = 'overview' | 'affiliate' | 'courses' | 'engagement';

interface StatsSectionInfo {
  id: StatsSection;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  requiresTier?: string[];
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
    requiresTier: ['monthly_99', 'annual_799', 'admin']
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
  const [user] = useState(getMockUser());
  const [activeSection, setActiveSection] = useState<StatsSection>('overview');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Safe initialization - no navigation blocking
  useEffect(() => {
    setLoading(false);
    
    // Handle URL section parameter safely
    const { section } = router.query;
    if (section && typeof section === 'string' && 
        ['overview', 'affiliate', 'courses', 'engagement'].includes(section)) {
      setActiveSection(section as StatsSection);
    }

    // Clean up function to prevent any hanging listeners
    return () => {
      // Ensure no navigation blocking on unmount
    };
  }, [router.query]);

  // Check access to stats page
  const pageAccess = hasAccess(user.tier, '/stats');
  const accessRule = getAccessRule('/stats');

  // Handle section changes safely
  const handleSectionChange = useCallback((section: StatsSection) => {
    setActiveSection(section);
    
    // Update URL without shallow routing that might cause issues
    const url = `/stats${section !== 'overview' ? `?section=${section}` : ''}`;
    window.history.replaceState(null, '', url);
  }, []);

  const handleFeedbackClick = useCallback(() => {
    setFeedbackModalOpen(true);
  }, []);

  // Filter sections based on user tier
  const availableSections = statsSections.filter(section => {
    if (!section.requiresTier) return true;
    return section.requiresTier.includes(user.tier);
  });

  // Show access denied if user doesn't have access
  if (!pageAccess) {
    return (
      <AccessDenied 
        requiredTier="Monthly ($99) or Annual ($799)"
        currentTier={user.tier}
        upgradeMessage={accessRule?.upgradeMessage}
      />
    );
  }

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AppLayout>
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
            const hasAccess = !section.requiresTier || section.requiresTier.includes(user.tier);
            
            return (
              <div key={section.id} className="relative">
                <button
                  onClick={() => hasAccess ? handleSectionChange(section.id) : null}
                  disabled={!hasAccess}
                  className={`text-left p-4 border rounded-lg w-full transition-colors ${
                    hasAccess 
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{section.name}</span>
                    {!hasAccess && (
                      <span className="ml-auto text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                        🔒 Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Other section components
  const CoursesStatsDashboard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-purple-500 mb-4">
        <Users className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Progress Statistics</h3>
      <p className="text-gray-600 mb-4">Track your learning journey and course completion rates</p>
      <p className="text-sm text-gray-500">This section displays course progress analytics, completion rates, time spent learning, and achievement tracking.</p>
    </div>
  );

  const EngagementStatsDashboard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-orange-500 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Engagement</h3>
      <p className="text-gray-600 mb-4">Monitor your activity and engagement with the platform</p>
      <p className="text-sm text-gray-500">This section shows login frequency, feature usage, time on platform, and engagement trends.</p>
    </div>
  );

  const renderActiveSection = () => {
    // Check if user has access to the current section
    const currentSection = statsSections.find(s => s.id === activeSection);
    const hasAccessToSection = !currentSection?.requiresTier || currentSection.requiresTier.includes(user.tier);
    
    if (!hasAccessToSection) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4">This section requires a Monthly or Annual subscription</p>
          <button 
            onClick={() => setActiveSection('overview')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Overview
          </button>
        </div>
      );
    }

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
        <title>Statistics - Digital Era</title>
        <meta name="description" content="Comprehensive analytics dashboard for your Digital Era journey" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AppLayout
        user={user}
        title="Statistics"
        onFeedbackClick={handleFeedbackClick}
      >
        <div className="p-6">
          {/* Section Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {availableSections.map((section) => {
                const Icon = section.icon;
                const hasAccessToSection = !section.requiresTier || section.requiresTier.includes(user.tier);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => hasAccessToSection ? handleSectionChange(section.id) : null}
                    disabled={!hasAccessToSection}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : hasAccessToSection
                        ? 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {section.name}
                    {!hasAccessToSection && (
                      <span className="ml-2 text-xs">🔒</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Section Content */}
          {renderActiveSection()}
          
          {/* Test Navigation Message */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">
              ✅ Statistics page loaded successfully. Navigation should work normally from here.
            </p>
          </div>
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
                  onClick={() => setFeedbackModalOpen(false)}
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