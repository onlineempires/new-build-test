import z from 'zod';

// Funnel Template Schema
export const FunnelTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  preview_image_url: z.string().nullable(),
  default_video_1_url: z.string().nullable(),
  default_video_2_url: z.string().nullable(),
  default_outro_video_url: z.string().nullable(),
  default_title: z.string().nullable(),
  default_title_html: z.string().nullable(),
  default_subtitle: z.string().nullable(),
  default_subtitle_html: z.string().nullable(),
  default_background_image_url: z.string().nullable(),
  default_title_color: z.string().nullable(),
  default_title_size: z.string().nullable(),
  default_subtitle_color: z.string().nullable(),
  default_subtitle_size: z.string().nullable(),
  default_outro_text_color: z.string().nullable(),
  default_outro_text_size: z.string().nullable(),
  default_arrow_color: z.string().nullable(),
  default_show_outro_section: z.number().int().min(0).max(1).nullable(),
  default_outro_text: z.string().nullable(),
  default_calendly_link: z.string().nullable(),
  default_calendly_display_type: z.enum(['button', 'embed', 'both']).default('both'),
  default_autoplay_video: z.number().int().min(0).max(1).nullable(),
  default_funnel_type: z.enum(['direct_webinar', 'email_capture']).default('direct_webinar'),
  default_landing_page_title: z.string().nullable(),
  default_landing_page_subtitle: z.string().nullable(),
  default_landing_page_description: z.string().nullable(),
  default_landing_page_title_html: z.string().nullable(),
  default_landing_page_subtitle_html: z.string().nullable(),
  default_landing_page_description_html: z.string().nullable(),
  default_collect_name: z.number().int().min(0).max(1).nullable(),
  default_collect_email: z.number().int().min(0).max(1).nullable(),
  default_collect_phone: z.number().int().min(0).max(1).nullable(),
  default_collect_instagram: z.number().int().min(0).max(1).nullable(),
  default_email_service_type: z
    .enum(['aweber', 'mailchimp', 'convertkit', 'activecampaign', 'custom_webhook'])
    .nullable(),
  default_activecampaign_api_url: z.string().nullable(),
  default_activecampaign_api_key: z.string().nullable(),
  default_activecampaign_list_id: z.string().nullable(),
  default_landing_page_button_text: z.string().nullable(),
  default_landing_page_button_bg_color: z.string().nullable(),
  default_landing_page_button_bg_gradient: z.string().nullable(),
  default_landing_page_button_text_color: z.string().nullable(),
  default_landing_page_button_use_gradient: z.number().int().min(0).max(1).nullable(),
  default_calendly_button_bg_color: z.string().nullable(),
  default_calendly_button_bg_gradient: z.string().nullable(),
  default_calendly_button_text_color: z.string().nullable(),
  default_calendly_button_use_gradient: z.number().int().min(0).max(1).nullable(),
  default_landing_page_background_image_url: z.string().nullable(),
  default_landing_page_privacy_text: z.string().nullable(),
  default_landing_page_privacy_text_color: z.string().nullable(),
  default_landing_page_form_heading: z.string().nullable(),
  default_landing_page_show_icon: z.number().int().min(0).max(1).nullable(),
  default_background_image_overlay_opacity: z.number().int().min(0).max(100).nullable(),
  default_landing_page_background_overlay_opacity: z.number().int().min(0).max(100).nullable(),
  default_outro_background_overlay_opacity: z.number().int().min(0).max(100).nullable(),
  default_landing_page_background_color: z.string().nullable(),
  default_webinar_background_color: z.string().nullable(),
  default_outro_background_image_url: z.string().nullable(),
  default_outro_background_color: z.string().nullable(),
  default_meta_title: z.string().nullable(),
  default_meta_description: z.string().nullable(),
  default_og_image_url: z.string().nullable(),
  default_landing_page_logo_size: z.string().nullable(),
  is_active: z.number().int().min(0).max(1),
  created_at: z.union([z.string(), z.date()]),
  updated_at: z.union([z.string(), z.date()]),
});

export type FunnelTemplate = z.infer<typeof FunnelTemplateSchema>;

