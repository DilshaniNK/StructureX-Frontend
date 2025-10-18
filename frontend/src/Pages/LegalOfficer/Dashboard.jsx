import React, { useEffect, useState } from 'react';
import { FileText, Search, Calendar, ExternalLink, FolderOpen, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';

export default function Dashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, docId: null });

  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    setLoading(true);
    axios.get('http://localhost:8086/api/v1/legal_officer/document')
      .then(res => {
        console.log('Documents received:', res.data);
        setDocuments(res.data);
        setLoading(false);
        setSuccessMessage('Documents loaded successfully!');
        setShowSuccessAlert(true);
      })
      .catch(err => {
        console.error('Failed to fetch legal documents:', err);
        setLoading(false);
        setErrorMessage('Failed to fetch legal documents. Please try again.');
        setShowErrorAlert(true);
      });
  };

  const handleAccept = (docId) => {
    console.log('Accepting document with ID:', docId);
    if (!docId) {
      console.error('Document ID is undefined');
      setErrorMessage('Error: Document ID is undefined');
      setShowErrorAlert(true);
      return;
    }

    setUpdating(true);
    axios.put(`http://localhost:8086/api/v1/legal_officer/document/${docId}/accept`)
      .then(res => {
        // Remove the accepted document from the list instead of just updating its status
        setDocuments(prevDocs =>
          prevDocs.filter(doc =>
            !(doc.id === docId || doc.documentId === docId || doc.document_id === docId)
          )
        );
        setUpdating(false);
        // Show success message
        setSuccessMessage('Document accepted successfully!');
        setShowSuccessAlert(true);
      })
      .catch(err => {
        console.error('Failed to accept document:', err);
        setUpdating(false);
        setErrorMessage('Error accepting document: ' + (err.response?.data || err.message));
        setShowErrorAlert(true);
      });
  };

  // Updated handleReject to only perform the rejection after confirmation
  const handleReject = (docId) => {
    console.log('Rejecting document with ID:', docId);
    if (!docId) {
      console.error('Document ID is undefined');
      setErrorMessage('Error: Document ID is undefined');
      setShowErrorAlert(true);
      return;
    }

    setUpdating(true);
    axios.put(`http://localhost:8086/api/v1/legal_officer/document/${docId}/reject`)
      .then(res => {
        // Remove the rejected document from the list instead of just updating its status
        setDocuments(prevDocs =>
          prevDocs.filter(doc =>
            !(doc.id === docId || doc.documentId === docId || doc.document_id === docId)
          )
        );
        setUpdating(false);
        // Show success message
        setSuccessMessage('Document rejected successfully!');
        setShowSuccessAlert(true);
      })
      .catch(err => {
        console.error('Failed to reject document:', err);
        setUpdating(false);
        setErrorMessage('Error rejecting document: ' + (err.response?.data || err.message));
        setShowErrorAlert(true);
      });
  };

  // Function to open the confirmation dialog
  const showRejectConfirmation = (docId) => {
    setConfirmDialog({ show: true, docId });
  };

  // Function to cancel the rejection
  const cancelReject = () => {
    setConfirmDialog({ show: false, docId: null });
  };

  // Function to confirm the rejection
  const confirmReject = () => {
    const docId = confirmDialog.docId;
    setConfirmDialog({ show: false, docId: null });
    handleReject(docId);
  };

  const filteredDocs = documents.filter(doc => {
    // First filter by search term
    const matchesSearch = doc.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Then filter by status - only show pending or no status documents
    const isPending = !doc.status || doc.status === 'pending';

    return matchesSearch && isPending;
  });

  const handleSeeMore = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleBackToDashboard = () => {
    setSelectedProjectId(null);
  };

  // If a project is selected, show ProjectDetails
  if (selectedProjectId) {
    return (
      <ProjectDetails
        projectId={selectedProjectId}
        onBack={handleBackToDashboard}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Confirmation Dialog */}
        {confirmDialog.show && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Rejection</h3>
                <button
                  onClick={cancelReject}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-5">
                <p className="text-gray-700">Are you sure you want to reject this document? This action cannot be undone.</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelReject}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-amber-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 text-amber-600 rounded-lg">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Documents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(doc => !doc.status || doc.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 text-amber-600 rounded-lg">
                <FolderOpen className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredDocs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3  rounded-lg">
                <Search className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Search Active</p>
                <p className="text-2xl font-semibold text-gray-900">{searchTerm ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Documents</h2>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSuccessMessage('Search cleared successfully!');
                  setShowSuccessAlert(true);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Document Library
          </h2>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="rounded-full h-12 w-12 border-b-2 border-amber-600 animate-spin"></div>
              <p className="ml-4 text-gray-600">Loading documents...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? 'Try adjusting your search terms or clearing the search to see all documents.'
                  : 'No legal documents are currently available in the system.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocs.map(doc => (
                <div
                  key={doc.id}
                  className="rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 bg-white"
                >
                  {/* Card Header with Project ID */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Project ID</p>
                        <p className="text-xl font-bold text-white">{doc.project_id}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${doc.status === 'accepted' ? 'bg-green-500 text-white' :
                          doc.status === 'rejected' ? 'bg-red-500 text-white' :
                            'bg-amber-200 text-amber-800'
                        }`}>
                        {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : 'Pending'}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                      <p className="text-sm text-gray-800 line-clamp-2">{doc.description}</p>
                    </div>

                    {/* Upload Date */}
                    <div className="mb-4 flex items-center">
                      <Calendar className="h-4 w-4 text-amber-600 mr-2" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload Date</p>
                        <p className="text-sm text-gray-800">{new Date(doc.upload_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Document URL */}
                    <div className="mb-4">
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800 font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Original Document
                      </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                      {!doc.status || doc.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              console.log('Document object:', doc);
                              // Try to find the document ID using various possible property names
                              const documentId = doc.id || doc.documentId || doc.document_id;
                              handleAccept(documentId);
                            }}
                            disabled={updating}
                            className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              console.log('Document object:', doc);
                              // Try to find the document ID using various possible property names
                              const documentId = doc.id || doc.documentId || doc.document_id;
                              showRejectConfirmation(documentId);
                            }}
                            disabled={updating}
                            className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleSeeMore(doc.project_id)}
                          className="col-span-2 inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          View Project Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
  );
}