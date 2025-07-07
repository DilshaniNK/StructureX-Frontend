// pages/Director/Reports.jsx
import React from 'react';
import ReportToolbar from '../../Components/Director/DocumentToolBar';
import ReportCard from '../../Components/Director/DocumentCard';

const Document = () => {
  const reports = [
    { id: 1, title: "Monthly Progress Report", date: "2024-06-01", type: "Progress" },
    { id: 2, title: "Budget Analysis Q2", date: "2024-05-30", type: "Financial" },
    { id: 3, title: "Site Safety Report", date: "2024-06-05", type: "Safety" },
    { id: 4, title: "Resource Utilization", date: "2024-06-03", type: "Resources" }
  ];

  return (
    <div className="space-y-6">
      <ReportToolbar />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Generated Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Document;
