import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import WorkerDistributionChart from '../../Components/Site_supervisor/WorkerDistributionChart'
import InventoryChart from '../../Components/Site_supervisor/InventoryChart'
import { 
  FolderOpen, 
  Clock, 
  AlertCircle, 
  Users, 
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Building,
  DollarSign,
  ChevronRight
} from 'lucide-react'

const EMPLOYEE_ID = "EMP_001";


const sampleData = [
  { project: 'Project A', workers: 25 },
  { project: 'Project B', workers: 40 },
  { project: 'Project C', workers: 15 },
  { project: 'Project D', workers: 20 },
]

const projectData = [
  { project: 'Project A', completion: 65 },
  { project: 'Project B', completion: 90 },
  { project: 'Project C', completion: 45 },
]

const todayTasks = [
  { id: 1, task: 'Inspect Project A foundation', completed: false, time: '10:00 AM' },
  { id: 2, task: 'Approve material delivery', completed: false, time: '11:30 AM' },
  { id: 3, task: 'Assign workers to Project B', completed: true, time: '2:00 PM' },
]



const WorkerDistributionCard = () => (
  <div >
    
    <WorkerDistributionChart data={sampleData} />
   
  </div>
)

const ProjectCompletionBarChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Project Completion</h3>
      <Activity className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-3">
      {data.map((project, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{project.project}</span>
            <span className="text-gray-600">{project.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.completion}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const TodayTasks = ({ tasks }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Today's Tasks</h3>
      <Calendar className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-3">
      {tasks.map((task) => (
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
      ))}
    </div>
  </div>
)

const Dashboard = () => {
  const EMPLOYEE_ID = "EMP_001";

  const[projects,setProjects]=useState([])
  const[activeCount,setActiveCount ]= useState(0)
  const[visits,setVisits] = useState(0)
  const[tasks,setTaskList]= useState([])

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

  useEffect(() => {
    axios.get(`http://localhost:8086/api/v1/site_supervisor/todo/sp/${EMPLOYEE_ID}`)
 // Replace with your API endpoint
      .then((response) => {
        setTaskList(response.data);
        setVisits(response.data.filter(p => p.status === "pending").length);
       
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        
      });
  }, []);

  const summaryCards = [
  {
    title: "Ongoing Projects",
    value: activeCount,
    icon: Building,
    trend: "+2 from last month",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200"
  },
  {
    title: "Pending Approvals",
    value: 5,
    icon: AlertCircle,
    trend: "3 urgent",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200"
  },
  {
    title: "Today's Visits",
    value: visits,
    icon: Clock,
    trend: "Total amount",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    borderColor: "border-green-200"
  },
  {
    title: "Assinged Workers",
    value: 35,
    icon: Users,
    trend: "85% capacity",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200"
  }
]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Inventory Chart - Takes up 2 columns */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Inventory Overview</h2>
              <p className="text-sm text-gray-600 mt-1">Current stock levels across all sites</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
          <InventoryChart />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 border border-blue-100">
              <div className="flex items-center space-x-3">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <a href='site_supervisor/to_do'>
                  <p className="font-medium text-gray-800">Create New Task</p>
                  <p className="text-xs text-gray-600">Start a new task </p></a>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 border border-green-100">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-black-600" />
                <div>
                   <a href='/site_supervisor/inventory'>
                  <p className="font-medium text-gray-800">Review Tool Requests</p>
                  <p className="text-xs text-gray-600">Approve pending tool requestss</p></a>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors duration-200 border border-amber-100">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div >
                  <a href='/site_supervisor/materials'>
                  <p className="font-medium text-gray-800">Review Material Requests</p>
                  <p className="text-xs text-gray-600">Approve pending material requests</p></a>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectCompletionBarChart data={projectData} />
        <TodayTasks tasks={todayTasks} />
        <WorkerDistributionCard />
      </div>
    </div>
  )
}

export default Dashboard
