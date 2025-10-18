import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';
import { X, Save } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

export default function UpdateProcessModal({ processId, projectId: projectIdProp, onClose, onUpdated, user }) {
    const [formData, setFormData] = useState({
        description: '',
        status: 'pending',
        approvalDate: '',
        projectId: projectIdProp || null // Use the prop as initial value
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Alert states
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch the current process data when the modal opens
    useEffect(() => {
        const fetchProcessData = async () => {
            try {
                setInitialLoading(true);
                console.log('Fetching process data for ID:', processId);
                const response = await axios.get(`http://localhost:8086/api/v1/legal_officer/legal_process/${processId}`);
                const processData = response.data;
                console.log('Received process data:', processData);

                // Format the date to YYYY-MM-DD for input type="date"
                let approvalDate = '';
                if (processData.approval_date || processData.approvalDate) {
                    const date = new Date(processData.approval_date || processData.approvalDate);
                    if (!isNaN(date.getTime())) {
                        approvalDate = date.toISOString().split('T')[0];
                    }
                }

                // Get the project ID from the process data - check all possible field name variations
                let foundProjectId = null;
                if (processData.project_id !== undefined) {
                    foundProjectId = processData.project_id;
                } else if (processData.projectId !== undefined) {
                    foundProjectId = processData.projectId;
                } else if (processData.projectid !== undefined) {
                    foundProjectId = processData.projectid;
                }

                // Use the found ID or fall back to the prop
                const projectId = foundProjectId || projectIdProp;

                if (!projectId) {
                    console.error('Warning: No project ID found in process data or props', processData);
                    const errorMsg = 'Could not determine project ID. Please try again.';
                    setErrors({ fetch: errorMsg });
                    setErrorMessage(errorMsg);
                    setShowErrorAlert(true);
                    return;
                }

                console.log('Using project ID:', projectId);

                setFormData({
                    description: processData.description || '',
                    status: processData.status || 'pending',
                    approvalDate: approvalDate,
                    projectId: projectId // Store the project ID without displaying it
                });
            } catch (error) {
                console.error('Error fetching process data:', error);
                const errorMsg = 'Failed to fetch process data. Please try again.';
                setErrors({ fetch: errorMsg });
                setErrorMessage(errorMsg);
                setShowErrorAlert(true);
            } finally {
                setInitialLoading(false);
            }
        };

        if (processId) {
            fetchProcessData();
        }
    }, [processId, projectIdProp]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }
        if (!formData.approvalDate) {
            newErrors.approvalDate = 'Approval date is required';
        }
        if (!formData.projectId) {
            newErrors.projectId = 'Project ID is missing. Please refresh and try again.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Extra validation for project_id
        if (!formData.projectId) {
            const errorMsg = 'Project ID is missing. Cannot update without a valid project ID.';
            setErrors({
                ...errors,
                submit: errorMsg
            });
            setErrorMessage(errorMsg);
            setShowErrorAlert(true);
            return;
        }

        setLoading(true);

        try {
            // Ensure project_id is a valid number or string
            const projectId = formData.projectId;
            if (!projectId) {
                throw new Error('Project ID is missing or invalid');
            }

            const payload = {
                // send both camelCase and snake_case to match backend expectations
                project_id: projectId,
                projectId: projectId,
                description: formData.description,
                status: formData.status,
                approvalDate: formData.approvalDate,
                approval_date: formData.approvalDate,
            };

            // log payload for debugging
            console.log('Updating legal process payload:', payload);

            await axios.put(`http://localhost:8086/api/v1/legal_officer/update_legal_process/${processId}`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Show success message
            setSuccessMessage('Legal process updated successfully!');
            setShowSuccessAlert(true);

            // Fetch updated list of legal processes for this project and notify parent
            try {
                // Use the stored project ID directly from formData
                const projectId = formData.projectId;

                const res = await axios.get(`http://localhost:8086/api/v1/legal_officer/legal_processes/${projectId}`);
                const updatedProcesses = res?.data || [];

                if (typeof onUpdated === 'function') {
                    // let parent update its state with the fresh data
                    onUpdated(updatedProcesses);
                }
            } catch (fetchErr) {
                // Non-fatal: log and continue to close modal. Parent can optionally re-fetch later.
                console.warn('Failed to fetch updated legal processes after update:', fetchErr);
                setErrorMessage('Process updated but failed to refresh list. Please refresh the page.');
                setShowErrorAlert(true);
            }

            // finally close modal (if parent provided onClose)
            if (onClose) onClose();

        } catch (error) {
            // surface server error message if available
            console.error('Update legal process error:', error);
            const serverMessage = error?.response?.data?.message || error?.response?.data || error?.message || 'Failed to update process. Please try again.';
            const errorMsg = typeof serverMessage === 'string' ? serverMessage : 'An error occurred while updating the legal process';
            setErrorMessage(errorMsg);
            setShowErrorAlert(true);
            setErrors({ submit: typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage) });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white border-2 border-amber-400 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-amber-600"></div>
                        <span className="ml-3 text-gray-700 font-medium">Loading process data...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white border-2 border-amber-400 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-scaleIn">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="inline-block w-1.5 h-6 bg-amber-400 rounded-full mr-3"></span>
                        Update Legal Process
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.submit && (
                        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-red-700 text-sm">{errors.submit}</span>
                        </div>
                    )}
                    {errors.fetch && (
                        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-red-700 text-sm">{errors.fetch}</span>
                        </div>
                    )}
                    {errors.projectId && (
                        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-red-700 text-sm">{errors.projectId}</span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'} placeholder-gray-400 shadow-sm`}
                            placeholder="Describe the legal process details..."
                        />
                        {errors.description && (
                            <p className="text-red-600 text-xs mt-1 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${errors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'} appearance-none bg-white shadow-sm`}
                            style={{
                                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem"
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-600 text-xs mt-1 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.status}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="approvalDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Approval Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="approvalDate"
                            value={formData.approvalDate}
                            onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${errors.approvalDate ? 'border-red-300 bg-red-50' : 'border-gray-300'} shadow-sm`}
                        />
                        {errors.approvalDate && (
                            <p className="text-red-600 text-xs mt-1 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.approvalDate}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-3"></div>
                                    Updating Process...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Process
                                </div>
                            )}
                        </button>
                    </div>
                </form>

                {/* Success Alert */}
                <SuccessAlert
                    show={showSuccessAlert}
                    onClose={() => setShowSuccessAlert(false)}
                    title="Success!"
                    message={successMessage}
                />

                {/* Error Alert */}
                <ErrorAlert
                    show={showErrorAlert}
                    onClose={() => setShowErrorAlert(false)}
                    title="Error!"
                    message={errorMessage}
                />
            </div>
        </div>
    );
}
