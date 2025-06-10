import React from 'react'
import InventoryChart from '../../Components/Site_supervisor/InventoryChart'
import Projects from '@mui/icons-material/FolderOpenOutlined';
import Pending from '@mui/icons-material/MoreHoriz';
import Labors from '@mui/icons-material/Groups2Outlined';
import Visits from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import WorkerDistributionChart from '../../Components/Site_supervisor/WorkerDistributionChart';
import ProjectCompletionBarChart from '../../Components/Site_supervisor/CompletionRateChart'; 
import TodayTasks from '../../Components/Site_supervisor/TodayTasks';


const sampleData = [
  { project: 'Project A', workers: 25 },
  { project: 'Project B', workers: 40 },
  { project: 'Project C', workers: 15 },
  { project: 'Project D', workers: 20 },
];

const projectData = [
  { project: 'Project A', completion: 65 },
  { project: 'Project B', completion: 90 },
  { project: 'Project C', completion: 45 },
];

const todayTasks = [
  { id: 1, task: 'Inspect Project A foundation', completed: false, time: '10:00 AM' },
  { id: 2, task: 'Approve material delivery', completed: false, time: '11:30 AM' },
  { id: 3, task: 'Assign workers to Project B', completed: true, time: '2:00 PM' },
];


const Dashboard = () => {
  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-4 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
          {/* Ongoing Projects Card */}
          <div className="bg-white  rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Projects className="w-6 h-6 text-blue-600 text-center" />
              </div> 
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ongoing Projects</h3>
            <p className="text-gray-600 text-sm">Active projects in progress</p>
            <p className="text-3xl font-semibold text-gray-800 mb-2 ">6</p>
          </div>

          <div className="bg-white  rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Visits className="w-6 h-6 text-yellow-600 text-center" />
              </div> 
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Visits</h3>
            <p className="text-gray-600 text-sm">Today you have visits sites</p>
            <p className="text-3xl font-semibold text-gray-800 mb-2 ">2</p>
          </div>


          <div className="bg-white  rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Pending className="w-6 h-6 text-red-600 text-center" />
              </div> 
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Requests</h3>
            <p className="text-gray-600 text-sm">Pending requests materials for sites</p>
            <p className="text-3xl font-semibold text-gray-800 mb-2 ">3</p>
          </div>

          <div className="bg-white  rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Labors className="w-6 h-6 text-gray-600 text-center" />
              </div> 
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned Workers</h3>
            <p className="text-gray-600 text-sm">Total workers assigned to your all projects</p>
            <p className="text-3xl font-semibold text-gray-800 mb-2 ">187</p>
          </div>
        </div>

        {/* Bar Chart */}
          <div className="w-full xl:w-4/7 bg-white p-4 rounded-2xl shadow-md">
              <p className="text-xl font-bold text-center mb-1 text-gray-800">Inventory Overview</p>
              <InventoryChart />
          </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Worker Distribution Chart */}
              <WorkerDistributionChart data={sampleData} />
              <ProjectCompletionBarChart data={projectData} />
              <TodayTasks tasks={todayTasks} />
   
          </div>
        </div>
      </div>

   
  )
}

export default Dashboard
