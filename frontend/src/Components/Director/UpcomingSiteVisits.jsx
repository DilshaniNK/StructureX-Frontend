// pages/Director/components/UpcomingSiteVisits.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const UpcomingSiteVisits = ({ siteVisits }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Site Visits</h3>
    <div className="space-y-4">
      {siteVisits.map(visit => (
        <div key={visit.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div>
            <h4 className="font-medium text-gray-900">{visit.project}</h4>
            <p className="text-sm text-gray-600">{visit.date}</p>
          </div>
          <div className="text-yellow-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingSiteVisits;
