export type UserTier = 'trial' | 'downsell_37' | 'monthly_99' | 'annual_799' | 'admin';

export interface AccessRule {
  allowedTiers: UserTier[];
  redirectUrl?: string;
  upgradeMessage?: string;
}

export const ACCESS_RULES: Record<string, AccessRule> = {
  '/': { allowedTiers: ['trial', 'downsell_37', 'monthly_99', 'annual_799', 'admin'] },
  '/courses': { 
    allowedTiers: ['downsell_37', 'monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'Upgrade to access all courses'
  },
  '/library': { 
    allowedTiers: ['monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'Monthly or Annual subscription required'
  },
  '/experts': { 
    allowedTiers: ['monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'Connect with experts - Monthly/Annual required'
  },
  '/dmo': { 
    allowedTiers: ['monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'Daily Method access requires Monthly/Annual'
  },
  '/affiliate': { 
    allowedTiers: ['monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'Affiliate Portal - Monthly/Annual members only'
  },
  '/stats': { 
    allowedTiers: ['monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'Statistics require Monthly or Annual subscription'
  },
  '/leads': { 
    allowedTiers: ['monthly_99', 'annual_799', 'admin'],
    redirectUrl: '/upgrade',
    upgradeMessage: 'CRM System - Monthly/Annual subscription required'
  },
  '/profile': { allowedTiers: ['trial', 'downsell_37', 'monthly_99', 'annual_799', 'admin'] }
};

export function hasAccess(userTier: UserTier | null | undefined, path: string): boolean {
  if (!userTier) return path === '/' || path === '/profile'; // Allow basic access for undefined users
  
  const rule = ACCESS_RULES[path];
  if (!rule) return false;
  
  return rule.allowedTiers.includes(userTier);
}

export function getAccessRule(path: string): AccessRule | null {
  return ACCESS_RULES[path] || null;
}

export function getTierDisplayName(tier: string | null | undefined): string {
  const tierNames: Record<string, string> = {
    'trial': 'Trial',
    'downsell_37': '$37 Plan',
    'monthly_99': 'Monthly ($99)',
    'annual_799': 'Annual ($799)',
    'admin': 'Admin'
  };
  return tierNames[tier || 'trial'] || 'Trial';
}