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
  isLocked?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  isCompleted: boolean;
  transcripts?: string;
  hasEnagicButton?: boolean;
  hasSkillsButton?: boolean;
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
      title: "Business Launch Blueprint",
      description: "Your complete blueprint to launching a successful online business",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      moduleCount: 2,
      lessonCount: 4,
      progress: 0,
      isCompleted: false,
      modules: [
        {
          id: "business-module-1",
          title: "Business Launch Blueprint",
          description: "Essential foundation to get started with your business journey",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-1-1",
              title: "Welcome & Our Highest Converting Offer",
              description: "Discover our proven system and highest converting business opportunity",
              videoUrl: "https://example.com/video-business-module-1-1",
              duration: 900, // 15 minutes
              isCompleted: false
            },
            {
              id: "lesson-1-2",
              title: "Our Life Changing Stories",
              description: "Real success stories from people who transformed their lives with our system",
              videoUrl: "https://example.com/video-business-module-1-2",
              duration: 720, // 12 minutes
              isCompleted: false
            },
            {
              id: "lesson-1-3",
              title: "Bonus Resources",
              description: "Essential resources and tools to accelerate your success",
              videoUrl: "https://example.com/video-business-module-1-3",
              duration: 480, // 8 minutes
              isCompleted: false
            }
          ]
        },
        {
          id: "business-module-2", 
          title: "Discovery Process",
          description: "Making your next step - choose your path forward",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-2-1",
              title: "Making Your Next Step",
              description: "Decide between fast-track business opportunity or skill building",
              videoUrl: "https://example.com/video-business-module-2-1",
              duration: 600, // 10 minutes
              isCompleted: false
            }
          ]
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
      setTimeout(() => {
        // Load progress from storage
        loadProgressFromStorage();
        
        // Deep clone mock data and update with current progress
        const updatedData = JSON.parse(JSON.stringify(mockData));
        
        // Calculate total completed courses
        let completedCourses = 0;
        
        // Update all courses with current progress
        const updateCourseProgress = (course: Course) => {
          let totalCompleted = 0;
          let totalLessons = 0;
          
          course.modules = course.modules.map(module => {
            const isUnlocked = isModuleUnlocked(module.id, course);
            return {
              ...module,
              isLocked: !isUnlocked,
              lessons: module.lessons.map(lesson => {
                totalLessons++;
                const isCompleted = globalProgressState.completedLessons.has(lesson.id);
                if (isCompleted) totalCompleted++;
                
                // Add special buttons for Business Launch Blueprint lessons
                const hasButtons = course.id === 'business-blueprint' && 
                  (lesson.id === 'lesson-1-1' || lesson.id === 'lesson-1-2' || lesson.id === 'lesson-1-3' || lesson.id === 'lesson-2-1');
                
                return {
                  ...lesson,
                  isCompleted,
                  hasEnagicButton: hasButtons,
                  hasSkillsButton: hasButtons && lesson.id !== 'lesson-2-1' // Module 2 lesson only has Enagic button
                };
              })
            };
          });
          
          // Update course progress
          course.progress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
          course.isCompleted = totalLessons > 0 && totalCompleted === totalLessons;
          
          // Count as completed if ALL lessons are completed
          if (course.isCompleted) {
            completedCourses++;
          }
          
          return course;
        };
        
        updatedData.startHereCourses = updatedData.startHereCourses.map(updateCourseProgress);
        updatedData.socialMediaCourses = updatedData.socialMediaCourses.map(updateCourseProgress);
        
        // Update global stats with current progress
        updatedData.stats.coursesCompleted = completedCourses;
        updatedData.stats.xpPoints = globalProgressState.totalXP;
        
        // Update level based on completed courses
        const currentLevel = calculateUserLevel(completedCourses);
        updatedData.stats.level = currentLevel.name;
        
        // CRITICAL: Update global state with accurate values
        globalProgressState.coursesCompleted = completedCourses;
        globalProgressState.currentLevel = currentLevel;
        
        // Debug logging to help track the issue
        if (typeof window !== 'undefined') {
          console.log('🗺 getAllCourses - Course completion update:', {
            totalCourses: updatedData.startHereCourses.length + updatedData.socialMediaCourses.length,
            completedCourses,
            completedLessonsCount: globalProgressState.completedLessons.size,
            completedLessonsArray: Array.from(globalProgressState.completedLessons),
            timestamp: new Date().toISOString()
          });
          
          // Log each course's detailed status
          [...updatedData.startHereCourses, ...updatedData.socialMediaCourses].forEach((course, index) => {
            const totalLessons = course.modules.reduce((sum: number, m: Module) => sum + m.lessons.length, 0);
            const completedLessons = course.modules.reduce((sum: number, m: Module) => sum + m.lessons.filter((l: Lesson) => l.isCompleted).length, 0);
            console.log(`📚 Course ${index + 1} - ${course.title}:`, {
              progress: course.progress,
              isCompleted: course.isCompleted,
              totalLessons,
              completedLessons,
              completionRatio: `${completedLessons}/${totalLessons}`
            });
          });
        }
        
        // Update module completion status
        updatedData.startHereCourses = updatedData.startHereCourses.map((course: Course) => ({
          ...course,
          modules: course.modules.map((module: Module) => ({
            ...module,
            isCompleted: module.lessons.every((lesson: Lesson) => lesson.isCompleted)
          }))
        }));
        
        updatedData.socialMediaCourses = updatedData.socialMediaCourses.map((course: Course) => ({
          ...course,
          modules: course.modules.map((module: Module) => ({
            ...module,
            isCompleted: module.lessons.every((lesson: Lesson) => lesson.isCompleted)
          }))
        }));
        
        resolve(updatedData);
      }, 100); // Reduced delay for better performance
    });
  }
};

