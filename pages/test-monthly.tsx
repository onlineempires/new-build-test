import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestMonthly() {
  const router = useRouter();

  useEffect(() => {
    // Set user role to monthly for testing
    localStorage.setItem('userRole', 'monthly');
    
    // Redirect to courses page
    router.push('/courses');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting user role to Monthly...</h1>
        <p>Redirecting to courses page...</p>
      </div>
    </div>
  );
}