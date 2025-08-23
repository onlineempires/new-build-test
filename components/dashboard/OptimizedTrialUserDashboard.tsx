import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, CheckCircle, Calendar, ExternalLink, Clock } from 'lucide-react';
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
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [lastWatchedTime, setLastWatchedTime] = useState(0);

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
      videoUrl: 'https://iframe.mediadelivery.net/embed/91637/3ee175b2-8e7f-40b1-9040-e16c78e65bb1',
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

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setVideoDuration(300); // 5 minutes default, would be dynamic in real implementation
    setCurrentVideoTime(lastWatchedTime);
    trackEvent('onboarding_video_started', { step: activeStepIndex + 1 });
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
    // Route to scheduler URL
    window.open('/scheduler', '_blank'); // Replace with actual scheduler URL
  };

  const handleVSLClick = () => {
    trackEvent('onboarding_vsl_clicked', { step: activeStepIndex + 1 });
    // Route to VSL skills course URL
    router.push('/courses/vsl-skills'); // Replace with actual VSL course URL
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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header - Above the fold */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your Business Transformation!
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Your step-by-step journey to online business success starts here
        </p>
      </div>

      {/* Slim 3-Step Pill Bar - Above the fold */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => handlePillClick(index)}
              disabled={index > activeStepIndex && !steps[index - 1]?.completed}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                ${
                  step.completed
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : step.isActive
                    ? 'bg-blue-600 text-white border-2 border-blue-600'
                    : index <= activeStepIndex
                    ? 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                }
              `}
            >
              {step.completed ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Completed</span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold">{index + 1}</span>
                  <div className="hidden sm:block">
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-xs opacity-75">{step.duration}</div>
                  </div>
                  <div className="sm:hidden">
                    <div className="font-semibold text-xs">{step.title}</div>
                  </div>
                </>
              )}
            </button>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${index < activeStepIndex ? 'bg-green-300' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
        
        {/* Success indicator when all completed */}
        {allStepsCompleted && (
          <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-300">
            <CheckCircle className="w-4 h-4" />
            <span>3 of 3 completed</span>
          </div>
        )}
      </div>

      {/* Video Container - Above the fold */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          {currentStep.videoUrl ? (
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
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <PlayCircle className="w-16 h-16 opacity-50" />
            </div>
          )}
          
          {/* Play overlay before video loads */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <button
                onClick={handleVideoLoad}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlayCircle className="w-6 h-6" />
                <span>Play Video</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Progress Bar */}
        {isVideoLoaded && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span>{currentStep.title}</span>
              <span>•</span>
              <span>{Math.round(currentStep.watchProgress)}% watched</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentStep.watchProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Mark as Complete Button */}
        {showMarkComplete && currentStep.watchProgress >= 90 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button
              onClick={handleMarkComplete}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Mark as Complete
            </button>
          </div>
        )}
      </div>

      {/* Step 2 CTA Cards - Only show after Step 2 completion */}
      {activeStepIndex === 1 && steps[1].completed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Book Success Call CTA */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Book Your Success Call with Enagic
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get personalized guidance from our success team
                </p>
                <button
                  onClick={handleSchedulerClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Book Call</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* VSL Skills CTA */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Learn VSL Skills
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Master video sales letters and conversion techniques
                </p>
                <button
                  onClick={handleVSLClick}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue to Next Video Button - Only show after Step 2 completion */}
      {activeStepIndex === 1 && steps[1].completed && !steps[2].isActive && (
        <div className="text-center mb-6">
          <button
            onClick={handleContinueToNextVideo}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to Next Video
          </button>
        </div>
      )}

      {/* View All Course Modules Link - Always visible */}
      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={() => router.push('/courses')}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          View All Course Modules
        </button>
      </div>

      {/* All Completed Success Message */}
      {allStepsCompleted && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Congratulations! 🎉
          </h3>
          <p className="text-green-700">
            You've completed your onboarding journey. Ready to build your online business empire!
          </p>
        </div>
      )}
    </div>
  );
}