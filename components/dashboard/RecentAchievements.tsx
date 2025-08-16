import { useState } from 'react';

interface RecentAchievementsProps {
  achievements: string[];
}

export default function RecentAchievements({ achievements }: RecentAchievementsProps) {
  const [showAll, setShowAll] = useState(false);
  const getAchievementData = (achievement: string) => {
    const lower = achievement.toLowerCase();
    
    if (lower.includes('completed')) {
      return {
        icon: 'fas fa-check-circle',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-100'
      };
    }
    if (lower.includes('earned') && lower.includes('xp')) {
      return {
        icon: 'fas fa-star',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-100'
      };
    }
    if (lower.includes('streak')) {
      return {
        icon: 'fas fa-fire',
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-100'
      };
    }
    if (lower.includes('commission')) {
      return {
        icon: 'fas fa-dollar-sign',
        iconColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100'
      };
    }
    
    return {
      icon: 'fas fa-trophy',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    };
  };

  if (!achievements || achievements.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-trophy text-gray-400 text-xl"></i>
        </div>
        <h3 className="font-bold text-gray-900 mb-1">No Achievements Yet</h3>
        <p className="text-sm text-gray-500">Complete courses to start earning achievements!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
          <i className="fas fa-trophy text-yellow-600 text-lg"></i>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Achievements</h2>
          <p className="text-xs sm:text-sm text-gray-600">{achievements.length} milestone{achievements.length !== 1 ? 's' : ''} unlocked</p>
        </div>
      </div>
      
      {/* Achievements List - Mobile Optimized */}
      <div className="space-y-2 sm:space-y-3">
        {(showAll ? achievements : achievements.slice(-3)).map((achievement, index, array) => {
          const originalIndex = showAll ? index : achievements.length - 3 + index;
          const data = getAchievementData(achievement);
          return (
            <div 
              key={originalIndex} 
              className={`flex items-center p-3 sm:p-4 rounded-xl border ${data.borderColor} ${data.bgColor} hover:shadow-sm transition-all duration-200 group`}
            >
              {/* Achievement Icon */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                <i className={`${data.icon} ${data.iconColor} text-lg sm:text-xl`}></i>
              </div>
              
              {/* Achievement Text */}
              <div className="min-w-0 flex-1">
                <span className="text-sm sm:text-base font-medium text-gray-900 block leading-relaxed">
                  {achievement}
                </span>
              </div>
              
              {/* New Badge for most recent achievements */}
              {originalIndex >= achievements.length - 2 && (
                <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold ml-2">
                  NEW
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Show More/Less Button */}
      {achievements.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {showAll ? (
              <>
                <i className="fas fa-chevron-up mr-2"></i>
                Show Less
              </>
            ) : (
              <>
                <i className="fas fa-chevron-down mr-2"></i>
                Show More ({achievements.length - 3} more)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}