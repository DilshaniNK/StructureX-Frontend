import React, { useEffect, useState } from 'react';
import SharedCalendar from '../../Components/Employee/SharedCalendar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const colorMap = {
  pending: '#f59e0b',    // amber
  completed: '#10b981',  // green
  inprogress: '#3b82f6', // blue
  canceled: '#ef4444',   // red
};

function SiteSupervisorCalendar({ siteSupervisorId }) {
  const [tasks, setTasks] = useState([]);
  const {employeeId} =useParams();

  useEffect(() => {
  axios.get(`/api/v1/site_supervisor/todo/sp/${employeeId}`)
    .then((res) => {
      const rawTasks = Array.isArray(res.data.data) ? res.data.data : [];
      const events = rawTasks.map(task => ({
        title: task.description,
        start: new Date(task.date),
        end: new Date(task.date),
        status: task.status.toLowerCase(),
      }));
      setTasks(events);
    })
    .catch((err) => {
      console.error('Failed to fetch tasks:', err);
    });
}, [employeeId]);


  return (
    <SharedCalendar
      events={tasks}
      colorMap={colorMap}
      label="To-Do Tasks"
      filterOptions={['pending', 'completed', 'inprogress', 'canceled']}
      eventKey="status"
    />
  );
}

export default SiteSupervisorCalendar;
