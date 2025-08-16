# 🎯 Admin Course Configuration Guide

**For easy management of new user experience and course priorities**

## 📍 Location
All course configuration is centralized in: `/lib/config/courseConfig.ts`

## 🔧 Primary Configuration Options

### **New User Experience**
```typescript
// Change which course new users see first
PRIMARY_START_COURSE_ID: 'business-blueprint'

// Backup courses if primary is unavailable
FALLBACK_START_COURSES: [
  'discovery-process',
  'next-steps'
]
```

### **User Interface Messages**
```typescript
// New user button text and icons
NEW_USER_MESSAGES: {
  welcomeTitle: 'Start Your Journey',
  continueButtonText: 'Start Your Journey',
  continueButtonIcon: 'fas fa-rocket'
}

// Returning user messages
RETURNING_USER_MESSAGES: {
  continueButtonText: 'Continue Learning',
  continueButtonIcon: 'fas fa-play'
}

// Course completion messages
COMPLETED_COURSE_MESSAGES: {
  moduleTitle: 'Course Completed! 🎉',
  lessonTitle: 'Choose your next adventure',
  continueButtonText: 'Choose Next Course',
  continueButtonIcon: 'fas fa-graduation-cap'
}
```

## 🔄 How The System Works

### **For New Users (No Progress)**
1. System checks `PRIMARY_START_COURSE_ID` first
2. If not available, tries each course in `FALLBACK_START_COURSES`
3. Shows first lesson of selected course
4. Displays "Start Your Journey" button with rocket icon
5. Shows "New Journey" badge instead of progress percentage

### **For Returning Users (With Progress)**
1. Finds most recently started course with incomplete lessons
2. Identifies next lesson to continue from
3. Shows actual progress percentage
4. Displays "Continue Learning" button

### **For Completed Courses**
1. Shows completion celebration message
2. Redirects to All Courses page for next selection
3. Displays "Choose Next Course" button

## 🛠️ Easy Admin Changes

### **Change Primary Start Course**
Simply update the course ID:
```typescript
PRIMARY_START_COURSE_ID: 'your-new-course-id'
```

### **Modify Button Text**
Update any message in the configuration:
```typescript
NEW_USER_MESSAGES: {
  continueButtonText: 'Begin Your Adventure', // Custom text
  continueButtonIcon: 'fas fa-star'           // Custom icon
}
```

### **Add Course Priorities**
Add course IDs to the fallback array:
```typescript
FALLBACK_START_COURSES: [
  'discovery-process',
  'next-steps',
  'your-new-course'  // New addition
]
```

## 📊 Current Course IDs
- `business-blueprint` - The Business Blueprint
- `discovery-process` - The Discovery Process  
- `next-steps` - Next Steps
- `tiktok-mastery` - TIK-TOK MASTERY
- `facebook-advertising` - Facebook Advertising Mastery
- `instagram-marketing` - Instagram Marketing
- `sales-funnel-mastery` - Sales Funnel Mastery

## 🎯 Smart Continue Learning Logic

### **Priority System:**
1. **Active Progress**: Shows course with recent incomplete lessons
2. **New User**: Shows configured primary start course
3. **Course Complete**: Redirects to course selection page

### **Dynamic Content:**
- Button text changes based on user state
- Icons adapt to user progress
- Progress badges show different states
- Messages are contextually relevant

## 🔄 Making Changes

### **Step 1: Update Configuration**
Edit `/lib/config/courseConfig.ts` with your desired changes

### **Step 2: Build & Deploy**
```bash
npm run build
pm2 restart ecosystem.config.cjs
```

### **Step 3: Test**
- Clear browser localStorage to test new user experience
- Check different progress states to verify behavior

## 💡 Best Practices

### **Course ID Management**
- Use descriptive, URL-friendly course IDs
- Keep IDs consistent across the system
- Document any ID changes for team coordination

### **Message Consistency**
- Keep button text concise (2-3 words max)
- Use appropriate FontAwesome icons
- Maintain consistent tone across messages

### **Priority Order**
- List fallback courses in order of preference
- Ensure all fallback courses exist in the system
- Test priority fallback behavior

---

**🎯 Result**: Complete admin control over new user onboarding and course progression with zero code changes required for most modifications!