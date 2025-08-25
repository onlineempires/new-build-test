import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Lead, 
  ContactAttempt, 
  EmailTemplate, 
  CommunicationChannel,
  CommunicationStats,
  FollowUpReminder
} from '../../types/crm';

interface CommunicationHubState {
  activeTab: 'inbox' | 'sent' | 'templates' | 'followups' | 'analytics';
  selectedChannel: CommunicationChannel | 'all';
  selectedLead: Lead | null;
  searchQuery: string;
  dateRange: 'today' | 'week' | 'month' | 'all';
  sortBy: 'date' | 'priority' | 'response_rate';
  sortOrder: 'asc' | 'desc';
}

const CommunicationsPage: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [state, setState] = useState<CommunicationHubState>({
    activeTab: 'inbox',
    selectedChannel: 'all',
    selectedLead: null,
    searchQuery: '',
    dateRange: 'week',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [communications, setCommunications] = useState<ContactAttempt[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpReminder[]>([]);
  const [stats, setStats] = useState<CommunicationStats>({
    totalSent: 0,
    totalReceived: 0,
    responseRate: 0,
    avgResponseTime: 0,
    channelBreakdown: {
      email: { sent: 0, received: 0, responseRate: 0 },
      whatsapp: { sent: 0, received: 0, responseRate: 0 },
      imessage: { sent: 0, received: 0, responseRate: 0 },
      instagram: { sent: 0, received: 0, responseRate: 0 },
      phone: { sent: 0, received: 0, responseRate: 0 },
      sms: { sent: 0, received: 0, responseRate: 0 }
    }
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const loadCommunications = async () => {
      setIsLoading(true);
      try {
        // Mock communication data
        const mockCommunications: ContactAttempt[] = [
          {
            id: '1',
            leadId: 'lead-1',
            type: 'email',
            direction: 'outbound',
            subject: 'Welcome to Our Digital Marketing Course',
            content: 'Thank you for your interest in our digital marketing course...',
            status: 'delivered',
            timestamp: new Date('2024-08-24T10:30:00'),
            responseReceived: true,
            responseTime: 1440, // 24 hours in minutes
            metadata: {
              emailAddress: 'john@example.com',
              templateId: 'welcome-sequence-1'
            }
          },
          {
            id: '2',
            leadId: 'lead-2',
            type: 'whatsapp',
            direction: 'inbound',
            content: 'Hi, I\'m interested in the affiliate marketing program. Can you tell me more?',
            status: 'received',
            timestamp: new Date('2024-08-24T14:15:00'),
            responseReceived: false,
            metadata: {
              phoneNumber: '+1234567890'
            }
          },
          {
            id: '3',
            leadId: 'lead-3',
            type: 'instagram',
            direction: 'outbound',
            content: 'Thanks for following! Check out our latest course announcement 🚀',
            status: 'sent',
            timestamp: new Date('2024-08-24T16:45:00'),
            responseReceived: false,
            metadata: {
              instagramHandle: '@john_marketer'
            }
          }
        ];

        const mockTemplates: EmailTemplate[] = [
          {
            id: '1',
            name: 'Welcome Sequence - Day 1',
            subject: 'Welcome to Your Digital Marketing Journey!',
            content: 'Hi {{firstName}},\n\nWelcome to our exclusive digital marketing community...',
            type: 'welcome',
            isActive: true,
            createdAt: new Date('2024-08-20T09:00:00'),
            updatedAt: new Date('2024-08-24T09:00:00'),
            usageCount: 45,
            openRate: 0.73,
            clickRate: 0.28,
            variables: ['firstName', 'courseName']
          },
          {
            id: '2',
            name: 'Follow-up: Abandoned Cart',
            subject: 'Don\'t Miss Out - Your Course is Waiting!',
            content: 'Hi {{firstName}},\n\nI noticed you were interested in {{courseName}} but didn\'t complete your enrollment...',
            type: 'followup',
            isActive: true,
            createdAt: new Date('2024-08-18T10:00:00'),
            updatedAt: new Date('2024-08-24T10:00:00'),
            usageCount: 23,
            openRate: 0.68,
            clickRate: 0.34,
            variables: ['firstName', 'courseName', 'discountCode']
          }
        ];

        const mockFollowUps: FollowUpReminder[] = [
          {
            id: '1',
            leadId: 'lead-1',
            type: 'email',
            scheduledFor: new Date('2024-08-25T09:00:00'),
            subject: 'Follow up on course enrollment',
            content: 'Hi John, just checking if you had any questions about the course...',
            status: 'scheduled',
            priority: 'high',
            createdAt: new Date('2024-08-24T17:00:00')
          },
          {
            id: '2',
            leadId: 'lead-2',
            type: 'whatsapp',
            scheduledFor: new Date('2024-08-25T14:00:00'),
            content: 'Thanks for your interest! I\'d love to answer any questions you might have.',
            status: 'scheduled',
            priority: 'medium',
            createdAt: new Date('2024-08-24T18:00:00')
          }
        ];

        const mockStats: CommunicationStats = {
          totalSent: 156,
          totalReceived: 89,
          responseRate: 0.57,
          avgResponseTime: 480, // 8 hours in minutes
          channelBreakdown: {
            email: { sent: 89, received: 34, responseRate: 0.38 },
            whatsapp: { sent: 34, received: 28, responseRate: 0.82 },
            imessage: { sent: 12, received: 8, responseRate: 0.67 },
            instagram: { sent: 21, received: 19, responseRate: 0.90 },
            phone: { sent: 0, received: 0, responseRate: 0 },
            sms: { sent: 0, received: 0, responseRate: 0 }
          }
        };

        setCommunications(mockCommunications);
        setTemplates(mockTemplates);
        setFollowUps(mockFollowUps);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading communications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunications();
  }, []);

  // Filter and sort communications
  const filteredCommunications = useMemo(() => {
    let filtered = communications;

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(comm => 
        comm.subject?.toLowerCase().includes(query) ||
        comm.content.toLowerCase().includes(query) ||
        comm.metadata?.emailAddress?.toLowerCase().includes(query) ||
        comm.metadata?.phoneNumber?.includes(query) ||
        comm.metadata?.instagramHandle?.toLowerCase().includes(query)
      );
    }

    // Filter by channel
    if (state.selectedChannel !== 'all') {
      filtered = filtered.filter(comm => comm.type === state.selectedChannel);
    }

    // Filter by date range
    const now = new Date();
    const filterDate = new Date();
    switch (state.dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        filterDate.setFullYear(2000);
    }
    
    if (state.dateRange !== 'all') {
      filtered = filtered.filter(comm => comm.timestamp >= filterDate);
    }

    // Sort communications
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (state.sortBy) {
        case 'date':
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
          break;
        case 'priority':
          // Priority based on response status and time
          aValue = a.responseReceived ? 1 : (a.direction === 'inbound' ? 3 : 2);
          bValue = b.responseReceived ? 1 : (b.direction === 'inbound' ? 3 : 2);
          break;
        case 'response_rate':
          aValue = a.responseReceived ? 1 : 0;
          bValue = b.responseReceived ? 1 : 0;
          break;
        default:
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
      }

      return state.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [communications, state.searchQuery, state.selectedChannel, state.dateRange, state.sortBy, state.sortOrder]);

  const getChannelIcon = (channel: CommunicationChannel): string => {
    const icons = {
      email: '📧',
      whatsapp: '💬',
      imessage: '💭',
      instagram: '📷',
      phone: '📞',
      sms: '💬'
    };
    return icons[channel] || '📝';
  };

  const getChannelColor = (channel: CommunicationChannel): string => {
    const colors = {
      email: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      whatsapp: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      imessage: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      instagram: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      phone: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      sms: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[channel] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const renderInbox = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search communications..."
            value={state.searchQuery}
            onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <select
          value={state.selectedChannel}
          onChange={(e) => setState(prev => ({ ...prev, selectedChannel: e.target.value as CommunicationChannel | 'all' }))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="imessage">iMessage</option>
          <option value="instagram">Instagram</option>
          <option value="phone">Phone</option>
          <option value="sms">SMS</option>
        </select>

        <select
          value={state.dateRange}
          onChange={(e) => setState(prev => ({ ...prev, dateRange: e.target.value as any }))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Communications List */}
      <div className="space-y-3">
        {filteredCommunications.map((comm) => (
          <div
            key={comm.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getChannelIcon(comm.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} Message`}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {comm.metadata?.emailAddress || comm.metadata?.phoneNumber || comm.metadata?.instagramHandle}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(comm.type)}`}>
                  {comm.type}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(comm.timestamp)}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {comm.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${
                  comm.direction === 'inbound' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {comm.direction === 'inbound' ? '← Received' : '→ Sent'}
                </span>
                
                <span className={`text-sm ${
                  comm.status === 'delivered' ? 'text-green-600 dark:text-green-400' :
                  comm.status === 'sent' ? 'text-blue-600 dark:text-blue-400' :
                  comm.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {comm.status}
                </span>
                
                {comm.responseReceived && (
                  <span className="text-sm text-purple-600 dark:text-purple-400">
                    ✓ Responded
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Reply
                </button>
                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                  Archive
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredCommunications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No communications found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or start a new conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Email Templates
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Create Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subject: {template.subject}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                {template.content}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Used:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 ml-1">
                  {template.usageCount} times
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Open Rate:</span>
                <span className="font-medium text-green-600 dark:text-green-400 ml-1">
                  {(template.openRate * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Click Rate:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 ml-1">
                  {(template.clickRate * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Variables:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 ml-1">
                  {template.variables.length}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {template.variables.map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Edit
                </button>
                <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                  Use
                </button>
                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFollowUps = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Follow-up Reminders
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Schedule Follow-up
        </button>
      </div>

      <div className="space-y-4">
        {followUps.map((followUp) => (
          <div
            key={followUp.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getChannelIcon(followUp.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {followUp.subject || `${followUp.type.charAt(0).toUpperCase() + followUp.type.slice(1)} Follow-up`}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lead ID: {followUp.leadId}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  followUp.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  followUp.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {followUp.priority}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {followUp.scheduledFor.toLocaleDateString()} {followUp.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {followUp.content}
            </p>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                followUp.status === 'scheduled' ? 'text-blue-600 dark:text-blue-400' :
                followUp.status === 'sent' ? 'text-green-600 dark:text-green-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                Status: {followUp.status}
              </span>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Edit
                </button>
                <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                  Send Now
                </button>
                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {followUps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No follow-ups scheduled
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule follow-up reminders to stay on top of your leads
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Communication Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSent}</p>
            </div>
            <div className="text-3xl">📤</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Received</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalReceived}</p>
            </div>
            <div className="text-3xl">📥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(stats.responseRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(stats.avgResponseTime / 60)}h {stats.avgResponseTime % 60}m
              </p>
            </div>
            <div className="text-3xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Channel Performance
        </h3>
        <div className="space-y-4">
          {Object.entries(stats.channelBreakdown).map(([channel, data]) => (
            <div key={channel} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getChannelIcon(channel as CommunicationChannel)}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {channel}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Sent:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 ml-1">
                    {data.sent}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Received:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 ml-1">
                    {data.received}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Response Rate:</span>
                  <span className="font-medium text-green-600 dark:text-green-400 ml-1">
                    {(data.responseRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading communications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Communications Hub - Digital Era CRM</title>
        <meta name="description" content="Multi-channel communication management for Digital Era CRM" />
      </Head>

      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Communications Hub
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage all your lead communications in one place
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <span>✉️</span>
                    <span>New Message</span>
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <span>⏰</span>
                    <span>Schedule</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📧</div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {stats.channelBreakdown.email.sent + stats.channelBreakdown.email.received}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {stats.channelBreakdown.whatsapp.sent + stats.channelBreakdown.whatsapp.received}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📷</div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Instagram</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {stats.channelBreakdown.instagram.sent + stats.channelBreakdown.instagram.received}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💭</div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">iMessage</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {stats.channelBreakdown.imessage.sent + stats.channelBreakdown.imessage.received}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {[
                    { id: 'inbox', name: 'Inbox', icon: '📥' },
                    { id: 'sent', name: 'Sent', icon: '📤' },
                    { id: 'templates', name: 'Templates', icon: '📝' },
                    { id: 'followups', name: 'Follow-ups', icon: '⏰' },
                    { id: 'analytics', name: 'Analytics', icon: '📊' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setState(prev => ({ ...prev, activeTab: tab.id as any }))}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        state.activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
              {state.activeTab === 'inbox' && renderInbox()}
              {state.activeTab === 'sent' && renderInbox()}
              {state.activeTab === 'templates' && renderTemplates()}
              {state.activeTab === 'followups' && renderFollowUps()}
              {state.activeTab === 'analytics' && renderAnalytics()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunicationsPage;