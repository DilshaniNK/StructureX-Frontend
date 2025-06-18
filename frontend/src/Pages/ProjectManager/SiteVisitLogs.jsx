import React, { useState } from 'react';
import { Plus, Search, Calendar, Camera, Download, Filter, MapPin, Clock, User } from 'lucide-react';

const SiteVisitLogs = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const visits = [
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
      status: 'Completed'
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
      status: 'Completed'
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
      status: 'Follow-up Required'
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
      status: 'Completed'
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Visit Logs</h1>
          <p className="text-gray-600 mt-2">Record and track all site visits and inspections</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Log New Visit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <MapPin className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Calendar className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Follow-up</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Clock className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <User className="text-primary-600" size={24} />
            </div>
          </div>
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download size={20} className="mr-2" />
              Export
            </button>
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
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Weather: {visit.weather}
                  </div>
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
                <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Project Manager, Inspector"
                  />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
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
                  className="flex-1 bg-primary-500 text-white rounded-lg py-2 hover:bg-primary-600 transition-colors"
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
    </div>
  );
};

export default SiteVisitLogs;