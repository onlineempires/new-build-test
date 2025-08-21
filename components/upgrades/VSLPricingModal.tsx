import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface VSLPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planType: 'one-time' | 'weekly') => void;
}

export default function VSLPricingModal({ 
  isOpen, 
  onClose, 
  onSelectPlan 
}: VSLPricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'one-time' | 'weekly' | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (planType: 'one-time' | 'weekly') => {
    setSelectedPlan(planType);
    if (onSelectPlan) {
      onSelectPlan(planType);
    }
  };

  const features = [
    'All courses',
    'Affiliate portal', 
    'Statistics'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-br from-[#6D28D9] to-[#2563EB] text-white rounded-3xl p-6 md:p-8 max-w-xl w-[92vw] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
            👑 Upgrade Your Access
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-white/90 text-lg">Unlock more features and grow your business</p>
        </div>

        {/* Plan Cards */}
        <div className="space-y-4 mb-6">
          {/* Pay in Full Plan */}
          <div 
            className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              selectedPlan === 'one-time' 
                ? 'border-white/50 bg-white/20' 
                : 'border-white/20 hover:border-white/30 hover:bg-white/15'
            }`}
            onClick={() => setSelectedPlan('one-time')}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">One-time purchase</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">$499</span>
                </div>
                <p className="text-white/80 text-sm mt-1">Best value</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'one-time' ? 'border-white bg-white' : 'border-white/40'
              }`}>
                {selectedPlan === 'one-time' && (
                  <div className="w-2 h-2 bg-[#6D28D9] rounded-full" />
                )}
              </div>
            </div>
            
            <ul className="space-y-2 mb-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('one-time')}
              className="w-full bg-white text-[#6D28D9] font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Continue – $499
            </button>
          </div>

          {/* Pay Weekly Plan */}
          <div 
            className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              selectedPlan === 'weekly' 
                ? 'border-white/50 bg-white/20' 
                : 'border-white/20 hover:border-white/30 hover:bg-white/15'
            }`}
            onClick={() => setSelectedPlan('weekly')}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Weekly plan</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">$24.75</span>
                  <span className="text-white/80">/ week</span>
                </div>
                <p className="text-white/80 text-sm mt-1">then billed monthly</p>
                <p className="text-white/80 text-sm">Cancel anytime</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'weekly' ? 'border-white bg-white' : 'border-white/40'
              }`}>
                {selectedPlan === 'weekly' && (
                  <div className="w-2 h-2 bg-[#6D28D9] rounded-full" />
                )}
              </div>
            </div>
            
            <ul className="space-y-2 mb-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('weekly')}
              className="w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              Continue – $24.75/week
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/80 text-sm">
            Secure checkout. Taxes may apply.
          </p>
        </div>
      </div>
    </div>
  );
}