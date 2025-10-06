import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';
import { UserSalesPreference } from '../../types/salesCloser';
import { salesCloserApi } from '../../lib/api/salesCloser';
import { Loader2 } from 'lucide-react';
import SalesCloserSetupPage from '../../components/SalesCloser/SalesCloserSetupPage';
import MyRoundRobinPage from '../../components/SalesCloser/MyRoundRobinPage';
import MyDedicatedCloserPage from '../../components/SalesCloser/MyDedicatedCloserPage';
import SalesCloserForm from '../../components/SalesCloser/SalesCloserForm';
import { FadeInOnMount } from '../../components/SalesCloser/FadeInOnMount';

type SelectedOption = 'round-robin' | 'dedicated' | null;

export default function SalesCloserPage() {
  const [existingPreference, setExistingPreference] = useState<UserSalesPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);

  // Load user's sales preference
  useEffect(() => {
    const loadPreference = async () => {
      try {
        setLoading(true);
        setError(null);
        const preference = await salesCloserApi.getUserPreference();
        setExistingPreference(preference);
      } catch (err) {
        console.error('Failed to load sales preference:', err);
        setError('Failed to load sales preference');
      } finally {
        setLoading(false);
      }
    };

    loadPreference();
  }, []);

  // Form handlers
  const handleSelectOption = (option: SelectedOption) => {
    setSelectedOption(option);
    setShowForm(true);
  };

  const handleFormComplete = async () => {
    try {
      // Refetch preference to get updated data
      const preference = await salesCloserApi.getUserPreference();
      setExistingPreference(preference);

      // Close the form
      setShowForm(false);
      setSelectedOption(null);
    } catch (err) {
      console.error('Failed to refresh preference:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedOption(null);
  };

  const handlePreferenceChange = async () => {
    try {
      const preference = await salesCloserApi.getUserPreference();
      setExistingPreference(preference);
    } catch (err) {
      console.error('Failed to refresh preference:', err);
    }
  };

  // Show loading state while fetching preference
  if (loading) {
    return (
      <AppLayout user={{ id: 1, name: 'Loading...', avatarUrl: '' }}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="text-center">
            <div className="mb-4 animate-spin">
              <Loader2 className="mx-auto h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600">Loading sales preference...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <Loader2 className="mx-auto h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Error Loading Sales Preference
            </h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const renderPage = () => {
    if (!existingPreference || !existingPreference.is_active) {
      return <SalesCloserSetupPage onSelectOption={handleSelectOption} />;
    }
    if (existingPreference.preference_type === 'round-robin') {
      return <MyRoundRobinPage onPreferenceChange={handlePreferenceChange} />;
    }
    if (existingPreference.preference_type === 'dedicated') {
      return <MyDedicatedCloserPage onPreferenceChange={handlePreferenceChange} />;
    }
    return <SalesCloserSetupPage onSelectOption={handleSelectOption} />;
  };

  return (
    <>
      <Head>
        <title>Sales Closer Setup - Online Empires</title>
        <meta name="description" content="Set up your sales closer service for discovery calls" />
      </Head>

      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="relative">
          {/* Render appropriate page based on preference */}
          <FadeInOnMount>{renderPage()}</FadeInOnMount>

          <SalesCloserForm
            isOpen={showForm}
            selectedOption={selectedOption}
            onClose={handleFormClose}
            onComplete={handleFormComplete}
          />
        </div>
      </AppLayout>
    </>
  );
}
