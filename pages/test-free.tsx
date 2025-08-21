import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestFree() {
  const router = useRouter();

  useEffect(() => {
    // Set user role to free for testing
    localStorage.setItem('userRole', 'free');
    
    // Redirect to courses page
    router.push('/courses');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting user role to Free...</h1>
        <p>Redirecting to courses page...</p>
      </div>
    </div>
  );
}