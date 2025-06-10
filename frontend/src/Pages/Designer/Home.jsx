import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Calendar, User, AlertCircle, 
  Clock, CheckCircle, Play, Eye, StickyNote 
} from 'lucide-react';

const DesignerHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sample project data
  const projectStats = {
    ongoing: 12,
    upcoming: 8,
    completed: 45
  };

  const projects = [
    {
      id: 'PRJ-001',
      clientId: 'CLI-2024-001',
      clientName: 'Modern Living Corp',
      type: 'ongoing',
      title: 'Luxury Apartment Complex',
      dueDate: '2024-07-15',
      priority: 'high',
      specialNote: 'Client requested specific lighting requirements for the main lobby area. Need to coordinate with electrical team for proper implementation.',
      createdDate: '2024-01-15'
    },
    {
      id: 'PRJ-002',
      clientId: 'CLI-2024-002',
      clientName: 'Green Spaces Ltd',
      type: 'upcoming',
      title: 'Eco-Friendly Office Building',
      dueDate: '2024-08-20',
      priority: 'medium',
      specialNote: 'LEED certification required. Focus on sustainable materials and energy-efficient design.',
      createdDate: '2024-02-10'
    },
    {
      id: 'PRJ-003',
      clientId: 'CLI-2024-003',
      clientName: 'Heritage Homes',
      type: 'completed',
      title: 'Victorian Style Renovation',
      completedDate: '2024-05-30',
      priority: 'low',
      specialNote: 'Historical preservation guidelines must be followed strictly.',
      createdDate: '2024-01-05'
    },
    {
      id: 'PRJ-004',
      clientId: 'CLI-2024-004',
      clientName: 'Tech Innovations Inc',
      type: 'ongoing',
      title: 'Smart Home Integration',
      dueDate: '2024-07-25',
      priority: 'high',
      specialNote: 'IoT integration required for all major systems.',
      createdDate: '2024-02-20'
    },
    {
      id: 'PRJ-005',
      clientId: 'CLI-2024-005',
      clientName: 'Retail Solutions',
      type: 'upcoming',
      title: 'Shopping Mall Renovation',
      dueDate: '2024-09-15',
      priority: 'medium',
      specialNote: 'Project includes food court redesign and new escalator installation.',
      createdDate: '2024-03-01'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.type === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (type) => {
    switch (type) {
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const showNoteModal = (note) => {
    setSelectedNote(note);
    setShowNotePopup(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Cards */}
      <div className="p-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Designer Dashboard</h1>
          <p className="text-gray-600">Overview of your design projects and current workload</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ongoing Projects Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{projectStats.ongoing}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ongoing Projects</h3>
            <p className="text-gray-600 text-sm">Active projects in progress</p>
            <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-3/4 rounded-full"></div>
            </div>
          </div>

          {/* Upcoming Projects Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-yellow-600">{projectStats.upcoming}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Projects</h3>
            <p className="text-gray-600 text-sm">Projects scheduled to start</p>
            <div className="mt-4 h-2 bg-yellow-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 w-1/2 rounded-full"></div>
            </div>
          </div>

          {/* Completed Projects Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">{projectStats.completed}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed Projects</h3>
            <p className="text-gray-600 text-sm">Successfully finished projects</p>
            <div className="mt-4 h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 w-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name, client, or project ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 px-6 py-3 bg-[#FAAD00] text-white rounded-xl hover:bg-[#FAAD00]/90 transition-all duration-200 font-medium"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-10">
                  <div className="py-2">
                    {['all', 'ongoing', 'upcoming', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowFilterDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-3 text-sm transition-all duration-150 ${
                          filterStatus === status 
                            ? 'bg-[#FAAD00]/10 text-[#FAAD00] font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)} Projects
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/5 to-transparent">
            <h2 className="text-xl font-bold text-gray-800">Project List</h2>
            <p className="text-gray-600 text-sm mt-1">{filteredProjects.length} projects found</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Special Note</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{project.title}</div>
                        <div className="text-xs text-gray-500">{project.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{project.clientName}</div>
                        <div className="text-xs text-gray-500">{project.clientId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.type)}`}>
                        {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.type !== 'completed' && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {project.dueDate}
                        </div>
                      )}
                      {project.type === 'completed' && (
                        <div className="text-sm text-green-600 font-medium">
                          Completed: {project.completedDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => showNoteModal(project.specialNote)}
                        className="flex items-center text-[#FAAD00] hover:text-[#FAAD00]/80 transition-colors duration-200"
                      >
                        <StickyNote className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">View Note</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Special Note Popup */}
      {showNotePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <StickyNote className="w-5 h-5 mr-2 text-[#FAAD00]" />
                Special Note
              </h3>
              <button
                onClick={() => setShowNotePopup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{selectedNote}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowNotePopup(false)}
                className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerHome;