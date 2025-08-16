interface Stats {
  coursesCompleted: number;
  coursesTotal: number;
  learningStreakDays: number;
  commissions: number;
  newLeads: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
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
      iconClass: 'fas fa-dollar-sign',
      label: 'Commissions Earned',
      value: formatCurrency(stats.commissions),
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-100',
    },
    {
      iconClass: 'fas fa-user-plus',
      label: 'New Leads',
      value: stats.newLeads.toString(),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
  ];

  return (
    <>
      {/* Mobile Layout - Horizontal scroll */}
      <div className="sm:hidden mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl p-3 shadow-sm border ${card.borderColor} flex-shrink-0 w-32`}
            >
              <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                <i className={`${card.iconClass} ${card.iconColor} text-sm`}></i>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 leading-tight truncate">{card.value}</div>
                <div className="text-xs text-gray-600 font-medium leading-tight">{card.label}</div>
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
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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