import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, X, Download, FileText, Users, DollarSign, Calendar as CalendarIcon } from 'lucide-react';

const ProjectProgress = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportProject, setReportProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      progress: 75,
      status: 'On Track',
      startDate: '2024-01-15',
      endDate: '2025-03-15',
      budget: 2400000,
      spent: 1800000,
      teamSize: 12,
      location: 'Downtown District',
      contractor: 'BuildCorp Construction',
      milestones: [
        { 
          name: 'Foundation', 
          completed: true, 
          date: '2024-03-01',
          progress: 100,
          description: 'Complete foundation excavation and concrete pouring',
          tasks: ['Site preparation', 'Excavation', 'Concrete pouring', 'Curing'],
          completedTasks: 4,
          totalTasks: 4,
          budget: 400000,
          spent: 380000
        },
        { 
          name: 'Structure', 
          completed: true, 
          date: '2024-06-15',
          progress: 100,
          description: 'Steel frame construction and structural elements',
          tasks: ['Steel frame installation', 'Beam placement', 'Column installation', 'Safety inspection'],
          completedTasks: 4,
          totalTasks: 4,
          budget: 800000,
          spent: 820000
        },
        { 
          name: 'Interior', 
          completed: false, 
          date: '2024-12-01',
          progress: 60,
          description: 'Interior construction including walls, flooring, and utilities',
          tasks: ['Drywall installation', 'Electrical work', 'Plumbing', 'Flooring', 'Painting'],
          completedTasks: 3,
          totalTasks: 5,
          budget: 600000,
          spent: 360000
        },
        { 
          name: 'Finishing', 
          completed: false, 
          date: '2025-02-15',
          progress: 0,
          description: 'Final touches, fixtures, and quality assurance',
          tasks: ['Fixture installation', 'Final inspection', 'Cleanup', 'Handover'],
          completedTasks: 0,
          totalTasks: 4,
          budget: 300000,
          spent: 0
        },
      ]
    },
    {
      id: 2,
      name: 'Residential Towers',
      progress: 45,
      status: 'Behind Schedule',
      startDate: '2024-02-01',
      endDate: '2025-06-30',
      budget: 3200000,
      spent: 1440000,
      teamSize: 18,
      location: 'Riverside Area',
      contractor: 'Tower Construction Ltd',
      milestones: [
        { 
          name: 'Site Preparation', 
          completed: true, 
          date: '2024-03-15',
          progress: 100,
          description: 'Site clearing and preparation for construction',
          tasks: ['Land clearing', 'Soil testing', 'Utility marking', 'Access road'],
          completedTasks: 4,
          totalTasks: 4,
          budget: 200000,
          spent: 190000
        },
        { 
          name: 'Foundation', 
          completed: true, 
          date: '2024-05-01',
          progress: 100,
          description: 'Deep foundation work for high-rise structure',
          tasks: ['Pile driving', 'Foundation excavation', 'Reinforcement', 'Concrete work'],
          completedTasks: 4,
          totalTasks: 4,
          budget: 800000,
          spent: 850000
        },
        { 
          name: 'Structure Phase 1', 
          completed: false, 
          date: '2024-08-15',
          progress: 40,
          description: 'First 10 floors structural construction',
          tasks: ['Steel frame', 'Floor slabs', 'Core construction', 'Safety systems'],
          completedTasks: 2,
          totalTasks: 4,
          budget: 1200000,
          spent: 400000
        },
        { 
          name: 'Structure Phase 2', 
          completed: false, 
          date: '2024-12-01',
          progress: 0,
          description: 'Remaining floors and roof construction',
          tasks: ['Upper floors', 'Roof structure', 'Mechanical rooms', 'Final inspection'],
          completedTasks: 0,
          totalTasks: 4,
          budget: 1000000,
          spent: 0
        },
      ]
    },
    {
      id: 3,
      name: 'Shopping Mall Renovation',
      progress: 60,
      status: 'On Track',
      startDate: '2024-03-01',
      endDate: '2025-04-20',
      budget: 1800000,
      spent: 1080000,
      teamSize: 8,
      location: 'City Center',
      contractor: 'Renovation Experts Inc',
      milestones: [
        { 
          name: 'Demolition', 
          completed: true, 
          date: '2024-04-15',
          progress: 100,
          description: 'Selective demolition of outdated areas',
          tasks: ['Interior demolition', 'Debris removal', 'Structural assessment', 'Safety cleanup'],
          completedTasks: 4,
          totalTasks: 4,
          budget: 300000,
          spent: 280000
        },
        { 
          name: 'Structural Updates', 
          completed: true, 
          date: '2024-07-01',
          progress: 100,
          description: 'Structural reinforcement and updates',
          tasks: ['Beam reinforcement', 'Column updates', 'Foundation repair', 'Code compliance'],
          completedTasks: 4,
          totalTasks: 4,
          budget: 600000,
          spent: 620000
        },
        { 
          name: 'New Construction', 
          completed: false, 
          date: '2024-11-15',
          progress: 70,
          description: 'New retail spaces and modern amenities',
          tasks: ['New storefronts', 'Modern utilities', 'Accessibility features', 'Technology integration'],
          completedTasks: 3,
          totalTasks: 4,
          budget: 600000,
          spent: 180000
        },
        { 
          name: 'Final Touches', 
          completed: false, 
          date: '2025-03-20',
          progress: 0,
          description: 'Final finishes and grand opening preparation',
          tasks: ['Interior design', 'Signage installation', 'Final inspection', 'Grand opening prep'],
          completedTasks: 0,
          totalTasks: 4,
          budget: 300000,
          spent: 0
        },
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track':
        return 'text-green-600 bg-green-100';
      case 'Behind Schedule':
        return 'text-red-600 bg-red-100';
      case 'Ahead of Schedule':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-primary-500';
    if (progress >= 25) return 'bg-secondary-500';
    return 'bg-gray-400';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const generateReport = (project) => {
    setReportProject(project);
    setShowReport(true);
  };

  const downloadReport = () => {
    // In a real application, this would generate and download a PDF
    alert('Report downloaded successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Progress</h1>
        <p className="text-gray-600 mt-2">Track milestones and monitor project timelines</p>
      </div> */}

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Project Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    {project.startDate} - {project.endDate}
                  </div>
                </div>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="text-right mb-2 flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">Remaing Dates</span>
                  <span className="text-gray-600 ml-1">1563 Days</span>
                </div>
                {/* <div className="w-48 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div> */}
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Milestones</h3>
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      milestone.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          milestone.completed ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {milestone.name}
                        </h4>
                        <span className="text-sm text-gray-500">{milestone.date}</span>
                      </div>
                      {!milestone.completed && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex flex-wrap gap-3">
              
                {/* <button onClick={() => setSelectedProject(project)} 
                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  view Progress
                </button> */}
                {/* <button 
                  onClick={() => generateReport(project)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Generate Report
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">15</h3>
          <p className="text-gray-600">Completed Milestones</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="text-primary-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">8</h3>
          <p className="text-gray-600">In Progress</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-orange-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">2</h3>
          <p className="text-gray-600">Behind Schedule</p>
        </div>
      </div>

      {/* Detailed Project View Modal */}
      {selectedProject && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl w-full max-w-6xl max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                <p className="text-gray-600">Detailed Project Progress</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Project Overview */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="text-primary-600 mr-2" size={20} />
                    <span className="text-sm font-medium text-gray-600">Budget</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedProject.budget)}</p>
                  <p className="text-sm text-gray-500">Spent: {formatCurrency(selectedProject.spent)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="text-secondary-600 mr-2" size={20} />
                    <span className="text-sm font-medium text-gray-600">Team Size</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{selectedProject.teamSize}</p>
                  <p className="text-sm text-gray-500">Active members</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="text-accent-600 mr-2" size={20} />
                    <span className="text-sm font-medium text-gray-600">Duration</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">14</p>
                  <p className="text-sm text-gray-500">Months</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{selectedProject.progress}%</p>
                  <p className="text-sm text-gray-500">Complete</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900">{selectedProject.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Contractor</p>
                  <p className="text-gray-900">{selectedProject.contractor}</p>
                </div>
              </div>
            </div>

            {/* Detailed Milestones */}
            {/* <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Milestone Details</h3>
              <div className="space-y-6">
                {selectedProject.milestones.map((milestone, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle size={24} />
                          ) : (
                            <Clock size={24} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{milestone.name}</h4>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Due: {milestone.date}</p>
                        <p className="text-lg font-bold text-gray-900">{milestone.progress}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Tasks Progress</p>
                        <p className="text-lg font-bold text-gray-900">
                          {milestone.completedTasks}/{milestone.totalTasks}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Budget</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(milestone.budget)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Spent</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(milestone.spent)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Task Breakdown</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {milestone.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${
                              taskIndex < milestone.completedTasks 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className={`text-sm ${
                              taskIndex < milestone.completedTasks 
                                ? 'text-gray-900' 
                                : 'text-gray-500'
                            }`}>
                              {task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!milestone.completed && (
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-primary-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {/* {showReport && reportProject && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto">
          
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Progress Report</h2>
                <p className="text-gray-600">{reportProject.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-primary-500 text-gray-900 bg-amber-400 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                >
                  <Download size={20} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
            </div> */}

            {/* Report Content */}
            {/* <div className="p-6">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Project Status</p>
                      <p className="text-lg font-bold text-gray-900">{reportProject.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Overall Progress</p>
                      <p className="text-lg font-bold text-gray-900">{reportProject.progress}% Complete</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Budget Utilization</p>
                      <p className="text-lg font-bold text-gray-900">
                        {Math.round((reportProject.spent / reportProject.budget) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Team Size</p>
                      <p className="text-lg font-bold text-gray-900">{reportProject.teamSize} Members</p>
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Milestone Progress</h3>
                <div className="space-y-4">
                  {reportProject.milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          milestone.completed 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-yellow-600 bg-yellow-100'
                        }`}>
                          {milestone.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Progress</p>
                          <p className="font-medium">{milestone.progress}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tasks</p>
                          <p className="font-medium">{milestone.completedTasks}/{milestone.totalTasks}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-medium">{formatCurrency(milestone.budget)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Spent</p>
                          <p className="font-medium">{formatCurrency(milestone.spent)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

           
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Summary</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Budget</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportProject.budget)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Amount Spent</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(reportProject.spent)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(reportProject.budget - reportProject.spent)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

          
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Project Manager: John Smith | Construction Manager Dashboard
                </p>
              </div>
            </div> */}
          {/* </div> */}
        </div>
    //   )}
    // </div>
  );
};

export default ProjectProgress;