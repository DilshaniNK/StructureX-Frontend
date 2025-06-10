import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Pin, PinOff, ExternalLink, Eye, Upload, CheckCircle, AlertCircle, ArrowUpDown, ChevronDown, X, FileText, User, Building } from 'lucide-react';

export default function OngoingProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [pinnedProjects, setPinnedProjects] = useState(new Set(['P001', 'P003']));

  // Sample data - replace with actual API data
  const [projects, setProjects] = useState([
    {
      id: 'P001',
      clientId: 'C001',
      projectName: 'Modern Villa Design',
      clientName: 'John Smith',
      type: 'ongoing',
      dueDate: '2025-07-15',
      priority: 'high',
      designToolLink: 'https://autocad.com/project/villa-001',
      description: 'Complete architectural design for a modern 3-bedroom villa with contemporary aesthetics.',
      progress: 65,
      lastUpdated: '2025-06-05',
      requirements: ['3 Bedrooms', '2 Bathrooms', 'Open Kitchen', 'Garden View'],
      clientEmail: 'john.smith@email.com',
      budget: '$150,000'
    },
    {
      id: 'P002',
      clientId: 'C002',
      projectName: 'Office Complex Renovation',
      clientName: 'ABC Corporation',
      type: 'ongoing',
      dueDate: '2025-08-20',
      priority: 'medium',
      designToolLink: 'https://autocad.com/project/office-002',
      description: 'Renovation of a 5-story office complex with modern workspace design.',
      progress: 30,
      lastUpdated: '2025-06-08',
      requirements: ['Modern Workspace', 'Meeting Rooms', 'Cafeteria', 'Parking'],
      clientEmail: 'contact@abc-corp.com',
      budget: '$500,000'
    },
    {
      id: 'P003',
      clientId: 'C003',
      projectName: 'Luxury Restaurant Interior',
      clientName: 'Maria Garcia',
      type: 'ongoing',
      dueDate: '2025-06-30',
      priority: 'urgent',
      designToolLink: 'https://autocad.com/project/restaurant-003',
      description: 'High-end restaurant interior design with Italian theme and premium materials.',
      progress: 80,
      lastUpdated: '2025-06-09',
      requirements: ['Italian Theme', 'Premium Materials', 'Bar Area', 'Private Dining'],
      clientEmail: 'maria.garcia@email.com',
      budget: '$200,000'
    },
    {
      id: 'P004',
      clientId: 'C004',
      projectName: 'Residential Complex',
      clientName: 'Green Valley Developers',
      type: 'ongoing',
      dueDate: '2025-09-10',
      priority: 'medium',
      designToolLink: 'https://autocad.com/project/complex-004',
      description: 'Master plan for a residential complex with 50 units and amenities.',
      progress: 45,
      lastUpdated: '2025-06-07',
      requirements: ['50 Units', 'Swimming Pool', 'Gym', 'Children Playground'],
      clientEmail: 'info@greenvalley.com',
      budget: '$2,000,000'
    }
  ]);

  const togglePin = (projectId) => {
    const newPinned = new Set(pinnedProjects);
    if (newPinned.has(projectId)) {
      newPinned.delete(projectId);
    } else {
      newPinned.add(projectId);
    }
    setPinnedProjects(newPinned);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || project.priority === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.projectName.localeCompare(b.projectName);
        default:
          return 0;
      }
    });

  const pinnedProjectsList = filteredAndSortedProjects.filter(p => pinnedProjects.has(p.id));
  const unpinnedProjectsList = filteredAndSortedProjects.filter(p => !pinnedProjects.has(p.id));
  const sortedProjects = [...pinnedProjectsList, ...unpinnedProjectsList];

  const handleCompleteProject = (project) => {
    setSelectedProject(project);
    setShowCompleteModal(true);
  };

  const CompleteProjectModal = () => {
    const [completionData, setCompletionData] = useState({
      designLink: '',
      file: null,
      notes: ''
    });

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      setCompletionData(prev => ({ ...prev, file }));
    };

    const handleComplete = () => {
      // Handle project completion logic here
      console.log('Completing project:', selectedProject.id, completionData);
      setShowCompleteModal(false);
      // Remove from ongoing projects and add to completed
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Complete Project</h3>
            <button onClick={() => setShowCompleteModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            Mark "{selectedProject?.projectName}" as completed
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Final Design Link</label>
              <input
                type="url"
                value={completionData.designLink}
                onChange={(e) => setCompletionData(prev => ({ ...prev, designLink: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Upload File (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Completion Notes</label>
              <textarea
                value={completionData.notes}
                onChange={(e) => setCompletionData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add any final notes..."
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleComplete}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark Complete
            </button>
            <button
              onClick={() => setShowCompleteModal(false)}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProjectDetailModal = () => {
    if (!selectedProject) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.projectName}</h2>
                <p className="text-gray-600">Project ID: {selectedProject.id}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-gray-600">{selectedProject.clientName}</p>
                    <p className="text-sm text-gray-500">{selectedProject.clientEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Due Date</p>
                    <p className="text-gray-600">{new Date(selectedProject.dueDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">
                      {getDaysUntilDue(selectedProject.dueDate)} days remaining
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-gray-600">{selectedProject.budget}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getProgressColor(selectedProject.progress)}`}
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedProject.progress}% Complete</p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Priority</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedProject.priority)}`}>
                    {selectedProject.priority.charAt(0).toUpperCase() + selectedProject.priority.slice(1)}
                  </span>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Last Updated</p>
                  <p className="text-gray-600">{new Date(selectedProject.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-2">Project Description</p>
              <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
            </div>
            
            <div>
              <p className="font-medium mb-2">Requirements</p>
              <div className="flex flex-wrap gap-2">
                {selectedProject.requirements.map((req, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {req}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button
                onClick={() => window.open(selectedProject.designToolLink, '_blank')}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Continue Design
              </button>
              <button
                onClick={() => handleCompleteProject(selectedProject)}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark Complete
              </button>
              <button
                onClick={() => togglePin(selectedProject.id)}
                className={`flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                  pinnedProjects.has(selectedProject.id) 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pinnedProjects.has(selectedProject.id) ? <PinOff className="w-5 h-5 mr-2" /> : <Pin className="w-5 h-5 mr-2" />}
                {pinnedProjects.has(selectedProject.id) ? 'Unpin' : 'Pin'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ongoing Projects</h1>
              <p className="text-gray-600">Manage and track your active design projects</p>
            </div>
            <div className="text-sm text-gray-500">
              {sortedProjects.length} active projects
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, clients, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="progress">Sort by Progress</option>
                <option value="name">Sort by Name</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="px-6 py-6">
        <div className="space-y-4">
          {sortedProjects.map((project) => {
            const daysUntilDue = getDaysUntilDue(project.dueDate);
            const isPinned = pinnedProjects.has(project.id);
            
            return (
              <div
                key={project.id}
                className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 ${
                  isPinned ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                        <h3 className="text-lg font-semibold text-gray-900">{project.projectName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Project ID</p>
                          <p className="font-medium">{project.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="font-medium">{project.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                          <p className={`text-xs ${daysUntilDue <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                            {daysUntilDue > 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Progress</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => window.open(project.designToolLink, '_blank')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Continue Design
                    </button>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => togglePin(project.id)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isPinned 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                      {isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      onClick={() => handleCompleteProject(project)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ongoing projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedProject && !showCompleteModal && <ProjectDetailModal />}
      {showCompleteModal && <CompleteProjectModal />}
    </div>
  );
}