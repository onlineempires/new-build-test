import { useNotifications, useNotificationActions } from '../contexts/NotificationContext';

export function useNotificationHelpers() {
  const { state, clearAll, removeNotification, refreshNotifications } = useNotifications();
  const { showSuccess, showError, showWarning, showInfo } = useNotificationActions();

  // Helper for course completion notifications
  const notifyCourseCompleted = (courseName: string) => {
    showSuccess(
      'Course Completed! 🎉',
      `Congratulations! You've completed "${courseName}". Your progress has been saved.`,
      'View Certificate',
      '/certificates'
    );
  };

  // Helper for achievement notifications
  const notifyAchievement = (achievementName: string, description: string) => {
    showSuccess(
      `Achievement Unlocked! 🏆`,
      `${achievementName}: ${description}`,
      'View Achievements',
      '/achievements'
    );
  };

  // Helper for upgrade notifications
  const notifyUpgrade = (planName: string) => {
    showSuccess(
      'Upgrade Successful! ✨',
      `Welcome to ${planName}! You now have access to all premium features.`,
      'Explore Features',
      '/courses'
    );
  };

  // Helper for payment notifications
  const notifyPayment = (amount: string, type: 'success' | 'failed') => {
    if (type === 'success') {
      showSuccess(
        'Payment Successful! 💳',
        `Your payment of $${amount} has been processed successfully.`,
        'View Receipt',
        '/billing'
      );
    } else {
      showError(
        'Payment Failed ❌',
        `Your payment of $${amount} could not be processed. Please try again.`,
        'Retry Payment',
        '/billing'
      );
    }
  };

  // Helper for system notifications
  const notifyMaintenance = (startTime: string, duration: string) => {
    showWarning(
      'Scheduled Maintenance 🔧',
      `System maintenance is scheduled for ${startTime} and will last approximately ${duration}.`,
      'Learn More',
      '/status'
    );
  };

  // Helper for feature announcements
  const notifyFeature = (featureName: string, description: string) => {
    showInfo(
      `New Feature: ${featureName} 🚀`,
      description,
      'Try It Now',
      '/features'
    );
  };

  // Helper for affiliate notifications
  const notifyCommission = (amount: string, from: string) => {
    showSuccess(
      'Commission Earned! 💰',
      `You earned $${amount} commission from ${from}'s purchase.`,
      'View Earnings',
      '/affiliate'
    );
  };

  // Helper for lead notifications
  const notifyNewLead = (leadName: string, source: string) => {
    showSuccess(
      'New Lead Generated! 👋',
      `${leadName} signed up through ${source}.`,
      'View Lead',
      '/leads'
    );
  };

  return {
    // State
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,

    // Basic actions
    clearAll,
    removeNotification,
    refreshNotifications,

    // Generic notification helpers
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Specialized notification helpers
    notifyCourseCompleted,
    notifyAchievement,
    notifyUpgrade,
    notifyPayment,
    notifyMaintenance,
    notifyFeature,
    notifyCommission,
    notifyNewLead,
  };
}