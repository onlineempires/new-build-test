import { useState } from 'react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'monthly' | 'annual';
  onUpgradeSuccess?: () => void;
}

export default function PremiumUpgradeModal({ 
  isOpen, 
  onClose, 
  currentPlan = 'free',
  onUpgradeSuccess 
}: PremiumUpgradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const getPricingInfo = () => {
    if (currentPlan === 'monthly') {
      return {
        oldPrice: '$99/month',
        newPrice: '$799/year',
        savings: 'Save $388/year',
        upgrade: 'Upgrade from Monthly to Annual'
      };
    }
    return {
      oldPrice: 'Free Plan',
      newPrice: '$799/year',
      savings: 'Unlimited Access',
      upgrade: 'Upgrade to Premium Annual'
    };
  };

  const pricing = getPricingInfo();

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      if (onUpgradeSuccess) onUpgradeSuccess();
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Premium!</h3>
          <p className="text-gray-600 mb-4">Your account has been upgraded successfully</p>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              🎉 You now have unlimited access to all courses and exclusive annual member benefits!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl max-w-lg w-full text-white relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Limited Time Badge */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-sm px-6 py-2 rounded-full inline-block mx-6 mt-6">
          <i className="fas fa-crown mr-2"></i>LIMITED TIME
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6">
          <h2 className="text-3xl font-bold mt-4 mb-2">Upgrade to Premium</h2>
          <p className="text-purple-100 text-lg mb-6">Get unlimited access to all courses</p>

          {/* Pricing */}
          <div className="text-center mb-6">
            {currentPlan === 'monthly' && (
              <div className="text-purple-200 text-lg mb-2">
                <span className="line-through">{pricing.oldPrice}</span>
              </div>
            )}
            <div className="text-5xl font-bold mb-2">$799<span className="text-2xl">/year</span></div>
            <div className="text-yellow-300 font-semibold">{pricing.savings}</div>
          </div>

          {/* Benefits */}
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3 text-lg">🎯 Premium Annual Benefits:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                <span>Unlimited access to all 18+ courses</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                <span>Priority support & feedback</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                <span>Exclusive annual members-only calls</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                <span>Early access to new courses</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                <span>Advanced worksheets & templates</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-300 mr-2"></i>
                <span>Premium community access</span>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full bg-white text-purple-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-crown mr-2"></i>
                {pricing.upgrade}
              </span>
            )}
          </button>

          {/* Terms */}
          <div className="text-xs text-purple-200 text-center">
            <p className="mb-1">
              <i className="fas fa-info-circle mr-1"></i>
              All purchases are final - no refunds policy applies
            </p>
            <p>
              Secure payment processing • Instant account upgrade • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}