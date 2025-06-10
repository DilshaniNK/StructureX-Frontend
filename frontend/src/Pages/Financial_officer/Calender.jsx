//npm install react-big-calendar date-fns
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Sample events with status field separate for filtering
const allEvents = [
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
];

// Colors for statuses
const statusColors = {
  pending: '#facc15', // amber
  completed: '#4ade80', // green
  overdue: '#f87171', // red
};

const CalendarView = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter events based on search and status
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Customize event style based on status color
  const eventStyleGetter = (event) => {
    const backgroundColor = statusColors[event.status] || '#3182ce'; // default blue
    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'black',
      border: 'none',
      padding: '2px 6px',
    };
    return { style };
  };

  return (
    <div>
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment Calendar</h2>

      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search project name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded px-3 py-1 flex-grow"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={setSelectedEvent}
        eventPropGetter={eventStyleGetter}
      />

      {selectedEvent && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Selected Event</h3>
          <p><strong>Project:</strong> {selectedEvent.title}</p>
          <p><strong>Amount:</strong> ${selectedEvent.amount}</p>
          <p><strong>Status:</strong> {selectedEvent.status}</p>
          <p><strong>Date:</strong> {format(selectedEvent.start, 'yyyy-MM-dd')}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default CalendarView;
