// pages/Director/Overview.jsx
import React, { useEffect, useState } from 'react';
import OverviewStats from '../../Components/Director/OverviewStats';
import RecentProjects from '../../Components/Director/RecentProjects';
import UpcomingSiteVisits from '../../Components/Director/UpcomingSiteVisits';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Plus, TrendingUp, Eye, BarChart3, Calendar, Building2 } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const EMPLOYEE_ID = useParams().employeeId || EMPLOYEE_ID;
  const BASE_URL = `/director/${EMPLOYEE_ID}`;
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch('http://localhost:8086/api/v1/director/get_all_projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        alert("failed to load projects")
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);
  
  const navigate = useNavigate();
  
 if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading clients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-100">
      
      

      <div className="px-8 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <OverviewStats projects={projects} />
        </div>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            className="group bg-gradient-to-br from-[#FAAD00] via-amber-300 to-amber-400 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => navigate(`/directorcont/${EMPLOYEE_ID}/clientdetails`, {state: {showForm: true}})}
          >
            <div className="flex items-center justify-center space-x-3">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-lg">Register New Client</span>
            </div>
            <p className="text-amber-100 text-sm mt-2 opacity-90">Add new client to the system</p>
          </button>

          <button 
            className="group bg-gradient-to-br from-gray-500 via-gray-500 to-gray-800 hover:from-gray-400 hover:to-gray-400 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => navigate(`/directorcont/${EMPLOYEE_ID}/clientdetails`)}
          >
            <div className="flex items-center justify-center space-x-3">
              <Eye className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg">View Client Details</span>
            </div>
            <p className="text-blue-100 text-sm mt-2 opacity-90">Manage existing clients</p>
          </button>

          <button 
            className="group bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => navigate('/director/documents')}
          >
            <div className="flex items-center justify-center space-x-3">
              <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg">View Reports</span>
            </div>
            <p className="text-emerald-100 text-sm mt-2 opacity-90">Analytics and insights</p>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects Card */}
          {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Recent Projects</h3>
              </div>
            </div>
            <div className="p-6">
              <RecentProjects projects={projects} />
            </div>
          </div> */}

          {/* Upcoming Site Visits Card */}
          {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Upcoming Site Visits</h3>
              </div>
            </div>
            <div className="p-6">
              <UpcomingSiteVisits />
            </div>
          </div> */}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 border border-pink-200 rounded-2xl p-6 shadow-lg"
            onClick={() => navigate(`${BASE_URL}/teammanagment`)}
            tabIndex={0}
            role='button'
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-gray-800">Team Management</h4>
            </div>
            <p className="text-gray-600 text-sm">Oversee project teams and resource allocation across all ongoing construction projects.</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-100 border border-cyan-200 rounded-2xl p-6 shadow-lg"
            onClick={() => navigate(`${BASE_URL}/inventory`)}
            tabIndex={0}
            role='button'
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-gray-800">Performance Metrics</h4>
            </div>
            <p className="text-gray-600 text-sm">Track project progress, budget adherence, and timeline performance across all sites.</p>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-xl">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-gray-800">Financial Overview</h4>
            </div>
            <p className="text-gray-600 text-sm">Monitor project budgets, expenses, and profitability across the entire portfolio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;