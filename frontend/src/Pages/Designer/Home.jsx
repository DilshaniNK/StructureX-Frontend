import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, StickyNote, Trash2, Edit, Eye, X
} from 'lucide-react';

const DesignerHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sample project data - only ongoing and completed
  const projectStats = {
    ongoing: 15,
    completed: 48
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
      specialNote: 'Client requested specific lighting requirements for the main lobby area. Need to coordinate with electrical team for proper implementation. The design includes modern LED fixtures with smart controls.',
      createdDate: '2024-01-15'
    },
    {
      id: 'PRJ-002',
      clientId: 'CLI-2024-002',
      clientName: 'Green Spaces Ltd',
      type: 'ongoing',
      title: 'Eco-Friendly Office Building',
      dueDate: '2024-08-20',
      priority: 'medium',
      specialNote: 'LEED certification required. Focus on sustainable materials and energy-efficient design. All materials must be locally sourced where possible.',
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
      specialNote: 'Historical preservation guidelines were followed strictly. All original architectural elements were preserved and restored to their former glory.',
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
      specialNote: 'IoT integration required for all major systems including lighting, HVAC, security, and entertainment systems. Full automation capabilities needed.',
      createdDate: '2024-02-20'
    },
    {
      id: 'PRJ-005',
      clientId: 'CLI-2024-005',
      clientName: 'Retail Solutions',
      type: 'ongoing',
      title: 'Shopping Mall Renovation',
      dueDate: '2024-09-15',
      priority: 'medium',
      specialNote: 'Project includes food court redesign and new escalator installation. Focus on improving customer flow and creating modern shopping experience.',
      createdDate: '2024-03-01'
    },
    {
      id: 'PRJ-006',
      clientId: 'CLI-2024-006',
      clientName: 'Corporate Towers',
      type: 'completed',
      title: 'Executive Office Redesign',
      completedDate: '2024-04-18',
      priority: 'high',
      specialNote: 'Completed executive suite with premium finishes and state-of-the-art conference facilities. Client extremely satisfied with the results.',
      createdDate: '2023-12-15'
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
      case 'ongoing': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const showNoteModal = (note, projectId) => {
    setSelectedNote(note);
    setSelectedProjectId(projectId);
    setEditedNote(note);
    setIsEditingNote(false);
    setShowNotePopup(true);
  };

  const handleUpdateNote = () => {
    setIsEditingNote(true);
  };

  const handleSaveNote = () => {
    // Here you would typically update the project note in your data source
    console.log('Saving note for project:', selectedProjectId, 'New note:', editedNote);
    setSelectedNote(editedNote);
    setIsEditingNote(false);
    // You can add actual save logic here
  };

  const handleCancelEdit = () => {
    setEditedNote(selectedNote);
    setIsEditingNote(false);
  };

  const handleDelete = (projectId) => {
    console.log('Delete project:', projectId);
    // Add delete functionality here
  };

  const handleUpdate = (projectId) => {
    console.log('Update project:', projectId);
    // Add update functionality here
  };

  const handleViewDesign = (projectId) => {
    console.log('View design:', projectId);
    // Add view design functionality here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 w-full">
      {/* Background blur overlay when popup is open */}
      {showNotePopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}

      {/* Full width container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Ongoing Projects Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FAAD00]/10 to-blue-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                </div>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {projectStats.ongoing}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Ongoing Projects</h3>
            <p className="text-gray-600 mb-6">Active projects in development</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-4/5 rounded-full shadow-inner"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">80% average progress</p>
          </div>

          {/* Completed Projects Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-[#FAAD00]/10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {projectStats.completed}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Completed Projects</h3>
            <p className="text-gray-600 mb-6">Successfully delivered projects</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 w-full rounded-full shadow-inner"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">100% completion rate</p>
          </div>
        </div>

        {/* Search and Filter Section - Full Width */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mb-10 w-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Search Bar - Full Width */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search projects by name, client, or project ID..."
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
                <Filter className="w-6 h-6" />
                <span>Filter Projects</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                  <div className="py-2">
                    {['all', 'ongoing', 'completed'].map((status) => (
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
                        {status === 'all' ? 'All Projects' : `${status.charAt(0).toUpperCase() + status.slice(1)} Projects`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects List - Full Width */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-full">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/5 via-transparent to-blue-500/5">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Portfolio</h2>
            <p className="text-gray-600 text-base">{filteredProjects.length} projects in your workspace</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Project Details</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Timeline</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Priority</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Notes</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent transition-all duration-200">
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-base font-bold text-gray-800 mb-1">{project.title}</div>
                        <div className="text-sm text-gray-500 font-medium">{project.id}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-base font-semibold text-gray-800">{project.clientName}</div>
                        <div className="text-sm text-gray-500">{project.clientId}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(project.type)}`}>
                        {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {project.type !== 'completed' && (
                        <div className="flex items-center text-base text-gray-700 font-medium">
                          <Calendar className="w-5 h-5 mr-3 text-[#FAAD00]" />
                          {project.dueDate}
                        </div>
                      )}
                      {project.type === 'completed' && (
                        <div className="text-base text-green-600 font-bold">
                          ✓ {project.completedDate}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${getPriorityColor(project.priority)}`}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => showNoteModal(project.specialNote, project.id)}
                        className="flex items-center text-[#FAAD00] hover:text-yellow-600 transition-colors duration-200 group"
                      >
                        <StickyNote className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-semibold">View Note</span>
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDesign(project.id)}
                          className="p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 group relative"
                          title="View Design"
                        >
                          <Eye className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            View Design
                          </span>
                        </button>
                        <button
                          onClick={() => handleUpdate(project.id)}
                          className="p-3 hover:bg-yellow-50 rounded-xl transition-all duration-200 group relative"
                          title="Update Project"
                        >
                          <Edit className="w-5 h-5 text-[#FAAD00] group-hover:scale-110 transition-transform duration-200" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Update Project
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-3 hover:bg-red-50 rounded-xl transition-all duration-200 group relative"
                          title="Delete Project"
                        >
                          <Trash2 className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform duration-200" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Delete Project
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Special Note Popup */}
      {showNotePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-3xl transform transition-all duration-300 scale-100 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <div className="p-3 bg-gradient-to-r from-[#FAAD00] to-yellow-500 rounded-2xl mr-4 shadow-lg">
                  <StickyNote className="w-6 h-6 text-white" />
                </div>
                Project Notes
              </h3>
              <button
                onClick={() => setShowNotePopup(false)}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors duration-200 group"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 group-hover:scale-110 transition-all duration-200" />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-l-4 border-[#FAAD00] shadow-inner">
              {isEditingNote ? (
                <textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none transition-all duration-200 text-gray-800 font-medium resize-none"
                  placeholder="Enter project notes..."
                />
              ) : (
                <p className="text-gray-800 leading-relaxed text-base font-medium">{selectedNote}</p>
              )}
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              {isEditingNote ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-white text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-6 py-3 bg-[#FAAD00] text-white border-2 border-[#FAAD00] rounded-xl hover:bg-[#FAAD00]/90 transition-all duration-200 font-semibold"
                  >
                    Save Note
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdateNote}
                    className="px-6 py-3 bg-white text-[#FAAD00] border-2 border-[#FAAD00] rounded-xl hover:bg-[#FAAD00]/5 transition-all duration-200 font-semibold"
                  >
                    Update Note
                  </button>
                  <button
                    onClick={() => setShowNotePopup(false)}
                    className="px-6 py-3 bg-[#FAAD00] text-white border-2 border-[#FAAD00] rounded-xl hover:bg-[#FAAD00]/90 transition-all duration-200 font-semibold"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerHome;