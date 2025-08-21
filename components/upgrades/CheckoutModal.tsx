import { useState, useEffect } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'monthly' | 'annual';
  onUpgradeSuccess?: () => void;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  email: string;
  couponCode: string;
  saveCard: boolean;
}

type PaymentMethod = 'apple-pay' | 'google-pay' | 'card';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  currentPlan = 'free',
  onUpgradeSuccess 
}: CheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'one-time' | 'weekly'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [showCoupon, setShowCoupon] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    email: '',
    couponCode: '',
    saveCard: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  // Check if Apple Pay is available
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedPlan('one-time');
      setError('');
      setIsProcessing(false);
      setShowCoupon(false);
      setPaymentInfo({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        email: '',
        couponCode: '',
        saveCard: false
      });

      // Check for Apple Pay availability
      if (typeof window !== 'undefined' && window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
        setIsApplePayAvailable(true);
        setPaymentMethod('apple-pay');
      } else if (typeof window !== 'undefined' && window.google && window.google.payments) {
        setIsGooglePayAvailable(true);
        setPaymentMethod('google-pay');
      } else {
        setPaymentMethod('card');
      }

      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  const planDetails = {
    'one-time': {
      label: 'One-time purchase',
      price: '$499',
      tag: 'Best value',
      sku: 'SKU_PAY_IN_FULL'
    },
    'weekly': {
      label: 'Weekly plan',
      price: '$24.75',
      subtitle: '/ week',
      subline: 'billed monthly',
      sku: 'SKU_WEEKLY_BILLED_MONTHLY'
    }
  };

  const commonFeatures = [
    'All courses',
    'Affiliate portal',
    'Statistics'
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const isFormValid = () => {
    if (paymentMethod === 'apple-pay' || paymentMethod === 'google-pay') {
      return true;
    }
    
    return paymentInfo.cardNumber.replace(/\s/g, '').length >= 13 &&
           paymentInfo.expiryDate.length === 5 &&
           paymentInfo.cvv.length >= 3 &&
           paymentInfo.nameOnCard.trim().length > 0 &&
           paymentInfo.email.includes('@');
  };

  const handlePayment = async () => {
    setError('');
    setIsProcessing(true);

    try {
      if (paymentMethod === 'apple-pay') {
        // Handle Apple Pay
        const paymentRequest = {
          countryCode: 'US',
          currencyCode: 'USD',
          total: {
            label: planDetails[selectedPlan].label,
            amount: selectedPlan === 'one-time' ? '499.00' : '24.75'
          }
        };
        
        const session = new window.ApplePaySession!(3, paymentRequest);
        session.begin();
        // Apple Pay success would be handled in session callbacks
        
        // Simulate success for demo
        setTimeout(() => {
          setIsProcessing(false);
          onClose();
          if (onUpgradeSuccess) onUpgradeSuccess();
        }, 2000);
        
      } else if (paymentMethod === 'google-pay') {
        // Handle Google Pay
        // Simulate Google Pay flow
        setTimeout(() => {
          setIsProcessing(false);
          onClose();
          if (onUpgradeSuccess) onUpgradeSuccess();
        }, 2000);
        
      } else {
        // Handle card payment
        const paymentData = {
          sku: planDetails[selectedPlan].sku,
          plan: selectedPlan,
          paymentInfo: paymentInfo,
          couponCode: paymentInfo.couponCode
        };

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate success
        setIsProcessing(false);
        onClose();
        if (onUpgradeSuccess) onUpgradeSuccess();
      }
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (selectedPlan === 'one-time') return 'Pay $499';
    return 'Start $24.75/week';
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[1050] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-[92vw] max-w-[720px] rounded-3xl p-6 md:p-8 shadow-2xl z-[1060] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            👑 Upgrade Your Access
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
          <p className="text-gray-600">Unlock more features and grow your business</p>
        </div>

        {/* Plan Selector */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {(Object.keys(planDetails) as Array<keyof typeof planDetails>).map((planKey) => {
            const plan = planDetails[planKey];
            const isSelected = selectedPlan === planKey;
            
            return (
              <div
                key={planKey}
                className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(planKey)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{plan.label}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                      {(plan as any).subtitle && <span className="text-gray-600">{(plan as any).subtitle}</span>}
                    </div>
                    {(plan as any).subline && <p className="text-sm text-gray-600 mt-1">{(plan as any).subline}</p>}
                    {(plan as any).tag && <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mt-2">{(plan as any).tag}</span>}
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                <ul className="space-y-2">
                  {commonFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            {isApplePayAvailable && (
              <button
                onClick={() => setPaymentMethod('apple-pay')}
                className={`flex-1 h-11 rounded-xl border-2 flex items-center justify-center font-medium transition-colors ${
                  paymentMethod === 'apple-pay'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                 Pay
              </button>
            )}
            
            {isGooglePayAvailable && (
              <button
                onClick={() => setPaymentMethod('google-pay')}
                className={`flex-1 h-11 rounded-xl border-2 flex items-center justify-center font-medium transition-colors ${
                  paymentMethod === 'google-pay'
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                G Pay
              </button>
            )}
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 h-11 rounded-xl border-2 flex items-center justify-center font-medium transition-colors ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </button>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Card number"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={4}
                  />
                </div>
              </div>
              
              <input
                type="text"
                placeholder="Name on card"
                value={paymentInfo.nameOnCard}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                type="email"
                placeholder="Email address"
                value={paymentInfo.email}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  {showCoupon ? 'Hide coupon' : 'Have a coupon?'}
                </button>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentInfo.saveCard}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, saveCard: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Save card</span>
                </label>
              </div>

              {showCoupon && (
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={paymentInfo.couponCode}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, couponCode: e.target.value }))}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{planDetails[selectedPlan].label}</span>
            <span className="font-bold text-gray-900">
              {selectedPlan === 'one-time' ? '$499' : '$24.75 per week billed monthly'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handlePayment}
          disabled={!isFormValid() || isProcessing}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors flex items-center justify-center"
        >
          {isProcessing && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          )}
          <Lock className="w-4 h-4 mr-2" />
          {getButtonText()}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Secure checkout. Taxes may apply.
        </p>
      </div>
    </div>
  );
}