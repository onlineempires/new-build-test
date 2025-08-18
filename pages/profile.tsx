import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';

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

  const [membershipType, setMembershipType] = useState('monthly'); // or 'annual'
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'billing', label: 'Billing Info', icon: '💳' },
    { id: 'membership', label: 'Membership', icon: '🏢' },
    { id: 'tax', label: 'Tax Details', icon: '📄' },
    { id: 'payout', label: 'Payout Info', icon: '💰' }
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
      // Show success message
      alert('Profile updated successfully!');
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
          <h2 className="text-3xl font-bold text-gray-900">{profileData.name}</h2>
          <p className="text-gray-600">@{profileData.username}</p>
          <p className="text-blue-600 text-sm mt-1">{profileData.email}</p>
        </div>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-save"></i>
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
          onClick={() => alert('Card update functionality would open a secure payment form')}
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
        <h3 className="text-xl font-semibold text-gray-900">Membership Details</h3>
        <p className="text-gray-600 mt-1">View and manage your subscription</p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-crown text-white text-2xl"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Online Empire Member</h4>
            <p className="text-gray-600">Active Subscription</p>
            <p className="text-sm text-blue-600 font-medium">
              Next billing: {membershipType === 'monthly' ? 'September 18, 2025' : 'March 15, 2025'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-2">Plan Type</h5>
          <p className="text-gray-600">{membershipType === 'monthly' ? 'Monthly Membership' : 'Annual Membership'}</p>
          <p className="text-sm text-gray-500 mt-1">{membershipType === 'monthly' ? '$99/month' : '$990/year'}</p>
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

      {/* Upgrade Option for Monthly Users */}
      {membershipType === 'monthly' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-star text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Upgrade to Annual Membership</h4>
              <p className="text-gray-700 mb-3">Save $198 per year with our annual plan!</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Monthly</p>
                  <p className="text-lg font-bold text-gray-900">$99/month</p>
                  <p className="text-xs text-gray-500">$1,188/year</p>
                </div>
                <div className="flex-1 border-t border-dashed border-gray-300 relative">
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">vs</span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-600">Annual</p>
                  <p className="text-lg font-bold text-green-700">$82.50/month</p>
                  <p className="text-xs text-green-600">$990/year</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setMembershipType('annual');
                  alert('Upgrading to annual membership...');
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Upgrade to Annual
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button 
          onClick={() => alert('Redirecting to subscription management...')}
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
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
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
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  {activeTab === 'profile' && renderProfileTab()}
                  {activeTab === 'billing' && renderBillingTab()}
                  {activeTab === 'membership' && renderMembershipTab()}
                  {activeTab === 'tax' && renderTaxTab()}
                  {activeTab === 'payout' && renderPayoutTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default ProfilePage;