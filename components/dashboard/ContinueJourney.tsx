import Link from 'next/link';

interface ContinueJourneyProps {
  course: {
    courseTitle: string;
    moduleTitle: string;
    lessonTitle: string;
    progressPercent: number;
    href: string;
    thumbnailUrl?: string;
  };
}

export default function ContinueJourney({ course }: ContinueJourneyProps) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Continue Your Journey</h2>
        <span className="text-xs sm:text-sm text-gray-600 font-medium">{course.progressPercent}% Complete</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg p-4 gap-4">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mr-3 sm:mr-4 overflow-hidden flex-shrink-0">
            {course.thumbnailUrl ? (
              <img 
                src={course.thumbnailUrl} 
                alt={course.courseTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                N
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900">{course.courseTitle}</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {course.moduleTitle} - {course.lessonTitle}
            </p>
          </div>
        </div>
        
        <Link href={course.href}>
          <a className="bg-brand-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base text-center">
            Continue Learning
          </a>
        </Link>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}