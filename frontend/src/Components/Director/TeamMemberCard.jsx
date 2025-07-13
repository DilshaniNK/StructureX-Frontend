// pages/Director/components/TeamMemberCard.jsx
import React from 'react';
import { Eye } from 'lucide-react';

const TeamMemberCard = ({ name, color }) => {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = color === 'yellow' ? 'bg-yellow-500 text-black' : 'bg-black text-yellow-500';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${bgColor}`}>
          {initial}
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      <button className="text-gray-600 hover:text-gray-900 p-1">
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TeamMemberCard;
