// SiteSupervisorCalendar.js
import React from 'react';
import SharedCalendar from '../../Components/Employee/SharedCalendar';

const siteEvents = [
  {
    title: 'Concrete Pour',
    type: 'task',
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
  },
  {
    title: 'Inspect Electrical Work',
    type: 'visit',
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
  },
  {
    title: 'Check Roof Structure',
    type: 'task',
    start: new Date(2025, 5, 12),
    end: new Date(2025, 5, 12),
  },
  {
    title: 'Safety Visit',
    type: 'visit',
    start: new Date(2025, 5, 15),
    end: new Date(2025, 5, 15),
  },
];

const siteColors = {
  task: '#2563eb', // light blue
  visit: '#16a34a'
};

export default function Calendar() {
  return (
    <SharedCalendar
      label="Site Supervisor Calendar"
      events={siteEvents}
      colorMap={siteColors}
      filterOptions={['task', 'visit']}
      eventKey="type"
      
    />
  );
}
