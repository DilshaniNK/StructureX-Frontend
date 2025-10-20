import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ExternalLink, Eye, AlertCircle, ChevronDown, X, CheckCircle, TrendingUp } from 'lucide-react';

export default function CompletedProjects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    try {
      const response = await fetch('http://localhost:8086/api/v1/designer/completed_projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-50 text-red-700 border-red-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[priority] || colors.low;
  };

  const filteredProjects = projects
    .filter(p => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (p.name?.toLowerCase().includes(searchLower) ||
          p.client_name?.toLowerCase().includes(searchLower) ||
          p.design_id?.toLowerCase().includes(searchLower)) &&
        (filterPriority === 'all' || p.priority === filterPriority)
      );
    })
    .sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

  const stats = {
    total: projects.length,
    thisMonth: projects.filter(p => {
      const date = new Date(p.due_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    totalValue: projects.reduce((sum, p) => sum + (p.price || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm ">
        <div className="px-3 sm:px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-emerald-600">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Done</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, clients or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none transition-all bg-gray-50 hover:bg-white"
              />
            </div>
            
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg"
              >
                <Filter className="w-4 h-4" />
                <span>Priority</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10">
                  {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setFilterPriority(p);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-3 transition-all font-semibold ${
                        filterPriority === p
                          ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-400'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-3 sm:px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border-2 border-emerald-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-700 font-bold uppercase mb-1">Total Completed</p>
                <p className="text-3xl font-black text-emerald-600">{stats.total}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-emerald-300" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 font-bold uppercase mb-1">This Month</p>
                <p className="text-3xl font-black text-blue-600">{stats.thisMonth}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-3 sm:px-4 pb-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold text-lg">No completed projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div key={project.design_id} className="group bg-white rounded-xl border-2 border-gray-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all p-5 overflow-hidden">
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{project.design_id}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-300 whitespace-nowrap ml-2">
                    ✓ DONE
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="font-semibold truncate">{project.client_name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="capitalize">{project.type}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
                    <span>{new Date(project.due_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold border mb-4 ${getPriorityColor(project.priority)}`}>
                  {project.priority.toUpperCase()}
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 group-hover:line-clamp-none transition-all">{project.description}</p>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  {project.design_link && (
                    <a
                      href={`https://${project.design_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Design
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{selectedProject.name}</h2>
                <p className="text-sm text-gray-600 font-semibold mt-1">{selectedProject.design_id}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-xs text-blue-700 font-bold mb-1 uppercase">Design ID</p>
                  <p className="font-bold text-gray-900">{selectedProject.design_id}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                  <p className="text-xs text-emerald-700 font-bold mb-1 uppercase">Client</p>
                  <p className="font-bold text-gray-900">{selectedProject.client_name}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <p className="text-xs text-purple-700 font-bold mb-1 uppercase">Type</p>
                  <p className="font-bold text-gray-900 capitalize">{selectedProject.type}</p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${getPriorityColor(selectedProject.priority)}`}>
                  <p className="text-xs font-bold mb-1 uppercase">Priority</p>
                  <p className="font-bold text-gray-900 capitalize">{selectedProject.priority}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-200">
                <p className="text-xs text-amber-700 font-bold mb-1 uppercase">Due Date</p>
                <p className="text-lg font-bold text-gray-900">{new Date(selectedProject.due_date).toLocaleDateString()}</p>
              </div>

              {selectedProject.price && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-xs text-green-700 font-bold mb-1 uppercase">Price</p>
                  <p className="text-lg font-bold text-gray-900">${selectedProject.price.toLocaleString()}</p>
                </div>
              )}

              {selectedProject.description && (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-700 font-bold mb-2 uppercase">Description</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>
              )}

              {selectedProject.additional_note && (
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-xs text-blue-700 font-bold mb-2 uppercase">Notes</p>
                  <p className="text-gray-700 text-sm">{selectedProject.additional_note}</p>
                </div>
              )}

              {selectedProject.design_link && (
                <a
                  href={`https://${selectedProject.design_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all font-bold text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Design
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}