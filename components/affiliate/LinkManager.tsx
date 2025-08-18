import React, { useState } from 'react';
import { 
  Link as LinkIcon,
  Copy,
  QrCode,
  ExternalLink,
  Plus,
  BarChart3,
  Settings,
  Check,
  Eye,
  MousePointer,
  Zap,
  Share
} from 'lucide-react';

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  type: 'primary' | 'custom' | 'utm';
  clicks: number;
  conversions: number;
  conversionRate: number;
  createdAt: string;
  isActive: boolean;
}

interface LinkManagerProps {
  funnelId: string;
  links: AffiliateLink[];
  onCreateLink?: (linkData: Partial<AffiliateLink>) => void;
  onToggleLink?: (linkId: string) => void;
  onDeleteLink?: (linkId: string) => void;
  loading?: boolean;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  funnelId,
  links,
  onCreateLink,
  onToggleLink,
  onDeleteLink,
  loading = false
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({
    name: '',
    type: 'custom' as const,
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  });

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const generateQrCode = (url: string) => {
    // In production, you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const handleCreateLink = () => {
    const linkData: Partial<AffiliateLink> = {
      name: newLink.name || 'Custom Link',
      type: newLink.type,
      url: `https://example.com/funnel/${funnelId}?ref=custom${newLink.utmSource ? `&utm_source=${newLink.utmSource}` : ''}${newLink.utmMedium ? `&utm_medium=${newLink.utmMedium}` : ''}${newLink.utmCampaign ? `&utm_campaign=${newLink.utmCampaign}` : ''}`,
      shortUrl: `https://short.ly/${Math.random().toString(36).substring(7)}`,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    onCreateLink?.(linkData);
    setNewLink({
      name: '',
      type: 'custom',
      utmSource: '',
      utmMedium: '',
      utmCampaign: ''
    });
    setShowCreateForm(false);
  };

  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-100 text-blue-800';
      case 'custom':
        return 'bg-green-100 text-green-800';
      case 'utm':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLinkTypeIcon = (type: string) => {
    switch (type) {
      case 'primary':
        return <Zap className="w-4 h-4" />;
      case 'custom':
        return <Settings className="w-4 h-4" />;
      case 'utm':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Affiliate Links</h3>
          <p className="text-sm text-gray-500">
            Manage and track your affiliate marketing links
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Link
        </button>
      </div>

      {/* Create Link Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Name
              </label>
              <input
                type="text"
                placeholder="e.g., Social Media Campaign"
                value={newLink.name}
                onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Type
              </label>
              <select
                value={newLink.type}
                onChange={(e) => setNewLink(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="custom">Custom Link</option>
                <option value="utm">UTM Tracking</option>
              </select>
            </div>
          </div>

          {newLink.type === 'utm' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UTM Source
                </label>
                <input
                  type="text"
                  placeholder="facebook"
                  value={newLink.utmSource}
                  onChange={(e) => setNewLink(prev => ({ ...prev, utmSource: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UTM Medium
                </label>
                <input
                  type="text"
                  placeholder="social"
                  value={newLink.utmMedium}
                  onChange={(e) => setNewLink(prev => ({ ...prev, utmMedium: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UTM Campaign
                </label>
                <input
                  type="text"
                  placeholder="launch-week"
                  value={newLink.utmCampaign}
                  onChange={(e) => setNewLink(prev => ({ ...prev, utmCampaign: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Link
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  {getLinkTypeIcon(link.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{link.name}</h4>
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${getLinkTypeColor(link.type)}
                    `}>
                      {link.type.toUpperCase()}
                    </span>
                    {!link.isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm text-gray-700 truncate">
                  {link.shortUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(link.shortUrl, link.id)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy short URL"
                >
                  {copiedLinkId === link.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <code className="flex-1 text-xs text-gray-500 truncate">
                  {link.url}
                </code>
                <button
                  onClick={() => copyToClipboard(link.url, `${link.id}-full`)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy full URL"
                >
                  {copiedLinkId === `${link.id}-full` ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {link.clicks.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 flex items-center justify-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Clicks
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {link.conversions.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 flex items-center justify-center">
                  <MousePointer className="w-3 h-3 mr-1" />
                  Conversions
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${
                  link.conversionRate >= 5 ? 'text-green-600' : 
                  link.conversionRate >= 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {link.conversionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Rate</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQrCode(showQrCode === link.id ? null : link.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Generate QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <button
                  onClick={() => {/* Open link analytics */}}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View analytics"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {onToggleLink && (
                  <button
                    onClick={() => onToggleLink(link.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      link.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {link.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            </div>

            {/* QR Code Modal */}
            {showQrCode === link.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                  <h5 className="font-medium text-gray-900 mb-3">QR Code for {link.name}</h5>
                  <img
                    src={generateQrCode(link.shortUrl)}
                    alt="QR Code"
                    className="mx-auto mb-3 border border-gray-300 rounded"
                  />
                  <p className="text-xs text-gray-500">
                    Scan to open: {link.shortUrl}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {links.length === 0 && !showCreateForm && (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">No affiliate links yet</h4>
            <p className="text-sm text-gray-500 mb-4">
              Create your first affiliate link to start tracking performance
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkManager;