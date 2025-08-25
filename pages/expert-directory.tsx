import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserRole } from '../contexts/UserRoleContext';

interface Expert {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'offline';
  bio: string;
  profileImage: string;
  experience: string;
  languages: string[];
  timezone: string;
  responseTime: string;
}

const ExpertDirectory: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentTheme } = useTheme();
  const { currentRole, roleDetails } = useUserRole();

  // Mock expert data
  const mockExperts: Expert[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Digital Marketing Strategist',
      specialties: ['SEO', 'Content Marketing', 'Social Media'],
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 150,
      availability: 'available',
      bio: 'Expert digital marketer with 8+ years of experience helping businesses scale their online presence.',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b6cc47a7?w=150&h=150&fit=crop&crop=face',
      experience: '8+ years',
      languages: ['English', 'Mandarin'],
      timezone: 'PST',
      responseTime: '< 2 hours'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      title: 'Sales Funnel Expert',
      specialties: ['Sales Funnels', 'Conversion Optimization', 'Email Marketing'],
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 120,
      availability: 'busy',
      bio: 'Conversion specialist who has optimized funnels generating over $50M in revenue.',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      experience: '6+ years',
      languages: ['English', 'Spanish'],
      timezone: 'EST',
      responseTime: '< 4 hours'
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      title: 'Affiliate Marketing Specialist',
      specialties: ['Affiliate Marketing', 'Partnership Development', 'Revenue Optimization'],
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 140,
      availability: 'available',
      bio: 'Affiliate marketing expert with proven track record of building profitable partnerships.',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      experience: '10+ years',
      languages: ['English', 'Spanish', 'Portuguese'],
      timezone: 'CST',
      responseTime: '< 1 hour'
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Lead Generation Expert',
      specialties: ['Lead Generation', 'CRM Systems', 'Marketing Automation'],
      rating: 4.7,
      reviewCount: 73,
      hourlyRate: 110,
      availability: 'available',
      bio: 'Lead generation specialist focused on quality leads and automated systems.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      experience: '5+ years',
      languages: ['English', 'Korean'],
      timezone: 'PST',
      responseTime: '< 3 hours'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      title: 'Business Strategy Consultant',
      specialties: ['Business Strategy', 'Market Analysis', 'Growth Planning'],
      rating: 4.8,
      reviewCount: 91,
      hourlyRate: 180,
      availability: 'offline',
      bio: 'Strategic business consultant helping entrepreneurs scale from 6 to 7 figures.',
      profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      experience: '12+ years',
      languages: ['English', 'French'],
      timezone: 'EST',
      responseTime: '< 6 hours'
    },
    {
      id: '6',
      name: 'Ahmed Hassan',
      title: 'PPC & Advertising Expert',
      specialties: ['Google Ads', 'Facebook Ads', 'PPC Strategy'],
      rating: 4.9,
      reviewCount: 134,
      hourlyRate: 130,
      availability: 'available',
      bio: 'PPC expert managing over $2M in monthly ad spend across various industries.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      experience: '7+ years',
      languages: ['English', 'Arabic'],
      timezone: 'GMT',
      responseTime: '< 2 hours'
    }
  ];

  const specialties = [
    'all',
    'SEO',
    'Content Marketing',
    'Social Media',
    'Sales Funnels',
    'Email Marketing',
    'Affiliate Marketing',
    'Lead Generation',
    'Business Strategy',
    'PPC & Advertising'
  ];

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading
    setTimeout(() => {
      setExperts(mockExperts);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                           expert.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    
    const matchesAvailability = selectedAvailability === 'all' || 
                              expert.availability === selectedAvailability;
    
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  // Check if user has access
  const hasAccess = currentRole !== 'trial';

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Expert Directory - Digital Era Learning Platform</title>
          <meta name="description" content="Connect with industry experts and mentors" />
        </Head>

        <AppLayout>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div 
              className="max-w-md w-full mx-4 p-8 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="mb-6">
                <i className="fas fa-lock text-6xl text-yellow-500 mb-4"></i>
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Premium Feature
                </h2>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Expert Directory is available for premium members only.
                </p>
              </div>
              <a
                href="/upgrade"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-on-primary)'
                }}
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Upgrade Now
              </a>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Expert Directory - Digital Era Learning Platform</title>
        <meta name="description" content="Connect with industry experts and mentors" />
      </Head>

      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Expert Directory
            </h1>
            <p 
              className="text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Connect with industry experts and get personalized guidance for your business.
            </p>
          </div>

          {/* Filters */}
          <div 
            className="mb-8 p-6 rounded-lg"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <h2 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Find the Right Expert
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, title, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Specialty Filter */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty === 'all' ? 'All Specialties' : specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Availability
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Showing {filteredExperts.length} of {experts.length} experts
            </p>
          </div>

          {/* Expert Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="animate-pulse rounded-lg p-6"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          )}

          {!loading && filteredExperts.length === 0 && (
            <div 
              className="text-center py-12 rounded-lg"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                No experts found
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Try adjusting your search criteria to find more experts.
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
};

// Expert Card Component
interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div 
      className="rounded-lg p-6 border hover:shadow-lg transition-all duration-200"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={expert.profileImage}
          alt={expert.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 
            className="font-semibold text-lg mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {expert.name}
          </h3>
          <p 
            className="text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {expert.title}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getAvailabilityColor(expert.availability)}`}>
              <i className="fas fa-circle text-xs mr-1"></i>
              {getAvailabilityText(expert.availability)}
            </span>
          </div>
        </div>
      </div>

      {/* Rating & Rate */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(expert.rating) ? '' : 'text-gray-300'}`}
              ></i>
            ))}
          </div>
          <span 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {expert.rating} ({expert.reviewCount} reviews)
          </span>
        </div>
        <div 
          className="text-lg font-bold"
          style={{ color: 'var(--color-primary)' }}
        >
          ${expert.hourlyRate}/hr
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {expert.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)'
              }}
            >
              {specialty}
            </span>
          ))}
          {expert.specialties.length > 3 && (
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
            >
              +{expert.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bio */}
      <p 
        className="text-sm mb-4 line-clamp-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        {expert.bio}
      </p>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <span 
            className="font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Experience:
          </span>
          <span 
            className="ml-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {expert.experience}
          </span>
        </div>
        <div>
          <span 
            className="font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Response:
          </span>
          <span 
            className="ml-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {expert.responseTime}
          </span>
        </div>
        <div>
          <span 
            className="font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Timezone:
          </span>
          <span 
            className="ml-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {expert.timezone}
          </span>
        </div>
        <div>
          <span 
            className="font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Languages:
          </span>
          <span 
            className="ml-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {expert.languages.join(', ')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-on-primary)'
          }}
          disabled={expert.availability === 'offline'}
        >
          <i className="fas fa-calendar-plus mr-2"></i>
          Book Session
        </button>
        <button
          className="px-4 py-2 rounded-lg font-medium border transition-colors duration-200"
          style={{ 
            borderColor: 'var(--color-border)',
            color: 'var(--text-primary)'
          }}
        >
          <i className="fas fa-comment"></i>
        </button>
      </div>
    </div>
  );
};

export default ExpertDirectory;