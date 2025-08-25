import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';
import '../components/library/library-theme.module.css';
import { UpgradeProvider } from '../contexts/UpgradeContext';
import { UserRoleProvider } from '../contexts/UserRoleContext';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { CourseAccessProvider } from '../contexts/CourseAccessContext';
import { AffiliateProvider } from '../contexts/AffiliateContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { UserProvider } from '../contexts/UserContext';
import { DevProvider } from '../contexts/DevContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DevInitializer } from '../components/dev/DevInitializer';
import { DevToolsToggle } from '../components/dev/DevToolsToggle';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { queryClient } from '../lib/queryClient';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initializeDevTools } from '../utils/devToolsInit';
import { setDevRole } from '../utils/setDevRole';

// Prefetch critical data on app load - with error handling
const prefetchCriticalData = async () => {
  try {
    // Prefetch user profile if logged in
    const userSession = typeof window !== 'undefined' ? localStorage.getItem('userSession') : null;
    if (userSession) {
      // Safe prefetch with error handling
      queryClient.prefetchQuery({
        queryKey: ['user', 'profile'],
        queryFn: async () => {
          try {
            const response = await fetch('/api/user/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');
            return response.json();
          } catch (error) {
            console.log('Profile prefetch failed (using mock data):', error);
            return { id: 1, name: 'User', avatarUrl: '' }; // Safe fallback
          }
        },
      });
      
      // Safe prefetch courses list
      queryClient.prefetchQuery({
        queryKey: ['courses', 'list'],
        queryFn: async () => {
          try {
            const response = await fetch('/api/courses');
            if (!response.ok) throw new Error('Failed to fetch courses');
            return response.json();
          } catch (error) {
            console.log('Courses prefetch failed (using mock data):', error);
            return []; // Safe fallback
          }
        },
      });
    }
  } catch (error) {
    console.log('Prefetch initialization failed:', error);
  }
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Prefetch data on mount and initialize dev tools - with error handling
  useEffect(() => {
    try {
      prefetchCriticalData();
      initializeDevTools();
      console.log('✅ App initialized successfully');
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, []);
  
  // Performance monitoring
  useEffect(() => {
    const handleRouteChangeStart = () => {
      console.time('route-change');
    };
    
    const handleRouteChangeComplete = () => {
      console.timeEnd('route-change');
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <DevProvider>
            <UserProvider>
              <UserRoleProvider>
                <AffiliateProvider>
                  <CourseAccessProvider>
                    <AdminAuthProvider>
                      <UpgradeProvider>
                        <LoadingIndicator />
                        <DevInitializer />
                        <Component {...pageProps} />
                      </UpgradeProvider>
                    </AdminAuthProvider>
                  </CourseAccessProvider>
                </AffiliateProvider>
              </UserRoleProvider>
            </UserProvider>
          </DevProvider>
        </NotificationProvider>
        <DevToolsToggle />
      </ThemeProvider>
    </QueryClientProvider>
  );
}