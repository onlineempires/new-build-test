import {
  SalesCloser,
  UserSalesPreference,
  CloserRating,
  UserActivity,
} from '../../types/salesCloser';
import { apiClient } from './client';

export const salesCloserApi = {
  // Get user's sales preference
  async getUserPreference(): Promise<UserSalesPreference | null> {
    try {
      return await apiClient.get<UserSalesPreference>('/user/sales-preference');
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  },

  // Create or update sales preference
  async savePreference(data: {
    preference_type: 'round-robin' | 'dedicated';
    sales_closer_id?: number;
    terms_version: string;
  }): Promise<UserSalesPreference> {
    return await apiClient.post<UserSalesPreference>('/user/sales-preference', data);
  },

  // Delete sales preference
  async deletePreference(preferenceId: number): Promise<void> {
    await apiClient.delete(`/user/sales-preference/${preferenceId}`);
  },

  // Get all sales closers
  async getSalesClosers(): Promise<SalesCloser[]> {
    return await apiClient.get<SalesCloser[]>('/sales-closers');
  },

  // Get specific sales closer
  async getSalesCloser(closerId: number): Promise<SalesCloser> {
    return await apiClient.get<SalesCloser>(`/sales-closers/${closerId}`);
  },

  // Submit rating for closer
  async submitRating(data: {
    sales_closer_id: number;
    rating: number;
    review?: string;
  }): Promise<CloserRating> {
    return await apiClient.post<CloserRating>('/user/ratings', data);
  },

  // Get user's rating for closer
  async getUserRating(closerId: number): Promise<CloserRating | null> {
    try {
      return await apiClient.get<CloserRating>(`/user/ratings/${closerId}`);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  },

  // Get user activities with closer
  async getUserActivities(closerId: number): Promise<UserActivity[]> {
    return await apiClient.get<UserActivity[]>(`/user/activities/${closerId}`);
  },
};
