import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, CheckCircle, Calendar, ExternalLink, Clock, Play, Lock, ArrowRight } from 'lucide-react';
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
  const choosePathRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showMarkComplete, setShowMarkComplete] = useState(false);
  const [, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const [showChoosePath, setShowChoosePath] = useState(false);

  // Developer mode detection
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Three-step configuration
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
      videoUrl: 'https://iframe.mediadelivery.net/embed/91637/3ee175b2-8e7f-40b1-9040-e16c78e65bb1', // Placeholder
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
      const savedShowChoosePath = localStorage.getItem(getStorageKey('showChoosePath'));

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

      if (savedShowChoosePath) {
        setShowChoosePath(JSON.parse(savedShowChoosePath));
      }
    } catch (error) {
      console.warn('Failed to load onboarding progress:', error);
    }
  }, [userId]);

  // Save state to localStorage
  const saveState = (updatedSteps: StepData[], stepIndex: number, lastTime: number = 0, choosePathVisible: boolean = false) => {
    try {
      localStorage.setItem(getStorageKey('steps'), JSON.stringify(updatedSteps));
      localStorage.setItem(getStorageKey('activeStepIndex'), stepIndex.toString());
      localStorage.setItem(getStorageKey('lastWatchedTime'), lastTime.toString());
      localStorage.setItem(getStorageKey('showChoosePath'), JSON.stringify(choosePathVisible));
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
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        custom_parameter: JSON.stringify(data),
      });
    }
  };

  // Auto-scroll to Choose Your Path section
  const scrollToChoosePath = () => {
    if (choosePathRef.current) {
      setTimeout(() => {
        choosePathRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300); // Wait for animation to start
    }
  };

  // Video progress tracking simulation
  useEffect(() => {
    if (!isVideoLoaded) return;

    const interval = setInterval(() => {
      setCurrentVideoTime(prev => {
        const newTime = prev + 1;
        const progress = videoDuration > 0 ? Math.min((newTime / videoDuration) * 100, 100) : 0;
        
        const updatedSteps = [...steps];
        updatedSteps[activeStepIndex].watchProgress = progress;
        setSteps(updatedSteps);
        
        if (progress >= 90 && !showMarkComplete) {
          setShowMarkComplete(true);
          trackEvent('onboarding_video_90pct_reached', { step: activeStepIndex + 1 });
        }
        
        if (newTime > lastWatchedTime) {
          setLastWatchedTime(newTime);
          saveState(updatedSteps, activeStepIndex, newTime, showChoosePath);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVideoLoaded, videoDuration, activeStepIndex, showMarkComplete, lastWatchedTime, steps, showChoosePath]);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setVideoDuration(300);
    setCurrentVideoTime(lastWatchedTime);
    trackEvent('onboarding_video_started', { step: activeStepIndex + 1 });
  };

  // Developer tools
  const handleSimulate90Percent = () => {
    if (!isDevelopment) return;
    
    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex].watchProgress = 90;
    setSteps(updatedSteps);
    setShowMarkComplete(true);
    trackEvent('dev_simulate_90_percent', { step: activeStepIndex + 1 });
  };

  const handleResetToNewUser = () => {
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
    setShowChoosePath(false);
    
    try {
      localStorage.removeItem(getStorageKey('steps'));
      localStorage.removeItem(getStorageKey('activeStepIndex'));
      localStorage.removeItem(getStorageKey('lastWatchedTime'));
      localStorage.removeItem(getStorageKey('showChoosePath'));
      localStorage.removeItem(getStorageKey('timestamp'));
    } catch (error) {
      console.warn('Failed to clear onboarding progress:', error);
    }

    trackEvent('dev_reset_to_new_user');
  };

  // Handle Mark as Complete
  const handleMarkComplete = () => {
    if (currentStep.watchProgress < 90) return;

    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex].completed = true;
    updatedSteps[activeStepIndex].isActive = false;

    trackEvent('onboarding_mark_complete_clicked', { step: activeStepIndex + 1 });

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
    } else if (activeStepIndex === 1 || activeStepIndex === 2) {
      // Step 2 or Step 3: Show Choose Your Path section
      setShowChoosePath(true);
      scrollToChoosePath();
      
      if (activeStepIndex === 2) {
        trackEvent('onboarding_all_completed');
      }
    }

    setSteps(updatedSteps);
    const newActiveIndex = activeStepIndex === 0 ? activeStepIndex + 1 : activeStepIndex;
    saveState(updatedSteps, newActiveIndex, 0, activeStepIndex >= 1);
    
    if (onVideoComplete) {
      onVideoComplete(currentStep.id);
    }
  };

  // Handle Continue to Video 3
  const handleContinueToVideo3 = () => {
    if (activeStepIndex !== 1 || !steps[1].completed) return;

    const updatedSteps = [...steps];
    updatedSteps[1].isActive = false;
    updatedSteps[2].isActive = true;
    
    setActiveStepIndex(2);
    setSteps(updatedSteps);
    setIsVideoLoaded(false);
    setShowMarkComplete(false);
    setCurrentVideoTime(0);
    setLastWatchedTime(0);
    setShowChoosePath(false);
    
    saveState(updatedSteps, 2, 0, false);
    
    trackEvent('onboarding_continue_to_video_3', {
      fromStep: 2,
      toStep: 3,
    });
  };

  // Handle CTA clicks with exact URLs
  const handleSchedulerClick = () => {
    trackEvent('onboarding_scheduler_clicked', { step: activeStepIndex + 1 });
    window.open('https://3000-ihrwrmyktx1wp4qcvuc11-6532622b.e2b.dev/enagic-scheduler', '_blank');
  };

  const handleVSLClick = () => {
    trackEvent('onboarding_vsl_clicked', { step: activeStepIndex + 1 });
    window.open('https://3000-ihrwrmyktx1wp4qcvuc11-6532622b.e2b.dev/vsl-all-access', '_blank');
  };

  // Handle step navigation
  const handleStepClick = (stepIndex: number) => {
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
      setShowChoosePath(false);
      
      const resumeTime = steps[stepIndex].watchProgress > 0 ? 
        (steps[stepIndex].watchProgress / 100) * videoDuration : 0;
      setCurrentVideoTime(resumeTime);
      
      saveState(updatedSteps, stepIndex, 0, false);
      trackEvent('onboarding_step_navigation', { 
        fromStep: activeStepIndex + 1, 
        toStep: stepIndex + 1 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Compact Header - Title and Subtitle only */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight leading-tight">
            Welcome to Your Business Transformation
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your step-by-step journey to online business success starts here
          </p>
        </div>

        {/* Premium Video Container with Integrated Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/60 overflow-hidden mb-8">
          
          {/* Slim 3-Step Progress Bar (≤48px desktop, ≤42px mobile) */}
          <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-4 sm:px-6">
            <div className="flex items-center justify-between h-full max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={
                      index > activeStepIndex && 
                      !steps[index - 1]?.completed && 
                      !(index === activeStepIndex + 1 && steps[activeStepIndex].completed)
                    }
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                      ${
                        step.completed
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 focus:ring-emerald-500'
                          : step.isActive
                          ? 'bg-indigo-600 text-white shadow-md focus:ring-indigo-500'
                          : index <= activeStepIndex || (index === activeStepIndex + 1 && steps[activeStepIndex].completed)
                          ? 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 focus:ring-gray-400'
                          : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-60'
                      }
                    `}
                  >
                    {step.completed ? (
                      <>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Completed</span>
                        <span className="sm:hidden">✓</span>
                      </>
                    ) : (
                      <>
                        {index <= activeStepIndex || (index === activeStepIndex + 1 && steps[activeStepIndex].completed) ? (
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-current bg-opacity-20 text-xs font-bold">
                            {index + 1}
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="hidden sm:inline">{step.title}</span>
                        <span className="sm:hidden">{step.title.split(' ')[0]}</span>
                      </>
                    )}
                  </button>
                  
                  {/* Thin connectors */}
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-2 transition-colors duration-300
                      ${index < activeStepIndex || step.completed ? 'bg-emerald-300' : 'bg-gray-200'}
                    `} />
                  )}
                </React.Fragment>
              ))}
              
              {/* Success indicator */}
              {allStepsCompleted && (
                <div className="ml-3 flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-md">
                  <CheckCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">3 of 3 completed</span>
                  <span className="sm:hidden">3/3</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Player (no extra spacing, tight integration) */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
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
                
                {/* Play Overlay - Single Click */}
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <button
                      onClick={handleVideoLoad}
                      className="group flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-xl 
                               hover:bg-gray-50 transition-all duration-200 shadow-xl
                               focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/40"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full
                                    group-hover:bg-indigo-700 transition-colors">
                        <Play className="w-5 h-5 ml-1" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Play Video</div>
                        <div className="text-sm text-gray-600">{currentStep.duration}</div>
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video coming soon...</p>
                </div>
              </div>
            )}
          </div>

          {/* Mark as Complete Button */}
          {showMarkComplete && currentStep.watchProgress >= 90 && (
            <div className="p-6 bg-white text-center border-t border-gray-100">
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl
                         hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </button>
            </div>
          )}
        </div>

        {/* Choose Your Path Section - Animated Reveal */}
        {((activeStepIndex === 1 && steps[1].completed) || (activeStepIndex === 2 && steps[2].completed)) && showChoosePath && (
          <div 
            ref={choosePathRef}
            className="bg-white rounded-2xl shadow-xl border border-gray-100/60 p-6 sm:p-8 mb-8 
                     animate-in slide-in-from-top-4 fade-in duration-500"
          >
            {/* Choose Your Path Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                Choose Your Path
              </h2>
              <p className="text-gray-600">
                Pick one now or continue watching. You can do both.
              </p>
            </div>

            {/* CTA Cards - Mobile First Design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              
              {/* Book Success Call CTA */}
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white group-hover:bg-blue-700 transition-colors">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Book Your Success Call with Enagic
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Get personalized guidance from our success team and accelerate your journey.
                    </p>
                    <button
                      onClick={handleSchedulerClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
                               hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span>Book Call</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* VSL Skills CTA */}
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl text-white group-hover:bg-purple-700 transition-colors">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Learn VSL Skills
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Master video sales letters and conversion techniques that drive results.
                    </p>
                    <button
                      onClick={handleVSLClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl
                               hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <span>Start Learning</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue to Video 3 Button - Only show after Step 2 completion */}
            {activeStepIndex === 1 && steps[1].completed && (
              <div className="text-center">
                <button
                  onClick={handleContinueToVideo3}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl
                           hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <span>Continue to Video 3</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Developer Tools - Only visible in development */}
        {isDevelopment && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <h4 className="font-semibold text-yellow-800 mb-3">Developer Tools</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulate90Percent}
                className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Simulate 90%
              </button>
              <button
                onClick={handleResetToNewUser}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset to New User
              </button>
            </div>
            <p className="text-xs text-yellow-700 mt-2">Dev mode only</p>
          </div>
        )}

        {/* View All Course Modules Link */}
        <div className="text-center pt-8 border-t border-gray-100">
          <button
            onClick={() => router.push('/courses')}
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            View All Course Modules
          </button>
        </div>
      </div>
    </div>
  );
}