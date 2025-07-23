// src/pages/Unauthorized.jsx
import React from 'react';

const Unauthorized = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
              <svg 
                className="w-10 h-10 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-8V9m0 0V7m0 2h2m-2 0H10m12 3c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h1>
            <p className="text-red-100 text-sm">
              Error 403 - Unauthorized
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              You don't have permission to access this page
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              This page is restricted and requires proper authorization. 
              Please contact your administrator if you believe this is an error.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
              <button
                onClick={handleGoBack}
                className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Back
              </button>
              <button
                onClick={handleGoHome}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Homepage
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Need help? Contact support
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            If you continue to experience issues, please try logging out and back in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;