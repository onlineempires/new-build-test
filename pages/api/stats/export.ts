import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data - same as affiliate stats but for export
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

const generateCSV = (data: typeof mockFunnelData, type: string = 'affiliate') => {
  if (type === 'affiliate') {
    const headers = [
      'Funnel ID',
      'Funnel Name',
      'Visits',
      'Unique Visits',
      'Signups',
      'Sales',
      'Revenue',
      'Conversion Rate (%)',
      'Sales Conversion Rate (%)',
      'Average Order Value',
      'Trend',
      'Trend Percentage (%)'
    ];

    const rows = data.map(funnel => [
      funnel.id,
      `"${funnel.name}"`, // Wrap in quotes to handle commas
      funnel.visits,
      funnel.uniqueVisits,
      funnel.signups,
      funnel.sales,
      funnel.revenue.toFixed(2),
      funnel.conversionRate.toFixed(1),
      funnel.salesConversionRate.toFixed(1),
      funnel.avgOrderValue.toFixed(2),
      funnel.trend,
      funnel.trendPercentage.toFixed(1)
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  }

  // Default export format
  return 'No data available for export';
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dateRange = '7days', format = 'csv', type = 'affiliate' } = req.query;

    if (format !== 'csv') {
      return res.status(400).json({ error: 'Only CSV format is currently supported' });
    }

    // Filter data based on type and date range
    let filteredData = mockFunnelData;
    
    // Generate CSV
    const csvContent = generateCSV(filteredData, type as string);
    
    // Set headers for file download
    const filename = `${type}-stats-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('Export API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}