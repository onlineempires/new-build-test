import {
  FunnelTemplate,
  MemberFunnel,
  MemberFunnelWithAnalytics,
  UserTemplate,
  Lead,
  CreateFunnelTemplate,
  CreateMemberFunnel,
  UpdateMemberFunnel,
  TrackAnalytics,
} from '../types/funnel';

// API Base URL - points to new_features backend on port 3005
const API_BASE_URL = process.env.NEXT_PUBLIC_FUNNEL_API_URL || 'http://localhost:3005/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
};

// Admin Template API
export const adminTemplateApi = {
  // Get all admin templates
  getTemplates: async (): Promise<FunnelTemplate[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create a new template
  createTemplate: async (data: CreateFunnelTemplate): Promise<FunnelTemplate> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update a template
  updateTemplate: async (
    id: number,
    data: Partial<CreateFunnelTemplate>
  ): Promise<FunnelTemplate> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete a template
  deleteTemplate: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Duplicate a template
  duplicateTemplate: async (id: number): Promise<FunnelTemplate> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Member Funnel API
export const memberFunnelApi = {
  // Get all member funnels
  getFunnels: async (): Promise<MemberFunnelWithAnalytics[]> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get a specific funnel
  getFunnel: async (id: number): Promise<MemberFunnel> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create a new funnel
  createFunnel: async (data: CreateMemberFunnel): Promise<MemberFunnel> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update a funnel
  updateFunnel: async (id: number, data: UpdateMemberFunnel): Promise<MemberFunnel> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete a funnel
  deleteFunnel: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Publish a funnel
  publishFunnel: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels/${id}/publish`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Duplicate a funnel
  duplicateFunnel: async (id: number): Promise<MemberFunnel> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Save funnel as template
  saveAsTemplate: async (
    id: number,
    data: { name: string; description?: string; category?: string }
  ): Promise<UserTemplate> => {
    const response = await fetch(`${API_BASE_URL}/member/funnels/${id}/save-as-template`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// User Template API
export const userTemplateApi = {
  // Get user templates
  getTemplates: async (): Promise<UserTemplate[]> => {
    const response = await fetch(`${API_BASE_URL}/member/templates`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Public Funnel API
export const publicFunnelApi = {
  // Get public funnel by slug
  getFunnel: async (
    slug: string
  ): Promise<{ funnel: MemberFunnel; template: FunnelTemplate | null }> => {
    const response = await fetch(`${API_BASE_URL}/funnel/${slug}`);
    return handleResponse(response);
  },

  // Track analytics
  trackAnalytics: async (slug: string, data: TrackAnalytics): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/funnel/${slug}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Submit email for email capture funnels
  submitEmail: async (
    slug: string,
    data: { email: string; name?: string; phone?: string; instagram?: string }
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/funnel/${slug}/submit-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// Leads API
export const leadsApi = {
  // Get leads for a user
  getLeads: async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE_URL}/member/leads`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update lead status
  updateLeadStatus: async (
    id: number,
    status: 'new' | 'contacted' | 'member' | 'archived'
  ): Promise<Lead> => {
    const response = await fetch(`${API_BASE_URL}/member/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Admin Funnels API (for admin to see all funnels)
export const adminFunnelApi = {
  // Get all funnels (admin view)
  getAllFunnels: async (): Promise<MemberFunnel[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/funnels`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Export all APIs
export const funnelApi = {
  adminTemplate: adminTemplateApi,
  memberFunnel: memberFunnelApi,
  userTemplate: userTemplateApi,
  publicFunnel: publicFunnelApi,
  leads: leadsApi,
  adminFunnel: adminFunnelApi,
};
