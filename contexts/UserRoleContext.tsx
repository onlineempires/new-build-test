import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user roles and their hierarchy
export type UserRole = 'free' | 'trial' | 'monthly' | 'annual' | 'downsell' | 'admin';

// Define permissions for each feature
export interface UserPermissions {
  // Course Access
  canAccessIntroVideos: boolean;
  canAccessAllCourses: boolean;
  canAccessStartHereOnly: boolean; // NEW: Trial members restricted to "Start Here" courses
  canAccessMasterclasses: boolean;
  
  // Feature Access  
  canAccessAffiliate: boolean;
  canAccessExpertDirectory: boolean;
  canAccessDMO: boolean;
  canAccessStats: boolean;
  canAccessLeads: boolean;
  
  // Upgrade Abilities
  canUpgradeToMonthly: boolean;
  canUpgradeToAnnual: boolean;
  canDowngrade: boolean;
  
  // Admin Features
  isAdmin: boolean;
  canManageUsers: boolean;
  canManageCourses: boolean;
  canViewPayments: boolean;
  canCreateFunnels: boolean;
  canManageCalendar: boolean;
}

// Define role configurations
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  free: {
    canAccessIntroVideos: true,
    canAccessAllCourses: false,
    canAccessStartHereOnly: true, // FREE users get Start Here courses only
    canAccessMasterclasses: false,
    canAccessAffiliate: false,
    canAccessExpertDirectory: false, // No expert directory access
    canAccessDMO: false, // No DMO access for free users
    canAccessStats: false,
    canAccessLeads: false,
    canUpgradeToMonthly: true,
    canUpgradeToAnnual: true,
    canDowngrade: false,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: false,
    canManageCalendar: false,
  },

  trial: {
    canAccessIntroVideos: true,
    canAccessAllCourses: false,
    canAccessStartHereOnly: true, // RESTRICTED: Trial members only get "Start Here" courses
    canAccessMasterclasses: false,
    canAccessAffiliate: false,
    canAccessExpertDirectory: false, // No expert directory access for trial
    canAccessDMO: false, // No DMO access for trial users
    canAccessStats: false,
    canAccessLeads: false,
    canUpgradeToMonthly: true,
    canUpgradeToAnnual: true,
    canDowngrade: false,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: false,
    canManageCalendar: false,
  },

  monthly: {
    canAccessIntroVideos: true,
    canAccessAllCourses: true,
    canAccessStartHereOnly: false,
    canAccessMasterclasses: false, // Must purchase individually
    canAccessAffiliate: true,
    canAccessExpertDirectory: true,
    canAccessDMO: true,
    canAccessStats: true,
    canAccessLeads: true,
    canUpgradeToMonthly: false,
    canUpgradeToAnnual: true,
    canDowngrade: true,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: false,
    canManageCalendar: false,
  },

  annual: {
    canAccessIntroVideos: true,
    canAccessAllCourses: true,
    canAccessStartHereOnly: false,
    canAccessMasterclasses: false, // Must purchase individually
    canAccessAffiliate: true,
    canAccessExpertDirectory: true,
    canAccessDMO: true,
    canAccessStats: true,
    canAccessLeads: true,
    canUpgradeToMonthly: false,
    canUpgradeToAnnual: false,
    canDowngrade: true,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: false,
    canManageCalendar: false,
  },

  downsell: {
    canAccessIntroVideos: true,
    canAccessAllCourses: false,
    canAccessStartHereOnly: false,
    canAccessMasterclasses: false,
    canAccessAffiliate: true, // Key feature for downsell
    canAccessExpertDirectory: false,
    canAccessDMO: true,
    canAccessStats: false,
    canAccessLeads: false,
    canUpgradeToMonthly: true,
    canUpgradeToAnnual: true,
    canDowngrade: false,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: false,
    canManageCalendar: false,
  },

  admin: {
    canAccessIntroVideos: true,
    canAccessAllCourses: true,
    canAccessStartHereOnly: false,
    canAccessMasterclasses: true,
    canAccessAffiliate: true,
    canAccessExpertDirectory: true,
    canAccessDMO: true,
    canAccessStats: true,
    canAccessLeads: true,
    canUpgradeToMonthly: false,
    canUpgradeToAnnual: false,
    canDowngrade: false,
    isAdmin: true,
    canManageUsers: true,
    canManageCourses: true,
    canViewPayments: true,
    canCreateFunnels: true,
    canManageCalendar: true,
  },
};

// Define role pricing and details
export interface RoleDetails {
  name: string;
  price: number;
  billing: 'one-time' | 'monthly' | 'yearly';
  description: string;
  features: string[];
}

