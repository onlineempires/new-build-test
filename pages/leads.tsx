import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../components/layout/AppLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';
import { 
  Lead, 
  Sale, 
  CRMStats, 
  FilterOptions, 
  LeadStatus, 
  LeadSource,
  SortOptions,
  BulkAction,
  FollowUpReminder
} from '../types/crm';

// CRM Dashboard - Main leads page that acts as comprehensive CRM system
const CRMDashboard: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'leads' | 'sales' | 'analytics'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter and Sort States
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    status: [],
    source: [],
    lead_score_range: [0, 100],
    engagement_level: []
  });
  
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'created_at',
    direction: 'desc'
  });

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();
  const router = useRouter();

  // Mock data for demonstration
  const mockStats: CRMStats = {
    total_leads: 1247,
    new_leads_today: 23,
    new_leads_this_week: 156,
    new_leads_this_month: 643,
    qualified_leads: 284,
    hot_leads: 47,
    
    total_sales: 89,
    sales_today: 3,
    sales_this_week: 18,
    sales_this_month: 67,
    conversion_rate: 14.2,
    average_time_to_conversion: 12.5,
    
    total_revenue: 186750.00,
    revenue_today: 1497.00,
    revenue_this_week: 12480.00,
    revenue_this_month: 45230.00,
    average_deal_size: 2098.31,
    commission_earned: 37350.00,
    
    email_open_rate: 24.8,
    email_click_rate: 3.2,
    response_rate: 12.4,
    follow_up_completion_rate: 78.9,
    
    leads_in_nurture: 423,
    overdue_follow_ups: 34,
    predicted_monthly_revenue: 52000.00,
    pipeline_value: 234500.00,
    
    performance_by_source: [
      { source: 'funnel_optin', leads: 523, conversions: 89, revenue: 98450.00, conversion_rate: 17.0 },
      { source: 'landing_page', leads: 342, conversions: 45, revenue: 47230.00, conversion_rate: 13.2 },
      { source: 'affiliate_link', leads: 234, conversions: 28, revenue: 29870.00, conversion_rate: 12.0 },
      { source: 'social_media', leads: 148, conversions: 12, revenue: 11200.00, conversion_rate: 8.1 }
    ],
    
    performance_by_funnel: [
      { funnel_id: '1', funnel_name: 'Digital Marketing Mastery', leads: 423, conversions: 67, revenue: 89340.00, conversion_rate: 15.8 },
      { funnel_id: '2', funnel_name: 'Affiliate Success Blueprint', leads: 298, conversions: 34, revenue: 45670.00, conversion_rate: 11.4 },
      { funnel_id: '3', funnel_name: 'Lead Generation Secrets', leads: 267, conversions: 28, revenue: 32450.00, conversion_rate: 10.5 }
    ]
  };

  const mockLeads: Lead[] = [
    {
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
      tags: ['decision-maker', 'enterprise', 'hot-lead'],
      created_at: new Date('2024-08-20T10:30:00Z'),
      updated_at: new Date('2024-08-24T15:45:00Z'),
      last_contacted: new Date('2024-08-23T09:15:00Z'),
      next_follow_up: new Date('2024-08-26T14:00:00Z'),
      communication_channels: {
        email: {
          address: 'sarah.martinez@techcorp.com',
          verified: true,
          bounced: false,
          last_opened: new Date('2024-08-24T08:30:00Z'),
          open_count: 8,
          click_count: 3
        },
        phone: {
          number: '+1-555-234-5678',
          whatsapp_available: true,
          imessage_available: false,
          sms_available: true,
          response_rate: 0.75
        },
        social: {
          linkedin: 'sarah-martinez-marketing'
        }
      },
      notes: [
        {
          id: '1',
          content: 'Very interested in affiliate marketing course. Has budget approved for Q4.',
          created_at: new Date('2024-08-23T09:20:00Z'),
          created_by: 'You',
          is_pinned: true,
          tags: ['budget-approved'],
          type: 'note'
        }
      ],
      contact_attempts: [
        {
          id: '1',
          method: 'email',
          status: 'opened',
          subject: 'Transform Your Marketing Strategy',
          message: 'Hi Sarah, I noticed you downloaded our digital marketing guide...',
          attempted_at: new Date('2024-08-23T09:15:00Z'),
          responded_at: new Date('2024-08-23T14:30:00Z'),
          response_content: 'Very interested! Can we schedule a call this week?',
          automated: false,
          template_used: 'follow_up_template_1'
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
        term: 'affiliate marketing course'
      },
      email_subscribed: true,
      sms_subscribed: true,
      gdpr_consent: true,
      marketing_consent: true,
      custom_fields: {},
      assigned_to: 'You',
      predicted_conversion_probability: 0.87
    },
    {
      id: '2',
      email: 'michael@startup.io',
      name: 'Michael Chen',
      first_name: 'Michael',
      last_name: 'Chen',
      phone: '+1-555-345-6789',
      company: 'StartupIO',
      job_title: 'CEO',
      location: {
        country: 'United States',
        state: 'New York',
        city: 'New York',
        timezone: 'EST'
      },
      source: 'social_media',
      funnel_id: '2',
      funnel_name: 'Affiliate Success Blueprint',
      status: 'contacted',
      tags: ['startup', 'ceo', 'linkedin'],
      created_at: new Date('2024-08-18T16:20:00Z'),
      updated_at: new Date('2024-08-22T11:30:00Z'),
      last_contacted: new Date('2024-08-22T11:30:00Z'),
      next_follow_up: new Date('2024-08-25T10:00:00Z'),
      communication_channels: {
        email: {
          address: 'michael@startup.io',
          verified: true,
          bounced: false,
          last_opened: new Date('2024-08-22T12:15:00Z'),
          open_count: 4,
          click_count: 1
        },
        social: {
          linkedin: 'michael-chen-startup'
        }
      },
      notes: [
        {
          id: '2',
          content: 'Responded to LinkedIn outreach. Interested in sales funnel optimization.',
          created_at: new Date('2024-08-22T11:35:00Z'),
          created_by: 'You',
          is_pinned: false,
          tags: ['linkedin-lead'],
          type: 'note'
        }
      ],
      contact_attempts: [
        {
          id: '2',
          method: 'linkedin',
          status: 'replied',
          subject: 'Growing Your Startup Revenue',
          message: 'Hi Michael, saw your post about scaling challenges...',
          attempted_at: new Date('2024-08-22T11:30:00Z'),
          responded_at: new Date('2024-08-22T16:45:00Z'),
          response_content: 'Thanks for reaching out! Let\'s connect.',
          automated: false
        }
      ],
      lead_score: 68,
      lead_score_factors: {
        email_engagement: 12,
        website_activity: 15,
        funnel_progression: 20,
        response_speed: 12,
        social_engagement: 7,
        demographic_fit: 2
      },
      engagement_level: 'warm',
      utm_data: {
        source: 'linkedin',
        medium: 'social',
        campaign: 'startup_outreach'
      },
      email_subscribed: true,
      sms_subscribed: false,
      gdpr_consent: true,
      marketing_consent: true,
      custom_fields: {},
      assigned_to: 'You',
      predicted_conversion_probability: 0.42
    },
    {
      id: '3',
      email: 'jennifer.davis@agency.com',
      name: 'Jennifer Davis',
      first_name: 'Jennifer',
      last_name: 'Davis',
      company: 'Digital Growth Agency',
      job_title: 'Agency Owner',
      location: {
        country: 'United States',
        state: 'Texas',
        city: 'Austin',
        timezone: 'CST'
      },
      source: 'affiliate_link',
      funnel_id: '1',
      funnel_name: 'Digital Marketing Mastery',
      status: 'new',
      tags: ['agency-owner', 'referral'],
      created_at: new Date('2024-08-24T14:15:00Z'),
      updated_at: new Date('2024-08-24T14:15:00Z'),
      communication_channels: {
        email: {
          address: 'jennifer.davis@agency.com',
          verified: true,
          bounced: false,
          open_count: 0,
          click_count: 0
        }
      },
      notes: [],
      contact_attempts: [],
      lead_score: 35,
      lead_score_factors: {
        email_engagement: 0,
        website_activity: 8,
        funnel_progression: 15,
        response_speed: 0,
        social_engagement: 0,
        demographic_fit: 12
      },
      engagement_level: 'warm',
      utm_data: {
        source: 'affiliate',
        medium: 'referral',
        campaign: 'partner_program'
      },
      email_subscribed: true,
      sms_subscribed: false,
      gdpr_consent: true,
      marketing_consent: true,
      custom_fields: {},
      predicted_conversion_probability: 0.28
    }
  ];

  const mockSales: Sale[] = [
    {
      id: '1',
      lead_id: '1',
      product_id: 'prod_1',
      product_name: 'Digital Marketing Mastery Course',
      amount: 497.00,
      currency: 'USD',
      commission_rate: 30,
      commission_earned: 149.10,
      payment_method: 'Credit Card',
      payment_processor: 'stripe',
      transaction_id: 'txn_1234567890',
      payment_status: 'completed',
      sale_date: new Date('2024-08-24T16:30:00Z'),
      funnel_id: '1',
      funnel_name: 'Digital Marketing Mastery',
      affiliate_id: 'aff_001',
      affiliate_name: 'John Smith',
      utm_data: {
        source: 'google',
        medium: 'cpc',
        campaign: 'digital_marketing_q3'
      },
      days_to_conversion: 4,
      touchpoints_to_conversion: 3,
      last_touchpoint: 'email',
      custom_fields: {}
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setStats(mockStats);
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setSales(mockSales);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = leads.filter(lead => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
          lead.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(lead.status)) return false;
      }

      // Source filter
      if (filters.source && filters.source.length > 0) {
        if (!filters.source.includes(lead.source)) return false;
      }

      // Lead score range filter
      if (filters.lead_score_range) {
        const [min, max] = filters.lead_score_range;
        if (lead.lead_score < min || lead.lead_score > max) return false;
      }

      // Engagement level filter
      if (filters.engagement_level && filters.engagement_level.length > 0) {
        if (!filters.engagement_level.includes(lead.engagement_level)) return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'lead_score':
          aValue = a.lead_score;
          bValue = b.lead_score;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'last_contacted':
          aValue = a.last_contacted ? new Date(a.last_contacted).getTime() : 0;
          bValue = b.last_contacted ? new Date(b.last_contacted).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(filtered);
  }, [leads, filters, sortOptions, searchTerm]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>CRM System - Digital Era Learning Platform</title>
          <meta name="description" content="Comprehensive CRM system for lead and sales management" />
        </Head>

        <AppLayout>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div 
              className="max-w-md w-full mx-4 p-8 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="mb-6">
                <i className="fas fa-lock text-6xl text-yellow-500 mb-4"></i>
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Premium Feature
                </h2>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  CRM System is available for premium members only.
                </p>
              </div>
              <a
                href="/upgrade"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-on-primary)'
                }}
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Upgrade Now
              </a>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  const handleLeadClick = (leadId: string) => {
    router.push(`/crm/lead/${leadId}`);
  };

  const handleBulkAction = (action: BulkAction) => {
    // Handle bulk actions
    console.log('Bulk action:', action);
  };

  const getEngagementColor = (level: 'cold' | 'warm' | 'hot') => {
    switch (level) {
      case 'hot': return 'text-green-600 bg-green-100';
      case 'warm': return 'text-yellow-600 bg-yellow-100';
      case 'cold': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: LeadStatus) => {
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

  return (
    <>
      <Head>
        <title>CRM System - Digital Era Learning Platform</title>
        <meta name="description" content="Comprehensive CRM system for lead and sales management" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  CRM System
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Comprehensive customer relationship management for your funnels and campaigns.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    showFilters ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                  style={{ 
                    backgroundColor: showFilters ? 'var(--color-primary)' : 'var(--bg-secondary)',
                    color: showFilters ? 'var(--text-on-primary)' : 'var(--text-primary)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <i className="fas fa-filter mr-2"></i>
                  Filters
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--text-on-primary)'
                  }}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Lead
                </button>
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mb-8">
            <div 
              className="border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <nav className="flex space-x-8">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-line' },
                  { id: 'leads', name: 'Leads', icon: 'fas fa-users' },
                  { id: 'sales', name: 'Sales', icon: 'fas fa-dollar-sign' },
                  { id: 'analytics', name: 'Analytics', icon: 'fas fa-chart-bar' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeView === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ 
                      color: activeView === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <i className={tab.icon}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Dashboard View */}
          {activeView === 'dashboard' && stats && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Leads"
                  value={stats.total_leads.toLocaleString()}
                  subtitle={`+${stats.new_leads_today} today`}
                  icon="fas fa-users"
                  color="blue"
                  trend={`+${stats.new_leads_this_week}`}
                  trendLabel="this week"
                />
                <StatsCard
                  title="Qualified Leads"
                  value={stats.qualified_leads.toString()}
                  subtitle={`${((stats.qualified_leads / stats.total_leads) * 100).toFixed(1)}% of total`}
                  icon="fas fa-star"
                  color="green"
                  trend={`${stats.hot_leads} hot`}
                  trendLabel="high priority"
                />
                <StatsCard
                  title="Total Sales"
                  value={stats.total_sales.toString()}
                  subtitle={`+${stats.sales_today} today`}
                  icon="fas fa-chart-line"
                  color="purple"
                  trend={`${stats.conversion_rate}%`}
                  trendLabel="conversion rate"
                />
                <StatsCard
                  title="Revenue"
                  value={`$${(stats.total_revenue / 1000).toFixed(0)}k`}
                  subtitle={`+$${stats.revenue_today.toLocaleString()} today`}
                  icon="fas fa-dollar-sign"
                  color="orange"
                  trend={`$${stats.average_deal_size.toLocaleString()}`}
                  trendLabel="avg deal size"
                />
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Recent Leads
                  </h3>
                  <div className="space-y-4">
                    {leads.slice(0, 5).map((lead) => (
                      <div 
                        key={lead.id}
                        className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:shadow-sm transition-all duration-200"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                        onClick={() => handleLeadClick(lead.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 
                              className="font-medium"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {lead.name}
                            </h4>
                            <p 
                              className="text-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {lead.company} • {formatTimeAgo(lead.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(lead.engagement_level)}`}>
                            {lead.engagement_level}
                          </span>
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {lead.lead_score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Health */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Pipeline Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span style={{ color: 'var(--text-secondary)' }}>Leads in Nurture</span>
                      <span 
                        className="font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {stats.leads_in_nurture}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: 'var(--text-secondary)' }}>Overdue Follow-ups</span>
                      <span 
                        className="font-semibold text-red-600"
                      >
                        {stats.overdue_follow_ups}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: 'var(--text-secondary)' }}>Pipeline Value</span>
                      <span 
                        className="font-semibold"
                        style={{ color: 'var(--color-success)' }}
                      >
                        ${(stats.pipeline_value / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: 'var(--text-secondary)' }}>Predicted Monthly Revenue</span>
                      <span 
                        className="font-semibold"
                        style={{ color: 'var(--color-success)' }}
                      >
                        ${(stats.predicted_monthly_revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Follow-up Completion Rate
                        </span>
                        <span 
                          className="text-sm font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {stats.follow_up_completion_rate}%
                        </span>
                      </div>
                      <div 
                        className="w-full bg-gray-200 rounded-full h-2"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${stats.follow_up_completion_rate}%`,
                            backgroundColor: 'var(--color-success)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leads View */}
          {activeView === 'leads' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search leads by name, email, company, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="px-4 py-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--text-primary)'
                      }}
                      onChange={(e) => setSortOptions({...sortOptions, field: e.target.value as any})}
                    >
                      <option value="created_at">Sort by Date</option>
                      <option value="lead_score">Sort by Score</option>
                      <option value="name">Sort by Name</option>
                      <option value="last_contacted">Sort by Last Contact</option>
                    </select>
                    <button
                      onClick={() => setSortOptions({...sortOptions, direction: sortOptions.direction === 'asc' ? 'desc' : 'asc'})}
                      className="px-4 py-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <i className={`fas fa-sort-${sortOptions.direction === 'asc' ? 'up' : 'down'}`}></i>
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Status
                      </label>
                      <select
                        multiple
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--text-primary)'
                        }}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions).map(o => o.value as LeadStatus);
                          setFilters({...filters, status: selected});
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="nurturing">Nurturing</option>
                        <option value="cold">Cold</option>
                        <option value="converted">Converted</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Source
                      </label>
                      <select
                        multiple
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--text-primary)'
                        }}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions).map(o => o.value as LeadSource);
                          setFilters({...filters, source: selected});
                        }}
                      >
                        <option value="funnel_optin">Funnel Opt-in</option>
                        <option value="landing_page">Landing Page</option>
                        <option value="affiliate_link">Affiliate Link</option>
                        <option value="social_media">Social Media</option>
                        <option value="referral">Referral</option>
                        <option value="manual_import">Manual Import</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Engagement Level
                      </label>
                      <select
                        multiple
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--text-primary)'
                        }}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions).map(o => o.value as 'cold' | 'warm' | 'hot');
                          setFilters({...filters, engagement_level: selected});
                        }}
                      >
                        <option value="hot">Hot</option>
                        <option value="warm">Warm</option>
                        <option value="cold">Cold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Lead Score Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0" max="100"
                          placeholder="Min"
                          className="w-full px-3 py-2 rounded-lg border"
                          style={{ 
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--text-primary)'
                          }}
                          onChange={(e) => {
                            const min = parseInt(e.target.value) || 0;
                            const max = filters.lead_score_range?.[1] || 100;
                            setFilters({...filters, lead_score_range: [min, max]});
                          }}
                        />
                        <input
                          type="number"
                          min="0" max="100"
                          placeholder="Max"
                          className="w-full px-3 py-2 rounded-lg border"
                          style={{ 
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--text-primary)'
                          }}
                          onChange={(e) => {
                            const max = parseInt(e.target.value) || 100;
                            const min = filters.lead_score_range?.[0] || 0;
                            setFilters({...filters, lead_score_range: [min, max]});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Leads Table */}
              <div 
                className="rounded-lg border overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr 
                        className="border-b"
                        style={{ 
                          borderColor: 'var(--color-border)',
                          backgroundColor: 'var(--bg-secondary)'
                        }}
                      >
                        <th className="text-left py-3 px-4">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th 
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Lead
                        </th>
                        <th 
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Score
                        </th>
                        <th 
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Status
                        </th>
                        <th 
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Source
                        </th>
                        <th 
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Last Contact
                        </th>
                        <th 
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr 
                          key={lead.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          style={{ borderColor: 'var(--color-border)' }}
                          onClick={() => handleLeadClick(lead.id)}
                        >
                          <td className="py-4 px-4">
                            <input 
                              type="checkbox" 
                              className="rounded"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeads([...selectedLeads, lead.id]);
                                } else {
                                  setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                                }
                              }}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {lead.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h4 
                                  className="font-medium"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {lead.name}
                                </h4>
                                <p 
                                  className="text-sm"
                                  style={{ color: 'var(--text-secondary)' }}
                                >
                                  {lead.email}
                                </p>
                                {lead.company && (
                                  <p 
                                    className="text-xs"
                                    style={{ color: 'var(--text-muted)' }}
                                  >
                                    {lead.company}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${
                                lead.engagement_level === 'hot' ? 'bg-green-500' :
                                lead.engagement_level === 'warm' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></span>
                              <span 
                                className="font-semibold"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {lead.lead_score}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <span 
                                className="text-sm capitalize"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {lead.source.replace('_', ' ')}
                              </span>
                              <p 
                                className="text-xs"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                {lead.funnel_name}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span 
                              className="text-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {lead.last_contacted ? formatTimeAgo(lead.last_contacted) : 'Never'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                title="Send Email"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="fas fa-envelope text-blue-600"></i>
                              </button>
                              {lead.phone && (
                                <button
                                  className="p-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                  title="Call"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fas fa-phone text-green-600"></i>
                                </button>
                              )}
                              {lead.communication_channels.phone?.whatsapp_available && (
                                <button
                                  className="p-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                  title="WhatsApp"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fab fa-whatsapp text-green-600"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex justify-between items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>
                  Showing {filteredLeads.length} of {leads.length} leads
                </span>
                <div className="flex items-center gap-4">
                  {selectedLeads.length > 0 && (
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {selectedLeads.length} selected
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded border" style={{ borderColor: 'var(--color-border)' }}>
                      Previous
                    </button>
                    <button className="px-3 py-1 rounded border" style={{ borderColor: 'var(--color-border)' }}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sales View */}
          {activeView === 'sales' && (
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
                  Sales Tracking
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Detailed sales tracking and revenue analysis coming soon.
                </p>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              <div 
                className="text-center py-12 rounded-lg"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <i className="fas fa-analytics text-4xl text-gray-400 mb-4"></i>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Advanced Analytics
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Comprehensive analytics dashboard with conversion tracking coming soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: string;
  trendLabel?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend, 
  trendLabel 
}) => {
  return (
    <div 
      className="p-6 rounded-lg border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-${color}-600 text-xl`}></i>
        </div>
        {trend && (
          <div className="text-right">
            <div 
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {trend}
            </div>
            {trendLabel && (
              <div 
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                {trendLabel}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <h3 
          className="text-sm font-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </h3>
        <p 
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </p>
        <p 
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CRMDashboard;