export const getCourse = async (courseId: string): Promise<Course> => {
  try {
    const { data } = await client.get(`/courses/${courseId}`);
    return data;
  } catch (error) {
    console.warn('Using mock course data for courseId:', courseId);
    
    // Load progress from storage
    loadProgressFromStorage();
    
    // Find course in mock data and update with current progress
    const allCourses = [...mockData.startHereCourses, ...mockData.socialMediaCourses];
    let course = allCourses.find(c => c.id === courseId);
    
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update course with current progress state
        const courseCopy = JSON.parse(JSON.stringify(course)); // Deep clone
        let totalCompleted = 0;
        let totalLessons = 0;
        
        courseCopy.modules = courseCopy.modules.map((module: Module) => ({
          ...module,
          lessons: module.lessons.map((lesson: Lesson) => {
            totalLessons++;
            const isCompleted = globalProgressState.completedLessons.has(lesson.id);
            if (isCompleted) totalCompleted++;
            return {
              ...lesson,
              isCompleted
            };
          })
        }));
        
        // Update course progress
        courseCopy.progress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
        courseCopy.isCompleted = courseCopy.progress === 100 && totalLessons > 0;
        
        // Update module completion status
        courseCopy.modules = courseCopy.modules.map((module: Module) => ({
          ...module,
          isCompleted: module.lessons.every((lesson: Lesson) => lesson.isCompleted)
        }));
        
        resolve(courseCopy);
      }, 50); // Reduced delay for better performance
    });
  }
};

// Leveling system configuration
export const LEVEL_TIERS = {
  ROOKIE: { min: 0, max: 2, name: 'Rookie', color: '#3B82F6', icon: 'fas fa-rocket', tailwind: 'bg-blue-600 text-white border-blue-600' },
  OPERATOR: { min: 3, max: 5, name: 'Operator', color: '#10B981', icon: 'fas fa-cog', tailwind: 'bg-emerald-600 text-white border-emerald-600' },
  VETERAN: { min: 6, max: 8, name: 'Veteran', color: '#8B5CF6', icon: 'fas fa-shield-alt', tailwind: 'bg-violet-600 text-white border-violet-600' },
  ELITE: { min: 9, max: 12, name: 'Elite', color: '#6B7280', icon: 'fas fa-crown', tailwind: 'bg-gray-600 text-white border-gray-600' },
  LEGEND: { min: 13, max: 999, name: 'Legend', color: '#F59E0B', icon: 'fas fa-trophy', tailwind: 'bg-amber-500 text-white border-amber-500' }
};

