import { useUpgrade } from '../../contexts/UpgradeContext';
import { UserRole } from '../../contexts/UserRoleContext';
import { UpgradeContext } from './UpgradeRouter';

interface UpgradeButtonProps {
  variant?: 'primary' | 'secondary' | 'compact';
  context?: UpgradeContext;
  currentPlan?: UserRole;
  className?: string;
  children?: React.ReactNode;
}

export default function UpgradeButton({ 
  variant = 'primary',
  context = 'premium', 
  currentPlan = 'free',
  className = '',
  children 
}: UpgradeButtonProps) {
  const { showUpgradeModal } = useUpgrade();

  const getButtonContent = () => {
    if (children) return children;
    
    switch (variant) {
      case 'compact':
        return (
          <span className="flex items-center">
            <i className="fas fa-crown mr-2"></i>Upgrade
          </span>
        );
      case 'secondary':
        return (
          <span className="flex items-center">
            <i className="fas fa-star mr-2"></i>Go Premium
          </span>
        );
      default:
        return (
          <span className="flex items-center">
            <i className="fas fa-crown mr-2"></i>Upgrade to Premium
          </span>
        );
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg";
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm hover:from-purple-600 hover:to-purple-700`;
      case 'secondary':
        return `${baseClasses} bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 hover:from-yellow-500 hover:to-yellow-600`;
      default:
        return `${baseClasses} bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 text-lg hover:from-purple-700 hover:to-purple-800`;
    }
  };

  return (
    <button
      onClick={() => showUpgradeModal(context, currentPlan)}
      className={`${getButtonClasses()} ${className}`}
    >
      {getButtonContent()}
    </button>
  );
}