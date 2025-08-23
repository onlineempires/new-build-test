import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

// Define user roles and their hierarchy
export type UserRole = 'free' | 'trial' | 'monthly' | 'annual' | 'downsell' | 'admin' | 'guest';

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
  guest: {
    canAccessIntroVideos: false,
    canAccessAllCourses: false,
    canAccessStartHereOnly: false,
    canAccessMasterclasses: false,
    canAccessAffiliate: false,
    canAccessExpertDirectory: false,
    canAccessDMO: false,
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
    canAccessAffiliate: true,
    canAccessExpertDirectory: false,
    canAccessDMO: false,
    canAccessStats: true,
    canAccessLeads: false,
    canUpgradeToMonthly: true,
    canUpgradeToAnnual: true,
    canDowngrade: false,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: true,
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

// Define what each role can see in terms of subscription details
export const ROLE_DETAILS: Record<UserRole, { title: string; badge: string; price?: number; features: string[]; name: string }> = {
  guest: {
    title: 'Guest User',
    badge: 'GUEST',
    name: 'Guest',
    features: ['Limited access'],
  },
  free: {
    title: 'Free Account',
    badge: 'FREE',
    name: 'Free User',
    features: ['Access to intro videos', 'Start Here courses only', 'Limited features'],
  },
  trial: {
    title: '7-Day Trial',
    badge: 'TRIAL',
    name: 'Trial User',
    features: ['Start Here courses only', 'Limited features', 'Expires in 7 days'],
  },
  monthly: {
    title: 'Monthly Subscription',
    badge: 'MONTHLY',
    name: 'Monthly Member',
    price: 97,
    features: ['All courses access', 'Expert directory', 'DMO system', 'Affiliate tools', 'Full analytics'],
  },
  annual: {
    title: 'Annual Subscription',
    badge: 'ANNUAL',
    name: 'Annual Member',
    price: 997,
    features: ['All courses access', 'Expert directory', 'DMO system', 'Affiliate tools', 'Full analytics', 'Priority support'],
  },
  downsell: {
    title: 'Affiliate Only',
    badge: 'DOWNSELL',
    name: 'Affiliate Member',
    price: 47,
    features: ['Affiliate dashboard', 'Funnel creation', 'Basic analytics'],
  },
  admin: {
    title: 'Administrator',
    badge: 'ADMIN',
    name: 'Administrator',
    features: ['Full system access', 'User management', 'Course management', 'Payment access', 'All features'],
  },
};

interface UserRoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  permissions: UserPermissions;
  roleDetails: { title: string; badge: string; price?: number; features: string[]; name: string };
  availableRoles: UserRole[];
  hasPermission: (permission: keyof UserPermissions) => boolean;
  canAccessFeature: (feature: string) => boolean;
  getRoleHierarchyLevel: (role?: UserRole) => number;
}

// Create default context value for SSR safety
const defaultContextValue: UserRoleContextType = {
  currentRole: 'guest',
  setCurrentRole: () => {},
  permissions: ROLE_PERMISSIONS.guest,
  roleDetails: { title: 'Guest User', badge: 'GUEST', name: 'Guest', features: ['Limited access'] },
  availableRoles: ['guest', 'free'],
  hasPermission: () => false,
  canAccessFeature: () => false,
  getRoleHierarchyLevel: () => -1,
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('guest');
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>(['guest', 'free']);
  const [isInitialized, setIsInitialized] = useState(false);

  // Custom setCurrentRole that syncs both localStorage keys
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
      localStorage.setItem('dev.role', role);
      // Trigger dev context update
      window.dispatchEvent(new CustomEvent('dev:role-changed', { detail: role }));
    }
  };

  // Initialize from localStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // First check dev.role (from DevContext/RoleSwitcher)
      const devRole = localStorage.getItem('dev.role') as UserRole;
      const storedRole = localStorage.getItem('userRole') as UserRole;
      const storedAvailableRoles = localStorage.getItem('availableRoles');
      
      // Prefer dev.role if it exists (dev tools active)
      const roleToUse = devRole || storedRole;
      
      if (roleToUse && ROLE_PERMISSIONS[roleToUse]) {
        setCurrentRoleState(roleToUse);
        console.log('UserRoleContext: Loaded role from storage:', roleToUse, devRole ? '(from dev tools)' : '(from userRole)');
      } else {
        // In development, default to monthly to test paid features
        const defaultRole = process.env.NODE_ENV === 'development' ? 'monthly' : 'free';
        setCurrentRoleState(defaultRole);
        localStorage.setItem('userRole', defaultRole);
        // CRITICAL: Also set dev.role for access control system consistency
        localStorage.setItem('dev.role', defaultRole);
        console.log('UserRoleContext: Setting default role:', defaultRole);
        // Trigger dev context update
        window.dispatchEvent(new CustomEvent('dev:role-changed', { detail: defaultRole }));
      }
      
      if (storedAvailableRoles) {
        try {
          const roles = JSON.parse(storedAvailableRoles);
          setAvailableRoles(roles);
        } catch {
          const defaultRoles: UserRole[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];
          setAvailableRoles(defaultRoles);
          localStorage.setItem('availableRoles', JSON.stringify(defaultRoles));
        }
      } else {
        const defaultRoles: UserRole[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];
        setAvailableRoles(defaultRoles);
        localStorage.setItem('availableRoles', JSON.stringify(defaultRoles));
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Update localStorage when role changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('userRole', currentRole);
      
      // Dispatch custom event for other components to listen to
      const event = new CustomEvent('roleChanged', { detail: { role: currentRole } });
      window.dispatchEvent(event);
    }
  }, [currentRole, isInitialized]);
  
  // Listen for authentication and dev role changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      // If auth token is removed, reset to free
      if (e.key === 'auth_token' && !e.newValue) {
        setCurrentRole('free');
        localStorage.setItem('userRole', 'free');
      }
      // Listen for dev.role changes from RoleSwitcher
      if (e.key === 'dev.role' && e.newValue && ROLE_PERMISSIONS[e.newValue as UserRole]) {
        setCurrentRole(e.newValue as UserRole);
        console.log('UserRoleContext: Updated role from dev tools:', e.newValue);
      }
    };
    
    // Also listen for custom roleChanged events from RoleSwitcher
    const handleRoleChanged = (e: CustomEvent) => {
      if (e.detail?.role && ROLE_PERMISSIONS[e.detail.role]) {
        setCurrentRoleState(e.detail.role);
        console.log('UserRoleContext: Updated role from roleChanged event:', e.detail.role);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('roleChanged' as any, handleRoleChanged);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('roleChanged' as any, handleRoleChanged);
    };
  }, []);

  // Memoize computed values to prevent unnecessary re-renders
  const permissions = useMemo(() => 
    ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.free, 
    [currentRole]
  );
  
  const roleDetails = useMemo(() => 
    ROLE_DETAILS[currentRole] || ROLE_DETAILS.free, 
    [currentRole]
  );

  // Memoize callback functions to prevent re-renders
  const hasPermission = useMemo(() => 
    (permission: keyof UserPermissions): boolean => {
      const result = permissions[permission] || false;
      if (process.env.NODE_ENV === 'development') {
        console.log(`hasPermission(${permission}):`, result);
      }
      return result;
    }, [permissions]
  );

  const canAccessFeature = useMemo(() => 
    (feature: string): boolean => {
      const featureMap: Record<string, keyof UserPermissions> = {
        'courses': 'canAccessAllCourses',
        'start-here': 'canAccessStartHereOnly',
        'masterclasses': 'canAccessMasterclasses',
        'affiliate': 'canAccessAffiliate',
        'experts': 'canAccessExpertDirectory',
        'dmo': 'canAccessDMO',
        'stats': 'canAccessStats',
        'leads': 'canAccessLeads',
        'admin': 'isAdmin',
      };

      const permissionKey = featureMap[feature.toLowerCase()];
      return permissionKey ? hasPermission(permissionKey) : false;
    }, [hasPermission]
  );

  const getRoleHierarchyLevel = useMemo(() => 
    (role?: UserRole): number => {
      const hierarchy: Record<UserRole, number> = {
        guest: -1,
        free: 0,
        trial: 1,
        downsell: 2,
        monthly: 3,
        annual: 4,
        admin: 5,
      };
      return hierarchy[role || currentRole] || 0;
    }, [currentRole]
  );

  // Memoize the entire context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentRole,
    setCurrentRole,
    permissions,
    roleDetails,
    availableRoles,
    hasPermission,
    canAccessFeature,
    getRoleHierarchyLevel,
  }), [currentRole, permissions, roleDetails, availableRoles, hasPermission, canAccessFeature, getRoleHierarchyLevel]);

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('UserRoleContext - Current Role:', currentRole);
      console.log('UserRoleContext - Permissions:', permissions);
    }
  }, [currentRole, permissions]);

  return (
    <UserRoleContext.Provider value={contextValue}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  
  // Return default value during SSR or if context not available yet
  if (typeof window === 'undefined') {
    return {
      ...defaultContextValue,
      setUserRole: defaultContextValue.setCurrentRole,
    };
  }
  
  if (context === undefined) {
    // In development, throw error to help debugging
    if (process.env.NODE_ENV === 'development') {
      throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    // In production, return default value to prevent crashes
    return {
      ...defaultContextValue,
      setUserRole: defaultContextValue.setCurrentRole,
    };
  }
  
  return {
    ...context,
    setUserRole: context.setCurrentRole, // Add alias for backward compatibility
  };
}