// Helper function to calculate user level based on completed courses
export const calculateUserLevel = (completedCourses: number) => {
  for (const [key, tier] of Object.entries(LEVEL_TIERS)) {
    if (completedCourses >= tier.min && completedCourses <= tier.max) {
      return tier;
    }
  }
  return LEVEL_TIERS.ROOKIE; // Default fallback
};

// Global progress state for mock data
let globalProgressState = {
  completedLessons: new Set<string>(),
  completedCourses: new Set<string>(),
  unlockedModules: new Set<string>(),
  buttonClicks: new Set<string>(), // Track which flow buttons have been clicked
  totalXP: 2450,
  coursesCompleted: 0, // Will be calculated dynamically
  lastUpdateTime: Date.now(),
  currentLevel: calculateUserLevel(0) // Will be recalculated dynamically
};

// Helper function to reset global state when needed
export const resetGlobalProgressState = () => {
  globalProgressState = {
    completedLessons: new Set<string>(),
    completedCourses: new Set<string>(),
    totalXP: 2450,
    coursesCompleted: 0,
    lastUpdateTime: Date.now(),
    currentLevel: calculateUserLevel(0)
  };
  
  // Clear localStorage to force fresh load
  if (typeof window !== 'undefined') {
    localStorage.removeItem('learningProgress');
    sessionStorage.removeItem('fastStatsCache');
    sessionStorage.setItem('progressCacheInvalidated', Date.now().toString());
  }
};

// Helper function for debugging progress state
export const debugProgressState = () => {
  if (typeof window !== 'undefined') {
    console.log('Current Progress State:', {
      completedLessonsCount: globalProgressState.completedLessons.size,
      completedLessons: Array.from(globalProgressState.completedLessons),
      coursesCompleted: globalProgressState.coursesCompleted,
      totalXP: globalProgressState.totalXP,
      currentLevel: globalProgressState.currentLevel,
      lastUpdateTime: new Date(globalProgressState.lastUpdateTime).toISOString()
    });
  }
}

export const updateLessonProgress = async (courseId: string, lessonId: string, completed: boolean): Promise<void> => {
  try {
    await client.put(`/courses/${courseId}/lessons/${lessonId}/progress`, { completed });
  } catch (error) {
    console.log('🔧 LESSON UPDATE DEBUG:', {
      courseId,
      lessonId,
      completed,
      beforeUpdate: {
        completedLessonsCount: globalProgressState.completedLessons.size,
        completedLessons: Array.from(globalProgressState.completedLessons),
        coursesCompleted: globalProgressState.coursesCompleted,
        totalXP: globalProgressState.totalXP
      }
    });
    
    // Update global progress state for mock mode
    if (completed) {
      globalProgressState.completedLessons.add(lessonId);
      // Add XP for lesson completion (25 XP per lesson)
      globalProgressState.totalXP += 25;
      
      // Update learning streak
      if (typeof window !== 'undefined') {
        // Dynamically import streak service to avoid server-side issues
        import('../services/streakService').then(({ updateStreakOnLessonComplete }) => {
          updateStreakOnLessonComplete();
        }).catch(() => {
          // Ignore errors in streak update
        });
      }
    } else {
      globalProgressState.completedLessons.delete(lessonId);
      // Remove XP for lesson incompletion
      globalProgressState.totalXP = Math.max(0, globalProgressState.totalXP - 25);
    }
    
    globalProgressState.lastUpdateTime = Date.now();
    
    console.log('🔧 AFTER LESSON UPDATE:', {
      completedLessonsCount: globalProgressState.completedLessons.size,
      completedLessons: Array.from(globalProgressState.completedLessons),
      coursesCompleted: globalProgressState.coursesCompleted,
      totalXP: globalProgressState.totalXP
    });
    
    // CRITICAL: Save progress to localStorage (without calculated values)
    if (typeof window !== 'undefined') {
      localStorage.setItem('learningProgress', JSON.stringify({
        completedLessons: Array.from(globalProgressState.completedLessons),
        unlockedModules: Array.from(globalProgressState.unlockedModules),
        buttonClicks: Array.from(globalProgressState.buttonClicks),
        totalXP: globalProgressState.totalXP,
        lastUpdateTime: globalProgressState.lastUpdateTime
        // Note: Removed coursesCompleted and currentLevel - these are calculated dynamically
      }));
      
      // CRITICAL: Aggressive cache invalidation to prevent stale data
      // Set invalidation flag BEFORE clearing caches
      sessionStorage.setItem('progressCacheInvalidated', Date.now().toString());
      
      // Clear all relevant caches
      sessionStorage.removeItem('fastStatsCache');
      
      // Call global cache invalidation function if available
      if ((window as any).invalidateProgressCache) {
        (window as any).invalidateProgressCache();
      }
      
      // CRITICAL: Force immediate recalculation of course completion stats
      // This prevents the 0/7 bug by ensuring fresh data on next access
      setTimeout(async () => {
        try {
          // Pre-warm cache with fresh data to prevent race conditions
          if (typeof window !== 'undefined') {
            const { getCachedCourseData } = await import('../services/progressService');
            await getCachedCourseData(true); // Force refresh
          }
        } catch (e) {
          // Ignore errors in cache pre-warming
        }
      }, 0); // Immediate async execution
    }
    
    return new Promise((resolve) => {
      // Immediate resolve for instant UI response
      resolve();
    });
  }
};

