export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  membershipLevel?: 'trial' | 'free' | 'monthly' | 'yearly' | 'guest';
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled' | 'expired';
}

export interface AccessResult {
  hasAccess: boolean;
  reason?: string;
  upgradeUrl?: string;
  requiredPlan?: string;
}

export const checkAdvancedTrainingAccess = (user: User | null, accessLevel: string): AccessResult => {
  // No user or guest user
  if (!user || user.membershipLevel === 'guest' || !user.membershipLevel) {
    return { 
      hasAccess: false, 
      reason: 'Login required to access Advanced Training content',
      upgradeUrl: '/login?redirect=/library',
      requiredPlan: accessLevel
    };
  }

  const userLevel = user.membershipLevel;
  
  // Check if user has inactive subscription
  if (user.subscriptionStatus && ['inactive', 'cancelled', 'expired'].includes(user.subscriptionStatus)) {
    return { 
      hasAccess: false, 
      reason: 'Active subscription required',
      upgradeUrl: '/upgrade?plan=' + accessLevel,
      requiredPlan: accessLevel
    };
  }

  // Free or trial users need to upgrade
  if (['trial', 'free'].includes(userLevel)) {
    return { 
      hasAccess: false, 
      reason: accessLevel === 'monthly' ? 'Monthly membership required' : 'Yearly membership required',
      upgradeUrl: '/upgrade?plan=' + accessLevel,
      requiredPlan: accessLevel
    };
  }
  
  // Monthly access level check
  if (accessLevel === 'monthly' && !['monthly', 'yearly'].includes(userLevel)) {
    return { 
      hasAccess: false, 
      reason: 'Monthly membership required',
      upgradeUrl: '/upgrade?plan=monthly',
      requiredPlan: 'monthly'
    };
  }
  
  // Yearly access level check
  if (accessLevel === 'yearly' && userLevel !== 'yearly') {
    return { 
      hasAccess: false, 
      reason: 'Yearly membership required',
      upgradeUrl: '/upgrade?plan=yearly',
      requiredPlan: 'yearly'
    };
  }

  return { hasAccess: true };
};

export const hasAccessToLibraryCourse = (user: User | null, course: any): boolean => {
  const accessResult = checkAdvancedTrainingAccess(user, course.accessLevel);
  return accessResult.hasAccess;
};

export const getMembershipBadgeText = (accessLevel: string): string => {
  switch (accessLevel) {
    case 'monthly':
      return 'Monthly+';
    case 'yearly':
      return 'Yearly Only';
    default:
      return 'Premium';
  }
};

export const getMembershipBadgeColor = (accessLevel: string): string => {
  switch (accessLevel) {
    case 'monthly':
      return 'bg-blue-500/20 text-blue-300';
    case 'yearly':
      return 'bg-yellow-500/20 text-yellow-300';
    default:
      return 'bg-purple-500/20 text-purple-300';
  }
};

export const getUpgradeUrl = (course: any): string => {
  return `/upgrade?plan=${course.accessLevel}&course=${course.id}&from=library`;
};

export const canAccessContent = (user: User | null, requiredLevel: string): boolean => {
  if (!user || !user.membershipLevel) return false;
  
  const userLevel = user.membershipLevel;
  
  // Check subscription status
  if (user.subscriptionStatus && ['inactive', 'cancelled', 'expired'].includes(user.subscriptionStatus)) {
    return false;
  }
  
  // Free/trial users have no access
  if (['trial', 'free', 'guest'].includes(userLevel)) {
    return false;
  }
  
  // Monthly users can access monthly content
  if (requiredLevel === 'monthly' && ['monthly', 'yearly'].includes(userLevel)) {
    return true;
  }
  
  // Only yearly users can access yearly content
  if (requiredLevel === 'yearly' && userLevel === 'yearly') {
    return true;
  }
  
  return false;
};