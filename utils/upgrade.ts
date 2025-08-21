export type UserRole = 'free' | 'trial' | 'monthly' | 'annual' | 'downsell' | 'admin';
export type UpgradeContext = 'premium' | 'skills' | 'enagic' | 'vsl' | 'improve-skills' | 'skills-access' | 'unknown';

export const roleToUpgradeContext = (role: UserRole): UpgradeContext => {
  switch (role) {
    case 'free':
    case 'trial':
    case 'downsell':
      return 'premium';
    case 'monthly':
    case 'annual':
    case 'admin':
      return 'skills';
    default:
      return 'unknown';
  }
};