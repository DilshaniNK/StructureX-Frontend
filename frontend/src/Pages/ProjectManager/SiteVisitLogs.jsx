import React, { useState } from 'react';
import { Plus, Check , Search, CircleCheckBig , CircleMinus , Calendar, Camera, Download, Filter, MapPin, Clock, User, Edit, X, Save } from 'lucide-react';

const SiteVisitLogs = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [visits, setVisits] = useState([
    {
      id: 1,
      date: '2024-11-20',
      time: '10:30 AM',
      visitor: 'John Smith',
      role: 'Project Manager',
      purpose: 'Weekly Progress Inspection',
      remarks: 'Foundation work completed successfully. Minor delay in material delivery expected.',
      images: ['photo1.jpg', 'photo2.jpg'],
      weather: 'Sunny',
      status: 'Completed',
      project: 'Downtown Office Complex',
      duration: '2 hours',
      attendees: ['Site Supervisor', 'Safety Officer'],
      findings: ['Foundation quality excellent', 'Material delivery schedule needs adjustment'],
      recommendations: ['Order materials 2 days earlier', 'Increase safety signage']
    },
    {
      id: 2,
      date: '2024-11-18',
      time: '2:15 PM',
      visitor: 'Sarah Johnson',
      role: 'Safety Inspector',
      purpose: 'Safety Compliance Check',
      remarks: 'All safety protocols being followed. Recommended additional signage for visitor area.',
      images: ['safety1.jpg'],
      weather: 'Cloudy',
      status: 'Completed',
      project: 'Residential Towers',
      duration: '1.5 hours',
      attendees: ['Site Manager', 'Safety Team'],
      findings: ['Safety protocols compliant', 'Visitor area needs improvement'],
      recommendations: ['Install additional safety signage', 'Create designated visitor path']
    },
    {
      id: 3,
      date: '2024-11-15',
      time: '9:00 AM',
      visitor: 'Mike Chen',
      role: 'Client Representative',
      purpose: 'Quality Review',
      remarks: 'Overall satisfied with progress. Requested changes to interior layout discussed.',
      images: ['interior1.jpg', 'interior2.jpg', 'interior3.jpg'],
      weather: 'Rainy',
      status: 'Follow-up Required',
      project: 'Shopping Mall Renovation',
      duration: '3 hours',
      attendees: ['Project Manager', 'Architect', 'Interior Designer'],
      findings: ['Quality meets standards', 'Interior layout needs revision'],
      recommendations: ['Revise interior layout plan', 'Schedule follow-up meeting']
    },
    {
      id: 4,
      date: '2024-11-12',
      time: '11:45 AM',
      visitor: 'Lisa Wong',
      role: 'Structural Engineer',
      purpose: 'Structural Assessment',
      remarks: 'Structural integrity excellent. Approved for next phase of construction.',
      images: ['structure1.jpg'],
      weather: 'Sunny',
      status: 'Completed',
      project: 'Downtown Office Complex',
      duration: '2.5 hours',
      attendees: ['Construction Manager', 'Site Engineer'],
      findings: ['Structural integrity verified', 'Ready for next phase'],
      recommendations: ['Proceed with next construction phase', 'Maintain current quality standards']
    }
  ]);

  const request = [
    {
      id: 1,
      date: '2024-11-20',
      projectName: 'Down Flow',
      note: 'can you visit it'
    },
    {
      id: 2,
      date: '2024-11-20',
      projectName: 'Down Flow',
      note: 'can you visit it'
    },
    {
      id: 3,
      date: '2024-11-20',
      projectName: 'Down Flow',
      note: 'can you visit it'
    },
    {
      id: 4,
      date: '2024-11-20',
      projectName: 'Down Flow',
      note: 'can you visit it'
    },
    {
      id: 5,
      date: '2024-11-20',
      projectName: 'Down Flow',
      note: 'can you visit it'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Follow-up Required':
        return 'text-yellow-600 bg-yellow-100';
      case 'Pending':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.visitor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || visit.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const handleEdit = (visit) => {
    setEditingVisit({ ...visit });
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    setVisits(visits.map(visit =>
      visit.id === editingVisit.id ? editingVisit : visit
    ));
    setShowEditForm(false);
    setEditingVisit(null);
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const downloadReport = () => {
    // In a real application, this would generate and download a PDF
    alert('Site Visit Report downloaded successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Visit Logs</h1>
          <p className="text-gray-600 mt-2">Record and track all site visits and inspections</p>
        </div> */}
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={generateReport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download size={20} className="mr-2" />
            Generate Report
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary-500 bg-amber-400 text-gray-900 rounded-lg cursor-pointer hover:bg-amber-200 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Log New Visit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <MapPin className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-secondary-600">8</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-secondary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Follow-up</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-accent-600">12</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <User className="text-accent-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900"> 2022/05/12
                      {/* {request.date} */}
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600"> Home Land
                    {/* {request.projectName} */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">  can you visit it
                      {/* {request.note} */}
                    </div>
                  </td>
                  <td className=" flex px-6 py-4 whitespace-nowrap">
                    <button className=" flex p-3 bg-green-500 text-gray-900 cursor-pointer hover:bg-green-300  rounded-lg py-2 font-medium m-2">
                      <CircleCheckBig  size={20} className="m-1" />
                      Accpeted
                    </button>
                    <button className=" flex p-3 bg-red-600 text-gray-900 cursor-pointer hover:bg-red-400  rounded-lg py-2 font-medium m-2">
                      <CircleMinus size={20} className="m-1" />
                      Rejected
                    </button>
                    {/* <button className="flex p-3 bg-amber-400 text-gray-900 cursor-pointer hover:bg-amber-200  rounded-lg py-2 font-medium m-2">
                      <Check size={20} className="m-1" />
                      Completed
                    </button> */}
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visit Logs */}
      <div className="space-y-6">
        {filteredVisits.map((visit) => (
          <div key={visit.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{visit.visitor}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {visit.date} at {visit.time}
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    {visit.role}
                  </div>
                  {/* <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Weather: {visit.weather}
                  </div> */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Purpose</h4>
                <p className="text-gray-600 mb-4">{visit.purpose}</p>

                <h4 className="font-medium text-gray-900 mb-2">Remarks</h4>
                <p className="text-gray-600">{visit.remarks}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Images ({visit.images.length})</h4>
                <div className="flex items-center space-x-2">
                  {visit.images.map((image, index) => (
                    <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="text-gray-400" size={20} />
                    </div>
                  ))}
                  <button className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-400 transition-colors">
                    <Plus className="text-gray-400" size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex flex-wrap gap-3">
                {/* <button className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                  View Details
                </button> */}
                <button
                  onClick={() => handleEdit(visit)}
                  className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Visit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Log New Site Visit</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter visitor name"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Project Manager, Inspector"
                  />
                </div> */}
                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Project Manager</option>
                  <option>Inspector</option>
                  <option>Director</option>
                </select>
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Weekly inspection, Safety check"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Sunny</option>
                  <option>Cloudy</option>
                  <option>Rainy</option>
                  <option>Windy</option>
                  <option>Snow</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Detailed observations, findings, or notes..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Completed</option>
                  <option>Follow-up Required</option>
                  <option>Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <Camera className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-600">Click to upload images or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 bg-amber-400 text-gray-900 rounded-lg py-2 hover:bg-primary-600 transition-colors"
                >
                  Log Visit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visit Form Modal */}
      {showEditForm && editingVisit && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Site Visit</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingVisit.date}
                    onChange={(e) => setEditingVisit({ ...editingVisit, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={editingVisit.time}
                    onChange={(e) => setEditingVisit({ ...editingVisit, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
                  <input
                    type="text"
                    value={editingVisit.visitor}
                    onChange={(e) => setEditingVisit({ ...editingVisit, visitor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                  <input
                    type="text"
                    value={editingVisit.role}
                    onChange={(e) => setEditingVisit({ ...editingVisit, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  value={editingVisit.purpose}
                  onChange={(e) => setEditingVisit({ ...editingVisit, purpose: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
                <select
                  value={editingVisit.weather}
                  onChange={(e) => setEditingVisit({ ...editingVisit, weather: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option>Sunny</option>
                  <option>Cloudy</option>
                  <option>Rainy</option>
                  <option>Windy</option>
                  <option>Snow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  rows={4}
                  value={editingVisit.remarks}
                  onChange={(e) => setEditingVisit({ ...editingVisit, remarks: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingVisit.status}
                  onChange={(e) => setEditingVisit({ ...editingVisit, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option>Completed</option>
                  <option>Follow-up Required</option>
                  <option>Pending</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 bg-primary-500 text-gray-900 bg-amber-400 rounded-lg py-2 hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            {/* Report Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Site Visit Logs Report</h2>
                <p className="text-gray-600">Comprehensive site visit summary</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-primary-500 bg-amber-400 text-gray-900 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                >
                  <Download size={20} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {/* Summary Statistics */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Total Visits</p>
                    <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {visits.filter(v => v.status === 'Completed').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Follow-up Required</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {visits.filter(v => v.status === 'Follow-up Required').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Set(visits.map(v => v.visitor)).size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Visit Details</h3>
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{visit.visitor} - {visit.role}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-2">
                        <div>
                          <p className="text-gray-600">Date & Time</p>
                          <p className="font-medium">{visit.date} at {visit.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Purpose</p>
                          <p className="font-medium">{visit.purpose}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Weather</p>
                          <p className="font-medium">{visit.weather}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Remarks</p>
                        <p className="text-gray-900">{visit.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Footer */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Project Manager: John Smith | Construction Manager Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteVisitLogs;