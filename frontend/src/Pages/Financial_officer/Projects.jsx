import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Building,
  GraduationCap,
  ShoppingBag,
  Dumbbell
} from "lucide-react";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const [housingCount, setHousingCount] = useState(0);
  const [commercialCount, setCommercialCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);
  const [infrastructureCount, setInfrastructureCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8086/api/v1/financial_officer")
 // Replace with your API endpoint
      .then((response) => {
        setProjects(response.data);
       

        // Optional: Count categories from response data
        setHousingCount(response.data.filter(p => p.type === "Housing").length);
        setCommercialCount(response.data.filter(p => p.type === "Commercial").length);
        setEducationCount(response.data.filter(p => p.type === "Educational").length);
        setInfrastructureCount(response.data.filter(p => p.type === "Infrastructure").length);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        
      });
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || project.type === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "budget":
        return b.budget - a.budget;
      case "progress":
        return b.progress - a.progress;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "Active":
        return <Clock className="h-4 w-4" />;
      case "On Hold":
        return <Pause className="h-4 w-4" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Hold":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  //project type wise
  const getCategoryIcon = (type) => {
    switch (type) {
      case "Housing":
        return <Building className="h-5 w-5" />;
      case "Commercial":
        return <ShoppingBag className="h-5 w-5" />;
      case "Educational":
        return <GraduationCap className="h-5 w-5" />;
      case "Infrastructure":
        return <Dumbbell className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };


  //for budget and spent cards
  const totalBudget = projects.reduce((sum, p) => sum + p.estimatedValue, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.amountSpent, 0);

  //for project status cards
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  





  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 hover:border-amber-400 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Building className="text-white" style={{ fontSize: '32px' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Housing Complexes</h3>
            <p className="text-3xl font-bold text-amber-600">{housingCount}+</p>
            <p className="text-sm text-gray-600 mt-1">Residential Projects</p>
          </div>

          <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:border-blue-400 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-white" style={{ fontSize: '32px' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Commercial Buildings</h3>
            <p className="text-3xl font-bold text-blue-600">{commercialCount}+</p>
            <p className="text-sm text-gray-600 mt-1">Business Centers</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 hover:border-green-400 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white" style={{ fontSize: '32px' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Educational Institutes</h3>
            <p className="text-3xl font-bold text-green-600">{educationCount}+</p>
            <p className="text-sm text-gray-600 mt-1">Schools & Universities</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-200 hover:border-purple-400 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Dumbbell className="text-white" style={{ fontSize: '32px' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Infrastructure Projects</h3>
            <p className="text-3xl font-bold text-purple-600">{infrastructureCount}+</p>
            <p className="text-sm text-gray-600 mt-1">Roads & Bridges</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, managers, or locations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/*filter by project status */}
            <div className="flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
              </select>
              
              {/*filter by project type */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Housing">Housing</option>
                <option value="Commercial">Commercial</option>
                <option value="Educational">Educational</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
              
              {/* sort */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="budget">Sort by Budget</option>
                <option value="progress">Sort by Progress</option>
                
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget & Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              {getCategoryIcon(project.type)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {project.location} 
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatCurrency(project.estimatedValue)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Spent: {formatCurrency(project.amountSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  project.progress === 100
                                    ? 'bg-green-500'
                                    : project.progress >= 70
                                    ? 'bg-blue-500'
                                    : project.progress >= 40
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Started: {formatDate(project.startDate)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Due: {formatDate(project.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors"
                            onClick={() => window.location.href = `/financial_officer/project_details?id=${project.projectId}`}>
                              <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="text-gray-500">
                        <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;