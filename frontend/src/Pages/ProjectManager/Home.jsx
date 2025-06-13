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

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your projects today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

      {/* Project Summary & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Projects</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Downtown Office Complex</h3>
                <p className="text-sm text-gray-600">Due: March 15, 2025</p>
              </div>
              {/* <div className="text-right">
                <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm text-gray-600">75%</span>
              </div> */}
              <button className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center">View</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Residential Towers</h3>
                <p className="text-sm text-gray-600">Due: June 30, 2025</p>
              </div>
              {/* <div className="text-right">
                <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm text-gray-600">45%</span>
              </div> */}
              <button className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center">View</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Shopping Mall Renovation</h3>
                <p className="text-sm text-gray-600">Due: April 20, 2025</p>
              </div>
              {/* <div className="text-right">
                <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-accent-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm text-gray-600">60%</span>
              </div> */}
              <button className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center">View</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-green-600" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">Foundation work completed for Tower A</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-orange-600" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">Low inventory alert: Steel beams</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">Site inspection scheduled for tomorrow</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="text-yellow-600" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-900">Payment due in 3 days: $45,000</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Package className="text-primary-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Request Materials</h3>
            <p className="text-sm text-gray-600">Submit new material requests</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Calendar className="text-secondary-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Schedule Visit</h3>
            <p className="text-sm text-gray-600">Plan site inspections</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FileText className="text-accent-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Daily Report</h3>
            <p className="text-sm text-gray-600">Submit today's updates</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;