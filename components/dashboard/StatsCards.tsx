interface Stats {
  coursesCompleted: number;
  coursesTotal: number;
  learningStreakDays: number;
  commissions: number;
  newLeads: number;
  xpPoints: number;
  level: string;
}

interface StatsCardsProps {
  stats: Stats;
}

import React from 'react';

function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      iconClass: 'fas fa-graduation-cap',
      label: 'Courses Completed',
      value: `${stats.coursesCompleted}/${stats.coursesTotal}`,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      iconClass: 'fas fa-fire',
      label: 'Learning Streak',
      value: `${stats.learningStreakDays} days`,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    {
      iconClass: 'fas fa-star',
      label: 'Experience Points',
      value: `${stats.xpPoints.toLocaleString()} XP`,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
    {
      iconClass: 'fas fa-trophy',
      label: 'Current Level',
      value: stats.level,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
  ];

  return (
    <>
      {/* Mobile Layout - Horizontal snap scroll */}
      <div className="sm:hidden mb-6">        
        <div className="flex gap-3 overflow-x-auto snap-x px-2 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl p-4 shadow-sm border ${card.borderColor} min-w-[220px] snap-start relative`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center mr-3 shadow-sm`}>
                  <i className={`${card.iconClass} ${card.iconColor} text-base`}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xl font-bold text-gray-900 truncate">{card.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{card.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-6 sm:mb-8">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-xl p-6 shadow-sm border ${card.borderColor} hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 ${card.bgColor} rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
                <i className={`${card.iconClass} ${card.iconColor} text-xl lg:text-2xl`}></i>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">{card.value}</div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default React.memo(StatsCards);