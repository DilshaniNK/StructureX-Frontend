import React, { useState } from 'react';

const NewProjectForm = ({ onClose, onAdd, client }) => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('enter project name')
      return;
    }
    onAdd({
      name: projectName,
      client_id: client.client_id,
      status: "pending"
    });
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center">Add New Project</h2>
        <div className="mb-2 text-sm text-gray-600">
          For client: <span className="font-semibold">{client?.first_name} {client?.last_name}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            className="w-full border border-gray-300 p-2 rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-800"
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