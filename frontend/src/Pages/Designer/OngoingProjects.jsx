import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Eye, CheckCircle, X, AlertCircle, Loader, Zap, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8086/api/v1/designer';

export default function OngoingProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToComplete, setProjectToComplete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOngoingProjects();
  }, []);

  const fetchOngoingProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/ongoing_projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = projects.filter(project =>
      project.name?.toLowerCase().includes(value.toLowerCase()) ||
      project.design_id?.toLowerCase().includes(value.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleCompleteClick = (project) => {
    setProjectToComplete(project);
    setShowConfirmModal(true);
  };

  const handleConfirmComplete = async () => {
    if (!projectToComplete) return;
    try {
      const response = await fetch(
        `${API_BASE}/mark_project_complete/${projectToComplete.design_id}`,
        { method: 'PUT' }
      );
      if (!response.ok) throw new Error('Failed to mark project as complete');
      setProjects(projects.filter(p => p.design_id !== projectToComplete.design_id));
      setFilteredProjects(filteredProjects.filter(p => p.design_id !== projectToComplete.design_id));
      setShowConfirmModal(false);
      setProjectToComplete(null);
      setSelectedProject(null);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[priority] || colors.low;
  };

  const getPriorityDot = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-amber-500',
      low: 'bg-green-500'
    };
    return colors[priority] || colors.low;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20">
      {/* Header */}
        <div className="sticky top-0 z-10">        <div className="px-3 sm:px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-amber-500">{filteredProjects.length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50 hover:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 text-amber-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900">Error loading projects</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center border-2 border-gray-200">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => {
              const daysLeft = getDaysUntilDue(project.due_date);
              const isOverdue = daysLeft < 0;
              
              return (
                <div key={project.design_id} className="group bg-white rounded-xl border-2 border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all p-5 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className={`w-3 h-3 rounded-full ${getPriorityDot(project.priority)} flex-shrink-0`} />
                        <h3 className="text-lg font-bold text-gray-900 truncate">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(project.priority)} whitespace-nowrap`}>
                          {project.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold">ID: {project.design_id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-100">
                      <p className="text-xs font-bold text-blue-700 mb-1">CLIENT</p>
                      <p className="font-semibold text-gray-900 text-sm truncate">{project.client_name}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 border border-purple-100">
                      <p className="text-xs font-bold text-purple-700 mb-1">TYPE</p>
                      <p className="font-semibold text-gray-900 text-sm capitalize truncate">{project.type}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg p-3 border border-indigo-100">
                      <p className="text-xs font-bold text-indigo-700 mb-1">DUE DATE</p>
                      <p className="font-semibold text-gray-900 text-sm">{formatDate(project.due_date)}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${isOverdue ? 'from-red-50 to-red-100/50 border-red-100' : 'from-green-50 to-green-100/50 border-green-100'} rounded-lg p-3 border`}>
                      <p className={`text-xs font-bold mb-1 ${isOverdue ? 'text-red-700' : 'text-green-700'}`}>TIME LEFT</p>
                      <p className={`font-semibold text-sm ${isOverdue ? 'text-red-900' : 'text-green-900'}`}>
                        {isOverdue ? `${Math.abs(daysLeft)}d OVERDUE` : `${daysLeft}d LEFT`}
                      </p>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-1 group-hover:line-clamp-none transition-all">{project.description}</p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={project.design_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all font-semibold text-sm shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Design
                    </a>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-amber-300 rounded-lg transition-all font-semibold text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    <button
                      onClick={() => handleCompleteClick(project)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all font-semibold text-sm shadow-md hover:shadow-lg ml-auto"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedProject && !showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200 px-6 py-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Project Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Design ID', value: selectedProject.design_id },
                    { label: 'Project ID', value: selectedProject.project_id || 'N/A' },
                    { label: 'Client', value: selectedProject.client_name },
                    { label: 'Type', value: selectedProject.type },
                    { label: 'Price', value: `$${selectedProject.price.toFixed(2)}` },
                    { label: 'Due Date', value: formatDate(selectedProject.due_date) },
                    { label: 'Employee ID', value: selectedProject.employee_id }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 font-bold mb-1">{item.label}</p>
                      <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                    </div>
                  ))}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">Priority</p>
                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${getPriorityColor(selectedProject.priority)}`}>
                      {selectedProject.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedProject.description && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Description</h3>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">{selectedProject.description}</p>
                </div>
              )}

              {selectedProject.additional_note && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Notes</h3>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">{selectedProject.additional_note}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <a
                  href={selectedProject.design_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Design
                </a>
                <button
                  onClick={() => {setSelectedProject(null); handleCompleteClick(selectedProject);}}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && projectToComplete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Mark Complete?</h3>
            <p className="text-gray-600 text-center mb-6">
              Confirm marking <span className="font-bold">"{projectToComplete.name}"</span> as completed
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmComplete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-bold"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}