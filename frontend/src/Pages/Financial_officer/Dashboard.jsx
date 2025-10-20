import React, { useState, useEffect } from "react";
import CostBarChart from "../../Components/Financial_officer/CostBarChart";
import axios from "axios";
import {
  Building2,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";
import ProjectTypePieChart from "../../Components/Financial_officer/ProjectPieChart";

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



const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [projectIds, setProjectIds] = useState([]); // ✅ this must be here
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [workerCount, setWorkerCount] = useState(0); // ✅ added for worker count
  const [formConfirmation, setFormConfirmation] = useState({
    confirmation_id: "",
    payment_id: "",
    project_id: "",
    amount: "",
    document_id: "",
    status: "Pending",
    confirmation_date: "",
  });

  const [recentPayments, setRecentPayments] = useState([]);



  useEffect(() => {
    axios
      .get("http://localhost:8086/api/v1/financial_officer")
      .then((res) => {
        const ongoing = res.data.filter((p) => p.status === "ongoing");
        setProjects(ongoing);
        setProjectIds(ongoing.map((p) => p.projectId)); // ✅ ensure projectIds are set here
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    if (!projectIds.length) return;

    const fetchWorkerCount = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedDate = yesterday.toISOString().split("T")[0];

        const responses = await Promise.all(
          projectIds.map((id) =>
            axios.get(`http://localhost:8086/api/v1/financial_officer/attendance/${id}/date?date=${formattedDate}`)
          )
        );

        const allAttendance = responses.flatMap((r) => (Array.isArray(r.data) ? r.data : []));
        const uniqueWorkers = new Set(allAttendance.map((w) => w.workerId)); // change field name if different
        const totalWorkerCount = uniqueWorkers.size;

        setWorkerCount(totalWorkerCount);
        console.log("Worker count for yesterday:", totalWorkerCount);
      } catch (error) {
        console.error("Error fetching worker count:", error);
      }
    };

    fetchWorkerCount();
  }, [projectIds]);




  // 🟦 Fetch Confirmations
  useEffect(() => {
    axios
      .get("http://localhost:8086/api/v1/financial_officer/payment_confirmation")
      .then((res) => setFormConfirmation(res.data))
      .catch((err) => console.error("Error fetching confirmations:", err));
  }, []);

  // 🟦 Fetch Orders
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8086/api/v1/financial_officer/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:8086/api/v1/financial_officer/labor_payment");
      const data = await res.json();
      setRecentPayments(data);
    } catch (err) {
      console.error("Error fetching recent payments:", err);
    }
  };

  // 🟩 Call this once when component mounts
  useEffect(() => {
    fetchPayments();
  }, []);



  // 🟨 Summary Cards
  const summaryCards = [
    {
      title: "Ongoing Projects",
      value: activeCount,
      icon: Building2,
      trend: "+2 from last month",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Pending Approvals",
      value: formConfirmation.length,
      icon: Clock,
      trend: "3 urgent",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      title: "Pending Payments",
      value: orders.filter((o) => o.status?.toLowerCase() === "pending").length,
      icon: DollarSign,
      trend: "Rs. 312,500 total",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Active Workers",
      value: workerCount,
      icon: Users,
      trend: "85% capacity",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
  ];


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-9xl mx-auto px-6 py-8">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CostBarChart projects={projects} />
              </div>

              <div>
                <ProjectTypePieChart/>
              </div>
            </div>


          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {recentPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.projectId}</p>
                          <p className="text-sm text-gray-500">{payment.comment}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <p className="font-semibold text-gray-900">Rs. {payment.amount}</p>
                        <div className="flex items-center">
                          {payment.status === "Completed" ? (
                            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </div>
                          ) : payment.status === "Processing" ? (
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
              )}
            </div>




          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
