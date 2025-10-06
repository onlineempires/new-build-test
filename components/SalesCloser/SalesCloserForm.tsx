import { useState, useEffect, useRef } from 'react';
import { SalesCloser } from '../../types/salesCloser';
import { salesCloserApi } from '../../lib/api/salesCloser';
import { CheckCircle, Star, Users, Search, Filter, X, FileText, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

type SelectedOption = 'round-robin' | 'dedicated' | null;
type ModalStep = 'closer-selection' | 'terms' | 'confirmation' | null;

interface SalesCloserFormProps {
  isOpen: boolean;
  selectedOption: SelectedOption;
  onClose: () => void;
  onComplete: () => void;
}

// Hook to calculate available space dynamically
const useAvailableSpace = () => {
  const [availableSpace, setAvailableSpace] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    const calculateSpace = () => {
      const sidebar = document.querySelector('[data-sidebar]') as HTMLElement;
      const header = document.querySelector('[data-header]') as HTMLElement;

      // Fallback values for when elements aren't found
      const sidebarWidth = sidebar ? sidebar.offsetWidth : window.innerWidth >= 1024 ? 256 : 0;
      const headerHeight = header ? header.offsetHeight : 64;

      setAvailableSpace({
        left: sidebarWidth,
        top: headerHeight + 20, // Add 20px offset to lower the modal
        right: 0,
        bottom: 0,
      });
    };

    // Calculate on mount and when window resizes
    calculateSpace();
    window.addEventListener('resize', calculateSpace);

    // Also listen for sidebar/header changes
    const observer = new MutationObserver(calculateSpace);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      window.removeEventListener('resize', calculateSpace);
      observer.disconnect();
    };
  }, []);

  return availableSpace;
};

