import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/SQS/Layout';
import CalendarCard from '../../Components/Financial_officer/CalenderCard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BusinessIcon from '@mui/icons-material/Business';
// Use existing chart components:
import MonthlyCostBarChart from '../../Components/Financial_officer/CostBarChart';
import ProjectStatusChart from '../../Components/Financial_officer/ProjectStatusChart';

function Dashboard() {
  const navigate = useNavigate();
  
  // State to control customer registration section visibility
  const [showCustomerRegistration, setShowCustomerRegistration] = useState(false);
  
  // State to control QS assignment overlay
  const [showQSAssignmentOverlay, setShowQSAssignmentOverlay] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

  // Sample data for QS officers
  const qsOfficers = [
    { id: 1, name: 'John Smith', expertise: 'Commercial Buildings', availableProjects: 2 },
    { id: 2, name: 'Sarah Wilson', expertise: 'Infrastructure', availableProjects: 1 },
    { id: 3, name: 'Mike Johnson', expertise: 'Residential', availableProjects: 3 },
    { id: 4, name: 'Emily Davis', expertise: 'Industrial', availableProjects: 1 },
  ];

  // Sample data for pending projects without QS
  const pendingProjects = [
    { id: 1, name: 'Shopping Mall Complex', type: 'Commercial', priority: 'High', client: 'ABC Corp' },
    { id: 2, name: 'Highway Extension', type: 'Infrastructure', priority: 'Medium', client: 'Government' },
    { id: 3, name: 'Residential Tower', type: 'Residential', priority: 'High', client: 'XYZ Developers' },
  ];
  // Sample data for recent customer registrations
  const recentCustomers = [
    { id: 1, name: 'John Anderson', type: 'Individual', registeredDate: '2025-06-22', status: 'Pending' },
    { id: 2, name: 'Sarah Mitchell', type: 'Business Owner', registeredDate: '2025-06-21', status: 'Approved' },
    { id: 3, name: 'Michael Johnson', type: 'Contractor', registeredDate: '2025-06-20', status: 'Under Review' },  ];

  // Function to handle opening QS assignment overlay
  const handleAssignQS = (project) => {
    setSelectedProject(project);
    setShowQSAssignmentOverlay(true);
  };

  // Function to handle QS assignment
  const handleQSAssignment = (qsOfficer) => {
    console.log(`Assigning ${qsOfficer.name} to project ${selectedProject.name}`);
    // Here you would typically make an API call to assign the QS officer
    setShowQSAssignmentOverlay(false);
    setSelectedProject(null);
  };

  // Navigation handlers for quick links
  const handleQuickLinkNavigation = (page) => {
    switch(page) {
      case 'projects':
        navigate('/sqs/projects');
        break;
      case 'boqs':
        navigate('/sqs/boq');
        break;
      case 'material-requests':
        navigate('/sqs/requests');
        break;
      case 'site-visits':
        navigate('/sqs/projects'); // Assuming site visits are in projects
        break;
      case 'assign-qs':
        // Scroll to QS assignment section or open overlay
        document.getElementById('qs-assignment-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'register-customer':
        setShowCustomerRegistration(true);
        break;
      default:
        break;
    }
  };
  return (
    <div>
      {/* Toggle Button for Customer Registration Section */}
      <div className="mb-4">
        <button 
          onClick={() => setShowCustomerRegistration(!showCustomerRegistration)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <BusinessIcon />
          {showCustomerRegistration ? 'Hide Customer Registration' : 'Show Customer Registration'}
        </button>
      </div>

      {/* Customer Registration and QS Assignment - Priority Sections */}
      {showCustomerRegistration && (
        <div className="flex flex-col xl:flex-row gap-4 mb-8">
        <div className="w-full xl:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BusinessIcon className="mr-2 text-amber-500" />
            Customer Registration
          </h3>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                  <option value="">Select type</option>
                  <option value="individual">Owner</option>
                  <option value="business-owner">Agent</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="National ID or passport number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows="3"
                placeholder="Residential address"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Register Customer
            </button>
          </form>
        </div>

        {/* Recent Customer Registrations */}
        <div className="w-full xl:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-md font-medium mb-3 text-gray-700">Recent Customer Registrations</h4>
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.type}</p>
                    <p className="text-xs text-gray-500">Registered: {customer.registeredDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    customer.status === 'Approved' ? 'bg-green-100 text-green-600' :
                    customer.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
            <div className="mt-4 pt-3 border-t">
            <button className="w-full text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All Customers →
            </button>
          </div>
        </div>
      </div>
      )}

      {/* QS Officer Assignment Section */}
      <div id="qs-assignment-section" className="flex flex-col xl:flex-row gap-4 mb-8">
        <div className="w-full xl:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AssignmentIndIcon className="mr-2 text-amber-500" />
            Assign QS Officers to Projects
          </h3>
          
          {/* Pending Projects Table */}
          <div className="mb-6">
            <h4 className="text-md font-medium mb-3 text-gray-700">Projects Awaiting QS Assignment</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 text-left">Project Name</th>
                    <th className="py-2 text-left">Type</th>
                    <th className="py-2 text-left">Client</th>
                    <th className="py-2 text-left">Priority</th>
                    <th className="py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium">{project.name}</td>
                      <td className="py-3">{project.type}</td>
                      <td className="py-3">{project.client}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.priority === 'High' ? 'bg-red-100 text-red-600' : 
                          project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {project.priority}
                        </span>
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => handleAssignQS(project)}
                          className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 text-sm"
                        >
                          Assign QS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Available QS Officers */}
        <div className="w-full xl:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-md font-medium mb-3 text-gray-700">Available QS Officers</h4>
          <div className="space-y-3">
            {qsOfficers.map((officer) => (
              <div key={officer.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{officer.name}</p>
                    <p className="text-sm text-gray-600">{officer.expertise}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    {officer.availableProjects} slots
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

              <div 
                onClick={() => handleQuickLinkNavigation('assign-qs')}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col items-center hover:bg-gray-50 cursor-pointer"
              >
                <AssignmentIndIcon className="text-amber-500 text-3xl mb-2" />
                <span className="text-gray-700 font-medium">Assign QS</span>
              </div>

              <div 
                onClick={() => handleQuickLinkNavigation('register-customer')}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col items-center hover:bg-gray-50 cursor-pointer"
              >
                <BusinessIcon className="text-amber-500 text-3xl mb-2" />
                <span className="text-gray-700 font-medium">Register Customer</span>
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

      {/* QS Assignment Overlay */}
      {showQSAssignmentOverlay && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Assign QS Officer to: {selectedProject?.name}
              </h2>
              <button
                onClick={() => {
                  setShowQSAssignmentOverlay(false);
                  setSelectedProject(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Project Details:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Project:</strong> {selectedProject?.name}</div>
                <div><strong>Type:</strong> {selectedProject?.type}</div>
                <div><strong>Client:</strong> {selectedProject?.client}</div>
                <div>
                  <strong>Priority:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProject?.priority === 'High' ? 'bg-red-100 text-red-600' : 
                    selectedProject?.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    {selectedProject?.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Available QS Officers</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Expertise</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Current Projects</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qsOfficers.map((officer) => (
                      <tr key={officer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{officer.name}</td>
                        <td className="py-3 px-4 text-gray-600">{officer.expertise}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
                            {5 - officer.availableProjects}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleQSAssignment(officer)}
                            className="bg-amber-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => {
                  setShowQSAssignmentOverlay(false);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
