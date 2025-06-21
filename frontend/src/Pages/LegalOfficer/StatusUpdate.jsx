import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle, Save } from 'lucide-react';

 const mockLegalProcesses = [
  {
    id: '1',
    projectId: '1',
    name: 'Land Ownership Verification',
    description: 'Verify clear title and ownership of all land parcels',
    status: 'completed',
    startDate: '2024-02-01',
    expectedEndDate: '2024-02-28',
    actualEndDate: '2024-02-25',
    responsibleParty: 'Internal Legal Team',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-02-01T09:00:00Z',
    lastUpdated: '2024-02-25T16:30:00Z',
    notes: ['Initial verification completed', 'All documents verified with county records'],
    attachments: ['title_search_report.pdf']
  },
  {
    id: '2',
    projectId: '1',
    name: 'Environmental Clearance',
    description: 'Obtain environmental impact assessment and clearances',
    status: 'pending',
    startDate: '2024-02-15',
    expectedEndDate: '2024-04-15',
    responsibleParty: 'Environmental Consultants Inc.',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-02-15T11:00:00Z',
    lastUpdated: '2024-02-20T14:00:00Z',
    notes: ['Initial assessment submitted', 'Awaiting government review'],
    attachments: ['environmental_assessment.pdf']
  },
  {
    id: '3',
    projectId: '2',
    name: 'Zoning Compliance Review',
    description: 'Review and ensure compliance with local zoning requirements',
    status: 'unsuccessful',
    startDate: '2024-02-05',
    expectedEndDate: '2024-03-05',
    responsibleParty: 'City Planning Department',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-02-05T08:30:00Z',
    lastUpdated: '2024-03-10T12:00:00Z',
    notes: ['Initial application rejected', 'Height restrictions exceeded', 'Resubmission required with modifications'],
    attachments: ['zoning_application.pdf', 'rejection_notice.pdf']
  }
];

export default function StatusUpdate({ processId, onClose, user }) {
  const process = mockLegalProcesses.find(p => p.id === processId);
  
  const [formData, setFormData] = useState({
    status: process?.status || 'pending',
    note: '',
    actualEndDate: process?.actualEndDate || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!process) {
    return null;
  }
  

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
    { value: 'unsuccessful', label: 'Unsuccessful', icon: AlertCircle, color: 'text-red-600' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.note.trim()) {
      newErrors.note = 'Please provide a note explaining the status update';
    }

    if (formData.status === 'completed' && !formData.actualEndDate) {
      newErrors.actualEndDate = 'Actual end date is required for completed processes';
    }

    if (formData.actualEndDate && new Date(formData.actualEndDate) < new Date(process.startDate)) {
      newErrors.actualEndDate = 'Actual end date cannot be before start date';
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
      
      // Create the status update record (in a real app, this would be sent to the API)
      const statusUpdate = {
        id: Date.now().toString(),
        processId,
        previousStatus: process.status,
        newStatus: formData.status,
        note: formData.note,
        updatedBy: user.name,
        updatedAt: new Date().toISOString(),
        actualEndDate: formData.actualEndDate || undefined
      };

      console.log('Status update:', statusUpdate);
      
      // Show success message and close modal
      alert(`Process status updated to ${formData.status}!`);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
      setErrors({ submit: 'Failed to update status. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    const Icon = option.icon;
    return (
      <div className={`flex items-center ${option.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span className="capitalize">{option.label}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Process Status</h2>
            <p className="text-sm text-gray-500 mt-1">{process.name}</p>
          </div>
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

          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
            {getStatusBadge(process.status)}
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(process.lastUpdated).toLocaleString()}
            </p>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              New Status *
            </label>
            <div className="space-y-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData.status === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`flex items-center ${option.color}`}>
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actual End Date (if completed) */}
          {formData.status === 'completed' && (
            <div>
              <label htmlFor="actualEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                Actual End Date *
              </label>
              <input
                type="date"
                id="actualEndDate"
                value={formData.actualEndDate}
                onChange={(e) => setFormData({ ...formData, actualEndDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.actualEndDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.actualEndDate && <p className="text-red-600 text-xs mt-1">{errors.actualEndDate}</p>}
            </div>
          )}

          {/* Status Update Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              Status Update Note *
            </label>
            <textarea
              id="note"
              rows={4}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.note ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Explain the reason for this status update, what was accomplished, any challenges faced, or next steps..."
            />
            {errors.note && <p className="text-red-600 text-xs mt-1">{errors.note}</p>}
            <p className="text-xs text-gray-500 mt-1">
              This note will be added to the process history for audit purposes.
            </p>
          </div>

          {/* Process Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Process Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Start Date:</span>
                <p className="text-gray-900">{new Date(process.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Expected End:</span>
                <p className="text-gray-900">{new Date(process.expectedEndDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Responsible Party:</span>
                <p className="text-gray-900">{process.responsibleParty}</p>
              </div>
              <div>
                <span className="text-gray-500">Created By:</span>
                <p className="text-gray-900">{process.createdBy}</p>
              </div>
            </div>
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}