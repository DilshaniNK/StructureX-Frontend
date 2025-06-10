import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit3, Save, X, Camera, Shield, Award, Clock } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    role: 'Senior Designer',
    email: 'john.doe@construction.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'January 2022',
    department: 'Design & Planning',
    employeeId: 'EMP-2024-001',
    experience: '5 years',
    certifications: ['AutoCAD Certified', 'Project Management', 'Safety Training'],
    skills: ['AutoCAD', '3D Modeling', 'Project Planning', 'Quality Control']
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-32 rounded-t-lg relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-yellow-400 bg-transparent focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                )}
                
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-yellow-600 font-medium mt-1 border-b border-yellow-400 bg-transparent focus:outline-none"
                  />
                ) : (
                  <p className="text-yellow-600 font-medium">{profileData.role}</p>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-500">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">48</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2 text-yellow-500" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    {isEditing ? (
                      <input
                        type="email"
                        value={tempData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="font-medium text-gray-900 border-b border-yellow-400 bg-transparent focus:outline-none w-full"
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{profileData.email}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={tempData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="font-medium text-gray-900 border-b border-yellow-400 bg-transparent focus:outline-none w-full"
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{profileData.phone}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="font-medium text-gray-900 border-b border-yellow-400 bg-transparent focus:outline-none w-full"
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{profileData.location}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Briefcase size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Employee ID</div>
                    <div className="font-medium text-gray-900">{profileData.employeeId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase size={20} className="mr-2 text-yellow-500" />
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Join Date</div>
                    <div className="font-medium text-gray-900">{profileData.joinDate}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Department</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="font-medium text-gray-900 border-b border-yellow-400 bg-transparent focus:outline-none w-full"
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{profileData.department}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Experience</div>
                    <div className="font-medium text-gray-900">{profileData.experience}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award size={20} className="mr-2 text-yellow-500" />
                Certifications
              </h2>
              
              <div className="space-y-2">
                {profileData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}