import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  Clock, 
  Download, 
  Rocket, 
  GraduationCap,
  FileText,
  File
} from 'lucide-react';

interface LessonPageProps {
  breadcrumbs?: string[];
  videoTitle?: string;
  videoPoster?: string;
  currentTime?: string;
  totalTime?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  keyTakeaways?: string[];
  estimatedTime?: string;
  progress?: {
    percentage: number;
    moduleProgress: string;
    courseProgress: string;
    xpEarned: string;
  };
  materials?: Array<{
    name: string;
    type: 'PDF' | 'DOCX';
    size: string;
  }>;
  onEnagicClick?: () => void;
  onSkillsClick?: () => void;
  onMarkComplete?: () => void;
  onContinue?: () => void;
  onUpgrade?: () => void;
}

const LessonPage: React.FC<LessonPageProps> = ({
  breadcrumbs = ['Dashboard', 'All Courses', 'TIK-TOK MASTERY', 'Viral Content Creation'],
  videoTitle = 'Viral Content Creation',
  videoPoster = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
  currentTime = '3:44',
  totalTime = '8:00',
  lessonTitle = 'Lesson Overview',
  lessonDescription = 'Create content that goes viral consistently',
  keyTakeaways = [
    'How to conduct effective market research',
    'Creating detailed customer personas',
    'Positioning strategies for your business'
  ],
  estimatedTime = '8:00',
  progress = {
    percentage: 71,
    moduleProgress: '1 of 3 lessons',
    courseProgress: '5 of 7 lessons',
    xpEarned: '+50 XP'
  },
  materials = [
    { name: 'Market Research Works...', type: 'PDF', size: '1.2 MB' },
    { name: 'Customer Persona Temp...', type: 'DOCX', size: '856 KB' }
  ],
  onEnagicClick,
  onSkillsClick,
  onMarkComplete,
  onContinue,
  onUpgrade
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted);
    onMarkComplete?.();
  };

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-black/5 px-6 py-4">
        <nav className="text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900">{crumb}</span>
              ) : (
                <>
                  <span className="hover:text-gray-700 cursor-pointer">{crumb}</span>
                  <span className="mx-2">{'>'}</span>
                </>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Video and Overview */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={videoPoster}
                  alt={videoTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                  >
                    <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                  </button>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" />
                      </button>
                      <span>{currentTime} / {totalTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="hover:text-blue-400 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.772L4.17 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.17l4.213-3.772z" clipRule="evenodd" />
                          <path d="M12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                        </svg>
                      </button>
                      <button className="hover:text-blue-400 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{lessonTitle}</h2>
              <p className="text-gray-600 mb-6">{lessonDescription}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Takeaways:</h3>
                <ul className="space-y-3">
                  {keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <hr className="border-gray-200 mb-4" />
              
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Estimated time: {estimatedTime}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="flex items-center justify-between mb-6">
                <CircularProgress percentage={progress.percentage} />
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Module Progress</div>
                  <div className="font-medium text-gray-900">{progress.moduleProgress}</div>
                  <div className="text-sm text-gray-600 mb-1 mt-2">Course Progress</div>
                  <div className="font-medium text-gray-900">{progress.courseProgress}</div>
                  <div className="text-sm text-gray-600 mb-1 mt-2">XP Earned</div>
                  <div className="font-medium text-green-600">{progress.xpEarned}</div>
                </div>
              </div>
            </div>

            {/* Lesson Materials */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Materials</h3>
              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded flex items-center justify-center mr-3 ${
                        material.type === 'PDF' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {material.type === 'PDF' ? (
                          <FileText className={`w-4 h-4 ${material.type === 'PDF' ? 'text-red-600' : 'text-blue-600'}`} />
                        ) : (
                          <File className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{material.name}</div>
                        <div className="text-xs text-gray-500">{material.type} • {material.size}</div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <label className="flex items-center mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={handleMarkComplete}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-gray-700">Mark lesson as complete</span>
              </label>
              <button
                onClick={onContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Continue to Next Lesson
              </button>
            </div>

            {/* Upgrade Card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-sm p-6 text-white">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold mb-4">
                ⚡ LIMITED TIME
              </div>
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-purple-100 mb-4 text-sm">Get unlimited access to all courses</p>
              <div className="mb-4">
                <span className="text-3xl font-bold">$799</span>
                <span className="text-purple-200">/year</span>
              </div>
              <button
                onClick={onUpgrade}
                className="w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Panel */}
        <div className="mt-12 bg-gray-100 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Path</h3>
            <p className="text-gray-600">Ready to take action or want to build more skills first?</p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <button
              onClick={onEnagicClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <Rocket className="w-5 h-5" />
              <span>I'm Ready! Start Enagic Fast Track</span>
            </button>
            
            <button
              onClick={onSkillsClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Not Ready Yet - Build Skills First</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;