import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Send,
  Package,
  Wrench,
  Calendar,
  Edit,
  MapPin,
  Hash,
  CheckCircle,
  AlertCircle,
  Check, Trash2,
  X,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function InventoryRequest({
  title,
  type = 'Material',
  userRole = 'Site Supervisor',
  sessionUser = 'John Smith',
}) {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [submitted, setSubmitted] = useState([]);
  const [toolSubmitted, setToolSubmitted] = useState([]);
  const [laborSubmitted, setLaborSubmitted] = useState([]);
  const [materials, setMaterials] = useState([{ id: null, name: '', quantity: '', priority: 'medium' }]);
  const { employeeId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [requestType] = useState(type);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    fetchSites();
    fetchMaterialRequests();
    fetchToolRequests();
    fetchLaborRequests();
  }, []);

  useEffect(() => {
    if (selectedSite && !sites.find((s) => s.projectId === selectedSite)) {
      setSelectedSite('');
    }
  }, [sites, selectedSite]);

  const fetchSites = async () => {
    try {
      const res = await axios.get(`http://localhost:8086/api/v1/site_supervisor/projects/${employeeId}`);
      if (res.data) setSites(res.data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const fetchMaterialRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8086/api/v1/site_supervisor/material_requests');
      if (Array.isArray(res.data)) {
        setSubmitted(res.data);
        console.log("material requests", res.data)
      } else {
        console.warn('Unexpected response format:', res.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const fetchToolRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8086/api/v1/site_supervisor/tool_requests');
      if (Array.isArray(res.data)) {
        setToolSubmitted(res.data);
        console.log("tool requests", res.data)
      } else {
        console.warn('Unexpected response format:', res.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const fetchLaborRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8086/api/v1/site_supervisor/labor_requests');
      if (Array.isArray(res.data)) {
        setLaborSubmitted(res.data);
        console.log("labor requests", res.data)
      } else {
        console.warn('Unexpected response format:', res.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const handleChange = (index, field, value) => {
    setMaterials((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };
  const handleAdd = () => setMaterials([...materials, { id: null, name: '', quantity: '', priority: 'medium' }]);
  const handleRemove = (index) => {
    if (materials.length > 1) setMaterials(materials.filter((_, i) => i !== index));
  };

  // Notification utility
  const showNotification = (message, type = 'success') => {
    const bgColor =
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  // Submit new request
  const handleSubmit = async () => {
    if (!selectedSite) {
      showNotification('Please select a project site.', 'error');
      return;
    }
    for (const req of materials) {
      if (!req.name || !req.quantity) {
        showNotification('Please fill in all fields for each item.', 'error');
        return;
      }
      if (isNaN(parseInt(req.quantity))) {
        showNotification('Quantity must be a number.', 'error');
        return;
      }
    }
    const requestPayload = {
      pmApproval: 'Pending',
      qsApproval: 'Pending',
      requestType: requestType.toLowerCase(),
      date: new Date().toISOString().split('T')[0],
      projectId: selectedSite,
      siteSupervisorId: employeeId,
      qsId: sites.find((s) => s.projectId === selectedSite)?.qsId || '',
      pmId: sites.find((s) => s.projectId === selectedSite)?.qsId || '',
      isReceived: 0,
      materials: materials.map((r) => ({
        materialName: r.name,
        quantity: parseInt(r.quantity),
        priority: r.priority,
      })),
    };
    try {
      const response = await axios.post(
        'http://localhost:8086/api/v1/site_supervisor/material_request',
        requestPayload
      );
      showNotification(`${requestType} request submitted to Senior QS for approval!`, 'success');
      setSubmitted((prev) => [...prev, response.data]);
      setMaterials([{ id: null, name: '', quantity: '', priority: 'medium' }]);
      setSelectedSite('');
    } catch (error) {
      showNotification(`Submission failed: ${error.message}`, 'error');
    }
  };

  // Only allow editing when both pmApproval and qsApproval are "pending"
  const startEditing = (request) => {
    if ((request.pmApproval || "").toLowerCase() !== "pending" ||
      (request.qsApproval || "").toLowerCase() !== "pending") {
      showNotification("Editing is allowed only before any approval.", "error");
      return;
    }

    setEditingRequest(request); // store the whole request
    setMaterials(
      (request.materials || []).map((m) => ({
        id: m.id,
        name: m.materialName,
        quantity: m.quantity,
        priority: m.priority,
      }))
    );
    setSelectedSite(request.projectId);
    setIsEditing(true);
  };

  const getEditingRequest = () => submitted.find((r) => r.requestId === editingRequestId);

  // Update existing request
  const handleUpdateRequest = async () => {
    const request = editingRequest; // use the stored object
    console.log("updating", request);

    if (!request) return;

    if ((request.pmApproval || "").toLowerCase() !== 'pending' ||
      (request.qsApproval || "").toLowerCase() !== 'pending') {
      showNotification("You can't update after approval/rejection.", "error");
      setIsEditing(false);
      setEditingRequest(null);
      return;
    }

    try {
      const payload = {
        requestId: request.requestId,
        projectId: selectedSite,
        isReceived: true,
        pmApproval: request.pmApproval,
        qsApproval: request.qsApproval,
        materials: materials.map((m) => ({
          id: m.id,
          materialName: m.name,
          quantity: parseInt(m.quantity),
          priority: m.priority,
        })),
      };

      console.log("editing payload", payload);

      await axios.put('http://localhost:8086/api/v1/site_supervisor/request/update', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      showNotification('Request updated successfully!', 'success');
      fetchMaterialRequests();

      setIsEditing(false);
      setEditingRequest(null);
      setMaterials([{ id: null, name: '', quantity: '', priority: 'medium' }]);
      setSelectedSite('');
    } catch (err) {
      showNotification('Update failed: ' + (err.response?.data || err.message), 'error');
    }
  };

  const toggleDeliveryStatus = async (entry) => {
    const updatedStatus = !entry.isReceived; // toggle true/false

    try {
      await axios.put(`http://localhost:8086/api/v1/site_supervisor/request/update`, {
        requestId: entry.requestId,
        projectId: entry.projectId,
        isReceived: updatedStatus,
      });

      // Update the local state to reflect the new value
      setLaborSubmitted((prev) =>
        prev.map((r) =>
          r.requestId === entry.requestId ? { isReceived: updatedStatus } : r
        )
      );

      showNotification(
        updatedStatus ? "Marked as Delivered" : "Marked as Not Delivered",
        "success"
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
      //showNotification("Failed to update delivery status", "error");
    }
  };



  const handleDelete = async (requestId) => {
    const confirmed = window.confirm("Are you sure you want to delete this request? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:8086/api/v1/site_supervisor/request/${requestId}`);

      // Update the local state to remove the deleted request
      setSubmitted(prevSubmitted =>
        prevSubmitted.filter(req => req.requestId !== requestId)
      );
      // Assuming toolSubmitted should also be filtered if it's a tool request
      setToolSubmitted(prevToolSubmitted =>
        prevToolSubmitted.filter(req => req.requestId !== requestId)
      );

      // Assuming toolSubmitted should also be filtered if it's a tool request
      setLaborSubmitted(prevLaborSubmitted =>
        prevLaborSubmitted.filter(req => req.requestId !== requestId)
      );

      // Reset form state if needed (only if the deleted item was currently being edited)
      if (editingRequestId === requestId) {
        setIsEditing(false);
        setEditingRequestId(null);
        setMaterials([{ id: null, name: '', quantity: '', priority: 'medium' }]);
        setSelectedSite(''); // Clear selected site too
      }

      showNotification('Request deleted successfully!', 'success'); // Clear success message

    } catch (error) {
      console.error('Error deleting request:', error);
      // Provide a more specific error message from the backend if available
      const errorMessage = error.response?.data?.message || 'Please try again.';
      showNotification(`Failed to delete request: ${errorMessage}`, 'error');
    }
  };




  // Filter requests for UI
  const materialRequests = type === 'Material' ? submitted.filter((e) => e.requestType === 'material') : [];
  const toolRequests = type === 'Tool' ? toolSubmitted.filter((e) => e.requestType === 'tool') : [];
  const laborRequests = type === 'Labor' ? laborSubmitted.filter((e) => e.requestType === 'labor') : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {type === 'Material' ? (
                <Package className="w-8 h-8 text-blue-600" />
              ) : (
                <Wrench className="w-8 h-8 text-purple-600" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{title || `${type} Request System`}</h1>
                <p className="text-slate-600 text-lg">Workflow: Site Supervisor → Project Manager → QS</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                <div className="font-medium">Logged in as</div>
                <div className="text-sm">{sessionUser}</div>
                <div className="text-xs text-blue-600">{userRole}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Form */}
        {userRole === 'Site Supervisor' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              {isEditing ? `Edit ${type} Request` : `New ${type} Request`}
            </h2>

            {/* Project Site Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select Project Site *
              </label>
              <select
                className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                value={selectedSite}
                disabled={isEditing}
                onChange={(e) => setSelectedSite(e.target.value)}
              >
                <option value="">Choose project site...</option>
                {sites.map((site) => (
                  <option key={site.projectId} value={site.projectId}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Request Items */}
            {selectedSite && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Request Items</h3>
                {materials.map((req, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-700">Item #{idx + 1}</h4>
                      {materials.length > 1 && (
                        <button
                          onClick={() => handleRemove(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors text-xl"
                          title="Remove item"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{requestType} Name *</label>
                        <input
                          type="text"
                          value={req.name}
                          onChange={(e) => handleChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`Enter ${requestType} name`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={req.quantity}
                          onChange={(e) => handleChange(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="0"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                        <select
                          value={req.priority}
                          onChange={(e) => handleChange(idx, 'priority', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdateRequest}
                        className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md"
                      >
                        <Check className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditingRequestId(null);
                          setMaterials([{ name: '', quantity: '', priority: 'medium' }]);
                          setSelectedSite('');
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add {type}
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                      >
                        <Send className="w-4 h-4" /> Submit to PM
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Request Management Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {userRole === 'Site Supervisor'
                    ? 'My Requests'
                    : userRole === 'Senior QS'
                      ? 'Requests for Review'
                      : 'Requests for Approval'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {userRole === 'Site Supervisor'
                    ? 'Track your submitted requests'
                    : userRole === 'Senior QS'
                      ? 'Review pending requests'
                      : 'Approve pending requests'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 rounded-xl px-4 py-2">
                <span className="text-sm text-slate-600">Total Requests</span>
                <p className="text-xl font-bold text-slate-800">
                  {materialRequests.length + toolRequests.length + laborRequests.length}
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {materialRequests.length === 0 && toolRequests.length === 0 && laborRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-slate-100 rounded-full blur-3xl opacity-30"></div>
                <AlertCircle className="w-20 h-20 text-slate-300 mx-auto mb-6 relative" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No requests found</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                {userRole === 'Site Supervisor'
                  ? 'Your submitted requests will appear here once you create them'
                  : userRole === 'Senior QS'
                    ? 'Requests pending your review will appear here'
                    : 'Requests pending your approval will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Material Requests */}
              {materialRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-800">Material Requests</h3>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {materialRequests.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {materialRequests.map((entry) => (
                      <div
                        key={entry.requestId}
                        className="group bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/60 rounded-2xl p-7 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">
                                #{entry.requestId.toString().slice(-2)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg">
                                Request #{entry.requestId.toString().slice(-6)}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>{entry.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-2 rounded-xl text-xs font-semibold shadow-sm ">
                              {entry.pmApproval === 'rejected'
                                ? 'Rejected'
                                : entry.pmApproval === 'Approved' && entry.qsApproval === 'Approved'
                                  ? 'approved'
                                  : entry.pmApproval === 'Approved' && entry.qsApproval === 'Rejected'
                                    ? 'rejected'
                                    : entry.pmApproval === 'Approved' && entry.qsApproval === 'Pending'
                                      ? 'PM approved'
                                      : 'pending'}
                            </span>
                            <button
                              onClick={() => toggleDeliveryStatus(entry)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm 
      ${entry.isReceived
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                              {entry.isReceived ? 'Delivered' : 'Mark as Delivered'}
                            </button>
                          </div>
                        </div>
                        {/* Details */}
                        <div className="bg-slate-50/50 rounded-xl p-5 mb-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Site</div>
                              <div className="text-sm font-semibold text-slate-800 truncate">
                                {sites.find((site) => site.projectId === entry.projectId)?.name || 'Unknown'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Type</div>
                              <div className="text-sm font-semibold text-slate-800">{entry.requestType}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Items</div>
                              <div className="text-sm font-semibold text-slate-800">{entry.materials.length} items</div>
                            </div>
                          </div>
                        </div>
                        {/* Requested Items */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Requested Items
                          </h5>
                          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                            {entry.materials.map((r, i) => (
                              <div
                                key={i}
                                className="bg-white border border-slate-200/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className="font-semibold text-slate-800 text-sm leading-tight">{r.materialName}</span>
                                  <span className="px-3 py-1 rounded-lg text-xs font-medium border shadow-sm ">{r.priority}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-500">Qty:</span>
                                    <span className="font-semibold text-slate-700">{r.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Edit Button */}
                        <button
                          onClick={() => startEditing(entry)}
                          disabled={entry.pmApproval !== 'Pending' || entry.qsApproval !== 'Pending'}
                          className={`p-2 rounded-lg transition-colors ${entry.pmApproval === 'Pending' && entry.qsApproval === 'Pending'
                            ? 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                            }`}
                          title={
                            entry.pmApproval !== 'Pending' || entry.qsApproval !== 'Pending'
                              ? 'Editing not allowed after approval'
                              : 'Edit'
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(entry.requestId)} >
                          <Trash2 className="h-4 w-4 text-red-700 " />
                        </button>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Requests */}
              {toolRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-800">Tool Requests</h3>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      {toolRequests.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {toolRequests.map((entry) => (
                      <div
                        key={entry.requestId}
                        className="group bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/60 rounded-2xl p-7 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">#{entry.requestId.toString().slice(-2)}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg">
                                Request #{entry.requestId.toString().slice(-6)}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>{entry.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-2 rounded-xl text-xs font-semibold shadow-sm ">
                              {entry.pmApproval === 'rejected'
                                ? 'Rejected'
                                : entry.pmApproval === 'Approved' && entry.qsApproval === 'Approved'
                                  ? 'approved'
                                  : entry.pmApproval === 'Approved' && entry.qsApproval === 'Rejected'
                                    ? 'rejected'
                                    : entry.pmApproval === 'Approved' && entry.qsApproval === 'Pending'
                                      ? 'PM approved'
                                      : 'pending'}
                            </span>
                            <button
                              onClick={() => toggleDeliveryStatus(entry)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm 
      ${entry.isReceived
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                              {entry.isReceived ? 'Delivered' : 'Mark as Delivered'}
                            </button>
                          </div>
                        </div>
                        {/* Details Grid */}
                        <div className="bg-slate-50/50 rounded-xl p-5 mb-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Site</div>
                              <div className="text-sm font-semibold text-slate-800 truncate">
                                {sites.find((site) => site.projectId === entry.projectId)?.name || 'Unknown'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Type</div>
                              <div className="text-sm font-semibold text-slate-800">{entry.requestType}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Items</div>
                              <div className="text-sm font-semibold text-slate-800">{entry.materials.length} items</div>
                            </div>
                          </div>
                        </div>
                        {/* Requested Items */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Requested Items
                          </h5>
                          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                            {entry.materials.map((r, i) => (
                              <div
                                key={i}
                                className="bg-white border border-slate-200/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className="font-semibold text-slate-800 text-sm leading-tight">{r.materialName}</span>
                                  <span className="px-3 py-1 rounded-lg text-xs font-medium border shadow-sm">{r.priority}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-500">Qty:</span>
                                    <span className="font-semibold text-slate-700">{r.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => startEditing(entry)}
                          disabled={entry.pmApproval !== 'Pending' || entry.qsApproval !== 'Pending'}
                          className={`p-2 rounded-lg transition-colors ${entry.pmApproval === 'Pending' && entry.qsApproval === 'Pending'
                            ? 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                            }`}
                          title={
                            entry.pmApproval !== 'Pending' || entry.qsApproval !== 'Pending'
                              ? 'Editing not allowed after approval'
                              : 'Edit'
                          }

                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button onClick={() => handleDelete(entry.requestId)}>
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Labour Requests */}
              {laborRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-800">Labour Requests</h3>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      {laborRequests.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {laborRequests.map((entry) => (
                      <div
                        key={entry.requestId}
                        className="group bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/60 rounded-2xl p-7 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">#{entry.requestId.toString().slice(-2)}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg">
                                Request #{entry.requestId.toString().slice(-6)}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>{entry.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-2 rounded-xl text-xs font-semibold shadow-sm ">
                              {entry.pmApproval === 'rejected'
                                ? 'Rejected'
                                : entry.pmApproval === 'Approved' && entry.qsApproval === 'Approved'
                                  ? 'approved'
                                  : entry.pmApproval === 'Approved' && entry.qsApproval === 'Rejected'
                                    ? 'rejected'
                                    : entry.pmApproval === 'Approved' && entry.qsApproval === 'Pending'
                                      ? 'PM approved'
                                      : 'pending'}
                            </span>
                            <button
                              onClick={() => toggleDeliveryStatus(entry)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm 
      ${entry.isReceived
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                              {entry.isReceived ? 'Delivered' : 'Mark as Delivered'}
                            </button>
                          </div>
                        </div>
                        {/* Details Grid */}
                        <div className="bg-slate-50/50 rounded-xl p-5 mb-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Site</div>
                              <div className="text-sm font-semibold text-slate-800 truncate">
                                {sites.find((site) => site.projectId === entry.projectId)?.name || 'Unknown'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Type</div>
                              <div className="text-sm font-semibold text-slate-800">{entry.requestType}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Items</div>
                              <div className="text-sm font-semibold text-slate-800">{entry.materials.length} items</div>
                            </div>
                          </div>
                        </div>
                        {/* Requested Items */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Requested Items
                          </h5>
                          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                            {entry.materials.map((r, i) => (
                              <div
                                key={i}
                                className="bg-white border border-slate-200/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className="font-semibold text-slate-800 text-sm leading-tight">{r.materialName}</span>
                                  <span className="px-3 py-1 rounded-lg text-xs font-medium border shadow-sm">{r.priority}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-500">Qty:</span>
                                    <span className="font-semibold text-slate-700">{r.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => startEditing(entry)}
                          disabled={entry.pmApproval !== 'Pending' || entry.qsApproval !== 'Pending'}
                          className={`p-2 rounded-lg transition-colors ${entry.pmApproval === 'Pending' && entry.qsApproval === 'Pending'
                            ? 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                            }`}
                          title={
                            entry.pmApproval !== 'Pending' || entry.qsApproval !== 'Pending'
                              ? 'Editing not allowed after approval'
                              : 'Edit'
                          }

                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button onClick={() => handleDelete(entry.requestId)}>
                          <Trash2 className="h-4 w-4" />
                        </button>


                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
