import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../../components/layout/AppLayout';
import { useTheme } from '../../../contexts/ThemeContext';
import { useUserRole } from '../../../contexts/UserRoleContext';
import { 
  Lead, 
  ContactAttempt, 
  Note, 
  ContactMethod,
  CommunicationStatus,
  EmailTemplate 
} from '../../../types/crm';

// Individual Lead Profile Page - Deep dive into single lead with full history
const LeadProfile: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'communication' | 'notes' | 'analytics'>('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  const { currentTheme } = useTheme();
  const { currentRole } = useUserRole();
  const router = useRouter();
  const { id } = router.query;

  // Mock lead data - in real app, this would come from API
  const mockLead: Lead = {
    id: '1',
    email: 'sarah.martinez@techcorp.com',
    name: 'Sarah Martinez',
    first_name: 'Sarah',
    last_name: 'Martinez',
    phone: '+1-555-234-5678',
    company: 'TechCorp Solutions',
    job_title: 'Marketing Director',
    location: {
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      timezone: 'PST'
    },
    source: 'funnel_optin',
    funnel_id: '1',
    funnel_name: 'Digital Marketing Mastery',
    status: 'qualified',
    tags: ['decision-maker', 'enterprise', 'hot-lead', 'budget-approved'],
    created_at: new Date('2024-08-20T10:30:00Z'),
    updated_at: new Date('2024-08-24T15:45:00Z'),
    last_contacted: new Date('2024-08-23T09:15:00Z'),
    next_follow_up: new Date('2024-08-26T14:00:00Z'),
    converted_at: undefined,
    communication_channels: {
      email: {
        address: 'sarah.martinez@techcorp.com',
        verified: true,
        bounced: false,
        last_opened: new Date('2024-08-24T08:30:00Z'),
        open_count: 12,
        click_count: 5
      },
      phone: {
        number: '+1-555-234-5678',
        whatsapp_available: true,
        imessage_available: false,
        sms_available: true,
        response_rate: 0.75,
        last_contacted: new Date('2024-08-22T14:30:00Z')
      },
      social: {
        linkedin: 'sarah-martinez-marketing',
        twitter: '@sarahm_marketing'
      }
    },
    notes: [
      {
        id: '1',
        content: 'Very interested in affiliate marketing course. Has budget approved for Q4. Mentioned wanting to scale their current campaigns.',
        created_at: new Date('2024-08-23T09:20:00Z'),
        created_by: 'You',
        is_pinned: true,
        tags: ['budget-approved', 'scaling'],
        type: 'note'
      },
      {
        id: '2',
        content: 'Scheduled follow-up call for Friday at 2 PM PST. She wants to discuss implementation timeline.',
        created_at: new Date('2024-08-24T16:45:00Z'),
        created_by: 'You',
        is_pinned: false,
        tags: ['follow-up', 'call-scheduled'],
        type: 'reminder'
      },
      {
        id: '3',
        content: 'Clicked on pricing page 3 times. Very engaged with content. High conversion probability.',
        created_at: new Date('2024-08-24T11:20:00Z'),
        created_by: 'System',
        is_pinned: false,
        tags: ['website-activity', 'pricing-interest'],
        type: 'note'
      }
    ],
    contact_attempts: [
      {
        id: '1',
        method: 'email',
        status: 'replied',
        subject: 'Transform Your Marketing Strategy - Digital Era Course',
        message: 'Hi Sarah, I noticed you downloaded our digital marketing guide. Based on your company profile, I think our advanced affiliate marketing course could help you scale your current campaigns...',
        attempted_at: new Date('2024-08-23T09:15:00Z'),
        responded_at: new Date('2024-08-23T14:30:00Z'),
        response_content: 'Very interested! Can we schedule a call this week? I have budget approved and want to move fast.',
        automated: false,
        template_used: 'follow_up_template_1'
      },
      {
        id: '2',
        method: 'linkedin',
        status: 'opened',
        subject: 'Connection Request',
        message: 'Hi Sarah, I saw your recent post about scaling marketing campaigns. I\'d love to connect and share some insights.',
        attempted_at: new Date('2024-08-22T11:30:00Z'),
        automated: false
      },
      {
        id: '3',
        method: 'email',
        status: 'opened',
        subject: 'Welcome to Digital Era - Your Marketing Guide',
        message: 'Welcome to Digital Era! Here\'s your free marketing guide. I\'ll be following up with some exclusive insights...',
        attempted_at: new Date('2024-08-20T10:45:00Z'),
        automated: true,
        template_used: 'welcome_sequence_1'
      },
      {
        id: '4',
        method: 'phone',
        status: 'delivered',
        subject: 'Follow-up Call',
        message: 'Left voicemail about the marketing course opportunity. Mentioned pricing and implementation timeline.',
        attempted_at: new Date('2024-08-22T14:30:00Z'),
        automated: false
      }
    ],
    lead_score: 92,
    lead_score_factors: {
      email_engagement: 18,
      website_activity: 22,
      funnel_progression: 28,
      response_speed: 14,
      social_engagement: 8,
      demographic_fit: 2
    },
    engagement_level: 'hot',
    utm_data: {
      source: 'google',
      medium: 'cpc',
      campaign: 'digital_marketing_q3',
      term: 'affiliate marketing course',
      content: 'ad_variant_a'
    },
    referrer_url: 'https://google.com',
    landing_page: 'https://digitalera.com/marketing-guide',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0...',
    email_subscribed: true,
    sms_subscribed: true,
    gdpr_consent: true,
    marketing_consent: true,
    custom_fields: {
      company_size: '50-100 employees',
      annual_revenue: '$5M-$10M',  
      marketing_budget: '$50k-$100k',
      current_tools: ['HubSpot', 'Google Ads', 'Facebook Ads']
    },
    assigned_to: 'You',
    predicted_conversion_probability: 0.87
  };

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setLead(mockLead);
      setLoading(false);
    }, 800);
  }, [id]);

  if (!isMounted) {
    return null;
  }

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Lead Profile - CRM System</title>
        </Head>
        <AppLayout>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div 
              className="max-w-md w-full mx-4 p-8 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <i className="fas fa-lock text-6xl text-yellow-500 mb-4"></i>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Premium Feature
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Lead profiles are available for premium members only.
              </p>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!lead) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Lead Not Found
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              The lead you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getEngagementColor = (level: 'cold' | 'warm' | 'hot') => {
    switch (level) {
      case 'hot': return 'text-green-600 bg-green-100';
      case 'warm': return 'text-yellow-600 bg-yellow-100';
      case 'cold': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'nurturing': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-gray-100 text-gray-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommunicationStatusColor = (status: CommunicationStatus) => {
    switch (status) {
      case 'sent': return 'text-blue-600';
      case 'delivered': return 'text-purple-600';
      case 'opened': return 'text-yellow-600';
      case 'clicked': return 'text-orange-600';
      case 'replied': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const handleContactAttempt = (method: ContactMethod) => {
    // Handle new contact attempt
    setShowContactModal(true);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        created_at: new Date(),
        created_by: 'You',
        is_pinned: false,
        tags: [],
        type: 'note'
      };
      
      setLead(prev => prev ? {
        ...prev,
        notes: [note, ...prev.notes]
      } : null);
      
      setNewNote('');
      setShowNoteModal(false);
    }
  };

  return (
    <>
      <Head>
        <title>{lead.name} - Lead Profile - CRM System</title>
        <meta name="description" content={`Lead profile for ${lead.name} from ${lead.company}`} />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg border hover:bg-gray-50 transition-colors duration-200"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <i className="fas fa-arrow-left" style={{ color: 'var(--text-primary)' }}></i>
              </button>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {lead.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {lead.job_title} at {lead.company}
                </p>
              </div>
            </div>

            {/* Lead Summary Card */}
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Basic Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {lead.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)' }}>{lead.email}</p>
                      {lead.phone && (
                        <p style={{ color: 'var(--text-secondary)' }}>{lead.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--text-on-primary)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lead Score */}
                <div className="text-center">
                  <div className="mb-2">
                    <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {lead.lead_score}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>/100</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(lead.engagement_level)}`}>
                    {lead.engagement_level.toUpperCase()} LEAD
                  </span>
                  <div className="mt-2">
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Conversion Probability
                    </div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--color-success)' }}>
                      {(lead.predicted_conversion_probability * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div>
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleContactAttempt('email')}
                      className="w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)'
                      }}
                    >
                      <i className="fas fa-envelope"></i>
                      Send Email
                    </button>
                    
                    {lead.phone && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleContactAttempt('phone')}
                          className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200"
                          style={{ 
                            borderColor: 'var(--color-border)',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <i className="fas fa-phone"></i>
                        </button>
                        {lead.communication_channels.phone?.whatsapp_available && (
                          <button
                            onClick={() => handleContactAttempt('whatsapp')}
                            className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200"
                            style={{ 
                              borderColor: 'var(--color-border)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <i className="fab fa-whatsapp"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div 
              className="border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: 'fas fa-chart-line' },
                  { id: 'communication', name: 'Communication', icon: 'fas fa-comments' },
                  { id: 'notes', name: 'Notes', icon: 'fas fa-sticky-note' },
                  { id: 'analytics', name: 'Analytics', icon: 'fas fa-chart-bar' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <i className={tab.icon}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lead Details */}
              <div className="lg:col-span-2 space-y-6">
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Lead Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Source
                      </label>
                      <p className="capitalize" style={{ color: 'var(--text-primary)' }}>
                        {lead.source.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Funnel
                      </label>
                      <p style={{ color: 'var(--text-primary)' }}>{lead.funnel_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Created
                      </label>
                      <p style={{ color: 'var(--text-primary)' }}>
                        {lead.created_at.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Last Contact
                      </label>
                      <p style={{ color: 'var(--text-primary)' }}>
                        {lead.last_contacted ? formatTimeAgo(lead.last_contacted) : 'Never'}
                      </p>
                    </div>
                    {lead.location && (
                      <>
                        <div>
                          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Location
                          </label>
                          <p style={{ color: 'var(--text-primary)' }}>
                            {lead.location.city}, {lead.location.state}, {lead.location.country}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Timezone
                          </label>
                          <p style={{ color: 'var(--text-primary)' }}>{lead.location.timezone}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* UTM Data */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Attribution Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(lead.utm_data).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <label className="text-sm font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>
                            UTM {key}
                          </label>
                          <p style={{ color: 'var(--text-primary)' }}>{value}</p>
                        </div>
                      )
                    ))}
                    {lead.landing_page && (
                      <div>
                        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          Landing Page
                        </label>
                        <p className="text-sm truncate" style={{ color: 'var(--color-primary)' }}>
                          {lead.landing_page}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Fields */}
                {lead.custom_fields && Object.keys(lead.custom_fields).length > 0 && (
                  <div 
                    className="p-6 rounded-lg border"
                    style={{ 
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(lead.custom_fields).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>
                            {key.replace('_', ' ')}
                          </label>
                          <p style={{ color: 'var(--text-primary)' }}>
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lead Score Breakdown */}
              <div>
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Lead Score Breakdown
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(lead.lead_score_factors).map(([factor, score]) => (
                      <div key={factor}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                            {factor.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {score}
                          </span>
                        </div>
                        <div 
                          className="w-full bg-gray-200 rounded-full h-2"
                          style={{ backgroundColor: 'var(--bg-secondary)' }}
                        >
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(score / 30) * 100}%`, // Max score per factor is 30
                              backgroundColor: 'var(--color-primary)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication Channels */}
                <div 
                  className="mt-6 p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Communication Channels
                  </h3>
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-envelope text-blue-600"></i>
                        <span style={{ color: 'var(--text-primary)' }}>Email</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {lead.communication_channels.email.open_count} opens
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {lead.communication_channels.email.click_count} clicks
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    {lead.communication_channels.phone && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-phone text-green-600"></i>
                          <span style={{ color: 'var(--text-primary)' }}>Phone</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {(lead.communication_channels.phone.response_rate * 100).toFixed(0)}% response rate
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social */}
                    {lead.communication_channels.social && Object.keys(lead.communication_channels.social).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-share-alt text-purple-600"></i>
                          <span style={{ color: 'var(--text-primary)' }}>Social Media</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {Object.entries(lead.communication_channels.social).map(([platform, handle]) => (
                            handle && (
                              <div key={platform} className="flex justify-between">
                                <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                                  {platform}
                                </span>
                                <span className="text-sm" style={{ color: 'var(--color-primary)' }}>
                                  {handle}
                                </span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div 
              className="rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Communication History
                  </h3>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    New Contact
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {lead.contact_attempts
                    .sort((a, b) => new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime())
                    .map((attempt) => (
                    <div key={attempt.id} className="border-l-4 pl-4" style={{ borderColor: 'var(--color-primary)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <i className={`fas fa-${
                              attempt.method === 'email' ? 'envelope' :
                              attempt.method === 'phone' ? 'phone' :
                              attempt.method === 'whatsapp' ? 'comment' :
                              attempt.method === 'linkedin' ? 'link' : 'comment'
                            }`}></i>
                            <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                              {attempt.method}
                            </span>
                            <span className={`text-sm font-medium ${getCommunicationStatusColor(attempt.status)}`}>
                              {attempt.status}
                            </span>
                            {attempt.automated && (
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Automated
                              </span>
                            )}
                          </div>
                          {attempt.subject && (
                            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                              {attempt.subject}
                            </h4>
                          )}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {formatTimeAgo(attempt.attempted_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {attempt.message}
                      </p>
                      
                      {attempt.response_content && (
                        <div 
                          className="mt-3 p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--bg-secondary)' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <i className="fas fa-reply text-green-600"></i>
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              Response ({attempt.responded_at ? formatTimeAgo(attempt.responded_at) : 'Unknown'})
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {attempt.response_content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div 
              className="rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Notes & Reminders
                  </h3>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Note
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {lead.notes
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((note) => (
                    <div 
                      key={note.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        note.is_pinned ? 'bg-yellow-50' : ''
                      }`}
                      style={{ 
                        backgroundColor: note.is_pinned ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                        borderColor: note.is_pinned ? '#F59E0B' : 'var(--color-border)'
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <i className={`fas fa-${
                            note.type === 'reminder' ? 'bell' :
                            note.type === 'meeting' ? 'calendar' :
                            note.type === 'call' ? 'phone' :
                            note.type === 'email' ? 'envelope' :
                            note.type === 'task' ? 'tasks' : 'sticky-note'
                          }`}></i>
                          <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                            {note.type}
                          </span>
                          {note.is_pinned && (
                            <i className="fas fa-thumbtack text-yellow-600"></i>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {note.created_by}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {formatTimeAgo(note.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="mb-3" style={{ color: 'var(--text-primary)' }}>
                        {note.content}
                      </p>
                      
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div 
                className="text-center py-12 rounded-lg"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <i className="fas fa-chart-bar text-4xl text-gray-400 mb-4"></i>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Lead Analytics
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Detailed lead analytics and engagement tracking coming soon.
                </p>
              </div>
            </div>
          )}

          {/* Add Note Modal */}
          {showNoteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div 
                className="max-w-md w-full mx-4 p-6 rounded-lg"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Add Note
                </h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                  >
                    Add Note
                  </button>
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200"
                    style={{ 
                      borderColor: 'var(--color-border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
};

export default LeadProfile;