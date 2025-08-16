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

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store purchase in localStorage (for demo purposes)
    const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
    const purchaseId = `purchase_${Date.now()}`;
    
    purchases.push({
      courseId: course.id,
      purchaseId,
      purchaseDate: new Date().toISOString(),
      price: course.price,
      affiliateCommission: course.price * 0.25 // 25% commission for affiliates
    });
    
    localStorage.setItem('purchasedCourses', JSON.stringify(purchases));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      if (onPurchaseSuccess) onPurchaseSuccess(course.id);
    }, 3000);
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
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              🎉 Start learning immediately - all {course.lessonCount} lessons are now available!
            </p>
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

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-shopping-cart mr-2"></i>
                Purchase Course for ${course.price}
              </span>
            )}
          </button>

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