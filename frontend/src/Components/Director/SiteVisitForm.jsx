// components/Director/SiteVisitForm.jsx
import React, { useState } from 'react';

const SiteVisitForm = ({ projectName, onClose, onSubmit }) => {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ projectName, note, date });
    onClose(); // close modal after submit
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Send Site Visit to QS</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <input
              type="text"
              value={projectName}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Send to QS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteVisitForm;