// Load progress from localStorage on initialization
export const loadProgressFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('learningProgress');
    console.log('💾 LOADING FROM STORAGE:', { stored });
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('💾 PARSED STORAGE DATA:', parsed);
        
        const beforeLoad = {
          completedLessonsCount: globalProgressState.completedLessons.size,
          completedLessons: Array.from(globalProgressState.completedLessons)
        };
        
        globalProgressState.completedLessons = new Set(parsed.completedLessons || []);
        globalProgressState.totalXP = parsed.totalXP || 2450;
        globalProgressState.lastUpdateTime = parsed.lastUpdateTime || Date.now();
        
        const afterLoad = {
          completedLessonsCount: globalProgressState.completedLessons.size,
          completedLessons: Array.from(globalProgressState.completedLessons)
        };
        
        console.log('💾 STORAGE LOAD RESULT:', { beforeLoad, afterLoad });
        // Note: coursesCompleted and currentLevel will be recalculated in getAllCourses()
        // This prevents stale data from causing the 0/7 bug
      } catch (e) {
        console.warn('Failed to load progress from storage:', e);
      }
    } else {
      console.log('💾 NO STORAGE DATA FOUND');
    }
  }
};

// Get current progress state
export const getCurrentProgress = () => {
  return {
    ...globalProgressState,
    completedLessons: Array.from(globalProgressState.completedLessons)
  };
};

// Get current user level
export const getCurrentUserLevel = () => {
  return globalProgressState.currentLevel;
};

// Check if module is unlocked
export const isModuleUnlocked = (moduleId: string, course: Course): boolean => {
  // Always unlock the first module of any course
  const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
  if (moduleIndex === 0) {
    return true;
  }
  
  // Check if explicitly unlocked by button click (for Business Blueprint flow)
  if (globalProgressState.unlockedModules.has(moduleId)) {
    return true;
  }
  
  // For Start Here courses, enforce sequential completion
  const startHereCourses = ['business-blueprint', 'discovery-process', 'next-steps'];
  if (startHereCourses.includes(course.id)) {
    // Check if previous module is completed
    if (moduleIndex > 0) {
      const previousModule = course.modules[moduleIndex - 1];
      return previousModule.isCompleted;
    }
  }
  
  // For other courses, unlock all modules if user has appropriate access
  return false;
};

// Get button click status
export const getButtonClickStatus = (buttonType: 'enagic' | 'skills', lessonId: string): boolean => {
  const buttonKey = `${buttonType}-${lessonId}`;
  return globalProgressState.buttonClicks.has(buttonKey);
};