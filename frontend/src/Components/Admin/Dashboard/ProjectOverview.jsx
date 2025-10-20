import React, { useState, useEffect } from 'react';
import { Eye, FileText, Users, BarChart3, Calendar, MapPin, DollarSign, Clock, CheckCircle, AlertCircle, XCircle, ArrowLeft, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';

const ProjectOverviewDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8086/api/v1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, clientsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/get_all_projects`),
          fetch(`${API_BASE_URL}/admin/get_all_clients`)
        ]);

        if (!projectsRes.ok || !clientsRes.ok) throw new Error('Failed to fetch data');

        const projectsData = await projectsRes.json();
        const clientsData = await clientsRes.json();

        setProjects(projectsData);
        setClients(clientsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'ongoing': return 'text-[#FAAD00] border-[#FAAD00]';
      case 'pending': return 'text-blue-400 border-blue-400';
      case 'hold': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'ongoing': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'hold': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (project) => {
    const relatedClient = clients.find(c => c.ownerId === project.ownerId || c.clientId === project.ownerId);
    setSelectedProject(project);
    setSelectedClient(relatedClient || null);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedProject(null);
    setSelectedClient(null);
  };

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FAAD00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (showDetails && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBackToList}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#FAAD00]">Project Details</h1>
            <p className="text-gray-400">Comprehensive project information</p>
          </div>
        </div>

        {/* Project Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h2>
              <p className="text-gray-300">{selectedProject.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 border ${getStatusColor(selectedProject.status)}`}>
              {getStatusIcon(selectedProject.status)}
              {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FAAD00]/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#FAAD00]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Budget</p>
                <p className="font-semibold">${(selectedProject.budget / 1000000).toFixed(2)}M</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFC746]/10 rounded-lg">
                <Calendar className="w-5 h-5 text-[#FFC746]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="font-semibold text-xs">{selectedProject.startDate} - {selectedProject.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FAAD00]/10 rounded-lg">
                <MapPin className="w-5 h-5 text-[#FAAD00]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location</p>
                <p className="font-semibold">{selectedProject.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFC746]/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#FFC746]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Category</p>
                <p className="font-semibold capitalize">{selectedProject.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress and Details */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FAAD00]" />
              Project Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Project ID</p>
                <p className="text-white font-mono font-semibold">{selectedProject.projectId}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">Estimated Value</p>
                <p className="text-white font-semibold">${(selectedProject.estimatedValue || 0).toFixed(2)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Project Officers</p>
                <div className="space-y-2">
                  {selectedProject.qsId && <p className="text-white text-sm"><span className="text-gray-400">QS Officer:</span> {selectedProject.qsId}</p>}
                  {selectedProject.spId && <p className="text-white text-sm"><span className="text-gray-400">Project Manager:</span> {selectedProject.spId}</p>}
                  {selectedProject.planId && <p className="text-white text-sm"><span className="text-gray-400">Site Supervisor:</span> {selectedProject.planId}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          {selectedClient && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FFC746]" />
                Client Details
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Client ID</p>
                  <p className="text-white font-mono font-semibold">{selectedClient.clientId}</p>
                </div>
                
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Name</p>
                  <p className="text-white font-semibold">{selectedClient.name}</p>
                </div>

                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Type</p>
                  <p className="text-white font-semibold capitalize">{selectedClient.clientType}</p>
                </div>

                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 text-white text-sm mb-2">
                    <Mail className="w-4 h-4 text-[#FAAD00]" />
                    {selectedClient.email}
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Phone className="w-4 h-4 text-[#FAAD00]" />
                    {selectedClient.phoneNumber}
                  </div>
                </div>

                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Address</p>
                  <p className="text-white text-sm">{selectedClient.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Project Overview</h1>
        <p className="text-gray-400">Manage and monitor all system projects</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-[#FAAD00]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FAAD00]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Projects</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="p-2 sm:p-3 border-2 border-[#FAAD00] rounded-lg hover:bg-[#FAAD00]/5 transition-colors">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAAD00]" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-[#FFC746]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFC746]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Ongoing</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{projects.filter(p => p.status === 'ongoing').length}</p>
            </div>
            <div className="p-2 sm:p-3 border-2 border-[#FFC746] rounded-lg hover:bg-[#FFC746]/5 transition-colors">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC746]" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-green-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{projects.filter(p => p.status === 'completed').length}</p>
            </div>
            <div className="p-2 sm:p-3 border-2 border-green-400 rounded-lg hover:bg-green-400/5 transition-colors">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{projects.filter(p => p.status === 'pending').length}</p>
            </div>
            <div className="p-2 sm:p-3 border-2 border-blue-400 rounded-lg hover:bg-blue-400/5 transition-colors">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">All Projects</h2>
          <p className="text-gray-400 mt-1">Complete list of system projects with details</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-300">Project ID</th>
                <th className="text-left p-4 font-semibold text-gray-300">Project Name</th>
                <th className="text-left p-4 font-semibold text-gray-300">Client ID</th>
                <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 font-semibold text-gray-300">Budget</th>
                <th className="text-left p-4 font-semibold text-gray-300">Location</th>
                <th className="text-left p-4 font-semibold text-gray-300">Category</th>
                <th className="text-center p-4 font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project) => (
                <tr key={project.projectId} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-[#FAAD00] font-semibold">{project.projectId}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{project.name}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300 font-mono">{project.ownerId}</span>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white font-semibold">${(project.budget / 1000000).toFixed(2)}M</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">{project.location}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300 capitalize text-sm">{project.category}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleViewDetails(project)}
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#FAAD00] text-[#FAAD00] font-medium rounded-lg hover:bg-[#FAAD00] hover:text-black transition-all duration-200 transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, projects.length)} of {projects.length} results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#FAAD00] text-gray-900 font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverviewDashboard;