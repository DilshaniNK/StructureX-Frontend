import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Send, Package, Wrench, Calendar, MapPin, Hash, CheckCircle, AlertCircle, User, Clock, Eye, Check, X, ArrowRight } from 'lucide-react';

export default function InventoryRequest({ title, items = [], projects = [], type = 'Material', userRole = 'Site Supervisor', sessionUser = 'John Smith' }) {

  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [submitted, setSubmitted] = useState([]);
  const [toolSubmitted, setToolSubmitted] = useState([]);
  const [materials, setMaterials] = useState([
    { name: '', quantity: '', priority: 'Medium' }
  ]);
  const [approvalStatus, setApprovalStatus] = useState('pending');
  const [requestType, setRequestType] = useState(type);

  //fetch projects
  //fetch materials and tools requests separately
  useEffect(() => {
    fetchSites();
    fetchMaterialRequests();
    fetchToolRequests();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await axios.get('http://localhost:8086/api/v1/financial_officer');
      if (res.data) {
        setSites(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const fetchMaterialRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8086/api/v1/site_supervisor/material_requests');
      if (Array.isArray(res.data)) {
        setSubmitted(res.data); // ✅ correct variable
        console.log("Fetched requests:", res.data);
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const fetchToolRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8086/api/v1/site_supervisor/tool_requests');
      if (Array.isArray(res.data)) {
        setToolSubmitted(res.data); // ✅ correct variable
        console.log("Fetched requests:", res.data);
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };
  //-----------------------------------------------------------------------------------------------


  const handleChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const handleAdd = () => {
    setMaterials([...materials, { name: '', quantity: '', priority: 'Medium' }]);
  };

  const handleRemove = (index) => {
    if (materials.length > 1) {
      const updated = requests.filter((_, i) => i !== index);
      setMaterials(updated);
    }
  };


  //create a new request
  const handleSubmit = async () => {
    if (!selectedSite) {
      alert('Please select a project site.');
      return;
    }

    for (const req of materials) {
      /*if (!req.item || !req.qty || !req.purpose) {
        alert('Please fill in all required fields for each item.');
        return;
      }*/

      if (isNaN(parseInt(req.quantity))) {
        alert('Quantity must be a number.');
        return;
      }
    }

    const requestPayload = {
      approvalStatus: 'pending',
      requestType: requestType.toLowerCase(),
      date: new Date().toISOString().split('T')[0],
      projectId: parseInt(selectedSite),
      materials: materials.map((r) => ({
        materialName: r.name,
        quantity: parseInt(r.quantity),
        priority: r.priority,
      })),
    };
    console.log("Sending payload:", requestPayload);

    try {
      const response = await axios.post(
        'http://localhost:8086/api/v1/site_supervisor/material_request',
        requestPayload
      );
      showNotification(`${requestType} request submitted to Senior QS for approval!`, 'success');
      setSubmitted((prev) => [...prev, response.data]);
      setMaterials([{ name: '', quantity: '', priority: 'Medium' }]);
      setSelectedSite('');
    } catch (error) {
      console.error('Submission failed:', error);
      showNotification(`Submission failed: ${error.message}`, 'error');
    }
  };


  const handleQSAction = (requestId, action, comments = '') => {
    setSubmitted(prev => prev.map(req => {
      if (req.id === requestId) {
        if (action === 'approve') {
          return {
            ...req,
            status: 'QS Approved - Pending Admin',
            workflow: 'ADMIN_REVIEW',
            qsApprovalDate: new Date().toLocaleString(),
            comments: comments || 'Approved by Senior QS'
          };
        } else {
          return {
            ...req,
            status: 'QS Rejected',
            workflow: 'REJECTED',
            qsApprovalDate: new Date().toLocaleString(),
            comments: comments || 'Rejected by Senior QS'
          };
        }
      }
      return req;
    }));

    const actionText = action === 'approve' ? 'approved' : 'rejected';
    showNotification(`Request ${actionText} by Senior QS`, action === 'approve' ? 'success' : 'error');
  };

  const handleAdminAction = (requestId, action, comments = '') => {
    setSubmitted(prev => prev.map(req => {
      if (req.id === requestId) {
        if (action === 'approve') {
          return {
            ...req,
            status: 'Approved - Ready for Collection',
            workflow: 'COMPLETED',
            adminApprovalDate: new Date().toLocaleString(),
            comments: req.comments + '\n' + (comments || 'Approved by Admin - Ready for collection')
          };
        } else {
          return {
            ...req,
            status: 'Admin Rejected',
            workflow: 'REJECTED',
            adminApprovalDate: new Date().toLocaleString(),
            comments: req.comments + '\n' + (comments || 'Rejected by Admin')
          };
        }
      }
      return req;
    }));

    const actionText = action === 'approve' ? 'approved' : 'rejected';
    showNotification(`Request ${actionText} by Admin`, action === 'approve' ? 'success' : 'error');
  };


  // show notification messsage
  const showNotification = (message, type = 'success') => {
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  //priority colors setup
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Show only relevant requests based on current page type
  const materialRequests = type === 'Material'
    ? submitted.filter(entry => entry.requestType === 'materials')
    : [];

  const toolRequests = type === 'Tool'
    ? toolSubmitted.filter(entry => entry.requestType === 'tool')
    : [];


  // Get status color based on approval status
  const getStatusColor = (status) => {
    if (status.includes('pending')) return 'text-orange-600 bg-orange-100';
    if (status.includes('approved') || status.includes('Ready')) return 'text-green-600 bg-green-100';
    if (status.includes('rejected')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getWorkflowSteps = (workflow, status) => {
    const steps = [
      { label: 'Site Supervisor', icon: User, completed: true },
      { label: 'Senior QS Review', icon: Eye, completed: workflow !== 'QS_REVIEW' },
      { label: 'Admin Approval', icon: CheckCircle, completed: workflow === 'COMPLETED' }
    ];
    return steps;
  };

  const renderWorkflowProgress = (entry) => {
    const steps = getWorkflowSteps(entry.workflow, entry.status);

    return (
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              <step.icon className="w-4 h-4" />
            </div>
            <span className={`ml-2 text-sm ${step.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400 mx-3" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderActionButtons = (entry) => {
    if (userRole === 'Senior QS' && entry.workflow === 'QS_REVIEW') {
      return (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              const comments = prompt('Add comments (optional):');
              handleQSAction(entry.id, 'approve', comments);
            }}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => {
              const comments = prompt('Reason for rejection:');
              if (comments) handleQSAction(entry.id, 'reject', comments);
            }}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      );
    }

    if (userRole === 'Admin' && entry.workflow === 'ADMIN_REVIEW') {
      return (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              const comments = prompt('Add comments (optional):');
              handleAdminAction(entry.id, 'approve', comments);
            }}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Approve & Release
          </button>
          <button
            onClick={() => {
              const comments = prompt('Reason for rejection:');
              if (comments) handleAdminAction(entry.id, 'reject', comments);
            }}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      );
    }

    return null;
  };

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
                <h1 className="text-3xl font-bold text-slate-800">
                  {title || `${type} Request System`}
                </h1>
                <p className="text-slate-600 text-lg">
                  Workflow: Site Supervisor → Senior QS → Admin
                </p>
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

        {/* Request Form - Only for Site Supervisor */}
        {userRole === 'Site Supervisor' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              New {type} Request
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
                onChange={(e) => setSelectedSite(e.target.value)}
              >
                <option value="">Choose project site...</option>
                {sites.map((site) => (
                  <option key={site.projectId} value={site.projectId}>{site.name}</option>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {requestType} Name *
                        </label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Priority
                        </label>
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

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add {type}
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    Submit to Senior QS
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Request Management */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {userRole === 'Site Supervisor' ? 'My Requests' :
                    userRole === 'Senior QS' ? 'Requests for Review' : 'Requests for Approval'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {userRole === 'Site Supervisor' ? 'Track your submitted requests' :
                    userRole === 'Senior QS' ? 'Review pending requests' : 'Approve pending requests'}
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 rounded-xl px-4 py-2">
                <span className="text-sm text-slate-600">Total Requests</span>
                <p className="text-xl font-bold text-slate-800">{materialRequests.length + toolRequests.length}</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {materialRequests.length === 0 && toolRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-slate-100 rounded-full blur-3xl opacity-30"></div>
                <AlertCircle className="w-20 h-20 text-slate-300 mx-auto mb-6 relative" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No requests found</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                {userRole === 'Site Supervisor' ? 'Your submitted requests will appear here once you create them' :
                  userRole === 'Senior QS' ? 'Requests pending your review will appear here' :
                    'Requests pending your approval will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Material Requests Section */}
              {materialRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-800">Material Requests</h3>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {materialRequests.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {materialRequests.map((entry) => (
                      <div key={entry.requestId} className="group bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/60 rounded-2xl p-7 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">

                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
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
                            <span className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm ${getStatusColor(entry.approvalStatus)}`}>
                              {entry.approvalStatus}
                            </span>
                          </div>
                        </div>

                        {/* Workflow Progress */}
                        <div className="mb-6">
                          {renderWorkflowProgress(entry)}
                        </div>

                        {/* Request Details Grid */}
                        <div className="bg-slate-50/50 rounded-xl p-5 mb-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Site</div>
                              <div className="text-sm font-semibold text-slate-800 truncate">
                                {sites.find(site => site.projectId === entry.projectId)?.name || 'Unknown'}
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
                              <div key={i} className="bg-white border border-slate-200/60 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <span className="font-semibold text-slate-800 text-sm leading-tight">{r.materialName}</span>
                                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border shadow-sm ${getPriorityColor(r.priority)}`}>
                                    {r.priority}
                                  </span>
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

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-slate-200/60">
                          {renderActionButtons(entry)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Requests Section */}
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
                      <div key={entry.requestId} className="group bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/60 rounded-2xl p-7 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">

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
                            <span className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm ${getStatusColor(entry.approvalStatus)}`}>
                              {entry.approvalStatus}
                            </span>
                          </div>
                        </div>

                        {/* Workflow Progress */}
                        <div className="mb-6">
                          {renderWorkflowProgress(entry)}
                        </div>

                        {/* Request Details Grid */}
                        <div className="bg-slate-50/50 rounded-xl p-5 mb-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Site</div>
                              <div className="text-sm font-semibold text-slate-800 truncate">
                                {sites.find(site => site.projectId === entry.projectId)?.name || 'Unknown'}
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
                              <div key={i} className="bg-white border border-slate-200/60 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <span className="font-semibold text-slate-800 text-sm leading-tight">{r.materialName}</span>
                                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border shadow-sm ${getPriorityColor(r.priority)}`}>
                                    {r.priority}
                                  </span>
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

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-slate-200/60">
                          {renderActionButtons(entry)}
                        </div>
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