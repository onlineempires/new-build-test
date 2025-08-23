import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, CheckCircle, Calendar, ExternalLink, Clock, Play, Lock } from 'lucide-react';
import { useRouter } from 'next/router';

interface StepData {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  watchProgress: number; // 0-100
  completed: boolean;
  isActive: boolean;
}

interface OnboardingEvent {
  event: string;
  step?: number;
  fromStep?: number;
  toStep?: number;
  timestamp: string;
}

interface OptimizedTrialUserDashboardProps {
  onVideoComplete?: (videoId: string) => void;
  userId?: string; // For persistence
}

export default function OptimizedTrialUserDashboard({ 
  onVideoComplete,
  userId = 'guest'
}: OptimizedTrialUserDashboardProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showMarkComplete, setShowMarkComplete] = useState(false);
  const [, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const [showCTAs, setShowCTAs] = useState(false);

  // Developer mode detection (only show dev tools in development)
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Three-step configuration with updated URLs
  const [steps, setSteps] = useState<StepData[]>([
    {
      id: 'intro-welcome',
      title: 'Intro / Welcome',
      duration: '3 to 5 min',
      videoUrl: 'https://iframe.mediadelivery.net/embed/91637/3ee175b2-8e7f-40b1-9040-e16c78e65bb1',
      watchProgress: 0,
      completed: false,
      isActive: true,
    },
    {
      id: 'business-launch-blueprint',
      title: 'Business Launch Blueprint',
      duration: '15 min',
      videoUrl: 'https://iframe.mediadelivery.net/embed/91637/150a6e4c-e7da-48f6-8ee6-2c2693672f09',
      watchProgress: 0,
      completed: false,
      isActive: false,
    },
    {
      id: 'your-next-steps',
      title: 'Your Next Steps',
      duration: '10 min',
      videoUrl: 'https://iframe.mediadelivery.net/embed/91637/3ee175b2-8e7f-40b1-9040-e16c78e65bb1', // Demo placeholder
      watchProgress: 0,
      completed: false,
      isActive: false,
    },
  ]);

  const currentStep = steps[activeStepIndex];
  const completedStepsCount = steps.filter(step => step.completed).length;
  const allStepsCompleted = completedStepsCount === 3;

  // Persistence key based on userId
  const getStorageKey = (suffix: string) => `onboarding_${userId}_${suffix}`;

  // Load state from localStorage
  useEffect(() => {
    try {
      const savedSteps = localStorage.getItem(getStorageKey('steps'));
      const savedActiveIndex = localStorage.getItem(getStorageKey('activeStepIndex'));
      const savedLastWatched = localStorage.getItem(getStorageKey('lastWatchedTime'));
      const savedShowCTAs = localStorage.getItem(getStorageKey('showCTAs'));

      if (savedSteps) {
        const parsedSteps = JSON.parse(savedSteps);
        setSteps(parsedSteps);
      }

      if (savedActiveIndex) {
        setActiveStepIndex(parseInt(savedActiveIndex, 10));
      }

      if (savedLastWatched) {
        setLastWatchedTime(parseFloat(savedLastWatched));
      }

      if (savedShowCTAs) {
        setShowCTAs(JSON.parse(savedShowCTAs));
      }
    } catch (error) {
      console.warn('Failed to load onboarding progress:', error);
    }
  }, [userId]);

  // Save state to localStorage
  const saveState = (updatedSteps: StepData[], stepIndex: number, lastTime: number = 0, ctasVisible: boolean = false) => {
    try {
      localStorage.setItem(getStorageKey('steps'), JSON.stringify(updatedSteps));
      localStorage.setItem(getStorageKey('activeStepIndex'), stepIndex.toString());
      localStorage.setItem(getStorageKey('lastWatchedTime'), lastTime.toString());
      localStorage.setItem(getStorageKey('showCTAs'), JSON.stringify(ctasVisible));
      localStorage.setItem(getStorageKey('timestamp'), new Date().toISOString());
    } catch (error) {
      console.warn('Failed to save onboarding progress:', error);
    }
  };

  // Event tracking function
  const trackEvent = (eventName: string, data: any = {}) => {
    const event: OnboardingEvent = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...data,
    };
    
    console.log('📊 Onboarding Event:', event);
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        custom_parameter: JSON.stringify(data),
      });
    }
  };

  // Video progress tracking simulation
  useEffect(() => {
    if (!isVideoLoaded) return;

    const interval = setInterval(() => {
      // Simulate video progress (in real implementation, this would come from video API)
      setCurrentVideoTime(prev => {
        const newTime = prev + 1;
        const progress = videoDuration > 0 ? Math.min((newTime / videoDuration) * 100, 100) : 0;
        
        // Update step progress
        const updatedSteps = [...steps];
        updatedSteps[activeStepIndex].watchProgress = progress;
        setSteps(updatedSteps);
        
        // Check if 90% reached
        if (progress >= 90 && !showMarkComplete) {
          setShowMarkComplete(true);
          trackEvent('onboarding_video_90pct_reached', { step: activeStepIndex + 1 });
        }
        
        // Update last watched time for seeking restriction
        if (newTime > lastWatchedTime) {
          setLastWatchedTime(newTime);
          saveState(updatedSteps, activeStepIndex, newTime, showCTAs);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVideoLoaded, videoDuration, activeStepIndex, showMarkComplete, lastWatchedTime, steps, showCTAs]);

  // Handle video load - immediately start playing
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setVideoDuration(300); // 5 minutes default, would be dynamic in real implementation
    setCurrentVideoTime(lastWatchedTime);
    trackEvent('onboarding_video_started', { step: activeStepIndex + 1 });
  };

  // Developer tool: Simulate 90% watch
  const handleSimulate90Percent = () => {
    if (!isDevelopment) return;
    
    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex].watchProgress = 90;
    setSteps(updatedSteps);
    setShowMarkComplete(true);
    trackEvent('dev_simulate_90_percent', { step: activeStepIndex + 1 });
  };

  // Developer tool: Reset user progress
  const handleResetProgress = () => {
    if (!isDevelopment) return;

    const resetSteps = steps.map((step, index) => ({
      ...step,
      watchProgress: 0,
      completed: false,
      isActive: index === 0
    }));

    setSteps(resetSteps);
    setActiveStepIndex(0);
    setIsVideoLoaded(false);
    setShowMarkComplete(false);
    setCurrentVideoTime(0);
    setLastWatchedTime(0);
    setShowCTAs(false);
    
    // Clear localStorage
    try {
      localStorage.removeItem(getStorageKey('steps'));
      localStorage.removeItem(getStorageKey('activeStepIndex'));
      localStorage.removeItem(getStorageKey('lastWatchedTime'));
      localStorage.removeItem(getStorageKey('showCTAs'));
      localStorage.removeItem(getStorageKey('timestamp'));
    } catch (error) {
      console.warn('Failed to clear onboarding progress:', error);
    }

    trackEvent('dev_reset_progress');
  };

  // Handle Mark as Complete
  const handleMarkComplete = () => {
    if (currentStep.watchProgress < 90) return;

    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex].completed = true;
    updatedSteps[activeStepIndex].isActive = false;

    trackEvent('onboarding_mark_complete_clicked', { step: activeStepIndex + 1 });

    // Handle step-specific completion logic
    if (activeStepIndex === 0) {
      // Step 1: Auto-advance to Step 2
      if (activeStepIndex + 1 < steps.length) {
        updatedSteps[activeStepIndex + 1].isActive = true;
        setActiveStepIndex(activeStepIndex + 1);
        setIsVideoLoaded(false);
        setShowMarkComplete(false);
        setCurrentVideoTime(0);
        setLastWatchedTime(0);
        
        trackEvent('onboarding_step_unlocked', {
          fromStep: activeStepIndex + 1,
          toStep: activeStepIndex + 2,
        });
      }
    } else if (activeStepIndex === 1) {
      // Step 2: Show CTAs and unlock Step 3
      setShowCTAs(true);
      if (activeStepIndex + 1 < steps.length) {
        // Don't auto-advance, just unlock next step
        // User will manually navigate to step 3
      }
    } else if (activeStepIndex === 2) {
      // Step 3: Show CTAs (same as Step 2)
      setShowCTAs(true);
      trackEvent('onboarding_all_completed');
    }

    setSteps(updatedSteps);
    const newActiveIndex = activeStepIndex === 0 ? activeStepIndex + 1 : activeStepIndex;
    saveState(updatedSteps, newActiveIndex, 0, activeStepIndex >= 1);
    
    if (onVideoComplete) {
      onVideoComplete(currentStep.id);
    }
  };

  // Handle CTA clicks
  const handleSchedulerClick = () => {
    trackEvent('onboarding_scheduler_clicked', { step: activeStepIndex + 1 });
    window.open('/scheduler', '_blank');
  };

  const handleVSLClick = () => {
    trackEvent('onboarding_vsl_clicked', { step: activeStepIndex + 1 });
    router.push('/courses/vsl-skills');
  };

  // Handle pill click (step navigation)
  const handlePillClick = (stepIndex: number) => {
    // Allow navigation to completed steps, or to the next step if current is completed
    const canNavigate = stepIndex <= activeStepIndex || 
                       (stepIndex === activeStepIndex + 1 && steps[activeStepIndex].completed) ||
                       stepIndex < steps.length && steps[stepIndex - 1]?.completed;
    
    if (canNavigate) {
      const updatedSteps = [...steps];
      updatedSteps[activeStepIndex].isActive = false;
      updatedSteps[stepIndex].isActive = true;
      
      setActiveStepIndex(stepIndex);
      setSteps(updatedSteps);
      setIsVideoLoaded(false);
      setShowMarkComplete(false);
      
      // Resume progress if returning to a step
      const resumeTime = steps[stepIndex].watchProgress > 0 ? 
        (steps[stepIndex].watchProgress / 100) * videoDuration : 0;
      setCurrentVideoTime(resumeTime);
      
      saveState(updatedSteps, stepIndex, 0, showCTAs);
      trackEvent('onboarding_step_navigation', { 
        fromStep: activeStepIndex + 1, 
        toStep: stepIndex + 1 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile-First Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Ultra-Premium Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight">
            Welcome to Your Business Transformation
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Your step-by-step journey to online business success starts here
          </p>
        </div>

        {/* Ultra-Sleek 3-Step Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handlePillClick(index)}
                  disabled={
                    index > activeStepIndex && 
                    !steps[index - 1]?.completed && 
                    !(index === activeStepIndex + 1 && steps[activeStepIndex].completed)
                  }
                  className={`
                    group flex flex-col items-center gap-2 px-3 py-4 rounded-2xl font-medium text-sm sm:text-base
                    transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${
                      step.completed
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:border-emerald-300 focus:ring-emerald-500'
                        : step.isActive
                        ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-lg shadow-indigo-200/50 focus:ring-indigo-500'
                        : index <= activeStepIndex || (index === activeStepIndex + 1 && steps[activeStepIndex].completed)
                        ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm focus:ring-gray-400'
                        : 'bg-gray-50 text-gray-400 border-2 border-gray-100 cursor-not-allowed opacity-60'
                    }
                  `}
                >
                  {step.completed ? (
                    <>
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-xs sm:text-sm">Completed</div>
                        <div className="text-xs opacity-80 hidden sm:block">{step.title}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                        ${step.isActive 
                          ? 'bg-white/20 text-white' 
                          : index <= activeStepIndex || (index === activeStepIndex + 1 && steps[activeStepIndex].completed)
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-gray-100 text-gray-400'
                        }
                      `}>
                        {index <= activeStepIndex || (index === activeStepIndex + 1 && steps[activeStepIndex].completed) 
                          ? (index + 1)
                          : <Lock className="w-4 h-4" />
                        }
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-xs sm:text-sm">{step.title}</div>
                        <div className="text-xs opacity-75">{step.duration}</div>
                      </div>
                    </>
                  )}
                </button>
                
                {/* Progress Connectors */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2 transition-colors duration-300
                    ${index < activeStepIndex || step.completed ? 'bg-emerald-300' : 'bg-gray-200'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Success Badge */}
          {allStepsCompleted && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-200">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">3 of 3 completed</span>
              </div>
            </div>
          )}
        </div>

        {/* Ultra-Premium Video Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/60 overflow-hidden mb-8 sm:mb-12">
          {/* Video Header */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {currentStep.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {currentStep.duration} · Step {activeStepIndex + 1} of 3
            </p>
          </div>

          {/* Mobile-Optimized Video Player */}
          <div className="p-4 sm:p-8">
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-inner">
              {currentStep.videoUrl ? (
                <>
                  <iframe
                    ref={videoRef}
                    src={currentStep.videoUrl}
                    title={currentStep.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoLoad}
                  />
                  
                  {/* Premium Play Overlay - Single Click Fix */}
                  {!isVideoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <button
                        onClick={handleVideoLoad}
                        className="group flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl sm:rounded-2xl 
                                 hover:bg-gray-50 transition-all duration-200 shadow-2xl
                                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/40"
                      >
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-full
                                      group-hover:bg-indigo-700 transition-colors">
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-base sm:text-lg">Play Video</div>
                          <div className="text-sm text-gray-600">{currentStep.duration}</div>
                        </div>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-base sm:text-lg">Video coming soon...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mark as Complete Button */}
            {showMarkComplete && currentStep.watchProgress >= 90 && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={handleMarkComplete}
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 text-white font-semibold text-base sm:text-lg rounded-xl sm:rounded-2xl
                           hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  Mark as Complete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Premium CTA Cards - Show after Step 2 or Step 3 completion */}
        {((activeStepIndex === 1 && steps[1].completed) || (activeStepIndex === 2 && steps[2].completed)) && showCTAs && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 animate-in slide-in-from-bottom-4 duration-500">
            {/* Book Success Call CTA */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-xl sm:rounded-2xl group-hover:bg-blue-100 transition-colors">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Book Your Success Call with Enagic
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    Get personalized guidance from our success team and accelerate your journey
                  </p>
                  <button
                    onClick={handleSchedulerClick}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg sm:rounded-xl text-sm sm:text-base
                             hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span>Book Call</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* VSL Skills CTA */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-50 rounded-xl sm:rounded-2xl group-hover:bg-purple-100 transition-colors">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Learn VSL Skills
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    Master video sales letters and conversion techniques that drive results
                  </p>
                  <button
                    onClick={handleVSLClick}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white font-medium rounded-lg sm:rounded-xl text-sm sm:text-base
                             hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    <span>Start Learning</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Developer Testing Tools - Only visible in development */}
        {isDevelopment && (
          <div className="mb-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <h4 className="font-semibold text-yellow-800 mb-3">Developer Testing Tools</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulate90Percent}
                className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base"
              >
                Simulate 90% Watch
              </button>
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Reset User Progress
              </button>
            </div>
            <p className="text-xs sm:text-sm text-yellow-700 mt-2">
              These tools are only visible in development mode
            </p>
          </div>
        )}

        {/* View All Course Modules Link */}
        <div className="text-center pt-8 sm:pt-12 border-t border-gray-100">
          <button
            onClick={() => router.push('/courses')}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-base sm:text-lg transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-2 py-1"
          >
            View All Course Modules
          </button>
        </div>

        {/* Ultra-Premium All Completed Success Message */}
        {allStepsCompleted && (
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-emerald-900 mb-3 sm:mb-4">
              Congratulations! 🎉
            </h3>
            <p className="text-lg sm:text-xl text-emerald-700 max-w-2xl mx-auto leading-relaxed">
              You've completed your onboarding journey. Ready to build your online business empire!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}