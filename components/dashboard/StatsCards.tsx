import {
  AcademicCapIcon,
  FireIcon,
  BanknotesIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

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
      icon: AcademicCapIcon,
      label: 'Courses Completed',
      value: `${stats.coursesCompleted}/${stats.coursesTotal}`,
      bgColor: 'bg-blue-100',
    },
    {
      icon: FireIcon,
      label: 'Learning Streak',
      value: `${stats.learningStreakDays} days`,
      bgColor: 'bg-green-100',
    },
    {
      icon: BanknotesIcon,
      label: 'Commissions Earned',
      value: formatCurrency(stats.commissions),
      bgColor: 'bg-yellow-100',
    },
    {
      icon: UserPlusIcon,
      label: 'New Leads',
      value: stats.newLeads.toString(),
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center">
              <IconComponent className="h-5 w-5 text-gray-400 mr-3" />
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}