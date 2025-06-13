
import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock,Sparkles, Pin, PinOff, ExternalLink, Eye, Upload, CheckCircle, AlertCircle, ArrowUpDown, ChevronDown, X, FileText, User, Building } from 'lucide-react';

export default function OngoingProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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
      case 'urgent': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-gradient-to-r from-[#FAAD00]/10 to-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (progress >= 50) return 'bg-gradient-to-r from-[#FAAD00] to-yellow-500';
    if (progress >= 30) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
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
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Complete Project</h3>
            <button 
              onClick={() => setShowCompleteModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Mark "{selectedProject?.projectName}" as completed
          </p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Final Design Link</label>
              <input
                type="url"
                value={completionData.designLink}
                onChange={(e) => setCompletionData(prev => ({ ...prev, designLink: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FAAD00]/20 focus:border-[#FAAD00] outline-none transition-all"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Upload File (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FAAD00]/20 focus:border-[#FAAD00] outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Completion Notes</label>
              <textarea
                value={completionData.notes}
                onChange={(e) => setCompletionData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FAAD00]/20 focus:border-[#FAAD00] outline-none transition-all"
                rows="3"
                placeholder="Add any final notes..."
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Mark Complete
            </button>
            <button
              onClick={() => setShowCompleteModal(false)}
              className="flex-1 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all font-semibold"
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
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProject.projectName}</h2>
                <p className="text-lg text-gray-600">Project ID: {selectedProject.id}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                  <User className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Client</p>
                    <p className="text-gray-700">{selectedProject.clientName}</p>
                    <p className="text-sm text-gray-600">{selectedProject.clientEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Due Date</p>
                    <p className="text-gray-700">{new Date(selectedProject.dueDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">
                      {getDaysUntilDue(selectedProject.dueDate)} days remaining
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                  <Building className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Budget</p>
                    <p className="text-gray-700">{selectedProject.budget}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <p className="font-semibold mb-3 text-gray-900">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className={`h-4 rounded-full ${getProgressColor(selectedProject.progress)}`}
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{selectedProject.progress}% Complete</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl">
                  <p className="font-semibold mb-3 text-gray-900">Priority</p>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getPriorityColor(selectedProject.priority)}`}>
                    {selectedProject.priority.charAt(0).toUpperCase() + selectedProject.priority.slice(1)}
                  </span>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl">
                  <p className="font-semibold mb-2 text-gray-900">Last Updated</p>
                  <p className="text-gray-700">{new Date(selectedProject.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
              <p className="font-semibold mb-3 text-gray-900 text-lg">Project Description</p>
              <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
            </div>
            
            <div>
              <p className="font-semibold mb-4 text-gray-900 text-lg">Requirements</p>
              <div className="flex flex-wrap gap-3">
                {selectedProject.requirements.map((req, index) => (
                  <span key={index} className="px-4 py-2 bg-gradient-to-r from-[#FAAD00]/20 to-yellow-200 text-yellow-800 rounded-full text-sm font-medium border border-yellow-300">
                    {req}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={() => window.open(selectedProject.designToolLink, '_blank')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Continue Design
              </button>
              <button
                onClick={() => handleCompleteProject(selectedProject)}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark Complete
              </button>
              <button
                onClick={() => togglePin(selectedProject.id)}
                className={`flex items-center justify-center px-8 py-4 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl ${
                  pinnedProjects.has(selectedProject.id) 
                    ? 'bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white hover:from-[#FAAD00]/90 hover:to-yellow-500/90' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-[#FAAD00]/5 to-white shadow-lg border-b border-gray-100">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#FAAD00] rounded-xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    Ongoing Projects
                  </h1>
                  <p className="text-xl text-gray-600">Manage and track your active design projects</p>
                </div>
              </div>
            </div>
            <div className="text-lg text-gray-500 bg-gradient-to-r from-[#FAAD00]/10 to-yellow-100 px-6 py-3 rounded-2xl border border-yellow-200">
              <span className="font-semibold text-[#FAAD00]">{sortedProjects.length}</span> active projects
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="px-8 py-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search projects, clients, or IDs..."
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
                  {['all', 'urgent', 'high', 'medium', 'low'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-6 py-4 text-base font-medium transition-all duration-200 ${
                        filterStatus === status 
                          ? 'bg-gradient-to-r from-[#FAAD00]/10 to-yellow-500/10 text-[#FAAD00] border-l-4 border-[#FAAD00]' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {status === 'all' ? 'All Projects' : `${status.charAt(0).toUpperCase() + status.slice(1)} Priority`}
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
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="progress">Sort by Progress</option>
              <option value="name">Sort by Name</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="px-8 py-8">
        <div className="space-y-6">
          {sortedProjects.map((project) => {
            const daysUntilDue = getDaysUntilDue(project.dueDate);
            const isPinned = pinnedProjects.has(project.id);
            
            return (
              <div
                key={project.id}
                className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                  isPinned ? 'border-[#FAAD00] bg-gradient-to-br from-[#FAAD00]/5 to-yellow-50' : 'border-gray-100 hover:border-[#FAAD00]/30'
                }`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        {isPinned && <Pin className="w-5 h-5 text-[#FAAD00]" />}
                        <h3 className="text-2xl font-bold text-gray-900">{project.projectName}</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getPriorityColor(project.priority)}`}>
                          {project.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                          <p className="text-sm font-semibold text-blue-700 mb-1">Project ID</p>
                          <p className="font-bold text-blue-900">{project.id}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                          <p className="text-sm font-semibold text-green-700 mb-1">Client</p>
                          <p className="font-bold text-green-900">{project.clientName}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                          <p className="text-sm font-semibold text-purple-700 mb-1">Due Date</p>
                          <p className="font-bold text-purple-900">{new Date(project.dueDate).toLocaleDateString()}</p>
                          <p className={`text-xs font-medium ${daysUntilDue <= 7 ? 'text-red-600' : 'text-purple-600'}`}>
                            {daysUntilDue > 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-[#FAAD00]/10 to-yellow-100 rounded-2xl">
                          <p className="text-sm font-semibold text-yellow-700 mb-2">Progress</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-yellow-800">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-base mb-6 leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => window.open(project.designToolLink, '_blank')}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Continue Design
                    </button>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#FAAD00] transition-all font-semibold"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => togglePin(project.id)}
                      className={`flex items-center px-6 py-3 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl ${
                        isPinned 
                          ? 'bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white hover:from-[#FAAD00]/90 hover:to-yellow-500/90' 
                          : 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#FAAD00]'
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