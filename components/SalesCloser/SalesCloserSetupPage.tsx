import { CheckCircle, Zap, Target, Settings, Award, Users } from 'lucide-react';

type SelectedOption = 'round-robin' | 'dedicated' | null;

interface SalesCloserSetupPageProps {
  onSelectOption?: (option: 'round-robin' | 'dedicated') => void;
}

export default function SalesCloserSetupPage({ onSelectOption }: SalesCloserSetupPageProps) {
  const handleSelectOption = (option: SelectedOption) => {
    if (option) {
      onSelectOption?.(option);
    }
  };

  return (
    <div className="theme-bg relative min-h-screen p-4 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col">
        {/* Header */}
        <div className="mb-8 text-center md:mb-12">
          <h1 className="theme-text-primary mb-3 text-2xl font-bold md:mb-4 md:text-4xl">
            Discovery Call Setup
          </h1>
          <p className="theme-text-secondary mx-auto max-w-3xl px-2 text-base leading-relaxed md:text-xl">
            Choose how your discovery calls will be handled for new members. Select the option that
            best fits your business needs and growth stage.
          </p>
        </div>

        {/* Two Main Options */}
        <div className="mb-8 grid gap-6 md:mb-12 md:grid-cols-2 md:gap-8">
          {/* Option 1: Round Robin */}
          <div
            className="theme-border relative transform cursor-pointer overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--color-bg)' }}
            onClick={() => handleSelectOption('round-robin')}
          >
            {/* Recommended Badge */}
            <div
              className="absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--color-success)' }}
            >
              Recommended
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-center">
                <div
                  className="mr-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl md:mr-4 md:h-16 md:w-16"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                  }}
                >
                  <Zap className="h-6 w-6 text-white md:h-8 md:w-8" />
                </div>
                <div>
                  <h3 className="theme-text-primary text-lg font-bold md:text-2xl">
                    Automated Round Robin
                  </h3>
                  <p
                    className="text-sm font-medium md:text-base"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Instant Setup & Expert Support
                  </p>
                </div>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Professional trained sales experts handle your calls automatically
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Full end-to-end service including paperwork for completed sales
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Perfect for new businesses or those not confident in sales yet
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Maintain clear communication with leads using 3-way chats
                  </p>
                </div>
              </div>

              <div
                className="mb-6 rounded-xl p-6"
                style={{ backgroundColor: 'var(--color-primary-bg)' }}
              >
                <h4 className="theme-text-primary mb-2 font-semibold">This is for you if...</h4>
                <ul className="theme-text-secondary space-y-2 text-sm">
                  <li>✓ You're new to the business or not confident in sales yet</li>
                  <li>✓ You want trained expert sales advisors to handle your calls</li>
                  <li>✓ You want a full end-to-end service including paperwork</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Option 2: Dedicated Closer */}
          <div
            className="theme-border relative transform cursor-pointer overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--color-bg)' }}
            onClick={() => handleSelectOption('dedicated')}
          >
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-center">
                <div
                  className="mr-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl md:mr-4 md:h-16 md:w-16"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                  }}
                >
                  <Target className="h-6 w-6 text-white md:h-8 md:w-8" />
                </div>
                <div>
                  <h3 className="theme-text-primary text-lg font-bold md:text-2xl">
                    Dedicated Sales Closer
                  </h3>
                  <p
                    className="text-sm font-medium md:text-base"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Choose Your Personal Expert
                  </p>
                </div>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Hand-pick a dedicated advisor to handle your calls exclusively
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Build a personal relationship with your chosen sales expert
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Consistent communication style and approach
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                  <p className="theme-text-secondary">
                    Perfect for experienced members who want control
                  </p>
                </div>
              </div>

              <div
                className="mb-6 rounded-xl p-6"
                style={{ backgroundColor: 'var(--color-primary-bg)' }}
              >
                <h4 className="theme-text-primary mb-2 font-semibold">This is for you if...</h4>
                <ul className="theme-text-secondary space-y-2 text-sm">
                  <li>✓ You would prefer a dedicated advisor to take your calls</li>
                  <li>✓ You want to build a personal relationship with your closer</li>
                  <li>✓ You have specific requirements or preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
          <h3 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">How It Works</h3>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 md:h-16 md:w-16">
                <Settings className="h-6 w-6 text-blue-600 md:h-8 md:w-8" />
              </div>
              <h4 className="mb-2 text-base font-semibold text-gray-900 md:text-lg">1. Setup</h4>
              <p className="text-sm text-gray-600 md:text-base">
                Choose your preferred option and complete the quick setup process. Your selection
                can be changed anytime.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-blue-100 md:h-16 md:w-16">
                <Users className="h-6 w-6 text-green-600 md:h-8 md:w-8" />
              </div>
              <h4 className="mb-2 text-base font-semibold text-gray-900 md:text-lg">
                2. Lead Routing
              </h4>
              <p className="text-sm text-gray-600 md:text-base">
                Your new prospects are automatically routed to your chosen sales solution - either
                round-robin or your dedicated closer.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 md:h-16 md:w-16">
                <Award className="h-6 w-6 text-purple-600 md:h-8 md:w-8" />
              </div>
              <h4 className="mb-2 text-base font-semibold text-gray-900 md:text-lg">3. Results</h4>
              <p className="text-sm text-gray-600 md:text-base">
                Professional sales experts handle your calls, manage objections, and complete sales
                including all paperwork.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
