import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Edit, Eye, X, TrendingUp, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8086/api/v1/designer';

const DesignerHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modals, setModals] = useState({
    delete: false,
    view: false,
    update: false
  });
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [updateForm, setUpdateForm] = useState({});

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/all_designs`);
      if (!res.ok) throw new Error('Failed to load designs');
      setDesigns(await res.json());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDesign = async () => {
    try {
      const res = await fetch(`${API_BASE}/delete_design/${selectedDesign.design_id}`, { method: 'DELETE' });
      if (res.ok) {
        setDesigns(designs.filter(d => d.design_id !== selectedDesign.design_id));
        closeModals();
      }
    } catch (err) {
      alert('Error deleting design');
    }
  };

  const updateDesign = async () => {
    try {
      const res = await fetch(`${API_BASE}/update_design/${selectedDesign.design_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setDesigns(designs.map(d => d.design_id === updated.design_id ? updated : d));
        closeModals();
      }
    } catch (err) {
      alert('Error updating design');
    }
  };

  const openViewModal = async (designId) => {
    const res = await fetch(`${API_BASE}/get_design/${designId}`);
    const design = await res.json();
    setSelectedDesign(design);
    setModals({ ...modals, view: true });
  };

  const openUpdateModal = async (designId) => {
    const res = await fetch(`${API_BASE}/get_design/${designId}`);
    const design = await res.json();
    setSelectedDesign(design);
    setUpdateForm({
      name: design.name,
      type: design.type,
      due_date: design.due_date,
      priority: design.priority,
      price: design.price,
      design_link: design.design_link,
      description: design.description,
      additional_note: design.additional_note,
      status: design.status,
      project_id: design.project_id
    });
    setModals({ ...modals, update: true });
  };

  const openDeleteModal = (design) => {
    setSelectedDesign(design);
    setModals({ ...modals, delete: true });
  };

  const closeModals = () => {
    setModals({ delete: false, view: false, update: false });
    setSelectedDesign(null);
  };

  const filteredDesigns = designs.filter(d => {
    const search = searchTerm.toLowerCase();
    const match = d.name?.toLowerCase().includes(search) ||
                  d.client_name?.toLowerCase().includes(search) ||
                  d.design_id?.toLowerCase().includes(search);
    const statusMatch = filterStatus === 'all' || d.status === filterStatus;
    return match && statusMatch;
  });

  const stats = {
    ongoing: designs.filter(d => d.status === 'ongoing').length,
    completed: designs.filter(d => d.status === 'completed').length,
    total: designs.length
  };

  const getStatusColor = (status) => status === 'ongoing' 
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-green-50 text-green-700 border-green-200';

  const getPriorityColor = (priority) => {
    const colors = { high: 'text-red-600 bg-red-50', medium: 'text-amber-600 bg-amber-50', low: 'text-green-600 bg-green-50' };
    return colors[priority] || colors.medium;
  };

  if (loading) return <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full"/></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-500">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Designs</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-4 border border-amber-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-600 font-semibold uppercase">Ongoing</p>
                  <p className="text-2xl font-bold text-amber-700">{stats.ongoing}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-300 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4 border border-green-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-semibold uppercase">Completed</p>
                  <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-300 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-700">{stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs, clients, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent font-medium text-gray-700 cursor-pointer"
          >
            <option value="all">All Designs</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Designs Table */}
      <div className="max-w-full mx-auto px-4 pb-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">Error: {error}</div>
        ) : filteredDesigns.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No designs found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDesigns.map((design) => (
                    <tr key={design.design_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{design.name}</p>
                          <p className="text-xs text-gray-500">{design.design_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">{design.client_name || 'Unknown'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(design.status)}`}>
                          {design.status?.charAt(0).toUpperCase() + design.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(design.priority)}`}>
                          {design.priority?.charAt(0).toUpperCase() + design.priority?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(design.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openViewModal(design.design_id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openUpdateModal(design.design_id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDeleteModal(design)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {modals.view && selectedDesign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Design Details</h3>
              <button onClick={closeModals} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Design ID</p><p className="font-medium">{selectedDesign.design_id}</p></div>
                <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Client</p><p className="font-medium">{selectedDesign.client_name}</p></div>
                <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Type</p><p className="font-medium capitalize">{selectedDesign.type}</p></div>
                <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Price</p><p className="font-medium">${selectedDesign.price}</p></div>
                <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Status</p><span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedDesign.status)}`}>{selectedDesign.status?.charAt(0).toUpperCase() + selectedDesign.status?.slice(1)}</span></div>
                <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Due Date</p><p className="font-medium">{selectedDesign.due_date}</p></div>
              </div>
              {selectedDesign.description && <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500 mb-1">Description</p><p className="text-sm">{selectedDesign.description}</p></div>}
              <button onClick={closeModals} className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {modals.update && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Update Design</h3>
              <button onClick={closeModals} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" value={updateForm.name} onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})} className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                <select value={updateForm.type} onChange={(e) => setUpdateForm({...updateForm, type: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">
                  <option value="architectural">Architectural</option>
                  <option value="structural">Structural</option>
                  <option value="electrical">Electrical</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="interior">Interior</option>
                </select>
                <select value={updateForm.priority} onChange={(e) => setUpdateForm({...updateForm, priority: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <input type="date" value={updateForm.due_date} onChange={(e) => setUpdateForm({...updateForm, due_date: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                <input type="number" placeholder="Price" value={updateForm.price} onChange={(e) => setUpdateForm({...updateForm, price: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                <select value={updateForm.status} onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
                <textarea placeholder="Description" value={updateForm.description} onChange={(e) => setUpdateForm({...updateForm, description: e.target.value})} className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none resize-none" rows="2" />
              </div>
              <div className="flex gap-3">
                <button onClick={closeModals} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={updateDesign} className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modals.delete && selectedDesign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
            <div className="bg-red-50 p-6 text-center border-b border-gray-200">
              <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">Delete Design?</h3>
              <p className="text-sm text-gray-600 mt-2">This cannot be undone</p>
            </div>
            <div className="p-6 flex gap-3">
              <button onClick={closeModals} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={deleteDesign} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerHome;