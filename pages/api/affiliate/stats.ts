import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data - replace with real database queries
const mockFunnelData = [
  {
    id: 'funnel_1',
    name: '$1 Orderform - Marissa Funnel Branding',
    visits: 342,
    uniqueVisits: 298,
    signups: 45,
    sales: 12,
    revenue: 1247.50,
    conversionRate: 15.1,
    salesConversionRate: 3.5,
    avgOrderValue: 103.96,
    trend: 'up',
    trendPercentage: 12.5
  },
  {
    id: 'funnel_2',
    name: 'VSL - Kristen Braun - Free Trial',
    visits: 892,
    uniqueVisits: 756,
    signups: 89,
    sales: 23,
    revenue: 2856.75,
    conversionRate: 11.8,
    salesConversionRate: 2.6,
    avgOrderValue: 124.23,
    trend: 'up',
    trendPercentage: 8.3
  },
  {
    id: 'funnel_3',
    name: 'Order Form - Free Registration (No Card)',
    visits: 1247,
    uniqueVisits: 1089,
    signups: 248,
    sales: 48,
    revenue: 4756.80,
    conversionRate: 22.8,
    salesConversionRate: 3.9,
    avgOrderValue: 99.10,
    trend: 'down',
    trendPercentage: -3.2
  },
  {
    id: 'funnel_4',
    name: 'VSL - Ashley Krooks 2024 - Free Trial',
    visits: 567,
    uniqueVisits: 489,
    signups: 67,
    sales: 15,
    revenue: 1890.25,
    conversionRate: 13.7,
    salesConversionRate: 2.6,
    avgOrderValue: 126.02,
    trend: 'up',
    trendPercentage: 15.7
  },
  {
    id: 'funnel_5',
    name: 'OE Annual Special',
    visits: 234,
    uniqueVisits: 198,
    signups: 32,
    sales: 8,
    revenue: 2384.00,
    conversionRate: 13.7,
    salesConversionRate: 3.4,
    avgOrderValue: 298.00,
    trend: 'up',
    trendPercentage: 25.3
  }
];

const trafficSourceData = [
  { name: 'Direct', value: 35, color: '#3B82F6' },
  { name: 'Organic Search', value: 28, color: '#10B981' },
  { name: 'Social Media', value: 22, color: '#F59E0B' },
  { name: 'Paid Ads', value: 10, color: '#EF4444' },
  { name: 'Referral', value: 5, color: '#8B5CF6' }
];

// Generate revenue data based on date range
const generateRevenueData = (dateRange: string) => {
  const days = dateRange === 'today' ? 1 : 
               dateRange === '7days' ? 7 :
               dateRange === '30days' ? 30 :
               dateRange === '90days' ? 90 : 7;

  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic data with some variation
    const baseRevenue = 2000 + Math.random() * 3000;
    const baseVisits = 800 + Math.random() * 600;
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue),
      visits: Math.round(baseVisits)
    });
  }
  
  return data;
};

interface StatsResponse {
  funnels: typeof mockFunnelData;
  trafficSources: typeof trafficSourceData;
  revenueData: ReturnType<typeof generateRevenueData>;
  summary: {
    totalRevenue: number;
    totalVisits: number;
    totalSignups: number;
    avgConversionRate: number;
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<StatsResponse | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { dateRange = '7days', funnel = 'all' } = req.query;

    // Filter funnels if specific funnel is requested
    let filteredFunnels = mockFunnelData;
    if (funnel !== 'all' && typeof funnel === 'string') {
      filteredFunnels = mockFunnelData.filter(f => f.id === funnel);
    }

    // Calculate summary metrics
    const totalRevenue = filteredFunnels.reduce((sum, f) => sum + f.revenue, 0);
    const totalVisits = filteredFunnels.reduce((sum, f) => sum + f.visits, 0);
    const totalSignups = filteredFunnels.reduce((sum, f) => sum + f.signups, 0);
    const avgConversionRate = filteredFunnels.length > 0 
      ? filteredFunnels.reduce((sum, f) => sum + f.conversionRate, 0) / filteredFunnels.length 
      : 0;

    // Generate revenue data based on date range
    const revenueData = generateRevenueData(dateRange as string);

    const response: StatsResponse = {
      funnels: filteredFunnels,
      trafficSources: trafficSourceData,
      revenueData,
      summary: {
        totalRevenue: Math.round(totalRevenue),
        totalVisits,
        totalSignups,
        avgConversionRate: Math.round(avgConversionRate * 10) / 10
      }
    };

    // Simulate API delay
    setTimeout(() => {
      res.status(200).json(response);
    }, 500);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}