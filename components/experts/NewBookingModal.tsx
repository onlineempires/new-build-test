import React, { useState } from 'react';
import { Expert } from '../../lib/api/experts';

interface NewBookingModalProps {
  expert: Expert | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
}

type BookingStep = 'session_type' | 'payment' | 'post_purchase';

interface SessionOption {
  id: string;
  type: 'single' | 'pack';
  name: string;
  sessions: number;
  originalPrice: number;
  finalPrice: number;
  discount?: number;
  description: string;
}

const NewBookingModal: React.FC<NewBookingModalProps> = ({
  expert,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('session_type');
  const [selectedSession, setSelectedSession] = useState<SessionOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  if (!expert || !isOpen) return null;

  // Session options
  const sessionOptions: SessionOption[] = [
    {
      id: 'single',
      type: 'single',
      name: 'Single Session',
      sessions: 1,
      originalPrice: expert.price,
      finalPrice: expert.price,
      description: 'One-time 60-minute coaching session'
    },
    {
      id: 'pack',
      type: 'pack',
      name: '4-Session Pack',
      sessions: 4,
      originalPrice: expert.price * 4,
      finalPrice: Math.round(expert.price * 4 * 0.7), // 30% discount
      discount: 30,
      description: 'Four 60-minute sessions with 30% savings'
    }
  ];

  const handleSessionSelect = (session: SessionOption) => {
    setSelectedSession(session);
  };

  const handleProceedToPayment = () => {
    if (!selectedSession) return;
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!selectedSession) return;
    
    setLoading(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate booking ID
      const newBookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setBookingId(newBookingId);
      setPaymentCompleted(true);
      setCurrentStep('post_purchase');
      
      onSuccess({
        bookingId: newBookingId,
        expert,
        session: selectedSession,
        paymentAmount: selectedSession.finalPrice
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageCoach = () => {
    const subject = encodeURIComponent(`Booking Request - ${expert.name} Session`);
    const body = encodeURIComponent(
      `Hi ${expert.name},

I just purchased a ${selectedSession?.name.toLowerCase()} but couldn't find a suitable time slot in your calendar.

Booking Details:
- Booking ID: ${bookingId}
- Session Type: ${selectedSession?.name}
- Amount Paid: $${selectedSession?.finalPrice}

Could you please contact me to schedule our session?

Best regards,
Ashley Kemp`
    );
    
    const emailUrl = `mailto:${expert.name.toLowerCase().replace(' ', '')}@digitalera.com?subject=${subject}&body=${body}`;
    window.open(emailUrl, '_blank');
  };

  const resetModal = () => {
    setCurrentStep('session_type');
    setSelectedSession(null);
    setPaymentCompleted(false);
    setBookingId('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* STEP 1: SESSION TYPE SELECTION */}
        {currentStep === 'session_type' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={expert.avatarUrl} 
                    alt={expert.name}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-white/30"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{expert.name}</h3>
                    <div className="flex items-center">
                      <div className="flex text-yellow-300 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star text-xs ${i < expert.rating ? '' : 'opacity-30'}`}></i>
                        ))}
                      </div>
                      <span className="text-xs opacity-90">{expert.level}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Session Type Selection */}
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Choose Your Session Package</h4>
                <p className="text-gray-600 text-sm">Select the option that best fits your coaching needs</p>
              </div>

              <div className="space-y-4">
                {sessionOptions.map((session) => (
                  <div
                    key={session.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${
                      selectedSession?.id === session.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleSessionSelect(session)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h5 className="font-semibold text-gray-900 mr-2">{session.name}</h5>
                          {session.discount && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Save {session.discount}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                        <div className="flex items-center">
                          {session.discount ? (
                            <>
                              <span className="text-lg font-bold text-green-600">${session.finalPrice}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">${session.originalPrice}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-blue-600">${session.finalPrice}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedSession?.id === session.id ? (
                          <i className="fas fa-check-circle text-blue-600 text-xl"></i>
                        ) : (
                          <i className="far fa-circle text-gray-400 text-xl"></i>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terms & Conditions */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <h6 className="font-semibold text-gray-900 mb-2 text-sm">Terms & Conditions:</h6>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• All bookings are final - no refunds or cancellations</li>
                  <li>• Calendar access provided only after payment confirmation</li>
                  <li>• Sessions must be used within 90 days of purchase</li>
                  <li>• 24-hour advance notice required for rescheduling</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedSession}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedSession
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT PROCESSING */}
        {currentStep === 'payment' && selectedSession && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Secure Payment</h3>
                  <p className="text-sm opacity-90">Complete your booking with {expert.name}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Payment Content */}
            <div className="p-5 flex-1 overflow-y-auto">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="flex items-center mb-3">
                  <img 
                    src={expert.avatarUrl} 
                    alt={expert.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">{expert.name}</div>
                    <div className="text-sm text-gray-600">{selectedSession.name}</div>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">${selectedSession.finalPrice}</span>
                  </div>
                  {selectedSession.discount && (
                    <div className="text-sm text-green-600 text-right">
                      You save ${selectedSession.originalPrice - selectedSession.finalPrice}!
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Simulation */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-credit-card text-2xl text-blue-600"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure Payment Processing
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  This demo simulates Stripe Checkout for payment processing
                </p>

                {/* Demo Payment Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-yellow-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    <div className="text-left">
                      <div className="font-medium text-sm">Demo Mode</div>
                      <div className="text-xs">
                        In production, this would redirect to Stripe Checkout for secure payment processing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('session_type')}
                  className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock mr-2"></i>
                      Pay ${selectedSession.finalPrice}
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 3: POST-PURCHASE BOOKING */}
        {currentStep === 'post_purchase' && selectedSession && paymentCompleted && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Payment Successful!</h3>
                  <p className="text-sm opacity-90">Now schedule your session with {expert.name}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Post-Purchase Content */}
            <div className="p-5 flex-1 overflow-y-auto">
              {/* Success Message */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-2xl text-green-600"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h4>
                <p className="text-gray-600">
                  Your payment has been processed. You now have access to {expert.name}'s private calendar.
                </p>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Booking Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium text-blue-600">#{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expert:</span>
                    <span className="font-medium">{expert.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-medium">{selectedSession.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-600">${selectedSession.finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Calendar Access */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <i className="fas fa-calendar-check text-green-600 mt-1 mr-3"></i>
                  <div>
                    <div className="font-semibold text-green-800 mb-1">Private Calendar Access</div>
                    <div className="text-sm text-green-700 mb-3">
                      Choose your preferred time directly from {expert.name}'s available slots.
                    </div>
                    
                    {/* Embedded Calendly Simulation */}
                    <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-gray-500 text-sm mb-2">
                        <i className="fas fa-external-link-alt mr-1"></i>
                        Private Calendly Calendar Embed
                      </div>
                      <div className="bg-gray-100 rounded p-3 text-xs text-gray-600">
                        [In production: Embedded private Calendly calendar for {expert.calendlyUrl}]
                        <br />
                        Calendar URL: https://calendly.com/{expert.calendlyUrl}-private
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Contact */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="fas fa-envelope text-blue-600 mt-1 mr-3"></i>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800 mb-1">Can't find a suitable time?</div>
                    <div className="text-sm text-blue-700 mb-3">
                      Message {expert.name} directly to arrange a custom time slot.
                    </div>
                    <button
                      onClick={handleMessageCoach}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <i className="fas fa-paper-plane mr-2"></i>
                      Message {expert.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleClose}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewBookingModal;