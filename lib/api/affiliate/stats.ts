import { 
  AnalyticsData,
  DashboardStats,
  RecentActivity,
  FunnelPerformance,
  AffiliatePerformance,
  DailyStats,
  ApiResponse 
} from '../../../types/affiliate';
import { api } from './client';

// Get dashboard overview statistics
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return api.get<DashboardStats>('/stats/dashboard');
}

// Get comprehensive analytics data
export async function getAnalyticsData(
  period: string = 'month',
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<AnalyticsData>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return api.get<AnalyticsData>(`/stats/analytics?${params}`);
}

// Get funnel performance data
export async function getFunnelPerformanceStats(
  period: string = 'month',
  funnelIds?: string[]
): Promise<ApiResponse<FunnelPerformance[]>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (funnelIds && funnelIds.length > 0) {
    params.append('funnelIds', funnelIds.join(','));
  }

  return api.get<FunnelPerformance[]>(`/stats/funnel-performance?${params}`);
}

// Get affiliate performance data
export async function getAffiliatePerformanceStats(
  period: string = 'month',
  affiliateIds?: string[]
): Promise<ApiResponse<AffiliatePerformance[]>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (affiliateIds && affiliateIds.length > 0) {
    params.append('affiliateIds', affiliateIds.join(','));
  }

  return api.get<AffiliatePerformance[]>(`/stats/affiliate-performance?${params}`);
}

// Get daily statistics for trend analysis
export async function getDailyStats(
  startDate: string,
  endDate: string,
  funnelId?: string
): Promise<ApiResponse<DailyStats[]>> {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  if (funnelId) params.append('funnelId', funnelId);

  return api.get<DailyStats[]>(`/stats/daily?${params}`);
}

// Get recent activity feed
export async function getRecentActivity(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
  return api.get<RecentActivity[]>(`/stats/recent-activity?limit=${limit}`);
}

// Get conversion rate trends
export async function getConversionTrends(
  period: string = 'month',
  funnelId?: string
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (funnelId) params.append('funnelId', funnelId);

  return api.get<any>(`/stats/conversion-trends?${params}`);
}

// Get revenue trends
export async function getRevenueTrends(
  period: string = 'month',
  funnelId?: string
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (funnelId) params.append('funnelId', funnelId);

  return api.get<any>(`/stats/revenue-trends?${params}`);
}

// Get top performing content/pages
export async function getTopPerformingPages(
  period: string = 'month',
  limit: number = 10
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('period', period);
  params.append('limit', limit.toString());

  return api.get<any>(`/stats/top-pages?${params}`);
}

// Get traffic sources analysis
export async function getTrafficSources(
  period: string = 'month',
  funnelId?: string
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (funnelId) params.append('funnelId', funnelId);

  return api.get<any>(`/stats/traffic-sources?${params}`);
}

// Get audience demographics
export async function getAudienceDemographics(
  period: string = 'month'
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('period', period);

  return api.get<any>(`/stats/demographics?${params}`);
}

// Get commission statistics
export async function getCommissionStats(
  period: string = 'month',
  affiliateId?: string
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (affiliateId) params.append('affiliateId', affiliateId);

  return api.get<any>(`/stats/commissions?${params}`);
}

// Export analytics data
export async function exportAnalytics(
  format: 'csv' | 'xlsx' | 'pdf' = 'csv',
  period: string = 'month',
  dataType: 'overview' | 'funnels' | 'affiliates' | 'detailed' = 'overview'
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append('format', format);
  params.append('period', period);
  params.append('dataType', dataType);

  return api.get<any>(`/stats/export?${params}`);
}

// Mock data functions for development (remove when backend is ready)
export function getMockDashboardStats(): DashboardStats {
  return {
    totalFunnels: 12,
    activeFunnels: 8,
    totalAffiliates: 24,
    activeAffiliates: 18,
    totalRevenue: 45750.00,
    totalCommissions: 11437.50,
    averageConversionRate: 12.8,
    monthlyGrowth: 23.5
  };
}

export function getMockRecentActivity(): RecentActivity[] {
  return [
    {
      id: 'activity_1',
      type: 'conversion',
      title: 'New Conversion',
      description: 'Email Marketing Masterclass - $49 sale',
      timestamp: '2025-01-18T14:30:00Z',
      userId: 'user_123',
      funnelId: 'funnel_2',
      amount: 49
    },
    {
      id: 'activity_2',
      type: 'affiliate_joined',
      title: 'New Affiliate',
      description: 'Sarah Johnson joined as affiliate',
      timestamp: '2025-01-18T12:15:00Z',
      userId: 'user_456'
    },
    {
      id: 'activity_3',
      type: 'funnel_created',
      title: 'Funnel Created',
      description: 'Free Webinar - Business Growth funnel created',
      timestamp: '2025-01-18T10:45:00Z',
      userId: 'admin_1',
      funnelId: 'funnel_3'
    },
    {
      id: 'activity_4',
      type: 'commission_paid',
      title: 'Commission Paid',
      description: 'Monthly commission payment to Mike Smith',
      timestamp: '2025-01-17T16:20:00Z',
      userId: 'user_789',
      amount: 247.50
    },
    {
      id: 'activity_5',
      type: 'conversion',
      title: 'New Conversion',
      description: 'Marissa Funnel Branding - $25 sale',
      timestamp: '2025-01-17T09:30:00Z',
      userId: 'user_321',
      funnelId: 'funnel_1',
      amount: 25
    }
  ];
}

export function getMockFunnelPerformance(): FunnelPerformance[] {
  return [
    {
      funnelId: 'funnel_2',
      funnelName: 'Email Marketing Masterclass Promo',
      visits: 856,
      conversions: 143,
      conversionRate: 16.7,
      revenue: 6985.00,
      affiliateCount: 8,
      averageOrderValue: 48.85
    },
    {
      funnelId: 'funnel_1',
      funnelName: '$1 Orderform - Marissa Funnel Branding',
      visits: 342,
      conversions: 52,
      conversionRate: 15.1,
      revenue: 1247.50,
      affiliateCount: 5,
      averageOrderValue: 23.99
    },
    {
      funnelId: 'funnel_3',
      funnelName: 'Free Webinar - Business Growth',
      visits: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      affiliateCount: 0,
      averageOrderValue: 0
    }
  ];
}

export function getMockDailyStats(): DailyStats[] {
  const stats: DailyStats[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    stats.push({
      date: date.toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 100) + 50,
      conversions: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 500) + 100,
      conversionRate: Math.floor(Math.random() * 10) + 8
    });
  }
  
  return stats;
}