import { useState } from 'react';

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
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
            {(() => {
              const referrerId = localStorage.getItem('referrerId');
              return referrerId && referrerId !== 'direct' ? (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">
                    💰 Your referrer will receive a ${(course.price * 0.25).toFixed(0)} commission for this purchase
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center mb-4">
            {course.thumbnail ? (
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-16 h-16 rounded-xl mr-4 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-play text-2xl"></i>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold mb-1">{course.title}</h2>
              <p className="text-blue-100 text-sm">{course.lessonCount} lessons</p>
            </div>
          </div>
          <p className="text-blue-100">{course.description}</p>
        </div>

        {/* Pricing Section */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${course.price}
            </div>
            <div className="text-gray-500 text-sm">One-time payment • Lifetime access</div>
          </div>

          {/* What You Get */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-900">🚀 What You Get:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Immediate access to all {course.lessonCount} lessons</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Downloadable worksheets and resources</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Progress tracking and certificates</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Lifetime access - learn at your own pace</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Mobile-friendly platform</span>
              </div>
            </div>
          </div>

          {/* Payment Form or Purchase Button */}
          {showPaymentForm ? (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.cardNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.expiryDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.cvv ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                </div>
              </div>

              {/* Name on Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.cardName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John Smith"
                />
                {formErrors.cardName && <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>}
              </div>

              {/* Billing ZIP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing ZIP Code</label>
                <input
                  type="text"
                  value={paymentData.billingZip}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, billingZip: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.billingZip ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="12345"
                />
                {formErrors.billingZip && <p className="text-red-500 text-xs mt-1">{formErrors.billingZip}</p>}
              </div>

              {/* Payment Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-credit-card mr-2"></i>
                      Pay ${course.price}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors mb-4"
            >
              <span className="flex items-center justify-center">
                <i className="fas fa-shopping-cart mr-2"></i>
                Purchase Course for ${course.price}
              </span>
            </button>
          )}

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center">
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
    </div>
  );
}