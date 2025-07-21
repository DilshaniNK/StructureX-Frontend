import React, { useEffect, useState } from 'react';
import { FileText, Search, Calendar, ExternalLink, FolderOpen } from 'lucide-react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';

export default function Dashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8086/api/v1/legal_officer/document')
      .then(res => {
        setDocuments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch legal documents:', err);
        setLoading(false);
      });
  }, []);

  const filteredDocs = documents.filter(doc =>
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-amber-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 text-amber-600 rounded-lg">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{documents.length}</p>
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
                onClick={() => setSearchTerm('')}
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
              <div className="rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
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
                  className=" rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200"
                >
                  {/* Project ID Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</p>
                        <p className="text-lg font-bold text-gray-900">{doc.project_id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <h3 className="text-md font-semibold text-gray-800 mb-3 leading-tight">
                    {doc.description}
                  </h3>

                  {/* Upload Date */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Uploaded:</span>
                    <span className="ml-1">{new Date(doc.upload_date).toLocaleDateString()}</span>
                  </div>

                  {/* Action Button */}
                  <a
                    href={doc.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-200 transition-all duration-200 group-hover:shadow-md mr-3"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </a>

                  <button
                    onClick={() => handleSeeMore(doc.project_id)}
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-200 transition-all duration-200"
                  >
                    See More
                  </button>

                </div>
                
              ))}
              
            </div>
          )}
        </div>
      </main>
    </div>
  );
}