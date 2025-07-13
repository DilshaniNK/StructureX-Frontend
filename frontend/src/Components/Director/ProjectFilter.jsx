// pages/Director/components/ProjectFilterBar.jsx
import React from 'react';
import { Plus, Filter } from 'lucide-react';

const ProjectFilter = ({onNewProjectClick}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <button 
      className="bg-[#FAAD00] text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
      onClick={onNewProjectClick}
      >
      <Plus className="w-4 h-4" />
        <span>New Project</span>
      </button>
      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </button>
    </div>
  </div>
        
);

export default ProjectFilter;
