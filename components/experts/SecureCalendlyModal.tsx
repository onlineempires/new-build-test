import React, { useState, useEffect } from 'react';

interface SecureCalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl: string;
  expertName: string;
  bookingId: string;
  paymentToken: string;
}

const SecureCalendlyModal: React.FC<SecureCalendlyModalProps> = ({
  isOpen,
  onClose,
  calendlyUrl,
  expertName,
  bookingId,
  paymentToken
}) => {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Load Calendly widget script
      const loadCalendly = () => {
        if ((window as any).Calendly) {
          setCalendlyLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.onload = () => setCalendlyLoaded(true);
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      };

      loadCalendly();
    }
  }, [isOpen]);

  useEffect(() => {
    if (calendlyLoaded && isOpen && typeof window !== 'undefined') {
      // Initialize Calendly widget with payment protection
      const calendlyDiv = document.getElementById('calendly-inline-widget');
      if (calendlyDiv && (window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: `https://calendly.com/${calendlyUrl}?embed_domain=${window.location.hostname}&embed_type=Inline&payment_verified=${paymentToken}&booking_id=${bookingId}`,
          parentElement: calendlyDiv,
          prefill: {
            name: 'Ashley Kemp',
            email: 'ashley@example.com',
            customAnswers: {
              a1: bookingId, // Pass booking ID as custom answer
              a2: paymentToken // Pass payment token as custom answer
            }
          },
          utm: {
            utmCampaign: 'Digital Era Expert Booking',
            utmSource: 'expert-directory',
            utmMedium: 'paid-booking',
            utmContent: expertName
          }
        });
      }
    }
  }, [calendlyLoaded, isOpen, calendlyUrl, expertName, bookingId, paymentToken]);

  if (!isOpen) return null;

  const secureCalendlyUrl = `https://calendly.com/${calendlyUrl}?payment_verified=${paymentToken}&booking_id=${bookingId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      {/* Mobile: Slide up from bottom, Desktop: Center modal */}
      <div className="w-full sm:w-auto sm:max-w-5xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                <i className="fas fa-shield-alt text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Secure Calendar Access</h3>
                <p className="text-sm opacity-90">Book your session with {expertName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 shrink-0">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-green-800">Payment Verified</p>
              <p className="text-xs text-green-700 mt-1">
                Booking ID: #{bookingId} • This calendar access is secured and non-transferable
              </p>
            </div>
          </div>
        </div>

        {/* Calendly Embed */}
        <div className="flex-1 overflow-hidden">
          {calendlyLoaded ? (
            <div 
              id="calendly-inline-widget" 
              className="w-full h-full min-h-[600px]"
              style={{ minHeight: '600px' }}
            ></div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading secure calendar...</p>
              </div>
            </div>
          )}
        </div>

        {/* Fallback Link - Hidden by default, shown if embed fails */}
        <div className="bg-gray-50 border-t p-4 text-center shrink-0">
          <p className="text-sm text-gray-600 mb-2">
            Having trouble with the calendar above?
          </p>
          <a
            href={secureCalendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            Open in New Window
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecureCalendlyModal;