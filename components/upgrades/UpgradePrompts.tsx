import { useUpgrade } from '../../contexts/UpgradeContext';
import { roleToUpgradeContext } from '../../utils/upgrade';

// Subtle upgrade prompt for after course completion
export function CourseCompletionUpgrade({ courseTitle }: { courseTitle: string }) {
  const { showUpgradeModal } = useUpgrade();

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <i className="fas fa-crown text-purple-600"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Great progress on {courseTitle}!</h4>
            <p className="text-xs text-gray-600">Unlock all courses with Premium</p>
          </div>
        </div>
        <button
          onClick={() => showUpgradeModal(roleToUpgradeContext('free'))}
          className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

// Progress milestone upgrade prompt
export function ProgressMilestoneUpgrade({ milestone }: { milestone: string }) {
  const { showUpgradeModal } = useUpgrade();

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-lg p-3 mb-4">
      <div className="flex items-center text-sm">
        <i className="fas fa-star text-yellow-500 mr-2"></i>
        <span className="text-gray-700 flex-1">🎉 {milestone} - </span>
        <button
          onClick={() => showUpgradeModal(roleToUpgradeContext('free'))}
          className="text-purple-600 hover:text-purple-700 font-medium ml-2"
        >
          Unlock more with Premium
        </button>
      </div>
    </div>
  );
}

// Bottom corner upgrade widget (non-intrusive)
export function FloatingUpgradeWidget() {
  const { showUpgradeModal } = useUpgrade();

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <button
        onClick={() => showUpgradeModal(roleToUpgradeContext('free'))}
        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
      >
        <div className="flex items-center">
          <i className="fas fa-crown text-lg mr-2 group-hover:animate-pulse"></i>
          <span className="font-medium text-sm">Premium</span>
        </div>
      </button>
    </div>
  );
}

// Sidebar upgrade card
export function SidebarUpgradeCard() {
  const { showUpgradeModal } = useUpgrade();

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white mb-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-rocket text-xl"></i>
        </div>
        <h3 className="font-bold text-sm mb-1">Unlock Everything</h3>
        <p className="text-purple-100 text-xs mb-3">Get access to all 18+ courses</p>
        <button
          onClick={() => showUpgradeModal(roleToUpgradeContext('free'))}
          className="w-full bg-white text-purple-700 py-2 px-3 rounded-lg font-medium text-xs hover:bg-purple-50 transition-colors"
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}

// Learning streak upgrade prompt
export function StreakUpgradePrompt({ days }: { days: number }) {
  const { showUpgradeModal } = useUpgrade();

  if (days < 3) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <i className="fas fa-fire text-orange-500 mr-2"></i>
          <span className="text-gray-700">{days} day streak! Keep it going with Premium</span>
        </div>
        <button
          onClick={() => showUpgradeModal(roleToUpgradeContext('free'))}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}