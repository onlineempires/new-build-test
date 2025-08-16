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

// Helper function to generate lessons for a module
const generateLessons = (moduleId: string, moduleIndex: number, lessonCount: number, completedCount: number = 0): Lesson[] => {
  const lessons: Lesson[] = [];
  const topics = [
    'Introduction and Overview', 'Getting Started', 'Basic Fundamentals', 'Advanced Concepts',
    'Best Practices', 'Implementation Strategy', 'Case Studies', 'Common Mistakes',
    'Optimization Techniques', 'Analytics and Tracking', 'Scaling Strategies', 'Future Trends'
  ];
  
  for (let i = 1; i <= lessonCount; i++) {
    lessons.push({
      id: `lesson-${moduleIndex + 1}-${i}`,
      title: `${topics[(i - 1) % topics.length]} ${Math.ceil(i / topics.length) > 1 ? `Part ${Math.ceil(i / topics.length)}` : ''}`.trim(),
      description: `Learn the essential concepts and practical applications for mastering this topic.`,
      videoUrl: `https://example.com/video-${moduleId}-${i}`,
      duration: 300 + Math.floor(Math.random() * 600), // 5-15 minutes
      isCompleted: i <= completedCount
    });
  }
  
  return lessons;
};

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
      progress: 100,
      isCompleted: true,
      modules: [
        {
          id: "business-module-1",
          title: "Foundation Principles",
          description: "Build your business on solid fundamentals",
          isCompleted: true,
          lessons: generateLessons("business-module-1", 0, 6, 6)
        },
        {
          id: "business-module-2", 
          title: "Market Research",
          description: "Understand your target market deeply",
          isCompleted: true,
          lessons: generateLessons("business-module-2", 1, 5, 5)
        },
        {
          id: "business-module-3",
          title: "Business Planning",
          description: "Create a comprehensive business plan",
          isCompleted: true,
          lessons: generateLessons("business-module-3", 2, 7, 7)
        },
        {
          id: "business-module-4",
          title: "Legal Structure",
          description: "Set up your business legally and properly",
          isCompleted: true,
          lessons: generateLessons("business-module-4", 3, 4, 4)
        },
        {
          id: "business-module-5",
          title: "Financial Management",
          description: "Master business finances and accounting",
          isCompleted: true,
          lessons: generateLessons("business-module-5", 4, 6, 6)
        },
        {
          id: "business-module-6",
          title: "Operations & Systems",
          description: "Build efficient business operations",
          isCompleted: true,
          lessons: generateLessons("business-module-6", 5, 5, 5)
        },
        {
          id: "business-module-7",
          title: "Marketing Foundation",
          description: "Essential marketing principles",
          isCompleted: true,
          lessons: generateLessons("business-module-7", 6, 7, 7)
        },
        {
          id: "business-module-8",
          title: "Growth & Scaling",
          description: "Scale your business to new heights",
          isCompleted: true,
          lessons: generateLessons("business-module-8", 7, 5, 5)
        }
      ]
    },
    {
      id: "discovery-process",
      title: "The Discovery Process",
      description: "Find your niche and identify opportunities",
      thumbnailUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop",
      moduleCount: 3,
      lessonCount: 15,
      progress: 67,
      isCompleted: false,
      modules: [
        {
          id: "discovery-module-1",
          title: "Self Assessment",
          description: "Discover your strengths and passions",
          isCompleted: true,
          lessons: generateLessons("discovery-module-1", 0, 5, 5)
        },
        {
          id: "discovery-module-2",
          title: "Market Opportunity Analysis", 
          description: "Identify profitable market opportunities",
          isCompleted: true,
          lessons: generateLessons("discovery-module-2", 1, 6, 5)
        },
        {
          id: "discovery-module-3",
          title: "Niche Selection",
          description: "Choose your perfect business niche",
          isCompleted: false,
          lessons: generateLessons("discovery-module-3", 2, 4, 0)
        }
      ]
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
      modules: [
        {
          id: "nextsteps-module-1",
          title: "30-Day Action Plan",
          description: "Your first 30 days roadmap",
          isCompleted: false,
          lessons: generateLessons("nextsteps-module-1", 0, 5, 0)
        },
        {
          id: "nextsteps-module-2",
          title: "Tools & Resources Setup",
          description: "Essential tools for your business",
          isCompleted: false,
          lessons: generateLessons("nextsteps-module-2", 1, 6, 0)
        },
        {
          id: "nextsteps-module-3",
          title: "Implementation Strategy",
          description: "Execute your business plan effectively",
          isCompleted: false,
          lessons: generateLessons("nextsteps-module-3", 2, 5, 0)
        },
        {
          id: "nextsteps-module-4",
          title: "Monitoring & Optimization",
          description: "Track progress and optimize performance",
          isCompleted: false,
          lessons: generateLessons("nextsteps-module-4", 3, 4, 0)
        }
      ]
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
          lessons: generateLessons("tiktok-module-1", 0, 4, 4)
        },
        {
          id: "tiktok-module-2",
          title: "Content Creation Basics",
          description: "Master the fundamentals of TikTok content",
          isCompleted: true,
          lessons: generateLessons("tiktok-module-2", 1, 5, 5)
        },
        {
          id: "tiktok-module-3",
          title: "Advanced Strategies",
          description: "Take your TikTok marketing to the next level",
          isCompleted: false,
          lessons: generateLessons("tiktok-module-3", 2, 4, 2)
        },
        {
          id: "tiktok-module-4",
          title: "Algorithm Mastery",
          description: "Understand and leverage the TikTok algorithm",
          isCompleted: false,
          lessons: generateLessons("tiktok-module-4", 3, 4, 0)
        },
        {
          id: "tiktok-module-5",
          title: "Monetization Strategies",
          description: "Turn your TikTok presence into profit",
          isCompleted: false,
          lessons: generateLessons("tiktok-module-5", 4, 4, 0)
        },
        {
          id: "tiktok-module-6",
          title: "Scaling & Automation",
          description: "Scale your TikTok success systematically",
          isCompleted: false,
          lessons: generateLessons("tiktok-module-6", 5, 4, 0)
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
      modules: [
        {
          id: "facebook-module-1",
          title: "Facebook Ads Fundamentals",
          description: "Master the basics of Facebook advertising",
          isCompleted: true,
          lessons: generateLessons("facebook-module-1", 0, 4, 4)
        },
        {
          id: "facebook-module-2",
          title: "Campaign Setup & Structure",
          description: "Create winning campaign structures",
          isCompleted: true,
          lessons: generateLessons("facebook-module-2", 1, 5, 5)
        },
        {
          id: "facebook-module-3",
          title: "Audience Targeting",
          description: "Target the right people effectively",
          isCompleted: true,
          lessons: generateLessons("facebook-module-3", 2, 4, 4)
        },
        {
          id: "facebook-module-4",
          title: "Creative & Copy",
          description: "Create compelling ads that convert",
          isCompleted: true,
          lessons: generateLessons("facebook-module-4", 3, 5, 5)
        },
        {
          id: "facebook-module-5",
          title: "Landing Pages & Funnels",
          description: "Build high-converting landing pages",
          isCompleted: true,
          lessons: generateLessons("facebook-module-5", 4, 4, 4)
        },
        {
          id: "facebook-module-6",
          title: "Analytics & Optimization",
          description: "Track and optimize your campaigns",
          isCompleted: true,
          lessons: generateLessons("facebook-module-6", 5, 5, 5)
        },
        {
          id: "facebook-module-7",
          title: "Advanced Strategies",
          description: "Advanced Facebook advertising techniques",
          isCompleted: true,
          lessons: generateLessons("facebook-module-7", 6, 4, 4)
        },
        {
          id: "facebook-module-8",
          title: "Scaling & Automation",
          description: "Scale your campaigns profitably",
          isCompleted: true,
          lessons: generateLessons("facebook-module-8", 7, 4, 4)
        }
      ]
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
      modules: [
        {
          id: "instagram-module-1",
          title: "Instagram Business Setup",
          description: "Set up your Instagram business profile",
          isCompleted: false,
          lessons: generateLessons("instagram-module-1", 0, 4, 0)
        },
        {
          id: "instagram-module-2",
          title: "Content Strategy",
          description: "Develop a winning content strategy",
          isCompleted: false,
          lessons: generateLessons("instagram-module-2", 1, 5, 0)
        },
        {
          id: "instagram-module-3",
          title: "Growth Tactics",
          description: "Grow your Instagram following organically",
          isCompleted: false,
          lessons: generateLessons("instagram-module-3", 2, 5, 0)
        },
        {
          id: "instagram-module-4",
          title: "Instagram Ads",
          description: "Master Instagram advertising",
          isCompleted: false,
          lessons: generateLessons("instagram-module-4", 3, 4, 0)
        },
        {
          id: "instagram-module-5",
          title: "Monetization",
          description: "Turn followers into customers",
          isCompleted: false,
          lessons: generateLessons("instagram-module-5", 4, 4, 0)
        }
      ]
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
      modules: [
        {
          id: "funnel-module-1",
          title: "Funnel Fundamentals",
          description: "Understanding sales funnel principles",
          isCompleted: false,
          lessons: generateLessons("funnel-module-1", 0, 4, 0)
        },
        {
          id: "funnel-module-2",
          title: "Lead Magnets",
          description: "Create irresistible lead magnets",
          isCompleted: false,
          lessons: generateLessons("funnel-module-2", 1, 4, 0)
        },
        {
          id: "funnel-module-3",
          title: "Landing Page Design",
          description: "Design high-converting landing pages",
          isCompleted: false,
          lessons: generateLessons("funnel-module-3", 2, 5, 0)
        },
        {
          id: "funnel-module-4",
          title: "Email Sequences",
          description: "Build automated email sequences",
          isCompleted: false,
          lessons: generateLessons("funnel-module-4", 3, 5, 0)
        },
        {
          id: "funnel-module-5",
          title: "Sales Pages",
          description: "Create compelling sales pages",
          isCompleted: false,
          lessons: generateLessons("funnel-module-5", 4, 4, 0)
        },
        {
          id: "funnel-module-6",
          title: "Upsells & Downsells",
          description: "Maximize revenue per customer",
          isCompleted: false,
          lessons: generateLessons("funnel-module-6", 5, 4, 0)
        },
        {
          id: "funnel-module-7",
          title: "Optimization & Testing",
          description: "Optimize your funnels for maximum conversion",
          isCompleted: false,
          lessons: generateLessons("funnel-module-7", 6, 4, 0)
        }
      ]
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
    console.warn('Using mock course data for courseId:', courseId);
    
    // Find course in mock data
    const allCourses = [...mockData.startHereCourses, ...mockData.socialMediaCourses];
    const course = allCourses.find(c => c.id === courseId);
    
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(course), 300);
    });
  }
};

export const updateLessonProgress = async (courseId: string, lessonId: string, completed: boolean): Promise<void> => {
  try {
    await client.put(`/courses/${courseId}/lessons/${lessonId}/progress`, { completed });
  } catch (error) {
    console.warn('Mock: Lesson progress updated for:', lessonId, completed);
    // In mock mode, just resolve
    return new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
};