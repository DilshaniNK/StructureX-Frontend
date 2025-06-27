import React,{useState,useEffect} from 'react';
import CostBarChart from '../../Components/Financial_officer/CostBarChart';
import axios from 'axios';

import { 
  Building2, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  PieChart
} from 'lucide-react';

// Mock components - replace with your actual components
const CalenderCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
      <Calendar className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Today's Schedule</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">Budget Review</span>
          <span className="text-xs text-blue-600">10:00 AM</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
          <span className="text-sm font-medium">Project Meeting</span>
          <span className="text-xs text-amber-600">2:00 PM</span>
        </div>
      </div>
    </div>
  </div>
);

const MonthlyCostBarChart = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Monthly Cost Analysis</h3>
      <BarChart3 className="w-5 h-5 text-gray-500" />
    </div>
    <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
      <div className="text-gray-500 text-sm">Chart visualization would go here</div>
    </div>
  </div>
);

const LaborPieChart = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Labor Distribution</h3>
      <PieChart className="w-5 h-5 text-gray-500" />
    </div>
    <div className="h-48 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
      <div className="text-gray-500 text-sm">Pie chart visualization would go here</div>
    </div>
  </div>
);

const Dashboard = () => {

  const [projects, setProjects] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8086/api/v1/financial_officer")
 // Replace with your API endpoint
      .then((response) => {
        setProjects(response.data);

        setActiveCount(response.data.filter(p => p.status === "Active").length);
       
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        
      });
  }, []);

   

  const summaryCards = [
    {
      title: "Ongoing Projects",
      value: activeCount,
      icon: Building2,
      trend: "+2 from last month",
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Pending Approvals",
      value: "5",
      icon: Clock,
      trend: "3 urgent",
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200"
    },
    {
      title: "Pending Payments",
      value: "5",
      icon: DollarSign,
      trend: "Rs. 312,500 total",
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      title: "Active Workers",
      value: "35",
      icon: Users,
      trend: "85% capacity",
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    }
  ];

  const recentPayments = [
    { project: "Residential Complex A", amount: "120,000", status: "Completed", date: "Today" },
    { project: "Commercial Building B", amount: "245,000", status: "Processing", date: "Yesterday" },
    { project: "Infrastructure Project C", amount: "180,000", status: "Completed", date: "2 days ago" },
    { project: "Renovation Project D", amount: "67,500", status: "Pending", date: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.trend}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Section - Charts */}
          <div className="lg:col-span-3 space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CostBarChart />
              </div>
              <div>
                <LaborPieChart />
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {recentPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.project}</p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-gray-900">Rs. {payment.amount}</p>
                      </div>
                      <div className="flex items-center">
                        {payment.status === 'Completed' ? (
                          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </div>
                        ) : payment.status === 'Processing' ? (
                          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            Processing
                          </div>
                        ) : (
                          <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Calendar and Quick Actions */}
          <div className="space-y-6">
            <CalenderCard />
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Process Payment
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  New Project
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Alert Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-amber-900">Attention Required</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    3 urgent approvals are pending review. Please check your approval queue.
                  </p>
                  <button className="text-amber-800 text-sm font-medium mt-2 hover:underline">
                    Review Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;