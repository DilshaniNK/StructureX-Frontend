import React, { useState } from 'react';
import { Plus, Send, Package, Wrench, Calendar, MapPin, Hash, CheckCircle, AlertCircle, User, Clock, Eye, Check, X, ArrowRight } from 'lucide-react';

export default function InventoryRequest({ title, items = [], projects = [], type = 'Material', userRole = 'Site Supervisor', sessionUser = 'John Smith' }) {
  const [selectedSite, setSelectedSite] = useState('');
  const [requests, setRequests] = useState([{ item: '', qty: '', purpose: '', priority: 'Medium' }]);
  const [submitted, setSubmitted] = useState([]);

  // Sample data for demo purposes
  const sampleItems = items.length > 0 ? items : [
    { name: 'Steel Rebar 12mm', category: 'Construction', unit: 'kg', estimatedCost: 250 },
    { name: 'Concrete Mix', category: 'Construction', unit: 'bags', estimatedCost: 45 },
    { name: 'Power Drill', category: 'Tools', unit: 'pieces', estimatedCost: 150 },
    { name: 'Safety Helmet', category: 'Safety', unit: 'pieces', estimatedCost: 25 },
    { name: 'Welding Rods', category: 'Welding', unit: 'kg', estimatedCost: 180 }
  ];

  const sampleProjects = projects.length > 0 ? projects : [
    'Site A - Downtown Office',
    'Site B - Industrial Complex',
    'Site C - Residential Tower',
    'Site D - Infrastructure Project'
  ];

  const handleChange = (index, field, value) => {
    const updated = [...requests];
    updated[index][field] = value;
    setRequests(updated);
  };

  const handleAdd = () => {
    setRequests([...requests, { item: '', qty: '', purpose: '', priority: 'Medium' }]);
  };

  const handleRemove = (index) => {
    if (requests.length > 1) {
      const updated = requests.filter((_, i) => i !== index);
      setRequests(updated);
    }
  };

  const handleSubmit = () => {
    if (!selectedSite) {
      alert('Please select a project site.');
      return;
    }
    if (requests.some(req => !req.item || !req.qty || !req.purpose)) {
      alert('Please fill in all required fields for each item.');
      return;
    }

    const record = {
      id: Date.now(),
      site: selectedSite,
      type,
      date: new Date().toISOString().split('T')[0],
      requestor: sessionUser, // From session
      requestorRole: userRole,
      requests: requests.filter(req => req.item && req.qty && req.purpose),
      status: 'Pending QS Approval',
      workflow: 'QS_REVIEW',
      timestamp: new Date().toLocaleString(),
      comments: '',
      qsApprovalDate: null,
      adminApprovalDate: null
    };

    setSubmitted((prev) => [...prev, record]);
    setRequests([{ item: '', qty: '', purpose: '', priority: 'Medium' }]);
    setSelectedSite('');
    
    showNotification(`${type} request submitted to Senior QS for approval!`, 'success');
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

  const showNotification = (message, type = 'success') => {
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Pending')) return 'text-orange-600 bg-orange-100';
    if (status.includes('Approved') || status.includes('Ready')) return 'text-green-600 bg-green-100';
    if (status.includes('Rejected')) return 'text-red-600 bg-red-100';
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
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
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
                {sampleProjects.map((site) => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>

            {/* Request Items */}
            {selectedSite && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Request Items</h3>
                
                {requests.map((req, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-700">Item #{idx + 1}</h4>
                      {requests.length > 1 && (
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
                          {type} Name *
                        </label>
                        <select
                          value={req.item}
                          onChange={(e) => handleChange(idx, 'item', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select {type.toLowerCase()}</option>
                          {sampleItems.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={req.qty}
                          onChange={(e) => handleChange(idx, 'qty', e.target.value)}
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

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Purpose *
                        </label>
                        <input
                          type="text"
                          value={req.purpose}
                          onChange={(e) => handleChange(idx, 'purpose', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Usage purpose"
                        />
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {userRole === 'Site Supervisor' ? 'My Requests' : 
             userRole === 'Senior QS' ? 'Requests for Review' : 'Requests for Approval'}
          </h2>

          {submitted.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No requests found</p>
              <p className="text-slate-400">
                {userRole === 'Site Supervisor' ? 'Your submitted requests will appear here' :
                 userRole === 'Senior QS' ? 'Requests pending your review will appear here' :
                 'Requests pending your approval will appear here'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {submitted
                .filter(entry => {
                  if (userRole === 'Site Supervisor') return entry.requestor === sessionUser;
                  if (userRole === 'Senior QS') return entry.workflow === 'QS_REVIEW';
                  if (userRole === 'Admin') return entry.workflow === 'ADMIN_REVIEW' || entry.workflow === 'COMPLETED';
                  return true;
                })
                .map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        Request #{entry.id.toString().slice(-6)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>

                  {/* Workflow Progress */}
                  {renderWorkflowProgress(entry)}

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Site:</span>
                        <div className="text-slate-600">{entry.site}</div>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Requestor:</span>
                        <div className="text-slate-600">{entry.requestor}</div>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Type:</span>
                        <div className="text-slate-600">{entry.type}</div>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Items:</span>
                        <div className="text-slate-600">{entry.requests.length} items</div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-700 mb-2">Requested Items</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {entry.requests.map((r, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-slate-800 text-sm">{r.item}</span>
                            <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(r.priority)}`}>
                              {r.priority}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            <span className="font-medium">Qty:</span> {r.qty}
                            <span className="mx-2">•</span>
                            <span className="font-medium">Purpose:</span> {r.purpose}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  {entry.comments && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-700 mb-1">Comments:</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{entry.comments}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {renderActionButtons(entry)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}