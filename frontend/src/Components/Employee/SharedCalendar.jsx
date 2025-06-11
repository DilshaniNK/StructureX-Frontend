// CustomCalendar.js
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

const SharedCalendar = ({
  events,
  colorMap,
  label = 'Calendar',
  filterOptions = [],
  eventKey = 'status', // can be 'status' or 'type'
}) => {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState([]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter === 'all' || event[eventKey] === filter;
    return matchesSearch && matchesFilter;
  });

  const eventStyleGetter = (event) => {
    const backgroundColor = colorMap[event[eventKey]] || '#eab308';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        color: 'white',
        padding: '2px 6px',
      },
    };
  };

  const handleSelectSlot = ({ start }) => {
    const selectedDate = format(start, 'yyyy-MM-dd');
    const dayEvents = filteredEvents.filter(
      (e) => format(e.start, 'yyyy-MM-dd') === selectedDate
    );
    setSelectedEvents(dayEvents);
  };

  // ✅ Fixed CustomToolbar
  const CustomToolbar = ({ label, onNavigate, view, onView }) => {
    const handleViewChange = (e) => {
      onView(e.target.value);
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button onClick={() => onNavigate('PREV')} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">‹</button>
          <button onClick={() => onNavigate('TODAY')} className="bg-yellow-500 text-white  text-bold px-3 py-1 rounded ">Today</button>
          <button onClick={() => onNavigate('NEXT')} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">›</button>
        </div>

        <h2 className="text-xl font-semibold">{label}</h2>

        <select
          onChange={handleViewChange}
          value={view}
          className="border rounded px-3 py-1"
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
          <option value="agenda">Agenda</option>
        </select>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{label}</h2>

      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded px-3 py-1 flex-grow"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option[0].toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(e) => setSelectedEvents([e])}
        eventPropGetter={eventStyleGetter}
        components={{ toolbar: CustomToolbar }}
        defaultView="month"
      />

      {selectedEvents.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            Events on {format(selectedEvents[0].start, 'yyyy-MM-dd')}
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {selectedEvents.map((event, idx) => (
              <li key={idx}>
                <strong>{event.title}</strong> 
                {event.amount && <> Amount: ${event.amount} —</>}
                {event.status && <> Status: {event.status}</>}
               
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SharedCalendar;
