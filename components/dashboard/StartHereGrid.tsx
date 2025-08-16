import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  desc: string;
  modules: number;
  thumbnailUrl: string;
  href: string;
}

interface StartHereGridProps {
  courses: Course[];
}

export default function StartHereGrid({ courses }: StartHereGridProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Section Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mr-3">
          <i className="fas fa-rocket text-green-600 text-lg"></i>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Start Here</h2>
          <p className="text-xs sm:text-sm text-gray-600">Essential courses to get you started</p>
        </div>
      </div>
      
      {/* Course Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {courses.map((course) => (
          <Link key={course.id} href={course.href}>
            <a className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200 hover:scale-[1.02] group">
              {/* Course Image */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-200">
                    <i className="fas fa-play text-blue-600 text-lg ml-1"></i>
                  </div>
                </div>
              </div>
              
              {/* Course Content */}
              <div className="p-4 sm:p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{course.desc}</p>
                </div>
                
                {/* Course Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <i className="fas fa-book mr-1"></i>
                    <span className="font-medium">{course.modules} modules</span>
                  </div>
                  <div className="bg-blue-50 group-hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200">
                    Start Course
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}