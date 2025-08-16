import React, { useState, useEffect } from 'react';
import { Expert, TimeSlot, BookingRequest, Booking, bookSession, getAvailableSlots } from '../../lib/api/experts';
import emailService from '../../lib/services/emailService';
import SecureCalendlyModal from './SecureCalendlyModal';
import BookingSecurityInfo from './BookingSecurityInfo';

interface BookingModalProps {
  expert: Expert | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

type BookingStep = 'time' | 'payment' | 'confirmation';

interface BookingData {
  selectedSlot: TimeSlot | null;
  customerInfo: {
    name: string;
    email: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardholderName: string;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({
  expert,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('time');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedSlot: null,
    customerInfo: {
      name: 'Ashley Kemp',
      email: 'ashley@example.com'
    },
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      cardholderName: 'Ashley Kemp'
    }
  });

  useEffect(() => {
    if (expert && isOpen) {
      setAvailableSlots(expert.availability);
    }
  }, [expert, isOpen]);

  const resetModal = () => {
    setCurrentStep('time');
    setBookingData({
      selectedSlot: null,
      customerInfo: {
        name: 'Ashley Kemp',
        email: 'ashley@example.com'
      },
      paymentInfo: {
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: 'Ashley Kemp'
      }
    });
    setConfirmedBooking(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSelectTime = (slot: TimeSlot) => {
    setBookingData(prev => ({
      ...prev,
      selectedSlot: slot
    }));
  };

  const handleContinueToPayment = () => {
    if (!bookingData.selectedSlot) return;
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!expert || !bookingData.selectedSlot) return;

    setLoading(true);
    try {
      const bookingRequest: BookingRequest = {
        expertId: expert.id,
        timeSlotId: bookingData.selectedSlot.id,
        customerInfo: bookingData.customerInfo,
        paymentInfo: bookingData.paymentInfo
      };

      const booking = await bookSession(bookingRequest);
      setConfirmedBooking(booking);
      
      // Send confirmation and receipt emails
      try {
        const emailData = {
          booking,
          expert,
          timeSlot: bookingData.selectedSlot,
          customerEmail: bookingData.customerInfo.email,
          customerName: bookingData.customerInfo.name
        };
        
        // Send both emails concurrently
        const [confirmationSent, receiptSent] = await Promise.all([
          emailService.sendBookingConfirmation(emailData),
          emailService.sendBookingReceipt(emailData)
        ]);
        
        if (confirmationSent && receiptSent) {
          console.log('📧 All emails sent successfully');
        } else {
          console.warn('⚠️ Some emails failed to send');
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the booking if emails fail
      }
      
      setCurrentStep('confirmation');
      onSuccess(booking);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentInputChange = (field: keyof BookingData['paymentInfo'], value: string) => {
    setBookingData(prev => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        [field]: value
      }
    }));
  };

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

  if (!expert || !isOpen) return null;

  const stepProgress = {
    time: 1,
    payment: 2,
    confirmation: 3
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      {/* Mobile: Slide up from bottom, Desktop: Center modal */}
      <div className="w-full sm:w-auto sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={expert.avatarUrl} 
                alt={expert.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 border-2 border-white/30"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-bold">{expert.name}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-300 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star text-sm ${i < expert.rating ? '' : 'opacity-30'}`}></i>
                    ))}
                  </div>
                  <span className="text-sm opacity-90">{expert.level}</span>
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

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            {(['time', 'payment', 'confirmation'] as const).map((step, index) => {
              const stepNum = index + 1;
              const isActive = stepProgress[currentStep] === stepNum;
              const isCompleted = stepProgress[currentStep] > stepNum;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                      isActive ? 'bg-blue-600 border-blue-600 text-white' : 
                      'border-gray-300 text-gray-400'}
                  `}>
                    {isCompleted ? <i className="fas fa-check text-xs"></i> : stepNum}
                  </div>
                  <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium capitalize hidden sm:inline ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step === 'time' ? 'Select Time' : step === 'payment' ? 'Payment' : 'Confirmation'}
                  </span>
                  {index < 2 && (
                    <div className={`ml-2 sm:ml-4 w-6 sm:w-12 h-0.5 ${
                      stepProgress[currentStep] > stepNum ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentStep === 'time' && (
            <>
              <BookingSecurityInfo />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Session Details */}
              <div>
                <div className="flex items-center mb-4">
                  <i className="fas fa-video text-blue-600 mr-2"></i>
                  <h4 className="text-lg font-semibold">Session Details</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{expert.sessionDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">1-on-1 Video Call</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">Zoom/Teams</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <span className="font-bold text-xl text-blue-600">${expert.price}</span>
                  </div>
                </div>
              </div>

              {/* Available Times */}
              <div>
                <div className="flex items-center mb-4">
                  <i className="fas fa-calendar text-green-600 mr-2"></i>
                  <h4 className="text-lg font-semibold">Choose Your Preferred Time</h4>
                </div>
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Available This Week</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {availableSlots.slice(0, 4).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSelectTime(slot)}
                        className={`p-4 rounded-lg border text-left transition-all min-h-[60px] ${
                          bookingData.selectedSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-base">
                              {slot.date === '2025-08-17' ? 'Today' : 'Tomorrow'}
                            </div>
                            <div className="text-sm text-gray-600">{slot.time}</div>
                          </div>
                          {bookingData.selectedSlot?.id === slot.id && (
                            <i className="fas fa-check-circle text-blue-600 text-lg"></i>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {bookingData.selectedSlot && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-800">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-shield-alt mr-2"></i>
                        <span className="font-semibold">Secure Payment Required</span>
                      </div>
                      <p className="text-sm text-green-700">
                        After payment confirmation, you'll receive a secure Calendly link to schedule your exact time with {expert.name}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </>
          )}

          {currentStep === 'payment' && bookingData.selectedSlot && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Order Summary */}
              <div>
                <div className="flex items-center mb-4">
                  <i className="fas fa-receipt text-purple-600 mr-2"></i>
                  <h4 className="text-lg font-semibold">Order Summary</h4>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-3">
                    <img 
                      src={expert.avatarUrl} 
                      alt={expert.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold">{expert.name}</div>
                      <div className="text-sm text-gray-600">{expert.sessionDuration}-minute coaching session</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Selected Time:</strong> {bookingData.selectedSlot.date === '2025-08-17' ? 'Today' : 'Tomorrow'} {bookingData.selectedSlot.time}
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-chart-line text-green-600 mr-2"></i>
                    <span className="font-semibold text-green-800">Revenue Split</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Expert receives (75%):</span>
                      <span className="font-bold text-green-700">${Math.round(expert.price * 0.75)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee (25%):</span>
                      <span className="font-bold text-green-700">${Math.round(expert.price * 0.25)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <div className="flex items-center mb-4">
                  <i className="fas fa-credit-card text-green-600 mr-2"></i>
                  <h4 className="text-lg font-semibold">Payment Information</h4>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-yellow-800">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    <span className="text-sm font-medium">
                      Demo Mode: 
                      <button 
                        onClick={() => {
                          setBookingData(prev => ({
                            ...prev,
                            paymentInfo: {
                              cardNumber: '4242 4242 4242 4242',
                              expiryDate: '12/28',
                              cvc: '123',
                              cardholderName: 'Ashley Kemp'
                            }
                          }));
                        }}
                        className="ml-1 underline hover:no-underline"
                      >
                        Click to auto-fill dummy card info
                      </button>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={bookingData.paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={bookingData.paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC *
                      </label>
                      <input
                        type="text"
                        value={bookingData.paymentInfo.cvc}
                        onChange={(e) => handlePaymentInputChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.paymentInfo.cardholderName}
                      onChange={(e) => handlePaymentInputChange('cardholderName', e.target.value)}
                      placeholder="Ashley Kemp"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'confirmation' && confirmedBooking && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-2xl text-green-600"></i>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Your payment has been processed successfully. Now schedule your exact time with {expert.name}.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-green-500 mt-1 mr-3"></i>
                  <div className="text-left">
                    <div className="font-semibold text-green-800 mb-1">Secure Calendar Access</div>
                    <div className="text-sm text-green-700">
                      Your payment unlocks direct access to {expert.name}'s private calendar. Choose your preferred time slot with no risk of double-booking.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <i className="fas fa-envelope text-blue-500 mt-1 mr-3"></i>
                  <div className="text-left">
                    <div className="font-medium text-blue-800 mb-1">Confirmation Emails Sent</div>
                    <div className="text-sm text-blue-700">
                      • Payment receipt sent to {bookingData.customerInfo.email}<br/>
                      • Secure calendar link sent to {bookingData.customerInfo.email}<br/>
                      • Expert {expert.name} has been notified
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expert:</span>
                    <span className="font-medium">{expert.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Duration:</span>
                    <span className="font-medium">{expert.sessionDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-600">${expert.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium text-blue-600">#{confirmedBooking.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {currentStep !== 'confirmation' && (
          <div className="border-t border-gray-200 bg-white p-4 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
              <button
                onClick={currentStep === 'payment' ? () => setCurrentStep('time') : handleClose}
                className="order-2 sm:order-1 px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg sm:border-0 sm:bg-transparent"
              >
                {currentStep === 'payment' ? 'Back' : 'Cancel'}
              </button>
              
              {currentStep === 'time' && (
                <button
                  onClick={handleContinueToPayment}
                  disabled={!bookingData.selectedSlot}
                  className={`order-1 sm:order-2 w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg font-medium transition-all flex items-center justify-center ${
                    bookingData.selectedSlot
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              )}
              
              {currentStep === 'payment' && (
                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading || !bookingData.paymentInfo.cardNumber || !bookingData.paymentInfo.expiryDate || !bookingData.paymentInfo.cvc}
                  className={`order-1 sm:order-2 w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg font-medium transition-all flex items-center justify-center ${
                    loading || !bookingData.paymentInfo.cardNumber || !bookingData.paymentInfo.expiryDate || !bookingData.paymentInfo.cvc
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                      Secure Payment ${expert.price}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="border-t border-gray-200 bg-white p-4 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCalendly(true)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-calendar-check mr-2"></i>
                Schedule Your Session
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Secure Calendly Modal */}
      {showCalendly && confirmedBooking && (
        <SecureCalendlyModal
          isOpen={showCalendly}
          onClose={() => setShowCalendly(false)}
          calendlyUrl={expert.calendlyUrl}
          expertName={expert.name}
          bookingId={confirmedBooking.id}
          paymentToken={confirmedBooking.id}
        />
      )}
    </div>
  );
};

export default BookingModal;