import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 px-1" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <svg 
              className="w-4 h-4 text-gray-400 dark:text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {item.current ? (
            <span className="font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              {item.label}
            </span>
          ) : (
            <Link href={item.href || '#'}>
              <a 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ textDecoration: 'none' }}
              >
                {item.label}
              </a>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}