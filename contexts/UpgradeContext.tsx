import React, { createContext, useContext, useState, ReactNode } from 'react';
import UpgradeRouter, { UpgradeContext as UpgradeContextEnum } from '../components/upgrades/UpgradeRouter';
import { UserRole } from './UserRoleContext';

interface UpgradeContextType {
  showUpgradeModal: (context?: UpgradeContextEnum, currentPlan?: UserRole) => void;
  showPremiumUpgrade: (currentPlan?: UserRole) => void;
  showSkillsUpgrade: (currentPlan?: UserRole) => void;
  hideUpgradeModal: () => void;
  isUpgradeModalOpen: boolean;
}

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined);

interface UpgradeProviderProps {
  children: ReactNode;
}

export function UpgradeProvider({ children }: UpgradeProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<UserRole>('free');
  const [upgradeContext, setUpgradeContext] = useState<UpgradeContextEnum>('unknown');

  const showUpgradeModal = (context: UpgradeContextEnum = 'unknown', plan: UserRole = 'free') => {
    setUpgradeContext(context);
    setCurrentPlan(plan);
    setIsModalOpen(true);
  };

  const showPremiumUpgrade = (plan: UserRole = 'free') => {
    showUpgradeModal('premium', plan);
  };

  const showSkillsUpgrade = (plan: UserRole = 'free') => {
    showUpgradeModal('skills', plan);
  };

  const hideUpgradeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpgradeSuccess = () => {
    // Refresh page or update user state
    window.location.reload();
  };

  return (
    <UpgradeContext.Provider
      value={{
        showUpgradeModal,
        showPremiumUpgrade,
        showSkillsUpgrade,
        hideUpgradeModal,
        isUpgradeModalOpen: isModalOpen,
      }}
    >
      {children}
      <UpgradeRouter
        isOpen={isModalOpen}
        onClose={hideUpgradeModal}
        context={upgradeContext}
        currentPlan={currentPlan === 'monthly' ? 'monthly' : currentPlan === 'annual' ? 'annual' : 'free'}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </UpgradeContext.Provider>
  );
}

export function useUpgrade() {
  const context = useContext(UpgradeContext);
  if (context === undefined) {
    throw new Error('useUpgrade must be used within an UpgradeProvider');
  }
  return context;
}