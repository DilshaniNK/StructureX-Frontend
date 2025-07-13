// pages/Director/components/ReportToolbar.jsx
import React from 'react';
import { Plus, Download } from 'lucide-react';

const DocumentToolBar = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Generate Report</span>
      </button>
      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
        <Download className="w-4 h-4" />
        <span>Download All</span>
      </button>
    </div>
  </div>
);

export default DocumentToolBar;
