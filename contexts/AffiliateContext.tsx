import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AffiliateCommission {
  id: string;
  affiliateId: string;
  purchaseId: string;
  customer: string;
  plan: string;
  commission: number;
  rate: number;
  date: string;
  status: 'pending' | 'approved' | 'paid';
}

interface AffiliateSale {
  id: string;
  customerId: string;
  customerEmail: string;
  plan: string;
  amount: number;
  commission: number;
  date: string;
  status: 'active' | 'cancelled' | 'refunded';
}

interface AffiliateStats {
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  totalSales: number;
  activeSales: number;
  clickThroughs: number;
  conversionRate: number;
}

interface AffiliateContextType {
  // Current affiliate data
  affiliateId: string | null;
  referrerCode: string | null;
  
  // Commission tracking
  commissions: AffiliateCommission[];
  sales: AffiliateSale[];
  stats: AffiliateStats;
  
  // Methods
  setAffiliateReferrer: (affiliateId: string) => void;
  getAffiliateLink: (page?: string) => string;
  trackCommission: (purchaseData: any) => void;
  getCommissionHistory: () => AffiliateCommission[];
  getSalesHistory: () => AffiliateSale[];
  refreshStats: () => void;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

interface AffiliateProviderProps {
  children: ReactNode;
}

export function AffiliateProvider({ children }: AffiliateProviderProps) {
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [referrerCode, setReferrerCode] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [sales, setSales] = useState<AffiliateSale[]>([]);
  const [stats, setStats] = useState<AffiliateStats>({
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    totalSales: 0,
    activeSales: 0,
    clickThroughs: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Load affiliate data from localStorage
    loadAffiliateData();
    
    // Check URL for affiliate referrer
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('affiliate');
    if (ref) {
      setAffiliateReferrer(ref);
    }
  }, []);

  const loadAffiliateData = () => {
    try {
      // Load current affiliate ID (if user is an affiliate)
      const storedAffiliateId = localStorage.getItem('userAffiliateId');
      if (storedAffiliateId) {
        setAffiliateId(storedAffiliateId);
        generateReferrerCode(storedAffiliateId);
      }

      // Load referrer information
      const storedReferrer = localStorage.getItem('affiliateReferrer');
      if (storedReferrer) {
        // Don't override if we already have a referrer this session
        if (!sessionStorage.getItem('affiliateReferrerSet')) {
          setReferrerCode(storedReferrer);
        }
      }

      // Load commissions
      const storedCommissions = localStorage.getItem('affiliateCommissions');
      if (storedCommissions) {
        setCommissions(JSON.parse(storedCommissions));
      }

      // Load sales
      const storedSales = localStorage.getItem('affiliateSales');
      if (storedSales) {
        setSales(JSON.parse(storedSales));
      }

      // Calculate stats
      calculateStats();
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    }
  };

  const generateReferrerCode = (id: string) => {
    // Generate a unique referrer code for the affiliate
    const code = `${id}_${Date.now().toString(36)}`;
    setReferrerCode(code);
  };

  const setAffiliateReferrer = (refId: string) => {
    // Set the referrer for commission tracking
    localStorage.setItem('affiliateReferrer', refId);
    sessionStorage.setItem('affiliateReferrerSet', 'true');
    
    // Track click-through
    const clickThroughs = JSON.parse(localStorage.getItem('affiliateClickThroughs') || '[]');
    clickThroughs.push({
      affiliateId: refId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      source: document.referrer || 'direct'
    });
    localStorage.setItem('affiliateClickThroughs', JSON.stringify(clickThroughs));
  };

  const getAffiliateLink = (page: string = '/'): string => {
    if (!affiliateId) return window.location.origin + page;
    
    const baseUrl = window.location.origin;
    const url = new URL(page, baseUrl);
    url.searchParams.set('ref', affiliateId);
    return url.toString();
  };

  const trackCommission = (purchaseData: any) => {
    if (!purchaseData.affiliate) return;

    const commission: AffiliateCommission = {
      id: `comm_${Date.now()}`,
      affiliateId: purchaseData.affiliate.id,
      purchaseId: purchaseData.purchaseId,
      customer: purchaseData.customer.email,
      plan: purchaseData.toRole,
      commission: purchaseData.affiliate.commission,
      rate: purchaseData.affiliate.rate,
      date: purchaseData.purchaseDate,
      status: 'pending'
    };

    const sale: AffiliateSale = {
      id: `sale_${Date.now()}`,
      customerId: purchaseData.purchaseId,
      customerEmail: purchaseData.customer.email,
      plan: purchaseData.toRole,
      amount: purchaseData.price,
      commission: purchaseData.affiliate.commission,
      date: purchaseData.purchaseDate,
      status: 'active'
    };

    // Update state
    setCommissions(prev => [...prev, commission]);
    setSales(prev => [...prev, sale]);

    // Store in localStorage
    const existingCommissions = JSON.parse(localStorage.getItem('affiliateCommissions') || '[]');
    const existingSales = JSON.parse(localStorage.getItem('affiliateSales') || '[]');
    
    existingCommissions.push(commission);
    existingSales.push(sale);
    
    localStorage.setItem('affiliateCommissions', JSON.stringify(existingCommissions));
    localStorage.setItem('affiliateSales', JSON.stringify(existingSales));

    // Recalculate stats
    calculateStats();
  };

  const calculateStats = () => {
    const commissionsData = JSON.parse(localStorage.getItem('affiliateCommissions') || '[]');
    const salesData = JSON.parse(localStorage.getItem('affiliateSales') || '[]');
    const clickData = JSON.parse(localStorage.getItem('affiliateClickThroughs') || '[]');

    const totalCommissions = commissionsData.reduce((sum: number, c: AffiliateCommission) => sum + c.commission, 0);
    const pendingCommissions = commissionsData
      .filter((c: AffiliateCommission) => c.status === 'pending')
      .reduce((sum: number, c: AffiliateCommission) => sum + c.commission, 0);
    const paidCommissions = commissionsData
      .filter((c: AffiliateCommission) => c.status === 'paid')
      .reduce((sum: number, c: AffiliateCommission) => sum + c.commission, 0);

    const totalSales = salesData.length;
    const activeSales = salesData.filter((s: AffiliateSale) => s.status === 'active').length;
    const clickThroughs = clickData.length;
    const conversionRate = clickThroughs > 0 ? (totalSales / clickThroughs) * 100 : 0;

    setStats({
      totalCommissions,
      pendingCommissions,
      paidCommissions,
      totalSales,
      activeSales,
      clickThroughs,
      conversionRate
    });
  };

  const getCommissionHistory = (): AffiliateCommission[] => {
    return commissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getSalesHistory = (): AffiliateSale[] => {
    return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const refreshStats = () => {
    loadAffiliateData();
  };

  return (
    <AffiliateContext.Provider
      value={{
        affiliateId,
        referrerCode,
        commissions,
        sales,
        stats,
        setAffiliateReferrer,
        getAffiliateLink,
        trackCommission,
        getCommissionHistory,
        getSalesHistory,
        refreshStats
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
}

export function useAffiliate() {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
}

// Helper function to initialize affiliate ID for users with affiliate access
export const initializeAffiliateId = (userId: string) => {
  const affiliateId = `AF${userId}${Date.now().toString(36).slice(-4).toUpperCase()}`;
  localStorage.setItem('userAffiliateId', affiliateId);
  return affiliateId;
};