import React from 'react';
import SharedCalendar from '../../Components/Employee/SharedCalendar'

const financialEvents = [
  {
    title: 'Bridge Repair',
    amount: 1200,
    status: 'pending',
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
  },
  {
    title: 'Library Renovation',
    amount: 850,
    status: 'overdue',
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
  },
  {
    title: 'School Fence',
    amount: 450,
    status: 'pending',
    start: new Date(2025, 5, 12),
    end: new Date(2025, 5, 12),
  },
  {
    title: 'Community Center',
    amount: 1000,
    status: 'completed',
    start: new Date(2025, 5, 15),
    end: new Date(2025, 5, 15),
  },
  // add more events relevant to financial officer
];

const financialColorMap = {
  completed: '#16a34a', // green-600
  pending: '#2563eb',  // yellow-400
  overdue: '#dc2626', // red-600
};

export default function FinancialOfficerCalendar() {
  return (
    <SharedCalendar
      events={financialEvents}
      colorMap={financialColorMap}
      label="Financial Officer Calendar"
      filterOptions={['completed', 'pending', 'overdue']}
      eventKey="status"
    />
  );
}
