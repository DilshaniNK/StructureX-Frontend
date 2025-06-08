import React, { useState } from 'react';
import { Eye, FileText, Users, BarChart3, Calendar, MapPin, DollarSign, Clock, CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';

const ProjectOverviewDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Sample project data
  const projects = [
    {
      id: 'PRJ-001',
      clientId: 'CLI-001',
      clientName: 'TechCorp Solutions',
      title: 'E-commerce Platform Development',
      status: 'ongoing',
      progress: 75,
      budget: '$125,000',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      assignedOfficers: ['John Smith', 'Sarah Johnson', 'Mike Chen'],
      location: 'New York, NY',
      documents: ['Project Brief.pdf', 'Technical Specs.docx', 'Design Mockups.zip'],
      description: 'Complete e-commerce platform with advanced analytics and payment integration'
    },
    {
      id: 'PRJ-002',
      clientId: 'CLI-002',
      clientName: 'Global Logistics Inc',
      title: 'Supply Chain Management System',
      status: 'completed',
      progress: 100,
      budget: '$89,500',
      startDate: '2023-09-01',
      endDate: '2024-02-28',
      assignedOfficers: ['Emma Wilson', 'David Rodriguez'],
      location: 'Chicago, IL',
      documents: ['Final Report.pdf', 'User Manual.pdf', 'System Architecture.docx'],
      description: 'Comprehensive supply chain tracking and management solution'
    },
    {
      id: 'PRJ-003',
      clientId: 'CLI-003',
      clientName: 'Healthcare Partners',
      title: 'Patient Management Portal',
      status: 'pending',
      progress: 25,
      budget: '$67,800',
      startDate: '2024-03-01',
      endDate: '2024-08-15',
      assignedOfficers: ['Lisa Park', 'Robert Taylor', 'Anna Martinez'],
      location: 'Los Angeles, CA',
      documents: ['Requirements.pdf', 'HIPAA Guidelines.docx'],
      description: 'HIPAA-compliant patient portal with appointment scheduling and records management'
    },
    {
      id: 'PRJ-004',
      clientId: 'CLI-004',
      clientName: 'FinanceFlow Corp',
      title: 'Banking Mobile App',
      status: 'ongoing',
      progress: 60,
      budget: '$156,000',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      assignedOfficers: ['Kevin Wong', 'Michelle Davis'],
      location: 'San Francisco, CA',
      documents: ['Security Assessment.pdf', 'UI/UX Design.figma', 'API Documentation.pdf'],
      description: 'Secure mobile banking application with biometric authentication'
    },
    {
      id: 'PRJ-005',
      clientId: 'CLI-005',
      clientName: 'EduTech Solutions',
      title: 'Learning Management System',
      status: 'on-hold',
      progress: 40,
      budget: '$94,200',
      startDate: '2024-01-10',
      endDate: '2024-09-30',
      assignedOfficers: ['Thomas Anderson', 'Jennifer Lee'],
      location: 'Austin, TX',
      documents: ['Educational Framework.pdf', 'Student Portal Wireframes.pdf'],
      description: 'Comprehensive LMS with virtual classroom and assessment tools'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'ongoing': return 'text-[#FAAD00] bg-[#FAAD00]/10';
      case 'pending': return 'text-blue-400 bg-blue-400/10';
      case 'on-hold': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'ongoing': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'on-hold': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedProject(null);
  };

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
              <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
              <p className="text-gray-300">{selectedProject.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(selectedProject.status)}`}>
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
                <p className="font-semibold">{selectedProject.budget}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFC746]/10 rounded-lg">
                <Calendar className="w-5 h-5 text-[#FFC746]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="font-semibold">{selectedProject.startDate} - {selectedProject.endDate}</p>
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
                <p className="text-gray-400 text-sm">Progress</p>
                <p className="font-semibold">{selectedProject.progress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FAAD00]" />
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Overall Progress</span>
                  <span className="text-[#FAAD00] font-semibold">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#FAAD00] to-[#FFC746] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Milestone Progress */}
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-gray-200">Project Milestones</h4>
                {[
                  { name: 'Project Planning', progress: 100, status: 'completed' },
                  { name: 'Design Phase', progress: 90, status: 'ongoing' },
                  { name: 'Development', progress: selectedProject.progress, status: 'ongoing' },
                  { name: 'Testing', progress: 20, status: 'pending' },
                  { name: 'Deployment', progress: 0, status: 'pending' }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">{milestone.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#FAAD00] to-[#FFC746] h-2 rounded-full"
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 w-12">{milestone.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Officers */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FFC746]" />
              Assigned Officers
            </h3>
            <div className="space-y-3">
              {selectedProject.assignedOfficers.map((officer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FAAD00] to-[#FFC746] rounded-full flex items-center justify-center text-black font-semibold">
                    {officer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-white">{officer}</p>
                    <p className="text-sm text-gray-400">Team Member</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Documents */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FAAD00]" />
              Project Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProject.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group">
                  <div className="p-2 bg-[#FAAD00]/10 rounded-lg group-hover:bg-[#FAAD00]/20 transition-colors">
                    <FileText className="w-5 h-5 text-[#FAAD00]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white group-hover:text-[#FAAD00] transition-colors">{doc}</p>
                    <p className="text-sm text-gray-400">Document</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                <th className="text-left p-4 font-semibold text-gray-300">Client ID</th>
                <th className="text-left p-4 font-semibold text-gray-300">Client Name</th>
                <th className="text-left p-4 font-semibold text-gray-300">Project Title</th>
                <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 font-semibold text-gray-300">Progress</th>
                <th className="text-left p-4 font-semibold text-gray-300">Budget</th>
                <th className="text-center p-4 font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-[#FAAD00] font-semibold">{project.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300 font-mono">{project.clientId}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-white font-medium">{project.clientName}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{project.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{project.startDate} - {project.endDate}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-600 rounded-full h-2 max-w-[80px]">
                        <div 
                          className="bg-gradient-to-r from-[#FAAD00] to-[#FFC746] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white font-semibold">{project.budget}</span>
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
      </div>
    </div>
  );
};

export default ProjectOverviewDashboard;