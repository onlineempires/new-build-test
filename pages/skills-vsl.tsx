import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';

export default function SkillsVSL() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'certification' | 'monthly' | null>('certification');
  const [showOrderBump, setShowOrderBump] = useState(false);
  const [orderBumpSelected, setOrderBumpSelected] = useState(false);

  const handlePlanSelection = (plan: 'certification' | 'monthly') => {
    setSelectedPlan(plan);
    if (plan === 'monthly') {
      setShowOrderBump(true);
    }
  };

  const handleCheckout = () => {
    // In production, this would integrate with Stripe
    if (selectedPlan === 'monthly' && !showOrderBump) {
      // Show upsell for monthly users
      alert('Upgrade to 6-Month Pass for Just $299 more (total $398 instead of $499)');
      return;
    }
    
    alert(`Processing ${selectedPlan === 'certification' ? '$499 Certification' : '$99/month'} payment...`);
  };

  const handleBackToCourse = () => {
    router.push('/courses/business-blueprint');
  };

  return (
    <>
      <Head>
        <title>All Access Skills Pass - Digital Era</title>
        <meta name="description" content="Ship one marketable skill in 7 days. No financing, no MLM." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={{ id: 123, name: "Ashley Kemp", avatarUrl: "" }}
        notifications={[]}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Ship one marketable skill in 7 days.
              </h1>
              <p className="text-2xl text-gray-600 mb-4">
                <span className="line-through text-gray-400">no financing</span>, <span className="line-through text-gray-400">no MLM</span>.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto"></div>
            </div>

            {/* Bonus First Section */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎁 30-Day Skills Sprint Bonus
              </h2>
              <p className="text-xl text-white mb-4">
                Get immediate access to scripts, DFY pages, and our exclusive community
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-white">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-2xl"></i>
                  <span className="font-semibold">Ready-to-use Scripts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-2xl"></i>
                  <span className="font-semibold">Done-for-you Pages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-2xl"></i>
                  <span className="font-semibold">Private Community</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Choose Your Path to Success
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* 6-Month Certification - Highlighted */}
                <div className={`relative bg-white rounded-2xl shadow-xl border-4 p-8 ${
                  selectedPlan === 'certification' ? 'border-purple-500 ring-4 ring-purple-200' : 'border-gray-200'
                }`}>
                  {/* Popular Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm">
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      6-Month All Access Digital Era Certification
                    </h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">$499</div>
                    <p className="text-gray-600">One-time payment • Full access</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      'Complete access to all courses',
                      'Digital Era Certification',
                      '30-Day Skills Sprint included',
                      'Private mastermind community',
                      'Weekly live coaching calls',
                      'Lifetime course updates',
                      '30-day money-back guarantee'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <i className="fas fa-check-circle text-purple-600"></i>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePlanSelection('certification')}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                      selectedPlan === 'certification'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {selectedPlan === 'certification' ? '✓ Selected' : 'Select Plan'}
                  </button>
                </div>

                {/* Monthly Plan */}
                <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  selectedPlan === 'monthly' ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200'
                }`}>
                  <div className="text-center mb-6">
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      Prefer to start smaller?
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Monthly Access Pass
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-blue-600">$24.75</span>
                      <span className="text-gray-600">/week</span>
                    </div>
                    <p className="text-sm text-gray-600">Billed every 4 weeks ($99) • Cancel anytime</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      'Access to core skill courses',
                      '30-Day Skills Sprint included', 
                      'Community access',
                      'Monthly group coaching',
                      'Cancel anytime',
                      'Upgrade to certification anytime'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <i className="fas fa-check-circle text-blue-600"></i>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePlanSelection('monthly')}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                      selectedPlan === 'monthly'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {selectedPlan === 'monthly' ? '✓ Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Bump for Monthly Plan */}
            {showOrderBump && selectedPlan === 'monthly' && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    id="order-bump"
                    checked={orderBumpSelected}
                    onChange={(e) => setOrderBumpSelected(e.target.checked)}
                    className="mt-1 h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                  />
                  <label htmlFor="order-bump" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-900 mb-2">
                      🚀 Add Starter Pack - Limited Time Offer
                    </div>
                    <div className="text-gray-700 mb-2">
                      Templates, tracking sheets, and bonus resources to accelerate your success
                    </div>
                    <div className="text-lg font-bold text-yellow-700">
                      Add for just $37 <span className="text-sm font-normal line-through text-gray-500">($97 value)</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Upsell for Monthly Users */}
            {selectedPlan === 'monthly' && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-8 text-center">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  🎯 Special Upgrade Offer
                </h3>
                <p className="text-purple-700 mb-4">
                  Upgrade to 6-Month Certification for just <span className="font-bold">$299 more</span>
                </p>
                <p className="text-sm text-purple-600">
                  Total: $398 instead of $499 • Save $101
                </p>
              </div>
            )}

            {/* Checkout Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Future?
              </h3>
              
              <div className="max-w-md mx-auto mb-6">
                <div className="text-lg text-gray-700 mb-4">
                  Your Investment Today:
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {selectedPlan === 'certification' ? '$499' : '$99'}
                  {orderBumpSelected && ' + $37'}
                  {selectedPlan === 'monthly' && <span className="text-base font-normal text-gray-600"> /month</span>}
                </div>
                {selectedPlan === 'monthly' && (
                  <div className="text-sm text-gray-600 mt-2">
                    Billed every 4 weeks • Cancel anytime
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBackToCourse}
                  className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Course
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={!selectedPlan}
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                    selectedPlan
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <i className="fas fa-lock mr-2"></i>
                  Secure Checkout
                </button>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-undo"></i>
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-headset"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}