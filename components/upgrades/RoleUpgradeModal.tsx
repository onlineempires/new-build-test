import { useState } from 'react';
import { useUserRole, UserRole, ROLE_DETAILS } from '../../contexts/UserRoleContext';

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
  const { upgradeToRole, getRoleHierarchyLevel } = useUserRole();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<UserRole>('monthly');

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    const success = await upgradeToRole(selectedPlan);
    
    if (success) {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        if (onUpgradeSuccess) onUpgradeSuccess();
      }, 3000);
    } else {
      setIsProcessing(false);
      // Handle error
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

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Upgrade Successful!</h3>
          <p className="text-gray-600 mb-4">
            Welcome to {ROLE_DETAILS[selectedPlan].name}!
          </p>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              🎉 You now have access to all {ROLE_DETAILS[selectedPlan].name} features!
            </p>
          </div>
        </div>
      </div>
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

          {/* Upgrade Button */}
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full bg-white text-purple-700 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-crown mr-2"></i>
                <span className="hidden sm:inline">Upgrade to {ROLE_DETAILS[selectedPlan].name} - </span>
                ${ROLE_DETAILS[selectedPlan].price}
              </span>
            )}
          </button>

          {/* Terms */}
          <div className="text-xs text-purple-200 text-center mt-3 sm:mt-4 px-2">
            <p className="mb-1">
              <i className="fas fa-info-circle mr-1"></i>
              All purchases are final - no refunds policy applies
            </p>
            <p>
              Secure payment processing • Instant account upgrade
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}