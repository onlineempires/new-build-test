import { useState, useEffect } from 'react';
import { useUserRole, UserRole, ROLE_DETAILS } from '../../contexts/UserRoleContext';
import PaymentModal from '../payments/PaymentModal';

interface RoleUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UserRole;
  onUpgradeSuccess?: () => void;
}

export default function RoleUpgradeModal({ 
  isOpen, 
  onClose, 
  currentPlan,
  onUpgradeSuccess 
}: RoleUpgradeModalProps) {
  const { setUserRole, getRoleHierarchyLevel } = useUserRole();
  const [selectedPlan, setSelectedPlan] = useState<UserRole>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [affiliateId, setAffiliateId] = useState<string | null>(null);

  // Check for affiliate tracking on component mount
  useEffect(() => {
    if (isOpen) {
      // Check for affiliate ID in URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const affiliateFromUrl = urlParams.get('ref') || urlParams.get('affiliate');
      const affiliateFromStorage = localStorage.getItem('affiliateReferrer');
      
      if (affiliateFromUrl) {
        setAffiliateId(affiliateFromUrl);
        // Store affiliate ID for future purchases
        localStorage.setItem('affiliateReferrer', affiliateFromUrl);
      } else if (affiliateFromStorage) {
        setAffiliateId(affiliateFromStorage);
      }
    }
  }, [isOpen]);

  if (!isOpen && !showPaymentModal) return null;

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (purchaseData: any) => {
    // Upgrade user role after successful payment
    setUserRole(selectedPlan);
    
    // Close modals
    setShowPaymentModal(false);
    onClose();
    
    if (onUpgradeSuccess) {
      onUpgradeSuccess();
    }
  };

  // Get available upgrade options based on current plan
  const getUpgradeOptions = (): UserRole[] => {
    const currentLevel = getRoleHierarchyLevel(currentPlan);
    const availableRoles: UserRole[] = [];

    if (currentLevel < getRoleHierarchyLevel('monthly')) {
      availableRoles.push('monthly');
    }
    if (currentLevel < getRoleHierarchyLevel('annual')) {
      availableRoles.push('annual');
    }
    // Removed downsell option - will be handled separately for cancellation/dunning flows

    return availableRoles;
  };

  const upgradeOptions = getUpgradeOptions();

  // Show payment modal if triggered
  if (showPaymentModal) {
    return (
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          // Don't close the upgrade modal, let user go back to plan selection
        }}
        selectedPlan={selectedPlan}
        currentPlan={currentPlan}
        onPaymentSuccess={handlePaymentSuccess}
        affiliateId={affiliateId}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block mb-3 sm:mb-4">
            <i className="fas fa-crown mr-1 sm:mr-2"></i>UPGRADE YOUR ACCESS
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-purple-100 text-sm sm:text-base lg:text-lg">Unlock more features and grow your business</p>
        </div>

        {/* Plan Options */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid gap-3 sm:gap-4">
            {upgradeOptions.map((role) => {
              const details = ROLE_DETAILS[role];
              return (
                <div
                  key={role}
                  onClick={() => setSelectedPlan(role)}
                  className={`cursor-pointer rounded-xl p-3 sm:p-4 border-2 transition-all ${
                    selectedPlan === role
                      ? 'border-white bg-white/10'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="text-lg sm:text-xl font-bold">{details.name}</h3>
                    <div className="text-left sm:text-right">
                      <div className="text-xl sm:text-2xl font-bold">
                        ${details.price}
                        {details.billing !== 'one-time' && (
                          <span className="text-sm sm:text-base font-normal">/{details.billing}</span>
                        )}
                      </div>
                      {role === 'annual' && (
                        <div className="text-xs sm:text-sm text-yellow-300">Save $388/year!</div>
                      )}
                    </div>
                  </div>
                  <p className="text-purple-100 mb-3 text-sm sm:text-base">{details.description}</p>
                  <div className="space-y-1">
                    {details.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs sm:text-sm">
                        <i className="fas fa-check text-green-300 mr-2 text-xs"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {details.features.length > 3 && (
                      <div className="text-xs sm:text-sm text-purple-200">
                        +{details.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Proceed to Payment Button */}
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-white text-purple-700 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-50 transition-colors mt-4 sm:mt-6"
          >
            <span className="flex items-center justify-center">
              <i className="fas fa-credit-card mr-2"></i>
              <span className="hidden sm:inline">Proceed to Payment - </span>
              ${ROLE_DETAILS[selectedPlan].price}
            </span>
          </button>

          {/* Terms & Affiliate Info */}
          <div className="text-xs text-purple-200 text-center mt-3 sm:mt-4 px-2">
            {affiliateId && (
              <p className="mb-2 bg-white/10 rounded-lg py-2 px-3">
                <i className="fas fa-users mr-1"></i>
                Referred by Member #{affiliateId} • 30% commission credited
              </p>
            )}
            <p className="mb-1">
              <i className="fas fa-info-circle mr-1"></i>
              All purchases are final - no refunds policy applies
            </p>
            <p>
              Secure payment processing • Account upgraded after payment confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}