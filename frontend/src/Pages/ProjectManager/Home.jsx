import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Home = () => {

  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const { employeeId } = useParams();

  console.log("UserID from params:", employeeId);

  useEffect(() => {
    if (employeeId) {
      // Fetch both completed and ongoing projects
      Promise.all([
        axios.get(`http://localhost:8086/api/v1/project_manager/projects/${employeeId}/completed`),
        axios.get(`http://localhost:8086/api/v1/project_manager/projects/${employeeId}/ongoing`)
      ])
        .then(([completedResponse, ongoingResponse]) => {
          console.log("✅ Completed projects from backend:", completedResponse.data);
          console.log("✅ Ongoing projects from backend:", ongoingResponse.data);

          // Process completed projects
          const completedData = completedResponse.data;
          let completedArr = [];
          if (Array.isArray(completedData)) {
            completedArr = completedData;
          } else if (completedData && typeof completedData === "object" && Array.isArray(completedData.updates)) {
            completedArr = completedData.updates;
          } else if (completedData && typeof completedData === "object") {
            completedArr = [completedData];
          }
          setCompletedProjects(completedArr);

          // Process ongoing projects
          const ongoingData = ongoingResponse.data;
          let ongoingArr = [];
          if (Array.isArray(ongoingData)) {
            ongoingArr = ongoingData;
          } else if (ongoingData && typeof ongoingData === "object" && Array.isArray(ongoingData.updates)) {
            ongoingArr = ongoingData.updates;
          } else if (ongoingData && typeof ongoingData === "object") {
            ongoingArr = [ongoingData];
          }
          setOngoingProjects(ongoingArr);
        })
        .catch((error) => {
          console.error("❌ Error fetching projects:", error);
        });
    } else {
      console.warn("⚠️ No user ID provided, skipping fetch.");
    }
  }, [employeeId]);

  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/projectmanager/${employeeId}/projects`);
  };
  const handlerequest = () => {
    navigate(`/projectmanager/${employeeId}/materials`);
  };
  const handletodolist = () => {
    navigate(`/projectmanager/${employeeId}/todolist`);
  };
  const handleSiteUpdate = () => {
    navigate(`/projectmanager/${employeeId}/dailyupdates`);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Budget Card */}
        <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-700">Total Budget</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {[...ongoingProjects, ...completedProjects].length > 0
                  ? `$${[...ongoingProjects, ...completedProjects].reduce((total, proj) => total + (proj.budget || 0), 0).toLocaleString()}`
                  : '$0'
                }
              </p>
              <div className="flex items-center text-xs text-amber-600">
                <TrendingUp size={12} className="mr-1" />
                <span>total budget</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{ongoingProjects.length}</p>
              <div className="flex items-center text-xs text-blue-600">
                <Clock size={12} className="mr-1" />
                <span>In progress</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Completed Projects Card */}
        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm border border-green-100 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700">Completed Projects</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{completedProjects.length}</p>
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle size={12} className="mr-1" />
                <span>Successfully finished</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Request Materials */}
          <button
            onClick={handlerequest}
            className="group relative p-6 border-2 border-gray-100 rounded-2xl hover:border-amber-200 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Package className="text-white" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">Request Materials</h3>
              <p className="text-sm text-gray-600 group-hover:text-amber-600 transition-colors">Submit new material requests efficiently</p>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100 to-transparent rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
          </button>

          {/* To Do List */}
          <button
            onClick={handletodolist}
            className="group relative p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-white" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">To Do List</h3>
              <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">Manage tasks and plan inspections</p>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100 to-transparent rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
          </button>

          {/* Daily Report */}
          <button
            onClick={handleSiteUpdate}
            className="group relative p-6 border-2 border-gray-100 rounded-2xl hover:border-green-200 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="text-white" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">Daily Report</h3>
              <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors">View today's progress updates</p>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-100 to-transparent rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
          </button>
        </div>
      </div>

      {/* Enhanced Active Projects */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>

        <div className="space-y-6">
          {ongoingProjects && ongoingProjects.length > 0 ? (
            ongoingProjects.map((proj, index) => (
              <div key={index} className="group relative p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                {/* Progress indicator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-3/4 transition-all duration-1000"></div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                            {proj.projectName || proj.name || 'Unnamed Project'}
                          </h3>
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                            {proj.status || 'In Progress'}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                            <span className="font-medium">Project ID:</span>
                            <span className="ml-2 font-mono text-gray-800">{proj.project_id || proj.id || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={14} className="mr-3 text-gray-400" />
                            <span className="font-medium">Start Date:</span>
                            <span className="ml-2">{proj.start_date ? new Date(proj.start_date).toLocaleDateString() : 'Not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Budget</span>
                            <DollarSign size={16} className="text-green-500" />
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {proj.budget ? `$${proj.budget.toLocaleString()}` : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleViewClick}
                    className="ml-6 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-300 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Package className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Projects</h3>
              <p className="text-gray-600 text-center max-w-sm">You don't have any active projects at the moment. Create a new project to get started.</p>
              <button className="mt-4 px-6 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 transition-colors font-medium">
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;