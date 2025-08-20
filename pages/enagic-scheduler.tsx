import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';

export default function EnagicScheduler() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the scheduler
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToCourse = () => {
    router.push('/courses/business-blueprint');
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your Enagic Fast Track scheduler...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Enagic Fast Track Scheduler - Digital Era</title>
        <meta name="description" content="Schedule your Enagic Fast Track consultation call" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}
        notifications={[]}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-rocket text-3xl text-white"></i>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🚀 Enagic Fast Track Program
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                You're ready to accelerate your success! Schedule your personal consultation call 
                with our team to get started with the Enagic opportunity.
              </p>
            </div>

            {/* Calendar Integration Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Schedule Your Consultation Call
                </h2>
                
                {/* Demo Calendar Interface */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6">
                  <div className="text-center">
                    <i className="fas fa-calendar-alt text-6xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Calendar Integration
                    </h3>
                    <p className="text-gray-600 mb-6">
                      In production, this would show the referring member's calendar 
                      or assigned sales team availability (Calendly/Cal.com integration)
                    </p>
                    
                    {/* Demo time slots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {[
                        'Today 2:00 PM EST',
                        'Today 4:00 PM EST', 
                        'Tomorrow 10:00 AM EST',
                        'Tomorrow 2:00 PM EST',
                        'Wednesday 11:00 AM EST',
                        'Wednesday 3:00 PM EST'
                      ].map((time, index) => (
                        <button
                          key={index}
                          className="p-4 bg-white border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-gray-700 font-medium"
                        >
                          📅 {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    💬 Can't find a suitable time?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Message your coach directly for a custom appointment time
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    <i className="fas fa-comment mr-2"></i>
                    Message Coach
                  </button>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🎯 What to Expect on Your Call
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user-tie text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Assessment</h3>
                    <p className="text-gray-600">We'll discuss your goals and current situation to ensure Enagic is the right fit for you.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-chart-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Income Potential</h3>
                    <p className="text-gray-600">Learn about the compensation plan and realistic income expectations.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-hands-helping text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Support System</h3>
                    <p className="text-gray-600">Discover the training and support you'll receive to ensure your success.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-rocket text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
                    <p className="text-gray-600">Get your personalized action plan to start your Enagic journey.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToCourse}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Course
              </button>
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                <i className="fas fa-phone mr-2"></i>
                Call Now: (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}