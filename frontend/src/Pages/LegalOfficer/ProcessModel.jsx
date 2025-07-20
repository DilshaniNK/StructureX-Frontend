import React, { useState } from 'react';
import { X, Plus, AlertCircle, Calendar, User } from 'lucide-react';

export default function ProcessModal({ projectId, onClose, user }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '',
    responsibleParty: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const commonProcesses = [
    'Land Ownership Verification',
    'Environmental Clearance',
    'Zoning Compliance Review',
    'Building Permit Application',
    'Fire Safety Clearance',
    'Utility Connections Approval',
    'Tax Assessment Review',
    'Legal Due Diligence',
    'Contract Review and Approval',
    'Regulatory Compliance Check'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Process name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.expectedEndDate) {
      newErrors.expectedEndDate = 'Expected end date is required';
    } else if (new Date(formData.expectedEndDate) <= new Date(formData.startDate)) {
      newErrors.expectedEndDate = 'Expected end date must be after start date';
    }

    if (!formData.responsibleParty.trim()) {
      newErrors.responsibleParty = 'Responsible party is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create the process record (in a real app, this would be sent to the API)
      const newProcess = {
        id: Date.now().toString(),
        projectId,
        name: formData.name,
        description: formData.description,
        status: 'pending',
        startDate: formData.startDate,
        expectedEndDate: formData.expectedEndDate,
        responsibleParty: formData.responsibleParty,
        createdBy: user.name,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        notes: formData.notes ? [formData.notes] : [],
        attachments: []
      };

      console.log('Process created:', newProcess);
      
      // Show success message and close modal
      alert('Legal process added successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to create process:', error);
      setErrors({ submit: 'Failed to add process. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectCommonProcess = (processName) => {
    setFormData({ ...formData, name: processName });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-amber-400 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Legal Process</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{errors.submit}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Process Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter process name"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            
            {/* Common Processes */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Common processes:</p>
              <div className="flex flex-wrap gap-2">
                {commonProcesses.slice(0, 6).map((process) => (
                  <button
                    key={process}
                    type="button"
                    onClick={() => selectCommonProcess(process)}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {process}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe what this process involves and its objectives"
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="expectedEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expected End Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="expectedEndDate"
                  value={formData.expectedEndDate}
                  onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.expectedEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.expectedEndDate && <p className="text-red-600 text-xs mt-1">{errors.expectedEndDate}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="responsibleParty" className="block text-sm font-medium text-gray-700 mb-2">
              Responsible Party *
            </label>
            <div className="relative">
              <input
                type="text"
                id="responsibleParty"
                value={formData.responsibleParty}
                onChange={(e) => setFormData({ ...formData, responsibleParty: e.target.value })}
                className={`w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.responsibleParty ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Internal Legal Team, External Consultant, Government Agency"
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.responsibleParty && <p className="text-red-600 text-xs mt-1">{errors.responsibleParty}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Initial Notes
            </label>
            <textarea
              id="notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any initial notes or requirements for this process"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Process...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Process
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}