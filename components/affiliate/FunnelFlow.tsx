import React from 'react';
import { 
  ArrowDown,
  Eye,
  MousePointer,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Lightbulb
} from 'lucide-react';

interface FunnelStep {
  id: string;
  name: string;
  visitors: number;
  conversionRate: number;
  dropOffRate: number;
  icon: React.ReactNode;
  color: string;
  recommendations?: string[];
}

interface FunnelFlowProps {
  steps: FunnelStep[];
  totalVisitors: number;
  loading?: boolean;
}

export const FunnelFlow: React.FC<FunnelFlowProps> = ({
  steps,
  totalVisitors,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                {index < 4 && <div className="h-8 bg-gray-200 rounded w-full"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getDropOffSeverity = (dropOffRate: number) => {
    if (dropOffRate > 70) return { color: 'text-red-600', severity: 'high' };
    if (dropOffRate > 50) return { color: 'text-yellow-600', severity: 'medium' };
    return { color: 'text-green-600', severity: 'low' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Conversion Funnel Flow</h3>
          <p className="text-sm text-gray-500">
            Step-by-step user journey and conversion analysis
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {totalVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Visitors</div>
        </div>
      </div>

      <div className="space-y-1">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1;
          const dropOffSeverity = getDropOffSeverity(step.dropOffRate);
          const nextStep = steps[index + 1];

          return (
            <div key={step.id}>
              {/* Step Content */}
              <div className={`
                relative p-4 rounded-lg border-2 transition-all hover:shadow-md
                ${step.conversionRate >= 80 ? 'border-green-200 bg-green-50' :
                  step.conversionRate >= 50 ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }
              `}>
                <div className="flex items-center justify-between">
                  {/* Left Side - Step Info */}
                  <div className="flex items-center flex-1">
                    <div className={`
                      p-3 rounded-full mr-4 ${step.color}
                    `}>
                      {step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-semibold text-gray-900 mr-2">
                          Step {index + 1}: {step.name}
                        </h4>
                        {step.recommendations && step.recommendations.length > 0 && (
                          <div className="group relative">
                            <Lightbulb className="w-4 h-4 text-yellow-500 cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <div className="font-medium mb-1">Optimization Tips:</div>
                              <ul className="text-xs space-y-1">
                                {step.recommendations.map((rec, i) => (
                                  <li key={i}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          {step.visitors.toLocaleString()} visitors
                        </span>
                        <span className={`font-medium ${
                          step.conversionRate >= 80 ? 'text-green-600' :
                          step.conversionRate >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {step.conversionRate.toFixed(1)}% conversion
                        </span>
                        {step.dropOffRate > 0 && (
                          <span className={`font-medium ${dropOffSeverity.color}`}>
                            {step.dropOffRate.toFixed(1)}% drop-off
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Metrics */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {((step.visitors / totalVisitors) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">of total</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        step.conversionRate >= 80 ? 'bg-green-500' :
                        step.conversionRate >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(step.visitors / totalVisitors) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Flow Arrow and Drop-off Analysis */}
              {!isLastStep && nextStep && (
                <div className="relative flex flex-col items-center py-2">
                  {/* Drop-off Indicator */}
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <div className={`
                      flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${dropOffSeverity.severity === 'high' ? 'bg-red-100 text-red-800' :
                        dropOffSeverity.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }
                    `}>
                      {dropOffSeverity.severity === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {dropOffSeverity.severity === 'medium' && <TrendingDown className="w-3 h-3 mr-1" />}
                      <span>
                        {(step.visitors - nextStep.visitors).toLocaleString()} visitors lost
                      </span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center">
                    <ArrowDown className="w-6 h-6 text-gray-400" />
                    <div className="w-px h-4 bg-gray-300"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {(((steps[steps.length - 1]?.visitors || 0) / totalVisitors) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Overall Conversion Rate</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-red-600">
              {steps.reduce((sum, step) => sum + (step.visitors * (step.dropOffRate / 100)), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Drop-offs</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {steps.length}
            </div>
            <div className="text-sm text-gray-600">Funnel Steps</div>
          </div>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Optimization Opportunities</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {steps
                .filter(step => step.recommendations && step.recommendations.length > 0)
                .slice(0, 3)
                .map((step, index) => (
                  <li key={index}>
                    • <strong>{step.name}:</strong> {step.recommendations?.[0]}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelFlow;