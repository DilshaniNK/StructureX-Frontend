import React, { useState } from 'react';
import { Plus, Calendar, FileText, AlertTriangle, CheckCircle, Clock, Paperclip } from 'lucide-react';

function DailyUpdates() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const updates = [
    {
      id: 1,
      date: '2024-11-20',
      supervisor: 'Mark Rodriguez',
      project: 'Downtown Office Complex',
      updates: [
        {
          id: 1,
          time: '09:00',
          activity: 'Foundation concrete pouring',
          status: 'completed',
          description: 'Successfully completed foundation concrete pouring for Block A. Quality check passed.',
          attachments: ['foundation_complete.jpg']
        },
        {
          id: 2,
          time: '14:30',
          activity: 'Steel beam installation',
          status: 'in-progress',
          description: 'Steel beam installation ongoing. 60% complete. Expected completion tomorrow.',
          attachments: []
        },
        {
          id: 3,
          time: '16:45',
          activity: 'Safety equipment check',
          status: 'issue-reported',
          description: 'Found damaged safety harness. Replacement ordered. Work suspended in affected area.',
          attachments: ['safety_issue.jpg']
        }
      ]
    },
    {
      id: 2,
      date: '2024-11-19',
      supervisor: 'Sarah Chen',
      project: 'Residential Towers',
      updates: [
        {
          id: 4,
          time: '08:30',
          activity: 'Site preparation',
          status: 'completed',
          description: 'Site cleared and prepared for foundation work. All equipment positioned.',
          attachments: ['site_prep.jpg', 'equipment_layout.jpg']
        },
        {
          id: 5,
          time: '11:00',
          activity: 'Material delivery',
          status: 'completed',
          description: 'Concrete blocks and steel reinforcement delivered and inspected.',
          attachments: ['delivery_receipt.pdf']
        },
        {
          id: 6,
          time: '15:20',
          activity: 'Foundation excavation',
          status: 'in-progress',
          description: 'Excavation work started. 40% complete. Good weather conditions.',
          attachments: []
        }
      ]
    },
    {
      id: 3,
      date: '2024-11-18',
      supervisor: 'David Park',
      project: 'Shopping Mall Renovation',
      updates: [
        {
          id: 7,
          time: '09:15',
          activity: 'Interior demolition',
          status: 'completed',
          description: 'Completed demolition of old interior structures. Area cleared for new construction.',
          attachments: ['demo_complete.jpg']
        },
        {
          id: 8,
          time: '13:45',
          activity: 'Electrical rough-in',
          status: 'in-progress',
          description: 'Electrical rough-in work started. Following updated building codes.',
          attachments: ['electrical_plan.pdf']
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'issue-reported':
        return 'text-red-600 bg-red-100';
      case 'delayed':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-600" />;
      case 'issue-reported':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'delayed':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const filteredUpdates = selectedDate
    ? updates.filter((update) => update.date === selectedDate)
    : updates;

  const totalUpdates = updates.reduce((acc, day) => acc + day.updates.length, 0);
  const completedUpdates = updates.reduce(
    (acc, day) => acc + day.updates.filter((u) => u.status === 'completed').length,
    0
  );
  const inProgressUpdates = updates.reduce(
    (acc, day) => acc + day.updates.filter((u) => u.status === 'in-progress').length,
    0
  );
  const issueReported = updates.reduce(
    (acc, day) => acc + day.updates.filter((u) => u.status === 'issue-reported').length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Updates</h1>
          <p className="text-gray-600 mt-2">Track daily progress and site activities</p>
        </div> */}
        {/* <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Update
        </button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total */}
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Updates</p>
              <p className="text-2xl font-bold text-black">{totalUpdates}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <FileText className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
        {/* Completed */}
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-black">{completedUpdates}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400  rounded-lg flex items-center justify-center">
              <CheckCircle className="text-black" size={24} />
            </div>
          </div>
        </div>
        {/* In Progress */}
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-black">{inProgressUpdates}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Clock className="text-black" size={24} />
            </div>
          </div>
        </div>
        {/* Issues */}
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Issues Reported</p>
              <p className="text-2xl font-bold text-black">{issueReported}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-black" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={() => setSelectedDate('')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Show All
          </button>
        </div>
      </div>

      {/* Daily Entries */}
      <div className="space-y-6">
        {filteredUpdates.map((dayUpdate) => (
          <div key={dayUpdate.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Day Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {new Date(dayUpdate.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Supervisor: {dayUpdate.supervisor} • Project: {dayUpdate.project}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">{dayUpdate.updates.length} updates</span>
                </div>
              </div>
            </div>

            {/* Updates List */}
            <div className="p-6">
              <div className="space-y-6">
                {dayUpdate.updates.map((update) => (
                  <div key={update.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(update.status)}`}>
                        {getStatusIcon(update.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-medium text-gray-900">{update.activity}</h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{update.time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                            {update.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{update.description}</p>

                      {/* Attachments */}
                      {update.attachments.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Paperclip size={16} className="text-gray-400" />
                          <div className="flex space-x-2">
                            {update.attachments.map((att, i) => (
                              <button key={i} className="text-sm text-primary-600 hover:text-primary-700 underline">
                                {att}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Update Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Daily Update</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter supervisor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Downtown Office Complex</option>
                    <option>Residential Towers</option>
                    <option>Shopping Mall Renovation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Foundation work, Steel installation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="delayed">Delayed</option>
                  <option value="issue-reported">Issue Reported</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Detailed description of the work performed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <Paperclip className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-600">Click to upload files or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">Images, PDFs up to 10MB each</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-300 text-black rounded-lg py-2 hover:bg-primary-600 transition-colors"
                >
                  Add Update
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
}

export default DailyUpdates;
