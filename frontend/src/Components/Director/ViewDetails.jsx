import React, { useState } from 'react'

const ViewDetails = ({selectedProject, onClose, onUpdateProject}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatus, setEditedStatus] = useState(selectedProject?.status || '');
    
    if(!selectedProject) return null;

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedStatus(selectedProject.status);
    };

    const handleSaveEdit = () => {
        if (onUpdateProject) {
            onUpdateProject({
                ...selectedProject,
                status: editedStatus
            });
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedStatus(selectedProject.status);
        setIsEditing(false);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'ongoing': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'finished': return 'text-green-600 bg-green-50 border-green-200';
            case 'terminate': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const statusOptions = [
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'finished', label: 'Finished' },
        { value: 'terminate', label: 'Terminate' }
    ];

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
                            <p className="text-blue-100 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                {selectedProject.location}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status and Progress Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Project Status</label>
                                {isEditing ? (
                                    <div className="mt-2 space-y-3">
                                        <select
                                            value={editedStatus}
                                            onChange={(e) => setEditedStatus(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`mt-2 px-4 py-2 rounded-lg border font-semibold text-center ${getStatusColor(selectedProject.status)}`}>
                                        {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Budget</label>
                                <div className="mt-2 text-2xl font-bold text-gray-900">{selectedProject.budget}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Progress</label>
                                    <span className="text-2xl font-bold text-gray-900">{selectedProject.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-300 ${
                                            selectedProject.progress === 100 ? 'bg-green-500' :
                                            selectedProject.progress >= 70 ? 'bg-blue-500' :
                                            selectedProject.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${selectedProject.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Team Information */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wide mb-3">Project Team</h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-blue-600 uppercase">Manager</span>
                                    <p className="font-semibold text-blue-900">{selectedProject.manager}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-blue-600 uppercase">Supervisor</span>
                                    <p className="font-semibold text-blue-900">{selectedProject.supervisor}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Information */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="text-sm font-medium text-green-800 uppercase tracking-wide mb-3">Timeline</h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-green-600 uppercase">Start Date</span>
                                    <p className="font-semibold text-green-900">
                                        {new Date(selectedProject.startDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-green-600 uppercase">End Date</span>
                                    <p className="font-semibold text-green-900">
                                        {new Date(selectedProject.endDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Project Statistics */}
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="text-sm font-medium text-yellow-800 uppercase tracking-wide mb-3">Details</h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-yellow-600 uppercase">Status</span>
                                    <p className="font-semibold text-yellow-900 capitalize">{selectedProject.status}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-yellow-600 uppercase">Progress</span>
                                    <p className="font-semibold text-yellow-900">{selectedProject.progress}% Complete</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            View Report
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Download
                        </button>
                        <button
                            onClick={handleEditClick}
                            disabled={isEditing}
                            className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
                                isEditing 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-yellow-500 text-black hover:bg-yellow-600'
                            }`}
                        >
                            {isEditing ? 'Editing...' : 'Edit Project'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewDetails