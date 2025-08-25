import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '../../components/layout/AppLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Lead, 
  Sale, 
  AnalyticsData,
  ConversionFunnel,
  PerformanceMetrics,
  LeadSourceAnalytics,
  TimeSeriesData,
  CohortAnalysis
} from '../../types/crm';

interface AnalyticsState {
  activeTab: 'overview' | 'funnel' | 'sources' | 'cohorts' | 'forecasting';
  dateRange: '7d' | '30d' | '90d' | '365d' | 'custom';
  customDateStart: string;
  customDateEnd: string;
  selectedMetric: 'revenue' | 'conversions' | 'leads' | 'engagement';
  comparison: 'none' | 'previous_period' | 'previous_year';
}

const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [state, setState] = useState<AnalyticsState>({
    activeTab: 'overview',
    dateRange: '30d',
    customDateStart: '',
    customDateEnd: '',
    selectedMetric: 'revenue',
    comparison: 'previous_period'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLeads: 0,
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgDealSize: 0,
    avgSalesCycle: 0,
    leadSources: [],
    conversionFunnel: [],
    timeSeriesData: [],
    cohortAnalysis: null,
    performanceMetrics: {
      leadsGrowthRate: 0,
      revenueGrowthRate: 0,
      conversionRateChange: 0,
      avgDealSizeChange: 0,
      customerAcquisitionCost: 0,
      customerLifetimeValue: 0,
      returnOnInvestment: 0
    }
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        // Mock analytics data based on selected date range
        const mockAnalytics: AnalyticsData = {
          totalLeads: 1247,
          totalSales: 156,
          totalRevenue: 47840,
          conversionRate: 0.125,
          avgDealSize: 307,
          avgSalesCycle: 14.5,
          leadSources: [
            {
              source: 'Google Ads',
              leads: 423,
              sales: 67,
              revenue: 20590,
              conversionRate: 0.158,
              cost: 8900,
              roi: 1.31
            },
            {
              source: 'Facebook Ads',
              leads: 356,
              sales: 45,
              revenue: 13830,
              conversionRate: 0.126,
              cost: 6200,
              roi: 1.23
            },
            {
              source: 'Instagram',
              leads: 234,
              sales: 28,
              revenue: 8596,
              conversionRate: 0.120,
              cost: 3400,
              roi: 1.53
            },
            {
              source: 'Email Marketing',
              leads: 156,
              sales: 12,
              revenue: 3690,
              conversionRate: 0.077,
              cost: 800,
              roi: 3.61
            },
            {
              source: 'Organic',
              leads: 78,
              sales: 4,
              revenue: 1234,
              conversionRate: 0.051,
              cost: 0,
              roi: Infinity
            }
          ],
          conversionFunnel: [
            {
              stage: 'Visitors',
              count: 12470,
              conversionRate: 1.0,
              dropOffRate: 0
            },
            {
              stage: 'Leads',
              count: 1247,
              conversionRate: 0.10,
              dropOffRate: 0.90
            },
            {
              stage: 'Qualified',
              count: 623,
              conversionRate: 0.50,
              dropOffRate: 0.50
            },
            {
              stage: 'Proposal',
              count: 312,
              conversionRate: 0.50,
              dropOffRate: 0.50
            },
            {
              stage: 'Negotiation',
              count: 187,
              conversionRate: 0.60,
              dropOffRate: 0.40
            },
            {
              stage: 'Closed Won',
              count: 156,
              conversionRate: 0.83,
              dropOffRate: 0.17
            }
          ],
          timeSeriesData: generateTimeSeriesData(state.dateRange),
          cohortAnalysis: {
            periods: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            cohorts: [
              {
                cohortLabel: 'Jan 2024',
                totalUsers: 120,
                retentionRates: [1.0, 0.65, 0.42, 0.31]
              },
              {
                cohortLabel: 'Feb 2024',
                totalUsers: 145,
                retentionRates: [1.0, 0.71, 0.48, 0.35]
              },
              {
                cohortLabel: 'Mar 2024',
                totalUsers: 167,
                retentionRates: [1.0, 0.68, 0.44, 0.33]
              }
            ]
          },
          performanceMetrics: {
            leadsGrowthRate: 0.23,
            revenueGrowthRate: 0.34,
            conversionRateChange: 0.08,
            avgDealSizeChange: 0.15,
            customerAcquisitionCost: 78,
            customerLifetimeValue: 920,
            returnOnInvestment: 2.85
          }
        };

        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [state.dateRange]);

  function generateTimeSeriesData(range: string): TimeSeriesData[] {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const data: TimeSeriesData[] = [];
    const baseDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        leads: Math.floor(Math.random() * 50) + 10,
        sales: Math.floor(Math.random() * 8) + 1,
        revenue: Math.floor(Math.random() * 2000) + 500,
        conversionRate: (Math.random() * 0.1) + 0.08
      });
    }
    
    return data;
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number, decimals = 1): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return { icon: '📈', color: 'text-green-600 dark:text-green-400', prefix: '+' };
    } else if (change < 0) {
      return { icon: '📉', color: 'text-red-600 dark:text-red-400', prefix: '' };
    }
    return { icon: '➡️', color: 'text-gray-600 dark:text-gray-400', prefix: '' };
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</h3>
            <div className="text-2xl">💰</div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(analytics.totalRevenue)}
            </p>
            <div className={`flex items-center space-x-1 ${getChangeIndicator(analytics.performanceMetrics.revenueGrowthRate).color}`}>
              <span>{getChangeIndicator(analytics.performanceMetrics.revenueGrowthRate).icon}</span>
              <span className="text-sm font-medium">
                {getChangeIndicator(analytics.performanceMetrics.revenueGrowthRate).prefix}
                {formatPercentage(Math.abs(analytics.performanceMetrics.revenueGrowthRate))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</h3>
            <div className="text-2xl">👥</div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatNumber(analytics.totalLeads)}
            </p>
            <div className={`flex items-center space-x-1 ${getChangeIndicator(analytics.performanceMetrics.leadsGrowthRate).color}`}>
              <span>{getChangeIndicator(analytics.performanceMetrics.leadsGrowthRate).icon}</span>
              <span className="text-sm font-medium">
                {getChangeIndicator(analytics.performanceMetrics.leadsGrowthRate).prefix}
                {formatPercentage(Math.abs(analytics.performanceMetrics.leadsGrowthRate))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</h3>
            <div className="text-2xl">🎯</div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatPercentage(analytics.conversionRate)}
            </p>
            <div className={`flex items-center space-x-1 ${getChangeIndicator(analytics.performanceMetrics.conversionRateChange).color}`}>
              <span>{getChangeIndicator(analytics.performanceMetrics.conversionRateChange).icon}</span>
              <span className="text-sm font-medium">
                {getChangeIndicator(analytics.performanceMetrics.conversionRateChange).prefix}
                {formatPercentage(Math.abs(analytics.performanceMetrics.conversionRateChange))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Deal Size</h3>
            <div className="text-2xl">💵</div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(analytics.avgDealSize)}
            </p>
            <div className={`flex items-center space-x-1 ${getChangeIndicator(analytics.performanceMetrics.avgDealSizeChange).color}`}>
              <span>{getChangeIndicator(analytics.performanceMetrics.avgDealSizeChange).icon}</span>
              <span className="text-sm font-medium">
                {getChangeIndicator(analytics.performanceMetrics.avgDealSizeChange).prefix}
                {formatPercentage(Math.abs(analytics.performanceMetrics.avgDealSizeChange))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Key Performance Indicators
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer Acquisition Cost</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(analytics.performanceMetrics.customerAcquisitionCost)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer Lifetime Value</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(analytics.performanceMetrics.customerLifetimeValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Return on Investment</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {analytics.performanceMetrics.returnOnInvestment.toFixed(2)}x
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">LTV:CAC Ratio</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {(analytics.performanceMetrics.customerLifetimeValue / analytics.performanceMetrics.customerAcquisitionCost).toFixed(1)}:1
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Revenue Trend
          </h3>
          <div className="h-64 flex items-end space-x-2">
            {analytics.timeSeriesData.slice(-30).map((data, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-t"
                style={{
                  height: `${(data.revenue / Math.max(...analytics.timeSeriesData.map(d => d.revenue))) * 100}%`,
                  minHeight: '4px'
                }}
                title={`${data.date}: ${formatCurrency(data.revenue)}`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{analytics.timeSeriesData[0]?.date}</span>
            <span>{analytics.timeSeriesData[analytics.timeSeriesData.length - 1]?.date}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFunnel = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Conversion Funnel
        </h3>
        
        <div className="space-y-4">
          {analytics.conversionFunnel.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {stage.stage}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(stage.count)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatPercentage(stage.conversionRate)} conversion
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${stage.conversionRate * 100}%` }}
                ></div>
              </div>
              
              {stage.dropOffRate > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {formatPercentage(stage.dropOffRate)} drop-off to next stage
                </p>
              )}
              
              {index < analytics.conversionFunnel.length - 1 && (
                <div className="flex justify-center mt-2 mb-2">
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Overall Conversion
            </h4>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatPercentage(analytics.conversionRate)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Visitors to customers
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Lead Quality
            </h4>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatPercentage(analytics.conversionFunnel[1]?.conversionRate || 0)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Visitors to leads
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Sales Efficiency
            </h4>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatPercentage((analytics.conversionFunnel[5]?.count || 0) / (analytics.conversionFunnel[1]?.count || 1))}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Leads to customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSources = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Lead Source Performance
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Source</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Leads</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Sales</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Conv. Rate</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Cost</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">ROI</th>
              </tr>
            </thead>
            <tbody>
              {analytics.leadSources.map((source, index) => (
                <tr key={source.source} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{
                        backgroundColor: ['#3B82F6', '#EF4444', '#8B5CF6', '#10B981', '#F59E0B'][index % 5]
                      }}></div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {source.source}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                    {formatNumber(source.leads)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                    {formatNumber(source.sales)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                    {formatCurrency(source.revenue)}
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${
                      source.conversionRate > 0.15 ? 'text-green-600 dark:text-green-400' :
                      source.conversionRate > 0.10 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {formatPercentage(source.conversionRate)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                    {source.cost > 0 ? formatCurrency(source.cost) : 'Free'}
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${
                      source.roi > 2 ? 'text-green-600 dark:text-green-400' :
                      source.roi > 1 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {source.roi === Infinity ? '∞' : `${source.roi.toFixed(2)}x`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Best Converting Source
            </h4>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {analytics.leadSources.reduce((best, source) => 
                source.conversionRate > best.conversionRate ? source : best
              ).source}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {formatPercentage(Math.max(...analytics.leadSources.map(s => s.conversionRate)))} conversion rate
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Highest ROI Source
            </h4>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {analytics.leadSources.reduce((best, source) => 
                source.roi > best.roi ? source : best
              ).source}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {Math.max(...analytics.leadSources.map(s => s.roi)) === Infinity ? '∞' : `${Math.max(...analytics.leadSources.map(s => s.roi)).toFixed(2)}x`} ROI
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Top Revenue Source
            </h4>
            <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {analytics.leadSources.reduce((best, source) => 
                source.revenue > best.revenue ? source : best
              ).source}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {formatCurrency(Math.max(...analytics.leadSources.map(s => s.revenue)))} revenue
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCohorts = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Cohort Analysis
        </h3>
        
        {analytics.cohortAnalysis && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Cohort</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Size</th>
                  {analytics.cohortAnalysis.periods.map((period, index) => (
                    <th key={period} className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analytics.cohortAnalysis.cohorts.map((cohort) => (
                  <tr key={cohort.cohortLabel} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {cohort.cohortLabel}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                      {cohort.totalUsers}
                    </td>
                    {cohort.retentionRates.map((rate, index) => (
                      <td key={index} className="text-right py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <span className={`font-medium ${
                            rate > 0.5 ? 'text-green-600 dark:text-green-400' :
                            rate > 0.3 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {formatPercentage(rate, 0)}
                          </span>
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                rate > 0.5 ? 'bg-green-500' :
                                rate > 0.3 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${rate * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            Insights
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• February cohort shows the highest week 2 retention at 71%</li>
            <li>• Average retention drops to ~33% by week 4 across all cohorts</li>
            <li>• Consider implementing re-engagement campaigns around week 3</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderForecasting = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Revenue Forecasting
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Next Month Forecast
            </h4>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(analytics.totalRevenue * 1.15)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              +15% projected growth
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Quarter Forecast
            </h4>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(analytics.totalRevenue * 3.4)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Based on current trends
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Annual Projection
            </h4>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatCurrency(analytics.totalRevenue * 14.5)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Conservative estimate
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">
            Recommendations
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
            <li>• <strong>Optimize Google Ads:</strong> Highest converting source with room for scaling</li>
            <li>• <strong>Improve Email Marketing:</strong> Lowest conversion rate but highest ROI potential</li>
            <li>• <strong>Focus on Lead Quality:</strong> 50% drop-off at qualification stage needs attention</li>
            <li>• <strong>Reduce Sales Cycle:</strong> Current 14.5 days could be optimized to increase velocity</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>CRM Analytics - Digital Era CRM</title>
        <meta name="description" content="Advanced analytics and performance insights for Digital Era CRM" />
      </Head>
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    CRM Analytics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Advanced insights and performance tracking
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={state.dateRange}
                    onChange={(e) => setState(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="365d">Last year</option>
                  </select>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <span>📊</span>
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {[
                    { id: 'overview', name: 'Overview', icon: '📊' },
                    { id: 'funnel', name: 'Conversion Funnel', icon: '🎯' },
                    { id: 'sources', name: 'Lead Sources', icon: '📈' },
                    { id: 'cohorts', name: 'Cohort Analysis', icon: '👥' },
                    { id: 'forecasting', name: 'Forecasting', icon: '🔮' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setState(prev => ({ ...prev, activeTab: tab.id as any }))}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        state.activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
              {state.activeTab === 'overview' && renderOverview()}
              {state.activeTab === 'funnel' && renderFunnel()}
              {state.activeTab === 'sources' && renderSources()}
              {state.activeTab === 'cohorts' && renderCohorts()}
              {state.activeTab === 'forecasting' && renderForecasting()}
            </div>
          </div>
    </AppLayout>
  );
};

export default AnalyticsPage;