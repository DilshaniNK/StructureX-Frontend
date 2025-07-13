import React from 'react'
import '../../CSS/Director/director.css'

const ErrorAlert = ({show, onClose, title = "Error!", message = "Something went wrong"}) => {

 if (!show) return null;

  return (
    <div className="fixed top-6 right-6 w-80 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Icon and close button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-800 mb-1">{title}</h4>
              <p className="text-xs text-red-700 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Animated progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-200">
          <div className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-shrink-width shadow-sm"></div>
        </div>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent animate-pulse pointer-events-none"></div>
      </div>
    </div>
  )
}

export default ErrorAlert
