import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'organic' | 'social' | 'email' | 'referral' | 'paid' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost';
  stage: 'awareness' | 'interest' | 'consideration' | 'intent' | 'purchase';
  score: number;
  company?: string;
  position?: string;
  notes: string;
  lastContact?: string;
  createdDate: string;
  tags: string[];
  assignedTo?: string;
}

interface LeadStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgResponseTime: number;
  hotLeads: number;
}

const LeadsPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 156,
    newLeads: 23,
    qualifiedLeads: 47,
    conversionRate: 18.5,
    avgResponseTime: 2.3,
    hotLeads: 12
  });

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();

  // Mock leads data
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@techcorp.com',
      phone: '+1 (555) 123-4567',
      source: 'organic',
      status: 'qualified',
      stage: 'consideration',
      score: 85,
      company: 'TechCorp Solutions',
      position: 'Marketing Director',
      notes: 'Very interested in affiliate marketing course. Has budget approved.',
      lastContact: '2024-08-23',
      createdDate: '2024-08-20',
      tags: ['hot-lead', 'decision-maker', 'enterprise'],
      assignedTo: 'You'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mchen@startup.io',
      phone: '+1 (555) 234-5678',
      source: 'social',
      status: 'contacted',
      stage: 'interest',
      score: 72,
      company: 'StartupIO',
      position: 'CEO',
      notes: 'Responded to LinkedIn outreach. Interested in sales funnel optimization.',
      lastContact: '2024-08-22',
      createdDate: '2024-08-18',
      tags: ['startup', 'ceo', 'linkedin'],
      assignedTo: 'You'
    },
    {
      id: '3',
      name: 'Sarah Thompson',
      email: 'sarah.t@freelancer.com',
      source: 'email',
      status: 'new',
      stage: 'awareness',
      score: 45,
      position: 'Freelance Consultant',
      notes: 'Downloaded lead magnet. No response to initial outreach yet.',
      createdDate: '2024-08-24',
      tags: ['freelancer', 'lead-magnet'],
      assignedTo: 'You'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'd.rodriguez@agency.com',
      phone: '+1 (555) 345-6789',
      source: 'referral',
      status: 'nurturing',
      stage: 'consideration',
      score: 68,
      company: 'Digital Agency Pro',
      position: 'Agency Owner',
      notes: 'Referred by John Smith. Needs time to evaluate options.',
      lastContact: '2024-08-21',
      createdDate: '2024-08-15',
      tags: ['referral', 'agency-owner', 'warm'],
      assignedTo: 'You'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@ecommerce.store',
      phone: '+1 (555) 456-7890',
      source: 'paid',
      status: 'qualified',
      stage: 'intent',
      score: 91,
      company: 'E-commerce Experts',
      position: 'Founder',
      notes: 'High-intent lead from Facebook ads. Ready to purchase premium course.',
      lastContact: '2024-08-24',
      createdDate: '2024-08-23',
      tags: ['high-intent', 'facebook-ads', 'ecommerce'],
      assignedTo: 'You'
    },
    {
      id: '6',
      name: 'Robert Johnson',
      email: 'rjohnson@corp.com',
      source: 'direct',
      status: 'lost',
      stage: 'consideration',
      score: 35,
      company: 'Corporate Inc',
      position: 'VP Marketing',
      notes: 'Budget constraints. May reconnect next quarter.',
      lastContact: '2024-08-19',
      createdDate: '2024-08-12',
      tags: ['budget-constraints', 'corporate', 'future-opportunity'],
      assignedTo: 'You'
    }
  ];

  const sources = [
    'all', 'organic', 'social', 'email', 'referral', 'paid', 'direct'
  ];

  const statuses = [
    'all', 'new', 'contacted', 'qualified', 'nurturing', 'converted', 'lost'
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'nurturing': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'organic': return 'fas fa-search';
      case 'social': return 'fas fa-share-alt';
      case 'email': return 'fas fa-envelope';
      case 'referral': return 'fas fa-user-friends';
      case 'paid': return 'fas fa-bullseye';
      case 'direct': return 'fas fa-direct-hit';
      default: return 'fas fa-question';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ));
  };

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Leads - Digital Era Learning Platform</title>
          <meta name="description" content="Manage your leads and prospects" />
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
                  Lead Management is available for premium members only.
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

  return (
    <>
      <Head>
        <title>Leads - Digital Era Learning Platform</title>
        <meta name="description" content="Manage your leads and prospects" />
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
                  Lead Management
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Track and manage your prospects throughout the sales funnel.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <StatsCard title="Total Leads" value={stats.totalLeads.toString()} icon="fas fa-users" color="blue" />
            <StatsCard title="New Leads" value={stats.newLeads.toString()} icon="fas fa-user-plus" color="green" />
            <StatsCard title="Qualified" value={stats.qualifiedLeads.toString()} icon="fas fa-star" color="yellow" />
            <StatsCard title="Hot Leads" value={stats.hotLeads.toString()} icon="fas fa-fire" color="red" />
            <StatsCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon="fas fa-chart-line" color="purple" />
            <StatsCard title="Avg Response" value={`${stats.avgResponseTime}h`} icon="fas fa-clock" color="indigo" />
          </div>

          {/* Filters */}
          <div 
            className="mb-6 p-6 rounded-lg"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search leads..."
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

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {sources.map(source => (
                    <option key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option>Sort by Score (High to Low)</option>
                  <option>Sort by Date (Newest)</option>
                  <option>Sort by Name (A-Z)</option>
                  <option>Sort by Last Contact</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Grid */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="animate-pulse p-6 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={updateLeadStatus}
                  onViewDetails={setSelectedLead}
                />
              ))}
            </div>
          )}

          {!loading && filteredLeads.length === 0 && (
            <div 
              className="text-center py-12 rounded-lg"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                No leads found
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Try adjusting your search criteria or add your first lead.
              </p>
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
  icon: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p 
            className="text-xs font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </p>
          <p 
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
        </div>
        <div className={`text-${color}-500`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

// Lead Card Component
interface LeadCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, status: Lead['status']) => void;
  onViewDetails: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusChange, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'nurturing': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'organic': return 'fas fa-search';
      case 'social': return 'fas fa-share-alt';
      case 'email': return 'fas fa-envelope';
      case 'referral': return 'fas fa-user-friends';
      case 'paid': return 'fas fa-bullseye';
      case 'direct': return 'fas fa-direct-hit';
      default: return 'fas fa-question';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className="p-6 rounded-lg border hover:shadow-lg transition-all duration-200"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 
              className="font-semibold text-lg mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {lead.name}
            </h3>
            <p 
              className="text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {lead.email}
            </p>
            {lead.company && (
              <p 
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                {lead.position} at {lead.company}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
            {lead.score}
          </div>
          <div 
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Lead Score
          </div>
        </div>
      </div>

      {/* Status & Source */}
      <div className="flex items-center gap-4 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
        <div className="flex items-center gap-2">
          <i className={`${getSourceIcon(lead.source)} text-gray-500`}></i>
          <span 
            className="text-sm capitalize"
            style={{ color: 'var(--text-secondary)' }}
          >
            {lead.source}
          </span>
        </div>
      </div>

      {/* Tags */}
      {lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {lead.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
            >
              {tag}
            </span>
          ))}
          {lead.tags.length > 3 && (
            <span 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
            >
              +{lead.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      <p 
        className="text-sm mb-4 line-clamp-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        {lead.notes}
      </p>

      {/* Meta Info */}
      <div className="flex justify-between items-center text-xs mb-4">
        <span style={{ color: 'var(--text-muted)' }}>
          Created: {new Date(lead.createdDate).toLocaleDateString()}
        </span>
        {lead.lastContact && (
          <span style={{ color: 'var(--text-muted)' }}>
            Last contact: {new Date(lead.lastContact).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
          className="flex-1 px-3 py-2 rounded-lg border text-sm"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--color-border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="nurturing">Nurturing</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
        <button
          onClick={() => onViewDetails(lead)}
          className="px-4 py-2 rounded-lg border font-medium text-sm transition-colors duration-200"
          style={{ 
            borderColor: 'var(--color-border)',
            color: 'var(--text-primary)'
          }}
        >
          <i className="fas fa-eye"></i>
        </button>
        <button
          className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-on-primary)'
          }}
        >
          <i className="fas fa-phone"></i>
        </button>
      </div>
    </div>
  );
};

export default LeadsPage;