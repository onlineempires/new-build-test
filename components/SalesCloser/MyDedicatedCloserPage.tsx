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
              <div className="flex items-center space-x-2">
                <Settings size={20} />
                <span>Set Up Sales Closer</span>
              </div>
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
    <div ref={pageRef} className="theme-bg min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="theme-text-primary text-3xl font-bold">My Dedicated Closer</h1>
              <p className="theme-text-secondary">Manage your dedicated sales relationship</p>
            </div>
          </div>

          <button
            onClick={() => setShowChangeCloser(!showChangeCloser)}
            className="theme-hover flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors"
            style={{
              borderColor: 'var(--color-primary)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-primary)',
            }}
          >
            <RefreshCw size={20} />
            <span>Change Closer</span>
          </button>
        </div>

        {showChangeCloser && (
          <div
            className="theme-border mb-6 rounded-lg border p-4"
            style={{ backgroundColor: 'var(--color-background-secondary)' }}
          >
            <div className="mb-2 flex items-center space-x-2">
              <Settings className="h-5 w-5" style={{ color: 'var(--color-warning)' }} />
              <h3 className="font-medium" style={{ color: 'var(--color-warning)' }}>
                Change Your Dedicated Closer
              </h3>
            </div>
            <p className="mb-3 text-sm" style={{ color: 'var(--color-warning)' }}>
              To change your dedicated closer or switch to round-robin service, visit the sales
              closer page. This will deactivate your current preference.
            </p>
            <button
              onClick={handleChangeService}
              className="inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm text-white transition-colors"
              style={{
                backgroundColor: 'var(--color-warning)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--color-warning-hover)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-warning)')}
            >
              <span>Go to Setup Page</span>
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Closer Profile */}
          <div className="lg:col-span-1">
            <div
              className="theme-border overflow-hidden rounded-2xl border shadow-lg"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
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
                      <span className="theme-text-primary font-bold">
                        {closer.rating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="theme-text-secondary text-xs">Rating</p>
                  </div>

                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Users size={16} className="mr-1" style={{ color: 'var(--color-primary)' }} />
                      <span className="theme-text-primary font-bold">{closer.total_calls}</span>
                    </div>
                    <p className="theme-text-secondary text-xs">Total Calls</p>
                  </div>
                </div>

                {closer.bio && (
                  <div className="mb-6">
                    <h3 className="theme-text-primary mb-2 font-semibold">About</h3>
                    <p className="theme-text-secondary text-sm leading-relaxed">{closer.bio}</p>
                  </div>
                )}

                {closer.specialties && (
                  <div className="mb-6">
                    <h3 className="theme-text-primary mb-2 font-semibold">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {closer.specialties.split(',').map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block rounded-full px-2 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          {specialty.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partnership Info */}
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: 'var(--color-background-secondary)' }}
                >
                  <div className="mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
                    <h3 className="font-semibold" style={{ color: 'var(--color-success)' }}>
                      Active Partnership
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                    Since {new Date(preference.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-2">
            <div
              className="theme-border rounded-2xl border p-6 shadow-lg"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
              <div className="mb-6 flex items-center space-x-3">
                <MessageCircle className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                <h2 className="theme-text-primary text-xl font-bold">Contact {closer.name}</h2>
              </div>

              {/* Contact Methods */}
              <div className="grid gap-4 md:grid-cols-3">
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="theme-hover group flex items-center space-x-3 rounded-lg border p-4 transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <Mail className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h3 className="theme-text-primary font-semibold">Email</h3>
                    <p className="theme-text-secondary text-sm">Send direct email</p>
                  </div>
                </a>

                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-hover group flex items-center space-x-3 rounded-lg border p-4 transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="theme-text-primary font-semibold">LinkedIn</h3>
                    <p className="theme-text-secondary text-sm">Connect professionally</p>
                  </div>
                </a>

                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-hover group flex items-center space-x-3 rounded-lg border p-4 transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="theme-text-primary font-semibold">Twitter</h3>
                    <p className="theme-text-secondary text-sm">Follow on social</p>
                  </div>
                </a>
              </div>

              <div
                className="mt-6 rounded-lg p-4"
                style={{ backgroundColor: 'var(--color-background-secondary)' }}
              >
                <p className="theme-text-secondary text-sm">
                  <strong className="theme-text-primary">Best contact method:</strong> Email is
                  preferred for detailed discussions. LinkedIn for professional networking. Twitter
                  for industry updates and insights.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div
            className="theme-border rounded-xl border p-6 text-center shadow-sm"
            style={{ backgroundColor: 'var(--color-card-background)' }}
          >
            <Star className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--color-warning)' }} />
            <h3 className="theme-text-primary mb-2 font-semibold">Rate Performance</h3>
            <p className="theme-text-secondary mb-4 text-sm">
              Share feedback about your experience with {closer.name}
            </p>
            {userRating && (
              <div className="mb-4">
                <p className="theme-text-primary text-sm font-medium">Your rating:</p>
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
                  <span className="theme-text-secondary ml-2 text-sm">({userRating.rating}/5)</span>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setRating(userRating?.rating || 0);
                setReview(userRating?.review || '');
                setShowRatingModal(true);
              }}
              className="w-full rounded-lg py-2 text-white transition-colors"
              style={{
                backgroundColor: 'var(--color-warning)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--color-warning-hover)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-warning)')}
            >
              {userRating ? 'Update Review' : 'Leave Review'}
            </button>
          </div>

          <div
            className="theme-border flex flex-col justify-between rounded-xl border p-6 text-center shadow-sm"
            style={{ backgroundColor: 'var(--color-card-background)' }}
          >
            <div className="">
              <Activity
                className="mx-auto mb-4 h-12 w-12"
                style={{ color: 'var(--color-success)' }}
              />
              <h3 className="theme-text-primary mb-2 font-semibold">View Activity</h3>
              <p className="theme-text-secondary mb-4 text-sm">
                See recent interactions and activities with {closer.name}
              </p>
            </div>
            <button
              onClick={() => setShowActivityModal(true)}
              className="w-full rounded-lg py-2 text-white transition-colors"
              style={{
                backgroundColor: 'var(--color-success)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--color-success-hover)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-success)')}
            >
              View Report
            </button>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div
              className="theme-border w-full max-w-md rounded-2xl border p-6"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="theme-text-primary text-xl font-bold">Rate {closer.name}</h2>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="theme-hover p-1"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <label className="theme-text-primary mb-2 block text-sm font-medium">
                  Your Rating
                </label>
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
                <label className="theme-text-primary mb-2 block text-sm font-medium">
                  Review (Optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience working with this closer..."
                  className="theme-input w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="theme-hover flex-1 rounded-lg border px-4 py-2 transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || submittingRating}
                  className="flex-1 rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--color-warning)',
                  }}
                  onMouseEnter={(e) =>
                    !e.currentTarget.disabled &&
                    (e.currentTarget.style.backgroundColor = 'var(--color-warning-hover)')
                  }
                  onMouseLeave={(e) =>
                    !e.currentTarget.disabled &&
                    (e.currentTarget.style.backgroundColor = 'var(--color-warning)')
                  }
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
            <div
              className="theme-border flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
              <div className="theme-border flex items-center justify-between border-b p-6">
                <h2 className="theme-text-primary text-xl font-bold">Activity Report</h2>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="theme-hover p-1"
                  style={{ color: 'var(--color-secondary)' }}
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
                        className="theme-border flex items-start space-x-3 rounded-lg border p-4"
                        style={{ backgroundColor: 'var(--color-card-background)' }}
                      >
                        <div
                          className="mt-2 h-2 w-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-success)' }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="theme-text-primary font-medium">
                              {formatActivityType(activity.activity_type)}
                            </h3>
                            <span className="theme-text-secondary text-xs">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {activity.activity_data && (
                            <p className="theme-text-secondary mt-1 text-sm">
                              {formatActivityData(activity.activity_type, activity.activity_data)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Activity
                      size={48}
                      className="mx-auto mb-4"
                      style={{ color: 'var(--color-secondary)' }}
                    />
                    <h3 className="theme-text-primary mb-2 text-lg font-medium">No Activity Yet</h3>
                    <p className="theme-text-secondary">
                      Your interactions with {closer.name} will appear here.
                    </p>
                  </div>
                )}
              </div>

              <div className="theme-border border-t p-6">
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="w-full rounded-lg py-2 text-white transition-colors"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--color-secondary)')
                  }
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
