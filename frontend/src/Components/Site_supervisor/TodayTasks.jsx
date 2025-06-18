import React, { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const TodayTasks = ({ tasks }) => {
  const [taskList, setTaskList] = useState(tasks);

  const toggleTask = (id) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-xl w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Tasks</h2>
                      <div className="p-3 bg-green-100 rounded-xl">
                        <TaskAltIcon className="w-6 h-6 text-green-600" />
                      </div>
                    
                    </div>
      
      <ul className="space-y-4">
        {taskList.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span
                className={`text-gray-700 text-sm ${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {task.task}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 space-x-1">
              <Clock className="w-4 h-4" />
              <span>{task.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayTasks;
