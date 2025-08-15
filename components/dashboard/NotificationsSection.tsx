import { useState } from 'react';
import Link from 'next/link';
import { clearNotifications } from '../../lib/api/dashboard';

interface Notification {
  id: number;
  title: string;
  body: string;
  ts: string;
  actionLabel: string;
  actionHref: string;
}

interface NotificationsSectionProps {
  notifications: Notification[];
  onClear: () => void;
}

export default function NotificationsSection({ notifications, onClear }: NotificationsSectionProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearNotifications();
      onClear();
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          You are all caught up
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button
          onClick={handleClearAll}
          disabled={isClearing}
          className="text-brand-primary hover:text-blue-700 font-medium disabled:opacity-50"
        >
          {isClearing ? 'Clearing...' : 'Clear All'}
        </button>
      </div>
      
      <div className="grid gap-3 md:grid-cols-3 mb-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{notification.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{notification.body}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatTime(notification.ts)}</span>
              <Link href={notification.actionHref}>
                <a className="text-brand-primary hover:text-blue-700 text-sm font-medium">
                  {notification.actionLabel}
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/notifications">
        <a className="text-brand-primary hover:text-blue-700 font-medium">
          View All Notifications
        </a>
      </Link>
    </div>
  );
}