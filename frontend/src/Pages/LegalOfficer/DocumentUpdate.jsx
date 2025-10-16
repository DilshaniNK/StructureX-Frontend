import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function DocumentUpload({ projectId, onClose, user, onDocumentUploaded }) {
  const [formData, setFormData] = useState({
    project_id: projectId,
    description: '',
    type: 'contract',
    date: new Date().toISOString().split('T')[0] // Default to today's date
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors({ file: 'Only PDF, Word documents, and images (JPEG, PNG, GIF) are allowed' });
      return;
    }

    if (selectedFile.size > maxSize) {
      setErrors({ file: 'File size must be less than 10MB' });
      return;
    }

    setFile(selectedFile);
    setErrors({ ...errors, file: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!file) {
      newErrors.file = 'Please select a file to upload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('projectId', projectId); // ✅ match exactly with the @RequestParam name
      uploadFormData.append('description', formData.description);
      uploadFormData.append('type', formData.type);
      uploadFormData.append('date', formData.date);
      uploadFormData.append('document_url', file);

      console.log(uploadFormData);

      // Make the actual API call to upload document to database
      const response = await axios.post('http://localhost:8086/api/v1/legal_officer/add_document', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If successful, use the response data
      const newDocument = response.data;

      console.log('Document uploaded successfully:', newDocument);

      // Call the callback to refresh the documents list
      if (onDocumentUploaded) {
        onDocumentUploaded(newDocument);
      }

      // Show success message and close modal
      setSuccessMessage('Document uploaded successfully!');
      setTimeout(() => {
        onClose();
      }, 1500); // Close after 1.5 seconds to show success message
    } catch (error) {
      console.error('Upload failed:', error);
      let errorMessage = 'Upload failed. Please try again.';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection.';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white border-2 border-amber-400 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-amber-400 rounded-full mr-3"></span>
            Upload Legal Document
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
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{errors.submit}</span>
            </div>
          )}

          <div>
            <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-2">
              Project ID
            </label>
            <input
              type="text"
              id="project_id"
              value={projectId}
              disabled
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'} shadow-sm`}
            />
            {errors.date && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'} appearance-none bg-white shadow-sm`}
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem"
              }}
            >
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="permit">Permit</option>
              <option value="license">License</option>
              <option value="compliance">Compliance</option>
              <option value="other">Other</option>
            </select>
            {errors.type && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.type}
              </p>
            )}
          </div>

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
              placeholder="Brief description of the document and its purpose"
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document/Image <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${dragActive
                ? 'border-amber-400 bg-amber-50'
                : errors.file
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-amber-300 hover:bg-amber-50'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center space-x-4">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="h-24 w-24 flex items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
                      <FileText className="h-10 w-10 text-amber-500" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-2 inline-flex items-center text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove file
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-amber-400" />
                  <div className="mt-3">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop files here or <span className="text-amber-600">browse</span>
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG, GIF up to 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.file}
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
              disabled={uploading}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-3"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}