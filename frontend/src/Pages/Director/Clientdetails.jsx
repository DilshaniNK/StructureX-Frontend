import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, User, Lock, Link } from 'lucide-react'; // Import your icons
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';
import ClientDetailsDisplay from '../../Components/Director/ClientDetailsDisplay';

const Clientdetails = () => {
  const location = useLocation();
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    is_have_plan: '0',
    phone_number: '',
    type: '',
    address: '',
    design_link: ''
  });

  const [showSuccess,setShowSuccess] = useState(false);
  const[showError,setShowError] = useState(false);
  const [showForm, setShowForm] = useState(location.state?.showForm ?? false);
  const [registeredClient, setRegisteredClient] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...clientData,
      is_have_plan: Number(clientData.is_have_plan)
    };

    try {
      const res = await fetch('http://localhost:8086/api/v1/director/add_client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
        console.log(payload);
      if (res.ok) {
        
        setRegisteredClient(payload);
        setShowForm(false);
        setShowSuccess(true);
      } else {
        setShowError(true);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };


  if (showForm) {
    return (
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-[60px]">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Registration</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Type */}
            <div className="flex space-x-4">
              {['individual', 'company'].map(type => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={clientData.type === type}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${
                    clientData.type === type ? 'bg-black border-amber-500' : 'border-gray-300'
                  }`}>
                    {clientData.type === type && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-black rounded-l-md flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={clientData.email}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* First Name */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-black rounded-l-md flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="name"
                value={clientData.name}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md"
                required
              />
            </div>
            {/* address */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-black rounded-l-md flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={clientData.address}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-black rounded-l-md flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                name="phone_number"
                placeholder="Contact Number"
                value={clientData.phone_number}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Plan Option */}
            <div className="flex space-x-4">
              {[
                { label: 'With Plan', value: '1' },
                { label: 'Without Plan', value: '0' }
              ].map(option => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="is_have_plan"
                    value={option.value}
                    checked={clientData.is_have_plan === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${
                    clientData.is_have_plan === option.value ? 'bg-black border-amber-500' : 'border-gray-300'
                  }`}>
                    {clientData.is_have_plan === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>

            {clientData.is_have_plan === '1' && (
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-black rounded-l-md flex items-center justify-center">
                  <Link className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  name="design_link"
                  placeholder="Design link (e.g., Google Drive URL)"
                  value={clientData.design_link}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md"
                  required={clientData.is_have_plan === '1'}
                />
              </div>
            )}

    

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-semibold transition-colors"
              style={{ backgroundColor: '#FAAD00' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E09900'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FAAD00'}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  // After registration or by default
  return (
    
    <div className="p-6">
      <SuccessAlert
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title='Success !'
        message='Client Register Successfully ..'
      />
      <ErrorAlert
        show={showError}
        onClose={() => setShowError(false)}
        title='Error !'
        message='Failed to register client try again .. '
      />
      <h2 className="text-2xl font-bold mb-4">Client Details</h2>
      <ClientDetailsDisplay/>
    </div>
  );
};

export default Clientdetails;
