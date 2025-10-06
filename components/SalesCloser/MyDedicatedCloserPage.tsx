import { useState, useEffect, useRef } from 'react';
import {
  SalesCloser,
  UserSalesPreference,
  CloserRating,
  UserActivity,
} from '../../types/salesCloser';
import { salesCloserApi } from '../../lib/api/salesCloser';
import {
  Star,
  Users,
  Mail,
  Settings,
  CheckCircle,
  User,
  RefreshCw,
  Activity,
  MessageCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

interface MyDedicatedCloserPageProps {
  onPreferenceChange?: () => void;
}

export default function MyDedicatedCloserPage({ onPreferenceChange }: MyDedicatedCloserPageProps) {
  const [preference, setPreference] = useState<UserSalesPreference | null>(null);
  const [closer, setCloser] = useState<SalesCloser | null>(null);
  const [userRating, setUserRating] = useState<CloserRating | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const pageRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fade in animation when component mounts
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load preference
        const prefData = await salesCloserApi.getUserPreference();
        setPreference(prefData);

        if (prefData?.sales_closer_id) {
          // Load closer data
          const closerData = await salesCloserApi.getSalesCloser(prefData.sales_closer_id);
          setCloser(closerData);

          // Load user rating
          try {
            const ratingData = await salesCloserApi.getUserRating(prefData.sales_closer_id);
            setUserRating(ratingData);
          } catch (error) {
            // Rating might not exist yet
            setUserRating(null);
          }

          // Load activities
          try {
            const activitiesData = await salesCloserApi.getUserActivities(prefData.sales_closer_id);
            setActivities(activitiesData);
          } catch (error) {
            // Activities might not exist yet
            setActivities([]);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [showChangeCloser, setShowChangeCloser] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [review, setReview] = useState(userRating?.review || '');
  const [submittingRating, setSubmittingRating] = useState(false);

  const handleChangeService = async () => {
    if (!preference?.id) return;

    try {
      // Deactivate current preference
      await salesCloserApi.deletePreference(preference.id);

      // Reload preference
      const data = await salesCloserApi.getUserPreference();
      setPreference(data);

      // Notify the parent component that the preference has changed
      onPreferenceChange?.();
    } catch (error) {
      console.error('Error changing service:', error);
      alert('Error changing service. Please try again.');
    }
  };

  const handleSubmitRating = async () => {
    if (!preference?.sales_closer_id || rating === 0) return;

    setSubmittingRating(true);
    try {
      await salesCloserApi.submitRating({
        sales_closer_id: preference.sales_closer_id,
        rating,
        review: review.trim() || undefined,
      });

      setShowRatingModal(false);

      // Reload activities and rating
      const ratingData = await salesCloserApi.getUserRating(preference.sales_closer_id);
      setUserRating(ratingData);

      const activitiesData = await salesCloserApi.getUserActivities(preference.sales_closer_id);
      setActivities(activitiesData);

      // Notify the parent component that data has changed
      onPreferenceChange?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatActivityType = (type: string) => {
    switch (type) {
      case 'rating_submitted':
        return 'Rating Submitted';
      case 'message_sent':
        return 'Message Sent';
      case 'call_completed':
        return 'Call Completed';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const formatActivityData = (type: string, data: string | null) => {
    if (!data) return '';

    try {
      const parsed = JSON.parse(data);
      if (type === 'rating_submitted') {
        return `${parsed.rating} stars` + (parsed.review ? ` - "${parsed.review}"` : '');
      }
      return JSON.stringify(parsed);
    } catch {
      return data;
    }
  };

  // Early return for loading states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-64 rounded bg-gray-200"></div>
            <div className="h-96 rounded-2xl bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Early return for no preference
  if (!preference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-2xl bg-white p-12 shadow-lg">
            <User className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h1 className="mb-4 text-2xl font-bold text-gray-900">No Sales Preference Set</h1>
            <p className="mb-6 text-gray-600">
              You haven't selected a sales closer preference yet.
            </p>
            <Link
              href="/sales_closer"
              className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
            >
              <Settings size={20} />
              <span>Set Up Sales Closer</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading closer data
  if (!closer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-64 rounded bg-gray-200"></div>
            <div className="h-96 rounded-2xl bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const getSocialLinks = (closer: SalesCloser) => {
    // In a real app, these would come from the database
    // For now, we'll generate some demo links
    return {
      email: `${closer.name.toLowerCase().replace(' ', '.')}@onlineempires.com`,
      linkedin: `https://linkedin.com/in/${closer.name.toLowerCase().replace(' ', '-')}`,
      twitter: `https://twitter.com/${closer.name.toLowerCase().replace(' ', '')}`,
    };
  };

  const socialLinks = getSocialLinks(closer);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dedicated Closer</h1>
              <p className="text-gray-600">Manage your dedicated sales relationship</p>
            </div>
          </div>

          <button
            onClick={() => setShowChangeCloser(!showChangeCloser)}
            className="flex items-center space-x-2 rounded-lg border border-purple-200 bg-white px-4 py-2 text-purple-600 transition-colors hover:bg-purple-50"
          >
            <RefreshCw size={20} />
            <span>Change Closer</span>
          </button>
        </div>

        {showChangeCloser && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Settings className="h-5 w-5 text-amber-600" />
              <h3 className="font-medium text-amber-900">Change Your Dedicated Closer</h3>
            </div>
            <p className="mb-3 text-sm text-amber-700">
              To change your dedicated closer or switch to round-robin service, visit the sales
              closer page. This will deactivate your current preference.
            </p>
            <button
              onClick={handleChangeService}
              className="inline-flex items-center space-x-2 rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700"
            >
              <span>Go to Setup Page</span>
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Closer Profile */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                <div className="text-center">
                  <img
                    src={closer.profile_image_url || '/placeholder/120/120'}
                    alt={closer.name}
                    className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-white/20"
                  />
                  <h2 className="mb-1 text-xl font-bold">{closer.name}</h2>
                  <p className="font-medium text-purple-100">{closer.title}</p>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="p-6">
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Star size={16} className="mr-1 fill-current text-yellow-400" />
                      <span className="font-bold text-gray-900">{closer.rating?.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>

                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Users size={16} className="mr-1 text-blue-600" />
                      <span className="font-bold text-gray-900">{closer.total_calls}</span>
                    </div>
                    <p className="text-xs text-gray-600">Total Calls</p>
                  </div>
                </div>

                {closer.bio && (
                  <div className="mb-6">
                    <h3 className="mb-2 font-semibold text-gray-900">About</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{closer.bio}</p>
                  </div>
                )}

                {closer.specialties && (
                  <div className="mb-6">
                    <h3 className="mb-2 font-semibold text-gray-900">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {closer.specialties.split(',').map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700"
                        >
                          {specialty.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partnership Info */}
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Active Partnership</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Since {new Date(preference.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center space-x-3">
                <MessageCircle className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Contact {closer.name}</h2>
              </div>

              {/* Contact Methods */}
              <div className="grid gap-4 md:grid-cols-3">
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex items-center space-x-3 rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100"
                >
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Email</h3>
                    <p className="text-sm text-blue-700">Send direct email</p>
                  </div>
                </a>

                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                    <span className="text-xs font-bold text-white">in</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">LinkedIn</h3>
                    <p className="text-sm text-blue-700">Connect professionally</p>
                  </div>
                </a>

                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                    <span className="text-xs font-bold text-white">X</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Twitter</h3>
                    <p className="text-sm text-blue-700">Follow on social</p>
                  </div>
                </a>
              </div>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  <strong>Best contact method:</strong> Email is preferred for detailed discussions.
                  LinkedIn for professional networking. Twitter for industry updates and insights.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Star className="mx-auto mb-4 h-12 w-12 text-yellow-600" />
            <h3 className="mb-2 font-semibold text-gray-900">Rate Performance</h3>
            <p className="mb-4 text-sm text-gray-600">
              Share feedback about your experience with {closer.name}
            </p>
            {userRating && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Your rating:</p>
                <div className="mt-1 flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < userRating.rating ? 'fill-current text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({userRating.rating}/5)</span>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setRating(userRating?.rating || 0);
                setReview(userRating?.review || '');
                setShowRatingModal(true);
              }}
              className="w-full rounded-lg bg-yellow-600 py-2 text-white transition-colors hover:bg-yellow-700"
            >
              {userRating ? 'Update Review' : 'Leave Review'}
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="">
              <Activity className="mx-auto mb-4 h-12 w-12 text-green-600" />
              <h3 className="mb-2 font-semibold text-gray-900">View Activity</h3>
              <p className="mb-4 text-sm text-gray-600">
                See recent interactions and activities with {closer.name}
              </p>
            </div>
            <button
              onClick={() => setShowActivityModal(true)}
              className="w-full rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
            >
              View Report
            </button>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Rate {closer.name}</h2>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Rating</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star
                        size={24}
                        className={`${
                          star <= rating
                            ? 'fill-current text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-200'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Review (Optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience working with this closer..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || submittingRating}
                  className="flex-1 rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">Activity Report</h2>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 rounded-lg bg-gray-50 p-4"
                      >
                        <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              {formatActivityType(activity.activity_type)}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {activity.activity_data && (
                            <p className="mt-1 text-sm text-gray-600">
                              {formatActivityData(activity.activity_type, activity.activity_data)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Activity size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">No Activity Yet</h3>
                    <p className="text-gray-600">
                      Your interactions with {closer.name} will appear here.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-6">
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="w-full rounded-lg bg-gray-600 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
