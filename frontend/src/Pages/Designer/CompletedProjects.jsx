import React, { useState } from 'react';
import { Search, Filter, Download, Eye, FileText, Image, ExternalLink, Calendar, User, Hash, CheckCircle, Sparkles, ChevronDown } from 'lucide-react';

const CompletedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('completion_date');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Mock data for completed projects
  const completedProjects = [
    {
      id: 'PRJ001',
      clientId: 'CLT001',
      clientName: 'Green Valley Residences',
      projectType: 'Residential Complex',
      completionDate: '2024-05-15',
      startDate: '2024-01-10',
      description: 'Modern residential complex with 50 units including amenities',
      designFiles: {
        images: ['design1.jpg', 'design2.jpg', 'final_render.jpg'],
        pdfs: ['floor_plans.pdf', 'specifications.pdf'],
        links: ['https://autocad.link/project001']
      },
      status: 'Delivered',
      rating: 5
    },
    {
      id: 'PRJ002',
      clientId: 'CLT002',
      clientName: 'Metro Shopping Center',
      projectType: 'Commercial',
      completionDate: '2024-04-28',
      startDate: '2024-02-01',
      description: 'Large scale shopping center with modern architecture and sustainable features',
      designFiles: {
        images: ['commercial1.jpg', 'exterior.jpg'],
        pdfs: ['structural_plans.pdf'],
        links: ['https://autocad.link/project002']
      },
      status: 'Delivered',
      rating: 4
    },
    {
      id: 'PRJ003',
      clientId: 'CLT003',
      clientName: 'Sunrise Villa',
      projectType: 'Villa',
      completionDate: '2024-03-20',
      startDate: '2023-12-15',
      description: 'Luxury villa with contemporary design and smart home integration',
      designFiles: {
        images: ['villa1.jpg', 'villa2.jpg', 'interior.jpg'],
        pdfs: ['villa_plans.pdf', 'interior_design.pdf'],
        links: ['https://autocad.link/project003']
      },
      status: 'Delivered',
      rating: 5
    }
  ];

  const filteredProjects = completedProjects
    .filter(project => {
      const matchesSearch = project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.projectType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || project.projectType.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'completion_date') {
        return new Date(b.completionDate) - new Date(a.completionDate);
      } else if (sortBy === 'project_id') {
        return a.id.localeCompare(b.id);
      } else if (sortBy === 'client_name') {
        return a.clientName.localeCompare(b.clientName);
      }
      return 0;
    });

  const ProjectDetailModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Details</h2>
                <p className="text-lg text-gray-600">Complete project information</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Hash className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">Project ID</p>
                      <p className="text-lg font-bold text-blue-900">{project.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Client</p>
                      <p className="text-lg font-bold text-green-900">{project.clientName}</p>
                      <p className="text-sm text-green-600">ID: {project.clientId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-purple-700">Duration</p>
                      <p className="text-lg font-bold text-purple-900">{project.startDate} to {project.completionDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-[#FAAD00]/10 to-yellow-100 rounded-2xl">
                  <p className="text-sm font-semibold text-yellow-700 mb-2">Project Type</p>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white shadow-lg">
                    {project.projectType}
                  </span>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl">
                  <p className="text-sm font-semibold text-yellow-700 mb-3">Rating</p>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < project.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#FAAD00]" />
                Project Description
              </h3>
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Images ({project.designFiles.images.length})
                </h4>
                <div className="space-y-3">
                  {project.designFiles.images.map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <span className="text-sm font-medium text-gray-700 truncate">{image}</span>
                      <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <h4 className="font-bold text-green-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  PDFs ({project.designFiles.pdfs.length})
                </h4>
                <div className="space-y-3">
                  {project.designFiles.pdfs.map((pdf, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                      <span className="text-sm font-medium text-gray-700 truncate">{pdf}</span>
                      <button className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-[#FAAD00]/10 to-yellow-100 rounded-2xl">
                <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Design Links
                </h4>
                <div className="space-y-3">
                  {project.designFiles.links.map((link, index) => (
                    <button
                      key={index}
                      className="w-full p-3 bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-[#FAAD00] transition-all text-sm font-medium shadow-lg hover:shadow-xl"
                      onClick={() => window.open(link, '_blank')}
                    >
                      Open Design Tool
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Search and Filters Section */}
      <div className="px-8 py-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by project ID, client name, or project type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#FAAD00]/20 focus:border-[#FAAD00] outline-none transition-all duration-300 text-lg"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white rounded-2xl hover:from-[#FAAD00]/90 hover:to-yellow-500/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              <Filter className="w-5 h-5" />
              <span>Filter Projects</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-10 overflow-hidden">
                <div className="py-2">
                  {['all', 'residential', 'commercial', 'villa'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-6 py-4 text-base font-medium transition-all duration-200 ${
                        filterType === type 
                          ? 'bg-gradient-to-r from-[#FAAD00]/10 to-yellow-500/10 text-[#FAAD00] border-l-4 border-[#FAAD00]' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : `${type.charAt(0).toUpperCase() + type.slice(1)}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 pr-12 focus:ring-4 focus:ring-[#FAAD00]/20 focus:border-[#FAAD00] outline-none transition-all font-semibold text-gray-700"
            >
              <option value="completion_date">Sort by Completion Date</option>
              <option value="project_id">Sort by Project ID</option>
              <option value="client_name">Sort by Client Name</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedProjects.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-[#FAAD00]">4.7</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#FAAD00] to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{project.clientName}</h3>
                    <p className="text-sm text-gray-500 font-medium">ID: {project.id}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                    Completed
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="font-medium">Client ID: {project.clientId}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash className="w-4 h-4 mr-3 text-purple-500" />
                    <span className="font-medium">{project.projectType}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-green-500" />
                    <span className="font-medium">Completed: {project.completionDate}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3 font-medium">Rating:</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < project.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
                  <span className="font-medium">{project.designFiles.images.length} Images</span>
                  <span className="font-medium">{project.designFiles.pdfs.length} PDFs</span>
                  <span className="font-medium">{project.designFiles.links.length} Links</span>
                </div>
                
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white py-3 px-4 rounded-xl hover:from-yellow-500 hover:to-[#FAAD00] transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No completed projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default CompletedProjects;