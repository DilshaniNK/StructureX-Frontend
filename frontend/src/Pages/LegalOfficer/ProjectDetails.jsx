import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Plus, FileText, Clock, CheckCircle, AlertCircle, Calendar, User, Edit3, Download } from 'lucide-react';
import axios from 'axios';
import DocumentUploadModal from './DocumentUpdate';
import ProcessModal from './ProcessModel';
import StatusUpdateModal from './StatusUpdate';

export default function ProjectDetails({ projectId, onBack, user }) {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // const projectResponse = await axios.get(`http://localhost:8086/api/v1/legal_officer/projects/${projectId}`);
        // setProject(projectResponse.data);

        // For now, create a mock project based on the projectId
        setProject({
          id: projectId,
          name: `Project ${projectId}`,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days from now
        });

        // Fetch documents for this project
        const documentsResponse = await axios.get(`http://localhost:8086/api/v1/legal_officer/document`);
        const projectDocuments = documentsResponse.data.filter(doc => doc.project_id === projectId);
        setDocuments(projectDocuments);

        // const processesResponse = await axios.get(`http://localhost:8086/api/v1/legal_officer/processes/${projectId}`);
        // setProcesses(processesResponse.data);

        // For now, use empty array for processes
        setProcesses([]);

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

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

  const handleStatusUpdate = (processId) => {
    setSelectedProcess(processId);
    setShowStatusModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
                <button
                  onClick={() => setShowProcessModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
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
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No legal documents found for this project.
                </p>
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>
            ) : (
              documents.map(document => (
                <div key={document.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-sm text-gray-500 mt-1">Project ID: {document.project_id}</h2>
                      <h3 className="text-lg font-medium text-gray-900">{document.description}</h3>
                      <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(document.upload_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex space-x-2">
                      <a
                        href={document.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-4">
            {processes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Plus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No legal processes added</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first legal process to start tracking.
                </p>
                <button
                  onClick={() => setShowProcessModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Process
                </button>
              </div>
            ) : (
              processes.map(process => (
                <div key={process.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{process.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(process.status)}`}>
                          {getStatusIcon(process.status)}
                          <span className="ml-1 capitalize">{process.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{process.description}</p>
                    </div>

                    <button
                      onClick={() => handleStatusUpdate(process.id)}
                      className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Update Status
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Start Date:</span>
                      <p className="text-gray-900">{new Date(process.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Expected End:</span>
                      <p className="text-gray-900">{new Date(process.expectedEndDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Responsible Party:</span>
                      <p className="text-gray-900">{process.responsibleParty}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Last Updated:</span>
                      <p className="text-gray-900">{new Date(process.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {process.notes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Notes:</h4>
                      <ul className="space-y-1">
                        {process.notes.slice(-3).map((note, index) => (
                          <li key={index} className="text-sm text-gray-600">• {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
        />
      )}

      {showProcessModal && (
        <ProcessModal
          projectId={projectId}
          onClose={() => setShowProcessModal(false)}
          user={user}
        />
      )}

      {showStatusModal && selectedProcess && (
        <StatusUpdateModal
          processId={selectedProcess}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedProcess(null);
          }}
          user={user}
        />
      )}
    </div>
  );
}