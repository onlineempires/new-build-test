import React, { useState } from 'react';
import { 
  TestTube,
  Plus,
  Play,
  Pause,
  Trophy,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  Calendar,
  Award
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused' | 'draft';
  variantA: {
    name: string;
    visits: number;
    conversions: number;
    conversionRate: number;
  };
  variantB: {
    name: string;
    visits: number;
    conversions: number;
    conversionRate: number;
  };
  winner?: 'A' | 'B' | null;
  confidence: number;
  startDate: string;
  endDate?: string;
  testType: 'headline' | 'button' | 'layout' | 'copy';
}

interface ABTestPanelProps {
  tests: ABTest[];
  onCreateTest?: () => void;
  onToggleTest?: (testId: string) => void;
  onSelectWinner?: (testId: string, winner: 'A' | 'B') => void;
  loading?: boolean;
}

export const ABTestPanel: React.FC<ABTestPanelProps> = ({
  tests,
  onCreateTest,
  onToggleTest,
  onSelectWinner,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'headline':
        return 'bg-purple-100 text-purple-800';
      case 'button':
        return 'bg-orange-100 text-orange-800';
      case 'layout':
        return 'bg-blue-100 text-blue-800';
      case 'copy':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTests = tests.filter(test => {
    switch (activeTab) {
      case 'active':
        return test.status === 'running' || test.status === 'paused';
      case 'completed':
        return test.status === 'completed';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">A/B Testing</h3>
          <p className="text-sm text-gray-500">
            Optimize your funnel with split testing
          </p>
        </div>
        
        {onCreateTest && (
          <button
            onClick={onCreateTest}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Test
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {(['active', 'completed', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === tab 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Tests
            <span className="ml-2 text-xs">
              ({tests.filter(t => {
                if (tab === 'active') return t.status === 'running' || t.status === 'paused';
                if (tab === 'completed') return t.status === 'completed';
                return true;
              }).length})
            </span>
          </button>
        ))}
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div key={test.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <TestTube className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${getStatusColor(test.status)}
                    `}>
                      {test.status === 'running' && <Play className="w-3 h-3 mr-1" />}
                      {test.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
                      {test.status === 'completed' && <Trophy className="w-3 h-3 mr-1" />}
                      {test.status.toUpperCase()}
                    </span>
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${getTestTypeColor(test.testType)}
                    `}>
                      {test.testType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Started {new Date(test.startDate).toLocaleDateString()}
                    {test.endDate && ` • Ended ${new Date(test.endDate).toLocaleDateString()}`}
                  </div>
                </div>
              </div>

              {test.status === 'completed' && test.winner && (
                <div className="flex items-center text-green-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Winner: Variant {test.winner}</span>
                </div>
              )}
            </div>

            {/* Variants Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Variant A */}
              <div className={`
                p-4 rounded-lg border-2 transition-all
                ${test.winner === 'A' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}
              `}>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{test.variantA.name}</h5>
                  {test.winner === 'A' && (
                    <div className="flex items-center text-green-600">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">WINNER</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      Visits
                    </span>
                    <span className="font-semibold">{test.variantA.visits.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <MousePointer className="w-3 h-3 mr-1" />
                      Conversions
                    </span>
                    <span className="font-semibold">{test.variantA.conversions.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      Conv. Rate
                    </span>
                    <span className={`font-semibold ${
                      test.variantA.conversionRate > test.variantB.conversionRate 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                    }`}>
                      {test.variantA.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Variant B */}
              <div className={`
                p-4 rounded-lg border-2 transition-all
                ${test.winner === 'B' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}
              `}>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{test.variantB.name}</h5>
                  {test.winner === 'B' && (
                    <div className="flex items-center text-green-600">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">WINNER</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      Visits
                    </span>
                    <span className="font-semibold">{test.variantB.visits.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <MousePointer className="w-3 h-3 mr-1" />
                      Conversions
                    </span>
                    <span className="font-semibold">{test.variantB.conversions.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      Conv. Rate
                    </span>
                    <span className={`font-semibold ${
                      test.variantB.conversionRate > test.variantA.conversionRate 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                    }`}>
                      {test.variantB.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Statistics */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span>Confidence: </span>
                  <span className={`ml-1 font-medium ${
                    test.confidence >= 95 ? 'text-green-600' : 
                    test.confidence >= 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {test.confidence}%
                  </span>
                </div>
                
                {test.variantA.conversionRate !== test.variantB.conversionRate && (
                  <div className="flex items-center">
                    {test.variantA.conversionRate > test.variantB.conversionRate ? (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span>
                      {Math.abs(test.variantA.conversionRate - test.variantB.conversionRate).toFixed(1)}% difference
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {test.status === 'running' && test.confidence >= 95 && !test.winner && onSelectWinner && (
                  <>
                    <button
                      onClick={() => onSelectWinner(test.id, 'A')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Select A
                    </button>
                    <button
                      onClick={() => onSelectWinner(test.id, 'B')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Select B
                    </button>
                  </>
                )}
                
                {onToggleTest && test.status !== 'completed' && (
                  <button
                    onClick={() => onToggleTest(test.id)}
                    className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                      test.status === 'running'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {test.status === 'running' ? 'Pause' : 'Resume'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredTests.length === 0 && (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TestTube className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">
              No {activeTab === 'all' ? '' : activeTab} tests yet
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Create A/B tests to optimize your funnel performance
            </p>
            {onCreateTest && (
              <button
                onClick={onCreateTest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Test
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ABTestPanel;