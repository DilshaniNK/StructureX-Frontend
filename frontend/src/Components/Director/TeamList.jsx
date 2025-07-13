import React from 'react';
import TeamMemberCard from './TeamMemberCard';

const TeamList = ({ title, members, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {members.map((name, idx) => (
          <TeamMemberCard key={idx} name={name} color={color} />
        ))}
      </div>
    </div>
  );
};

export default TeamList;
