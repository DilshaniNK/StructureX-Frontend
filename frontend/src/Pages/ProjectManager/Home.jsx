import React from 'react';
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
import { useNavigate } from 'react-router-dom';
 
const Home = () => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate('/projectmanager/${employeeId}/projects');
    };
    const handlerequest = () =>{
      navigate('/projectmanager/${employeeId}/materials');
    };
    const handletodolist = () =>{
      navigate('/projectmanager/${employeeId}/todolist');
    };
    const handleSiteUpdate = () =>{
      navigate('/projectmanager/${employeeId}/dailyupdates');
    };
    
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">$2.4M</p>
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
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-secondary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Materials</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
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
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Downtown Office Complex</h3>
                <p className="text-sm text-gray-600">Due: March 15, 2025</p>
              </div>
              <button onClick={handleViewClick} className="mt-4 sm:mt-0 cursor-pointer px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center">View</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Residential Towers</h3>
                <p className="text-sm text-gray-600">Due: June 30, 2025</p>
              </div>
              <button onClick={handleViewClick} className="mt-4 sm:mt-0 cursor-pointer px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center">View</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Shopping Mall Renovation</h3>
                <p className="text-sm text-gray-600">Due: April 20, 2025</p>
              </div>
              <button onClick={handleViewClick} className="mt-4 sm:mt-0 cursor-pointer px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;