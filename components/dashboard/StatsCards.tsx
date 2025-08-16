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
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      iconClass: 'fas fa-fire',
      label: 'Learning Streak',
      value: `${stats.learningStreakDays} days`,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      iconClass: 'fas fa-dollar-sign',
      label: 'Commissions Earned',
      value: formatCurrency(stats.commissions),
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      iconClass: 'fas fa-user-plus',
      label: 'New Leads',
      value: stats.newLeads.toString(),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <>
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                <i className={`${card.iconClass} ${card.iconColor} text-xl`}></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}