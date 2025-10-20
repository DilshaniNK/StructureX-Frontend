import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit3, Save, X, Camera, Shield, AlertCircle, Loader, CheckCircle } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [tempData, setTempData] = useState(null);

  // Get roleId from URL path
  const pathSegments = window.location.pathname.split('/');
  const roleId = pathSegments[pathSegments.length - 2];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8086/api/v1/user/profile/${roleId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data);
        setTempData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (roleId && roleId !== 'profile') {
      fetchProfileData();
    }
  }, [roleId]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = async () => {
    try {
      setProfileData(tempData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getProfileInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatType = (type) => {
    if (!type) return 'N/A';
    return type.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#FAAD00] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-red-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-[#FAAD00] text-gray-900 px-6 py-2 rounded-lg hover:bg-[#F5A000] transition-colors font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
            <p className="text-gray-600 font-medium">No profile data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 pt-14 pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#FAAD00] h-2"></div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left Side - Avatar and Basic Info */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-[#FAAD00] flex items-center justify-center shadow-md">
                    {profileData.profile_image_url ? (
                      <img 
                        src={profileData.profile_image_url} 
                        alt={profileData.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-[#FAAD00]">
                        {getProfileInitials(profileData.name)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-[#FAAD00] bg-transparent focus:outline-none mb-2 w-full"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                  )}
                  <p className="text-sm font-semibold text-[#FAAD00] mt-1">{formatType(profileData.type)}</p>
                  <p className="text-sm text-gray-600 mt-2">ID: {roleId}</p>
                </div>
              </div>

              {/* Right Side - Edit Buttons */}
              <div className="flex space-x-3 md:flex-col">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-[#FAAD00] text-gray-900 px-6 py-2 rounded-lg hover:bg-[#F5A000] transition-colors font-semibold flex items-center space-x-2 w-full justify-center"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2 flex-col md:flex-row">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 justify-center"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold flex items-center space-x-2 justify-center"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Account Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-[#FAAD00] rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FAAD00] text-gray-900 font-medium"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900 font-medium flex items-center">
                      <Mail size={16} className="text-[#FAAD00] mr-2" />
                      {profileData.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FAAD00] text-gray-900 font-medium"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900 font-medium flex items-center">
                      <Phone size={16} className="text-[#FAAD00] mr-2" />
                      {profileData.phone_number || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                  {isEditing ? (
                    <textarea
                      value={tempData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FAAD00] text-gray-900 font-medium resize-none"
                      rows="3"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900 font-medium flex items-start">
                      <MapPin size={16} className="text-[#FAAD00] mr-2 mt-0.5 flex-shrink-0" />
                      {profileData.address || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-[#FAAD00] rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Join Date */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Member Since</label>
                  <p className="mt-2 text-gray-900 font-semibold flex items-center">
                    <Calendar size={16} className="text-[#FAAD00] mr-2" />
                    {formatDate(profileData.joined_date)}
                  </p>
                </div>

                {/* Account Type */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Account Type</label>
                  <p className="mt-2 text-gray-900 font-semibold flex items-center">
                    <Briefcase size={16} className="text-[#FAAD00] mr-2" />
                    {formatType(profileData.type)}
                  </p>
                </div>

                {/* User ID */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</label>
                  <p className="mt-2 text-gray-900 font-semibold">{profileData.userId}</p>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                  <div className="mt-2 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-900 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* User Type Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Role Details</h3>
                <CheckCircle size={20} className="text-[#FAAD00]" />
              </div>
              <div className="bg-[#FAAD00]/10 p-4 rounded-lg border border-[#FAAD00]/20">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Current Role</p>
                <p className="text-lg font-bold text-gray-900">{formatType(profileData.type)}</p>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-900 font-medium">
                    {profileData.availability || 'Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Profile Completion</span>
                  <span className="text-[#FAAD00] font-bold">90%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Account Status</span>
                  <span className="text-green-600 font-bold">Active</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Member Days</span>
                  <span className="text-gray-900 font-bold">
                    {Math.floor((new Date() - new Date(profileData.joined_date)) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-[#FAAD00] text-gray-900 py-2 rounded-lg hover:bg-[#F5A000] transition-colors font-semibold">
                Change Password
              </button>
              <button className="w-full border-2 border-[#FAAD00] text-[#FAAD00] py-2 rounded-lg hover:bg-[#FAAD00]/5 transition-colors font-semibold">
                Download Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}