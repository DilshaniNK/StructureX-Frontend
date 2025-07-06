import React from 'react'
import '../../CSS/Director/director.css'
const SuccessAlert = ({ show, onClose, title = "Success!", message = "Action completed successfully"}) => {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 w-80 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Icon and close button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-green-800 mb-1">{title}</h4>
              <p className="text-xs text-green-700 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-green-400 hover:text-green-600 transition-colors ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Animated progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-200">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-600 animate-shrink-width shadow-sm"></div>
        </div>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent animate-pulse pointer-events-none"></div>
      </div>
    </div>
  );
  
}

export default SuccessAlert
