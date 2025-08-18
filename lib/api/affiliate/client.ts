import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../../../types/affiliate';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// Create axios instance for affiliate API
export const affiliateApiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/affiliate`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
affiliateApiClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage or cookies
    const token = localStorage.getItem('authToken') || 
                  document.cookie
                    .split('; ')
                    .find(row => row.startsWith('authToken='))
                    ?.split('=')[1];

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add user role for permission checking
    const userRole = localStorage.getItem('userRole');
    if (userRole && config.headers) {
      config.headers['X-User-Role'] = userRole;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors and data transformation
affiliateApiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Transform response data if needed
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error);

    // Handle common HTTP errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.warn('Unauthorized access, redirecting to login');
          // You might want to dispatch a logout action here
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.warn('Insufficient permissions');
          break;
        case 404:
          // Not found
          console.warn('Resource not found');
          break;
        case 429:
          // Too many requests
          console.warn('Rate limit exceeded');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error(`HTTP error ${status}: ${message}`);
      }

      // Return a standardized error response
      return Promise.reject({
        status,
        message,
        data: error.response.data
      });
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        data: null
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message,
        data: null
      });
    }
  }
);

// Helper function for making API calls with proper typing
export async function apiCall<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await affiliateApiClient.request<ApiResponse<T>>({
      method,
      url: endpoint,
      data,
      ...config
    });
    
    return response.data;
  } catch (error: any) {
    // Return standardized error response
    return {
      success: false,
      data: null as T,
      error: error.message || 'An error occurred',
      message: error.message || 'Request failed'
    };
  }
}

// Utility functions for common operations
export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) => 
    apiCall<T>('get', endpoint, undefined, config),
  
  post: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) => 
    apiCall<T>('post', endpoint, data, config),
  
  put: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) => 
    apiCall<T>('put', endpoint, data, config),
  
  patch: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) => 
    apiCall<T>('patch', endpoint, data, config),
  
  delete: <T>(endpoint: string, config?: AxiosRequestConfig) => 
    apiCall<T>('delete', endpoint, undefined, config),
};

export default affiliateApiClient;