import { useState } from 'react';
import { useAffiliate } from '../../contexts/AffiliateContext';

export default function AffiliateLinkGenerator() {
  const { affiliateId, getAffiliateLink } = useAffiliate();
  const [selectedPage, setSelectedPage] = useState('/');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!affiliateId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          <i className="fas fa-info-circle mr-2"></i>
          Affiliate features are available for Monthly and Annual members.
        </p>
      </div>
    );
  }

  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/courses', name: 'All Courses' },
    { path: '/experts', name: 'Expert Directory' },
    { path: '/dmo', name: 'Daily Method' }
  ];

  const affiliateLink = getAffiliateLink(selectedPage);

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <i className="fas fa-link text-blue-600"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Affiliate Link Generator</h3>
          <p className="text-sm text-gray-600">Generate trackable links to earn 30% commissions</p>
        </div>
      </div>

      {/* Affiliate ID Display */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Your Affiliate ID:</span>
          <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
            {affiliateId}
          </span>
        </div>
      </div>

      {/* Page Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose page to link to:
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {pages.map((page) => (
            <option key={page.path} value={page.path}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {/* Generated Link */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your affiliate link:
        </label>
        <div className="flex">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm font-mono"
          />
          <button
            onClick={() => copyToClipboard(affiliateLink)}
            className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg transition-colors ${
              copiedLink === affiliateLink
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {copiedLink === affiliateLink ? (
              <>
                <i className="fas fa-check mr-2"></i>
                Copied
              </>
            ) : (
              <>
                <i className="fas fa-copy mr-2"></i>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <i className="fas fa-dollar-sign text-white text-xs"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Commission Structure</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>30% recurring commission</strong> on all successful referrals</li>
              <li>• Monthly plan: ${99 * 0.30}/month per referral</li>
              <li>• Annual plan: ${799 * 0.30}/year per referral</li>
              <li>• Commissions tracked automatically and paid monthly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Share Options */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick share options:</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const text = `Check out this amazing online business course platform! ${affiliateLink}`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <i className="fab fa-twitter mr-2"></i>
            Twitter
          </button>
          <button
            onClick={() => {
              const text = `I've been learning so much from this platform! Check it out: ${affiliateLink}`;
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}&quote=${encodeURIComponent(text)}`, '_blank');
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <i className="fab fa-facebook-f mr-2"></i>
            Facebook
          </button>
          <button
            onClick={() => {
              const subject = 'Check out this amazing online course platform';
              const body = `Hi!\n\nI wanted to share this incredible online business course platform with you. They have amazing content that's really helped me grow my business.\n\nCheck it out here: ${affiliateLink}\n\nBest regards!`;
              window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
            }}
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <i className="fas fa-envelope mr-2"></i>
            Email
          </button>
        </div>
      </div>
    </div>
  );
}