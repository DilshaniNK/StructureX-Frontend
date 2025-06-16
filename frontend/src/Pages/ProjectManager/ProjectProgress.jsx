import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ProjectProgress = () => {
  const projects = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      progress: 75,
      status: 'On Track',
      startDate: '2024-01-15',
      endDate: '2025-03-15',
      milestones: [
        { name: 'Foundation', completed: true, date: '2024-03-01' },
        { name: 'Structure', completed: true, date: '2024-06-15' },
        { name: 'Interior', completed: false, date: '2024-12-01' },
        { name: 'Finishing', completed: false, date: '2025-02-15' },
      ]
    },
    {
      id: 2,
      name: 'Residential Towers',
      progress: 45,
      status: 'Behind Schedule',
      startDate: '2024-02-01',
      endDate: '2025-06-30',
      milestones: [
        { name: 'Site Preparation', completed: true, date: '2024-03-15' },
        { name: 'Foundation', completed: true, date: '2024-05-01' },
        { name: 'Structure Phase 1', completed: false, date: '2024-08-15' },
        { name: 'Structure Phase 2', completed: false, date: '2024-12-01' },
      ]
    },
    {
      id: 3,
      name: 'Shopping Mall Renovation',
      progress: 60,
      status: 'On Track',
      startDate: '2024-03-01',
      endDate: '2025-04-20',
      milestones: [
        { name: 'Demolition', completed: true, date: '2024-04-15' },
        { name: 'Structural Updates', completed: true, date: '2024-07-01' },
        { name: 'New Construction', completed: false, date: '2024-11-15' },
        { name: 'Final Touches', completed: false, date: '2025-03-20' },
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

  // const getProgressColor = (progress) => {
  //   if (progress >= 75) return 'bg-green-500';
  //   if (progress >= 50) return 'bg-primary-500';
  //   if (progress >= 25) return 'bg-secondary-500';
  //   return 'bg-gray-400';
  // };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Progress</h1>
        <p className="text-gray-600 mt-2">Track milestones and monitor project timelines</p>
      </div>

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
                {/* <div className="text-right mb-2">
                  <span className="text-2xl font-bold text-gray-900">{project.progress}%</span>
                  <span className="text-gray-600 ml-1">Complete</span>
                </div> */}
                <div className="w-48 bg-gray-200 rounded-full h-3">
                  {/* <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div> */}
                </div>
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
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '0%' }}></div>
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
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View Progress
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Generate Report
                </button>
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
    </div>
  );
};

export default ProjectProgress;