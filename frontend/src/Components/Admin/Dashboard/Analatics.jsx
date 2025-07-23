import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Building,
  Calendar, 
  Target,
  AlertTriangle,
  Activity,
  Clock,
  Briefcase,
  Award,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ChevronDown,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedChart, setSelectedChart] = useState('all');

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 245000, profit: 45000, expenses: 200000 },
    { month: 'Feb', revenue: 310000, profit: 62000, expenses: 248000 },
    { month: 'Mar', revenue: 425000, profit: 85000, expenses: 340000 },
    { month: 'Apr', revenue: 380000, profit: 76000, expenses: 304000 },
    { month: 'May', revenue: 520000, profit: 104000, expenses: 416000 },
    { month: 'Jun', revenue: 490000, profit: 98000, expenses: 392000 }
  ];

  const projectStatusData = [
    { name: 'Completed', value: 35, color: '#10B981' },
    { name: 'In Progress', value: 28, color: '#3B82F6' },
    { name: 'Planning', value: 15, color: '#F59E0B' },
    { name: 'On Hold', value: 8, color: '#EF4444' },
    { name: 'Cancelled', value: 4, color: '#6B7280' }
  ];

  const departmentPerformance = [
    { department: 'Architecture', projects: 12, efficiency: 94, budget: 85 },
    { department: 'Quantity Survey', projects: 18, efficiency: 88, budget: 92 },
    { department: 'Project Management', projects: 24, efficiency: 91, budget: 78 },
    { department: 'Site Operations', projects: 15, efficiency: 85, budget: 89 },
    { department: 'Legal', projects: 8, efficiency: 96, budget: 95 },
    { department: 'Finance', projects: 20, efficiency: 93, budget: 87 }
  ];

  const employeeProductivity = [
    { month: 'Jan', productivity: 75, satisfaction: 82, overtime: 12 },
    { month: 'Feb', productivity: 78, satisfaction: 85, overtime: 15 },
    { month: 'Mar', productivity: 82, satisfaction: 88, overtime: 18 },
    { month: 'Apr', productivity: 85, satisfaction: 90, overtime: 14 },
    { month: 'May', productivity: 88, satisfaction: 87, overtime: 20 },
    { month: 'Jun', productivity: 91, satisfaction: 92, overtime: 16 }
  ];

  const projectTimelineData = [
    { project: 'Residential Complex A', planned: 180, actual: 165, status: 'ahead' },
    { project: 'Office Building B', planned: 240, actual: 255, status: 'delayed' },
    { project: 'Shopping Mall C', planned: 300, actual: 280, status: 'ahead' },
    { project: 'Hospital Wing D', planned: 150, actual: 165, status: 'delayed' },
    { project: 'School Campus E', planned: 200, actual: 185, status: 'ahead' }
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: '$2.37M',
      change: '+15.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'vs last period'
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Building,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: 'currently active'
    },
    {
      title: 'Profit Margin',
      value: '18.5%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: 'average margin'
    },
    {
      title: 'Employee Productivity',
      value: '91%',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      description: 'efficiency rate'
    },
    {
      title: 'On-Time Delivery',
      value: '87%',
      change: '-2.3%',
      trend: 'down',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      description: 'project delivery'
    },
    {
      title: 'Client Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Award,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      description: 'average rating'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'Budget Overrun Alert',
      message: 'Office Building B is 15% over budget',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      type: 'info',
      title: 'Milestone Achieved',
      message: 'Residential Complex A reached 80% completion',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      type: 'error',
      title: 'Safety Incident',
      message: 'Minor incident reported at Site 3',
      time: '6 hours ago',
      priority: 'high'
    },
    {
      type: 'success',
      title: 'Project Completed',
      message: 'School Campus E delivered on time',
      time: '1 day ago',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'error': return <AlertTriangle size={16} className="text-red-400" />;
      case 'success': return <Target size={16} className="text-green-400" />;
      default: return <Activity size={16} className="text-blue-400" />;
    }
  };

  const getAlertBorderColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-400';
      case 'error': return 'border-l-red-400';
      case 'success': return 'border-l-green-400';
      default: return 'border-l-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Real-time insights and performance metrics for construction management</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {keyMetrics.map((metric) => (
            <div key={metric.title} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon size={24} className={metric.color} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-gray-400 text-sm">{metric.title}</p>
              <p className="text-gray-500 text-xs mt-1">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue & Profit Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 size={20} />
                Revenue & Profit Analysis
              </h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Download size={16} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#FAAD00" name="Revenue" />
                <Bar dataKey="profit" fill="#10B981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status Distribution */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <PieChartIcon size={20} />
                Project Status Distribution
              </h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Download size={16} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Employee Productivity Trends */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <LineChartIcon size={20} />
                Employee Productivity Trends
              </h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Download size={16} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeeProductivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="productivity" stroke="#3B82F6" name="Productivity %" strokeWidth={3} />
                <Line type="monotone" dataKey="satisfaction" stroke="#10B981" name="Satisfaction %" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Performance */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 size={20} />
                Department Performance
              </h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Download size={16} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="department" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="efficiency" fill="#8B5CF6" name="Efficiency %" />
                <Bar dataKey="budget" fill="#F59E0B" name="Budget Adherence %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;