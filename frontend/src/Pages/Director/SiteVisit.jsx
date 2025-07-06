import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User, MapPin, Clock, CheckCircle, XCircle, Eye, Camera, FileText, Send, Filter, Search, Building, Users, AlertCircle, Star } from 'lucide-react';

const SiteVisitManagement = () => {
  // Sample data - in real app, this would come from your backend
  const [siteVisits, setSiteVisits] = useState([
    {
      id: 1,
      project: "Sunset Villa Complex",
      date: "2024-06-15",
      time: "09:00 AM",
      visitor: {
        name: "John Smith",
        role: "Project Manager",
        id: "PM001"
      },
      status: "pending_review",
      requestedBy: "Director",
      requestDate: "2024-06-10",
      purpose: "Quality inspection and progress review",
      location: "Phase 1 - Block A",
      findings: [
        "Foundation work completed as per specifications",
        "Minor issues with concrete finishing on 2nd floor",
        "Electrical rough-in work in progress"
      ],
      images: [
        { id: 1, name: "foundation_work.jpg", uploaded: true },
        { id: 2, name: "concrete_issue.jpg", uploaded: true },
        { id: 3, name: "electrical_progress.jpg", uploaded: true }
      ],
      notes: "Overall progress is on track. Recommend addressing concrete finishing issues before proceeding to next phase.",
      priority: "medium",
      weatherConditions: "Clear, 28°C",
      safetyIssues: [],
      recommendations: [
        "Schedule concrete repair work",
        "Increase quality control checks",
        "Coordinate with electrical contractor"
      ]
    },
    {
      id: 2,
      project: "Green Heights Apartments",
      date: "2024-06-16",
      time: "02:00 PM",
      visitor: {
        name: "Sarah Davis",
        role: "QS Officer",
        id: "QS002"
      },
      status: "completed",
      requestedBy: "Project Manager",
      requestDate: "2024-06-12",
      purpose: "Cost verification and material audit",
      location: "Main Building - All Floors",
      findings: [
        "Material quantities match approved BOQ",
        "Steel reinforcement as per drawings",
        "Some wastage observed in ceramic tiles"
      ],
      images: [
        { id: 4, name: "material_audit.jpg", uploaded: true },
        { id: 5, name: "steel_check.jpg", uploaded: true }
      ],
      notes: "Cost control measures are effective. Material wastage within acceptable limits.",
      priority: "low",
      weatherConditions: "Partly cloudy, 25°C",
      safetyIssues: [],
      recommendations: [
        "Continue current material management practices",
        "Monitor tile wastage closely"
      ]
    },
    {
      id: 3,
      project: "Commercial Plaza",
      date: "2024-06-14",
      time: "11:30 AM",
      visitor: {
        name: "Robert Brown",
        role: "Site Supervisor",
        id: "SS003"
      },
      status: "scheduled",
      requestedBy: "Director",
      requestDate: "2024-06-13",
      purpose: "Safety inspection and compliance check",
      location: "Construction Site - All Areas",
      findings: [],
      images: [],
      notes: "",
      priority: "high",
      weatherConditions: "",
      safetyIssues: [],
      recommendations: []
    }
  ]);

  const [projects] = useState([
    "Sunset Villa Complex",
    "Green Heights Apartments", 
    "Commercial Plaza",
    "Office Tower",
    "Residential Complex"
  ]);

  const [teamMembers] = useState([
    { id: "PM001", name: "John Smith", role: "Project Manager" },
    { id: "PM002", name: "Emily Chen", role: "Project Manager" },
    { id: "QS001", name: "Maria Rodriguez", role: "QS Officer" },
    { id: "QS002", name: "Sarah Davis", role: "QS Officer" },
    { id: "SS001", name: "Mike Johnson", role: "Site Supervisor" },
    { id: "SS003", name: "Robert Brown", role: "Site Supervisor" },
    { id: "ENG001", name: "David Wilson", role: "Engineer" }
  ]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [requestForm, setRequestForm] = useState({
    project: '',
    visitor: '',
    date: '',
    time: '',
    purpose: '',
    location: '',
    priority: 'medium',
    specialInstructions: ''
  });

  const handleRequestVisit = () => {
    if (requestForm.project && requestForm.visitor && requestForm.date) {
      const newVisit = {
        id: siteVisits.length + 1,
        project: requestForm.project,
        date: requestForm.date,
        time: requestForm.time,
        visitor: teamMembers.find(m => m.id === requestForm.visitor),
        status: 'scheduled',
        requestedBy: 'Director',
        requestDate: new Date().toISOString().split('T')[0],
        purpose: requestForm.purpose,
        location: requestForm.location,
        priority: requestForm.priority,
        findings: [],
        images: [],
        notes: '',
        weatherConditions: '',
        safetyIssues: [],
        recommendations: []
      };
      
      setSiteVisits(prev => [...prev, newVisit]);
      setRequestForm({
        project: '',
        visitor: '',
        date: '',
        time: '',
        purpose: '',
        location: '',
        priority: 'medium',
        specialInstructions: ''
      });
      setShowRequestModal(false);
    }
  };

  const handleCompleteVisit = (visitId) => {
    setSiteVisits(prev => 
      prev.map(visit => 
        visit.id === visitId 
          ? { ...visit, status: 'completed' }
          : visit
      )
    );
    setShowDetailModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending_review': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending_review': return 'Pending Review';
      case 'scheduled': return 'Scheduled';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredVisits = siteVisits.filter(visit => {
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    const matchesDate = !filterDate || visit.date.includes(filterDate);
    const matchesSearch = visit.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          visit.visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          visit.visitor.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesDate && matchesSearch;
  });

  const getVisitStats = () => {
    const total = siteVisits.length;
    const completed = siteVisits.filter(v => v.status === 'completed').length;
    const pending = siteVisits.filter(v => v.status === 'pending_review').length;
    const scheduled = siteVisits.filter(v => v.status === 'scheduled').length;
    
    return { total, completed, pending, scheduled };
  };

  const stats = getVisitStats();

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Site Visit Management</h1>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Request Site Visit</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project, visitor, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="pending_review">Pending Review</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Site Visits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisits.map(visit => (
          <div key={visit.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{visit.project}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)} text-white`}>
                      {getStatusText(visit.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(visit.priority)}`}>
                      {visit.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{visit.date} at {visit.time}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{visit.visitor.name} ({visit.visitor.role})</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{visit.location}</span>
                </div>
                {visit.images.length > 0 ? (
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    <span>{visit.images.length} image(s) uploaded</span>
                  </div>
                ):(
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    <span>No images uploaded</span>
                  </div>
                )}
                
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{visit.purpose}</p>
                <button
                  onClick={() => {
                    setSelectedVisit(visit);
                    setShowDetailModal(true);
                  }}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Visit Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Request Site Visit</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={requestForm.project}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                  <select
                    value={requestForm.visitor}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, visitor: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Team Member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={requestForm.date}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={requestForm.time}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={requestForm.location}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Phase 1 - Block A"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <textarea
                    value={requestForm.purpose}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="Describe the purpose of this site visit..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={requestForm.priority}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={requestForm.specialInstructions}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special instructions or requirements..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestVisit}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visit Detail Modal */}
      {showDetailModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">{selectedVisit.project} - Site Visit Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Visit Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">{selectedVisit.date} at {selectedVisit.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visitor:</span>
                        <span className="font-medium">{selectedVisit.visitor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium">{selectedVisit.visitor.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedVisit.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedVisit.status)} text-white`}>
                          {getStatusText(selectedVisit.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedVisit.priority)}`}>
                          {selectedVisit.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Purpose</h3>
                    <p className="text-sm text-gray-700">{selectedVisit.purpose}</p>
                  </div>

                  {selectedVisit.weatherConditions && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Weather Conditions</h3>
                      <p className="text-sm text-gray-700">{selectedVisit.weatherConditions}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Findings & Details */}
                <div className="space-y-4">
                  {selectedVisit.findings.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Findings</h3>
                      <ul className="space-y-2">
                        {selectedVisit.findings.map((finding, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedVisit.recommendations.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {selectedVisit.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedVisit.images.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Images ({selectedVisit.images.length})</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedVisit.images.map(image => (
                          <div key={image.id} className="bg-white rounded p-2 border text-sm">
                            <div className="flex items-center space-x-2">
                              <Camera className="w-4 h-4 text-blue-500" />
                              <span className="truncate">{image.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedVisit.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Notes</h3>
                      <p className="text-sm text-gray-700">{selectedVisit.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                {selectedVisit.status === 'pending_review' && (
                  <button
                    onClick={() => handleCompleteVisit(selectedVisit.id)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteVisitManagement;