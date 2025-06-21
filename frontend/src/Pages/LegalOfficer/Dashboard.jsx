import React, { useState } from 'react';
import { FileText, Plus, Calendar, Clock, CheckCircle, AlertCircle, Bell, LogOut, User, Search } from 'lucide-react';
import ProjectDetail from './ProjectDetails';

 const mockProjects = [
  {
    id: '1',
    name: 'Downtown Commercial Complex',
    description: 'Mixed-use development project requiring comprehensive legal documentation',
    status: 'active',
    assignedLegalOfficer: 'Sarah Mitchell',
    createdAt: '2024-01-15',
    deadline: '2024-06-30'
  },
  {
    id: '2',
    name: 'Residential Tower Phase II',
    description: 'Second phase of residential development with zoning considerations',
    status: 'pending',
    assignedLegalOfficer: 'Sarah Mitchell',
    createdAt: '2024-02-01',
    deadline: '2024-08-15'
  },
  {
    id: '3',
    name: 'Industrial Park Expansion',
    description: 'Expansion of existing industrial facilities with environmental clearances',
    status: 'active',
    assignedLegalOfficer: 'Sarah Mitchell',
    createdAt: '2024-01-30',
    deadline: '2024-07-20'
  }
];

 const mockLegalProcesses = [
  {
    id: '1',
    projectId: '1',
    name: 'Land Ownership Verification',
    description: 'Verify clear title and ownership of all land parcels',
    status: 'completed',
    startDate: '2024-02-01',
    expectedEndDate: '2024-02-28',
    actualEndDate: '2024-02-25',
    responsibleParty: 'Internal Legal Team',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-02-01T09:00:00Z',
    lastUpdated: '2024-02-25T16:30:00Z',
    notes: ['Initial verification completed', 'All documents verified with county records'],
    attachments: ['title_search_report.pdf']
  },
  {
    id: '2',
    projectId: '1',
    name: 'Environmental Clearance',
    description: 'Obtain environmental impact assessment and clearances',
    status: 'pending',
    startDate: '2024-02-15',
    expectedEndDate: '2024-04-15',
    responsibleParty: 'Environmental Consultants Inc.',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-02-15T11:00:00Z',
    lastUpdated: '2024-02-20T14:00:00Z',
    notes: ['Initial assessment submitted', 'Awaiting government review'],
    attachments: ['environmental_assessment.pdf']
  },
  {
    id: '3',
    projectId: '2',
    name: 'Zoning Compliance Review',
    description: 'Review and ensure compliance with local zoning requirements',
    status: 'unsuccessful',
    startDate: '2024-02-05',
    expectedEndDate: '2024-03-05',
    responsibleParty: 'City Planning Department',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-02-05T08:30:00Z',
    lastUpdated: '2024-03-10T12:00:00Z',
    notes: ['Initial application rejected', 'Height restrictions exceeded', 'Resubmission required with modifications'],
    attachments: ['zoning_application.pdf', 'rejection_notice.pdf']
  }
];
 const mockNotifications = [
  {
    id: '1',
    type: 'status_updated',
    title: 'Process Status Updated',
    message: 'Land Ownership Verification for Downtown Commercial Complex has been completed',
    projectId: '1',
    createdAt: '2024-02-25T16:30:00Z',
    read: false,
    recipients: ['project_manager', 'director']
  },
  {
    id: '2',
    type: 'document_uploaded',
    title: 'New Document Uploaded',
    message: 'Master Development Agreement uploaded for Downtown Commercial Complex',
    projectId: '1',
    createdAt: '2024-02-15T10:30:00Z',
    read: true,
    recipients: ['project_manager', 'director', 'owner']
  }
];

export default function Dashboard({ user, onLogout }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const projects = mockProjects;
  const notifications = mockNotifications.filter(n => !n.read);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessStats = (projectId) => {
    const processes = mockLegalProcesses.filter(p => p.projectId === projectId);
    return {
      total: processes.length,
      completed: processes.filter(p => p.status === 'completed').length,
      pending: processes.filter(p => p.status === 'pending').length,
      unsuccessful: processes.filter(p => p.status === 'unsuccessful').length
    };
  };

  if (selectedProject) {
    return (
      <ProjectDetail
        projectId={selectedProject}
        onBack={() => setSelectedProject(null)}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects Assigned for Legal Processing</h2>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const stats = getProcessStats(project.id);
            return (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {project.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Process Stats */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Legal Processes</span>
                      <span className="font-medium text-gray-900">{stats.total} total</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-700">{stats.completed} completed</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-700">{stats.pending} pending</span>
                      </div>
                      {stats.unsuccessful > 0 && (
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-700">{stats.unsuccessful} unsuccessful</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No projects assigned for legal processing.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}