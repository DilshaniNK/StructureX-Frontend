// pages/Director/components/OverviewStats.jsx
import React from 'react';
import { FolderOpen, Play, Pause, CheckCircle } from 'lucide-react';

const OverviewStats = ({ projects }) => {
  const total = projects.length;
  const ongoing = projects.filter(p => p.status === 'ongoing').length;
  const hold = projects.filter(p => p.status === 'hold').length;
  const finished = projects.filter(p => p.status === 'finished').length;

  const statItems = [
    { label: 'Total Projects', value: total, icon: <FolderOpen className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100' },
    { label: 'Active Projects', value: ongoing, icon: <Play className="w-6 h-6 text-green-600" />, bg: 'bg-green-100' },
    { label: 'On Hold', value: hold, icon: <Pause className="w-6 h-6 text-red-600" />, bg: 'bg-red-100' },
    { label: 'Completed', value: finished, icon: <CheckCircle className="w-6 h-6 text-yellow-600" />, bg: 'bg-yellow-100' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`${item.bg} p-3 rounded-lg`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
