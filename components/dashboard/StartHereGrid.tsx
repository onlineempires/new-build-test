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
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6">Start Here</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-200 hover:border-brand-primary">
            <Link href={course.href}>
              <a>
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-brand-primary">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{course.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{course.modules} modules</span>
                    <button className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                      Start Course
                    </button>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}