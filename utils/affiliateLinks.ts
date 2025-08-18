// utils/affiliateLinks.ts
export const generateAffiliateLink = (username: string, funnelId: string, funnelType: string = 'opt-in'): string => {
  const baseUrl = 'aff.onlineempires.com';
  const userRef = `${username}-${funnelId}`;
  
  return `https://${baseUrl}/${userRef}`;
};

export const generateAffiliateLinks = (username: string) => {
  return {
    // Lead Generation Funnels
    samBudowTraining: generateAffiliateLink(username, '10', 'opt-in'),
    marissaTrial: generateAffiliateLink(username, '11', 'opt-in'),
    brodieTeamTraining: generateAffiliateLink(username, '12', 'opt-in'),
    
    // VSL Funnels
    ashleyKrooks2024: generateAffiliateLink(username, '20', 'vsl'),
    kristenBraun: generateAffiliateLink(username, '21', 'vsl'),
    samBudowPremium: generateAffiliateLink(username, '22', 'vsl'),
    
    // Checkout Funnels
    trialOrderForm: generateAffiliateLink(username, '30', 'checkout'),
    marissaDirectSale: generateAffiliateLink(username, '31', 'checkout'),
    
    // Free Trial Funnels
    seveDayTrial: generateAffiliateLink(username, '40', 'trial'),
    premiumAccess: generateAffiliateLink(username, '41', 'trial')
  };
};

export const updateAffiliateLinksForUser = (username: string, funnels: any[]) => {
  return funnels.map((funnel, index) => ({
    ...funnel,
    affiliateLink: generateAffiliateLink(username, (10 + index).toString(), funnel.type)
  }));
};