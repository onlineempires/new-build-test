# Digital Era Learning Management System

## Project Overview
- **Name**: Digital Era Learning Management System
- **Goal**: Complete learning management system with ONLINE EMPIRES dashboard design
- **Features**: 
  - Pixel-perfect ONLINE EMPIRES courses page with achievement banners
  - Dashboard with statistics, progress tracking, and course management
  - Individual course detail pages with video player and lesson tracking
  - Level progression system with XP rewards and achievements
  - Mobile-first responsive design with Font Awesome icons

## URLs
- **Live Demo**: https://3000-i9us96luetzyr6dhv7ti9-6532622b.e2b.dev
- **Courses Page**: https://3000-i9us96luetzyr6dhv7ti9-6532622b.e2b.dev/courses
- **TikTok Mastery Course**: https://3000-i9us96luetzyr6dhv7ti9-6532622b.e2b.dev/courses/tiktok-mastery
- **Lesson Page Example**: https://3000-i9us96luetzyr6dhv7ti9-6532622b.e2b.dev/courses/tiktok-mastery/lesson-3-2
- **GitHub**: https://github.com/onlineempires/new-build-test

## Tech Stack
- **Frontend**: Next.js 12 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Font Awesome 6.4.0
- **Icons**: Font Awesome (FA) for navigation and UI elements
- **HTTP Client**: Axios with fallback to mock data
- **Process Management**: PM2 for development server
- **Typography**: Inter font for modern design

## Data Architecture
- **Mock API**: Comprehensive course data with TypeScript interfaces
- **Course Structure**: Courses → Modules → Lessons with progress tracking
- **Progress System**: XP points, achievements, streak tracking, completion status
- **User Data**: Profile information, learning statistics, notification system
- **Data Flow**: Pages → API Layer → Mock Data → UI Components

## Features Completed
✅ **ONLINE EMPIRES Courses Page**: Complete redesign matching provided screenshot  
✅ **Statistics Cards**: Course Completed 53%, Learning Streak 12 days, Achievements 23, Hours Learned 127  
✅ **Achievement Banner**: Green notification banner with "Course Crusher" achievement and +350 XP  
✅ **Start Here Section**: 3 foundational courses (Business Blueprint, Discovery Process, Next Steps)  
✅ **Advanced Training**: 6 skill-building courses with different completion states  
✅ **Recent Achievements**: Circular achievement icons with proper Font Awesome integration  
✅ **Level 13 Preview**: Purple gradient section with XP progress bar and level advancement  
✅ **Course Detail Pages**: Individual course pages with video player interface  
✅ **Progress Tracking**: Dynamic progress indicators and completion states  
✅ **Font Awesome Integration**: Complete icon system across all components  
✅ **Responsive Design**: Mobile-first design with proper breakpoints  
✅ **Navigation System**: Sidebar with active state detection for courses  
✅ **Mock API System**: Comprehensive data structure with fallback patterns  
✅ **Individual Lesson Pages**: Dedicated lesson pages with video player and content  
✅ **Seamless Upgrade Banner**: Premium upgrade banner in bottom right corner matching reference design  
✅ **Lesson Completion System**: Checkbox completion with progress tracking and navigation  
✅ **Sticky Sidebar**: Right sidebar with lesson progress, navigation, and upgrade banner  
✅ **Module Overview**: Course structure navigation with current lesson highlighting  

## Current Course Sections

### Start Here (Required Foundation)
1. **The Business Blueprint** - COMPLETED (15 lessons, 2.5 hours, +200 XP)
2. **The Discovery Process** - IN PROGRESS 67% (8 lessons, 1.5 hours, +160 XP)
3. **Next Steps** - LOCKED (4 lessons, 1 hour, +100 XP)

### Advanced Training (Skill Builders)
1. **TikTok Mastery** - IN PROGRESS 67% (25 lessons, 6 hours, +450 XP)
2. **Facebook Advertising Mastery** - COMPLETED (22 lessons, 8 hours, +500 XP)
3. **Instagram Growth Hacks** - NOT STARTED (18 lessons, 4.5 hours, +350 XP)
4. **Email Marketing Secrets** - AVAILABLE SOON (16 lessons, 5 hours, +400 XP)
5. **Sales Psychology** - COMPLETED (14 lessons, 3.5 hours, +300 XP)
6. **Team Building Mastery** - IN PROGRESS 25% (20 lessons, 6.5 hours, +480 XP)

## User Guide
1. **Dashboard Navigation**: Use sidebar to navigate between Dashboard, All Courses, and other sections
2. **Courses Page**: View your learning journey with progress tracking and achievement system
3. **Course Selection**: Click any course card to access detailed course content and lesson overview
4. **Lesson Learning**: Click individual lessons to access dedicated two-column lesson pages
5. **Video Learning**: Watch lessons with enhanced video player and progress tracking
6. **Download Materials**: Access lesson worksheets and templates from the materials section
7. **Track Progress**: Monitor your advancement with circular progress indicators and detailed stats
8. **Lesson Completion**: Use the checkbox to mark lessons complete and unlock next content
9. **Continue Learning**: Use "Continue to Next Lesson" button for seamless progression
10. **Premium Upgrade**: Upgrade banner appears naturally below the continue button
11. **Progress Tracking**: Your progress is automatically saved and continues where you left off
9. **Achievements**: Unlock achievements by completing courses and maintaining learning streaks
10. **Level System**: Earn XP points to advance through levels and unlock new content

