import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { getAllCourses, CourseData } from '../lib/api/courses';

export default function AllCourses() {
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await getAllCourses();
      setData(coursesData);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Failed to load courses data'}
            <button 
              onClick={loadCourses}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>All Courses - Online Empires</title>
        <meta name="description" content="Browse all courses available in Online Empires" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout 
        user={data.user} 
        notifications={data.notifications}
        onClearNotifications={() => {}}
      >
        <div className="min-h-screen bg-gray-50">
          
          {/* Statistics Cards */}
          <div className="bg-white border-b border-gray-200 px-6 py-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Course Completed */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-graduation-cap text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Course Completed</div>
                    <div className="text-2xl font-bold text-gray-900">53%</div>
                  </div>
                </div>
              </div>
              
              {/* Learning Streak */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-fire text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Learning Streak</div>
                    <div className="text-2xl font-bold text-gray-900">12 days</div>
                  </div>
                </div>
              </div>
              
              {/* Achievements */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-trophy text-purple-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Achievements</div>
                    <div className="text-2xl font-bold text-gray-900">23</div>
                  </div>
                </div>
              </div>
              
              {/* Hours Learned */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-yellow-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Hours Learned</div>
                    <div className="text-2xl font-bold text-gray-900">127</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Banner */}
          <div className="bg-green-500 text-white px-6 py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-check text-white"></i>
              </div>
              <div className="flex-1">
                <span className="font-semibold">Achievement Unlocked!</span>
                <span className="mx-2">"Course Crusher" — Complete 8 courses!</span>
                <span className="font-bold">+350 XP</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8">
            
            {/* Your Learning Journey Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Your Learning Journey</h1>
              <div className="text-sm text-blue-600 font-medium">18 courses available</div>
            </div>

            {/* Start Here Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  1
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Start Here</h2>
                <span className="ml-3 text-sm text-gray-500">Required</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                
                {/* The Business Blueprint */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <i className="fas fa-building text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">COMPLETED</span>
                      <span className="text-xs text-gray-500">BEGINNER</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">The Business Blueprint</h3>
                    <p className="text-sm text-gray-600 mb-3">Foundation course covering the basics of business building...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>15 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>2.5 hours</span>
                      <span className="text-green-600 font-medium">+200 XP</span>
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded font-medium hover:bg-green-600 transition-colors">
                      <i className="fas fa-check mr-2"></i>Completed
                    </button>
                  </div>
                </div>

                {/* The Discovery Process */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                    <i className="fas fa-search text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">IN PROGRESS</span>
                      <span className="text-xs text-gray-500">BEGINNER</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">The Discovery Process</h3>
                    <p className="text-sm text-gray-600 mb-3">Learn how to identify opportunities and understand your target market deeply</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>8 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>1.5 hours</span>
                      <span className="text-yellow-600 font-medium">+160 XP</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
                      <i className="fas fa-play mr-2"></i>Continue Learning
                    </button>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden opacity-75">
                  <div className="h-32 bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center">
                    <i className="fas fa-arrow-right text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">LOCKED</span>
                      <span className="text-xs text-gray-500">BEGINNER</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
                    <p className="text-sm text-gray-600 mb-3">Plan your implementation strategy and take action on what you've learned</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>4 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>1 hour</span>
                      <span className="text-yellow-600 font-medium">+100 XP</span>
                    </div>
                    <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded font-medium cursor-not-allowed">
                      <i className="fas fa-lock mr-2"></i>Complete Discovery Process First
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Training Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  2
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Advanced Training</h2>
                <span className="ml-3 text-sm text-purple-600 font-medium">Skill Builder</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                
                {/* TikTok Mastery */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                    <i className="fab fa-tiktok text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">IN PROGRESS</span>
                      <span className="text-xs text-gray-500">INTERMEDIATE</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">TikTok Mastery</h3>
                    <p className="text-sm text-gray-600 mb-3">Master TikTok marketing strategies and create viral content that converts</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>25 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>6 hours</span>
                      <span className="text-yellow-600 font-medium">+450 XP</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                    <a 
                      href="/courses/tiktok-mastery"
                      className="block w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      <i className="fas fa-play mr-2"></i>Continue Learning (16/24)
                    </a>
                  </div>
                </div>

                {/* Facebook Advertising Mastery */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                    <i className="fab fa-facebook text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">COMPLETED</span>
                      <span className="text-xs text-gray-500">ADVANCED</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Facebook Advertising Mastery</h3>
                    <p className="text-sm text-gray-600 mb-3">Advanced Facebook ads and targeting for maximum ROI and lead generation</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>22 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>8 hours</span>
                      <span className="text-green-600 font-medium">+500 XP</span>
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded font-medium hover:bg-green-600 transition-colors">
                      <i className="fas fa-redo mr-2"></i>Completed - Review
                    </button>
                  </div>
                </div>

                {/* Instagram Growth Hacks */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <i className="fab fa-instagram text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">NOT STARTED</span>
                      <span className="text-xs text-gray-500">BEGINNER</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instagram Growth Hacks</h3>
                    <p className="text-sm text-gray-600 mb-3">Grow your Instagram following with advanced strategies and followers</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>18 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>4.5 hours</span>
                      <span className="text-yellow-600 font-medium">+350 XP</span>
                    </div>
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded font-medium hover:bg-gray-700 transition-colors">
                      <i className="fas fa-rocket mr-2"></i>Start Course
                    </button>
                  </div>
                </div>

                {/* Email Marketing Secrets */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                    <i className="fas fa-envelope text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">AVAILABLE SOON</span>
                      <span className="text-xs text-gray-500">INTERMEDIATE</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Marketing Secrets</h3>
                    <p className="text-sm text-gray-600 mb-3">Build profitable email sequences and automated funnels</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>16 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>5 hours</span>
                      <span className="text-yellow-600 font-medium">+400 XP</span>
                    </div>
                    <button className="w-full bg-orange-500 text-white py-2 px-4 rounded font-medium">
                      <i className="fas fa-clock mr-2"></i>Available Soon
                    </button>
                  </div>
                </div>

                {/* Sales Psychology */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                    <i className="fas fa-brain text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">COMPLETED</span>
                      <span className="text-xs text-gray-500">ADVANCED</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sales Psychology</h3>
                    <p className="text-sm text-gray-600 mb-3">Understand buyer psychology and master the art of persuasion</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>14 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>3.5 hours</span>
                      <span className="text-green-600 font-medium">+300 XP</span>
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded font-medium hover:bg-green-600 transition-colors">
                      <i className="fas fa-redo mr-2"></i>Completed - Review
                    </button>
                  </div>
                </div>

                {/* Team Building Mastery */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <i className="fas fa-users text-white text-3xl"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">IN PROGRESS</span>
                      <span className="text-xs text-gray-500">ADVANCED</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Team Building Mastery</h3>
                    <p className="text-sm text-gray-600 mb-3">Build, lead, and scale high-performing teams that drive results</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span><i className="fas fa-play-circle mr-1"></i>20 lessons</span>
                      <span><i className="fas fa-clock mr-1"></i>6.5 hours</span>
                      <span className="text-yellow-600 font-medium">+480 XP</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
                      <i className="fas fa-play mr-2"></i>Continue Learning (5/20)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
              <div className="flex items-center gap-4">
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-graduation-cap text-white text-xl"></i>
                  </div>
                  <div className="text-xs font-medium text-gray-700">Course Master</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-bolt text-white text-xl"></i>
                  </div>
                  <div className="text-xs font-medium text-gray-700">Quick Learner</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-fire text-white text-xl"></i>
                  </div>
                  <div className="text-xs font-medium text-gray-700">7-Day Streak</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-trophy text-white text-xl"></i>
                  </div>
                  <div className="text-xs font-medium text-gray-700">First Master</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-star text-white text-xl"></i>
                  </div>
                  <div className="text-xs font-medium text-gray-700">Fast Finisher</div>
                </div>
              </div>
            </div>

            {/* Level 13 Preview */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Level 13 Preview</h3>
              <p className="text-purple-100 mb-4">Complete 2 more courses to unlock advanced business scaling strategies!</p>
              
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>XP Progress</span>
                  <span>153 XP needed for next level</span>
                </div>
                <div className="w-full bg-purple-800 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}