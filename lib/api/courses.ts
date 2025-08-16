import client from './client';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  moduleCount: number;
  lessonCount: number;
  progress: number;
  isCompleted: boolean;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isCompleted: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  isCompleted: boolean;
  transcripts?: string;
}

export interface CourseData {
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  stats: {
    coursesCompleted: number;
    coursesTotal: number;
    learningStreakDays: number;
    xpPoints: number;
    level: string;
  };
  notifications: Array<{
    id: number;
    title: string;
    body: string;
    ts: string;
    actionLabel: string;
    actionHref: string;
  }>;
  startHereCourses: Course[];
  socialMediaCourses: Course[];
  achievements: Achievement[];
}

export interface Achievement {
  type: 'course' | 'streak' | 'commission';
  title: string;
  description: string;
  timeAgo: string;
}

// Mock data for development
const mockData: CourseData = {
  user: { 
    id: 123, 
    name: "Ashley Kemp", 
    avatarUrl: "/default-avatar.png" 
  },
  stats: {
    coursesCompleted: 3,
    coursesTotal: 12,
    learningStreakDays: 12,
    xpPoints: 2450,
    level: "Expert"
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
  startHereCourses: [
    {
      id: "business-blueprint",
      title: "The Business Blueprint",
      description: "Master the fundamentals of building your online empire",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      moduleCount: 8,
      lessonCount: 45,
      progress: 0,
      isCompleted: false,
      modules: []
    },
    {
      id: "discovery-process",
      title: "The Discovery Process",
      description: "Find your niche and identify opportunities",
      thumbnailUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop",
      moduleCount: 3,
      lessonCount: 15,
      progress: 0,
      isCompleted: false,
      modules: []
    },
    {
      id: "next-steps",
      title: "Next Steps",
      description: "Action plan for immediate implementation",
      thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      moduleCount: 4,
      lessonCount: 20,
      progress: 0,
      isCompleted: false,
      modules: []
    }
  ],
  socialMediaCourses: [
    {
      id: "tiktok-mastery",
      title: "TIK-TOK MASTERY",
      description: "Dominate TikTok and grow exponentially",
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
      moduleCount: 6,
      lessonCount: 25,
      progress: 67,
      isCompleted: false,
      modules: [
        {
          id: "tiktok-module-1",
          title: "Getting Started with TikTok",
          description: "Learn the basics of TikTok marketing",
          isCompleted: true,
          lessons: [
            {
              id: "lesson-1-1",
              title: "Introduction to TikTok Marketing",
              description: "Understanding the TikTok ecosystem",
              videoUrl: "https://example.com/video1",
              duration: 480,
              isCompleted: true
            },
            {
              id: "lesson-1-2", 
              title: "Setting Up Your Business Account",
              description: "Create and optimize your TikTok business profile",
              videoUrl: "https://example.com/video2",
              duration: 360,
              isCompleted: true
            }
          ]
        },
        {
          id: "tiktok-module-2",
          title: "Content Creation Basics",
          description: "Master the fundamentals of TikTok content",
          isCompleted: true,
          lessons: [
            {
              id: "lesson-2-1",
              title: "Planning Your Content Strategy",
              description: "Develop a winning content strategy",
              videoUrl: "https://example.com/video3",
              duration: 600,
              isCompleted: true
            },
            {
              id: "lesson-2-2", 
              title: "Video Production Basics",
              description: "Learn to create engaging TikTok videos",
              videoUrl: "https://example.com/video4",
              duration: 720,
              isCompleted: true
            }
          ]
        },
        {
          id: "tiktok-module-3",
          title: "Advanced Strategies",
          description: "Take your TikTok marketing to the next level",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-3-1",
              title: "Algorithm Optimization",
              description: "Understand and leverage the TikTok algorithm",
              videoUrl: "https://example.com/video5",
              duration: 540,
              isCompleted: true
            },
            {
              id: "lesson-3-2", 
              title: "Viral Content Creation",
              description: "Create content that goes viral consistently",
              videoUrl: "https://example.com/video6",
              duration: 480,
              isCompleted: false
            },
            {
              id: "lesson-3-3", 
              title: "Advanced Analytics",
              description: "Track and optimize your performance",
              videoUrl: "https://example.com/video7",
              duration: 360,
              isCompleted: false
            }
          ]
        }
      ]
    },
    {
      id: "facebook-advertising",
      title: "Facebook Advertising Mastery",
      description: "Create profitable Facebook ad campaigns",
      thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop",
      moduleCount: 8,
      lessonCount: 35,
      progress: 100,
      isCompleted: true,
      modules: []
    },
    {
      id: "instagram-marketing",
      title: "Instagram Marketing",
      description: "Build a powerful Instagram presence",
      thumbnailUrl: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=225&fit=crop",
      moduleCount: 5,
      lessonCount: 22,
      progress: 0,
      isCompleted: false,
      modules: []
    },
    {
      id: "sales-funnel-mastery",
      title: "Sales Funnel Mastery",
      description: "Build high-converting sales funnels",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      moduleCount: 7,
      lessonCount: 30,
      progress: 0,
      isCompleted: false,
      modules: []
    }
  ],
  achievements: [
    {
      type: 'course',
      title: 'Completed "Facebook Advertising Mastery" course',
      description: 'Earned 500 XP points',
      timeAgo: '3 days ago'
    },
    {
      type: 'streak',
      title: 'Achieved 10-day learning streak',
      description: 'Consistency is key to success!',
      timeAgo: '3 days ago'
    },
    {
      type: 'commission',
      title: 'Earned $500 in commissions this week',
      description: 'Your business is growing!',
      timeAgo: '1 week ago'
    }
  ]
};

export const getAllCourses = async (): Promise<CourseData> => {
  try {
    // Try to fetch from real API first
    const { data } = await client.get('/courses');
    return data;
  } catch (error) {
    // Fall back to mock data for development
    console.warn('Using mock courses data - API not available:', error);
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 500); // Simulate network delay
    });
  }
};

export const getCourse = async (courseId: string): Promise<Course> => {
  try {
    const { data } = await client.get(`/courses/${courseId}`);
    return data;
  } catch (error) {
    console.warn('Using mock course data - API not available:', error);
    // Find course in mock data
    const allCourses = [...mockData.startHereCourses, ...mockData.socialMediaCourses];
    const course = allCourses.find(c => c.id === courseId);
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }
    return Promise.resolve(course);
  }
};

export const updateLessonProgress = async (courseId: string, lessonId: string, completed: boolean) => {
  try {
    const { data } = await client.post(`/courses/${courseId}/lessons/${lessonId}/progress`, {
      completed
    });
    return data;
  } catch (error) {
    console.warn('Using mock lesson progress update - API not available:', error);
    return { success: true };
  }
};