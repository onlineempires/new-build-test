import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, CheckCircle, Calendar, ExternalLink, Clock, Play } from 'lucide-react';
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
      videoUrl: '', // Placeholder - no URL yet
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
    } catch (error) {
      console.warn('Failed to load onboarding progress:', error);
    }
  }, [userId]);

  // Save state to localStorage
  const saveState = (updatedSteps: StepData[], stepIndex: number, lastTime: number = 0) => {
    try {
      localStorage.setItem(getStorageKey('steps'), JSON.stringify(updatedSteps));
      localStorage.setItem(getStorageKey('activeStepIndex'), stepIndex.toString());
      localStorage.setItem(getStorageKey('lastWatchedTime'), lastTime.toString());
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
          saveState(updatedSteps, activeStepIndex, newTime);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVideoLoaded, videoDuration, activeStepIndex, showMarkComplete, lastWatchedTime, steps]);

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
      // Step 2: Show CTAs and Continue button
      // CTAs will be shown in render based on completion state
    } else if (activeStepIndex === 2) {
      // Step 3: All completed
      trackEvent('onboarding_all_completed');
    }

    setSteps(updatedSteps);
    saveState(updatedSteps, activeStepIndex === 0 ? activeStepIndex + 1 : activeStepIndex);
    
    if (onVideoComplete) {
      onVideoComplete(currentStep.id);
    }
  };

  // Handle Continue to Next Video (from Step 2 to Step 3)
  const handleContinueToNextVideo = () => {
    if (activeStepIndex !== 1 || !steps[1].completed) return;

    const updatedSteps = [...steps];
    updatedSteps[2].isActive = true;
    setActiveStepIndex(2);
    setIsVideoLoaded(false);
    setShowMarkComplete(false);
    setCurrentVideoTime(0);
    setLastWatchedTime(0);
    
    setSteps(updatedSteps);
    saveState(updatedSteps, 2);
    
    trackEvent('onboarding_step_unlocked', {
      fromStep: 2,
      toStep: 3,
    });
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
    // Only allow navigation to completed steps or the next unlocked step
    if (stepIndex < activeStepIndex || (stepIndex === activeStepIndex + 1 && steps[activeStepIndex].completed)) {
      const updatedSteps = [...steps];
      updatedSteps[activeStepIndex].isActive = false;
      updatedSteps[stepIndex].isActive = true;
      
      setActiveStepIndex(stepIndex);
      setSteps(updatedSteps);
      setIsVideoLoaded(false);
      setShowMarkComplete(false);
      setCurrentVideoTime(steps[stepIndex].watchProgress > 0 ? (steps[stepIndex].watchProgress / 100) * videoDuration : 0);
      
      saveState(updatedSteps, stepIndex);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Premium Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
          Welcome to Your Business Transformation
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your step-by-step journey to online business success starts here
        </p>
      </div>

      {/* Premium 3-Step Pills */}
      <div className="flex items-center justify-center mb-16">
        <div className="flex items-center gap-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => handlePillClick(index)}
                disabled={index > activeStepIndex && !steps[index - 1]?.completed}
                className={`
                  group relative flex items-center gap-4 px-6 py-4 rounded-2xl font-medium text-base
                  transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    step.completed
                      ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:border-emerald-300 focus:ring-emerald-500'
                      : step.isActive
                      ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-lg shadow-indigo-200 focus:ring-indigo-500'
                      : index <= activeStepIndex
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
                    <div className="text-left">
                      <div className="font-semibold">Completed</div>
                      <div className="text-sm opacity-80">{step.title}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                      ${step.isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-sm opacity-75">{step.duration}</div>
                    </div>
                    {/* Premium progress indicator inside pill */}
                    {step.isActive && step.watchProgress > 0 && step.watchProgress < 90 && (
                      <div className="absolute bottom-1 left-6 right-6 h-0.5 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${step.watchProgress}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </button>
              
              {/* Elegant connectors */}
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 transition-colors duration-300
                  ${index < activeStepIndex ? 'bg-emerald-300' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          ))}
          
          {/* Success badge when all completed */}
          {allStepsCompleted && (
            <div className="ml-8 flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
              <span>3 of 3 completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Premium Video Card Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden mb-12">
        {/* Card Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {currentStep.title}
          </h2>
          <p className="text-gray-600">
            {currentStep.duration} · Step {activeStepIndex + 1} of 3
          </p>
        </div>

        {/* Premium Video Player */}
        <div className="p-8">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-inner">
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
                
                {/* Enhanced Play Overlay - Fixed single-click issue */}
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <button
                      onClick={handleVideoLoad}
                      className="group flex items-center gap-4 px-8 py-4 bg-white text-gray-900 rounded-2xl 
                               hover:bg-gray-50 transition-all duration-200 shadow-2xl
                               focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/40"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full
                                    group-hover:bg-indigo-700 transition-colors">
                        <Play className="w-6 h-6 ml-1" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">Play Video</div>
                        <div className="text-sm text-gray-600">{currentStep.duration}</div>
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video coming soon...</p>
                </div>
              </div>
            )}
          </div>

          {/* Mark as Complete Button - Premium Style */}
          {showMarkComplete && currentStep.watchProgress >= 90 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold text-lg rounded-2xl
                         hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <CheckCircle className="w-6 h-6" />
                Mark as Complete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium CTA Cards - Only show after Step 2 completion */}
      {activeStepIndex === 1 && steps[1].completed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Book Success Call CTA */}
          <div className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Book Your Success Call with Enagic
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get personalized guidance from our success team and accelerate your journey
                </p>
                <button
                  onClick={handleSchedulerClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl
                           hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Book Call</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* VSL Skills CTA */}
          <div className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Learn VSL Skills
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Master video sales letters and conversion techniques that drive results
                </p>
                <button
                  onClick={handleVSLClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-xl
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

      {/* Continue to Next Video Button - Premium Style */}
      {activeStepIndex === 1 && steps[1].completed && !steps[2].isActive && (
        <div className="text-center mb-12">
          <button
            onClick={handleContinueToNextVideo}
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-2xl
                     hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue to Next Video
          </button>
        </div>
      )}

      {/* Developer Testing Tool - Only visible in development */}
      {isDevelopment && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-800">Developer Testing Tool</h4>
              <p className="text-sm text-yellow-700">Simulate 90% video watch for current step</p>
            </div>
            <button
              onClick={handleSimulate90Percent}
              className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Simulate 90% Watch
            </button>
          </div>
        </div>
      )}

      {/* View All Course Modules Link */}
      <div className="text-center pt-12 border-t border-gray-100">
        <button
          onClick={() => router.push('/courses')}
          className="text-indigo-600 hover:text-indigo-700 font-medium text-lg transition-colors 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-2 py-1"
        >
          View All Course Modules
        </button>
      </div>

      {/* Premium All Completed Success Message */}
      {allStepsCompleted && (
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-12 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-semibold text-emerald-900 mb-4">
            Congratulations! 🎉
          </h3>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto leading-relaxed">
            You've completed your onboarding journey. Ready to build your online business empire!
          </p>
        </div>
      )}
    </div>
  );
}