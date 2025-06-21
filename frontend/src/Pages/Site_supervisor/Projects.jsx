import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Filter,
  Search,
  Bell,
  User,
  Settings,
  MoreVertical,
  Eye,
  Edit,
  DollarSign,
  Activity
} from 'lucide-react';

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 1,
      name: "Downtown Office Complex",
      client: "Metro Corp",
      status: "in-progress",
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-08-30",
      location: "Downtown District",
      budget: "$2.4M",
      teamSize: 12,
      priority: "high",
      lastUpdate: "2 hours ago",
      issues: 2,
      completedTasks: 28,
      totalTasks: 43
    },
    {
      id: 2,
      name: "Residential Tower Phase 2",
      client: "Skyline Developers",
      status: "planning",
      progress: 15,
      startDate: "2024-03-01",
      endDate: "2024-12-15",
      location: "North Valley",
      budget: "$5.8M",
      teamSize: 18,
      priority: "medium",
      lastUpdate: "1 day ago",
      issues: 0,
      completedTasks: 5,
      totalTasks: 67
    },
    {
      id: 3,
      name: "Shopping Mall Renovation",
      client: "Retail Giants Inc",
      status: "completed",
      progress: 100,
      startDate: "2023-09-10",
      endDate: "2024-02-28",
      location: "West Side",
      budget: "$1.2M",
      teamSize: 8,
      priority: "low",
      lastUpdate: "3 days ago",
      issues: 0,
      completedTasks: 34,
      totalTasks: 34
    },
    {
      id: 4,
      name: "Highway Bridge Construction",
      client: "City Infrastructure",
      status: "delayed",
      progress: 45,
      startDate: "2023-11-20",
      endDate: "2024-07-15",
      location: "Highway 101",
      budget: "$3.6M",
      teamSize: 15,
      priority: "high",
      lastUpdate: "4 hours ago",
      issues: 5,
      completedTasks: 18,
      totalTasks: 52
    },
    {
      id: 5,
      name: "School Campus Expansion",
      client: "Education Board",
      status: "in-progress",
      progress: 78,
      startDate: "2024-01-08",
      endDate: "2024-06-30",
      location: "Education District",
      budget: "$1.9M",
      teamSize: 10,
      priority: "medium",
      lastUpdate: "6 hours ago",
      issues: 1,
      completedTasks: 31,
      totalTasks: 40
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    delayed: projects.filter(p => p.status === 'delayed').length,
    totalBudget: projects.reduce((sum, p) => sum + parseFloat(p.budget.replace('$', '').replace('M', '')), 0),
    totalTeamMembers: projects.reduce((sum, p) => sum + p.teamSize, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-9xl mx-auto px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalTeamMembers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-purple-600">${stats.totalBudget.toFixed(1)}M</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex space-x-2">
                {['all', 'in-progress', 'planning', 'completed', 'delayed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.client}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        project.status === 'completed' ? 'bg-green-500' :
                        project.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>{project.budget}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{project.teamSize} members</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm">
                    <span className="text-gray-600">Tasks: </span>
                    <span className="font-medium text-gray-900">{project.completedTasks}/{project.totalTasks}</span>
                  </div>
                  {project.issues > 0 && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">{project.issues} issues</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Updated {project.lastUpdate}</p>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No projects found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
