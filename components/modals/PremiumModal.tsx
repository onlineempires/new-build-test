import { useState, useRef, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNotificationHelpers } from '../../hooks/useNotificationHelpers';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
  email: string;
  zip: string;
}

export default function PremiumModal({ isOpen, onClose, onSuccess }: PremiumModalProps) {
  const { setUserRole } = useUser();
  const { notifyUpgrade } = useNotificationHelpers();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'google' | 'card'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    email: '',
    zip: ''
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment success
      const isSuccessful = Math.random() > 0.1; // 90% success rate for demo
      
      if (isSuccessful) {
        // Update user role based on selected plan
        if (selectedPlan === 'annual') {
          setUserRole(false, false, false, true); // Set as annual premium
          notifyUpgrade('Premium Annual');
        } else {
          setUserRole(false, false, true, false); // Set as monthly premium
          notifyUpgrade('Premium Monthly');
        }
        
        onSuccess?.();
        onClose();
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
  };

  const formatExpiry = (value: string, field: 'month' | 'year') => {
    const numbers = value.replace(/\D/g, '');
    if (field === 'month') {
      return numbers.substring(0, 2);
    }
    return numbers.substring(0, 2);
  };

  const getPrimaryButtonText = () => {
    if (isProcessing) return 'Processing...';
    return selectedPlan === 'annual' ? 'Pay $799' : 'Start $99 per month';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Upgrade to Premium</h2>
              <p className="text-purple-100 text-sm">Join 2,847+ entrepreneurs scaling their businesses</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plan Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Choose Your Plan</h3>
            
            {/* Annual Plan */}
            <div 
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'annual' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan('annual')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'annual' ? 'border-purple-500' : 'border-gray-300'
                  }`}>
                    {selectedPlan === 'annual' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">$799 per year</div>
                    <div className="text-sm text-gray-600">Save $388 vs monthly</div>
                  </div>
                </div>
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            </div>

            {/* Monthly Plan */}
            <div 
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-purple-500' : 'border-gray-300'
                }`}>
                  {selectedPlan === 'monthly' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">$99 per month</div>
                  <div className="text-sm text-gray-600">Cancel anytime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Payment Method</h3>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'apple' 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('apple')}
              >
                <i className="fab fa-apple text-lg"></i>
              </button>
              <button
                type="button"
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'google' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('google')}
              >
                <i className="fab fa-google-pay text-lg text-blue-600"></i>
              </button>
              <button
                type="button"
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'card' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <i className="fas fa-credit-card text-lg text-green-600"></i>
              </button>
            </div>
          </div>

          {/* Card Form - Only show if card payment selected */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MM
                  </label>
                  <input
                    type="text"
                    value={formData.expiryMonth}
                    onChange={(e) => handleInputChange('expiryMonth', formatExpiry(e.target.value, 'month'))}
                    placeholder="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YY
                  </label>
                  <input
                    type="text"
                    value={formData.expiryYear}
                    onChange={(e) => handleInputChange('expiryYear', formatExpiry(e.target.value, 'year'))}
                    placeholder="25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={formData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value.substring(0, 10))}
                    placeholder="12345"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isProcessing && <i className="fas fa-spinner fa-spin mr-2"></i>}
            {getPrimaryButtonText()}
          </button>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500">
            <i className="fas fa-shield-alt mr-1"></i>
            30-day money-back guarantee • Cancel anytime • No setup fees
          </div>
        </form>
      </div>
    </div>
  );
}