// Member Funnel Schema
export const MemberFunnelSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  template_id: z.number().nullable(),
  funnel_name: z.string().nullable(),
  title: z.string(),
  subtitle: z.string().nullable(),
  selected_video_type: z.enum(['video_1', 'video_2', 'custom']).default('video_1'),
  custom_video_url: z.string().nullable(),
  background_image_url: z.string().nullable(),
  show_outro_section: z.number().int().min(0).max(1).default(1),
  outro_text: z.string().nullable(),
  outro_video_type: z.enum(['option_1', 'custom']).default('option_1'),
  outro_custom_url: z.string().nullable(),
  calendly_link: z.string().nullable(),
  calendly_display_type: z.enum(['button', 'embed', 'both']).default('both'),
  is_published: z.number().int().min(0).max(1).default(0),
  slug: z.string().nullable(),
  title_color: z.string().nullable(),
  title_size: z.string().nullable(),
  subtitle_color: z.string().nullable(),
  subtitle_size: z.string().nullable(),
  title_html: z.string().nullable(),
  subtitle_html: z.string().nullable(),
  outro_text_html: z.string().nullable(),
  outro_text_color: z.string().nullable(),
  outro_text_size: z.string().nullable(),
  autoplay_video: z.number().int().min(0).max(1).default(0),
  arrow_color: z.string().nullable(),
  funnel_type: z.enum(['direct_webinar', 'email_capture']).default('direct_webinar'),
  landing_page_title: z.string().nullable(),
  landing_page_subtitle: z.string().nullable(),
  landing_page_description: z.string().nullable(),
  landing_page_title_html: z.string().nullable(),
  landing_page_subtitle_html: z.string().nullable(),
  landing_page_description_html: z.string().nullable(),
  collect_name: z.number().int().min(0).max(1).nullable(),
  collect_email: z.number().int().min(0).max(1).nullable(),
  collect_phone: z.number().int().min(0).max(1).nullable(),
  collect_instagram: z.number().int().min(0).max(1).nullable(),
  email_service_type: z
    .enum(['aweber', 'mailchimp', 'convertkit', 'activecampaign', 'custom_webhook'])
    .nullable(),
  aweber_list_id: z.string().nullable(),
  aweber_account_id: z.string().nullable(),
  aweber_access_token: z.string().nullable(),
  aweber_refresh_token: z.string().nullable(),
  aweber_token_expires_at: z.string().nullable(),
  mailchimp_list_id: z.string().nullable(),
  mailchimp_api_key: z.string().nullable(),
  convertkit_form_id: z.string().nullable(),
  convertkit_api_key: z.string().nullable(),
  activecampaign_api_url: z.string().nullable(),
  activecampaign_api_key: z.string().nullable(),
  activecampaign_list_id: z.string().nullable(),
  custom_email_webhook: z.string().nullable(),
  landing_page_button_text: z.string().nullable(),
  landing_page_button_bg_color: z.string().nullable(),
  landing_page_button_bg_gradient: z.string().nullable(),
  landing_page_button_text_color: z.string().nullable(),
  landing_page_button_use_gradient: z.number().int().min(0).max(1).nullable(),
  calendly_button_bg_color: z.string().nullable(),
  calendly_button_bg_gradient: z.string().nullable(),
  calendly_button_text_color: z.string().nullable(),
  calendly_button_use_gradient: z.number().int().min(0).max(1).nullable(),
  landing_page_background_image_url: z.string().nullable(),
  landing_page_background_color: z.string().nullable(),
  webinar_background_color: z.string().nullable(),
  background_image_overlay_opacity: z.number().int().min(0).max(100).nullable(),
  landing_page_background_overlay_opacity: z.number().int().min(0).max(100).nullable(),
  outro_background_image_url: z.string().nullable(),
  outro_background_color: z.string().nullable(),
  outro_background_overlay_opacity: z.number().int().min(0).max(100).nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  og_image_url: z.string().nullable(),
  landing_page_form_heading: z.string().nullable(),
  landing_page_show_icon: z.number().int().min(0).max(1).nullable(),
  landing_page_privacy_text: z.string().nullable(),
  landing_page_privacy_text_color: z.string().nullable(),
  landing_page_logo_url: z.string().nullable(),
  landing_page_logo_size: z.string().nullable(),
  landing_page_form_icon: z.string().nullable(),
  created_at: z.union([z.string(), z.date()]),
  updated_at: z.union([z.string(), z.date()]),
});

