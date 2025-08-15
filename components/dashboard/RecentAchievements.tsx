interface RecentAchievementsProps {
  achievements: string[];
}

export default function RecentAchievements({ achievements }: RecentAchievementsProps) {
  const getAchievementIcon = (achievement: string) => {
    if (achievement.toLowerCase().includes('completed')) return '✅';
    if (achievement.toLowerCase().includes('earned') && achievement.toLowerCase().includes('xp')) return '⭐';
    if (achievement.toLowerCase().includes('streak')) return '🔥';
    if (achievement.toLowerCase().includes('commission')) return '💰';
    return '🏆';
  };

  const getAchievementColor = (achievement: string) => {
    if (achievement.toLowerCase().includes('completed')) return 'bg-green-50 border-green-200';
    if (achievement.toLowerCase().includes('earned') && achievement.toLowerCase().includes('xp')) return 'bg-yellow-50 border-yellow-200';
    if (achievement.toLowerCase().includes('streak')) return 'bg-orange-50 border-orange-200';
    if (achievement.toLowerCase().includes('commission')) return 'bg-emerald-50 border-emerald-200';
    return 'bg-purple-50 border-purple-200';
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-6">
        <span className="text-xl mr-2">🏆</span>
        <h2 className="text-xl font-semibold">Recent Achievements</h2>
      </div>
      
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div key={index} className={`flex items-center p-4 rounded-lg border ${getAchievementColor(achievement)}`}>
            <span className="text-2xl mr-4">{getAchievementIcon(achievement)}</span>
            <span className="text-gray-800">{achievement}</span>
          </div>
        ))}
      </div>
    </div>
  );
}