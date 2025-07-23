import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Save, X, CheckCircle, Truck } from 'lucide-react';

const AddSupplierForm = () => {
  const [formData, setFormData] = useState({
    supplier_name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    joined_date: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Backend API URL
  const API_BASE_URL = 'http://localhost:8086/api/v1';

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'text-green-400' },
    { value: 'inactive', label: 'Inactive', color: 'text-yellow-400' },
    { value: 'blocked', label: 'Blocked', color: 'text-red-400' }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier_name.trim()) newErrors.supplier_name = 'Supplier name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.status) newErrors.status = 'Status is required';
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
      const dataToSend = {
        supplier_name: formData.supplier_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        joined_date: formData.joined_date
      };

      const response = await fetch(`${API_BASE_URL}/admin/add_supplier`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Supplier created successfully:', responseData);
      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          supplier_name: '',
          email: '',
          phone: '',
          address: '',
          status: 'active',
          joined_date: ''
        });
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating supplier:', error);

      let errorMessage = 'Failed to create supplier';
      
      if (error.message.includes('HTTP error!')) {
        const status = error.message.match(/status: (\d+)/);
        if (status) {
          if (status[1] === '400') {
            errorMessage = 'Invalid request data. Please check all fields.';
          } else {
            errorMessage = `Server error: ${status[1]}`;
          }
        }
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message;
      }

      alert(`Error creating supplier: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-800 border border-green-600 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <div>
              <p className="text-green-200 font-medium">Supplier Added Successfully!</p>
              <p className="text-green-300 text-sm">The supplier has been created in the system.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Add New Supplier</h1>
              <p className="text-gray-400">Fill in the details to add a new supplier to the system</p>
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
          {/* Supplier Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Truck size={20} />
              Supplier Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="supplier_name"
                  value={formData.supplier_name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.supplier_name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                  placeholder="Enter supplier company name"
                />
                {errors.supplier_name && <p className="text-red-400 text-sm mt-1">{errors.supplier_name}</p>}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
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

          {/* Business Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Building size={20} />
              Business Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.status ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value} className={option.color}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.status === 'active' ? 'bg-green-400' : 
                    formData.status === 'inactive' ? 'bg-yellow-400' : 
                    'bg-red-400'
                  }`}></div>
                  <span className={`text-sm ${getStatusColor(formData.status)}`}>
                    {statusOptions.find(option => option.value === formData.status)?.label}
                  </span>
                </div>
                {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status}</p>}
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
                  Adding Supplier...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Supplier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierForm;