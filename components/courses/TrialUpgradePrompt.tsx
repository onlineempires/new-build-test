import { useUpgrade } from '../../contexts/UpgradeContext';
import { useUserRole } from '../../contexts/UserRoleContext';

interface TrialUpgradePromptProps {
  courseTitle?: string;
  message?: string;
  className?: string;
}

export default function TrialUpgradePrompt({ 
  courseTitle = 'this course',
  message,
  className = ''
}: TrialUpgradePromptProps) {
  const { showUpgradeModal } = useUpgrade();
  const { currentRole } = useUserRole();

  const getPromptContent = () => {
    if (message) return message;

    if (currentRole === 'trial') {
      return `Ready to unlock all courses? Your trial gives you access to Start Here courses. Upgrade to access ${courseTitle} and our complete course library.`;
    }

    return `Unlock ${courseTitle} and access our complete course library with a membership upgrade.`;
  };

  const getCallToAction = () => {
    if (currentRole === 'trial') {
      return 'Upgrade Your Trial';
    }
    return 'Start Your Journey';
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 ${className}`}>
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-graduation-cap text-purple-600 text-2xl"></i>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {currentRole === 'trial' ? 'Unlock Your Full Potential' : 'Ready to Level Up?'}
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {getPromptContent()}
        </p>

        {/* Upgrade Button */}
        <button
          onClick={() => showUpgradeModal(currentRole)}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <i className="fas fa-rocket mr-2"></i>
          {getCallToAction()}
        </button>

        {/* Additional Info */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-1"></i>
            All Courses Included
          </div>
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-1"></i>
            Expert Directory
          </div>
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-1"></i>
            Affiliate Portal
          </div>
        </div>
      </div>
    </div>
  );
}