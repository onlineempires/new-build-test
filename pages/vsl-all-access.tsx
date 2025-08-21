import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import VSLPricingModal from '../components/upgrades/VSLPricingModal';
import { Play, Check, Star, Users, Clock, Zap, Award, BookOpen } from 'lucide-react';

export default function VSLAllAccess() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleUpgrade = () => {
    setShowPricingModal(true);
  };

  const handlePlanSelect = (planType: 'one-time' | 'weekly') => {
    // Handle the selected plan - could redirect to checkout
    console.log('Selected plan:', planType);
    setShowPricingModal(false);
    
    // Here you would typically redirect to checkout with the selected plan
    if (planType === 'one-time') {
      // Handle $499 one-time payment
    } else {
      // Handle $24.75/week billing
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Complete Course Library",
      description: "Access all 12+ premium courses worth $3,000+ individually"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Community Access",
      description: "Join our exclusive community of successful entrepreneurs"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certification Programs",
      description: "Get certified in digital marketing, sales, and business building"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Monthly Live Coaching",
      description: "Join live Q&A sessions with industry experts"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Lifetime Access",
      description: "Never lose access - yours forever with all future updates"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Support",
      description: "Priority email support and faster response times"
    }
  ];

  const courses = [
    "TikTok Mastery ($297 value)",
    "Facebook Advertising Mastery ($397 value)", 
    "Instagram Growth Hacks ($247 value)",
    "Email Marketing Secrets ($197 value)",
    "Sales Psychology ($297 value)",
    "Team Building Mastery ($197 value)",
    "Advanced Funnel Mastery ($397 value)",
    "Conversion Optimization ($247 value)",
    "Content Creation Blueprint ($197 value)",
    "Personal Branding Mastery ($297 value)",
    "Affiliate Marketing System ($247 value)",
    "Business Automation ($297 value)"
  ];

  return (
    <>
      <Head>
        <title>All Access Courses Bundle - Digital Era</title>
        <meta name="description" content="Get unlimited access to all premium courses and become a digital marketing expert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}
        notifications={[]}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          {/* Hero Section with Video */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-semibold mb-4">
                🔥 Limited Time Offer - 75% OFF
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Unlock Your Full Potential
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get instant access to our complete library of premium courses and transform your business in the next 90 days
              </p>
            </div>

            {/* Video Player */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=450&fit=crop"
                    alt="All Access Training Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-20 bg-white bg-opacity-95 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-2xl"
                    >
                      <Play className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" />
                    </button>
                  </div>
                  
                  {/* Video Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-6">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      How Sarah Built a $50K/Month Business in 6 Months
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Watch this exclusive case study showing the exact steps and strategies used
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400">
                
                {/* Pricing Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8 px-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 text-yellow-900 text-sm font-bold mb-4">
                    ⚡ TODAY ONLY - 75% OFF
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">All Access Courses Bundle</h2>
                  <p className="text-blue-100 text-lg">Everything you need to build a successful online business</p>
                </div>

                {/* Pricing Details */}
                <div className="p-8 text-center">
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-2xl text-gray-500 line-through mr-4">$1,997</span>
                      <span className="text-6xl font-bold text-green-600">$499</span>
                    </div>
                    <p className="text-gray-600 text-lg">One-time payment • Lifetime access • No recurring fees</p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleUpgrade}
                    className="w-full max-w-md mx-auto bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold py-6 px-8 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-2xl mb-6"
                  >
                    🚀 Get Instant Access Now - $499
                  </button>

                  <div className="flex items-center justify-center text-sm text-gray-500 mb-8">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>30-day money-back guarantee</span>
                  </div>

                  {/* Value Props */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Instant Access</h4>
                      <p className="text-gray-600 text-sm">Start learning immediately after purchase</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Proven System</h4>
                      <p className="text-gray-600 text-sm">Used by 10,000+ successful students</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expert Support</h4>
                      <p className="text-gray-600 text-sm">Get help from our success coaches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="max-w-6xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                What's Included in Your Bundle
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">12+ Premium Courses</h3>
                  <div className="space-y-3">
                    {courses.map((course, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{course}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Individual Value:</span>
                      <span className="text-2xl font-bold text-green-600">$3,247</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Premium Features</h3>
                  <div className="space-y-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Don't Miss This Opportunity</h2>
                <p className="text-xl mb-6 text-yellow-100">
                  This 75% discount expires in 24 hours. Join thousands of successful entrepreneurs today.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-orange-600 text-xl font-bold py-4 px-12 rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                >
                  🎯 Claim Your Bundle Now - $499
                </button>
                <p className="text-sm text-yellow-100 mt-4">
                  ✅ 30-day money-back guarantee • ✅ Instant access • ✅ Lifetime updates
                </p>
              </div>
            </div>

            {/* Back to Course Link */}
            <div className="text-center mt-12">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                ← Back to lesson
              </button>
            </div>

          </div>
        </div>
        
        {/* VSL Pricing Modal */}
        <VSLPricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onSelectPlan={handlePlanSelect}
        />
      </AppLayout>
    </>
  );
}