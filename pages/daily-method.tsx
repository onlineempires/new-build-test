import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';

interface DMOTask {
  id: string;
  category: 'mindset' | 'content' | 'prospecting' | 'follow-up' | 'income';
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  points: number;
}

interface DMOStats {
  currentStreak: number;
  totalDays: number;
  totalPoints: number;
  completionRate: number;
  averageTime: number;
}

const DailyMethod: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<DMOTask[]>([]);
  const [stats, setStats] = useState<DMOStats>({
    currentStreak: 12,
    totalDays: 45,
    totalPoints: 1250,
    completionRate: 85,
    averageTime: 47
  });
  const [loading, setLoading] = useState(true);

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();

  // Mock DMO tasks
  const mockTasks: DMOTask[] = [
    {
      id: '1',
      category: 'mindset',
      title: 'Morning Affirmations',
      description: 'Start your day with 5 positive affirmations about your business goals',
      estimatedTime: 5,
      priority: 'high',
      completed: true,
      points: 10
    },
    {
      id: '2',
      category: 'mindset',
      title: 'Goal Visualization',
      description: 'Visualize achieving your monthly income goal for 10 minutes',
      estimatedTime: 10,
      priority: 'high',
      completed: true,
      points: 15
    },
    {
      id: '3',
      category: 'content',
      title: 'Create Social Media Post',
      description: 'Create and publish one valuable content post on your primary social platform',
      estimatedTime: 20,
      priority: 'high',
      completed: false,
      points: 25
    },
    {
      id: '4',
      category: 'content',
      title: 'Engage with Community',
      description: 'Comment meaningfully on 5 posts in your target audience groups',
      estimatedTime: 15,
      priority: 'medium',
      completed: false,
      points: 20
    },
    {
      id: '5',
      category: 'prospecting',
      title: 'Connect with 10 New Prospects',
      description: 'Send connection requests to 10 potential prospects on LinkedIn',
      estimatedTime: 25,
      priority: 'high',
      completed: false,
      points: 30
    },
    {
      id: '6',
      category: 'prospecting',
      title: 'Research Target Market',
      description: 'Spend 15 minutes researching your ideal customer demographics',
      estimatedTime: 15,
      priority: 'medium',
      completed: false,
      points: 20
    },
    {
      id: '7',
      category: 'follow-up',
      title: 'Follow Up with 5 Leads',
      description: 'Send personalized follow-up messages to 5 existing leads',
      estimatedTime: 20,
      priority: 'high',
      completed: false,
      points: 25
    },
    {
      id: '8',
      category: 'follow-up',
      title: 'Update CRM',
      description: 'Update your CRM with notes from all prospect interactions',
      estimatedTime: 10,
      priority: 'medium',
      completed: false,
      points: 15
    },
    {
      id: '9',
      category: 'income',
      title: 'Review Analytics',
      description: 'Check your funnel metrics and identify improvement opportunities',
      estimatedTime: 15,
      priority: 'medium',
      completed: false,
      points: 20
    },
    {
      id: '10',
      category: 'income',
      title: 'Income Producing Activity',
      description: 'Complete one direct income-producing activity (sales call, presentation, etc.)',
      estimatedTime: 30,
      priority: 'high',
      completed: false,
      points: 40
    }
  ];

  const categories = [
    { id: 'mindset', name: 'Mindset', icon: 'fas fa-brain', color: 'purple' },
    { id: 'content', name: 'Content', icon: 'fas fa-edit', color: 'blue' },
    { id: 'prospecting', name: 'Prospecting', icon: 'fas fa-search', color: 'green' },
    { id: 'follow-up', name: 'Follow-up', icon: 'fas fa-reply', color: 'orange' },
    { id: 'income', name: 'Income', icon: 'fas fa-dollar-sign', color: 'red' }
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const completedTasks = tasks.filter(task => task.completed);
  const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const totalEstimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const completedTime = completedTasks.reduce((sum, task) => sum + task.estimatedTime, 0);

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Daily Method (DMO) - Digital Era Learning Platform</title>
          <meta name="description" content="Your daily method of operations for consistent growth" />
        </Head>

        <AppLayout>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div 
              className="max-w-md w-full mx-4 p-8 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="mb-6">
                <i className="fas fa-lock text-6xl text-yellow-500 mb-4"></i>
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Premium Feature
                </h2>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Daily Method (DMO) is available for premium members only.
                </p>
              </div>
              <a
                href="/upgrade"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-on-primary)'
                }}
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Upgrade Now
              </a>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Daily Method (DMO) - Digital Era Learning Platform</title>
        <meta name="description" content="Your daily method of operations for consistent growth" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Daily Method (DMO)
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Your systematic approach to daily business growth activities.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Current Streak
                </h3>
                <i className="fas fa-fire text-orange-500"></i>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {stats.currentStreak} days
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Today's Progress
                </h3>
                <i className="fas fa-chart-line text-green-500"></i>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {completionPercentage}%
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Points Earned
                </h3>
                <i className="fas fa-star text-yellow-500"></i>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {totalPoints}
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Time Invested
                </h3>
                <i className="fas fa-clock text-blue-500"></i>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {completedTime}m
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="mb-8 p-6 rounded-lg border"
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Daily Progress
              </h2>
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {completedTasks.length} of {tasks.length} tasks completed
              </span>
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full h-3"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${completionPercentage}%`,
                  backgroundColor: 'var(--color-success)'
                }}
              />
            </div>
          </div>

          {/* Task Categories */}
          <div className="space-y-6">
            {categories.map(category => {
              const categoryTasks = tasks.filter(task => task.category === category.id);
              const completedCategoryTasks = categoryTasks.filter(task => task.completed);
              
              if (categoryTasks.length === 0) return null;

              return (
                <div 
                  key={category.id}
                  className="rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                          <i className={`${category.icon} text-${category.color}-600`}></i>
                        </div>
                        <div>
                          <h3 
                            className="font-semibold text-lg"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {category.name}
                          </h3>
                          <p 
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {completedCategoryTasks.length} of {categoryTasks.length} completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {completedCategoryTasks.reduce((sum, task) => sum + task.points, 0)} pts
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {completedCategoryTasks.reduce((sum, task) => sum + task.estimatedTime, 0)}m
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {categoryTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={handleTaskToggle}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational Footer */}
          <div 
            className="mt-8 p-6 rounded-lg text-center"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              💪 Keep Going! You're Building Success Daily
            </h3>
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Consistency is the key to achieving your goals. Every completed task brings you closer to your dreams.
            </p>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

// Task Card Component
interface TaskCardProps {
  task: DMOTask;
  onToggle: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'fas fa-exclamation-circle';
      case 'medium': return 'fas fa-minus-circle';
      case 'low': return 'fas fa-check-circle';
      default: return 'fas fa-circle';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border transition-all duration-200 ${
        task.completed ? 'opacity-75' : 'hover:shadow-md'
      }`}
      style={{ 
        backgroundColor: task.completed ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
            task.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {task.completed && (
            <i className="fas fa-check text-white text-xs"></i>
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 
              className={`font-medium ${task.completed ? 'line-through' : ''}`}
              style={{ color: 'var(--text-primary)' }}
            >
              {task.title}
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span className={getPriorityColor(task.priority)}>
                <i className={getPriorityIcon(task.priority)}></i>
              </span>
              <span 
                className="font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                {task.points} pts
              </span>
            </div>
          </div>
          
          <p 
            className={`text-sm mb-3 ${task.completed ? 'line-through' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {task.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <span 
              className="flex items-center gap-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <i className="fas fa-clock"></i>
              {task.estimatedTime} min
            </span>
            <span 
              className={`capitalize ${getPriorityColor(task.priority)}`}
            >
              {task.priority} priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMethod;