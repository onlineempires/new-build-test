import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  BarChart3, 
  Settings, 
  Users, 
  ExternalLink, 
  TrendingUp,
  FileText,
  Target
} from 'lucide-react';

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  external?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  href,
  icon,
  title,
  description,
  color,
  external = false
}) => {
  const colorClasses = {
    blue: 'hover:border-blue-300 group-hover:bg-blue-100 text-blue-600 group-hover:text-blue-700',
    green: 'hover:border-green-300 group-hover:bg-green-100 text-green-600 group-hover:text-green-700',
    purple: 'hover:border-purple-300 group-hover:bg-purple-100 text-purple-600 group-hover:text-purple-700',
    orange: 'hover:border-orange-300 group-hover:bg-orange-100 text-orange-600 group-hover:text-orange-700',
  };

  const iconBgClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  const buttonColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <Link href={href}>
      <div className={`
        bg-white p-6 rounded-xl shadow-sm border border-gray-200 
        hover:shadow-md transition-all cursor-pointer group
        ${colorClasses[color]}
      `}>
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-full transition-colors
            ${iconBgClasses[color]}
          `}>
            {icon}
          </div>
          {external && (
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700">
          {description}
        </p>
        
        <div className={`
          flex items-center text-sm font-medium transition-colors
          ${buttonColorClasses[color]}
        `}>
          Get Started
          <ExternalLink className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

interface QuickActionsProps {
  loading?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuickAction
        href="/affiliate/funnels/create"
        icon={<Plus className="w-6 h-6" />}
        title="Create New Funnel"
        description="Build a new affiliate marketing funnel to capture leads and drive conversions."
        color="blue"
      />
      
      <QuickAction
        href="/affiliate/funnels"
        icon={<Settings className="w-6 h-6" />}
        title="Manage Funnels"
        description="View, edit, and optimize your existing affiliate marketing funnels."
        color="green"
        external
      />
      
      <QuickAction
        href="/stats?section=affiliate"
        icon={<BarChart3 className="w-6 h-6" />}
        title="View Analytics"
        description="Track performance metrics, conversion rates, and revenue data."
        color="purple"
        external
      />
      
      <QuickAction
        href="/affiliate/leads"
        icon={<Users className="w-6 h-6" />}
        title="Lead Management"
        description="Manage your leads and track them through the sales funnel."
        color="orange"
        external
      />
    </div>
  );
};

export default QuickActions;