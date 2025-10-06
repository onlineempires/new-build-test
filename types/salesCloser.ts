// Sales Closer Types
export interface SalesCloser {
  id: number;
  name: string;
  title: string;
  bio: string;
  specialties: string;
  rating: number;
  total_calls: number;
  profile_image_url: string;
  is_active: boolean;
}

export interface UserSalesPreference {
  id: number;
  preference_type: 'round-robin' | 'dedicated';
  sales_closer_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CloserRating {
  id: number;
  sales_closer_id: number;
  rating: number;
  review?: string;
  created_at: string;
}

export interface UserActivity {
  id: number;
  sales_closer_id: number;
  activity_type: string;
  activity_data?: string;
  created_at: string;
}

export type SelectedOption = 'round-robin' | 'dedicated' | null;
export type ModalStep = 'closer-selection' | 'terms' | 'confirmation' | null;
