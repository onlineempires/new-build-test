# Library (Beta) QA Checklist

## ✅ Quick View Modal Redesign

### Modal Layout & Behavior
- [ ] Modal opens centered within the Library content area
- [ ] Global header and sidebar remain visible when modal is open
- [ ] No large hero banner inside modal
- [ ] Compact header with title, badges (type/level/progress), and close button
- [ ] One-sentence subtitle below title
- [ ] Compact meta row with duration, level, and updated date
- [ ] Topics chips displayed below meta row (max 4 shown)

### Responsive Design
- [ ] **Desktop**: Width clamp(720px, 62vw, 920px), max-height 70vh
- [ ] **Mobile**: Width 92vw, max-height 90vh
- [ ] Content fits without scrolling on desktop (uses line-clamp instead)
- [ ] Mobile allows body section to scroll if needed, footer stays pinned
- [ ] No layout jank when opening or closing

### CTAs and Navigation
- [ ] **Primary button**: Shows "Start course" for new courses
- [ ] **Primary button**: Shows "Continue course" if user has progress
- [ ] **Primary button**: Routes to correct lesson using lowercase URLs
- [ ] **Primary button**: Closes modal after navigation
- [ ] **Secondary button**: "View details" opens course page
- [ ] **Secondary button**: Uses lowercase URLs
- [ ] Both buttons are large and prominent in pinned footer
- [ ] No Next.js multiple children Link errors

### Accessibility & UX
- [ ] **Escape key** closes modal
- [ ] **Focus trap** keeps focus inside modal when open
- [ ] **Primary button** has visible focus ring
- [ ] Close button (X) works properly
- [ ] Clicking overlay closes modal
- [ ] Modal prevents body scroll when open

## ✅ Theme Switcher

### Theme Options
- [ ] Theme switcher appears in Library header toolbar
- [ ] Four options available: Light, Dark, Pink, Blue
- [ ] Selection persists to localStorage with key `library:theme`
- [ ] Theme applies immediately on change
- [ ] Default theme is Dark

### Visual Changes
- [ ] Cards update colors instantly when theme changes
- [ ] Modal updates colors instantly when theme changes
- [ ] Background colors change smoothly with CSS transitions
- [ ] Text colors adapt properly for readability
- [ ] Accent colors change for buttons and highlights
- [ ] CSS variables work: `--lib-bg`, `--lib-panel`, `--lib-text`, `--lib-accent`

### Theme Colors
- [ ] **Light**: Readable contrast, blue accent (#3b82f6)
- [ ] **Dark**: Deep backgrounds, blue accent (#2563eb)  
- [ ] **Pink**: Pink accent (#ec4899), appropriate text colors
- [ ] **Blue**: Light blue accent (#60a5fa), appropriate text colors

## ✅ Progress & Routing Logic

### Resume Logic Consistency
- [ ] Library card "Continue" pill uses same logic as modal primary CTA
- [ ] Both show same label ("Start course" vs "Continue course")
- [ ] Both route to same target lesson
- [ ] Progress detection works from localStorage keys like `lib:prog:${userId}:${courseSlug}:${lessonSlug}`
- [ ] First incomplete lesson is found correctly
- [ ] Falls back to first lesson if no progress exists

### URL Routing
- [ ] All learning URLs use lowercase format: `/library/learn/[courseSlug]/lesson/[lessonSlug]`
- [ ] Modal primary CTA uses `router.push(href.toLowerCase())`
- [ ] No direct Link wrapping of buttons with multiple children
- [ ] Course details links use lowercase: `/courses/[courseSlug]`
- [ ] Navigation works correctly from modal

## ✅ Link Multiple-Children Fixes

### Component Safety
- [ ] QuickViewDialog primary/secondary buttons use `router.push` or single child elements
- [ ] Library cards use SafeLink with single `<span>` children or `router.push`
- [ ] Lesson list items use proper single-child Link structure
- [ ] No console errors about "multiple children passed to Link"
- [ ] All clickable elements function properly

## ✅ Mobile Responsiveness

### Layout Adaptation  
- [ ] Theme switcher stacks properly on mobile in header
- [ ] Search input remains usable on mobile devices
- [ ] Modal sizing works on various mobile screen sizes
- [ ] Footer buttons stack vertically on mobile
- [ ] Touch targets are appropriately sized (min 44px)
- [ ] Text remains readable at mobile sizes

## ✅ Technical Implementation

### Dependencies & Setup
- [ ] shadcn/ui components (Dialog, Select, Button) work properly
- [ ] @radix-ui dependencies installed correctly
- [ ] Tailwind CSS variables and line-clamp plugin function
- [ ] CSS theme variables update dynamically
- [ ] TypeScript compilation succeeds without errors

### Performance & Loading
- [ ] Modal opens/closes smoothly without performance issues
- [ ] Theme switching is instant
- [ ] No memory leaks from event listeners
- [ ] localStorage operations don't block UI
- [ ] Component re-renders are optimized

## 🎯 Test Scenarios

1. **New User Flow**: Click course card → Modal opens → "Start course" → Routes to first lesson
2. **Returning User Flow**: Click course with progress → Modal opens → "Continue course" → Routes to next incomplete lesson  
3. **Theme Switching**: Change theme in header → All components update colors immediately
4. **Mobile Experience**: Open modal on mobile → Footer stays pinned → Buttons stack properly
5. **Keyboard Navigation**: Use Tab/Shift+Tab → Focus trap works → Escape closes modal
6. **Multiple Browsers**: Test localStorage persistence across browser sessions

## 🚨 Critical Blockers

- [ ] Modal fails to open or center properly
- [ ] Primary CTA doesn't route to correct lesson
- [ ] Theme switcher doesn't persist or update colors
- [ ] Mobile modal is unusable (too small/large, footer hidden)
- [ ] Link multiple-children errors in console
- [ ] Progress detection completely broken

---

**Testing URLs:**
- Library (Original): https://3000-ihrwrmyktx1wp4qcvuc11-6532622b.e2b.dev/library
- Library (Beta): https://3000-ihrwrmyktx1wp4qcvuc11-6532622b.e2b.dev/library/(beta) 
- Sample Lesson: https://3000-ihrwrmyktx1wp4qcvuc11-6532622b.e2b.dev/library/learn/trust-cycles/lesson/lesson-1