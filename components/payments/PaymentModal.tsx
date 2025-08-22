import { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { UserRole, ROLE_DETAILS } from '../../contexts/UserRoleContext';
import { useAffiliate } from '../../contexts/AffiliateContext';
import { useNotification } from '../../contexts/NotificationContext';
import { CreditCard, Lock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { clsx } from 'clsx';

// Initialize Stripe (in production, use environment variable)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: UserRole;
  currentPlan: UserRole;
  onPaymentSuccess?: (purchaseData: any) => void;
  affiliateId?: string;
  courseId?: string; // For course-specific purchases
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
  saveCard: boolean;
}

// Validation schema
const paymentSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  cardNumber: yup.string()
    .matches(/^[0-9\s]{13,19}$/, 'Invalid card number')
    .required('Card number is required'),
  expiryDate: yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY')
    .required('Expiry date is required'),
  cvv: yup.string()
    .matches(/^[0-9]{3,4}$/, 'Invalid CVV')
    .required('CVV is required'),
  billingName: yup.string().required('Billing name is required'),
  billingAddress: yup.string().required('Address is required'),
  billingCity: yup.string().required('City is required'),
  billingState: yup.string().required('State is required'),
  billingZip: yup.string()
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid ZIP code')
    .required('ZIP code is required'),
  billingCountry: yup.string().required('Country is required'),
  saveCard: yup.boolean(),
});

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  selectedPlan,
  currentPlan,
  onPaymentSuccess,
  affiliateId,
  courseId
}: PaymentModalProps) {
  const { trackCommission } = useAffiliate();
  const { showNotification } = useNotification();
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentIntentSecret, setPaymentIntentSecret] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingName: '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      billingCountry: 'US',
      saveCard: false,
    },
  });

  // Initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    initStripe();
  }, []);

  // Create payment intent when modal opens
  useEffect(() => {
    if (isOpen && selectedPlan !== 'free') {
      createPaymentIntent();
    }
  }, [isOpen, selectedPlan]);

  const createPaymentIntent = async () => {
    try {
      // In production, call your backend to create a payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          courseId,
          affiliateId,
        }),
      });

      if (response.ok) {
        const { clientSecret } = await response.json();
        setPaymentIntentSecret(clientSecret);
      }
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      // For now, use mock mode
      setPaymentIntentSecret('mock_secret');
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);

    try {
      // In production, use Stripe to confirm payment
      if (stripe && paymentIntentSecret && paymentIntentSecret !== 'mock_secret') {
        // Real Stripe payment processing would go here
        // const result = await stripe.confirmCardPayment(paymentIntentSecret, {
        //   payment_method: { ... }
        // });
      }

      // Mock successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      const planDetails = ROLE_DETAILS[selectedPlan];
      const amount = planDetails?.price || 0;
      const purchaseData = {
        purchaseId: `purchase_${Date.now()}`,
        plan: selectedPlan,
        courseId,
        amount,
        email: data.email,
        billingName: data.billingName,
        purchaseDate: new Date().toISOString(),
        affiliateId,
        commission: affiliateId ? amount * 0.25 : 0,
      };

      // Track affiliate commission if applicable
      if (affiliateId) {
        trackCommission(affiliateId, amount, 'subscription', selectedPlan);
      }

      // Store purchase in localStorage (mock)
      const purchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
      purchases.push(purchaseData);
      localStorage.setItem('userPurchases', JSON.stringify(purchases));

      // Log for audit
      console.log('[Payment] Successful payment:', purchaseData);

      setShowSuccess(true);
      showNotification('Payment successful! Your account has been upgraded.', 'success');

      // Call success callback
      if (onPaymentSuccess) {
        onPaymentSuccess(purchaseData);
      }

      // Close modal after delay
      setTimeout(() => {
        setShowSuccess(false);
        reset();
        onClose();
      }, 3000);

    } catch (error: any) {
      console.error('[Payment] Payment failed:', error);
      showNotification(error.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const planDetails = ROLE_DETAILS[selectedPlan];
  const price = planDetails?.price || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
              <p className="text-sm text-gray-600 mt-1">
                {courseId ? 'Complete your course purchase' : `Upgrade to ${planDetails?.title || selectedPlan}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your account has been upgraded successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {courseId ? 'Course Purchase' : planDetails?.title || selectedPlan}
                    </span>
                    <span className="font-semibold">${price}</span>
                  </div>
                  {affiliateId && (
                    <div className="text-sm text-gray-500">
                      Referred by affiliate: {affiliateId}
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">${price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className={clsx(
                          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        )}
                        placeholder="john@example.com"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <input
                          {...field}
                          type="text"
                          className={clsx(
                            'w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          )}
                          placeholder="1234 5678 9012 3456"
                          onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                  )}
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <Controller
                      name="expiryDate"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={clsx(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          )}
                          placeholder="MM/YY"
                          onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                          maxLength={5}
                        />
                      )}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Controller
                      name="cvv"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={clsx(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          )}
                          placeholder="123"
                          maxLength={4}
                        />
                      )}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>

                {/* Billing Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Name
                  </label>
                  <Controller
                    name="billingName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={clsx(
                          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                          errors.billingName ? 'border-red-500' : 'border-gray-300'
                        )}
                        placeholder="John Doe"
                      />
                    )}
                  />
                  {errors.billingName && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingName.message}</p>
                  )}
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <Controller
                    name="billingAddress"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={clsx(
                          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                          errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                        )}
                        placeholder="123 Main St"
                      />
                    )}
                  />
                  {errors.billingAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
                  )}
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Controller
                      name="billingCity"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={clsx(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.billingCity ? 'border-red-500' : 'border-gray-300'
                          )}
                          placeholder="New York"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Controller
                      name="billingState"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={clsx(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.billingState ? 'border-red-500' : 'border-gray-300'
                          )}
                          placeholder="NY"
                          maxLength={2}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <Controller
                      name="billingZip"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={clsx(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.billingZip ? 'border-red-500' : 'border-gray-300'
                          )}
                          placeholder="10001"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Save Card */}
                <div className="flex items-center">
                  <Controller
                    name="saveCard"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Save card for future purchases
                  </label>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 rounded-lg p-3 flex items-start">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !isValid}
                  className={clsx(
                    'px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2',
                    isProcessing || !isValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Pay ${price}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}