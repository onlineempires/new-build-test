import { 
  Funnel, 
  FunnelData, 
  CreateFunnelRequest, 
  UpdateFunnelRequest, 
  PaginationParams,
  ApiResponse 
} from '../../../types/affiliate';
import { api } from './client';

// Get all funnels with pagination and filtering
export async function getFunnels(params?: PaginationParams): Promise<ApiResponse<FunnelData>> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
  }

  const endpoint = queryParams.toString() ? `/funnels?${queryParams}` : '/funnels';
  return api.get<FunnelData>(endpoint);
}

// Get a single funnel by ID
export async function getFunnelById(id: string): Promise<ApiResponse<Funnel>> {
  return api.get<Funnel>(`/funnels/${id}`);
}

// Create a new funnel
export async function createFunnel(funnelData: CreateFunnelRequest): Promise<ApiResponse<Funnel>> {
  return api.post<Funnel>('/funnels', funnelData);
}

// Update an existing funnel
export async function updateFunnel(id: string, funnelData: Partial<UpdateFunnelRequest>): Promise<ApiResponse<Funnel>> {
  return api.put<Funnel>(`/funnels/${id}`, funnelData);
}

// Delete a funnel
export async function deleteFunnel(id: string): Promise<ApiResponse<null>> {
  return api.delete<null>(`/funnels/${id}`);
}

// Toggle funnel status (activate/deactivate)
export async function toggleFunnelStatus(id: string): Promise<ApiResponse<Funnel>> {
  return api.patch<Funnel>(`/funnels/${id}/toggle-status`);
}

// Duplicate a funnel
export async function duplicateFunnel(id: string, newName: string): Promise<ApiResponse<Funnel>> {
  return api.post<Funnel>(`/funnels/${id}/duplicate`, { name: newName });
}

// Get funnel performance metrics
export async function getFunnelPerformance(id: string, period?: string): Promise<ApiResponse<any>> {
  const endpoint = period ? `/funnels/${id}/performance?period=${period}` : `/funnels/${id}/performance`;
  return api.get<any>(endpoint);
}

// Get funnel conversion data
export async function getFunnelConversions(id: string, params?: PaginationParams): Promise<ApiResponse<any>> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
  }

  const endpoint = queryParams.toString() 
    ? `/funnels/${id}/conversions?${queryParams}` 
    : `/funnels/${id}/conversions`;
  
  return api.get<any>(endpoint);
}

// Get active funnels (quick access)
export async function getActiveFunnels(): Promise<ApiResponse<Funnel[]>> {
  return api.get<Funnel[]>('/funnels/active');
}

// Get funnels by affiliate
export async function getFunnelsByAffiliate(affiliateId: string): Promise<ApiResponse<Funnel[]>> {
  return api.get<Funnel[]>(`/funnels/affiliate/${affiliateId}`);
}

// Bulk operations
export async function bulkUpdateFunnels(
  funnelIds: string[], 
  updates: Partial<UpdateFunnelRequest>
): Promise<ApiResponse<Funnel[]>> {
  return api.patch<Funnel[]>('/funnels/bulk-update', {
    funnelIds,
    updates
  });
}

export async function bulkDeleteFunnels(funnelIds: string[]): Promise<ApiResponse<null>> {
  return api.delete<null>('/funnels/bulk-delete', {
    data: { funnelIds }
  });
}

// Export/Import functions
export async function exportFunnels(funnelIds?: string[]): Promise<ApiResponse<any>> {
  const data = funnelIds ? { funnelIds } : undefined;
  return api.post<any>('/funnels/export', data);
}

