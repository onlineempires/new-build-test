// User interface for affiliate system
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'affiliate' | 'customer';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  // Affiliate-specific fields
  affiliateId?: string;
  commissionRate?: number;
  totalEarnings?: number;
  referralCode?: string;
}

// Funnel interface for managing affiliate funnels
export interface Funnel {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  type: 'lead-magnet' | 'sales-page' | 'webinar' | 'course-promo';
  // Performance metrics
  visits: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  // Configuration
  landingPageUrl?: string;
  thankYouPageUrl?: string;
  affiliateCommission: number;
  // Timestamps
  createdAt: string;
  lastModified: string;
  createdBy: string;
  // Associated products/courses
  productIds?: string[];
  targetAudienceSegment?: string;
}

// Analytics data interface for reporting
export interface AnalyticsData {
  // Time period
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate: string;
  endDate: string;
  // Metrics
  totalVisits: number;
  totalConversions: number;
  totalRevenue: number;
  averageConversionRate: number;
  // Breakdown data
  funnelBreakdown: FunnelPerformance[];
  affiliateBreakdown: AffiliatePerformance[];
  dailyStats: DailyStats[];
  topPerformingFunnels: FunnelPerformance[];
  topPerformingAffiliates: AffiliatePerformance[];
}

// Funnel performance data
export interface FunnelPerformance {
  funnelId: string;
  funnelName: string;
  visits: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  affiliateCount: number;
  averageOrderValue: number;
}

// Affiliate performance data
export interface AffiliatePerformance {
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  visits: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  commission: number;
  activeFunnels: number;
}

// Daily statistics for trend analysis
export interface DailyStats {
  date: string;
  visits: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

// General funnel data interface for API responses
export interface FunnelData {
  funnels: Funnel[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
}

// Form interfaces for creating/editing
export interface CreateFunnelRequest {
  name: string;
  description?: string;
  type: Funnel['type'];
  landingPageUrl?: string;
  thankYouPageUrl?: string;
  affiliateCommission: number;
  productIds?: string[];
  targetAudienceSegment?: string;
}

export interface UpdateFunnelRequest extends Partial<CreateFunnelRequest> {
  id: string;
  status?: Funnel['status'];
}

// Statistics dashboard interfaces
export interface DashboardStats {
  totalFunnels: number;
  activeFunnels: number;
  totalAffiliates: number;
  activeAffiliates: number;
  totalRevenue: number;
  totalCommissions: number;
  averageConversionRate: number;
  monthlyGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: 'funnel_created' | 'conversion' | 'affiliate_joined' | 'commission_paid';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  funnelId?: string;
  amount?: number;
}