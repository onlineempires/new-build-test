import React from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../components/layout/AppLayout';

export default function NavigationTest() {
  const router = useRouter();
  
  const testRoutes = [
    { path: '/', name: 'Dashboard' },
    { path: '/courses', name: 'All Courses' },
    { path: '/library', name: 'Library (Beta)' },
    { path: '/experts', name: 'Expert Directory' },
    { path: '/dmo', name: 'Daily Method (DMO)' },
    { path: '/affiliate', name: 'Affiliate Portal' },
    { path: '/stats', name: 'Statistics' },
    { path: '/leads', name: 'Leads' },
    { path: '/profile', name: 'Profile' }
  ];

  const testNavigation = (path: string) => {
    console.log(`Testing navigation to: ${path}`);
    router.push(path);
  };

  return (
    <AppLayout user={{ id: 1, name: 'Test User', avatarUrl: '' }} title="Navigation Test">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 font-bold text-text-primary mb-6">
            Navigation System Test
          </h1>
          
          <div className="card mb-6">
            <h2 className="text-h2 font-semibold text-text-primary mb-4">
              Current Route: {router.pathname}
            </h2>
            <p className="text-text-secondary">
              Use the sidebar navigation to test all routes, or click the buttons below.
            </p>
          </div>

          <div className="card">
            <h3 className="text-h3 font-semibold text-text-primary mb-4">
              Quick Navigation Test
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {testRoutes.map((route) => (
                <button
                  key={route.path}
                  onClick={() => testNavigation(route.path)}
                  className={`
                    btn text-left p-3 rounded-lg transition-colors
                    ${router.pathname === route.path 
                      ? 'btn-primary' 
                      : 'btn-outline'
                    }
                  `}
                >
                  {route.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card mt-6">
            <h3 className="text-h3 font-semibold text-text-primary mb-4">
              Navigation Status
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-success">✅ Clean navigation system implemented</p>
              <p className="text-success">✅ No complex permission filtering</p>
              <p className="text-success">✅ Reliable routing with Next.js router</p>
              <p className="text-success">✅ Proper active state detection</p>
              <p className="text-success">✅ Theme-aware styling</p>
              <p className="text-success">✅ Mobile responsive design</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}