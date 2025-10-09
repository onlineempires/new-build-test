import { useState, useEffect } from 'react';
import { UserSalesPreference } from '../../types/salesCloser';
import { salesCloserApi } from '../../lib/api/salesCloser';
import {
  CheckCircle,
  Users,
  MessageSquare,
  Clock,
  Shield,
  Zap,
  Settings,
  Target,
} from 'lucide-react';
import Link from 'next/link';

interface MyRoundRobinPageProps {
  onPreferenceChange?: () => void;
}

export default function MyRoundRobinPage({ onPreferenceChange }: MyRoundRobinPageProps) {
  const [preference, setPreference] = useState<UserSalesPreference | null>(null);
  const [loading, setLoading] = useState(true);

  // Load preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        setLoading(true);
        const data = await salesCloserApi.getUserPreference();
        setPreference(data);
      } catch (error) {
        console.error('Failed to load preference:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreference();
  }, []);

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

  if (loading) {
    return (
      <div className="theme-bg min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div
              className="mb-6 h-8 w-64 rounded"
              style={{ backgroundColor: 'var(--color-secondary-bg)' }}
            ></div>
            <div
              className="h-96 rounded-2xl"
              style={{ backgroundColor: 'var(--color-secondary-bg)' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!preference || preference.preference_type !== 'round-robin') {
    return (
      <div className="theme-bg min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="theme-border rounded-2xl border p-8 shadow-lg md:p-12"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <Zap className="mx-auto mb-4 h-16 w-16" style={{ color: 'var(--color-secondary)' }} />
            <h1 className="theme-text-primary mb-4 text-2xl font-bold">Round Robin Not Active</h1>
            <p className="theme-text-secondary mb-6">
              You don't have an active round-robin service preference.
            </p>
            <Link href="/sales_closer">
              <div
                className="inline-flex cursor-pointer items-center space-x-2 rounded-lg px-6 py-3 text-white transition-colors"
                style={{
                  backgroundColor: 'var(--color-primary)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
                }
              >
                <Settings size={20} />
                <span>Set Up Sales Service</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-bg min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between md:mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="theme-text-primary text-2xl font-bold md:text-3xl">
                Automated Round Robin
              </h1>
              <p className="theme-text-secondary text-sm md:text-base">
                Your professional sales service is active
              </p>
            </div>
          </div>
        </div>

        {/* Main Status Card */}
        <div
          className="theme-border mb-8 overflow-hidden rounded-2xl border shadow-lg"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white md:p-8">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 opacity-90 md:h-16 md:w-16" />
            <h2 className="mb-2 text-xl font-bold md:text-2xl">Round Robin Service Active</h2>
            <p className="text-sm text-blue-100 md:text-base">
              Your discovery calls are being handled by our expert sales team
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
              <span className="text-sm font-medium">
                Active since {new Date(preference.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl">
                What This Means for You
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                Your round-robin service automatically assigns incoming prospects to the next
                available trained sales expert in our network. This ensures optimal response times
                and professional handling of all your discovery calls, complete with end-to-end
                service including paperwork for completed sales.
              </p>
            </div>

            {/* How It Works Section */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      New leads are automatically assigned to the next available expert
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Professional sales closers handle the entire call process
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Completed sales include all necessary paperwork
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-bold text-blue-600">4</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      You stay informed through 3-way chat communications
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Key Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-gray-700">Expert-trained sales professionals</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-gray-700">Optimal response times</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-gray-700">Full end-to-end service</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-gray-700">No sales experience required</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="text-sm text-gray-700">Fair rotation ensures availability</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Features Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-3 md:gap-6">
              <div className="rounded-xl bg-blue-50 p-4 text-center md:p-6">
                <Clock className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                <h4 className="mb-2 text-sm font-semibold text-gray-900 md:text-base">
                  Quick Response
                </h4>
                <p className="text-xs text-gray-600 md:text-sm">
                  Leads are contacted promptly by the next available expert
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4 text-center md:p-6">
                <Users className="mx-auto mb-3 h-8 w-8 text-green-600" />
                <h4 className="mb-2 text-sm font-semibold text-gray-900 md:text-base">
                  Expert Team
                </h4>
                <p className="text-xs text-gray-600 md:text-sm">
                  Professionally trained sales closers handle all calls
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4 text-center md:p-6">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-purple-600" />
                <h4 className="mb-2 text-sm font-semibold text-gray-900 md:text-base">
                  3-Way Chat
                </h4>
                <p className="text-xs text-gray-600 md:text-sm">
                  Stay connected through integrated communication
                </p>
              </div>
            </div>

            {/* Information Box */}
            <div className="mb-8 rounded-xl bg-blue-50 p-4 md:p-6">
              <div className="flex items-start space-x-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h4 className="mb-2 font-semibold text-blue-900">
                    Professional Quality Guaranteed
                  </h4>
                  <p className="text-sm leading-relaxed text-blue-700">
                    All sales experts in our round-robin network are thoroughly vetted and trained
                    professionals. They maintain high standards for communication, follow-up, and
                    sales completion. Every interaction is monitored for quality assurance to ensure
                    you receive the best possible service.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleChangeService}
                className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-pink-700 md:px-6 md:text-base"
              >
                <Target className="h-5 w-5" />
                <span>Switch to Dedicated Closer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Optimal Performance</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Round-robin distribution ensures no single closer gets overwhelmed, maintaining high
              service quality and response times for all your prospects.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Diverse Expertise</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Your prospects benefit from the combined expertise of multiple sales professionals,
              each bringing unique skills and approaches to the sales process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