export async function importFunnels(file: File): Promise<ApiResponse<Funnel[]>> {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post<Funnel[]>('/funnels/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// Mock data functions for development (remove when backend is ready)
export function getMockFunnels(): Funnel[] {
  return [
    {
      id: 'funnel_1',
      name: '$1 Orderform - Marissa Funnel Branding',
      description: 'Lead generation funnel for branding course',
      status: 'active',
      type: 'lead-magnet',
      visits: 342,
      conversions: 52,
      conversionRate: 15.1,
      revenue: 1247.50,
      landingPageUrl: '/landing/marissa-branding',
      thankYouPageUrl: '/thank-you/marissa-branding',
      affiliateCommission: 25,
      createdAt: '2025-01-15T10:30:00Z',
      lastModified: '2025-01-18T14:22:00Z',
      createdBy: 'admin_1',
      productIds: ['course_branding_1'],
      targetAudienceSegment: 'entrepreneurs'
    },
    {
      id: 'funnel_2',
      name: 'Email Marketing Masterclass Promo',
      description: 'Sales funnel for email marketing course',
      status: 'active',
      type: 'sales-page',
      visits: 856,
      conversions: 143,
      conversionRate: 16.7,
      revenue: 6985.00,
      landingPageUrl: '/landing/email-marketing',
      thankYouPageUrl: '/thank-you/email-marketing',
      affiliateCommission: 30,
      createdAt: '2025-01-10T09:15:00Z',
      lastModified: '2025-01-17T11:45:00Z',
      createdBy: 'admin_1',
      productIds: ['course_email_marketing'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_3',
      name: 'Free Webinar - Business Growth',
      description: 'Webinar funnel for business growth training',
      status: 'draft',
      type: 'webinar',
      visits: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      landingPageUrl: '/webinar/business-growth',
      thankYouPageUrl: '/thank-you/webinar',
      affiliateCommission: 20,
      createdAt: '2025-01-18T16:00:00Z',
      lastModified: '2025-01-18T16:00:00Z',
      createdBy: 'admin_1',
      productIds: ['webinar_business_growth'],
      targetAudienceSegment: 'business-owners'
    }
  ];
}

// Extended mock data for comprehensive funnel management
export function getExtendedMockFunnels(): Funnel[] {
  return [
    {
      id: 'funnel_1',
      name: '$1 Orderform - Marissa Funnel Branding',
      description: 'High-converting lead generation funnel for personal branding course with video testimonials',
      status: 'active',
      type: 'lead-magnet',
      visits: 2847,
      conversions: 523,
      conversionRate: 18.4,
      revenue: 12847.50,
      landingPageUrl: '/landing/marissa-branding',
      thankYouPageUrl: '/thank-you/marissa-branding',
      affiliateCommission: 25,
      createdAt: '2024-12-15T10:30:00Z',
      lastModified: '2025-01-18T14:22:00Z',
      createdBy: 'admin_1',
      productIds: ['course_branding_1'],
      targetAudienceSegment: 'entrepreneurs'
    },
    {
      id: 'funnel_2',
      name: 'Email Marketing Masterclass - Advanced Sales Page',
      description: 'Premium sales funnel for advanced email marketing course with social proof and urgency',
      status: 'active',
      type: 'sales-page',
      visits: 4256,
      conversions: 687,
      conversionRate: 16.1,
      revenue: 33685.00,
      landingPageUrl: '/landing/email-marketing-advanced',
      thankYouPageUrl: '/thank-you/email-marketing',
      affiliateCommission: 30,
      createdAt: '2024-12-10T09:15:00Z',
      lastModified: '2025-01-17T11:45:00Z',
      createdBy: 'admin_1',
      productIds: ['course_email_marketing_advanced'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_3',
      name: 'Business Growth Masterclass Webinar',
      description: 'Live webinar funnel for business scaling strategies with Q&A session',
      status: 'active',
      type: 'webinar',
      visits: 1842,
      conversions: 347,
      conversionRate: 18.8,
      revenue: 8675.00,
      landingPageUrl: '/webinar/business-growth',
      thankYouPageUrl: '/thank-you/webinar',
      affiliateCommission: 20,
      createdAt: '2024-12-05T16:00:00Z',
      lastModified: '2025-01-16T08:30:00Z',
      createdBy: 'admin_1',
      productIds: ['webinar_business_growth'],
      targetAudienceSegment: 'business-owners'
    },
    {
      id: 'funnel_4',
      name: 'Digital Marketing Foundations Course',
      description: 'Comprehensive course promotion funnel with module preview and student success stories',
      status: 'active',
      type: 'course-promo',
      visits: 3156,
      conversions: 412,
      conversionRate: 13.1,
      revenue: 20600.00,
      landingPageUrl: '/course/digital-marketing-foundations',
      thankYouPageUrl: '/thank-you/course-enrollment',
      affiliateCommission: 35,
      createdAt: '2024-11-28T14:20:00Z',
      lastModified: '2025-01-15T16:45:00Z',
      createdBy: 'admin_1',
      productIds: ['course_digital_marketing'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_5',
      name: 'Free SEO Audit Tool - Lead Magnet',
      description: 'Interactive SEO audit tool as lead magnet with personalized recommendations',
      status: 'active',
      type: 'lead-magnet',
      visits: 5678,
      conversions: 1234,
      conversionRate: 21.7,
      revenue: 15420.00,
      landingPageUrl: '/tools/seo-audit',
      thankYouPageUrl: '/thank-you/seo-audit',
      affiliateCommission: 15,
      createdAt: '2024-11-20T11:15:00Z',
      lastModified: '2025-01-14T09:20:00Z',
      createdBy: 'admin_1',
      productIds: ['tool_seo_audit'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_6',
      name: 'Social Media Mastery Workshop',
      description: 'Intensive workshop funnel for social media strategy and content creation',
      status: 'inactive',
      type: 'webinar',
      visits: 892,
      conversions: 67,
      conversionRate: 7.5,
      revenue: 3350.00,
      landingPageUrl: '/workshop/social-media-mastery',
      thankYouPageUrl: '/thank-you/workshop',
      affiliateCommission: 25,
      createdAt: '2024-11-15T13:45:00Z',
      lastModified: '2025-01-12T15:30:00Z',
      createdBy: 'admin_1',
      productIds: ['workshop_social_media'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_7',
      name: 'E-commerce Blueprint Sales Funnel',
      description: 'Complete e-commerce business blueprint with case studies and templates',
      status: 'active',
      type: 'sales-page',
      visits: 2134,
      conversions: 198,
      conversionRate: 9.3,
      revenue: 19800.00,
      landingPageUrl: '/blueprint/ecommerce',
      thankYouPageUrl: '/thank-you/blueprint',
      affiliateCommission: 40,
      createdAt: '2024-11-08T10:00:00Z',
      lastModified: '2025-01-10T14:15:00Z',
      createdBy: 'admin_1',
      productIds: ['blueprint_ecommerce'],
      targetAudienceSegment: 'entrepreneurs'
    },
    {
      id: 'funnel_8',
      name: 'Content Creation Masterclass',
      description: 'Comprehensive course on content creation for multiple platforms and formats',
      status: 'active',
      type: 'course-promo',
      visits: 1567,
      conversions: 234,
      conversionRate: 14.9,
      revenue: 11700.00,
      landingPageUrl: '/course/content-creation',
      thankYouPageUrl: '/thank-you/content-course',
      affiliateCommission: 28,
      createdAt: '2024-10-25T16:30:00Z',
      lastModified: '2025-01-08T11:00:00Z',
      createdBy: 'admin_1',
      productIds: ['course_content_creation'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_9',
      name: 'Freelancer Success Kit - Lead Magnet',
      description: 'Essential resources and templates for freelancers starting their business',
      status: 'draft',
      type: 'lead-magnet',
      visits: 45,
      conversions: 8,
      conversionRate: 17.8,
      revenue: 0,
      landingPageUrl: '/kit/freelancer-success',
      thankYouPageUrl: '/thank-you/freelancer-kit',
      affiliateCommission: 20,
      createdAt: '2025-01-18T09:15:00Z',
      lastModified: '2025-01-18T09:15:00Z',
      createdBy: 'admin_1',
      productIds: ['kit_freelancer'],
      targetAudienceSegment: 'freelancers'
    },
    {
      id: 'funnel_10',
      name: 'Investment Strategies Webinar Series',
      description: 'Multi-part webinar series on investment strategies for beginners to advanced',
      status: 'inactive',
      type: 'webinar',
      visits: 756,
      conversions: 23,
      conversionRate: 3.0,
      revenue: 1150.00,
      landingPageUrl: '/webinar/investment-strategies',
      thankYouPageUrl: '/thank-you/investment-webinar',
      affiliateCommission: 15,
      createdAt: '2024-10-15T14:20:00Z',
      lastModified: '2025-01-05T10:45:00Z',
      createdBy: 'admin_1',
      productIds: ['webinar_investment'],
      targetAudienceSegment: 'professionals'
    },
    {
      id: 'funnel_11',
      name: 'AI Tools for Marketers Course',
      description: 'Cutting-edge course on AI tools and automation for modern marketing',
      status: 'active',
      type: 'course-promo',
      visits: 3421,
      conversions: 456,
      conversionRate: 13.3,
      revenue: 22800.00,
      landingPageUrl: '/course/ai-marketing-tools',
      thankYouPageUrl: '/thank-you/ai-course',
      affiliateCommission: 32,
      createdAt: '2024-09-30T12:00:00Z',
      lastModified: '2025-01-03T16:20:00Z',
      createdBy: 'admin_1',
      productIds: ['course_ai_marketing'],
      targetAudienceSegment: 'marketers'
    },
    {
      id: 'funnel_12',
      name: 'Productivity Hacks Checklist',
      description: 'Simple but effective productivity checklist and templates for busy professionals',
      status: 'active',
      type: 'lead-magnet',
      visits: 1203,
      conversions: 289,
      conversionRate: 24.0,
      revenue: 4335.00,
      landingPageUrl: '/checklist/productivity-hacks',
      thankYouPageUrl: '/thank-you/productivity',
      affiliateCommission: 18,
      createdAt: '2024-09-20T08:30:00Z',
      lastModified: '2024-12-28T14:10:00Z',
      createdBy: 'admin_1',
      productIds: ['checklist_productivity'],
      targetAudienceSegment: 'professionals'
    }
  ];
}