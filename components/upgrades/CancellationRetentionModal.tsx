import { useState } from 'react';
import { useUserRole, UserRole, ROLE_DETAILS } from '../../contexts/UserRoleContext';

interface CancellationRetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UserRole;
  onRetentionSuccess?: () => void;
}

/**
 * Cancellation Retention Modal - Shows downsell offer during cancellation flow
 * This modal is specifically for dunning/cancellation scenarios where we offer
 * the $37 Affiliate Access as a retention strategy
 */
export default function CancellationRetentionModal({ 
  isOpen, 
  onClose, 
  currentPlan,
  onRetentionSuccess 
}: CancellationRetentionModalProps) {
  const { setUserRole } = useUserRole();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDowngradeToAffiliate = async () => {
    setIsProcessing(true);
    
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 1000));
    const success = true;
    setUserRole('downsell');
    
    if (success) {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        if (onRetentionSuccess) onRetentionSuccess();
      }, 3000);
    } else {
      setIsProcessing(false);
      // Handle error
    }
  };

  const downsellDetails = ROLE_DETAILS.downsell;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Affiliate Access!</h3>
          <p className="text-gray-600 mb-4">
            You've successfully downgraded to our {downsellDetails.name} plan.
          </p>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">
              🎉 You still have access to affiliate opportunities and intro courses!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-800 font-bold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block mb-3 sm:mb-4">
            <i className="fas fa-exclamation-triangle mr-1 sm:mr-2"></i>WAIT! BEFORE YOU GO...
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Don't Lose Everything!</h2>
          <p className="text-red-100 text-sm sm:text-base lg:text-lg">Keep earning with our special retention offer</p>
        </div>

        {/* Retention Offer */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 border-2 border-white/20 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
              <h3 className="text-lg sm:text-xl font-bold">{downsellDetails.name}</h3>
              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">
                  ${downsellDetails.price}
                  <span className="text-sm sm:text-base font-normal"> one-time</span>
                </div>
                <div className="text-xs sm:text-sm text-yellow-300">90% off your current plan!</div>
              </div>
            </div>
            <p className="text-red-100 mb-3 text-sm sm:text-base">{downsellDetails.description}</p>
            <div className="space-y-1">
              {downsellDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center text-xs sm:text-sm">
                  <i className="fas fa-check text-green-300 mr-2 text-xs"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDowngradeToAffiliate}
              disabled={isProcessing}
              className="w-full bg-white text-red-700 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="fas fa-hand-holding-usd mr-2"></i>
                  Keep Affiliate Access - Only ${downsellDetails.price}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full bg-transparent border-2 border-white/30 text-white py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base hover:bg-white/10 transition-colors"
            >
              No Thanks, Continue Cancelling
            </button>
          </div>

          {/* Warning Message */}
          <div className="text-xs text-red-200 text-center mt-3 sm:mt-4 px-2">
            <p className="mb-1">
              <i className="fas fa-warning mr-1"></i>
              If you cancel now, you'll lose all access immediately
            </p>
            <p>
              This one-time offer won't be available again
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}