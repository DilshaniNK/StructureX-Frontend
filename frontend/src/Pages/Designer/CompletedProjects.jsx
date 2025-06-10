import React, { useState } from 'react';
import { Search, Filter, Download, Eye, FileText, Image, ExternalLink, Calendar, User, Hash, CheckCircle } from 'lucide-react';

const CompletedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('completion_date');
  const [selectedProject, setSelectedProject] = useState(null);

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Project ID</p>
                    <p className="font-semibold">{project.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-semibold">{project.clientName}</p>
                    <p className="text-sm text-gray-600">ID: {project.clientId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{project.startDate} to {project.completionDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Project Type</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {project.projectType}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Rating</p>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < project.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Project Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  Images ({project.designFiles.images.length})
                </h4>
                <div className="space-y-2">
                  {project.designFiles.images.map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{image}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  PDFs ({project.designFiles.pdfs.length})
                </h4>
                <div className="space-y-2">
                  {project.designFiles.pdfs.map((pdf, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{pdf}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Design Links
                </h4>
                <div className="space-y-2">
                  {project.designFiles.links.map((link, index) => (
                    <button
                      key={index}
                      className="w-full p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm text-left truncate"
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
    <div className="pt-20 p-8 ml-18 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Projects</h1>
          <p className="text-gray-600">View and manage your successfully completed design projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedProjects.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-600">4.7</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by project ID, client name, or project type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="villa">Villa</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="completion_date">Sort by Completion Date</option>
                <option value="project_id">Sort by Project ID</option>
                <option value="client_name">Sort by Client Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.clientName}</h3>
                    <p className="text-sm text-gray-500">ID: {project.id}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    Client ID: {project.clientId}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash className="w-4 h-4 mr-2" />
                    {project.projectType}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Completed: {project.completionDate}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Rating:</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < project.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{project.designFiles.images.length} Images</span>
                  <span>{project.designFiles.pdfs.length} PDFs</span>
                  <span>{project.designFiles.links.length} Links</span>
                </div>
                
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed projects found</h3>
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