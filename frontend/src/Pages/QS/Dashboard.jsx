import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/QS/Layout';
import CalendarCard from '../../Components/Financial_officer/CalenderCard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
// Use existing chart components:
import MonthlyCostBarChart from '../../Components/Financial_officer/CostBarChart';
import ProjectStatusChart from '../../Components/Financial_officer/ProjectStatusChart';

function Dashboard() {
  const navigate = useNavigate();

  // Navigation handlers for quick links
  const handleQuickLinkNavigation = (page) => {
    switch(page) {
      case 'projects':
        navigate('/qs/projects');
        break;
      case 'boqs':
        navigate('/qs/boq');
        break;
      case 'material-requests':
        navigate('/qs/requests');
        break;
      case 'site-visits':
        navigate('/qs/projects'); // Assuming site visits are in projects
        break;
      default:
        break;
    }
  };

  // Sample data for quick demo
  const todoItems = [
    { id: 1, task: 'Update BOQ for Project A', deadline: '2025-06-20', priority: 'High' },
    { id: 2, task: 'Schedule site visit for Project B', deadline: '2025-06-22', priority: 'Medium' },
    { id: 3, task: 'Review material requests', deadline: '2025-06-19', priority: 'High' },
    { id: 4, task: 'Prepare cost estimation for new project', deadline: '2025-06-25', priority: 'Medium' },
  ];

  const notifications = [
    { id: 1, message: 'New material request submitted', time: '2 hours ago', isRead: false },
    { id: 2, message: 'BOQ approval required for Project C', time: '1 day ago', isRead: true },
    { id: 3, message: 'Site visit scheduled tomorrow', time: '5 hours ago', isRead: false },
    { id: 4, message: 'Budget update for Project D', time: '3 days ago', isRead: true },
  ];

  // Sample projects data for the status chart
  const sampleProjects = [
    { status: 'Active' },
    { status: 'Active' },
    { status: 'Completed' },
    { status: 'Pending' },
    { status: 'Active' },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome, Quantity Survey Officer!</h2>
            <p className="text-gray-600">
              Manage BOQs, track project costs, and handle material requests here.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center hover:bg-black hover:text-amber-500">
              <HomeWorkIcon />
              <h3 className="text-lg font-semibold mb-2">Project Count</h3>
              <p className="text-3xl font-bold text-amber-500">8</p>
            </div>

            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center hover:bg-black hover:text-amber-500">
              <AssignmentIcon />
              <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
              <p className="text-3xl font-bold text-amber-500">12</p>
            </div>

            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center hover:bg-black hover:text-amber-500">
              <EventIcon />
              <h3 className="text-lg font-semibold mb-2">Upcoming Milestones</h3>
              <p className="text-3xl font-bold text-amber-500">4</p>
            </div>

            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center hover:bg-black hover:text-amber-500">
              <MonetizationOnIcon />
              <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
              <p className="text-3xl font-bold text-amber-500">Rs 45M</p>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                onClick={() => handleQuickLinkNavigation('projects')}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col items-center hover:bg-gray-50 cursor-pointer"
              >
                <HomeWorkIcon className="text-amber-500 text-3xl mb-2" />
                <span className="text-gray-700 font-medium">Projects</span>
              </div>
              
              <div 
                onClick={() => handleQuickLinkNavigation('boqs')}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col items-center hover:bg-gray-50 cursor-pointer"
              >
                <DescriptionIcon className="text-amber-500 text-3xl mb-2" />
                <span className="text-gray-700 font-medium">BOQs</span>
              </div>
              
              <div 
                onClick={() => handleQuickLinkNavigation('material-requests')}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col items-center hover:bg-gray-50 cursor-pointer"
              >
                <ShoppingCartIcon className="text-amber-500 text-3xl mb-2" />
                <span className="text-gray-700 font-medium">Material Requests</span>
              </div>
              
              <div 
                onClick={() => handleQuickLinkNavigation('site-visits')}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col items-center hover:bg-gray-50 cursor-pointer"
              >
                <DirectionsWalkIcon className="text-amber-500 text-3xl mb-2" />
                <span className="text-gray-700 font-medium">Site Visits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Calendar Section */}
        <div className="lg:w-1/4 w-full">
          <CalendarCard />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mt-8">
        {/* Charts Section using existing components */}
        <div className="w-full xl:w-2/3">
          <MonthlyCostBarChart />
        </div>
        
        <div className="w-full xl:w-1/3">
          <ProjectStatusChart projects={sampleProjects} />
        </div>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-4 mt-8">
        {/* To-Do List Section */}
        <div className="w-full xl:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AssignmentIcon className="mr-2 text-amber-500" />
            To-Do List
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2 text-left">Task</th>
                  <th className="py-2 text-left">Deadline</th>
                  <th className="py-2 text-left">Priority</th>
                </tr>
              </thead>
              <tbody>
                {todoItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{item.task}</td>
                    <td className="py-3">{item.deadline}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'High' ? 'bg-red-100 text-red-600' : 
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Notifications Panel */}
        <div className="w-full xl:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border-l-4 ${notification.isRead ? 'border-gray-300 bg-gray-50' : 'border-amber-500 bg-amber-50'}`}
              >
                <div className="flex justify-between">
                  <p className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
