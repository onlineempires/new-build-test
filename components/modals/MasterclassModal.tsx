import { useState, useRef, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNotificationHelpers } from '../../hooks/useNotificationHelpers';

interface MasterclassModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterclass: {
    id: string;
    title: string;
    description: string;
    price: number;
    lessonCount: number;
  };
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

export default function MasterclassModal({ isOpen, onClose, masterclass, onSuccess }: MasterclassModalProps) {
  const { addPurchasedMasterclass } = useUser();
  const { showSuccess } = useNotificationHelpers();
  const modalRef = useRef<HTMLDivElement>(null);
  
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
        // Add masterclass to user's purchases
        addPurchasedMasterclass(masterclass.id);
        
        showSuccess(
          `${masterclass.title} Purchased! 🎉`,
          `You now have access to "${masterclass.title}". Start learning right away!`,
          'Start Masterclass',
          `/courses/${masterclass.id}`
        );
        
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{masterclass.title}</h2>
              <p className="text-orange-100 text-sm">${masterclass.price} • {masterclass.lessonCount} lessons</p>
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
          {/* Masterclass Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <i className="fas fa-crown text-white text-lg"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{masterclass.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{masterclass.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span><i className="fas fa-play-circle mr-1"></i>{masterclass.lessonCount} lessons</span>
                  <span><i className="fas fa-clock mr-1"></i>{Math.round(masterclass.lessonCount * 0.5)}h content</span>
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
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <i className="fas fa-credit-card text-lg text-orange-600"></i>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
            }`}
          >
            {isProcessing && <i className="fas fa-spinner fa-spin mr-2"></i>}
            {isProcessing ? 'Processing...' : `Pay $${masterclass.price}`}
          </button>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500">
            <i className="fas fa-shield-alt mr-1"></i>
            Secure payment • Instant access • 30-day money-back guarantee
          </div>
        </form>
      </div>
    </div>
  );
}