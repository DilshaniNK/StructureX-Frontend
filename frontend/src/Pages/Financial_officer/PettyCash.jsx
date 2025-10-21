import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const API_BASE = 'http://localhost:8086/api/v1/financial_officer';

const PettyCash = () => {
  const [projects, setProjects] = useState([]);
  const [pettyCashRecords, setPettyCashRecords] = useState([]);
  const [formData, setFormData] = useState({
    pettyCashId: 0,
    projectId: '',
    employeeId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchPettyCashRecords();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPettyCashRecords = async () => {
    try {
      const res = await fetch(`${API_BASE}/petty_cash`);
      if (!res.ok) throw new Error('Failed to fetch petty cash records');
      const data = await res.json();
      setPettyCashRecords(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p.projectId === projectId);
    setFormData({
      ...formData,
      projectId,
      employeeId: project ? project.ssId : '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.projectId || !formData.employeeId || !formData.amount || !formData.date) {
      setError('All fields are required');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);

      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(`${API_BASE}/petty_cash`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Operation failed');
      }

      setSuccess(editing ? 'Petty cash updated successfully' : 'Petty cash created successfully');
      setFormData({
        pettyCashId: 0,
        projectId: '',
        employeeId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });
      setEditing(false);
      fetchPettyCashRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditing(true);
    setFormData({
      pettyCashId: record.pettyCashId,
      projectId: record.projectId,
      employeeId: record.employeeId,
      amount: record.amount,
      date: record.date,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/petty_cash/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Delete failed');
      }
      setSuccess('Petty cash deleted successfully');
      fetchPettyCashRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      pettyCashId: 0,
      projectId: '',
      employeeId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Petty Cash Management</h1>
              <p className="text-slate-600 mt-1">Track and manage petty cash disbursements</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="ml-3 text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <Save className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="ml-3 text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editing ? 'Update Record' : 'New Entry'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-slate-800"
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.projectId} value={p.projectId}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Site Supervisor
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount (LKR)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>{editing ? 'Updating...' : 'Submitting...'}</span>
                    ) : (
                      <React.Fragment>
                        <Save className="w-4 h-4" />
                        {editing ? 'Update' : 'Submit'}
                      </React.Fragment>
                    )}
                  </button>
                  
                  {editing && (
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Petty Cash Records</h2>
                <p className="text-sm text-slate-600 mt-1">{pettyCashRecords.length} total records</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Supervisor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pettyCashRecords.length > 0 ? (
                      pettyCashRecords.map(record => (
                        <tr key={record.pettyCashId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-800 font-medium">#{record.pettyCashId}</td>
                          <td className="px-6 py-4 text-sm text-slate-800">{record.projectId}</td>
                          <td className="px-6 py-4 text-sm text-slate-800">{record.employeeId}</td>
                          <td className="px-6 py-4 text-sm text-slate-800 font-semibold">LKR {parseFloat(record.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 text-sm text-slate-800">{record.date}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(record)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(record.pettyCashId)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                          <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="text-lg font-medium">No records found</p>
                          <p className="text-sm mt-1">Create your first petty cash entry to get started</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PettyCash;