export type MemberFunnel = z.infer<typeof MemberFunnelSchema>;

// Extended type for MemberFunnel with analytics data
export type MemberFunnelWithAnalytics = MemberFunnel & {
  total_views?: number;
  unique_views?: number;
  video_views?: number;
  conversions?: number;
  lead_count?: number;
};

// Analytics Schema
export const FunnelAnalyticsSchema = z.object({
  id: z.number(),
  funnel_id: z.number(),
  visitor_ip: z.string().nullable(),
  video_watched: z.number().int().min(0).max(1).default(0),
  outro_watched: z.number().int().min(0).max(1).default(0),
  calendly_clicked: z.number().int().min(0).max(1).default(0),
  conversion_completed: z.number().int().min(0).max(1).default(0),
  visited_at: z.union([z.string(), z.date()]),
});

export type FunnelAnalytics = z.infer<typeof FunnelAnalyticsSchema>;

// User Template Schema
export const UserTemplateSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  preview_image_url: z.string().nullable(),
  default_title: z.string().nullable(),
  default_subtitle: z.string().nullable(),
  default_background_image_url: z.string().nullable(),
  default_video_1_url: z.string().nullable(),
  default_video_2_url: z.string().nullable(),
  default_outro_video_url: z.string().nullable(),
  default_title_color: z.string().nullable(),
  default_title_size: z.string().nullable(),
  default_subtitle_color: z.string().nullable(),
  default_subtitle_size: z.string().nullable(),
  default_outro_text_color: z.string().nullable(),
  default_outro_text_size: z.string().nullable(),
  default_arrow_color: z.string().nullable(),
  default_show_outro_section: z.number().int().min(0).max(1).nullable(),
  default_outro_text: z.string().nullable(),
  default_calendly_link: z.string().nullable(),
  default_calendly_display_type: z.enum(['button', 'embed', 'both']).default('both'),
  default_autoplay_video: z.number().int().min(0).max(1).nullable(),
  is_active: z.number().int().min(0).max(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserTemplate = z.infer<typeof UserTemplateSchema>;

// Lead Schema
export const LeadSchema = z.object({
  id: z.number(),
  funnel_id: z.number(),
  user_id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  instagram: z.string().nullable(),
  funnel_name: z.string().nullable(),
  funnel_slug: z.string(),
  status: z.enum(['new', 'contacted', 'member', 'archived']).default('new'),
  source: z.string(),
  visitor_ip: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Lead = z.infer<typeof LeadSchema>;

// API Request Schemas
export const CreateFunnelTemplateSchema = z.object({
  name: z.string().min(1),
  description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  category: z.string().default('General'),
  preview_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_video_1_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_video_2_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_outro_video_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_title_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_subtitle: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_subtitle_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_title_color: z.string().default('#ffffff'),
  default_title_size: z.string().default('text-4xl'),
  default_subtitle_color: z.string().default('#d1d5db'),
  default_subtitle_size: z.string().default('text-xl'),
  default_outro_text_color: z.string().default('#d1d5db'),
  default_outro_text_size: z.string().default('text-xl'),
  default_arrow_color: z.string().default('#3b82f6'),
  default_show_outro_section: z.boolean().default(true),
  default_outro_text: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_calendly_link: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_calendly_display_type: z.enum(['button', 'embed', 'both']).default('both'),
  default_autoplay_video: z.boolean().default(false),
  default_funnel_type: z.enum(['direct_webinar', 'email_capture']).default('direct_webinar'),
  default_landing_page_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_subtitle: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_title_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_subtitle_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_description_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_collect_name: z.boolean().default(false),
  default_collect_email: z.boolean().default(true),
  default_collect_phone: z.boolean().default(false),
  default_collect_instagram: z.boolean().default(false),
  default_email_service_type: z
    .enum(['aweber', 'mailchimp', 'convertkit', 'activecampaign', 'custom_webhook'])
    .nullable()
    .optional(),
  default_activecampaign_api_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_activecampaign_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_activecampaign_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_button_text: z.string().default('Get Instant Access'),
  default_landing_page_button_bg_color: z.string().default('#3b82f6'),
  default_landing_page_button_bg_gradient: z.string().default('from-blue-600 to-purple-600'),
  default_landing_page_button_text_color: z.string().default('#ffffff'),
  default_landing_page_button_use_gradient: z.boolean().default(true),
  default_calendly_button_bg_color: z.string().default('#3b82f6'),
  default_calendly_button_bg_gradient: z.string().default('from-blue-600 to-purple-600'),
  default_calendly_button_text_color: z.string().default('#ffffff'),
  default_calendly_button_use_gradient: z.boolean().default(true),
  default_landing_page_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_privacy_text: z
    .string()
    .default('🔒 We respect your privacy. Your email will not be shared.'),
  default_landing_page_privacy_text_color: z.string().default('#9ca3af'),
  default_landing_page_form_heading: z.string().default('Enter Your Email to Watch Now'),
  default_landing_page_show_icon: z.boolean().default(true),
  default_landing_page_logo_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_landing_page_logo_size: z.enum(['small', 'medium', 'large']).default('medium'),
  default_landing_page_form_icon: z.string().default('Mail'),
  default_background_image_overlay_opacity: z.number().min(0).max(100).default(60),
  default_landing_page_background_overlay_opacity: z.number().min(0).max(100).default(60),
  default_outro_background_overlay_opacity: z.number().min(0).max(100).default(60),
  default_landing_page_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_webinar_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_outro_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_outro_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_meta_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_meta_description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  default_og_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
});

export const CreateMemberFunnelSchema = z.object({
  template_id: z.number().nullable().optional(),
  funnel_name: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  title: z.string().min(1),
  subtitle: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  selected_video_type: z.enum(['video_1', 'video_2', 'custom']).default('video_1'),
  custom_video_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  show_outro_section: z.boolean().default(true),
  outro_text: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_video_type: z.enum(['option_1', 'custom']).default('option_1'),
  outro_custom_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  calendly_link: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  calendly_display_type: z.enum(['button', 'embed', 'both']).default('both'),
  title_color: z.string().optional(),
  title_size: z.string().optional(),
  subtitle_color: z.string().optional(),
  subtitle_size: z.string().optional(),
  title_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  subtitle_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_text_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_text_color: z.string().optional(),
  outro_text_size: z.string().optional(),
  autoplay_video: z.boolean().default(false),
  arrow_color: z.string().optional(),
  funnel_type: z.enum(['direct_webinar', 'email_capture']).default('direct_webinar'),
  landing_page_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_subtitle: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_title_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_subtitle_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_description_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  collect_name: z.boolean().default(false),
  collect_email: z.boolean().default(true),
  collect_phone: z.boolean().default(false),
  collect_instagram: z.boolean().default(false),
  email_service_type: z
    .enum(['aweber', 'mailchimp', 'convertkit', 'activecampaign', 'custom_webhook'])
    .optional(),
  aweber_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_account_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_access_token: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_refresh_token: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_token_expires_at: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  mailchimp_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  mailchimp_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  convertkit_form_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  convertkit_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  activecampaign_api_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  activecampaign_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  activecampaign_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  custom_email_webhook: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_button_text: z.string().default('Get Instant Access'),
  landing_page_button_bg_color: z.string().default('#3b82f6'),
  landing_page_button_bg_gradient: z.string().default('from-blue-600 to-purple-600'),
  landing_page_button_text_color: z.string().default('#ffffff'),
  landing_page_button_use_gradient: z.boolean().default(true),
  calendly_button_bg_color: z.string().default('#3b82f6'),
  calendly_button_bg_gradient: z.string().default('from-blue-600 to-purple-600'),
  calendly_button_text_color: z.string().default('#ffffff'),
  calendly_button_use_gradient: z.boolean().default(true),
  landing_page_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  webinar_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  background_image_overlay_opacity: z.number().min(0).max(100).default(60),
  landing_page_background_overlay_opacity: z.number().min(0).max(100).default(60),
  outro_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_background_overlay_opacity: z.number().min(0).max(100).default(60),
  landing_page_form_heading: z.string().default('Enter Your Email to Watch Now'),
  landing_page_show_icon: z.boolean().default(true),
  landing_page_privacy_text: z
    .string()
    .default('🔒 We respect your privacy. Your email will not be shared.'),
  landing_page_privacy_text_color: z.string().default('#9ca3af'),
  landing_page_logo_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_logo_size: z.enum(['small', 'medium', 'large']).default('medium'),
  landing_page_form_icon: z.string().default('Mail'),
  meta_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  meta_description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  og_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
});

export const UpdateMemberFunnelSchema = z.object({
  template_id: z.number().nullable().optional(),
  funnel_name: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  title: z.string().min(1).optional(),
  subtitle: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  selected_video_type: z.enum(['video_1', 'video_2', 'custom']).optional(),
  custom_video_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  show_outro_section: z.boolean().optional(),
  outro_text: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_video_type: z.enum(['option_1', 'custom']).optional(),
  outro_custom_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  calendly_link: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  calendly_display_type: z.enum(['button', 'embed', 'both']).optional(),
  title_color: z.string().optional(),
  title_size: z.string().optional(),
  subtitle_color: z.string().optional(),
  subtitle_size: z.string().optional(),
  title_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  subtitle_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_text_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_text_color: z.string().optional(),
  outro_text_size: z.string().optional(),
  autoplay_video: z.boolean().optional(),
  arrow_color: z.string().optional(),
  funnel_type: z.enum(['direct_webinar', 'email_capture']).optional(),
  landing_page_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_subtitle: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_title_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_subtitle_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_description_html: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  collect_name: z.boolean().optional(),
  collect_email: z.boolean().optional(),
  collect_phone: z.boolean().optional(),
  collect_instagram: z.boolean().optional(),
  email_service_type: z
    .enum(['aweber', 'mailchimp', 'convertkit', 'activecampaign', 'custom_webhook'])
    .optional(),
  aweber_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_account_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_access_token: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_refresh_token: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  aweber_token_expires_at: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  mailchimp_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  mailchimp_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  convertkit_form_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  convertkit_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  activecampaign_api_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  activecampaign_api_key: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  activecampaign_list_id: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  custom_email_webhook: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_button_text: z.string().optional(),
  landing_page_button_bg_color: z.string().optional(),
  landing_page_button_bg_gradient: z.string().optional(),
  landing_page_button_text_color: z.string().optional(),
  landing_page_button_use_gradient: z.boolean().optional(),
  calendly_button_bg_color: z.string().optional(),
  calendly_button_bg_gradient: z.string().optional(),
  calendly_button_text_color: z.string().optional(),
  calendly_button_use_gradient: z.boolean().optional(),
  landing_page_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  webinar_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  background_image_overlay_opacity: z.number().min(0).max(100).optional(),
  landing_page_background_overlay_opacity: z.number().min(0).max(100).optional(),
  outro_background_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_background_color: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  outro_background_overlay_opacity: z.number().min(0).max(100).optional(),
  landing_page_form_heading: z.string().optional(),
  landing_page_show_icon: z.boolean().optional(),
  landing_page_privacy_text: z.string().optional(),
  landing_page_privacy_text_color: z.string().optional(),
  landing_page_logo_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  landing_page_logo_size: z.enum(['small', 'medium', 'large']).optional(),
  landing_page_form_icon: z.string().optional(),
  meta_title: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  meta_description: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
  og_image_url: z
    .string()
    .transform((val: string) => (val === '' ? undefined : val))
    .optional(),
});

export const TrackAnalyticsSchema = z.object({
  page_visit: z.boolean().optional(),
  video_watched: z.boolean().optional(),
  outro_watched: z.boolean().optional(),
  calendly_clicked: z.boolean().optional(),
  conversion_completed: z.boolean().optional(),
});

// Export types
export type CreateFunnelTemplate = z.infer<typeof CreateFunnelTemplateSchema>;
export type CreateMemberFunnel = z.infer<typeof CreateMemberFunnelSchema>;
export type UpdateMemberFunnel = z.infer<typeof UpdateMemberFunnelSchema>;
export type TrackAnalytics = z.infer<typeof TrackAnalyticsSchema>;
