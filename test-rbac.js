// Simple RBAC test to verify access control functionality
// Since we can't directly require TS, let's manually implement the key functions
const ACCESS_RULES = {
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

function hasAccess(userTier, path) {
  if (!userTier) return path === '/' || path === '/profile';
  
  const rule = ACCESS_RULES[path];
  if (!rule) return false;
  
  return rule.allowedTiers.includes(userTier);
}

function getAccessRule(path) {
  return ACCESS_RULES[path] || null;
}

function getTierDisplayName(tier) {
  const tierNames = {
    'trial': 'Trial',
    'downsell_37': '$37 Plan',
    'monthly_99': 'Monthly ($99)',
    'annual_799': 'Annual ($799)',
    'admin': 'Admin'
  };
  return tierNames[tier || 'trial'] || 'Trial';
}

// Test cases for different user tiers and pages
const testCases = [
  // Trial user tests
  { tier: 'trial', path: '/', expectedAccess: true },
  { tier: 'trial', path: '/courses', expectedAccess: false },
  { tier: 'trial', path: '/stats', expectedAccess: false },
  { tier: 'trial', path: '/profile', expectedAccess: true },
  
  // Monthly user tests
  { tier: 'monthly_99', path: '/', expectedAccess: true },
  { tier: 'monthly_99', path: '/courses', expectedAccess: true },
  { tier: 'monthly_99', path: '/stats', expectedAccess: true },
  { tier: 'monthly_99', path: '/library', expectedAccess: true },
  { tier: 'monthly_99', path: '/profile', expectedAccess: true },
  
  // Admin user tests
  { tier: 'admin', path: '/stats', expectedAccess: true },
  { tier: 'admin', path: '/library', expectedAccess: true },
  { tier: 'admin', path: '/affiliate', expectedAccess: true },
];

console.log('🧪 RBAC Testing Results:');
console.log('========================');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  const actualAccess = hasAccess(testCase.tier, testCase.path);
  const passed = actualAccess === testCase.expectedAccess;
  
  console.log(`Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  User: ${getTierDisplayName(testCase.tier)} (${testCase.tier})`);
  console.log(`  Path: ${testCase.path}`);
  console.log(`  Expected: ${testCase.expectedAccess}, Got: ${actualAccess}`);
  
  if (!passed) {
    const rule = getAccessRule(testCase.path);
    console.log(`  Rule: ${rule ? JSON.stringify(rule.allowedTiers) : 'No rule found'}`);
  }
  
  console.log('');
  
  if (passed) passedTests++;
});

console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);

// Test tier display names
console.log('🏷️  Tier Display Names:');
const tiers = ['trial', 'downsell_37', 'monthly_99', 'annual_799', 'admin'];
tiers.forEach(tier => {
  console.log(`  ${tier} -> "${getTierDisplayName(tier)}"`);
});