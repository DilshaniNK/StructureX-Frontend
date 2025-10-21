import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3,
  Camera,
  Briefcase,
  Award,
  Users,
  Loader,
  AlertCircle
} from 'lucide-react';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8086/api/v1/admin/get_admin');
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin details');
      }
      
      const data = await response.json();
      setAdminData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    console.log('Edit profile clicked - integrate with your backend');
  };

  const handlePhotoUpload = () => {
    console.log('Photo upload clicked - integrate with your backend');
  };

  // Split name into first and last name
  const getNameParts = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateYearsOfService = (joinDate) => {
    if (!joinDate) return '0';
    const joined = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - joined.getFullYear();
    const months = now.getMonth() - joined.getMonth();
    return months < 0 ? years - 1 : years;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#FAAD00] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Profile</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchAdminData}
            className="px-6 py-2 bg-[#FAAD00] text-black rounded-lg hover:bg-[#FFC746] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">No admin data available</p>
      </div>
    );
  }

  const { firstName, lastName } = getNameParts(adminData.name);
  const yearsOfService = calculateYearsOfService(adminData.joined_date);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Admin Profile</h1>
        <p className="text-gray-400">Manage your profile information and settings</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAAD00]/5 to-[#FFC746]/5"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FAAD00] to-[#FFC746] p-1">
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {adminData.profile_image_url ? (
                    <img 
                      src={`http://localhost:8086${adminData.profile_image_url}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${adminData.profile_image_url ? 'hidden' : ''}`}>
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
              <button 
                onClick={handlePhotoUpload}
                className="absolute bottom-2 right-2 w-10 h-10 bg-[#FAAD00] rounded-full flex items-center justify-center hover:bg-[#FFC746] transition-colors group-hover:scale-110 transform duration-200"
              >
                <Camera className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {adminData.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#FAAD00]" />
                      <span>System Administrator</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#FFC746]" />
                      <span>{adminData.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>{adminData.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Experienced system administrator managing organizational operations and overseeing the complete system infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#FAAD00]/10 to-[#FAAD00]/5 border border-[#FAAD00]/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FAAD00]/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#FAAD00]" />
              </div>
              <span className="text-2xl font-bold text-white">{yearsOfService}+</span>
            </div>
            <p className="text-gray-400 text-sm">Years of Service</p>
          </div>

          <div className="bg-gradient-to-br from-[#FFC746]/10 to-[#FFC746]/5 border border-[#FFC746]/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FFC746]/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#FFC746]" />
              </div>
              <span className="text-2xl font-bold text-white">Full</span>
            </div>
            <p className="text-gray-400 text-sm">Access Level</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">Active</span>
            </div>
            <p className="text-gray-400 text-sm">Account Status</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">#{adminData.userId}</span>
            </div>
            <p className="text-gray-400 text-sm">User ID</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#FAAD00]">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <p className="px-4 py-3 bg-gray-700/50 rounded-lg text-white">{firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <p className="px-4 py-3 bg-gray-700/50 rounded-lg text-white">{lastName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <p className="px-4 py-3 bg-gray-700/50 rounded-lg text-white">{adminData.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg text-white">
                  <Mail className="w-4 h-4 text-[#FFC746]" />
                  {adminData.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg text-white">
                  <Phone className="w-4 h-4 text-[#FFC746]" />
                  {adminData.phone_number}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg text-white">
                  <MapPin className="w-4 h-4 text-green-400" />
                  {adminData.address}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            {/* Work Details */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#FFC746]">
                <Briefcase className="w-5 h-5" />
                Professional Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#FAAD00]" />
                    <span className="text-gray-400">Role</span>
                  </div>
                  <span className="text-white font-medium">{adminData.type}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Joined Date</span>
                  </div>
                  <span className="text-white font-medium">{formatDate(adminData.joined_date)}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Years of Service</span>
                  </div>
                  <span className="text-white font-medium">{yearsOfService} years</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">Access Level</span>
                  </div>
                  <span className="px-3 py-1 bg-[#FAAD00]/10 text-[#FAAD00] rounded-full text-sm font-medium border border-[#FAAD00]/20">
                    Super Admin
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#FFC746]" />
                    <span className="text-gray-400">User ID</span>
                  </div>
                  <span className="text-white font-medium font-mono">#{adminData.userId}</span>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-green-400">
                <Shield className="w-5 h-5" />
                System Privileges
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Full System Access</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">User Management</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Project Management</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">System Configuration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;