## Development Commands
```bash
# Install dependencies
npm install

# Start development server with PM2
pm2 start ecosystem.config.cjs

# Stop server
pm2 stop dashboard-webapp

# View logs
pm2 logs --nostream

# Build for production
npm run build

# Start production server
npm start
```

## Deployment
- **Platform**: Next.js Compatible (Vercel, Netlify, etc.)
- **Status**: ✅ Active on sandbox environment
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+
- **PM2 Configuration**: ecosystem.config.cjs
- **Last Updated**: August 2025

## Component Architecture
```
components/
├── layout/
│   ├── AppLayout.tsx           # Main layout with header and sidebar
│   └── Sidebar.tsx             # Navigation with Font Awesome icons
├── dashboard/
│   ├── StatsCards.tsx          # Statistics display cards
│   ├── ContinueJourney.tsx     # Course progress section
│   ├── StartHereGrid.tsx       # Learning modules grid
│   ├── RecentAchievements.tsx  # Achievement display
│   ├── NotificationDropdown.tsx # Notification management
│   ├── ProfileDropdown.tsx     # User profile menu
│   └── FeedbackModal.tsx       # Feedback form modal
pages/
├── index.tsx                           # Dashboard homepage
├── courses.tsx                         # ONLINE EMPIRES courses page
├── courses/[courseId].tsx              # Individual course detail pages
├── courses/[courseId]/[lessonId].tsx   # Individual lesson pages with video player
├── _app.tsx                            # App wrapper
└── _document.tsx                       # Document with Font Awesome CDN
lib/
└── api/
    ├── courses.ts              # Course data and API functions
    └── client.ts               # HTTP client configuration
```

## ONLINE EMPIRES Design Features
- **Achievement Banners**: Dynamic green notification banners with XP rewards
- **Progress Indicators**: Visual progress bars with percentage completion
- **Course Status System**: Completed, In Progress, Not Started, Locked, Available Soon
- **XP Reward System**: Points awarded for lesson and course completion
- **Level Progression**: Preview sections showing next level requirements
- **Circular Achievement Icons**: Recent achievements with Font Awesome icons
- **Course Categories**: Structured learning path with foundational and advanced sections
- **Visual Course Cards**: Gradient backgrounds with relevant icons for each course

## Lesson Page Features (ULTRA-CLEAN DESIGN)
- **Two-Column Layout**: Video player on left (2/3 width) + progress sidebar on right (1/3 width)
- **Breadcrumb Navigation**: Dashboard > All Courses > Course Name > Lesson Name navigation path
- **Your Progress Section**: Circular progress indicator showing course completion percentage (67%)
- **Detailed Progress Stats**: Module progress (2 of 5 lessons), Course progress (8 of 15 lessons), XP Earned (+50 XP)
- **Lesson Materials**: Downloadable resources with file icons (PDF worksheets, DOCX templates)
- **Enhanced Video Player**: Realistic landscape background with play button and video controls
- **Video Progress Display**: Time indicator (3:44 / 9:56) with progress bar and control buttons
- **Lesson Overview**: Comprehensive description and key takeaways with checkmark list

### **Ultra-Clean Two-Rows Completion Section**
- **Vertical Stacking Layout**: Lesson completion and upgrade banner in two separate rows
- **Top Row**: Checkbox and "Continue to Next Lesson" button with perfect size fit
- **Bottom Row**: Fixed upgrade banner (no close button) for consistent offer display
- **Separate White Cards**: Each row has individual white background cards with subtle shadows
- **Clean Alignment**: Lesson overview box aligned properly with sidebar elements (no overhanging)
- **Enhanced Lesson Overview**: Added estimated time and improved height balance
- **Subscription Logic**: Upgrade banner only shows for non-annual subscribers
- **Admin Panel Ready**: User subscription type easily configurable for offer management
- **Mobile Responsive**: Rows maintain clean stacking on all screen sizes
- **Responsive Padding**: p-4 on mobile, p-6 on desktop for optimal touch targets
- **Crown Icon + LIMITED TIME Badge**: Yellow badge with crown symbol for premium urgency
- **Fixed Offer Display**: No dismissal option - permanent upgrade opportunity for eligible users

## Mobile Responsiveness
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Grid System**: Responsive course grids (1 col mobile, 2 col tablet, 3 col desktop)
- **Navigation**: Collapsible sidebar with hamburger menu
- **Touch Targets**: Proper button sizing for mobile interaction
- **Font Scaling**: Responsive typography with Inter font family