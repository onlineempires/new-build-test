import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 1 minute by default
      staleTime: 60 * 1000,
      // Keep cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay exponentially backs off
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: 'always',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Log errors in development
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});

// Query keys factory for consistent cache key management
export const queryKeys = {
  // User queries
  user: {
    all: ['user'] as const,
    detail: (id: string) => ['user', id] as const,
    profile: () => ['user', 'profile'] as const,
    settings: () => ['user', 'settings'] as const,
  },
  
  // Course queries
  courses: {
    all: ['courses'] as const,
    list: (filters?: any) => ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', id] as const,
    progress: (userId: string, courseId: string) => ['courses', 'progress', userId, courseId] as const,
    access: (userId: string) => ['courses', 'access', userId] as const,
  },
  
  // DMO queries
  dmo: {
    all: ['dmo'] as const,
    progress: (userId: string) => ['dmo', 'progress', userId] as const,
    paths: () => ['dmo', 'paths'] as const,
    xp: (userId: string) => ['dmo', 'xp', userId] as const,
  },
  
  // Expert queries
  experts: {
    all: ['experts'] as const,
    list: (filters?: any) => ['experts', 'list', filters] as const,
    detail: (id: string) => ['experts', id] as const,
    availability: (expertId: string) => ['experts', 'availability', expertId] as const,
    bookings: (userId: string) => ['experts', 'bookings', userId] as const,
  },
  
  // Payment queries
  payments: {
    all: ['payments'] as const,
    history: (userId: string) => ['payments', 'history', userId] as const,
    methods: (userId: string) => ['payments', 'methods', userId] as const,
  },
  
  // Admin queries
  admin: {
    users: (filters?: any) => ['admin', 'users', filters] as const,
    stats: () => ['admin', 'stats'] as const,
    logs: (type?: string) => ['admin', 'logs', type] as const,
  },
} as const;