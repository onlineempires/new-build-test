import { useState, useEffect } from 'react';

interface IndividualCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
    lessonCount: number;
    description: string;
    thumbnail?: string;
  };
  onPurchaseSuccess?: (courseId: string) => void;
}

export default function IndividualCourseModal({ 
  isOpen, 
  onClose, 
  course,
  onPurchaseSuccess 
}: IndividualCourseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingZip: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!paymentData.email || !/\S+@\S+\.\S+/.test(paymentData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      errors.expiryDate = 'Please enter MM/YY format';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      errors.cvv = 'Please enter a valid CVV';
    }
    
    if (!paymentData.cardName.trim()) {
      errors.cardName = 'Please enter the name on card';
    }
    
    if (!paymentData.billingZip.trim()) {
      errors.billingZip = 'Please enter your billing ZIP code';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePurchase = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get referrer information (in real app, this would come from URL params or user session)
    const referrerId = localStorage.getItem('referrerId') || 'direct';
    
    // Store purchase in localStorage (for demo purposes)
    const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
    const purchaseId = `purchase_${Date.now()}`;
    const affiliateCommission = course.price * 0.25; // 25% commission
    
    const purchaseRecord = {
      courseId: course.id,
      purchaseId,
      purchaseDate: new Date().toISOString(),
      price: course.price,
      affiliateCommission,
      referrerId,
      customerEmail: paymentData.email,
      paymentMethod: `****${paymentData.cardNumber.slice(-4)}`,
      status: 'completed'
    };
    
    purchases.push(purchaseRecord);
    localStorage.setItem('purchasedCourses', JSON.stringify(purchases));
    
    // Track affiliate commission (in real app, this would go to your backend)
    if (referrerId !== 'direct') {
      const commissions = JSON.parse(localStorage.getItem('affiliateCommissions') || '[]');
      commissions.push({
        affiliateId: referrerId,
        courseId: course.id,
        commissionAmount: affiliateCommission,
        purchaseId,
        date: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('affiliateCommissions', JSON.stringify(commissions));
    }
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      setShowSuccess(false);
      setShowPaymentForm(false);
      onClose();
      if (onPurchaseSuccess) onPurchaseSuccess(course.id);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Course Unlocked!</h3>
          <p className="text-gray-600 mb-4">You now have access to "{course.title}"</p>
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-800 font-medium">
                🎉 Start learning immediately - all {course.lessonCount} lessons are now available!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-3xl max-w-[720px] w-[92vw] p-6 md:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${course.price}
          </div>
          <div className="text-gray-500 text-sm">One-time payment • Lifetime access</div>
        </div>

        {/* Value Points */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>{course.lessonCount} premium lessons</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Downloadable resources</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Lifetime access</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        {!showPaymentForm ? (
          <div className="space-y-4">
            {/* Quick Payment Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  // In real app, integrate with Apple Pay
                  handlePurchase();
                }}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <i className="fab fa-apple mr-2"></i>
                Pay with Apple Pay
              </button>
              
              <button
                onClick={() => {
                  // In real app, integrate with Google Pay
                  handlePurchase();
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <i className="fab fa-google mr-2"></i>
                Pay with Google Pay
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or pay with card</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-medium text-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-credit-card mr-2"></i>
              Pay with Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-center mb-4">Payment Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="md:col-span-2">
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Email address"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              {/* Card Number */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.cardNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Card number"
                  maxLength={19}
                />
                {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
              </div>

              {/* Expiry and CVV */}
              <div>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.expiryDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
              </div>
              <div>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.cvv ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="CVV"
                  maxLength={4}
                />
                {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
              </div>

              {/* Name on Card */}
              <div>
                <input
                  type="text"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.cardName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Name on card"
                />
                {formErrors.cardName && <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>}
              </div>

              {/* Billing ZIP */}
              <div>
                <input
                  type="text"
                  value={paymentData.billingZip}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, billingZip: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.billingZip ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ZIP code"
                />
                {formErrors.billingZip && <p className="text-red-500 text-xs mt-1">{formErrors.billingZip}</p>}
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="flex-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Pay ${course.price}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="text-xs text-gray-500 text-center mt-4">
          <p className="mb-1">
            <i className="fas fa-shield-alt mr-1"></i>
            Secure payment • 30-day money-back guarantee
          </p>
          <p>
            Instant access • All sales are final after course completion
          </p>
        </div>
      </div>
    </div>
  );
}