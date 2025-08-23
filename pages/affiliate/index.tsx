// pages/affiliate/index.tsx
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../components/layout/AppLayout';
import { useCourseAccess } from '../../hooks/useCourseAccess';
import { useUserRole } from '../../contexts/UserRoleContext';
import { generateAffiliateLink, updateAffiliateLinksForUser } from '../../utils/affiliateLinks';
import { Copy, ExternalLink, Share2, TrendingUp, Users, DollarSign, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load heavy chart components if they exist
const AnalyticsCharts = dynamic(
  () => import('../../components/affiliate/AnalyticsCharts')
    .then(mod => ({ default: mod.AnalyticsCharts }))
    .catch(() => ({ default: () => null })), // Fallback component if doesn't exist
  { 
    loading: () => (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Get username from localStorage (profile data)
const getProfileUsername = () => {
  if (typeof window !== 'undefined') {
    const profileData = localStorage.getItem('profileData');
    if (profileData) {
      try {
        const parsed = JSON.parse(profileData);
        return parsed.username || 'kemp-17';
      } catch {
        return 'kemp-17';
      }
    }
  }
  return 'kemp-17';
};

export default function AffiliatePage() {
  const router = useRouter();
  const { permissions } = useCourseAccess();
  const { roleDetails } = useUserRole();
  const [stats, setStats] = useState<{
    totalClicks: number;
    totalSignups: number;
    totalCommissions: number;
    conversionRate: number;
    lastUpdated: string;
  } | null>(null);
  const [allFunnels, setAllFunnels] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('opt-in');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const [currentUsername, setCurrentUsername] = useState('kemp-17');

  const funnelTypes = [
    { id: 'opt-in', label: 'Lead Generation', icon: '📧', count: 0, color: 'from-blue-500 to-blue-600' },
    { id: 'vsl', label: 'Video Sales', icon: '▶️', count: 0, color: 'from-purple-500 to-purple-600' },
    { id: 'checkout', label: 'Checkout Pages', icon: '💳', count: 0, color: 'from-green-500 to-green-600' },
    { id: 'free-trial', label: 'Free Trials', icon: '🎁', count: 0, color: 'from-orange-500 to-orange-600' }
  ];

  // Function to refresh affiliate links when username changes
  const refreshAffiliateLinks = () => {
    const username = getProfileUsername();
    setCurrentUsername(username);
    
    // Update existing funnels with new links
    setAllFunnels(prevFunnels => 
      prevFunnels.map((funnel, index) => ({
        ...funnel,
        affiliateLink: generateAffiliateLink(username, (10 + index).toString(), funnel.type)
      }))
    );
  };

  useEffect(() => {
    // Check affiliate access permission
    if (!permissions?.canAccessAffiliate) {
      router.push('/courses');
      return;
    }
    
    // Set current username
    const username = getProfileUsername();
    setCurrentUsername(username);
    setLoading(false);
    
    // Set demo stats
    setTimeout(() => {
      setStats({
        totalClicks: 1247,
        totalSignups: 89,
        totalCommissions: 4650,
        conversionRate: 7.1,
        lastUpdated: new Date().toISOString()
      });
    }, 500);

    // Set comprehensive demo funnels with dynamic affiliate links
    setTimeout(() => {
      const currentUsername = getProfileUsername();
      
      const baseFunnels = [
        // Opt-In Pages
        {
          id: '1',
          name: 'Sam Budow Free Training',
          description: 'Lead magnet - 3 keys to success online leveraging high ticket affiliate marketing',
          type: 'opt-in',
          clicks: 129,
          conversions: 44,
          earnings: 0,
          thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '2',
          name: 'Marissa $1 Trial Opt-In',
          description: 'Chase your passions & set up your office anywhere in the world',
          type: 'opt-in',
          clicks: 93,
          conversions: 41,
          earnings: 0,
          thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '3',
          name: 'Brodie & Team Free Training',
          description: 'The incredible journeys of Brodie, Bryan, Andrea, and Colin - 20 mins free trial',
          type: 'opt-in',
          clicks: 54,
          conversions: 22,
          earnings: 0,
          thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=180&fit=crop&crop=center'
        },
        
        // VSL Pages
        {
          id: '4',
          name: 'Ashley Krooks 2024 VSL',
          description: 'Our newest funnel - Highly recommended. Ashley Krooks breaks down the online opportunity',
          type: 'vsl',
          clicks: 11,
          conversions: 6,
          earnings: 300,
          thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '5',
          name: 'Kristen Braun Business VSL',
          description: 'Step-by-step method to creating a highly profitable & automated online business',
          type: 'vsl',
          clicks: 27,
          conversions: 5,
          earnings: 375,
          thumbnail: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '6',
          name: 'Sam Budow Premium VSL',
          description: 'Advanced training program for serious entrepreneurs',
          type: 'vsl',
          clicks: 45,
          conversions: 3,
          earnings: 450,
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=180&fit=crop&crop=center'
        },

        // Direct Checkout
        {
          id: '7',
          name: '$1 Trial Order Form',
          description: '$1 Trial order form to Online Empires for 7 days, then $99 per month',
          type: 'checkout',
          clicks: 30,
          conversions: 15,
          earnings: 600,
          thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '8',
          name: 'Marissa Funnel Direct Sale',
          description: '$1 Trial order form NEW - Marissa branded funnel',
          type: 'checkout',
          clicks: 4,
          conversions: 4,
          earnings: 160,
          thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '9',
          name: 'OE Annual Special',
          description: 'Special OE Bundle Annual Link - Just $799/Year',
          type: 'checkout',
          clicks: 14,
          conversions: 1,
          earnings: 200,
          thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=180&fit=crop&crop=center'
        },

        // Free Trials
        {
          id: '10',
          name: '7 Days Free Trial Form',
          description: 'Free trial order form with a card sign up for 7 days, then $99 per month',
          type: 'free-trial',
          clicks: 22,
          conversions: 14,
          earnings: 490,
          thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=180&fit=crop&crop=center'
        },
        {
          id: '11',
          name: 'Free Registration (No Card)',
          description: 'Free trial order form WITHOUT a card sign up for 7 days (Recommended for special promos)',
          type: 'free-trial',
          clicks: 168,
          conversions: 117,
          earnings: 0,
          thumbnail: 'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=300&h=180&fit=crop&crop=center'
        }
      ];

      // Generate dynamic affiliate links for each funnel
      const funnelsWithLinks = baseFunnels.map((funnel, index) => ({
        ...funnel,
        affiliateLink: generateAffiliateLink(currentUsername, (10 + index).toString(), funnel.type)
      }));

      setAllFunnels(funnelsWithLinks);
    }, 800);
  }, [permissions.canAccessAffiliate, router]);

  // Memoize filtered funnels to prevent unnecessary re-calculations
  const filteredFunnels = useMemo(() => {
    return allFunnels.filter(funnel => funnel.type === activeTab);
  }, [allFunnels, activeTab]);

  // Memoize funnel type counts to prevent unnecessary re-calculations
  const updatedFunnelTypes = useMemo(() => {
    return funnelTypes.map(type => ({
      ...type,
      count: allFunnels.filter(f => f.type === type.id).length
    }));
  }, [allFunnels]);

  // Memoize clipboard function to prevent re-renders
  const memoizedCopyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  }, []);



  const shareLink = useCallback(async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      memoizedCopyToClipboard(url, title);
    }
  }, [memoizedCopyToClipboard]);

  const openLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const FunnelThumbnail = memo(({ src, alt, type }: { src: string; alt: string; type: string }) => {
    return (
      <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy" // Native lazy loading
          onError={(e) => {
            // Fallback to gradient background with icon if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-2xl">
                  ${type === 'opt-in' ? '📧' : type === 'vsl' ? '▶️' : type === 'checkout' ? '💳' : '🎁'}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!permissions || !permissions.canAccessAffiliate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-4V9a4 4 0 10-8 0v2m0 0v6a2 2 0 002 2h4a2 2 0 002-2v-6z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">You need affiliate access to view this page.</p>
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



  return (
    <>
      <Head>
        <title>Affiliate Portal - Online Empires</title>
        <meta name="description" content="Manage your affiliate links and track performance" />
      </Head>

      <AppLayout
        user={{
          id: 1,
          name: roleDetails?.name || 'User',
          avatarUrl: '/api/placeholder/40/40'
        }}
        title="Affiliate Portal"
      >
        <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Affiliate Portal 🚀
              </h1>
              <p className="text-gray-600 mb-4">
                Get your unique affiliate links below. Share them with your audience to earn commissions on every sale and signup.
              </p>
              
              {/* Clean Tips Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">💡 Choose the right funnel for your audience:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                  <div><strong>📧 Lead Generation:</strong> Build email lists</div>
                  <div><strong>▶️ Video Sales:</strong> Engaged audiences</div>
                  <div><strong>💳 Checkout Pages:</strong> Ready-to-buy traffic</div>
                  <div><strong>🎁 Free Trials:</strong> Hesitant prospects</div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <Eye className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Total Clicks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Conversions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalSignups}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Earnings</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.totalCommissions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {copySuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 font-medium text-sm">
                  ✅ {copySuccess} copied to clipboard!
                </p>
              </div>
            )}

            {/* Clean Tab Navigation */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                {updatedFunnelTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === type.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{type.icon}</span>
                    {type.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === type.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Funnel Cards with Larger Thumbnails */}
            <div className="space-y-4">
              {filteredFunnels.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <p className="text-lg mb-2">No funnels found in this category</p>
                  <p className="text-sm">Try selecting a different funnel type above</p>
                </div>
              ) : (
                filteredFunnels.map((funnel) => (
                  <div key={funnel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start gap-4 mb-3">
                      <FunnelThumbnail 
                        src={funnel.thumbnail} 
                        alt={funnel.name}
                        type={funnel.type}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {funnel.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {funnel.description}
                        </p>
                      </div>
                    </div>

                    {/* Compact Performance Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{funnel.clicks}</p>
                        <p className="text-xs text-gray-600">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{funnel.conversions}</p>
                        <p className="text-xs text-gray-600">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">${funnel.earnings}</p>
                        <p className="text-xs text-gray-600">Earned</p>
                      </div>
                    </div>

                    {/* Affiliate Link Display */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                        Your Affiliate Link:
                      </label>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <code className="flex-1 text-xs text-gray-800 break-all select-all">
                          {funnel.affiliateLink}
                        </code>
                      </div>
                    </div>

                    {/* Compact Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => memoizedCopyToClipboard(funnel.affiliateLink, funnel.name)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>

                      <button
                        onClick={() => shareLink(funnel.affiliateLink, funnel.name)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </button>

                      <button
                        onClick={() => openLink(funnel.affiliateLink)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Preview
                      </button>
                      
                      <button
                        onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(funnel.affiliateLink)}`, '_blank')}
                        className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        📱 QR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}