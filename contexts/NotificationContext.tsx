import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface Notification {
  id: number;
  title: string;
  body: string;
  ts: string;
  actionLabel: string;
  actionHref: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'CLEAR_ALL' }
  | { type: 'MARK_AS_READ'; payload: number }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'SET_LOADING'; payload: boolean };

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'ts'>) => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS': {
      const notifications = action.payload;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications,
        unreadCount,
      };
    }
    case 'ADD_NOTIFICATION': {
      const newNotification = {
        ...action.payload,
        id: Date.now() + Math.random(), // Generate unique ID
        ts: new Date().toISOString(),
        isRead: false,
      };
      const notifications = [newNotification, ...state.notifications];
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications,
        unreadCount,
      };
    }
    case 'REMOVE_NOTIFICATION': {
      const notifications = state.notifications.filter(n => n.id !== action.payload);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications,
        unreadCount,
      };
    }
    case 'CLEAR_ALL': {
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    }
    case 'MARK_AS_READ': {
      const notifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications,
        unreadCount,
      };
    }
    case 'MARK_ALL_AS_READ': {
      const notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      return {
        ...state,
        notifications,
        unreadCount: 0,
      };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    default:
      return state;
  }
}

// Storage key for persistence
const STORAGE_KEY = 'app_notifications';
const CLEARED_NOTIFICATIONS_KEY = 'clearedNotifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loadStoredNotifications = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY);
          const clearedIds = JSON.parse(localStorage.getItem(CLEARED_NOTIFICATIONS_KEY) || '[]');
          
          if (stored) {
            const notifications: Notification[] = JSON.parse(stored)
              .filter((n: Notification) => !clearedIds.includes(n.id));
            dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
          }
        }
      } catch (error) {
        console.error('Error loading notifications from storage:', error);
      }
    };

    loadStoredNotifications();
  }, []);

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && state.notifications.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notifications));
      }
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }, [state.notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'ts'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification as Notification });
  };

  const removeNotification = (id: number) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    
    // Persist removed notification ID
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(CLEARED_NOTIFICATIONS_KEY) || '[]');
        const updated = [...existing, id];
        localStorage.setItem(CLEARED_NOTIFICATIONS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error persisting removed notification:', error);
      }
    }
  };

  const clearAll = () => {
    const allIds = state.notifications.map(n => n.id);
    dispatch({ type: 'CLEAR_ALL' });
    
    // Persist all cleared notification IDs
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(CLEARED_NOTIFICATIONS_KEY) || '[]');
        const updated = [...existing, ...allIds];
        localStorage.setItem(CLEARED_NOTIFICATIONS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error persisting cleared notifications:', error);
      }
    }
  };

  const markAsRead = (id: number) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const setNotifications = (notifications: Notification[]) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  };

  const refreshNotifications = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // This would typically fetch from an API
      // For now, we'll just reload from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      const clearedIds = JSON.parse(localStorage.getItem(CLEARED_NOTIFICATIONS_KEY) || '[]');
      
      if (stored) {
        const notifications: Notification[] = JSON.parse(stored)
          .filter((n: Notification) => !clearedIds.includes(n.id));
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      }
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: NotificationContextType = {
    state,
    addNotification,
    removeNotification,
    clearAll,
    markAsRead,
    markAllAsRead,
    setNotifications,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper hook for easy notification creation
export function useNotificationActions() {
  const { addNotification } = useNotifications();

  const showSuccess = (title: string, body: string, actionLabel = 'View', actionHref = '/') => {
    addNotification({
      title,
      body,
      actionLabel,
      actionHref,
      type: 'success',
    });
  };

  const showError = (title: string, body: string, actionLabel = 'Retry', actionHref = '/') => {
    addNotification({
      title,
      body,
      actionLabel,
      actionHref,
      type: 'error',
    });
  };

  const showWarning = (title: string, body: string, actionLabel = 'View', actionHref = '/') => {
    addNotification({
      title,
      body,
      actionLabel,
      actionHref,
      type: 'warning',
    });
  };

  const showInfo = (title: string, body: string, actionLabel = 'View', actionHref = '/') => {
    addNotification({
      title,
      body,
      actionLabel,
      actionHref,
      type: 'info',
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}