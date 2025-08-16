import React from 'react';

const BookingSecurityInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
        </div>
        <div className="ml-3">
          <h4 className="text-blue-800 font-semibold text-sm mb-1">
            🔒 Secure Booking Process
          </h4>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• Payment is processed first to secure your session</li>
            <li>• After payment, you receive a unique calendar link</li>
            <li>• Each link is single-use and non-transferable</li>
            <li>• This prevents free bookings and protects experts' time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingSecurityInfo;