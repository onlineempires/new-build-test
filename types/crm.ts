// CRM System Type Definitions for Digital Era Platform
// Comprehensive interfaces for leads, sales, and customer relationship management

export type LeadSource = 'funnel_optin' | 'landing_page' | 'affiliate_link' | 'manual_import' | 'social_media' | 'referral';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'nurturing' | 'cold' | 'converted';
export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'imessage' | 'instagram' | 'linkedin' | 'manual';
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'disputed' | 'failed';
export type CommunicationStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed';

export interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  funnel_step?: string;
}

export interface Note {
  id: string;
  content: string;
  created_at: Date;
  created_by: string;
  is_pinned: boolean;
  tags: string[];
  type: 'note' | 'reminder' | 'meeting' | 'call' | 'email' | 'task';
}

export interface ContactAttempt {
  id: string;
  method: ContactMethod;
  status: CommunicationStatus;
  subject?: string;
  message: string;
  attempted_at: Date;
  responded_at?: Date;
  response_content?: string;
  template_used?: string;
  automated: boolean;
  cost?: number; // For paid channels like SMS
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'follow_up' | 'nurture' | 'sales' | 'retention' | 'winback';
  variables: string[]; // e.g., ['{{name}}', '{{product}}']
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  conversion_rate: number;
  is_active: boolean;
  created_at: Date;
  last_used: Date;
}

export interface CommunicationChannels {
  email: {
    address: string;
    verified: boolean;
    bounced: boolean;
    last_opened?: Date;
    open_count: number;
    click_count: number;
  };
  phone?: {
    number: string;
    whatsapp_available: boolean;
    imessage_available: boolean;
    sms_available: boolean;
    last_contacted?: Date;
    response_rate: number;
  };
  social: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface LeadScoreFactors {
  email_engagement: number; // 0-20 points
  website_activity: number;  // 0-25 points
  funnel_progression: number; // 0-30 points
  response_speed: number;     // 0-15 points
  social_engagement: number;  // 0-10 points
  demographic_fit: number;    // 0-10 points (location, industry, etc.)
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    timezone?: string;
  };
  
  // Lead Management
  source: LeadSource;
  funnel_id: string;
  funnel_name: string;
  affiliate_id?: string;
  status: LeadStatus;
  tags: string[];
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_contacted?: Date;
  next_follow_up?: Date;
  converted_at?: Date;
  
  // Communication & Engagement
  communication_channels: CommunicationChannels;
  notes: Note[];
  contact_attempts: ContactAttempt[];
  
  // Scoring & Analytics
  lead_score: number; // 0-100 calculated score
  lead_score_factors: LeadScoreFactors;
  engagement_level: 'cold' | 'warm' | 'hot'; // Based on score: 0-30=cold, 31-70=warm, 71-100=hot
  
  // Attribution & Tracking
  utm_data: UTMData;
  referrer_url?: string;
  landing_page?: string;
  ip_address?: string;
  user_agent?: string;
  
  // Preferences & Compliance
  email_subscribed: boolean;
  sms_subscribed: boolean;
  gdpr_consent: boolean;
  marketing_consent: boolean;
  unsubscribed_at?: Date;
  
  // Custom Fields (extensible)
  custom_fields: Record<string, any>;
  
  // Relationship Data
  assigned_to?: string; // User ID of account manager
  sales_rep?: string;
  customer_lifetime_value?: number;
  predicted_conversion_probability: number; // 0-1
}

export interface Sale {
  id: string;
  lead_id: string; // Links back to original lead
  customer_id?: string; // If converted to customer
  
  // Product & Pricing
  product_id: string;
  product_name: string;
  product_sku?: string;
  amount: number;
  currency: string;
  commission_rate: number;
  commission_earned: number;
  
  // Transaction Details
  payment_method: string;
  payment_processor: 'stripe' | 'paypal' | 'manual' | 'crypto';
  transaction_id?: string;
  invoice_id?: string;
  
  // Status & Timing
  payment_status: PaymentStatus;
  sale_date: Date;
  refund_date?: Date;
  refund_amount?: number;
  refund_reason?: string;
  
  // Attribution
  funnel_id: string;
  funnel_name: string;
  affiliate_id?: string;
  affiliate_name?: string;
  utm_data: UTMData;
  
  // Analytics
  days_to_conversion: number; // From lead creation to sale
  touchpoints_to_conversion: number; // Number of interactions before sale
  last_touchpoint: ContactMethod;
  
  // Custom Fields
  custom_fields: Record<string, any>;
}

export interface Customer {
  id: string;
  lead_id: string; // Original lead that converted
  
  // Personal Information
  email: string;
  name: string;
  phone?: string;
  
  // Customer Metrics
  total_purchases: number;
  total_spent: number;
  average_order_value: number;
  purchase_frequency: number; // purchases per month
  last_purchase_date: Date;
  predicted_churn_probability: number; // 0-1
  
  // Relationship
  customer_since: Date;
  customer_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  assigned_success_manager?: string;
  
  // Communication Preferences
  preferred_contact_method: ContactMethod;
  communication_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  
  // Sales History
  sales: Sale[];
  
  // Support & Service
  support_tickets: number;
  satisfaction_score?: number; // 1-5 or 1-10
  nps_score?: number; // Net Promoter Score
}

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  type: 'lead_gen' | 'sales' | 'webinar' | 'product_launch' | 'nurture';
  status: 'active' | 'paused' | 'archived';
  
  // Performance Metrics
  total_visitors: number;
  total_leads: number;
  total_sales: number;
  conversion_rate_visitor_to_lead: number;
  conversion_rate_lead_to_sale: number;
  total_revenue: number;
  
  // Configuration
  landing_page_url: string;
  thank_you_page_url?: string;
  sales_page_url?: string;
  
  // Attribution
  utm_campaign: string;
  utm_source?: string;
  utm_medium?: string;
  
  // Automation Settings
  auto_follow_up_enabled: boolean;
  follow_up_sequence_id?: string;
  lead_scoring_enabled: boolean;
  
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface FilterOptions {
  status: LeadStatus[];
  source: LeadSource[];
  funnel_id: string[];
  lead_score_range: [number, number];
  date_range: [Date, Date];
  tags: string[];
  has_phone: boolean;
  has_company: boolean;
  location: {
    countries: string[];
    states: string[];
    cities: string[];
  };
  engagement_level: ('cold' | 'warm' | 'hot')[];
  last_contacted: 'today' | 'this_week' | 'this_month' | 'overdue' | 'never';
  assigned_to: string[];
  custom_fields: Record<string, any>;
  conversion_probability_range: [number, number];
}

export interface CRMStats {
  // Lead Metrics
  total_leads: number;
  new_leads_today: number;
  new_leads_this_week: number;
  new_leads_this_month: number;
  qualified_leads: number;
  hot_leads: number;
  
  // Conversion Metrics
  total_sales: number;
  sales_today: number;
  sales_this_week: number;
  sales_this_month: number;
  conversion_rate: number;
  average_time_to_conversion: number; // in days
  
  // Revenue Metrics
  total_revenue: number;
  revenue_today: number;
  revenue_this_week: number;
  revenue_this_month: number;
  average_deal_size: number;
  commission_earned: number;
  
  // Engagement Metrics
  email_open_rate: number;
  email_click_rate: number;
  response_rate: number;
  follow_up_completion_rate: number;
  
  // Pipeline Health
  leads_in_nurture: number;
  overdue_follow_ups: number;
  predicted_monthly_revenue: number;
  pipeline_value: number;
  
  // Performance by Source
  performance_by_source: Array<{
    source: LeadSource;
    leads: number;
    conversions: number;
    revenue: number;
    conversion_rate: number;
  }>;
  
  // Performance by Funnel
  performance_by_funnel: Array<{
    funnel_id: string;
    funnel_name: string;
    leads: number;
    conversions: number;
    revenue: number;
    conversion_rate: number;
  }>;
}

export interface BulkAction {
  type: 'update_status' | 'add_tags' | 'remove_tags' | 'assign' | 'schedule_follow_up' | 'send_email' | 'export';
  payload: any;
  lead_ids: string[];
}

export interface FollowUpReminder {
  id: string;
  lead_id: string;
  lead_name: string;
  due_date: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal';
  message: string;
  completed: boolean;
  completed_at?: Date;
  snoozed_until?: Date;
  assigned_to: string;
}

// API Response Types
export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  filters_applied: Partial<FilterOptions>;
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CRMDashboardData {
  stats: CRMStats;
  recent_leads: Lead[];
  recent_sales: Sale[];
  overdue_follow_ups: FollowUpReminder[];
  performance_chart_data: Array<{
    date: string;
    leads: number;
    sales: number;
    revenue: number;
  }>;
  lead_source_distribution: Array<{
    source: LeadSource;
    count: number;
    percentage: number;
  }>;
  conversion_funnel_data: Array<{
    stage: string;
    count: number;
    conversion_rate: number;
  }>;
}

// Utility Types
export type LeadSortField = 'created_at' | 'updated_at' | 'last_contacted' | 'next_follow_up' | 'lead_score' | 'name' | 'email';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: LeadSortField;
  direction: SortDirection;
}

export interface PaginationOptions {
  page: number;
  per_page: number;
}

export interface SearchOptions {
  query: string;
  fields: string[]; // Fields to search in: ['name', 'email', 'company', 'tags']
}

// Form Types for UI Components
export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source: LeadSource;
  funnel_id: string;
  tags: string[];
  notes?: string;
  custom_fields: Record<string, any>;
}

export interface ContactFormData {
  method: ContactMethod;
  subject?: string;
  message: string;
  template_id?: string;
  scheduled_for?: Date;
  follow_up_date?: Date;
}

export interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  emails: Array<{
    template_id: string;
    delay_days: number;
    conditions?: string[]; // Conditions to send this email
  }>;
  trigger_event: 'lead_created' | 'status_change' | 'manual' | 'date_based';
  is_active: boolean;
  total_enrolled: number;
  completion_rate: number;
  conversion_rate: number;
}

export default {
  Lead,
  Sale,
  Customer,
  Funnel,
  CRMStats,
  FilterOptions,
  BulkAction,
  FollowUpReminder,
  EmailTemplate,
  ContactAttempt,
  Note
};