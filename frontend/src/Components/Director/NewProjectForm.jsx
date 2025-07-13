// Components/Director/NewProjectModal.jsx
import React, { useState } from 'react';

const NewProjectForm = ({ onClose, onAdd }) => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !location) return;

    const newProject = {
      id: Date.now(),
      name: projectName,
      location,
      status: 'Initialize',
      progress: 0,
      manager: 'To Assign',
      supervisor: 'To Assign',
      startDate: new Date().toISOString().split('T')[0],
      endDate: 'TBD',
      budget: 'TBD',
      note,
      
    };
    onAdd(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50  backdrop-blur-sm flex items-center justify-center  p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            className="w-full border border-gray-300 p-2 rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full border border-gray-300 p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <textarea
            placeholder="Note about the project"
            className="w-full border border-gray-300 p-2 rounded"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;
