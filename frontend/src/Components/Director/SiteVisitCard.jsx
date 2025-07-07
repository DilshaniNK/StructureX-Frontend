// pages/Director/components/SiteVisitCard.jsx
import React from 'react';
import { Eye, MapPin } from 'lucide-react';

const SiteVisitCard = ({ visit }) => {
  const isCompleted = visit.status === 'completed';
  const bgColor = isCompleted ? 'bg-green-100' : 'bg-yellow-100';
  const iconColor = isCompleted ? 'text-green-600' : 'text-yellow-600';
  const statusClass = isCompleted ? 'text-green-800' : 'text-yellow-800';

  return (
    <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <MapPin className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{visit.project}</h4>
          <p className="text-sm text-gray-600">Inspector: {visit.inspector} • {visit.date}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${statusClass}`}>
          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
        </span>
        <button className="text-gray-600 hover:text-gray-900 p-2">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SiteVisitCard;
