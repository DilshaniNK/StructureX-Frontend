import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Eye, EyeOff, Save, X, Upload, CheckCircle } from 'lucide-react';

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '', // Changed from 'contact' to match backend
    address: '',
    employeeType: '',
    joinDate: '',
    salary: '',
    password: '',
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
    'Architect',
    'Finance_Department',
    'System_Administrator'
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.employeeType) newErrors.employeeType = 'Employee type is required';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
    if (!formData.salary.trim()) newErrors.salary = 'Salary is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log('Submit button clicked!'); // Debug log
    console.log('Form data:', formData); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    try {
      // Prepare data for backend (exclude confirmPassword and profileImage for now)
      const employeeData = {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        employeeType: formData.employeeType,
        joinDate: formData.joinDate,
        salary: parseFloat(formData.salary), // Convert to number
        password: formData.password
      };

      console.log('Sending employee data:', employeeData);

      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Employee created successfully:', result);
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          contactNumber: '',
          address: '',
          employeeType: '',
          joinDate: '',
          salary: '',
          password: '',
          confirmPassword: '',
          profileImage: null
        });
        setPreviewImage(null);
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating employee:', error);
      alert(`Error creating employee: ${error.message}`);
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
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
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
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                    placeholder="Enter contact number"
                  />
                </div>
                {errors.contactNumber && <p className="text-red-400 text-sm mt-1">{errors.contactNumber}</p>}
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
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.employeeType ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                >
                  <option value="">Select employee type</option>
                  {employeeTypes.map(type => (
                    <option key={type} value={type}>
                      {formatEmployeeType(type)}
                    </option>
                  ))}
                </select>
                {errors.employeeType && <p className="text-red-400 text-sm mt-1">{errors.employeeType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Join Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.joinDate ? 'border-red-500' : 'border-gray-600'} rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.joinDate && <p className="text-red-400 text-sm mt-1">{errors.joinDate}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Salary *
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.salary ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                  placeholder="Enter salary amount"
                />
                {errors.salary && <p className="text-red-400 text-sm mt-1">{errors.salary}</p>}
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">
              Security Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
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