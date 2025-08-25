import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { getLibraryCourse, LibraryCourse } from '../lib/courseMapping';

// Mock user data
const mockUser = {
  id: 1,
  name: 'Ashley Kemp',
  avatarUrl: '/images/avatar.jpg',
  membershipLevel: 'free' as const
};

const pricingPlans = {
  monthly: {
    name: 'Monthly Premium',
    price: '$79',
    period: '/month',
    originalPrice: '$99',
    savings: '20% off',
    features: [
      'Access to all Monthly+ content',
      'Advanced Training courses',
      'Premium masterclasses',
      'Exclusive community access',
      'Monthly live Q&A sessions',
      'Download resources',
      'Mobile app access'
    ],
    popular: true,
    ctaText: 'Start Monthly Plan',
    badge: 'Most Popular'
  },
  yearly: {
    name: 'Yearly Premium',
    price: '$799',
    period: '/year',
    originalPrice: '$1,188',
    savings: '33% off',
    features: [
      'Everything in Monthly Premium',
      'Access to all Yearly-only content',
      'Exclusive yearly workshops',
      'Priority support',
      '1-on-1 strategy sessions',
      'Advanced business tools',
      'Lifetime updates to all content'
    ],
    popular: false,
    ctaText: 'Start Yearly Plan',
    badge: 'Best Value'
  }
};

export default function UpgradePage() {
  const router = useRouter();
  const { plan, course: courseId, from } = router.query;
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [libraryCourse, setLibraryCourse] = useState<LibraryCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial plan based on query parameter
  useEffect(() => {
    if (plan === 'yearly') {
      setSelectedPlan('yearly');
    } else if (plan === 'monthly') {
      setSelectedPlan('monthly');
    }
  }, [plan]);

  // Load course info if accessed from library
  useEffect(() => {
    if (courseId && typeof courseId === 'string') {
      const course = getLibraryCourse(courseId);
      if (course) {
        setLibraryCourse(course);
        // Set recommended plan based on course requirement
        if (course.accessLevel === 'yearly') {
          setSelectedPlan('yearly');
        } else {
          setSelectedPlan('monthly');
        }
      }
    }
  }, [courseId]);

  const handleUpgrade = async (planType: 'monthly' | 'yearly') => {
    setIsLoading(true);
    
    // Simulate upgrade process
    try {
      // In production, this would handle actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect based on context
      if (from === 'library' && courseId && libraryCourse) {
        // Redirect back to the specific course
        router.push(`/learn/${libraryCourse.courseSlug}/lesson/${libraryCourse.lessonSlug}?from=library&upgraded=true`);
      } else {
        // Redirect to library or dashboard
        router.push('/library?upgraded=true');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      setIsLoading(false);
    }
  };

  const getRecommendedPlan = () => {
    if (libraryCourse?.accessLevel === 'yearly') {
      return 'yearly';
    }
    return 'monthly';
  };

  return (
    <AppLayout user={mockUser}>
      <Head>
        <title>Upgrade Your Plan - Digital Era Library</title>
        <meta name="description" content="Upgrade to premium to access exclusive content and advanced training courses." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <button 
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h1 className="text-4xl font-bold text-gray-900">
                Upgrade Your Access
              </h1>
            </div>
            
            {libraryCourse ? (
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-600 mb-4">
                  Unlock <strong>{libraryCourse.title}</strong> and gain access to premium content
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Course:</span> {libraryCourse.title}
                    </div>
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Level:</span> {libraryCourse.level}
                    </div>
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Duration:</span> {libraryCourse.duration}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your premium plan and unlock access to exclusive courses, masterclasses, and advanced training content.
              </p>
            )}
          </div>

          {/* Plan Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {Object.entries(pricingPlans).map(([key, plan]) => {
              const planKey = key as 'monthly' | 'yearly';
              const isRecommended = libraryCourse && libraryCourse.accessLevel === planKey;
              const isSelected = selectedPlan === planKey;
              
              return (
                <div
                  key={planKey}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 scale-105'
                      : isRecommended
                      ? 'border-yellow-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Badge */}
                  {(plan.popular || isRecommended) && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold text-white ${
                        isRecommended ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {isRecommended ? 'Required for Course' : plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-lg text-gray-500">
                          {plan.period}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500 line-through">
                          {plan.originalPrice}
                        </span>
                        <span className="ml-2 text-sm font-medium text-green-600">
                          {plan.savings}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <i className="fas fa-check text-green-500 mt-1 text-sm"></i>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleUpgrade(planKey)}
                      disabled={isLoading}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : isRecommended
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        plan.ctaText
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What's Included
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-play text-blue-600 text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Premium Content
                </h4>
                <p className="text-gray-600 text-sm">
                  Access all courses, masterclasses, and training materials
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-green-600 text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Community Access
                </h4>
                <p className="text-gray-600 text-sm">
                  Join our exclusive community of premium members
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-download text-purple-600 text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Resources & Tools
                </h4>
                <p className="text-gray-600 text-sm">
                  Download workbooks, templates, and exclusive tools
                </p>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
              <i className="fas fa-shield-alt text-green-600"></i>
              <span className="text-green-800 font-medium text-sm">
                30-Day Money Back Guarantee
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}