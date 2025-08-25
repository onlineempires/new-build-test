import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useUserRole } from '../contexts/UserRoleContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage = () => {
  // Early return if not mounted to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/120x120/3B82F6/FFFFFF?text=AK');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    username: 'kemp-17',
    name: 'Ashley Kemp',
    email: 'mrashleykemp@gmail.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    timezone: 'Asia/Manila',
    businessName: 'Digital Marketing Solutions LLC',
    businessPartnerEmail: '',
    personalAssistantPassword: '',
    testimonial: '',
    calendarBookingLink: 'https://calendly.com/ashleykemp'
  });

  const [billingData, setBillingData] = useState({
    address: '123 Business Ave',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'United States'
  });

  const [payoutData, setPayoutData] = useState({
    method: 'bank',
    email: 'mrashleykemp@gmail.com',
    bankDetails: ''
  });

  // Get actual user role from context
  const { currentRole, roleDetails } = useUserRole();
  
  // Get theme context
  const { currentTheme, themeId } = useTheme();
  
  // Convert role to membership type for display logic
  const membershipType = currentRole === 'annual' ? 'annual' : 'monthly';
  const setMembershipType = (type: string) => {
    // In real implementation, this would trigger an upgrade process
    console.log('Membership type change requested:', type);
  };
  const [paymentCard, setPaymentCard] = useState({
    cardNumber: '**** **** **** 4532',
    expiryDate: '12/26',
    cardHolder: 'Ashley Kemp'
  });

  const [taxForms, setTaxForms] = useState({
    w9Uploaded: false,
    w8benUploaded: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Modal states
  const [showBillingCardModal, setShowBillingCardModal] = useState(false);
  const [showManageSubscriptionModal, setShowManageSubscriptionModal] = useState(false);
  const [showUpgradeConfirmModal, setShowUpgradeConfirmModal] = useState(false);
  const [showCancellationFlow, setShowCancellationFlow] = useState(false);
  const [cancellationStep, setCancellationStep] = useState(1);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showDownsellOffer, setShowDownsellOffer] = useState(false);
  const [showPauseAccountModal, setShowPauseAccountModal] = useState(false);
  const [showMonthlyUpgradeModal, setShowMonthlyUpgradeModal] = useState(false);
  
  // Cancellation flow data
  const [userProgress, setUserProgress] = useState({
    coursesCompleted: 3,
    totalCourses: 12,
    completionPercentage: 47,
    pendingCommissions: 2430,
    activeReferrals: 8,
    memberSince: 'March 15, 2024'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'billing', label: 'Billing Info', icon: '💳' },
    { id: 'membership', label: 'Membership', icon: '🏢' },
    { id: 'tax', label: 'Tax Details', icon: '📄' },
    { id: 'payout', label: 'Payout Info', icon: '💰' },
    { id: 'theme', label: 'Theme Settings', icon: '🎨' }
  ];

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
    setCurrentTime(new Date().toLocaleString());
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <>
        <Head>
          <title>Profile Settings - Online Empire</title>
          <meta name="description" content="Manage your profile settings, billing information, and account preferences" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Profile...</p>
          </div>
        </div>
      </>
    );
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (profileData.newPassword && profileData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      console.log('Saving profile data:', profileData);
      
      // Save profile data to localStorage for affiliate link generation
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileData', JSON.stringify(profileData));
      }
      
      // Show success message
      alert('Profile updated successfully! Your affiliate links will be updated with your new username.');
    }
  };

  const handleFileUpload = (type: 'w9' | 'w8ben') => {
    // Simulate file upload
    setTaxForms(prev => ({ ...prev, [`${type}Uploaded`]: true }));
    alert(`${type.toUpperCase()} form uploaded successfully!`);
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <div className="relative group">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-200 group-hover:shadow-xl"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=3B82F6&color=ffffff&size=120&bold=true`;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg transform scale-90 group-hover:scale-100"
            >
              <i className="fas fa-camera text-sm"></i>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>{profileData.name}</h2>
          <p className="transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>@{profileData.username}</p>
          <p className="text-sm mt-1 transition-colors duration-300" style={{ color: 'var(--color-primary)' }}>{profileData.email}</p>
        </div>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300"
                style={{ backgroundColor: 'var(--color-success)', color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <i className="fas fa-save"></i>
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300"
                style={{ backgroundColor: 'var(--color-text-muted)', color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              />
            </div>
            {isEditing && (
              <p className="text-xs text-blue-600 mt-1">
                <a href="#" className="hover:underline">Change Username</a>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="relative">
              <i className="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <div className="relative">
              <i className="fas fa-globe absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              >
                <option value="Asia/Manila">Asia/Manila</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current time: {isClient ? currentTime : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={profileData.currentPassword}
                onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                disabled={!isEditing}
                placeholder="Leave blank if unchanged"
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={profileData.newPassword}
                onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                disabled={!isEditing}
                placeholder="Leave blank if unchanged"
                className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.newPassword && <p className="text-red-600 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                disabled={!isEditing}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name/ABN 
              <span className="text-gray-500 text-xs">(appears on invoices)</span>
            </label>
            <div className="relative">
              <i className="fas fa-building absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={profileData.businessName}
                onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Partner's Email 
              <span className="text-gray-500 text-xs">(if applicable)</span>
            </label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                value={profileData.businessPartnerEmail}
                onChange={(e) => setProfileData({...profileData, businessPartnerEmail: e.target.value})}
                disabled={!isEditing}
                placeholder="Optional"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Booking Link</label>
            <div className="relative">
              <i className="fas fa-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="url"
                value={profileData.calendarBookingLink}
                onChange={(e) => setProfileData({...profileData, calendarBookingLink: e.target.value})}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
              />
            </div>
            {isClient && profileData.calendarBookingLink && (
              <a
                href={profileData.calendarBookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-1 inline-block"
              >
                View your booking page →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          My Testimonial 
          <span className="text-gray-500 text-xs cursor-help" title="Share your success story or experience with the platform">(what is this?)</span>
        </label>
        <textarea
          value={profileData.testimonial}
          onChange={(e) => setProfileData({...profileData, testimonial: e.target.value})}
          disabled={!isEditing}
          rows={4}
          placeholder="Share your success story or experience..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 resize-none transition-colors"
        />
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">Billing Information</h3>
        <p className="text-gray-600 mt-1">Update your billing address and payment information</p>
      </div>

      {/* Payment Card Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fas fa-credit-card text-blue-600"></i>
          Payment Method
        </h4>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
            <i className="fab fa-cc-visa text-white text-lg"></i>
          </div>
          <div>
            <p className="font-medium text-gray-900">{paymentCard.cardNumber}</p>
            <p className="text-sm text-gray-600">Expires {paymentCard.expiryDate} • {paymentCard.cardHolder}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowBillingCardModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <i className="fas fa-edit mr-2"></i>
          Update Card Details
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <input
            type="text"
            value={billingData.address}
            onChange={(e) => setBillingData({...billingData, address: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={billingData.city}
            onChange={(e) => setBillingData({...billingData, city: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Miami"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
          <input
            type="text"
            value={billingData.state}
            onChange={(e) => setBillingData({...billingData, state: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="FL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
          <input
            type="text"
            value={billingData.zipCode}
            onChange={(e) => setBillingData({...billingData, zipCode: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="33101"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            value={billingData.country}
            onChange={(e) => setBillingData({...billingData, country: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Philippines">Philippines</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert('Billing information saved successfully!')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Billing Information
        </button>
      </div>
    </div>
  );

  const renderMembershipTab = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Membership Details</h3>
            <p className="text-gray-600 mt-1">View and manage your subscription</p>
          </div>
          {/* Demo Toggle for Testing Different Membership Views */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium mb-2">Demo Toggle:</p>
            <button
              onClick={() => setMembershipType(membershipType === 'monthly' ? 'annual' : 'monthly')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                membershipType === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              {membershipType === 'monthly' ? '📅 Monthly' : '📆 Annual'} View
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-crown text-white text-2xl"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{roleDetails.name}</h4>
            <p className="text-gray-600">
              {membershipType === 'annual' ? 'Annual Subscription' : 
               currentRole === 'trial' ? '$1 Trial Access' :
               currentRole === 'downsell' ? 'Affiliate Access Plan' :
               currentRole === 'free' ? 'Free Account' :
               'Monthly Subscription'}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Next billing: {membershipType === 'monthly' ? 'September 18, 2025' : 'March 15, 2025'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-2">Plan Type</h5>
          <p className="text-gray-600">{roleDetails.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            {roleDetails.price === 0 ? 'Free' : 
             `$${roleDetails.price}${roleDetails.billing !== 'one-time' ? `/${roleDetails.billing}` : ''}`}
          </p>
          {membershipType === 'annual' && (
            <p className="text-xs text-green-600 font-medium mt-1">
              <i className="fas fa-piggy-bank mr-1"></i>
              Save $388 per year vs monthly
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-2">Member Since</h5>
          <p className="text-gray-600">March 15, 2024</p>
          <p className="text-sm text-gray-500 mt-1">5 months active</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-2">Status</h5>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
          <div>
            <h6 className="font-medium text-yellow-800">Membership Benefits</h6>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Access to all premium courses and masterclasses</li>
              <li>• 25% commission on referral sales</li>
              <li>• Priority customer support</li>
              <li>• Monthly live training sessions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upgrade Options for Non-Annual Users */}
      {currentRole !== 'annual' && (
        <div className="space-y-6">
          {/* For Monthly Members - Focused Annual Upgrade */}
          {currentRole === 'monthly' && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
                  🔥 EXCLUSIVE OFFER - SAVE $388
                </div>
              </div>
              
              <div className="text-center pt-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-crown text-3xl text-green-600"></i>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Upgrade to Annual & Save Big!</h3>
                <p className="text-lg text-gray-700 mb-8">You're already getting great value with monthly. Get even more with annual!</p>
                
                {/* Savings Comparison */}
                <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Your Current Plan</div>
                      <div className="text-2xl font-bold text-gray-900">$99/month</div>
                      <div className="text-sm text-gray-500">$1,188 per year</div>
                    </div>
                    <div className="text-center border-l border-gray-200 pl-8">
                      <div className="text-sm text-green-600 mb-2">Annual Plan</div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="text-lg text-gray-400 line-through">$1,188</div>
                        <div className="text-2xl font-bold text-green-600">$799</div>
                      </div>
                      <div className="text-sm text-green-600 font-semibold">Save $388 per year!</div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Benefits for Annual */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-piggy-bank text-green-600"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">67% Savings</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-headset text-green-600"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Priority Support</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-gift text-green-600"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Exclusive Perks</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-lock text-green-600"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Price Lock</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowUpgradeConfirmModal(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl text-lg"
                >
                  🚀 Upgrade to Annual - Save $388 Now!
                </button>
                
                <p className="text-sm text-gray-600 mt-4">
                  ✨ Limited time offer • 30-day money-back guarantee • Instant upgrade
                </p>
              </div>
            </div>
          )}

          {/* For Trial/Downsell Members - Dual Options */}
          {currentRole !== 'monthly' && (
            <>
              {/* Special Upgrade Banner */}
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">🚀 Ready to Scale Your Success?</h3>
                      <p className="text-blue-100 text-lg">Unlock premium features and maximize your earning potential</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        LIMITED TIME
                      </div>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-book-open text-xl"></i>
                      </div>
                      <p className="text-sm font-medium">All Premium Courses</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-users text-xl"></i>
                      </div>
                      <p className="text-sm font-medium">Expert Directory</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-chart-line text-xl"></i>
                      </div>
                      <p className="text-sm font-medium">Advanced Analytics</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-headset text-xl"></i>
                      </div>
                      <p className="text-sm font-medium">Priority Support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Option */}
                <div className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-alt text-2xl text-blue-600"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Monthly Membership</h4>
                    <p className="text-gray-600">Full access, pay monthly</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">$99</div>
                    <div className="text-gray-600">per month</div>
                    <div className="text-sm text-gray-500">No commitment • Cancel anytime</div>
                  </div>
                  
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      All premium courses & content
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      25% affiliate commissions
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      Expert directory access
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      Advanced statistics & leads
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => setShowMonthlyUpgradeModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Upgrade to Monthly
                  </button>
                </div>

                {/* Annual Option - Best Value */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:border-green-400 rounded-2xl p-6 relative transition-all duration-300 hover:shadow-xl">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      BEST VALUE - SAVE $388
                    </div>
                  </div>
                  
                  <div className="text-center mb-6 pt-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-crown text-2xl text-green-600"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Annual Membership</h4>
                    <p className="text-gray-600">Save big with yearly billing</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="text-lg text-gray-500 line-through">$1,188</div>
                      <div className="text-4xl font-bold text-green-600">$799</div>
                    </div>
                    <div className="text-green-600 font-semibold">$66.58 per month</div>
                    <div className="text-sm text-gray-600">Billed annually • Best deal</div>
                  </div>
                  
                  <div className="bg-green-100 rounded-lg p-3 mb-6">
                    <div className="flex items-center justify-center text-green-800">
                      <i className="fas fa-piggy-bank mr-2"></i>
                      <span className="font-semibold">You save $388 per year!</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      Everything in Monthly plan
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      <strong>67% savings</strong> vs monthly
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      Priority customer support
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      Exclusive annual member perks
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => setShowUpgradeConfirmModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    🔥 Upgrade to Annual - Save $388
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button 
          onClick={() => setShowManageSubscriptionModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Manage Subscription
        </button>
        <button 
          onClick={() => alert('Downloading latest invoice...')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <i className="fas fa-download mr-2"></i>
          Download Invoice
        </button>
      </div>
    </div>
  );

  const renderTaxTab = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">Submit Your Tax Form Online</h3>
        <p className="text-gray-600 mt-1">To ensure an uninterrupted flow in your commission payments...</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Please choose and submit one of the two electronic forms listed below. For assistance in choosing the required form for your business, please contact a tax advisor or visit the IRS website at{' '}
          <a href="https://www.irs.gov" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
            www.irs.gov
          </a>
        </p>
      </div>

      <div className="space-y-8">
        {/* US Persons */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">1</span>
            US Persons (if you are a US citizen)
          </h4>
          
          <p className="text-gray-600 mb-4">
            Choose <strong>IRS Form W-9</strong> (Request for Taxpayer Identification and Certification).
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => window.open('https://www.irs.gov/pub/irs-pdf/fw9.pdf', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-download"></i>
              Download W-9
            </button>
            <button
              onClick={() => handleFileUpload('w9')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-upload"></i>
              Upload W-9
            </button>
            {taxForms.w9Uploaded && (
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <i className="fas fa-check text-green-600"></i>
                <span className="text-green-700 font-medium text-sm">W-9 Submitted</span>
              </div>
            )}
          </div>
        </div>

        {/* Non-US Persons */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">2</span>
            Non-US Persons (if you are not a US citizen)
          </h4>
          
          <p className="text-gray-600 mb-4">
            Choose <strong>IRS Form W-8BEN</strong> (Certificate of Foreign Status of Beneficial Owner for United States Tax Withholding)
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => window.open('https://www.irs.gov/pub/irs-pdf/fw8ben.pdf', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-download"></i>
              Download W-8BEN
            </button>
            <button
              onClick={() => handleFileUpload('w8ben')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-upload"></i>
              Upload W-8BEN
            </button>
            {taxForms.w8benUploaded && (
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <i className="fas fa-check text-green-600"></i>
                <span className="text-green-700 font-medium text-sm">W-8BEN Submitted</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <i className="fas fa-exclamation-triangle text-amber-600 flex-shrink-0 mt-0.5"></i>
          <p className="text-amber-800 text-sm">
            <strong>Important:</strong> Your information will be kept on file and only provided to the IRS on request. It is your responsibility to report your earnings within your own country.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPayoutTab = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">Get Paid Your Commissions</h3>
        <p className="text-gray-600 mt-1">Choose your preferred payout method</p>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex gap-3">
          <i className="fas fa-flag-usa text-red-600 flex-shrink-0 mt-0.5"></i>
          <p className="text-red-800 text-sm">
            <strong>USA Members Only:</strong> Please be advised that it is mandatory to complete a W9 form in the tax details tab in order to receive commissions as an affiliate.
          </p>
        </div>
      </div>

      {/* Payment Options Information - Not Clickable */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <i className="fas fa-info-circle text-blue-600"></i>
          <h4 className="font-semibold text-blue-900">Payment Options & Fees</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-university text-gray-600 w-5"></i>
              <div>
                <p className="font-medium text-gray-900">Bank Transfer</p>
                <p className="text-gray-600 text-sm">Direct deposit via Wise.com</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              0% Fees
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fab fa-paypal text-gray-600 w-5"></i>
              <div>
                <p className="font-medium text-gray-900">PayPal</p>
                <p className="text-gray-600 text-sm">Standard PayPal transfer</p>
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              2.9% + $0.30
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm">
            <i className="fas fa-lightbulb mr-2"></i>
            <strong>Recommendation:</strong> Bank transfer offers 0% fees and is the most cost-effective option.
          </p>
        </div>
      </div>

      {/* Payout Method Selection */}
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <input
              type="radio"
              id="bank"
              name="payoutMethod"
              value="bank"
              checked={payoutData.method === 'bank'}
              onChange={(e) => setPayoutData({...payoutData, method: e.target.value})}
              className="h-4 w-4 text-blue-600 mt-1"
            />
            <div className="flex-1">
              <label htmlFor="bank" className="font-medium text-gray-900 flex items-center gap-2">
                <i className="fas fa-university text-blue-600"></i>
                Bank Transfer 
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Recommended</span>
              </label>
              
              <div className="mt-3 text-gray-600 text-sm space-y-2">
                <p>We pay out affiliate commissions direct to your bank account using <a href="https://wise.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">wise.com</a>.</p>
                <p>Enter your best email below and each month you'll receive a notification email.</p>
                <p>Press "Complete your transfer", add your banking details, and collect your commissions direct to your bank.</p>
              </div>
              
              {payoutData.method === 'bank' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email for notifications:</label>
                  <input
                    type="email"
                    value={payoutData.email}
                    onChange={(e) => setPayoutData({...payoutData, email: e.target.value})}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <input
              type="radio"
              id="paypal"
              name="payoutMethod"
              value="paypal"
              checked={payoutData.method === 'paypal'}
              onChange={(e) => setPayoutData({...payoutData, method: e.target.value})}
              className="h-4 w-4 text-blue-600 mt-1"
            />
            <div className="flex-1">
              <label htmlFor="paypal" className="font-medium text-gray-900 flex items-center gap-2">
                <i className="fab fa-paypal text-blue-600"></i>
                PayPal
              </label>
              
              <p className="text-gray-600 text-sm mt-2">
                Receive payments via PayPal. Note: PayPal charges a standard transaction fee of 2.9% + $0.30 per transaction (deducted automatically).
              </p>
              
              {payoutData.method === 'paypal' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email:</label>
                  <input
                    type="email"
                    value={payoutData.email}
                    onChange={(e) => setPayoutData({...payoutData, email: e.target.value})}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your-paypal@email.com"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert(`Payout method set to ${payoutData.method === 'bank' ? 'Bank Transfer' : 'PayPal'} successfully!`)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <i className="fas fa-save"></i>
          Save Payout Method
        </button>
      </div>
    </div>
  );

  const renderThemeTab = () => (
    <div className="space-y-8">
      <div className="border-b pb-4 transition-colors duration-300" style={{ borderColor: 'var(--color-divider)' }}>
        <h3 className="text-xl font-semibold transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
          Dashboard Theme Settings
        </h3>
        <p className="mt-1 transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>
          Customize your dashboard appearance with professionally designed themes
        </p>
      </div>

      {/* Current Theme Display */}
      <div className="rounded-lg border p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
            Current Theme
          </h4>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentTheme.colors.background, borderColor: 'var(--color-border)' }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentTheme.colors.primary, borderColor: 'var(--color-border)' }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentTheme.colors.cardBackground, borderColor: 'var(--color-border)' }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
              {currentTheme.name}
            </h5>
            <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>
              {currentTheme.description}
            </p>
          </div>
          <div className="text-xs px-3 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            Active
          </div>
        </div>
      </div>

      {/* Theme Selection Grid */}
      <div>
        <h4 className="text-lg font-medium mb-4 transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
          Choose Your Theme
        </h4>
        <ThemeSelector variant="grid" />
      </div>

      {/* Theme Features */}
      <div className="rounded-lg border p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <h4 className="text-lg font-medium mb-4 flex items-center transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
          <span className="mr-2">✨</span>
          Theme Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)20' }}>
              <span className="text-sm">🎨</span>
            </div>
            <div>
              <h5 className="font-medium transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
                Professional Design
              </h5>
              <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                7 expertly crafted themes for different preferences and use cases
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)20' }}>
              <span className="text-sm">⚡</span>
            </div>
            <div>
              <h5 className="font-medium transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
                Instant Switching
              </h5>
              <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                Change themes instantly with smooth transitions and automatic saving
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)20' }}>
              <span className="text-sm">💾</span>
            </div>
            <div>
              <h5 className="font-medium transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
                Persistent Settings
              </h5>
              <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                Your theme preference is saved across sessions and devices
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)20' }}>
              <span className="text-sm">📱</span>
            </div>
            <div>
              <h5 className="font-medium transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
                Responsive Design
              </h5>
              <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                All themes are optimized for desktop, tablet, and mobile devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Info */}
      <div className="rounded-lg border p-4 transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)10', borderColor: 'var(--color-primary)30' }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <span className="text-sm">💡</span>
          </div>
          <div>
            <h5 className="font-medium" style={{ color: 'var(--color-primary)' }}>
              Quick Theme Access
            </h5>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You can also change themes quickly from the header dropdown or your profile menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Components
  const renderBillingCardModal = () => {
    if (!showBillingCardModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Update Payment Card</h3>
            <button
              onClick={() => setShowBillingCardModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="Ashley Kemp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowBillingCardModal(false);
                  alert('💳 Payment card updated successfully!');
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update Card
              </button>
              <button
                type="button"
                onClick={() => setShowBillingCardModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderManageSubscriptionModal = () => {
    if (!showManageSubscriptionModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Manage Subscription</h3>
            <button
              onClick={() => setShowManageSubscriptionModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Current Plan</h4>
              <p className="text-gray-700">{roleDetails.name}</p>
              <p className="text-sm text-gray-600">
                {roleDetails.price === 0 ? 'Free' : 
                 `$${roleDetails.price}${roleDetails.billing !== 'one-time' ? `/${roleDetails.billing}` : ''}`}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowManageSubscriptionModal(false);
                  setShowBillingCardModal(true);
                }}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-credit-card text-blue-600"></i>
                  <span className="font-medium text-gray-900">Update Payment Method</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>

              {currentRole !== 'annual' && (
                <button
                  onClick={() => {
                    setShowManageSubscriptionModal(false);
                    setShowUpgradeConfirmModal(true);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-arrow-up text-green-600"></i>
                    <span className="font-medium text-green-800">Upgrade to Annual</span>
                  </div>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Save $388</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowManageSubscriptionModal(false);
                  setShowCancellationFlow(true);
                  setCancellationStep(1);
                  setCancellationReason('');
                }}
                className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-times text-red-600"></i>
                  <span className="font-medium text-red-700">Cancel Subscription</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUpgradeConfirmModal = () => {
    if (!showUpgradeConfirmModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Upgrade to Annual</h3>
            <button
              onClick={() => setShowUpgradeConfirmModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Upgrade Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">🔥 Special Offer</h4>
              <p className="text-gray-700 mb-4">Upgrade to Annual and save big!</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-lg font-bold text-gray-900">
                    {currentRole === 'downsell' ? '$37 one-time' : 
                     currentRole === 'monthly' ? '$99/month' : 
                     currentRole === 'trial' ? '$1 trial' : 'Free'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentRole === 'monthly' ? '$1,188/year' : 
                     currentRole === 'downsell' ? 'Lite Access' : 
                     currentRole === 'trial' ? '7-day trial' : 'Basic access'}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                  <p className="text-sm text-blue-600">Annual</p>
                  <p className="text-lg font-bold text-blue-600">$799/year</p>
                  <p className="text-xs text-green-600 font-semibold">
                    {currentRole === 'monthly' ? 'Save $388!' : 
                     currentRole === 'downsell' ? 'Save $999!' : 
                     'Best Value!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">Payment Method</h5>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                    <i className="fab fa-cc-visa text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{paymentCard.cardNumber}</p>
                    <p className="text-sm text-gray-600">Expires {paymentCard.expiryDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUpgradeConfirmModal(false);
                    setShowBillingCardModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle text-blue-600 mt-0.5 text-sm"></i>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="space-y-1 text-xs">
                  <li>• You'll be charged $799 today</li>
                  <li>• {currentRole === 'monthly' ? 'Your monthly billing will be cancelled' : 'Your current plan will be upgraded'}</li>
                  <li>• You'll save {currentRole === 'monthly' ? '$388' : currentRole === 'downsell' ? '$999' : '$388'} compared to monthly billing</li>
                  <li>• Your annual plan starts immediately</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowUpgradeConfirmModal(false);
                alert('🎉 Congratulations! You\'ve successfully upgraded to Annual membership and saved $388!');
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              Confirm Upgrade - $799
            </button>
            <button
              onClick={() => setShowUpgradeConfirmModal(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCancellationReasonSelect = (reason: string) => {
    setCancellationReason(reason);
    
    // Different flows based on reason
    if (reason === 'too_expensive' || reason === 'not_using') {
      setCancellationStep(3); // Skip to downsell offer
    } else if (reason === 'pause_needed') {
      setShowPauseAccountModal(true);
      setShowCancellationFlow(false);
    } else {
      setCancellationStep(2); // Go to progress loss warning
    }
  };

  const renderCancellationFlow = () => {
    if (!showCancellationFlow) return null;

    // Step 1: Reason Selection
    if (cancellationStep === 1) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-question-circle text-yellow-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">We're Sorry to See You Go!</h3>
              <p className="text-gray-600">Help us understand why you want to cancel</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { id: 'too_expensive', label: 'Too expensive', icon: 'fas fa-dollar-sign' },
                { id: 'not_using', label: 'Not using it enough', icon: 'fas fa-clock' },
                { id: 'technical_issues', label: 'Technical issues', icon: 'fas fa-bug' },
                { id: 'pause_needed', label: 'Need to pause temporarily', icon: 'fas fa-pause' },
                { id: 'found_alternative', label: 'Found alternative solution', icon: 'fas fa-exchange-alt' },
                { id: 'other', label: 'Other reason', icon: 'fas fa-ellipsis-h' }
              ].map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => handleCancellationReasonSelect(reason.id)}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mr-4 transition-colors">
                    <i className={`${reason.icon} text-gray-600 group-hover:text-blue-600`}></i>
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-blue-900">{reason.label}</span>
                  <i className="fas fa-chevron-right text-gray-400 ml-auto group-hover:text-blue-600"></i>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCancellationFlow(false)}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Never Mind, Keep My Account
            </button>
          </div>
        </div>
      );
    }

    // Step 2: Progress Loss Warning
    if (cancellationStep === 2) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wait! You'll Lose All This Progress</h3>
              <p className="text-gray-600">Are you sure you want to lose everything you've built?</p>
            </div>

            {/* Progress Stats */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-red-900 mb-4 flex items-center">
                <i className="fas fa-chart-line mr-2"></i>
                Your Progress Since {userProgress.memberSince}
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{userProgress.coursesCompleted}/{userProgress.totalCourses}</div>
                  <div className="text-sm text-gray-600">Courses Started</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{userProgress.completionPercentage}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="font-medium text-gray-900">💰 Pending Commissions</span>
                  <span className="font-bold text-green-600">${userProgress.pendingCommissions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="font-medium text-gray-900">👥 Active Referrals</span>
                  <span className="font-bold text-blue-600">{userProgress.activeReferrals}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="font-medium text-gray-900">🎯 Expert Directory Access</span>
                  <span className="font-bold text-purple-600">Premium</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-lightbulb text-green-600"></i>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">💡 Smart Alternative</h5>
                  <p className="text-sm text-gray-600">Keep your progress with a budget-friendly option</p>
                </div>
              </div>
              <button
                onClick={() => setCancellationStep(3)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                🎯 See Special Offer - Keep Your Progress!
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancellationStep(4)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
              >
                💔 Still Cancel
              </button>
              <button
                onClick={() => setShowCancellationFlow(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium"
              >
                ✨ Keep Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 3: Downsell Offer
    if (cancellationStep === 3) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-gift text-2xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Exclusive Last-Chance Offer!</h3>
              <p className="text-gray-600">Keep everything you've built for a fraction of the cost</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-lg text-gray-500 line-through">${membershipType === 'monthly' ? '99/month' : '799/year'}</span>
                  <div className="text-4xl font-bold text-green-600">$37</div>
                </div>
                <div className="text-green-700 font-semibold mb-2">One-Time Payment • Lifetime Access</div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold inline-block animate-pulse">
                  🔥 SAVE {membershipType === 'monthly' ? '96%' : '95%'} - LIMITED TIME
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-4">
                <h5 className="font-bold text-gray-900 mb-3">🎯 Lite Access Includes:</h5>
                <div className="space-y-2">
                  {[
                    '✅ Keep ALL your course progress',
                    '✅ Keep your $' + userProgress.pendingCommissions.toLocaleString() + ' pending commissions',
                    '✅ Affiliate portal access',
                    '✅ Commission tracking & payouts',
                    '✅ Daily Method course access',
                    '✅ Basic support'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center text-sm text-green-700">
                <p className="mb-2">💝 <strong>Bonus:</strong> No monthly fees ever again!</p>
                <p>🚀 <strong>Perfect for:</strong> Keeping progress while saving money</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => {
                  setShowCancellationFlow(false);
                  alert('🎉 Success! Welcome to Lite Access! Your progress is saved and you\'ll never be charged monthly fees again. Check your email for confirmation.');
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-bold transition-all transform hover:-translate-y-1 hover:shadow-xl"
              >
                🚀 Yes! Switch to Lite Access - $37
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancellationStep(4)}
                className="flex-1 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
              >
                No thanks, still cancel
              </button>
              <button
                onClick={() => setShowCancellationFlow(false)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Keep full membership
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              💳 Secure payment • 30-day money-back guarantee • Instant access
            </p>
          </div>
        </div>
      );
    }

    // Step 4: Final Confirmation
    if (cancellationStep === 4) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart-broken text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Final Confirmation</h3>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-red-900 mb-3">⚠️ You will permanently lose:</h4>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• All {userProgress.coursesCompleted} course progress ({userProgress.completionPercentage}% complete)</li>
                <li>• ${userProgress.pendingCommissions.toLocaleString()} in pending commissions</li>
                <li>• {userProgress.activeReferrals} active referral connections</li>
                <li>• Expert directory and premium support</li>
                <li>• Your member status since {userProgress.memberSince}</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-info-circle text-blue-600"></i>
                <span className="font-semibold text-blue-900">Account Access:</span>
              </div>
              <p className="text-sm text-blue-800">
                Your access will end in 24 hours. You can reactivate your account within 30 days to restore your progress.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancellationFlow(false);
                  alert('💔 Your account has been scheduled for cancellation. Access ends in 24 hours. We\'ll send you a confirmation email with reactivation options.');
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
              >
                💔 Yes, Cancel Forever
              </button>
              <button
                onClick={() => setCancellationStep(3)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium"
              >
                💡 Try $37 Option
              </button>
            </div>

            <button
              onClick={() => setShowCancellationFlow(false)}
              className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              ← Go back to my account
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderMonthlyUpgradeModal = () => {
    if (!showMonthlyUpgradeModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Upgrade to Monthly</h3>
            <button
              onClick={() => setShowMonthlyUpgradeModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Upgrade Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-white text-2xl"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">🚀 Upgrade to Full Access</h4>
              <p className="text-gray-700 mb-4">Get unlimited access to all courses and features!</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-lg font-bold text-gray-900">
                    {currentRole === 'downsell' ? '$37 one-time' : 
                     currentRole === 'trial' ? '$1 trial' : 'Free'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentRole === 'downsell' ? 'Lite Access' : 
                     currentRole === 'trial' ? '7-day trial' : 'Basic access'}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                  <p className="text-sm text-blue-600">Monthly</p>
                  <p className="text-lg font-bold text-blue-600">$99/month</p>
                  <p className="text-xs text-green-600 font-semibold">Full Access!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-green-900 mb-3">✨ What You'll Get:</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <i className="fas fa-check text-green-600 mr-3"></i>
                <span className="text-green-800">All premium courses & masterclasses</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-600 mr-3"></i>
                <span className="text-green-800">Expert directory access</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-600 mr-3"></i>
                <span className="text-green-800">Advanced statistics & lead management</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-600 mr-3"></i>
                <span className="text-green-800">25% affiliate commissions</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-600 mr-3"></i>
                <span className="text-green-800">Priority customer support</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">Payment Method</h5>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                    <i className="fab fa-cc-visa text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{paymentCard.cardNumber}</p>
                    <p className="text-sm text-gray-600">Expires {paymentCard.expiryDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowMonthlyUpgradeModal(false);
                    setShowBillingCardModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle text-blue-600 mt-0.5 text-sm"></i>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="space-y-1 text-xs">
                  <li>• You'll be charged $99 today</li>
                  <li>• Your plan will be upgraded immediately</li>
                  <li>• Billing cycle starts today</li>
                  <li>• Cancel anytime with one click</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowMonthlyUpgradeModal(false);
                alert('🎉 Congratulations! You\'ve successfully upgraded to Monthly membership! You now have full access to all courses and features.');
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              Confirm Upgrade - $99/month
            </button>
            <button
              onClick={() => setShowMonthlyUpgradeModal(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPauseAccountModal = () => {
    if (!showPauseAccountModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-pause text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pause Your Account</h3>
            <p className="text-gray-600">Take a break and come back when you're ready</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">🛡️ Account Pause Benefits:</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>✅ Keep all your progress and data</li>
              <li>✅ Pause billing temporarily (up to 3 months)</li>
              <li>✅ Reactivate anytime with one click</li>
              <li>✅ Keep your member benefits when you return</li>
            </ul>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600 font-medium">Choose pause duration:</p>
            {[
              { duration: '1 month', description: 'Perfect for short breaks' },
              { duration: '2 months', description: 'Most popular option' },
              { duration: '3 months', description: 'Maximum pause period' }
            ].map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowPauseAccountModal(false);
                  alert(`🎉 Account paused for ${option.duration}! You'll receive an email with reactivation instructions.`);
                }}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
              >
                <div className="font-medium text-gray-900">{option.duration}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPauseAccountModal(false)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowPauseAccountModal(false);
                setShowCancellationFlow(true);
                setCancellationStep(1);
              }}
              className="flex-1 py-3 text-red-600 hover:text-red-700 rounded-lg transition-colors font-medium text-sm"
            >
              No, cancel instead
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            💡 Tip: Pausing is better than cancelling - you keep everything!
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Profile Settings - Online Empire</title>
        <meta name="description" content="Manage your profile settings, billing information, and account preferences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout
        user={{
          id: 1,
          name: profileData.name,
          avatarUrl: profileImage
        }}
        notifications={[]}
        onClearNotifications={() => {}}
        onFeedbackClick={() => alert('Feedback feature coming soon!')}
      >
        <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
          {/* Header */}
          <div className="border-b transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>Profile Settings</h1>
              <p className="mt-1 transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>Manage your account settings and preferences</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:w-64 flex-shrink-0">
                <nav className="space-y-1 sticky top-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-300"
                      style={{
                        backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === tab.id ? 'white' : 'var(--color-text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== tab.id) {
                          e.currentTarget.style.backgroundColor = 'var(--color-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="rounded-lg shadow-sm border p-8 transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                  {activeTab === 'profile' && renderProfileTab()}
                  {activeTab === 'billing' && renderBillingTab()}
                  {activeTab === 'membership' && renderMembershipTab()}
                  {activeTab === 'tax' && renderTaxTab()}
                  {activeTab === 'payout' && renderPayoutTab()}
                  {activeTab === 'theme' && renderThemeTab()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {renderBillingCardModal()}
        {renderManageSubscriptionModal()}
        {renderUpgradeConfirmModal()}
        {renderCancellationFlow()}
        {renderPauseAccountModal()}
        {renderMonthlyUpgradeModal()}
      </AppLayout>
    </>
  );
};

export default ProfilePage;