export default function SalesCloserForm({
  isOpen,
  selectedOption,
  onClose,
  onComplete,
}: SalesCloserFormProps) {
  // Modal state management
  const [currentStep, setCurrentStep] = useState<ModalStep>(null);
  const [selectedCloser, setSelectedCloser] = useState<SalesCloser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Terms of Service state
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Refs for GSAP animations
  const modalRef = useRef<HTMLDivElement>(null);
  const isInConfirmationRef = useRef(false);

  // Get available space dynamically
  const availableSpace = useAvailableSpace();

  // API calls
  const [closers, setClosers] = useState<SalesCloser[]>([]);
  const [closersLoading, setClosersLoading] = useState(false);

  // Load closers when modal opens
  useEffect(() => {
    if (isOpen && currentStep === 'closer-selection') {
      loadClosers();
    }
  }, [isOpen, currentStep]);

  const loadClosers = async () => {
    try {
      setClosersLoading(true);
      const data = await salesCloserApi.getSalesClosers();
      setClosers(data);
    } catch (error) {
      console.error('Failed to load closers:', error);
    } finally {
      setClosersLoading(false);
    }
  };

  // Computed values
  const allSpecialties = Array.from(
    new Set(closers.flatMap((closer) => closer.specialties?.split(',').map((s) => s.trim()) || []))
  );

  const filteredClosers = closers.filter((closer) => {
    const matchesSearch =
      closer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (closer.specialties && closer.specialties.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty =
      !selectedSpecialty ||
      (closer.specialties &&
        closer.specialties.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty && closer.is_active;
  });

  // Initialize step when modal opens
  useEffect(() => {
    if (isOpen && selectedOption) {
      // Don't change step if we're already in confirmation
      if (currentStep === 'confirmation' || isInConfirmationRef.current || isTransitioning) {
        return;
      }

      // Only initialize step if we don't have a current step
      if (!currentStep) {
        // For round-robin, skip closer selection and go to terms
        if (selectedOption === 'round-robin') {
          setCurrentStep('terms');
        }
        // For dedicated, show closer selection
        else if (selectedOption === 'dedicated') {
          setCurrentStep('closer-selection');
        }
      }
    }
  }, [isOpen, selectedOption, isTransitioning, currentStep]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(null);
      setSelectedCloser(null);
      setSearchTerm('');
      setSelectedSpecialty('');
      setHasScrolledToBottom(false);
      setHasAccepted(false);
      setIsRegistering(false);
      setIsTransitioning(false);
      isInConfirmationRef.current = false;
    }
  }, [isOpen]);

  // Force confirmation step during transition
  useEffect(() => {
    if (isTransitioning && currentStep !== 'confirmation' && isInConfirmationRef.current) {
      setCurrentStep('confirmation');
    }
  }, [isTransitioning, currentStep]);

  // Modal handlers
  const handleSelectCloserAndProceed = () => {
    if (selectedCloser) {
      setCurrentStep('terms');
    }
  };

  const handleAcceptTerms = async () => {
    if (!hasAccepted || !hasScrolledToBottom) return;

    setIsRegistering(true);

    try {
      await salesCloserApi.savePreference({
        preference_type: selectedOption!,
        sales_closer_id: selectedCloser?.id,
        terms_version: 'v1.0',
      });

      // Move to confirmation step
      setCurrentStep('confirmation');
      isInConfirmationRef.current = true;
    } catch (error) {
      console.error('Error saving preference:', error);
      alert('Error saving your selection. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleConfirmationComplete = () => {
    setIsTransitioning(true);
    const tl = gsap.timeline();

    // Modal fade out
    tl.to(modalRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Trigger page change after modal starts fading
    tl.call(
      () => {
        onComplete();
      },
      [],
      0.1
    );
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen || !currentStep) return null;

  // Show loading state while fetching closers
  if (currentStep === 'closer-selection' && closersLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div
          className="theme-border w-full max-w-md rounded-2xl border p-8 text-center"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div className="mb-4 animate-spin">
            <div
              className="mx-auto h-8 w-8 rounded-full border-4 border-t-transparent"
              style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
            ></div>
          </div>
          <p className="theme-text-secondary">Loading sales closers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full-screen backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      {/* Modal content positioned within available space */}
      <div
        ref={modalRef}
        className="fixed flex items-center justify-center overflow-y-auto p-4"
        style={{
          left: `${availableSpace.left}px`,
          top: `${availableSpace.top}px`,
          right: `${availableSpace.right}px`,
          bottom: `${availableSpace.bottom}px`,
        }}
      >
        {currentStep === 'closer-selection' && (
          <div
            className="theme-border flex max-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col rounded-2xl border shadow-lg"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            {/* Modal Header */}
            <div className="theme-border flex items-center justify-between border-b p-6">
              <h2 className="theme-text-primary text-2xl font-bold">
                Choose Your Dedicated Sales Closer
              </h2>
              <button
                onClick={onClose}
                className="theme-hover p-1"
                style={{ color: 'var(--color-secondary)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Search and Filter */}
              <div className="mb-8 flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform"
                    style={{ color: 'var(--color-secondary)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="theme-input w-full rounded-lg border py-3 pl-10 pr-4 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                    }}
                  />
                </div>

                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform"
                    style={{ color: 'var(--color-secondary)' }}
                  />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="theme-input min-w-[200px] appearance-none rounded-lg border py-3 pl-10 pr-8 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                    }}
                  >
                    <option value="">All Specialties</option>
                    {allSpecialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Closers Grid */}
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {filteredClosers.map((closer) => (
                  <div
                    key={closer.id}
                    className={`cursor-pointer rounded-xl border-2 bg-white transition-all duration-200 hover:shadow-lg ${
                      selectedCloser?.id === closer.id
                        ? 'border-purple-500 shadow-lg ring-4 ring-purple-100'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedCloser(closer)}
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={closer.profile_image_url || '/placeholder/60/60'}
                            alt={closer.name}
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
                          />
                          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-lg font-semibold text-gray-900">
                            {closer.name}
                          </h4>
                          <p className="mb-2 text-sm font-medium text-purple-600">{closer.title}</p>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < Math.floor(closer.rating || 0)
                                      ? 'fill-current text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {closer.rating?.toFixed(1)} ({closer.total_calls} calls)
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {closer.bio}
                      </p>

                      {closer.specialties && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {closer.specialties
                            .split(',')
                            .slice(0, 3)
                            .map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-block rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700"
                              >
                                {specialty.trim()}
                              </span>
                            ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="mr-2 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            {closer.total_calls} calls completed
                          </span>
                        </div>
                        {selectedCloser?.id === closer.id && (
                          <CheckCircle className="h-6 w-6 text-purple-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              {selectedCloser && (
                <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedCloser.profile_image_url || '/placeholder/60/60'}
                      alt={selectedCloser.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        You've selected {selectedCloser.name}
                      </h4>
                      <p className="text-sm text-gray-600">{selectedCloser.title}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelectCloserAndProceed}
                  disabled={!selectedCloser}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {selectedCloser ? `Continue with ${selectedCloser.name}` : 'Select a Closer'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'terms' && (
          <div className="flex max-h-[calc(100vh-8rem)] w-full max-w-4xl flex-col rounded-2xl bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Terms of Service Agreement</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Service Type Banner */}
            <div
              className={`p-4 ${
                selectedOption === 'round-robin' ? 'bg-blue-50' : 'bg-purple-50'
              } border-b border-gray-200`}
            >
              <p className="text-center font-medium text-gray-900">
                {selectedOption === 'round-robin'
                  ? 'Automated Round Robin Sales Service Agreement'
                  : `Dedicated Sales Closer Agreement - ${selectedCloser?.name}`}
              </p>
            </div>

            {/* Terms Content */}
            <div
              className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed text-gray-700"
              onScroll={handleScroll}
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    1. Service Description
                  </h3>
                  <p>
                    {selectedOption === 'round-robin'
                      ? 'Online Empires provides automated round-robin sales closer services where professional trained sales experts handle your discovery calls automatically. This includes full end-to-end service including paperwork for completed sales.'
                      : `Online Empires provides dedicated sales closer services where you work exclusively with ${
                          selectedCloser?.name || 'your chosen closer'
                        } to handle your discovery calls and sales processes.`}
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    2. Commission Structure
                  </h3>
                  <p>
                    Sales closers receive a commission based on successful sales completed. The
                    commission structure is designed to incentivize quality service and successful
                    outcomes for both parties. Specific commission rates may vary based on product
                    type and sales volume.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    3. Lead Assignment and Handling
                  </h3>
                  <p>
                    {selectedOption === 'round-robin'
                      ? 'Leads will be automatically distributed among available qualified sales closers in our network using a fair rotation system. You maintain oversight and communication through our 3-way chat system.'
                      : `All leads will be exclusively handled by ${
                          selectedCloser?.name || 'your dedicated closer'
                        }. You have direct communication access and can build a personal working relationship.`}
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    4. Performance Standards
                  </h3>
                  <p>
                    All sales closers in our network maintain high professional standards including:
                  </p>
                  <ul className="ml-6 mt-2 list-disc space-y-1">
                    <li>Prompt response to leads within agreed timeframes</li>
                    <li>Professional communication and presentation</li>
                    <li>Accurate record keeping and reporting</li>
                    <li>Compliance with all applicable sales regulations</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    5. Communication and Transparency
                  </h3>
                  <p>
                    {selectedOption === 'round-robin'
                      ? 'You will receive regular updates on lead handling and can participate in 3-way communications during the sales process. All interactions are logged and available for your review.'
                      : 'You have direct messaging access to your dedicated closer and can monitor all interactions. Regular progress reports and updates will be provided.'}
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    6. Modification and Termination
                  </h3>
                  <p>
                    {selectedOption === 'round-robin'
                      ? 'You may switch to a dedicated closer at any time through your account dashboard. The round-robin service can be paused or terminated with 24 hours notice.'
                      : 'You may change your dedicated closer or switch to round-robin service at any time through your account dashboard. Changes take effect within 24 hours.'}
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    7. Data Privacy and Security
                  </h3>
                  <p>
                    All lead information and customer data is handled in strict accordance with our
                    Privacy Policy. Sales closers are bound by confidentiality agreements and data
                    protection protocols. Personal information is never shared outside the scope of
                    legitimate sales activities.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">8. Quality Assurance</h3>
                  <p>
                    Online Empires monitors all sales interactions for quality assurance. We reserve
                    the right to provide feedback, additional training, or reassign sales closers to
                    ensure optimal performance and customer satisfaction.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    9. Liability and Warranties
                  </h3>
                  <p>
                    While we strive for excellent results, Online Empires cannot guarantee specific
                    sales outcomes. Sales performance depends on various factors including product
                    quality, market conditions, and lead quality. Our liability is limited to the
                    service fees paid.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    10. Agreement Acceptance
                  </h3>
                  <p>
                    By accepting these terms, you acknowledge that you have read, understood, and
                    agree to be bound by this agreement. This agreement becomes effective
                    immediately upon acceptance and governs your use of our sales closer services.
                  </p>
                </section>

                <div className="mt-8 rounded-lg bg-gray-50 p-4">
                  <p className="text-center font-medium text-gray-900">
                    Last Updated: August 28, 2025 | Version 1.0
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={hasAccepted}
                  onChange={(e) => setHasAccepted(e.target.checked)}
                  disabled={!hasScrolledToBottom}
                  className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <label htmlFor="terms-checkbox" className="flex-1 text-sm text-gray-700">
                  I have read and scrolled through the entire Terms of Service agreement above, and
                  I understand and agree to be bound by these terms and conditions for the{' '}
                  {selectedOption === 'round-robin'
                    ? 'automated round-robin sales service'
                    : `dedicated sales closer service with ${selectedCloser?.name}`}
                  .
                </label>
              </div>

              {!hasScrolledToBottom && (
                <div className="mb-4 rounded-r-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                  <p className="text-center text-sm font-medium text-amber-800">
                    📋 Please scroll to the bottom of the terms above to enable the acceptance
                    checkbox.
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptTerms}
                  disabled={!hasAccepted || !hasScrolledToBottom || isRegistering}
                  className={`flex-1 rounded-lg px-4 py-3 font-medium text-white transition-colors ${
                    hasAccepted && hasScrolledToBottom && !isRegistering
                      ? selectedOption === 'round-robin'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                      : 'cursor-not-allowed bg-gray-400'
                  }`}
                >
                  {isRegistering ? 'Processing...' : 'Accept Terms & Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center md:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">Setup Complete!</h2>

            <p className="mb-6 text-gray-600">
              {selectedOption === 'round-robin'
                ? 'You are now registered for our automated round-robin sales service. Your leads will be handled by our expert team.'
                : `${selectedCloser?.name} is now your dedicated sales closer. You can message them directly and manage your relationship.`}
            </p>

            {selectedOption === 'dedicated' && (
              <div className="mb-6 rounded-lg bg-purple-50 p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedCloser?.profile_image_url || '/placeholder/48/48'}
                    alt={selectedCloser?.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{selectedCloser?.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCloser?.title}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleConfirmationComplete}
                className={`flex-1 rounded-lg px-4 py-3 font-medium transition-colors ${
                  selectedOption === 'round-robin'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {selectedOption === 'dedicated' ? 'Go to My Closer' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
