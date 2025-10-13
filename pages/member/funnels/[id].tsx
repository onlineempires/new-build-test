import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import useAuth from '@/utils/useAuth';
import FunnelPreview from '@/components/funnel/FunnelPreview';
import LandingPagePreview from '@/components/funnel/LandingPagePreview';
import ImageUpload from '@/components/funnel/ImageUpload';
import TemplateSelector from '@/components/funnel/TemplateSelector';
import JoditEditor from '@/components/funnel/JoditEditor';
import AppLayout from '../../../components/layout/AppLayout';
import { funnelApi } from '../../../lib/api/funnel';

// Hook to calculate available space dynamically
const useAvailableSpace = () => {
  const [availableSpace, setAvailableSpace] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    const calculateSpace = () => {
      const sidebar = document.querySelector('[data-sidebar]') as HTMLElement;
      const header = document.querySelector('[data-header]') as HTMLElement;

      // Fallback values for when elements aren't found
      const sidebarWidth = sidebar ? sidebar.offsetWidth : window.innerWidth >= 1024 ? 256 : 0;
      const headerHeight = header ? header.offsetHeight : 64;

      setAvailableSpace({
        left: sidebarWidth,
        top: headerHeight + 20, // Add 20px offset to lower the modal
        right: 0,
        bottom: 0,
      });
    };

    // Calculate on mount and when window resizes
    calculateSpace();
    window.addEventListener('resize', calculateSpace);

    // Also listen for sidebar/header changes
    const observer = new MutationObserver(calculateSpace);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      window.removeEventListener('resize', calculateSpace);
      observer.disconnect();
    };
  }, []);

  return availableSpace;
};
import {
  Save,
  Eye,
  ArrowLeft,
  Loader2,
  Palette,
  Video,
  Type,
  Calendar,
  Settings,
  Mail,
  BookmarkPlus,
} from 'lucide-react';
import type {
  MemberFunnel,
  FunnelTemplate,
  CreateMemberFunnel,
  UserTemplate,
} from '@/types/funnel';

export default function FunnelEditor() {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id) && id !== 'new';
  const availableSpace = useAvailableSpace();
  // no portal state

  useEffect(() => {
    // no-op
  }, []);

  const [funnel, setFunnel] = useState<MemberFunnel | null>(null);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [showTemplateSelector, setShowTemplateSelector] = useState(!isEditing);
  const [aweberLists, setAweberLists] = useState<any[]>([]);
  const [aweberConnected, setAweberConnected] = useState(false);
  const [aweberLoading, setAweberLoading] = useState(false);
  const [showSaveAsTemplateModal, setShowSaveAsTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Personal');
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [formData, setFormData] = useState<CreateMemberFunnel>({
    template_id: 1, // Default to the existing template
    funnel_name: '',
    title: '',
    subtitle: '',
    selected_video_type: 'video_1',
    custom_video_url: '',
    background_image_url: '',
    show_outro_section: true,
    outro_text: '',
    outro_video_type: 'option_1',
    outro_custom_url: '',
    calendly_link: '',
    calendly_display_type: 'both' as const,
    title_color: '#ffffff',
    title_size: 'text-4xl',
    subtitle_color: '#d1d5db',
    subtitle_size: 'text-xl',
    title_html: '',
    subtitle_html: '',
    outro_text_html: '',
    outro_text_color: '#d1d5db',
    outro_text_size: 'text-xl',
    autoplay_video: false,
    arrow_color: '#3b82f6',
    funnel_type: 'direct_webinar',
    landing_page_title: '',
    landing_page_subtitle: '',
    landing_page_description: '',
    landing_page_title_html: '',
    landing_page_subtitle_html: '',
    landing_page_description_html: '',
    collect_name: false,
    collect_email: true,
    collect_phone: false,
    collect_instagram: false,
    email_service_type: undefined,
    aweber_list_id: '',
    aweber_account_id: '',
    aweber_access_token: '',
    aweber_refresh_token: '',
    aweber_token_expires_at: '',
    mailchimp_list_id: '',
    mailchimp_api_key: '',
    convertkit_form_id: '',
    convertkit_api_key: '',
    activecampaign_api_url: '',
    activecampaign_api_key: '',
    activecampaign_list_id: '',
    custom_email_webhook: '',
    landing_page_button_text: 'Get Instant Access',
    landing_page_background_image_url: '',
    landing_page_background_color: '',
    webinar_background_color: '',
    background_image_overlay_opacity: 60,
    landing_page_background_overlay_opacity: 60,
    landing_page_form_heading: 'Enter Your Email to Watch Now',
    landing_page_show_icon: true,
    landing_page_privacy_text: '🔒 We respect your privacy. Your email will not be shared.',
    landing_page_privacy_text_color: '#9ca3af',
    landing_page_logo_url: '',
    landing_page_logo_size: 'medium' as const,
    landing_page_form_icon: 'Mail',
    outro_background_image_url: '',
    outro_background_color: '',
    outro_background_overlay_opacity: 60,
    meta_title: '',
    meta_description: '',
    og_image_url: '',
    landing_page_button_bg_color: '#3b82f6',
    landing_page_button_bg_gradient: 'from-blue-600 to-purple-600',
    landing_page_button_text_color: '#ffffff',
    landing_page_button_use_gradient: true,
    calendly_button_bg_color: '#3b82f6',
    calendly_button_bg_gradient: 'from-blue-600 to-purple-600',
    calendly_button_text_color: '#ffffff',
    calendly_button_use_gradient: true,
  });

  useEffect(() => {
    if (!isPending && !user) {
      router.push('/');
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (user) {
      fetchTemplates();
      if (isEditing) {
        fetchFunnel();
      } else {
        // For new funnels, show template selector
        setShowTemplateSelector(true);
      }

      // Check for AWeber OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('aweber_success')) {
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const expiresAt = urlParams.get('expires_at');

        if (accessToken && refreshToken && expiresAt) {
          handleInputChange('aweber_access_token', decodeURIComponent(accessToken));
          handleInputChange('aweber_refresh_token', decodeURIComponent(refreshToken));
          handleInputChange('aweber_token_expires_at', decodeURIComponent(expiresAt));

          // Fetch AWeber lists
          fetchAweberLists(decodeURIComponent(accessToken));

          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (urlParams.get('aweber_error')) {
        alert(
          'AWeber connection failed: ' +
            decodeURIComponent(urlParams.get('aweber_error') || 'Unknown error')
        );
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user, isEditing, id]);

  useEffect(() => {
    // Check if AWeber is already connected
    if (formData.aweber_access_token && formData.aweber_account_id) {
      setAweberConnected(true);
      if (formData.aweber_access_token) {
        fetchAweberLists(formData.aweber_access_token);
      }
    }
  }, [formData.aweber_access_token, formData.aweber_account_id]);

  const fetchTemplates = async () => {
    try {
      await funnelApi.adminTemplate.getTemplates();
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const fetchFunnel = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/member/funnels/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFunnel(data);
        setFormData({
          template_id: data.template_id,
          funnel_name: data.funnel_name || '',
          title: data.title,
          subtitle: data.subtitle || '',
          selected_video_type: data.selected_video_type,
          custom_video_url: data.custom_video_url || '',
          background_image_url: data.background_image_url || '',
          show_outro_section: Boolean(data.show_outro_section),
          outro_text: data.outro_text || '',
          outro_video_type: data.outro_video_type,
          outro_custom_url: data.outro_custom_url || '',
          calendly_link: data.calendly_link || '',
          calendly_display_type:
            (data.calendly_display_type as 'button' | 'embed' | 'both') || 'both',
          title_color: data.title_color || '#ffffff',
          title_size: data.title_size || 'text-4xl',
          subtitle_color: data.subtitle_color || '#d1d5db',
          subtitle_size: data.subtitle_size || 'text-xl',
          title_html: data.title_html || '',
          subtitle_html: data.subtitle_html || '',
          outro_text_html: data.outro_text_html || '',
          outro_text_color: data.outro_text_color || '#d1d5db',
          outro_text_size: data.outro_text_size || 'text-xl',
          autoplay_video: Boolean(data.autoplay_video),
          arrow_color: data.arrow_color || '#3b82f6',
          funnel_type: (data.funnel_type as 'direct_webinar' | 'email_capture') || 'direct_webinar',
          landing_page_title: data.landing_page_title || '',
          landing_page_subtitle: data.landing_page_subtitle || '',
          landing_page_description: data.landing_page_description || '',
          landing_page_title_html: data.landing_page_title_html || '',
          landing_page_subtitle_html: data.landing_page_subtitle_html || '',
          landing_page_description_html: data.landing_page_description_html || '',
          collect_name: Boolean(data.collect_name),
          collect_email: Boolean(data.collect_email),
          collect_phone: Boolean(data.collect_phone),
          collect_instagram: Boolean(data.collect_instagram),
          email_service_type: data.email_service_type as
            | 'aweber'
            | 'mailchimp'
            | 'convertkit'
            | 'activecampaign'
            | 'custom_webhook'
            | undefined,
          aweber_list_id: data.aweber_list_id || '',
          aweber_account_id: data.aweber_account_id || '',
          aweber_access_token: data.aweber_access_token || '',
          aweber_refresh_token: data.aweber_refresh_token || '',
          aweber_token_expires_at: data.aweber_token_expires_at || '',
          mailchimp_list_id: data.mailchimp_list_id || '',
          mailchimp_api_key: data.mailchimp_api_key || '',
          convertkit_form_id: data.convertkit_form_id || '',
          convertkit_api_key: data.convertkit_api_key || '',
          activecampaign_api_url: data.activecampaign_api_url || '',
          activecampaign_api_key: data.activecampaign_api_key || '',
          activecampaign_list_id: data.activecampaign_list_id || '',
          custom_email_webhook: data.custom_email_webhook || '',
          landing_page_button_text: data.landing_page_button_text || 'Get Instant Access',
          landing_page_background_image_url: data.landing_page_background_image_url || '',
          landing_page_background_color: data.landing_page_background_color || '',
          webinar_background_color: data.webinar_background_color || '',
          background_image_overlay_opacity: data.background_image_overlay_opacity ?? 60,
          landing_page_background_overlay_opacity:
            data.landing_page_background_overlay_opacity ?? 60,
          outro_background_image_url: data.outro_background_image_url || '',
          outro_background_color: data.outro_background_color || '',
          outro_background_overlay_opacity: data.outro_background_overlay_opacity ?? 60,
          landing_page_form_heading:
            data.landing_page_form_heading || 'Enter Your Email to Watch Now',
          landing_page_show_icon: Boolean(data.landing_page_show_icon !== 0),
          landing_page_privacy_text:
            data.landing_page_privacy_text ||
            '🔒 We respect your privacy. Your email will not be shared.',
          landing_page_privacy_text_color: data.landing_page_privacy_text_color || '#9ca3af',
          landing_page_logo_url: data.landing_page_logo_url || '',
          landing_page_logo_size:
            (data.landing_page_logo_size as 'small' | 'medium' | 'large') || 'medium',
          landing_page_form_icon: data.landing_page_form_icon || 'Mail',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          og_image_url: data.og_image_url || '',
          landing_page_button_bg_color: data.landing_page_button_bg_color || '#3b82f6',
          landing_page_button_bg_gradient:
            data.landing_page_button_bg_gradient || 'from-blue-600 to-purple-600',
          landing_page_button_text_color: data.landing_page_button_text_color || '#ffffff',
          landing_page_button_use_gradient: Boolean(data.landing_page_button_use_gradient !== 0),
          calendly_button_bg_color: data.calendly_button_bg_color || '#3b82f6',
          calendly_button_bg_gradient:
            data.calendly_button_bg_gradient || 'from-blue-600 to-purple-600',
          calendly_button_text_color: data.calendly_button_text_color || '#ffffff',
          calendly_button_use_gradient: Boolean(data.calendly_button_use_gradient !== 0),
        });
      }
    } catch (error) {
      console.error('Failed to fetch funnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (shouldPublish = false) => {
    setSaving(true);
    try {
      const url = isEditing ? `/member/funnels/${id}` : '/member/funnels';
      const method = isEditing ? 'PUT' : 'POST';

      // Clean up the data before sending
      const cleanData = {
        ...formData,
        // Convert boolean to match backend expectations
        show_outro_section: formData.show_outro_section,
        // Ensure empty strings are handled properly
        funnel_name: formData.funnel_name || undefined,
        subtitle: formData.subtitle || undefined,
        custom_video_url: formData.custom_video_url || undefined,
        background_image_url: formData.background_image_url || undefined,
        outro_text: formData.outro_text || undefined,
        outro_custom_url: formData.outro_custom_url || undefined,
        calendly_link: formData.calendly_link || undefined,
        calendly_display_type: formData.calendly_display_type,
        title_html: formData.title_html || undefined,
        subtitle_html: formData.subtitle_html || undefined,
        outro_text_html: formData.outro_text_html || undefined,
        outro_text_color: formData.outro_text_color || undefined,
        outro_text_size: formData.outro_text_size || undefined,
        arrow_color: formData.arrow_color || undefined,
        landing_page_title: formData.landing_page_title || undefined,
        landing_page_subtitle: formData.landing_page_subtitle || undefined,
        landing_page_description: formData.landing_page_description || undefined,
        email_service_type: formData.email_service_type || undefined,
        aweber_list_id: formData.aweber_list_id || undefined,
        aweber_account_id: formData.aweber_account_id || undefined,
        aweber_access_token: formData.aweber_access_token || undefined,
        aweber_refresh_token: formData.aweber_refresh_token || undefined,
        aweber_token_expires_at: formData.aweber_token_expires_at || undefined,
        mailchimp_list_id: formData.mailchimp_list_id || undefined,
        mailchimp_api_key: formData.mailchimp_api_key || undefined,
        convertkit_form_id: formData.convertkit_form_id || undefined,
        convertkit_api_key: formData.convertkit_api_key || undefined,
        activecampaign_api_url: formData.activecampaign_api_url || undefined,
        activecampaign_api_key: formData.activecampaign_api_key || undefined,
        activecampaign_list_id: formData.activecampaign_list_id || undefined,
        custom_email_webhook: formData.custom_email_webhook || undefined,
        landing_page_background_image_url: formData.landing_page_background_image_url || undefined,
        landing_page_title_html: formData.landing_page_title_html || undefined,
        landing_page_subtitle_html: formData.landing_page_subtitle_html || undefined,
        landing_page_description_html: formData.landing_page_description_html || undefined,
        collect_name: formData.collect_name,
        collect_email: formData.collect_email,
        collect_phone: formData.collect_phone,
        collect_instagram: formData.collect_instagram,
        background_image_overlay_opacity: formData.background_image_overlay_opacity ?? 60,
        landing_page_background_overlay_opacity:
          formData.landing_page_background_overlay_opacity ?? 60,
        outro_background_image_url: formData.outro_background_image_url || undefined,
        outro_background_color: formData.outro_background_color || undefined,
        outro_background_overlay_opacity: formData.outro_background_overlay_opacity ?? 60,
        landing_page_form_heading:
          formData.landing_page_form_heading || 'Enter Your Email to Watch Now',
        landing_page_show_icon: formData.landing_page_show_icon,
        landing_page_privacy_text:
          formData.landing_page_privacy_text ||
          '🔒 We respect your privacy. Your email will not be shared.',
        landing_page_privacy_text_color: formData.landing_page_privacy_text_color,
        landing_page_logo_url: formData.landing_page_logo_url || undefined,
        landing_page_logo_size: formData.landing_page_logo_size || 'medium',
        landing_page_form_icon: formData.landing_page_form_icon || 'Mail',
        landing_page_button_bg_color: formData.landing_page_button_bg_color || undefined,
        landing_page_button_bg_gradient: formData.landing_page_button_bg_gradient || undefined,
        landing_page_button_text_color: formData.landing_page_button_text_color || undefined,
        landing_page_button_use_gradient: formData.landing_page_button_use_gradient,
        calendly_button_bg_color: formData.calendly_button_bg_color || undefined,
        calendly_button_bg_gradient: formData.calendly_button_bg_gradient || undefined,
        calendly_button_text_color: formData.calendly_button_text_color || undefined,
        calendly_button_use_gradient: formData.calendly_button_use_gradient,
      };

      console.log('Sending data:', cleanData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Funnel saved successfully:', result);

        // If this is a new funnel and we should publish it
        if (shouldPublish && !isEditing && result.id) {
          try {
            const publishResponse = await fetch(`/member/funnels/${result.id}/publish`, {
              method: 'POST',
            });
            if (publishResponse.ok) {
              console.log('Funnel published successfully');
            } else {
              console.error('Failed to publish funnel');
              alert(
                'Funnel saved but failed to publish. You can publish it from the My Funnels page.'
              );
            }
          } catch (publishError) {
            console.error('Failed to publish funnel:', publishError);
            alert(
              'Funnel saved but failed to publish. You can publish it from the My Funnels page.'
            );
          }
        }

        router.push('/member/funnels');
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          console.error('Failed to save funnel:', response.status, errorData);

          // Handle different error response formats
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData && typeof errorData === 'object') {
            // Check various possible error fields
            if (errorData.error && typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            } else if (errorData.message && typeof errorData.message === 'string') {
              errorMessage = errorData.message;
            } else if (errorData.details && typeof errorData.details === 'string') {
              errorMessage = errorData.details;
            } else if (errorData.issues && Array.isArray(errorData.issues)) {
              // Handle Zod validation errors
              errorMessage = errorData.issues
                .map((issue: any) => {
                  const path = issue.path ? issue.path.join('.') : '';
                  return path ? `${path}: ${issue.message}` : issue.message;
                })
                .join(', ');
            } else {
              // Fallback - try to stringify the error object safely
              try {
                errorMessage = JSON.stringify(errorData, null, 2);
              } catch {
                errorMessage = `Server error (${response.status})`;
              }
            }
          } else {
            errorMessage = `Server error: ${response.status}`;
          }
        } catch (e) {
          console.error('Failed to parse error response:', e);
          errorMessage = `Server error (${response.status}) - Unable to parse error details`;
        }
        alert(`Failed to save funnel: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to save funnel:', error);
      alert('Failed to save funnel. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateMemberFunnel, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const initiateAweberAuth = async () => {
    try {
      setAweberLoading(true);
      const response = await fetch('/aweber/auth/redirect');
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate AWeber authentication');
      }
    } catch (error) {
      console.error('AWeber auth error:', error);
      alert('Failed to connect to AWeber');
    } finally {
      setAweberLoading(false);
    }
  };

  const fetchAweberLists = async (accessToken: string) => {
    try {
      setAweberLoading(true);
      const response = await fetch(`/aweber/lists?access_token=${encodeURIComponent(accessToken)}`);
      if (response.ok) {
        const data = await response.json();
        setAweberLists(data.lists);
        setAweberConnected(true);

        // Auto-set account ID if not already set
        if (!formData.aweber_account_id && data.accountId) {
          handleInputChange('aweber_account_id', data.accountId);
        }
      } else {
        console.error('Failed to fetch AWeber lists');
        setAweberConnected(false);
      }
    } catch (error) {
      console.error('AWeber lists error:', error);
      setAweberConnected(false);
    } finally {
      setAweberLoading(false);
    }
  };

  const disconnectAweber = () => {
    handleInputChange('aweber_access_token', '');
    handleInputChange('aweber_refresh_token', '');
    handleInputChange('aweber_token_expires_at', '');
    handleInputChange('aweber_account_id', '');
    handleInputChange('aweber_list_id', '');
    setAweberConnected(false);
    setAweberLists([]);
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    setSavingTemplate(true);
    try {
      const response = await fetch(`/member/funnels/${id}/save-as-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateName.trim(),
          description: templateDescription.trim() || undefined,
          category: templateCategory.trim() || 'Personal',
        }),
      });

      if (response.ok) {
        setShowSaveAsTemplateModal(false);
        setTemplateName('');
        setTemplateDescription('');
        setTemplateCategory('Personal');
        alert('Template saved successfully! You can now use it when creating new funnels.');
      } else {
        const errorData = await response.json();
        alert(`Failed to save template: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleTemplateSelect = (
    template: FunnelTemplate | UserTemplate,
    isUserTemplate: boolean
  ) => {
    // If it's a blank template or empty template object
    if (!template.id) {
      setShowTemplateSelector(false);
      return;
    }

    // Pre-populate form with template defaults
    const templateDefaults: Partial<CreateMemberFunnel> = {
      template_id: isUserTemplate ? null : template.id,
      title: template.default_title || 'Your Compelling Title',
      subtitle: template.default_subtitle || '',
      background_image_url: template.default_background_image_url || '',
      title_color: template.default_title_color || '#ffffff',
      title_size: template.default_title_size || 'text-4xl',
      subtitle_color: template.default_subtitle_color || '#d1d5db',
      subtitle_size: template.default_subtitle_size || 'text-xl',
      arrow_color: template.default_arrow_color || '#3b82f6',
      outro_text_color: template.default_outro_text_color || '#d1d5db',
      outro_text_size: template.default_outro_text_size || 'text-xl',
      show_outro_section: Boolean(template.default_show_outro_section),
      outro_text: template.default_outro_text || '',
      calendly_link: template.default_calendly_link || '',
      calendly_display_type:
        (template.default_calendly_display_type as 'button' | 'embed' | 'both') || 'both',
      autoplay_video: Boolean(template.default_autoplay_video),
      funnel_type:
        ((template as any).default_funnel_type as 'direct_webinar' | 'email_capture') ||
        'direct_webinar',
      landing_page_title: (template as any).default_landing_page_title || '',
      landing_page_subtitle: (template as any).default_landing_page_subtitle || '',
      landing_page_description: (template as any).default_landing_page_description || '',
      email_service_type: (template as any).default_email_service_type as
        | 'aweber'
        | 'mailchimp'
        | 'convertkit'
        | 'custom_webhook'
        | undefined,
      landing_page_button_text:
        (template as any).default_landing_page_button_text || 'Get Instant Access',
      landing_page_background_image_url:
        (template as any).default_landing_page_background_image_url || '',
    };

    setFormData((prev) => ({
      ...prev,
      ...templateDefaults,
    }));

    setShowTemplateSelector(false);
  };

  if (isPending || !user || loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin">
            <Loader2 className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Simple admin check
  const isAdmin =
    user.email?.includes('@admin') ||
    user.email === 'admin@example.com' ||
    user.email?.includes('@onlineempires.com');

  const tabs = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'content', label: 'Content', icon: Type },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'integration', label: 'Integration', icon: Calendar },
    { id: 'seo', label: 'SEO & Social', icon: Mail },
  ];

  return (
    <React.Fragment>
      <Head>
        <title>{isEditing ? 'Edit Funnel' : 'Create Funnel'} - Online Empires</title>
        <meta name="description" content="Create and edit your affiliate marketing funnels" />
      </Head>
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelect={handleTemplateSelect}
        />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/member/funnels"
                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Funnel' : 'Create New Funnel'}
                </h1>
                <p className="mt-1 text-gray-600">
                  {isEditing ? 'Update your funnel details' : 'Build your high-converting funnel'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {funnel?.is_published && funnel.slug ? (
                <Link
                  href={`/funnel/${funnel.slug}`}
                  target="_blank"
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Link>
              ) : null}
              {isEditing ? (
                <button
                  onClick={() => setShowSaveAsTemplateModal(true)}
                  disabled={saving}
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span>Save as Template</span>
                </button>
              ) : null}
              <button
                onClick={() => handleSave(false)}
                disabled={saving || !formData.title || !formData.funnel_name}
                className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Funnel'}</span>
              </button>
              {!isEditing ? (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || !formData.title || !formData.funnel_name}
                  className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {/* Left Column - Form */}
            <div className="space-y-6 xl:col-span-2">
              {/* Tab Navigation */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Setup Tab */}
              {activeTab === 'setup' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">
                      Funnel Type & Setup
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Funnel Name *
                        </label>
                        <input
                          type="text"
                          value={formData.funnel_name || ''}
                          onChange={(e) => handleInputChange('funnel_name', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter a name for your funnel (for organization purposes)"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          This is for your reference and organization. It won't be displayed to
                          visitors.
                        </p>
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Funnel Type *
                        </label>
                        <select
                          value={formData.funnel_type}
                          onChange={(e) => handleInputChange('funnel_type', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="direct_webinar">
                            Direct Webinar - Takes users directly to the webinar
                          </option>
                          <option value="email_capture">
                            Email Capture + Webinar - Collects email first, then shows webinar
                          </option>
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                          Choose between a direct webinar funnel or one that captures emails first.
                        </p>
                      </div>

                      {/* Email Capture Settings */}
                      {formData.funnel_type === 'email_capture' && (
                        <div className="border-t pt-6">
                          <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900">
                            <Mail className="mr-2 h-5 w-5" />
                            Email Capture Settings
                          </h3>

                          <div className="space-y-4">
                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Landing Page Title
                              </label>
                              <JoditEditor
                                value={
                                  formData.landing_page_title_html ||
                                  formData.landing_page_title ||
                                  ''
                                }
                                onChange={(value) => {
                                  const plainText = value.replace(/<[^>]*>/g, '').trim();
                                  handleInputChange('landing_page_title', plainText || '');
                                  handleInputChange('landing_page_title_html', value);
                                }}
                                placeholder="Free Training: How to..."
                              />
                            </div>

                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Landing Page Subtitle
                              </label>
                              <JoditEditor
                                value={
                                  formData.landing_page_subtitle_html ||
                                  formData.landing_page_subtitle ||
                                  ''
                                }
                                onChange={(value) => {
                                  const plainText = value.replace(/<[^>]*>/g, '').trim();
                                  handleInputChange('landing_page_subtitle', plainText || '');
                                  handleInputChange('landing_page_subtitle_html', value);
                                }}
                                placeholder="Enter your email to get instant access"
                              />
                            </div>

                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Landing Page Description
                              </label>
                              <JoditEditor
                                value={
                                  formData.landing_page_description_html ||
                                  formData.landing_page_description ||
                                  ''
                                }
                                onChange={(value) => {
                                  const plainText = value.replace(/<[^>]*>/g, '').trim();
                                  handleInputChange('landing_page_description', plainText || '');
                                  handleInputChange('landing_page_description_html', value);
                                }}
                                placeholder="Describe what visitors will learn in the webinar..."
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Form Heading
                              </label>
                              <input
                                type="text"
                                value={formData.landing_page_form_heading || ''}
                                onChange={(e) =>
                                  handleInputChange('landing_page_form_heading', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Your Email to Watch Now"
                              />
                              <p className="mt-2 text-sm text-gray-500">
                                The heading text that appears above the email form.
                              </p>
                            </div>

                            <div>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.landing_page_show_icon}
                                  onChange={(e) =>
                                    handleInputChange('landing_page_show_icon', e.target.checked)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                  Show mail icon next to form heading
                                </span>
                              </label>
                              <p className="ml-7 mt-2 text-sm text-gray-500">
                                Display an envelope icon next to the form heading text.
                              </p>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Privacy Text
                              </label>
                              <input
                                type="text"
                                value={formData.landing_page_privacy_text || ''}
                                onChange={(e) =>
                                  handleInputChange('landing_page_privacy_text', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="🔒 We respect your privacy. Your email will not be shared."
                              />
                              <p className="mt-2 text-sm text-gray-500">
                                The privacy text that appears below the email form.
                              </p>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Privacy Text Color
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={formData.landing_page_privacy_text_color || '#9ca3af'}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_privacy_text_color',
                                      e.target.value
                                    )
                                  }
                                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.landing_page_privacy_text_color || ''}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_privacy_text_color',
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="#9ca3af"
                                />
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Color of the privacy text below the email form.
                              </p>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Button Text
                              </label>
                              <input
                                type="text"
                                value={formData.landing_page_button_text || ''}
                                onChange={(e) =>
                                  handleInputChange('landing_page_button_text', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Get Instant Access"
                              />
                            </div>

                            <ImageUpload
                              label="Landing Page Background Image (Optional)"
                              value={formData.landing_page_background_image_url || ''}
                              onChange={(url) =>
                                handleInputChange('landing_page_background_image_url', url)
                              }
                              placeholder="Upload landing page background image or enter URL"
                            />

                            {formData.landing_page_background_image_url && (
                              <div>
                                <label className="mb-3 block text-sm font-medium text-gray-700">
                                  Landing Page Background Overlay Opacity:{' '}
                                  {formData.landing_page_background_overlay_opacity !== undefined
                                    ? formData.landing_page_background_overlay_opacity
                                    : 60}
                                  %
                                </label>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="1"
                                      value={
                                        formData.landing_page_background_overlay_opacity !==
                                        undefined
                                          ? formData.landing_page_background_overlay_opacity
                                          : 60
                                      }
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        handleInputChange(
                                          'landing_page_background_overlay_opacity',
                                          value
                                        );
                                      }}
                                      className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                                    />
                                  </div>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={
                                      formData.landing_page_background_overlay_opacity !== undefined
                                        ? formData.landing_page_background_overlay_opacity
                                        : 60
                                    }
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10);
                                      if (!isNaN(value) && value >= 0 && value <= 100) {
                                        handleInputChange(
                                          'landing_page_background_overlay_opacity',
                                          value
                                        );
                                      }
                                    }}
                                    className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-500">%</span>
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-gray-500">
                                  <span>0% (No overlay)</span>
                                  <span>100% (Fully dark)</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                  Controls the darkness of the overlay on top of your background
                                  image. Lower values show more of the image, higher values make
                                  text more readable.
                                </p>
                              </div>
                            )}

                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Landing Page Background Color
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={formData.landing_page_background_color || '#000000'}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_background_color',
                                      e.target.value
                                    )
                                  }
                                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.landing_page_background_color || ''}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_background_color',
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="#000000"
                                />
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Background color for the landing page. Leave empty to use default
                                black. This color shows when no background image is set.
                              </p>
                            </div>

                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Fields to Collect
                              </label>
                              <div className="space-y-3">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.collect_name}
                                    onChange={(e) =>
                                      handleInputChange('collect_name', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-3 text-sm font-medium text-gray-700">
                                    Name
                                  </span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.collect_email}
                                    onChange={(e) =>
                                      handleInputChange('collect_email', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-3 text-sm font-medium text-gray-700">
                                    Email (Required)
                                  </span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.collect_phone}
                                    onChange={(e) =>
                                      handleInputChange('collect_phone', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-3 text-sm font-medium text-gray-700">
                                    Phone Number
                                  </span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.collect_instagram}
                                    onChange={(e) =>
                                      handleInputChange('collect_instagram', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-3 text-sm font-medium text-gray-700">
                                    Instagram Handle
                                  </span>
                                </label>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Choose which fields to collect from visitors. Email is always
                                required and will be sent to your email service provider.
                              </p>
                            </div>

                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Email Service Integration
                              </label>
                              <select
                                value={formData.email_service_type || ''}
                                onChange={(e) =>
                                  handleInputChange(
                                    'email_service_type',
                                    e.target.value || undefined
                                  )
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Email Service (Optional)</option>
                                <option value="aweber">AWeber</option>
                                <option value="mailchimp">Mailchimp</option>
                                <option value="convertkit">ConvertKit</option>
                                <option value="activecampaign">ActiveCampaign</option>
                                <option value="custom_webhook">Custom Webhook</option>
                              </select>
                            </div>

                            {/* Service-specific fields */}
                            {formData.email_service_type === 'aweber' && (
                              <div className="space-y-4">
                                {!aweberConnected ? (
                                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="mb-1 text-sm font-medium text-blue-900">
                                          Connect AWeber Account
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                          Connect your AWeber account using OAuth to securely access
                                          your lists and add subscribers.
                                        </p>
                                      </div>
                                      <button
                                        onClick={initiateAweberAuth}
                                        disabled={aweberLoading}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                      >
                                        {aweberLoading ? (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Connect AWeber
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                          <span className="text-sm font-medium text-green-900">
                                            AWeber Connected
                                          </span>
                                        </div>
                                        <button
                                          onClick={disconnectAweber}
                                          className="text-sm text-red-600 hover:text-red-800"
                                        >
                                          Disconnect
                                        </button>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Select AWeber List
                                      </label>
                                      {aweberLoading ? (
                                        <div className="flex items-center justify-center py-4">
                                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                          <span className="ml-2 text-sm text-gray-600">
                                            Loading lists...
                                          </span>
                                        </div>
                                      ) : (
                                        <select
                                          value={formData.aweber_list_id || ''}
                                          onChange={(e) =>
                                            handleInputChange('aweber_list_id', e.target.value)
                                          }
                                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="">Select a list</option>
                                          {aweberLists.map((list) => (
                                            <option key={list.id} value={list.id}>
                                              {list.name} ({list.total_subscribed} subscribers)
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                      {aweberLists.length === 0 && !aweberLoading && (
                                        <p className="mt-2 text-sm text-gray-500">
                                          No lists found. Make sure you have lists set up in your
                                          AWeber account.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {formData.email_service_type === 'mailchimp' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Mailchimp API Key
                                  </label>
                                  <input
                                    type="password"
                                    value={formData.mailchimp_api_key || ''}
                                    onChange={(e) =>
                                      handleInputChange('mailchimp_api_key', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your Mailchimp API key"
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    Your Mailchimp API key (found in Account → Extras → API keys)
                                  </p>
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Mailchimp List ID
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.mailchimp_list_id || ''}
                                    onChange={(e) =>
                                      handleInputChange('mailchimp_list_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your Mailchimp list ID"
                                  />
                                  <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-600">
                                    <p className="mb-1 font-medium text-blue-900">
                                      📍 How to find your Mailchimp credentials:
                                    </p>
                                    <div className="space-y-2">
                                      <div>
                                        <p className="font-medium text-blue-800">API Key:</p>
                                        <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                                          <li>
                                            Go to your Mailchimp dashboard → Account → Extras → API
                                            keys
                                          </li>
                                          <li>Generate a new API key if you don't have one</li>
                                          <li>
                                            Copy the entire API key (includes data center like
                                            "us1", "us2", etc.)
                                          </li>
                                        </ol>
                                      </div>
                                      <div>
                                        <p className="font-medium text-blue-800">List ID:</p>
                                        <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                                          <li>
                                            Go to Audience → All contacts → Select your audience
                                          </li>
                                          <li>Go to Settings → Audience name and defaults</li>
                                          <li>The List ID is shown at the bottom of the page</li>
                                          <li>
                                            Also visible in the URL when viewing your audience
                                          </li>
                                        </ol>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {formData.email_service_type === 'convertkit' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    ConvertKit API Key
                                  </label>
                                  <input
                                    type="password"
                                    value={formData.convertkit_api_key || ''}
                                    onChange={(e) =>
                                      handleInputChange('convertkit_api_key', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your ConvertKit API key"
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    Your ConvertKit API key (found in Settings → Advanced → API)
                                  </p>
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    ConvertKit Form ID
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.convertkit_form_id || ''}
                                    onChange={(e) =>
                                      handleInputChange('convertkit_form_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your ConvertKit form ID"
                                  />
                                  <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-600">
                                    <p className="mb-1 font-medium text-blue-900">
                                      📍 How to find your ConvertKit credentials:
                                    </p>
                                    <div className="space-y-2">
                                      <div>
                                        <p className="font-medium text-blue-800">API Key:</p>
                                        <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                                          <li>
                                            Go to your ConvertKit dashboard → Settings → Advanced
                                          </li>
                                          <li>Click on the "API" tab</li>
                                          <li>Copy your API key from the "API Key" section</li>
                                        </ol>
                                      </div>
                                      <div>
                                        <p className="font-medium text-blue-800">Form ID:</p>
                                        <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                                          <li>Go to Forms → Select the form you want to use</li>
                                          <li>
                                            <strong>Look in the URL bar</strong> - the Form ID is
                                            the number (e.g., /forms/1234567 means Form ID is
                                            "1234567")
                                          </li>
                                          <li>
                                            Or check the form embed code - it contains the form ID
                                          </li>
                                          <li>
                                            Enter just the number (e.g., "1234567", not the full
                                            URL)
                                          </li>
                                        </ol>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {formData.email_service_type === 'activecampaign' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    ActiveCampaign API URL
                                  </label>
                                  <input
                                    type="url"
                                    value={formData.activecampaign_api_url || ''}
                                    onChange={(e) =>
                                      handleInputChange('activecampaign_api_url', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://yoursubdomain.api-us1.com"
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    Your ActiveCampaign API URL (found in Settings → Developer)
                                  </p>
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    ActiveCampaign API Key
                                  </label>
                                  <input
                                    type="password"
                                    value={formData.activecampaign_api_key || ''}
                                    onChange={(e) =>
                                      handleInputChange('activecampaign_api_key', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your ActiveCampaign API key"
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    Your ActiveCampaign API key (found in Settings → Developer)
                                  </p>
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    ActiveCampaign List ID
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.activecampaign_list_id || ''}
                                    onChange={(e) =>
                                      handleInputChange('activecampaign_list_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="List ID (e.g., 1, 2, 3)"
                                  />
                                  <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-600">
                                    <p className="mb-1 font-medium text-blue-900">
                                      📍 How to find your ActiveCampaign List ID:
                                    </p>
                                    <ol className="list-inside list-decimal space-y-1 text-blue-800">
                                      <li>Go to your ActiveCampaign dashboard → Lists</li>
                                      <li>Click on the list you want to use</li>
                                      <li>
                                        <strong>Look in the URL bar</strong> - the List ID is the
                                        number at the end (e.g., /lists/view/5 means List ID is "5")
                                      </li>
                                      <li>Enter just the number (e.g., "5", not the full URL)</li>
                                    </ol>
                                    <p className="mt-2 text-xs text-blue-700">
                                      💡 The List ID is easiest to find in the URL when viewing your
                                      list, not in the list settings.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {formData.email_service_type === 'custom_webhook' && (
                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Custom Webhook URL
                                </label>
                                <input
                                  type="url"
                                  value={formData.custom_email_webhook || ''}
                                  onChange={(e) =>
                                    handleInputChange('custom_email_webhook', e.target.value)
                                  }
                                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="https://your-webhook-url.com/submit"
                                />
                                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-600">
                                  <p className="mb-1 font-medium text-blue-900">
                                    📍 Custom Webhook Setup:
                                  </p>
                                  <p className="mb-2 text-blue-800">
                                    We'll POST the following data to your webhook:
                                  </p>
                                  <ul className="list-inside list-disc space-y-1 text-xs text-blue-800">
                                    <li>email (required)</li>
                                    <li>name (if collected)</li>
                                    <li>phone (if collected)</li>
                                    <li>instagram (if collected)</li>
                                    <li>funnel_id, funnel_name, timestamp</li>
                                  </ul>
                                </div>
                              </div>
                            )}

                            <div className="space-y-4 border-t pt-6">
                              <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900">
                                <Settings className="mr-2 h-5 w-5" />
                                Branding & Icons
                              </h3>

                              <ImageUpload
                                label="Logo (Optional)"
                                value={formData.landing_page_logo_url || ''}
                                onChange={(url) => {
                                  handleInputChange('landing_page_logo_url', url);
                                  // Automatically hide icon when logo is uploaded
                                  if (url && url.trim()) {
                                    handleInputChange('landing_page_show_icon', false);
                                  }
                                }}
                                placeholder="Upload your logo or enter image URL"
                              />
                              <p className="-mt-4 text-sm text-gray-500">
                                Upload your logo to replace the default icon at the top of your
                                landing page. When you upload a logo, the default icon will be
                                automatically hidden. Recommended size: 200x200 pixels or larger.
                              </p>

                              {formData.landing_page_logo_url && (
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Logo Size
                                  </label>
                                  <select
                                    value={formData.landing_page_logo_size || 'medium'}
                                    onChange={(e) =>
                                      handleInputChange('landing_page_logo_size', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="small">Small (48px height)</option>
                                    <option value="medium">Medium (64px height)</option>
                                    <option value="large">Large (80px height)</option>
                                  </select>
                                  <p className="mt-2 text-sm text-gray-500">
                                    Controls the display size of your logo on the landing page.
                                  </p>
                                </div>
                              )}

                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Form Icon (Email Form Icon)
                                </label>
                                <select
                                  value={formData.landing_page_form_icon || 'Mail'}
                                  onChange={(e) =>
                                    handleInputChange('landing_page_form_icon', e.target.value)
                                  }
                                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="Mail">📧 Mail (Email)</option>
                                  <option value="Lock">🔒 Lock (Security/Privacy)</option>
                                  <option value="Star">⭐ Star (Premium/Quality)</option>
                                  <option value="Gift">🎁 Gift (Free/Bonus)</option>
                                  <option value="Play">▶️ Play (Video/Training)</option>
                                  <option value="CheckCircle">
                                    ✅ CheckCircle (Success/Complete)
                                  </option>
                                  <option value="Award">🏆 Award (Achievement/Winner)</option>
                                  <option value="Zap">⚡ Zap (Fast/Power)</option>
                                  <option value="Target">🎯 Target (Focus/Goals)</option>
                                  <option value="Users">👥 Users (Community/People)</option>
                                  <option value="Crown">👑 Crown (Premium/Royal)</option>
                                  <option value="Diamond">💎 Diamond (Valuable/Premium)</option>
                                  <option value="Rocket">🚀 Rocket (Growth/Launch)</option>
                                </select>
                                <p className="mt-2 text-sm text-gray-500">
                                  The small icon displayed next to your email form heading.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Content & Copy</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Main Title *
                        </label>
                        <JoditEditor
                          value={formData.title_html || formData.title}
                          onChange={(value) => {
                            // Strip HTML for plain text fallback
                            const plainText = value.replace(/<[^>]*>/g, '').trim();
                            handleInputChange('title', plainText || 'Untitled');
                            handleInputChange('title_html', value);
                          }}
                          placeholder="Enter your compelling funnel title..."
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Make it bold, colorful, and compelling. Use formatting to emphasize key
                          words.
                        </p>
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Subtitle
                        </label>
                        <JoditEditor
                          value={formData.subtitle_html || formData.subtitle || ''}
                          onChange={(value) => {
                            const plainText = value.replace(/<[^>]*>/g, '').trim();
                            handleInputChange('subtitle', plainText || '');
                            handleInputChange('subtitle_html', value);
                          }}
                          placeholder="Add a compelling subtitle that supports your main message..."
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Explain the value proposition or what viewers will learn.
                        </p>
                      </div>

                      {/* Outro Text */}
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Outro Section Content
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.show_outro_section}
                              onChange={(e) =>
                                handleInputChange('show_outro_section', e.target.checked)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Show outro section</span>
                          </label>
                        </div>

                        {formData.show_outro_section && (
                          <>
                            <JoditEditor
                              value={formData.outro_text_html || formData.outro_text || ''}
                              onChange={(value) => {
                                const plainText = value.replace(/<[^>]*>/g, '').trim();
                                handleInputChange('outro_text', plainText || '');
                                handleInputChange('outro_text_html', value);
                              }}
                              placeholder="Add compelling outro content to transition to your call-to-action..."
                            />
                            <p className="mt-2 text-sm text-gray-500">
                              This appears after the main video to set up your Calendly
                              call-to-action.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Tab */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Video Settings</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Main Video Source
                        </label>
                        <select
                          value={formData.selected_video_type}
                          onChange={(e) => handleInputChange('selected_video_type', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="video_1">45 Minute Webinar</option>
                          <option value="video_2">60 Min - Webinar</option>
                          <option value="custom">Custom Video URL</option>
                        </select>
                      </div>

                      {formData.selected_video_type === 'custom' && (
                        <div>
                          <label className="mb-3 block text-sm font-medium text-gray-700">
                            Custom Video URL or Embed Code
                          </label>
                          <textarea
                            value={formData.custom_video_url || ''}
                            onChange={(e) => handleInputChange('custom_video_url', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://youtube.com/watch?v=... or <iframe src='...'></iframe>"
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Paste a YouTube/Vimeo URL, direct video file URL, or custom embed code
                          </p>
                        </div>
                      )}

                      {/* Autoplay Option */}
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.autoplay_video}
                            onChange={(e) => handleInputChange('autoplay_video', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            Auto-play main video when page loads (muted)
                          </span>
                        </label>
                        <p className="ml-7 mt-2 text-sm text-gray-500">
                          Videos will auto-play muted to comply with browser policies. Viewers can
                          unmute and interact normally.
                        </p>
                      </div>

                      {formData.show_outro_section && (
                        <>
                          <div>
                            <label className="mb-3 block text-sm font-medium text-gray-700">
                              Outro Video Source
                            </label>
                            <select
                              value={formData.outro_video_type}
                              onChange={(e) =>
                                handleInputChange('outro_video_type', e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="option_1">Default Outro Video</option>
                              <option value="custom">Custom Outro Video URL</option>
                            </select>
                          </div>

                          {formData.outro_video_type === 'custom' && (
                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Custom Outro Video URL or Embed Code
                              </label>
                              <textarea
                                value={formData.outro_custom_url || ''}
                                onChange={(e) =>
                                  handleInputChange('outro_custom_url', e.target.value)
                                }
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://youtube.com/watch?v=... or <iframe src='...'></iframe>"
                              />
                              <p className="mt-2 text-sm text-gray-500">
                                Paste a YouTube/Vimeo URL, direct video file URL, or custom embed
                                code
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Design & Styling</h2>

                    <div className="space-y-6">
                      <ImageUpload
                        label="Webinar Page Background Image (Optional)"
                        value={formData.background_image_url || ''}
                        onChange={(url) => handleInputChange('background_image_url', url)}
                        placeholder="Upload background image or enter URL"
                        className="col-span-full"
                      />

                      {formData.background_image_url && (
                        <div>
                          <label className="mb-3 block text-sm font-medium text-gray-700">
                            Webinar Page Background Overlay Opacity:{' '}
                            {formData.background_image_overlay_opacity !== undefined
                              ? formData.background_image_overlay_opacity
                              : 60}
                            %
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={
                                  formData.background_image_overlay_opacity !== undefined
                                    ? formData.background_image_overlay_opacity
                                    : 60
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  handleInputChange('background_image_overlay_opacity', value);
                                }}
                                className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                              />
                            </div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={
                                formData.background_image_overlay_opacity !== undefined
                                  ? formData.background_image_overlay_opacity
                                  : 60
                              }
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (!isNaN(value) && value >= 0 && value <= 100) {
                                  handleInputChange('background_image_overlay_opacity', value);
                                }
                              }}
                              className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>0% (No overlay)</span>
                            <span>100% (Fully dark)</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Controls the darkness of the overlay on top of your background image.
                            Lower values show more of the image, higher values make text more
                            readable.
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Background Colors</h3>

                        <div>
                          <label className="mb-3 block text-sm font-medium text-gray-700">
                            Webinar Page Background Color
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={formData.webinar_background_color || '#000000'}
                              onChange={(e) =>
                                handleInputChange('webinar_background_color', e.target.value)
                              }
                              className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                            />
                            <input
                              type="text"
                              value={formData.webinar_background_color || ''}
                              onChange={(e) =>
                                handleInputChange('webinar_background_color', e.target.value)
                              }
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="#000000"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Background color for the webinar page. Leave empty to use default black.
                            This color shows when no background image is set.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Title Styling */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Title Styling</h3>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Default Title Color
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={formData.title_color}
                                onChange={(e) => handleInputChange('title_color', e.target.value)}
                                className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                              />
                              <input
                                type="text"
                                value={formData.title_color}
                                onChange={(e) => handleInputChange('title_color', e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="#ffffff"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Default Title Size
                            </label>
                            <select
                              value={formData.title_size}
                              onChange={(e) => handleInputChange('title_size', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="text-2xl">Small (2xl)</option>
                              <option value="text-3xl">Medium (3xl)</option>
                              <option value="text-4xl">Large (4xl)</option>
                              <option value="text-5xl">Extra Large (5xl)</option>
                              <option value="text-6xl">Huge (6xl)</option>
                            </select>
                          </div>
                        </div>

                        {/* Subtitle Styling */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Subtitle Styling</h3>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Default Subtitle Color
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={formData.subtitle_color}
                                onChange={(e) =>
                                  handleInputChange('subtitle_color', e.target.value)
                                }
                                className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                              />
                              <input
                                type="text"
                                value={formData.subtitle_color}
                                onChange={(e) =>
                                  handleInputChange('subtitle_color', e.target.value)
                                }
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="#d1d5db"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Default Subtitle Size
                            </label>
                            <select
                              value={formData.subtitle_size}
                              onChange={(e) => handleInputChange('subtitle_size', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="text-sm">Small (sm)</option>
                              <option value="text-base">Base</option>
                              <option value="text-lg">Large (lg)</option>
                              <option value="text-xl">Extra Large (xl)</option>
                              <option value="text-2xl">2X Large (2xl)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Color */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Arrow Styling</h3>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Arrow Color
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={formData.arrow_color || '#3b82f6'}
                              onChange={(e) => handleInputChange('arrow_color', e.target.value)}
                              className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                            />
                            <input
                              type="text"
                              value={formData.arrow_color || '#3b82f6'}
                              onChange={(e) => handleInputChange('arrow_color', e.target.value)}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="#3b82f6"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Color of the animated arrows that appear between sections
                          </p>
                        </div>
                      </div>

                      {/* Outro Text Styling */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Outro Text Styling</h3>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Default Outro Text Color
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={formData.outro_text_color || '#d1d5db'}
                              onChange={(e) =>
                                handleInputChange('outro_text_color', e.target.value)
                              }
                              className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                            />
                            <input
                              type="text"
                              value={formData.outro_text_color || '#d1d5db'}
                              onChange={(e) =>
                                handleInputChange('outro_text_color', e.target.value)
                              }
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="#d1d5db"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Default Outro Text Size
                          </label>
                          <select
                            value={formData.outro_text_size || 'text-xl'}
                            onChange={(e) => handleInputChange('outro_text_size', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text-sm">Small (sm)</option>
                            <option value="text-base">Base</option>
                            <option value="text-lg">Large (lg)</option>
                            <option value="text-xl">Extra Large (xl)</option>
                            <option value="text-2xl">2X Large (2xl)</option>
                            <option value="text-3xl">3X Large (3xl)</option>
                          </select>
                        </div>
                      </div>

                      {/* Outro Section Background */}
                      {formData.show_outro_section && (
                        <div className="space-y-4 border-t pt-6">
                          <h3 className="text-lg font-medium text-gray-900">
                            Outro Section Background
                          </h3>

                          <ImageUpload
                            label="Outro Background Image (Optional)"
                            value={formData.outro_background_image_url || ''}
                            onChange={(url) => handleInputChange('outro_background_image_url', url)}
                            placeholder="Upload outro background image or enter URL"
                            className="col-span-full"
                          />

                          {formData.outro_background_image_url && (
                            <div>
                              <label className="mb-3 block text-sm font-medium text-gray-700">
                                Outro Background Overlay Opacity:{' '}
                                {formData.outro_background_overlay_opacity !== undefined
                                  ? formData.outro_background_overlay_opacity
                                  : 60}
                                %
                              </label>
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={
                                      formData.outro_background_overlay_opacity !== undefined
                                        ? formData.outro_background_overlay_opacity
                                        : 60
                                    }
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10);
                                      handleInputChange('outro_background_overlay_opacity', value);
                                    }}
                                    className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                                  />
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={
                                    formData.outro_background_overlay_opacity !== undefined
                                      ? formData.outro_background_overlay_opacity
                                      : 60
                                  }
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (!isNaN(value) && value >= 0 && value <= 100) {
                                      handleInputChange('outro_background_overlay_opacity', value);
                                    }
                                  }}
                                  className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-500">%</span>
                              </div>
                              <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>0% (No overlay)</span>
                                <span>100% (Fully dark)</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Controls the darkness of the overlay on top of your outro background
                                image.
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="mb-3 block text-sm font-medium text-gray-700">
                              Outro Background Color
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={formData.outro_background_color || '#1f2937'}
                                onChange={(e) =>
                                  handleInputChange('outro_background_color', e.target.value)
                                }
                                className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                              />
                              <input
                                type="text"
                                value={formData.outro_background_color || ''}
                                onChange={(e) =>
                                  handleInputChange('outro_background_color', e.target.value)
                                }
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="#1f2937"
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              Background color for the outro section. Leave empty to use default
                              gradient.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Button Styling */}
                      <div className="space-y-6 border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900">Button Styling</h3>

                        {/* Email Capture Button Styling */}
                        {formData.funnel_type === 'email_capture' && (
                          <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-800">
                              Email Capture Button
                            </h4>

                            <div>
                              <label className="mb-3 flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.landing_page_button_use_gradient}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_button_use_gradient',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                  Use gradient background
                                </span>
                              </label>
                            </div>

                            {formData.landing_page_button_use_gradient ? (
                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Button Gradient
                                </label>
                                <select
                                  value={formData.landing_page_button_bg_gradient}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_button_bg_gradient',
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="from-blue-600 to-purple-600">
                                    Blue to Purple
                                  </option>
                                  <option value="from-green-600 to-blue-600">Green to Blue</option>
                                  <option value="from-purple-600 to-pink-600">
                                    Purple to Pink
                                  </option>
                                  <option value="from-yellow-600 to-orange-600">
                                    Yellow to Orange
                                  </option>
                                  <option value="from-red-600 to-pink-600">Red to Pink</option>
                                  <option value="from-indigo-600 to-purple-600">
                                    Indigo to Purple
                                  </option>
                                  <option value="from-teal-600 to-green-600">Teal to Green</option>
                                  <option value="from-gray-600 to-gray-800">
                                    Gray to Dark Gray
                                  </option>
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Button Background Color
                                </label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="color"
                                    value={formData.landing_page_button_bg_color}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'landing_page_button_bg_color',
                                        e.target.value
                                      )
                                    }
                                    className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                                  />
                                  <input
                                    type="text"
                                    value={formData.landing_page_button_bg_color}
                                    onChange={(e) =>
                                      handleInputChange(
                                        'landing_page_button_bg_color',
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#3b82f6"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Button Text Color
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={formData.landing_page_button_text_color}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_button_text_color',
                                      e.target.value
                                    )
                                  }
                                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.landing_page_button_text_color}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'landing_page_button_text_color',
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>

                            {/* Preview */}
                            <div className="rounded-lg bg-gray-100 p-4">
                              <p className="mb-2 text-sm font-medium text-gray-700">
                                Button Preview:
                              </p>
                              <button
                                className={`rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                                  formData.landing_page_button_use_gradient
                                    ? `bg-gradient-to-r ${formData.landing_page_button_bg_gradient}`
                                    : ''
                                }`}
                                style={
                                  !formData.landing_page_button_use_gradient
                                    ? {
                                        backgroundColor: formData.landing_page_button_bg_color,
                                        color: formData.landing_page_button_text_color,
                                      }
                                    : {
                                        color: formData.landing_page_button_text_color,
                                      }
                                }
                              >
                                {formData.landing_page_button_text || 'Get Instant Access'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Calendly Button Styling */}
                        {formData.calendly_link && (
                          <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-800">Calendly Button</h4>

                            <div>
                              <label className="mb-3 flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.calendly_button_use_gradient}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'calendly_button_use_gradient',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                  Use gradient background
                                </span>
                              </label>
                            </div>

                            {formData.calendly_button_use_gradient ? (
                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Button Gradient
                                </label>
                                <select
                                  value={formData.calendly_button_bg_gradient}
                                  onChange={(e) =>
                                    handleInputChange('calendly_button_bg_gradient', e.target.value)
                                  }
                                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="from-blue-600 to-purple-600">
                                    Blue to Purple
                                  </option>
                                  <option value="from-green-600 to-blue-600">Green to Blue</option>
                                  <option value="from-purple-600 to-pink-600">
                                    Purple to Pink
                                  </option>
                                  <option value="from-yellow-600 to-orange-600">
                                    Yellow to Orange
                                  </option>
                                  <option value="from-red-600 to-pink-600">Red to Pink</option>
                                  <option value="from-indigo-600 to-purple-600">
                                    Indigo to Purple
                                  </option>
                                  <option value="from-teal-600 to-green-600">Teal to Green</option>
                                  <option value="from-gray-600 to-gray-800">
                                    Gray to Dark Gray
                                  </option>
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Button Background Color
                                </label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="color"
                                    value={formData.calendly_button_bg_color}
                                    onChange={(e) =>
                                      handleInputChange('calendly_button_bg_color', e.target.value)
                                    }
                                    className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                                  />
                                  <input
                                    type="text"
                                    value={formData.calendly_button_bg_color}
                                    onChange={(e) =>
                                      handleInputChange('calendly_button_bg_color', e.target.value)
                                    }
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#3b82f6"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Button Text Color
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={formData.calendly_button_text_color}
                                  onChange={(e) =>
                                    handleInputChange('calendly_button_text_color', e.target.value)
                                  }
                                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.calendly_button_text_color}
                                  onChange={(e) =>
                                    handleInputChange('calendly_button_text_color', e.target.value)
                                  }
                                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>

                            {/* Preview */}
                            <div className="rounded-lg bg-gray-100 p-4">
                              <p className="mb-2 text-sm font-medium text-gray-700">
                                Button Preview:
                              </p>
                              <button
                                className={`flex items-center space-x-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                                  formData.calendly_button_use_gradient
                                    ? `bg-gradient-to-r ${formData.calendly_button_bg_gradient}`
                                    : ''
                                }`}
                                style={
                                  !formData.calendly_button_use_gradient
                                    ? {
                                        backgroundColor: formData.calendly_button_bg_color,
                                        color: formData.calendly_button_text_color,
                                      }
                                    : {
                                        color: formData.calendly_button_text_color,
                                      }
                                }
                              >
                                <Calendar className="h-5 w-5" />
                                <span>Schedule Your Call Now</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex">
                          <Settings className="mr-3 mt-0.5 h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="mb-1 text-sm font-medium text-blue-900">
                              Style Override
                            </h4>
                            <p className="text-sm text-blue-700">
                              These are default colors and sizes. You can override them with custom
                              formatting in the text editor for individual words or sections.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO & Social Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">
                      SEO & Social Sharing
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={formData.meta_title || ''}
                          onChange={(e) => handleInputChange('meta_title', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Custom page title for search engines and browser tabs"
                          maxLength={60}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Appears in browser tabs and search results. Recommended: 50-60 characters.
                          Leave empty to use funnel title.
                        </p>
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Meta Description
                        </label>
                        <textarea
                          value={formData.meta_description || ''}
                          onChange={(e) => handleInputChange('meta_description', e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description of your funnel for search engines and social media"
                          maxLength={160}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Appears in search results and when shared on social media. Recommended:
                          150-160 characters.
                        </p>
                      </div>

                      <ImageUpload
                        label="Social Media Preview Image (Open Graph)"
                        value={formData.og_image_url || ''}
                        onChange={(url) => handleInputChange('og_image_url', url)}
                        placeholder="Upload image for social media previews or enter URL"
                        className="col-span-full"
                      />
                      <p className="-mt-4 text-sm text-gray-500">
                        This image appears when your funnel is shared on Facebook, Twitter,
                        LinkedIn, etc. Recommended size: 1200x630 pixels.
                      </p>

                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex">
                          <Mail className="mr-3 mt-0.5 h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="mb-1 text-sm font-medium text-blue-900">
                              SEO & Social Media Tips
                            </h4>
                            <p className="text-sm text-blue-700">
                              Well-optimized meta tags can significantly improve your funnel's
                              visibility in search results and click-through rates when shared on
                              social media platforms.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integration Tab */}
              {activeTab === 'integration' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">
                      Calendly Integration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Calendly Booking Link
                        </label>
                        <input
                          type="url"
                          value={formData.calendly_link || ''}
                          onChange={(e) => handleInputChange('calendly_link', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://calendly.com/your-link"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Add your Calendly booking link for the final call-to-action
                        </p>
                      </div>

                      {formData.calendly_link && (
                        <div>
                          <label className="mb-3 block text-sm font-medium text-gray-700">
                            Calendly Display Type
                          </label>
                          <select
                            value={formData.calendly_display_type}
                            onChange={(e) =>
                              handleInputChange('calendly_display_type', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="button">Button Only</option>
                            <option value="embed">Embedded Widget Only</option>
                            <option value="both">Both Button and Embedded Widget</option>
                          </select>
                          <p className="mt-2 text-sm text-gray-500">
                            Choose how to display your Calendly booking: button, embedded widget, or
                            both
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6 xl:col-span-1">
              {/* Show Landing Page Preview ABOVE webinar content if email capture funnel */}
              {formData.funnel_type === 'email_capture' && (
                <LandingPagePreview formData={formData} />
              )}

              {/* Main Funnel Preview (Webinar Content) */}
              <FunnelPreview formData={formData} />
            </div>
          </div>

          {/* Save as Template Modal */}
          {showSaveAsTemplateModal && (
            <>
              {/* Full-screen backdrop */}
              <div className="fixed inset-0 z-[90] bg-black bg-opacity-50" />

              {/* Modal content positioned within available space */}
              <div
                className="fixed z-[100] flex items-center justify-center overflow-y-auto p-4"
                style={{
                  left: `${availableSpace.left}px`,
                  top: `${availableSpace.top}px`,
                  right: `${availableSpace.right}px`,
                  bottom: `${availableSpace.bottom}px`,
                }}
              >
                <div className="theme-border flex max-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col rounded-2xl border bg-white p-6 shadow-2xl">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">Save as Template</h3>
                  <p className="mb-6 text-gray-600">
                    Create a personal template from this funnel that you can reuse for future
                    projects.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="My Awesome Template"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <textarea
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe when to use this template..."
                        maxLength={500}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Personal"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowSaveAsTemplateModal(false);
                        setTemplateName('');
                        setTemplateDescription('');
                        setTemplateCategory('Personal');
                      }}
                      disabled={savingTemplate}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAsTemplate}
                      disabled={savingTemplate || !templateName.trim()}
                      className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingTemplate ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                      <span>{savingTemplate ? 'Saving...' : 'Save Template'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AppLayout>
    </React.Fragment>
  );
}
