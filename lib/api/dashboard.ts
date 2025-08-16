import client from './client';

export interface DashboardData {
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  stats: {
    coursesCompleted: number;
    coursesTotal: number;
    learningStreakDays: number;
    commissions: number;
    newLeads: number;
    progressPercent: number;
  };
  notifications: Array<{
    id: number;
    title: string;
    body: string;
    ts: string;
    actionLabel: string;
    actionHref: string;
  }>;
  continue: {
    courseTitle: string;
    moduleTitle: string;
    lessonTitle: string;
    progressPercent: number;
    href: string;
    thumbnailUrl?: string;
  };
  startHere: Array<{
    id: string;
    title: string;
    desc: string;
    modules: number;
    thumbnailUrl: string;
    href: string;
  }>;
  achievements: string[];
}

// Mock data for development
const mockData: DashboardData = {
  user: { 
    id: 123, 
    name: "Ashley Kemp", 
    avatarUrl: "/default-avatar.png" 
  },
  stats: {
    coursesCompleted: 8,
    coursesTotal: 15,
    learningStreakDays: 12,
    commissions: 2847.00,
    newLeads: 47,
    progressPercent: 67
  },
  notifications: [
    {
      id: 1,
      title: "New Lead Generated!",
      body: "John signed up for your course",
      ts: "2025-08-12T10:00:00Z",
      actionLabel: "View Lead",
      actionHref: "/leads/1"
    },
    {
      id: 2,
      title: "Commission Earned",
      body: "You earned $150 from affiliate sales",
      ts: "2025-08-11T15:30:00Z",
      actionLabel: "View Details",
      actionHref: "/affiliate"
    },
    {
      id: 3,
      title: "Course Completed",
      body: "Congratulations on finishing the Marketing module!",
      ts: "2025-08-10T09:15:00Z",
      actionLabel: "View Certificate",
      actionHref: "/courses/marketing"
    }
  ],
  continue: {
    courseTitle: "TIK-TOK MASTERY",
    moduleTitle: "Module 3: Advanced Strategies",
    lessonTitle: "Lesson 2: Viral Content Creation",
    progressPercent: 67,
    href: "/courses/tiktok-mastery",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64"
  },
  startHere: [
    {
      id: "business-blueprint",
      title: "The Business Blueprint",
      desc: "Foundation principles for building your online business",
      modules: 5,
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      href: "/courses/business-blueprint"
    },
    {
      id: "discovery-process",
      title: "The Discovery Process",
      desc: "Find your niche and identify opportunities",
      modules: 3,
      thumbnailUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop",
      href: "/courses/discovery-process"
    },
    {
      id: "next-steps",
      title: "Next Steps",
      desc: "Action plan for immediate implementation",
      modules: 4,
      thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      href: "/courses/next-steps"
    }
  ],
  achievements: [
    "Completed \"Facebook Advertising Mastery\" course",
    "Earned 500 XP points",
    "Achieved 10-day learning streak",
    "Earned $500 in commissions this week"
  ]
};

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    // Try to fetch from real API first
    const { data } = await client.get('/dashboard');
    return data;
  } catch (error) {
    // Fall back to mock data for development
    console.warn('Using mock data - API not available:', error);
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 500); // Simulate network delay
    });
  }
};

export const sendFeedback = async (message: string) => {
  try {
    const { data } = await client.post('/feedback', { message });
    return data;
  } catch (error) {
    // Mock success for development
    console.warn('Using mock feedback response - API not available:', error);
    return { success: true };
  }
};

export const clearNotifications = async () => {
  try {
    const { data } = await client.post('/notifications/clear');
    return data;
  } catch (error) {
    // Mock success for development
    console.warn('Using mock clear notifications response - API not available:', error);
    return { success: true };
  }
};