export const ROLE_DETAILS: Record<UserRole, RoleDetails> = {
  free: {
    name: 'Free Account',
    price: 0,
    billing: 'one-time',
    description: 'Basic access to intro content',
    features: ['Start Here courses only', '7-day access period', 'Basic intro content']
  },

  trial: {
    name: '$1 Trial',
    price: 1,
    billing: 'one-time',
    description: 'Try our platform for just $1',
    features: ['Start Here courses only', '7-day trial period', 'Basic intro content']
  },

  monthly: {
    name: 'Monthly Member',
    price: 99,
    billing: 'monthly',
    description: 'Full access to all regular courses',
    features: ['All courses', 'Affiliate portal', 'Statistics', 'Lead management', 'Expert Directory']
  },

  annual: {
    name: 'Annual Member',
    price: 799,
    billing: 'yearly',
    description: 'Same as monthly but billed annually',
    features: ['All courses', 'Affiliate portal', 'Statistics', 'Lead management', 'Expert Directory', 'Save $388/year']
  },

  downsell: {
    name: 'Lite Access',
    price: 37,
    billing: 'one-time',
    description: 'Limited access with affiliate opportunities',
    features: ['Intro courses', 'Affiliate portal', 'Commission tracking', 'Daily Method']
  },

  admin: {
    name: 'Administrator',
    price: 0,
    billing: 'one-time',
    description: 'Full platform administration access',
    features: ['All user features', 'User management', 'Course management', 'Payment tracking', 'Funnel creation']
  }
};

interface UserRoleContextType {
  currentRole: UserRole;
  permissions: UserPermissions;
  roleDetails: RoleDetails;
  setUserRole: (role: UserRole) => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  canAccessFeature: (feature: string) => boolean;
  getRoleHierarchyLevel: (role: UserRole) => number;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode;
}

// Role hierarchy for upgrade logic (higher number = higher tier)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  free: 0,
  trial: 1,
  downsell: 2,
  monthly: 3,
  annual: 4,
  admin: 5
};

export function UserRoleProvider({ children }: UserRoleProviderProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>('free'); // Default to free for proper testing
  const [permissions, setPermissions] = useState<UserPermissions>(ROLE_PERMISSIONS.free);
  const [roleDetails, setRoleDetails] = useState<RoleDetails>(ROLE_DETAILS.free);

  useEffect(() => {
    // Load role from localStorage or API
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole && ROLE_PERMISSIONS[storedRole]) {
      updateRole(storedRole);
    }

    // Listen for localStorage changes (for when upgrades happen)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole' && e.newValue) {
        const newRole = e.newValue as UserRole;
        if (ROLE_PERMISSIONS[newRole]) {
          updateRole(newRole);
        }
      }
    };

    // Listen for custom storage events (same-window localStorage changes)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'userRole' && e.detail.newValue) {
        const newRole = e.detail.newValue as UserRole;
        if (ROLE_PERMISSIONS[newRole]) {
          updateRole(newRole);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, []);

  const updateRole = (role: UserRole) => {
    setCurrentRole(role);
    setPermissions(ROLE_PERMISSIONS[role]);
    setRoleDetails(ROLE_DETAILS[role]);
    localStorage.setItem('userRole', role);
    
    // Dispatch custom event for same-window localStorage changes
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: { key: 'userRole', newValue: role }
    }));
  };

  const setUserRole = (role: UserRole) => {
    updateRole(role);
  };

  // Note: upgradeToRole removed - upgrades now happen only after successful payment
  // Use setUserRole after payment confirmation instead

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission] as boolean;
  };

  const canAccessFeature = (feature: string): boolean => {
    const featurePermissionMap: Record<string, keyof UserPermissions> = {
      'courses': 'canAccessAllCourses',
      'affiliate': 'canAccessAffiliate',
      'experts': 'canAccessExpertDirectory',
      'dmo': 'canAccessDMO',
      'stats': 'canAccessStats',
      'leads': 'canAccessLeads',
      'masterclasses': 'canAccessMasterclasses',
      'admin': 'isAdmin'
    };

    const permissionKey = featurePermissionMap[feature];
    return permissionKey ? hasPermission(permissionKey) : false;
  };

  const getRoleHierarchyLevel = (role: UserRole): number => {
    return ROLE_HIERARCHY[role];
  };

  return (
    <UserRoleContext.Provider
      value={{
        currentRole,
        permissions,
        roleDetails,
        setUserRole,
        hasPermission,
        canAccessFeature,
        getRoleHierarchyLevel,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}