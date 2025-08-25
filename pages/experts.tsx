import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import Badge, { LevelBadge, SpecialtyBadge } from '../components/ui/Badge';
import dynamic from 'next/dynamic';

// Lazy load the booking modal (only loads when needed)
const NewBookingModal = dynamic(
  () => import('../components/experts/NewBookingModal'),
  { 
    loading: () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading booking form...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);
import { Expert, getAllExperts } from '../lib/api/experts';

const ExpertDirectory = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    try {
      setLoading(true);
      setError(null);
      const expertsData = await getAllExperts();
      setExperts(expertsData);
    } catch (err) {
      console.error('Failed to load experts:', err);
      setError('Failed to load experts data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookCall = (expert: Expert) => {
    setSelectedExpert(expert);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = (bookingData: any) => {
    console.log('Booking successful:', bookingData);
    // Show success message
    alert(`Booking confirmed! ID: ${bookingData.bookingId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '6A Leader':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '6A2 Leader':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '6A4-3 Leader':
        return 'bg-green-100 text-green-800 border-green-200';
      case '6A2-3 Leader':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '6A8-4 Leader':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = filterLevel === 'all' || expert.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <AppLayout user={{ id: 0, name: 'Loading...', avatarUrl: '' }}>
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 theme-bg-secondary rounded w-64 mb-2"></div>
            <div className="h-4 theme-bg-secondary rounded w-96 mb-8"></div>
            
            {/* Filter Skeleton */}
            <div className="flex gap-4 mb-8">
              <div className="h-10 theme-bg-secondary rounded w-80"></div>
              <div className="h-10 theme-bg-secondary rounded w-40"></div>
            </div>
            
            {/* Expert Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="theme-bg-secondary h-80 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout user={{ id: 0, name: 'User', avatarUrl: '' }}>
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="theme-card px-4 py-4 rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: 'var(--color-error)', backgroundColor: 'var(--bg-card)', color: 'var(--color-error)' }}>
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle mt-0.5 mr-3" style={{ color: 'var(--color-error)' }}></i>
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ color: 'var(--color-error)' }}>Unable to load experts</div>
                <div className="text-sm mb-3 theme-text-secondary">{error}</div>
                <button 
                  onClick={loadExperts}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 theme-button-secondary"
                  style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Expert Directory - Digital Era</title>
        <meta name="description" content="Book 1-on-1 coaching calls with our top 6A+ Enagic leaders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AppLayout user={{ id: 123, name: 'Ashley Kemp', avatarUrl: '/default-avatar.png' }}>
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary mb-2">Expert Directory</h1>
            <p className="theme-text-secondary text-sm sm:text-base">
              Book 1-on-1 coaching calls with our top 6A+ Enagic leaders
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-md">
              <input
                type="text"
                placeholder="Search experts by name, title, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="theme-input w-full h-12 pl-12 pr-4 text-sm"
              />
              <div className="absolute left-4 top-3.5 theme-text-tertiary">
                <i className="fas fa-search"></i>
              </div>
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="theme-input h-12 pl-4 pr-10 text-sm"
              >
                <option value="all">All Levels</option>
                <option value="6A Leader">6A Leader</option>
                <option value="6A2 Leader">6A2 Leader</option>
                <option value="6A4-3 Leader">6A4-3 Leader</option>
                <option value="6A2-3 Leader">6A2-3 Leader</option>
                <option value="6A8-4 Leader">6A8-4 Leader</option>
              </select>
            </div>
          </div>

          {/* Expert Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className="group theme-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
              >
                {/* Expert Avatar & Header */}
                <div className="p-5 text-center border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="relative mb-4">
                    <img
                      src={expert.avatarUrl}
                      alt={expert.name}
                      className="w-20 h-20 rounded-full mx-auto border-4 shadow-md group-hover:scale-105 transition-transform duration-300"
                      style={{ borderColor: 'var(--bg-card)' }}
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold theme-text-primary mb-2">{expert.name}</h3>
                  
                  {/* Rating */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-center">
                      <div className="flex mr-2" style={{ color: 'var(--color-warning)' }}>
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star text-sm ${
                              i < Math.floor(expert.rating) ? '' : 'opacity-30'
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm theme-text-secondary font-medium">({expert.stats.averageRating})</span>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <LevelBadge level={expert.level} className="inline-flex items-center">
                    <i className="fas fa-award mr-1"></i>
                    {expert.level}
                  </LevelBadge>
                </div>

                {/* Expert Details */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex-grow space-y-4">
                    {/* Title and Description */}
                    <div>
                      <h4 className="font-semibold theme-text-primary text-lg mb-2">{expert.title}</h4>
                      <p className="text-sm theme-text-secondary leading-relaxed">{expert.description}</p>
                    </div>

                    {/* Specialties */}
                    <div>
                      <div className="flex justify-center gap-1.5 flex-wrap">
                        {expert.specialties.slice(0, 3).map((specialty, index) => (
                          <SpecialtyBadge key={index} specialty={specialty} />
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6 py-3">
                      <div className="text-center">
                        <div className="text-lg font-bold theme-text-primary">{expert.stats.totalSessions}</div>
                        <div className="text-xs theme-text-muted font-medium">Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold theme-text-primary">{expert.stats.responseTime}</div>
                        <div className="text-xs theme-text-muted font-medium">Response</div>
                      </div>
                    </div>

                    {/* Duration & Price */}
                    <div className="text-center py-2">
                      <div className="theme-text-secondary text-sm font-medium mb-1">{expert.sessionDuration} Minutes</div>
                      <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>${expert.price}</div>
                    </div>
                  </div>

                  {/* Book Call Button - Always at bottom */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleBookCall(expert)}
                      className="theme-button-primary w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center"
                    >
                      <i className="fas fa-calendar-plus mr-2"></i>
                      Book Call Now
                    </button>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredExperts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-2xl theme-text-tertiary"></i>
              </div>
              <h3 className="text-lg font-semibold theme-text-primary mb-2">No experts found</h3>
              <p className="theme-text-secondary mb-4">
                {searchQuery || filterLevel !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No experts are currently available'
                }
              </p>
              {(searchQuery || filterLevel !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterLevel('all');
                  }}
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredExperts.length > 0 && (
            <div className="mt-8 text-center text-sm theme-text-secondary">
              Showing {filteredExperts.length} of {experts.length} expert{experts.length === 1 ? '' : 's'}
            </div>
          )}
        </div>

        {/* New Booking Modal */}
        <NewBookingModal
          expert={selectedExpert}
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedExpert(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      </AppLayout>
    </>
  );
};

export default ExpertDirectory;