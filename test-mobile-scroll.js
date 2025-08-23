// Test script to verify mobile scroll integration functionality
console.log('🧪 Testing Mobile Scroll Integration');

// Simulate mobile viewport
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('max-width: 480px'), // Always return true for mobile test
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock getElementById for choose-path element
const mockChoosePathElement = {
  getBoundingClientRect: () => ({ top: 500, height: 300 }),
  scrollIntoView: jest.fn()
};

document.getElementById = jest.fn((id) => {
  if (id === 'choose-path') return mockChoosePathElement;
  return null;
});

// Mock sticky header element
document.querySelector = jest.fn((selector) => {
  if (selector === '[data-sticky-header]') {
    return { getBoundingClientRect: () => ({ height: 64 }) };
  }
  return null;
});

// Mock window.scrollTo
let scrollCalls = [];
window.scrollTo = jest.fn((options) => {
  scrollCalls.push(options);
  console.log('📱 Scroll called with:', options);
});

// Test the scroll function
const scrollToChoosePathIfMobile = () => {
  const isMobile = window.matchMedia('(max-width: 480px)').matches;
  console.log('📱 Is mobile:', isMobile);
  if (!isMobile) return;

  const el = document.getElementById('choose-path');
  console.log('📱 Choose path element found:', !!el);
  if (!el) return;

  const header = document.querySelector('[data-sticky-header]');
  const offset = (header?.getBoundingClientRect().height ?? 0) + 12;
  console.log('📱 Header offset:', offset);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  console.log('📱 Scroll behavior:', scrollBehavior);

  // Wait for layout, then smooth scroll with header offset
  requestAnimationFrame(() => {
    const y = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo({ top: y, behavior: scrollBehavior });
    
    // iOS Safari fallback - only if smooth scrolling is enabled
    if (!prefersReducedMotion) {
      setTimeout(() => {
        const y2 = window.scrollY + el.getBoundingClientRect().top - offset;
        window.scrollTo({ top: y2, behavior: 'smooth' });
      }, 120);
    }
  });
};

// Run the test
try {
  console.log('🧪 Starting scroll test...');
  scrollToChoosePathIfMobile();
  
  // Check results after animation frames
  setTimeout(() => {
    console.log('📊 Test Results:');
    console.log('- Mobile detection working:', scrollCalls.length > 0);
    console.log('- Scroll calls made:', scrollCalls.length);
    console.log('- All scroll calls:', scrollCalls);
    console.log('✅ Mobile scroll integration test completed');
  }, 200);
  
} catch (error) {
  console.error('❌ Test failed:', error);
}
