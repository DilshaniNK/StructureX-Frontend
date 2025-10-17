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
    if(employeeId){
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
    const handlerequest = () =>{
      navigate(`/projectmanager/${employeeId}/materials`);
    };
    const handletodolist = () =>{
      navigate(`/projectmanager/${employeeId}/todolist`);
    };
    const handleSiteUpdate = () =>{
      navigate(`/projectmanager/${employeeId}/dailyupdates`);
    };
    
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...ongoingProjects, ...completedProjects].length > 0 
                  ? `$${[...ongoingProjects, ...completedProjects].reduce((total, proj) => total + (proj.budget || 0), 0).toLocaleString()}`
                  : '$0'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <DollarSign className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{ongoingProjects.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-secondary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Complete Project</p>
              <p className="text-2xl font-bold text-gray-900">{completedProjects.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Package className="text-black" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Users className="text-light-600" size={24} />
            </div>
          </div>
        </div>
      </div>

       {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handlerequest} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer ">
            <Package className="text-primary-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Request Materials</h3>
            <p className="text-sm text-gray-600">Submit new material requests</p>
          </button>

          <button onClick={handletodolist} className="p-4 border cursor-pointer border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Calendar className="text-secondary-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">To do List</h3>
            <p className="text-sm text-gray-600">Plan site inspections</p>
          </button>

          <button onClick={handleSiteUpdate} className="p-4 border cursor-pointer border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FileText className="text-accent-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Daily Report</h3>
            <p className="text-sm text-gray-600">See today's updates</p>
          </button>
        </div>
      </div>

      {/* Project Summary & Recent Activity */}
      <div className="flex w-full flex-col lg:grid-cols-2 gap-8">
        {/* Project Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Projects</h2>
          <div className="space-y-4">
            {ongoingProjects && ongoingProjects.length > 0 ? (
              ongoingProjects.map((proj, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {proj.projectName || proj.name || 'Unnamed Project'}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Project ID:</span> {proj.project_id || proj.id || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Start Date:</span> {proj.start_date ? new Date(proj.start_date).toLocaleDateString() : 'Not specified'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Budget:</span> 
                              <span className="text-green-600 font-semibold ml-1">
                                {proj.budget ? `$${proj.budget.toLocaleString()}` : 'Not specified'}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-gray-600">Status:</span>
                              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                proj.status === 'Active' || proj.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                                proj.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                proj.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                                proj.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {proj.status || 'Unknown'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleViewClick} 
                      className="ml-4 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 transition-colors flex items-center text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Package className="text-gray-400 mb-2 mx-auto" size={32} />
                  <p className="text-gray-600">No active projects found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;