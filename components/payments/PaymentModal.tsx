import { useState } from 'react';
import { UserRole, ROLE_DETAILS } from '../../contexts/UserRoleContext';
import { useAffiliate } from '../../contexts/AffiliateContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: UserRole;
  currentPlan: UserRole;
  onPaymentSuccess?: (purchaseData: any) => void;
  affiliateId?: string; // Track referring affiliate
}

interface PaymentFormData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  selectedPlan,
  currentPlan,
  onPaymentSuccess,
  affiliateId 
}: PaymentModalProps) {
  const { trackCommission } = useAffiliate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US'
  });

  if (!isOpen) return null;

  const planDetails = ROLE_DETAILS[selectedPlan];
  const isAnnual = selectedPlan === 'annual';
  const monthlyEquivalent = isAnnual ? Math.round(planDetails.price / 12) : planDetails.price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    
    if (!formData.billingName.trim()) {
      setError('Please enter billing name');
      return false;
    }
    
    return true;
  };

  const processPayment = async (): Promise<boolean> => {
    // This would integrate with your actual payment processor
    // For now, simulate payment processing
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate affiliate commission (30% recurring)
      const affiliateCommission = affiliateId ? planDetails.price * 0.30 : 0;
      
      // Create purchase record
      const purchaseData = {
        purchaseId: `payment_${Date.now()}`,
        fromRole: currentPlan,
        toRole: selectedPlan,
        price: planDetails.price,
        billing: planDetails.billing,
        purchaseDate: new Date().toISOString(),
        customer: {
          email: formData.email,
          billingName: formData.billingName,
          billingAddress: {
            address: formData.billingAddress,
            city: formData.billingCity,
            state: formData.billingState,
            zip: formData.billingZip,
            country: formData.billingCountry
          }
        },
        payment: {
          method: 'card',
          last4: formData.cardNumber.slice(-4),
          status: 'completed'
        },
        affiliate: affiliateId ? {
          id: affiliateId,
          commission: affiliateCommission,
          rate: 0.30
        } : null
      };
      
      // Store purchase record
      const purchases = JSON.parse(localStorage.getItem('completedPurchases') || '[]');
      purchases.push(purchaseData);
      localStorage.setItem('completedPurchases', JSON.stringify(purchases));
      
      // Track affiliate commission using context
      if (affiliateId) {
        trackCommission(purchaseData);
      }
      
      if (onPaymentSuccess) {
        onPaymentSuccess(purchaseData);
      }
      
      return true;
    } catch (error) {
      console.error('Payment processing failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    const success = await processPayment();
    
    if (success) {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 4000);
    } else {
      setIsProcessing(false);
      setError('Payment processing failed. Please try again or contact support.');
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">
            Welcome to {planDetails.name}! Your account has been upgraded.
          </p>
          {affiliateId && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-users mr-1"></i>
                Affiliate credited with 30% commission
              </p>
            </div>
          )}
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              🎉 You now have access to all {planDetails.name} features!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          
          <h2 className="text-2xl font-bold mb-2">Complete Your Upgrade</h2>
          <p className="text-blue-100">Secure payment processing</p>
        </div>

        {/* Plan Summary */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{planDetails.name}</h3>
              <p className="text-gray-600 text-sm">{planDetails.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${planDetails.price}
                {planDetails.billing !== 'one-time' && (
                  <span className="text-base font-normal">/{planDetails.billing}</span>
                )}
              </div>
              {isAnnual && (
                <div className="text-sm text-green-600">
                  ${monthlyEquivalent}/month • Save $388/year
                </div>
              )}
            </div>
          </div>
          
          {affiliateId && (
            <div className="mt-3 bg-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <i className="fas fa-users mr-2"></i>
                <strong>Referred by:</strong> Member #{affiliateId} (30% commission will be credited)
              </p>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}
          
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Billing Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="billingName"
                  value={formData.billingName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="billingState"
                  value={formData.billingState}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="billingZip"
                  value={formData.billingZip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-credit-card mr-2"></i>
                Complete Payment - ${planDetails.price}
              </span>
            )}
          </button>

          {/* Security Notice */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              <i className="fas fa-lock mr-1"></i>
              Your payment information is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}