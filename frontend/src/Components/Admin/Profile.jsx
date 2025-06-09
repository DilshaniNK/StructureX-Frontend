import React from 'react';
import ProfileImg from "../../assets/ProfileImage.jpg";

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings, 
  Edit3,
  Camera,
  Briefcase,
  Award,
  Users,
  BarChart3,
  CheckCircle
} from 'lucide-react';

const AdminProfile = () => {
  // Sample admin data - replace with props or API data
  const adminData = {
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@company.com',
    phone: '+1 (555) 123-4567',
    position: 'System Administrator',
    department: 'IT Operations',
    location: 'New York, NY',
    joinDate: '2020-03-15',
    employeeId: 'EMP-001',
    accessLevel: 'Super Admin',
    bio: 'Experienced system administrator with over 8 years in IT operations and project management. Specialized in enterprise solutions and team leadership.',
    achievements: [
      'Led 50+ successful project implementations',
      'Reduced system downtime by 40%',
      'Managed team of 12 IT professionals',
      'Certified in multiple cloud platforms'
    ]
  };

  const stats = [
    { label: 'Projects Managed', value: '147', icon: Briefcase, color: '#FAAD00' },
    { label: 'Team Members', value: '12', icon: Users, color: '#FFC746' },
    { label: 'System Uptime', value: '99.8%', icon: BarChart3, color: '#10B981' },
    { label: 'Years Experience', value: '8+', icon: Award, color: '#3B82F6' }
  ];

  // Placeholder handlers - replace with your backend integration
  const handleEditClick = () => {
    console.log('Edit profile clicked - integrate with your backend');
  };

  const handlePhotoUpload = () => {
    console.log('Photo upload clicked - integrate with your backend');
  };

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
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAAD00]/5 to-[#FFC746]/5"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FAAD00] to-[#FFC746] p-1">
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img 
                        src={ProfileImg} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />                
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
                    {adminData.firstName} {adminData.lastName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#FAAD00]" />
                      <span>{adminData.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#FFC746]" />
                      <span>{adminData.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>{adminData.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Edit Button */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#FAAD00] text-[#FAAD00] rounded-lg hover:bg-[#FAAD00] hover:text-black transition-all duration-200 transform hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-300 leading-relaxed">{adminData.bio}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-[#FAAD00]/10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${stat.color}20`, border: `2px solid ${stat.color}` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <p className="px-4 py-3 bg-gray-700/50 rounded-lg text-white">{adminData.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <p className="px-4 py-3 bg-gray-700/50 rounded-lg text-white">{adminData.lastName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg text-white">
                  <Mail className="w-4 h-4 text-[#FFC746]" />
                  {adminData.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg text-white">
                  <Phone className="w-4 h-4 text-[#FFC746]" />
                  {adminData.phone}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <p className="px-4 py-3 bg-gray-700/50 rounded-lg text-white leading-relaxed">{adminData.bio}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-8">
            {/* Work Details */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#FFC746]">
                <Briefcase className="w-5 h-5" />
                Professional Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#FAAD00]" />
                    <span className="text-gray-300">Position</span>
                  </div>
                  <span className="text-white font-medium">{adminData.position}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#FFC746]" />
                    <span className="text-gray-300">Department</span>
                  </div>
                  <span className="text-white font-medium">{adminData.department}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Join Date</span>
                  </div>
                  <span className="text-white font-medium">{new Date(adminData.joinDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Access Level</span>
                  </div>
                  <span className="px-3 py-1 bg-[#FAAD00]/10 text-[#FAAD00] rounded-full text-sm font-medium border border-[#FAAD00]/20">
                    {adminData.accessLevel}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Employee ID</span>
                  </div>
                  <span className="text-white font-medium font-mono">{adminData.employeeId}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-green-400">
                <Award className="w-5 h-5" />
                Key Achievements
              </h3>
              
              <div className="space-y-3">
                {adminData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;