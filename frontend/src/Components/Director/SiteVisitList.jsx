// pages/Director/components/SiteVisitList.jsx
import React from 'react';
import SiteVisitCard from './SiteVisitCard';

const SiteVisitList = ({ siteVisits }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Site Visit Logs</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {siteVisits.map((visit) => (
        <SiteVisitCard key={visit.id} visit={visit} />
      ))}
    </div>
  </div>
);

export default SiteVisitList;
