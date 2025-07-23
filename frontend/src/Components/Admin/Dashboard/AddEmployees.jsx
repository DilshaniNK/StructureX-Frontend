import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Eye, EyeOff, Save, X, Upload, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    type: '',
    joined_date: '',
    confirmPassword: '',
    profileImage: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Backend API URL
  const API_BASE_URL = 'http://localhost:8086/api/v1';

  const employeeTypes = [
    'QS_Officer',
    'Senior_QS_Officer',
    'Project_Manager',
    'Site_Supervisor',
    'Legal_Officer',
    'Director',
    'Designer',
    'Financial_Officer'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.type) newErrors.type = 'Employee type is required';
    if (!formData.joined_date) {
      newErrors.joined_date = 'Join date is required';
    } else {
      const selectedDate = new Date(formData.joined_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates
      
      if (selectedDate > today) {
        newErrors.joined_date = 'Join date cannot be in the future';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("joined_date", formData.joined_date);
      formDataToSend.append("availability", true);
      if (formData.profileImage) {
        formDataToSend.append("profile_image", formData.profileImage);
      }

      const response = await axios.post(`${API_BASE_URL}/admin/add_employee`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Employee created successfully:', response.data);
      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          address: '',
          type: '',
          joined_date: '',
          password: '',
          confirmPassword: '',
          profileImage: null
        });
        setPreviewImage(null);
        fileInputRef.current.value = null;
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating employee:', error);

      let errorMessage = 'Failed to create employee';
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid request data. Please check all fields.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message;
      }

      alert(`Error creating employee: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const formatEmployeeType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-800 border border-green-600 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <div>
              <p className="text-green-200 font-medium">Employee Added Successfully!</p>
              <p className="text-green-300 text-sm">The employee has been created in the system.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Add New Employee</h1>
              <p className="text-gray-400">Fill in the details to add a new employee to the system</p>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors p-2"
              onClick={() => window.history.back()}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Image Upload */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Profile Information
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-700 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-500" />
                  )}
                </div>
                <label className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors flex items-center gap-2">
                  <Upload size={16} />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2 text-center">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.phone_number ? 'border-red-500' : 'border-gray-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone_number && <p className="text-red-400 text-sm mt-1">{errors.phone_number}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <MapPin size={20} />
              Address Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Complete Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="4"
                className={`w-full bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none`}
                placeholder="Enter complete address including street, city, state, and postal code"
              />
              {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Building size={20} />
              Employment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employee Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.type ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                >
                  <option value="">Select employee type</option>
                  {employeeTypes.map(type => (
                    <option key={type} value={type}>
                      {formatEmployeeType(type)}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Join Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="joined_date"
                    value={formData.joined_date}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.joined_date ? 'border-red-500' : 'border-gray-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.joined_date && <p className="text-red-400 text-sm mt-1">{errors.joined_date}</p>}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors border border-gray-600"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-900 rounded-lg font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Adding Employee...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Employee
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;