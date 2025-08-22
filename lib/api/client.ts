import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Custom error class for API errors
export class APIError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Create axios instance with defaults
const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth and logging
client.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add session info for admin requests
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession && config.url?.includes('/admin')) {
        config.headers['X-Admin-Session'] = adminSession;
      }
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
client.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response from ${response.config.url}:`, response.data);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      try {
        const refreshResponse = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true,
        });
        
        if (refreshResponse.data.success) {
          // Retry original request
          return client(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('adminSession');
          
          // Redirect to appropriate login page
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          window.location.href = isAdminRoute ? '/admin/login' : '/login';
        }
      }
    }
    
    // Handle other errors
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    const statusCode = error.response?.status;
    const details = error.response?.data;
    
    console.error(`[API] Error ${statusCode}:`, message, details);
    
    // Show notification for user-facing errors
    if (typeof window !== 'undefined' && statusCode && statusCode >= 400 && statusCode < 500) {
      // Dispatch custom event for notification system
      const event = new CustomEvent('api-error', {
        detail: { message, statusCode, details }
      });
      window.dispatchEvent(event);
    }
    
    throw new APIError(message, statusCode, details);
  }
);

// Wrapper functions with proper error handling
export const apiClient = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await client.get<T>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to fetch data', undefined, error);
    }
  },
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to send data', undefined, error);
    }
  },
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to update data', undefined, error);
    }
  },
  
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to patch data', undefined, error);
    }
  },
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to delete data', undefined, error);
    }
  },
};

export default client;