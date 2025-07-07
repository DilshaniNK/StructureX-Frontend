// pages/Director/components/RecentProjects.jsx
import React from 'react';
import { Play, Pause, CheckCircle } from 'lucide-react';

const getStatusStyle = (status) => {
  switch (status) {
    case 'ongoing': return ['bg-green-500', <Play className="w-4 h-4" />];
    case 'hold': return ['bg-red-500', <Pause className="w-4 h-4" />];
    case 'finished': return ['bg-blue-500', <CheckCircle className="w-4 h-4" />];
    default: return ['bg-gray-500', null];
  }
};

const RecentProjects = ({ projects }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
    <div className="space-y-4">
      {projects.slice(0, 3).map(project => {
        const [bgColor, icon] = getStatusStyle(project.status);
        return (
          <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{project.name}</h4>
              <p className="text-sm text-gray-600">{project.manager}</p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${bgColor}`}>
              {icon}
              <span className="ml-1 capitalize">{project.status}</span>
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default RecentProjects;
