import React, { useState } from 'react'

const ChangeTeam = ({project,onClose, onUpdateTeam}) => {
    const[manager,setManager] = useState(project.manager);
    const[supervisor,setSupervisor]= useState(project.supervisor);
    const handleSubmit = (e) =>{
        e.preventDefault();
        onUpdateTeam(project.id,manager,supervisor)
        onClose();
    }
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl max-w-md w-full shadow-xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Change Project Team</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <input
              type="text"
              value={manager}
              
              onChange={(e) => setManager(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
            <input
              type="text"
              value={supervisor}
              
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-yellow-400"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangeTeam
