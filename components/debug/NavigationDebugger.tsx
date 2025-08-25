import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface NavigationEvent {
  timestamp: string;
  type: 'start' | 'complete' | 'error';
  url: string;
  error?: string;
}

export const NavigationDebugger: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<NavigationEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const addEvent = (type: NavigationEvent['type'], url: string, error?: Error) => {
      const event: NavigationEvent = {
        timestamp: new Date().toLocaleTimeString(),
        type,
        url,
        error: error?.message
      };
      
      setEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    };

    const handleRouteChangeStart = (url: string) => {
      addEvent('start', url);
    };
    
    const handleRouteChangeComplete = (url: string) => {
      addEvent('complete', url);
    };
    
    const handleRouteChangeError = (err: Error, url: string) => {
      addEvent('error', url, err);
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-[9999] bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-blue-700"
        title="Navigation Debugger"
      >
        NAV
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed top-16 right-4 z-[9998] bg-black text-green-400 p-4 rounded-lg shadow-2xl max-w-md max-h-96 overflow-y-auto font-mono text-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">Navigation Events</h3>
            <button 
              onClick={() => setEvents([])}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="text-yellow-400">
              Current: {router.pathname}
            </div>
            <div className="text-blue-400">
              Ready: {router.isReady ? 'Yes' : 'No'}
            </div>
            <hr className="border-gray-600" />
            
            {events.length === 0 ? (
              <div className="text-gray-500">No events yet...</div>
            ) : (
              events.map((event, i) => (
                <div key={i} className={`p-2 rounded ${
                  event.type === 'start' ? 'bg-blue-900' :
                  event.type === 'complete' ? 'bg-green-900' :
                  'bg-red-900'
                }`}>
                  <div className="flex justify-between">
                    <span className={
                      event.type === 'start' ? 'text-blue-300' :
                      event.type === 'complete' ? 'text-green-300' :
                      'text-red-300'
                    }>
                      {event.type.toUpperCase()}
                    </span>
                    <span className="text-gray-400">{event.timestamp}</span>
                  </div>
                  <div className="text-white truncate">{event.url}</div>
                  {event.error && (
                    <div className="text-red-400 text-xs mt-1">{event.error}</div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs">
            <div className="text-white mb-1">Quick Actions:</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-2 py-1 rounded mr-2 hover:bg-gray-500"
            >
              Reload
            </button>
            <button 
              onClick={() => console.clear()}
              className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500"
            >
              Clear Console
            </button>
          </div>
        </div>
      )}
    </>
  );
};