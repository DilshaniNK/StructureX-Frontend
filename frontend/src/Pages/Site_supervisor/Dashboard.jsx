import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import WorkerDistributionChart from '../../Components/Site_supervisor/WorkerDistributionChart';
import {
  Clock, AlertCircle, Users, Calendar, CheckCircle2, XCircle,
  Building, ChevronRight
} from 'lucide-react';
import {
  PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const API_BASE = "http://localhost:8086/api/v1/site_supervisor";

const WorkerDistributionCard = ({ data }) => (
  <div>
    <WorkerDistributionChart data={data} />
  </div>
);

// ✅ Category + Status Charts
const ProjectCategoryPieChart = ({ projectData }) => {
  const categoryCounts = projectData.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const statusCounts = projectData.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Category Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Project Categories
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RePieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      {/* Status Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Project Status Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4f46e5" barSize={40} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TodayTasks = ({ tasks }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Today's Pending Tasks</h3>
      <Calendar className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No pending tasks for today 🎉</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                {task.task}
              </p>
              <p className="text-xs text-gray-500 mt-1">{task.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const { employeeId } = useParams();
  const [workerData, setWorkerData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [todayTasksData, setTodayTasksData] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectRes = await axios.get(`${API_BASE}/projects/${employeeId}`);
        setProjectData(projectRes.data);

        const [materialsRes, laborsRes, toolsRes] = await Promise.all([
          axios.get(`${API_BASE}/material_requests`),
          axios.get(`${API_BASE}/labor_requests`),
          axios.get(`${API_BASE}/tool_requests`)
        ]);

        const totalPending =
          materialsRes.data.filter(r => r.pmApproval === "Pending" && r.qsApproval === "Pending").length +
          laborsRes.data.filter(r => r.pmApproval === "Pending" && r.qsApproval === "Pending").length +
          toolsRes.data.filter(r => r.pmApproval === "Pending" && r.qsApproval === "Pending").length;
        setPendingApprovals(totalPending);

        const tasksRes = await axios.get(`${API_BASE}/todo/sp/${employeeId}`);
        const today = new Date().toISOString().split('T')[0];
        const todayPendingTasks = tasksRes.data.filter(t => {
          const taskDate = new Date(t.date).toISOString().split('T')[0];
          return t.status === "pending" && taskDate === today;
        });

        setTodayTasksData(todayPendingTasks.map(t => ({
          id: t.taskId,
          task: t.description,
          time: new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: t.status === "completed"
        })));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, [employeeId]);

  const summaryCards = [
    {
      title: "Ongoing Projects",
      value: projectData.filter(p => p.status === "ongoing").length,
      icon: Building,
      trend: "+2 from last month",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals,
      icon: AlertCircle,
      trend: "3 urgent",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200"
    },
    {
      title: "Today's Pending Tasks",
      value: todayTasksData.length,
      icon: Clock,
      trend: "Due today",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      title: "Assigned Workers",
      value: workerData.reduce((sum, w) => sum + w.workers, 0),
      icon: Users,
      trend: "85% capacity",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>

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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectCategoryPieChart projectData={projectData} />
        <TodayTasks tasks={todayTasksData} />
      </div>

      
    </div>
  );
};

export default Dashboard;
