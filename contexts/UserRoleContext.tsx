import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user roles and their hierarchy
export type UserRole = 'free' | 'trial' | 'monthly' | 'annual' | 'downsell' | 'admin';

// Define permissions for each feature
export interface UserPermissions {
  // Course Access
  canAccessIntroVideos: boolean;
  canAccessAllCourses: boolean;
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
    canAccessMasterclasses: false,
    canAccessAffiliate: false,
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

  trial: {
    canAccessIntroVideos: true,
    canAccessAllCourses: false,
    canAccessMasterclasses: false,
    canAccessAffiliate: false,
    canAccessExpertDirectory: true,
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

  monthly: {
    canAccessIntroVideos: true,
    canAccessAllCourses: true,
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
    features: ['Intro video courses', 'Daily Method access', 'Community access']
  },

  trial: {
    name: '$1 Trial',
    price: 1,
    billing: 'one-time',
    description: 'Try our platform for just $1',
    features: ['Intro video courses', 'Expert Directory', 'Daily Method', '7-day trial period']
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
    name: 'Affiliate Access',
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
  upgradeToRole: (targetRole: UserRole) => Promise<boolean>;
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
  const [currentRole, setCurrentRole] = useState<UserRole>('monthly'); // Default for demo
  const [permissions, setPermissions] = useState<UserPermissions>(ROLE_PERMISSIONS.monthly);
  const [roleDetails, setRoleDetails] = useState<RoleDetails>(ROLE_DETAILS.monthly);

  useEffect(() => {
    // Load role from localStorage or API
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole && ROLE_PERMISSIONS[storedRole]) {
      updateRole(storedRole);
    }
  }, []);

  const updateRole = (role: UserRole) => {
    setCurrentRole(role);
    setPermissions(ROLE_PERMISSIONS[role]);
    setRoleDetails(ROLE_DETAILS[role]);
    localStorage.setItem('userRole', role);
  };

  const setUserRole = (role: UserRole) => {
    updateRole(role);
  };

  const upgradeToRole = async (targetRole: UserRole): Promise<boolean> => {
    // Simulate payment processing
    try {
      // Here you would integrate with actual payment processor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store purchase record
      const purchases = JSON.parse(localStorage.getItem('rolePurchases') || '[]');
      purchases.push({
        fromRole: currentRole,
        toRole: targetRole,
        price: ROLE_DETAILS[targetRole].price,
        purchaseDate: new Date().toISOString(),
        purchaseId: `role_upgrade_${Date.now()}`
      });
      localStorage.setItem('rolePurchases', JSON.stringify(purchases));
      
      // Update role
      updateRole(targetRole);
      return true;
    } catch (error) {
      console.error('Role upgrade failed:', error);
      return false;
    }
  };

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
        upgradeToRole,
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