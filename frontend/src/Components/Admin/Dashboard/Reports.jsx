import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  FileText, 
  Download, 
  Filter, 
  Search,
  Eye,
  Building,
  Clock,
  AlertTriangle,
  Target,
  PieChart,
  Activity,
  Briefcase,
  Settings,
  ChevronDown,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const ReportsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    financial: true,
    project: true,
    hr: true,
    operational: true
  });

  const reportCategories = {
    financial: {
      title: 'Financial Reports',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      reports: [
        {
          id: 'revenue-profit',
          title: 'Revenue & Profit Analysis',
          description: 'Monthly revenue trends, profit margins, and financial performance metrics',
          icon: TrendingUp,
          lastUpdated: '2 hours ago',
          status: 'current'
        },
        {
          id: 'cost-budget',
          title: 'Project Cost vs Budget',
          description: 'Compare actual project costs against budgeted amounts',
          icon: Target,
          lastUpdated: '1 day ago',
          status: 'current'
        },
        {
          id: 'cash-flow',
          title: 'Cash Flow Analysis',
          description: 'Incoming and outgoing cash flow patterns and projections',
          icon: Activity,
          lastUpdated: '5 hours ago',
          status: 'current'
        },
        {
          id: 'receivables',
          title: 'Outstanding Payments',
          description: 'Pending payments from clients and payment schedules',
          icon: Clock,
          lastUpdated: '3 hours ago',
          status: 'pending'
        }
      ]
    },
    project: {
      title: 'Project Performance',
      icon: Building,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      reports: [
        {
          id: 'project-timeline',
          title: 'Project Timeline & Milestones',
          description: 'Track project progress, deadlines, and milestone completion',
          icon: Calendar,
          lastUpdated: '1 hour ago',
          status: 'current'
        },
        {
          id: 'resource-utilization',
          title: 'Resource Utilization',
          description: 'Monitor equipment, materials, and human resource usage',
          icon: BarChart3,
          lastUpdated: '4 hours ago',
          status: 'current'
        },
        {
          id: 'quality-control',
          title: 'Quality Control & Inspections',
          description: 'Quality metrics, inspection results, and compliance reports',
          icon: Eye,
          lastUpdated: '6 hours ago',
          status: 'current'
        },
        {
          id: 'change-orders',
          title: 'Change Order Impact',
          description: 'Analysis of change orders and their impact on timeline and budget',
          icon: RefreshCw,
          lastUpdated: '1 day ago',
          status: 'delayed'
        }
      ]
    },
    operational: {
      title: 'Operational Reports',
      icon: Settings,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      reports: [
        {
          id: 'material-costs',
          title: 'Material Cost Analysis',
          description: 'Material usage, cost trends, and supplier performance',
          icon: Briefcase,
          lastUpdated: '4 hours ago',
          status: 'current'
        },
        {
          id: 'equipment-utilization',
          title: 'Equipment Utilization',
          description: 'Equipment usage rates, maintenance costs, and efficiency metrics',
          icon: Settings,
          lastUpdated: '6 hours ago',
          status: 'current'
        },
        {
          id: 'vendor-performance',
          title: 'Vendor Performance',
          description: 'Supplier and contractor performance evaluation',
          icon: Users,
          lastUpdated: '1 day ago',
          status: 'current'
        },
        {
          id: 'client-satisfaction',
          title: 'Client Satisfaction',
          description: 'Client feedback, satisfaction scores, and relationship metrics',
          icon: Target,
          lastUpdated: '2 days ago',
          status: 'pending'
        }
      ]
    }
  };

  const quickStats = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Building,
      color: 'text-blue-400'
    },
    {
      title: 'Total Employees',
      value: '156',
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'text-purple-400'
    },
    {
      title: 'Reports Generated',
      value: '89',
      change: '+15',
      trend: 'up',
      icon: FileText,
      color: 'text-orange-400'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'text-green-400 bg-green-500/10';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'delayed': return 'text-orange-400 bg-orange-500/10';
      case 'critical': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleReportView = (report) => {
    setSelectedReport(report);
    // In a real app, this would navigate to the detailed report view
    console.log('Viewing report:', report);
  };

  const handleDownloadReport = (report, e) => {
    e.stopPropagation();
    // In a real app, this would trigger report download
    console.log('Downloading report:', report);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Reports Dashboard</h1>
              <p className="text-gray-400">Comprehensive analytics and reporting for construction management</p>
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
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat) => (
              <div key={stat.title} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-400', '-500/10')}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Report Categories */}
        <div className="space-y-6">
          {Object.entries(reportCategories).map(([key, category]) => (
            <div key={key} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <category.icon size={24} className={category.color} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                    <p className="text-gray-400 text-sm">{category.reports.length} reports available</p>
                  </div>
                </div>
                {expandedSections[key] ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </button>

              {expandedSections[key] && (
                <div className="border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    {category.reports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
                        onClick={() => handleReportView(report)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${category.bgColor}`}>
                              <report.icon size={18} className={category.color} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                {report.title}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                                {report.status}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDownloadReport(report, e)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{report.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Updated {report.lastUpdated}</span>
                          <div className="flex items-center gap-2">
                            <Eye size={14} />
                            <span>View Report</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;