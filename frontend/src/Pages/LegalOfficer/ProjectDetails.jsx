import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Plus, FileText, Clock, CheckCircle, AlertCircle, Calendar, User, Edit3, Download, Trash2 } from 'lucide-react';
import axios from 'axios';
import DocumentUploadModal from './DocumentUpdate';
import ProcessModal from './ProcessModel';
import UpdateProcessModal from './UpdateProcessModal';

export default function ProjectDetails({ projectId, onBack, user }) {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [processToDelete, setProcessToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const documentsResponse = await axios.get(`http://localhost:8086/api/v1/legal_officer/legal_documents/${projectId}`);
      setDocuments(documentsResponse.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        await fetchDocuments();

        // Fetch legal processes for this project
        try {
          const processesResponse = await axios.get(`http://localhost:8086/api/v1/legal_officer/legal_processes/${projectId}`);
          setProcesses(processesResponse.data || []);
        } catch (err) {
          console.error('Error fetching legal processes:', err);
          setProcesses([]);
        }

      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!projectId) {
    return <div>Project ID not provided</div>;
  }

  const handleDocumentUploaded = (newDocument) => {
    setDocuments(prevDocuments => [...prevDocuments, newDocument]);
    fetchDocuments(); // Re-fetch to ensure accuracy
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unsuccessful': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'unsuccessful': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;

    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return isNaN(date.getTime()) ? d : date.toLocaleDateString();
  };

  const handleStatusUpdate = (processId) => {
    setSelectedProcess(processId);
    setShowUpdateModal(true);
  };

  const handleDeleteProcess = async (processId) => {
    try {
      const response = await axios.delete(`http://localhost:8086/api/v1/legal_officer/delete_legal_process/${processId}`);
      if (response.status === 200) {
        // Remove the deleted process from the processes array
        setProcesses(processes.filter(process => process.id !== processId));
        // Close the confirmation dialog
        setShowDeleteConfirm(false);
        setProcessToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting legal process:', error);
      alert('Failed to delete legal process. Please try again.');
    }
  };

  const confirmDelete = (processId) => {
    setProcessToDelete(processId);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Project <span className="text-amber-600">{projectId}</span></h1>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
                <button
                  onClick={() => setShowProcessModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'documents', label: 'Legal Documents', count: documents.length },
              { key: 'processes', label: 'Legal Processes', count: processes.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === tab.key
                  ? 'border-amber-500 text-amber-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <FileText className="mx-auto h-16 w-16 text-amber-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                  No legal documents found for this project.
                </p>
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>
            ) : (
              <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((document, idx) => (
                      <tr key={document.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{document.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {document.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(document.upload_date || document.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={document.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3.5 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <Download className="h-4 w-4 mr-1.5 text-amber-600" />
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-6">
            {processes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <Plus className="mx-auto h-16 w-16 text-amber-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No legal processes added</h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                  Add your first legal process to start tracking.
                </p>
                <button
                  onClick={() => setShowProcessModal(true)}
                  className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Process
                </button>
              </div>
            ) : (
              processes.map(process => (
                <div key={process.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Project ID: <span className="font-normal text-amber-700">{process.project_id || process.projectId || projectId}</span></h3>
                          <p className="text-sm text-gray-600 mt-2"><strong className="text-gray-700">Description:</strong> {process.description || '—'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(process.status)}`}>
                            {getStatusIcon(process.status)}
                            <span className="ml-1.5 capitalize">{process.status || '—'}</span>
                          </span>
                          <p className="text-sm text-gray-500 mt-2">Approval Date: <span className="text-gray-900 font-medium">{formatDate(process.approval_date || process.approvalDate || process.approvaldate)}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(process.id)}
                        className="inline-flex items-center px-3.5 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <Edit3 className="h-4 w-4 mr-1.5 text-amber-600" />
                        Update
                      </button>

                      <button
                        onClick={() => confirmDelete(process.id)}
                        className="inline-flex items-center px-3.5 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Delete
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showDocumentModal && (
        <DocumentUploadModal
          projectId={projectId}
          onClose={() => setShowDocumentModal(false)}
          user={user}
          onDocumentUploaded={handleDocumentUploaded}
        />
      )}

      {showProcessModal && (
        <ProcessModal
          projectId={projectId}
          onClose={() => setShowProcessModal(false)}
          onUploaded={(updatedProcesses) => {
            // update local processes list with server-provided fresh data
            setProcesses(updatedProcesses || []);
          }}
          user={user}
        />
      )}

      {showUpdateModal && selectedProcess && (
        <UpdateProcessModal
          processId={selectedProcess}
          projectId={projectId} // Pass the project ID as a prop
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedProcess(null);
          }}
          onUpdated={(updatedProcesses) => {
            // update local processes list with server-provided fresh data
            setProcesses(updatedProcesses || []);
          }}
          user={user}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative mx-auto p-6 border w-full max-w-md shadow-xl rounded-xl bg-white animate-scaleIn">
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="h-10 w-10 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl leading-6 font-bold text-gray-900 mt-2">Confirm Deletion</h3>
              <div className="mt-3 px-4 py-3">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this legal process? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProcess(processToDelete)}
                  className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}