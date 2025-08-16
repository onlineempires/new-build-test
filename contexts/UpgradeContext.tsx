import React, { createContext, useContext, useState, ReactNode } from 'react';
import RoleUpgradeModal from '../components/upgrades/RoleUpgradeModal';
import { UserRole } from './UserRoleContext';

interface UpgradeContextType {
  showUpgradeModal: (currentPlan?: UserRole) => void;
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

  const showUpgradeModal = (plan: UserRole = 'free') => {
    setCurrentPlan(plan);
    setIsModalOpen(true);
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
        hideUpgradeModal,
        isUpgradeModalOpen: isModalOpen,
      }}
    >
      {children}
      <RoleUpgradeModal
        isOpen={isModalOpen}
        onClose={hideUpgradeModal}
        currentPlan={currentPlan}
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