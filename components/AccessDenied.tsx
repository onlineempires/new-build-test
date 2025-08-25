import AppLayout from './layout/AppLayout';
import { getTierDisplayName } from '../utils/accessControl';

interface AccessDeniedProps {
  requiredTier: string;
  currentTier?: string;
  upgradeMessage?: string;
}

export default function AccessDenied({ requiredTier, currentTier, upgradeMessage }: AccessDeniedProps) {
  const handleUpgrade = (tier: 'monthly' | 'annual') => {
    // In a real app, this would redirect to payment flow
    console.log(`Redirecting to ${tier} upgrade...`);
    // For now, just show alert
    alert(`${tier} upgrade flow would start here`);
  };

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold theme-text-primary mb-4">
            Access Restricted
          </h1>
          <p className="text-lg theme-text-secondary mb-6">
            {upgradeMessage || `This feature requires ${requiredTier} subscription or higher.`}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Current Plan:</span>
                <div className="font-semibold">{getTierDisplayName(currentTier)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Required:</span>
                <div className="font-semibold text-blue-600">{requiredTier}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleUpgrade('monthly')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade to Monthly ($99/month)
            </button>
            <button 
              onClick={() => handleUpgrade('annual')}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Upgrade to Annual ($799/year) - Save $389!
            </button>
            <button 
              onClick={handleBackToDashboard}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Need help? Contact support for assistance with your subscription.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}