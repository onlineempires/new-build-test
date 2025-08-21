import { useState } from 'react';
import { X } from 'lucide-react';
import AnnualMembershipModal from './AnnualMembershipModal';
import SkillsPlanModal from './SkillsPlanModal';

export type UpgradeContext = 
  | 'premium' 
  | 'skills' 
  | 'enagic'
  | 'vsl'
  | 'improve-skills'
  | 'skills-access'
  | 'unknown';

interface UpgradeRouterProps {
  isOpen: boolean;
  onClose: () => void;
  context: UpgradeContext;
  currentPlan?: 'free' | 'monthly' | 'annual';
  onUpgradeSuccess?: () => void;
}

export default function UpgradeRouter({
  isOpen,
  onClose,
  context,
  currentPlan = 'free',
  onUpgradeSuccess
}: UpgradeRouterProps) {
  const [selectedProduct, setSelectedProduct] = useState<'annual' | 'skills' | null>(null);
  const [showChooser, setShowChooser] = useState(false);

  // Determine which modal to show based on context
  const getModalType = (): 'annual' | 'skills' | 'chooser' => {
    switch (context) {
      case 'premium':
      case 'enagic':
        return 'annual';
      
      case 'skills':
      case 'vsl':
      case 'improve-skills':
      case 'skills-access':
        return 'skills';
      
      case 'unknown':
      default:
        return 'chooser';
    }
  };

  const modalType = selectedProduct ? selectedProduct : getModalType();

  // Handle product selection from chooser
  const handleProductSelect = (product: 'annual' | 'skills') => {
    setSelectedProduct(product);
    setShowChooser(false);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setShowChooser(false);
    onClose();
  };

  const handleUpgradeSuccessLocal = () => {
    setSelectedProduct(null);
    setShowChooser(false);
    if (onUpgradeSuccess) onUpgradeSuccess();
  };

  // Show chooser modal if context is unknown
  if (modalType === 'chooser' && !selectedProduct) {
    return isOpen ? (
      <div className="fixed inset-0 bg-black/60 z-[1050] flex items-center justify-center p-4">
        <div 
          className="fixed inset-0"
          onClick={handleClose}
        />
        
        <div className="relative bg-white w-[92vw] max-w-[480px] rounded-3xl p-6 md:p-8 shadow-2xl z-[1060]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">What are you looking for?</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            <button
              onClick={() => handleProductSelect('annual')}
              className="w-full p-6 text-left border-2 border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Annual Membership</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">$799 / year</p>
              <p className="text-sm text-gray-600">Full access to courses, masterclasses, and exclusive benefits</p>
            </button>

            <button
              onClick={() => handleProductSelect('skills')}
              className="w-full p-6 text-left border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills Access</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">$499 for 6 months or $99 / month</p>
              <p className="text-sm text-gray-600">Access to course catalog only</p>
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Show appropriate modal based on selection or context
  if (modalType === 'annual') {
    return (
      <AnnualMembershipModal
        isOpen={isOpen}
        onClose={handleClose}
        currentPlan={currentPlan}
        onUpgradeSuccess={handleUpgradeSuccessLocal}
      />
    );
  }

  if (modalType === 'skills') {
    return (
      <SkillsPlanModal
        isOpen={isOpen}
        onClose={handleClose}
        currentPlan={currentPlan}
        onUpgradeSuccess={handleUpgradeSuccessLocal}
      />
    );
  }

  return null;
}