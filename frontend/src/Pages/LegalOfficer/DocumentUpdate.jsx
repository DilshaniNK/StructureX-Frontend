import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

export default function DocumentUpload({ projectId, onClose, user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'contract'
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

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
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors({ file: 'Only PDF and Word documents are allowed' });
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create the document record (in a real app, this would be sent to the API)
      const newDocument = {
        id: Date.now().toString(),
        projectId,
        title: formData.title,
        description: formData.description,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: user.name,
        uploadedAt: new Date().toISOString(),
        type: formData.type
      };

      console.log('Document uploaded:', newDocument);
      
      // Show success message and close modal
      alert('Document uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ submit: 'Upload failed. Please try again.' });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Legal Document</h2>
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Master Development Agreement"
            />
            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
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
              placeholder="Brief description of the document and its purpose"
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : errors.file
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop files here or click to upload
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              )}
            </div>
            {errors.file && <p className="text-red-600 text-xs mt-1">{errors.file}</p>}
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
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}