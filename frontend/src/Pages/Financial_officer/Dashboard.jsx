import React from 'react';
import Layout from '../../Components/Financial_officer/Layout';
import CalenderCard from '../../Components/Financial_officer/CalenderCard';
import EngineeingIcon from '@mui/icons-material/Engineering';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MonthlyCostBarChart from '../../Components/Financial_officer/CostBarChart';
import LaborPieChart from '../../Components/Financial_officer/LaborPieChart';
import MoneyIcon from '@mui/icons-material/Money';

const Dashboard = () => {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-10">
       
        <div className="flex-1">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome, Financial Officer!</h2>
            <p className="text-gray-600">
              Manage users, view reports, and update settings here.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center  hover:bg-black hover:text-amber-500 ">
              <HomeWorkIcon />
              <h3 className="text-lg font-semibold mb-2">Ongoing Projects</h3>
              <p className="text-3xl font-bold text-amber-500">12</p>
            </div>

            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center hover:bg-black hover:text-amber-500  ">
              <MoreHorizIcon />
              <h3 className="text-lg font-semibold mb-2 ">Pending Approvals</h3>
              <p className="text-3xl font-bold text-amber-500 ">5</p>
            </div>

            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center  hover:bg-black hover:text-amber-500 ">
              <MoneyIcon />
              <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
              <p className="text-3xl font-bold text-amber-500">5</p>
            </div>

            <div className="flex-1 min-w-[200px] border-amber-500 border-2 bg-white p-6 rounded-lg shadow-md text-center  hover:bg-black hover:text-amber-500 ">
              <EngineeingIcon />
              <h3 className="text-lg font-semibold mb-2">Today's Workers</h3>
              <p className="text-3xl font-bold text-amber-500">35</p>
            </div>
          </div></div>

         
          

        {/* Right Pie Chart Section */}
        <div className="lg:w-1/4 w-full ">
          <CalenderCard />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mt-3">
            {/* Bar Chart */}
            <div className="w-full xl:w-2/3">
              <MonthlyCostBarChart />
            </div>
            <div className="w-full xl:w-1/3 mt-7">
              <LaborPieChart/>
            </div>
            
        <div className="lg:w-1/3 w-full mt-6 bg-white p-4 rounded-lg shadow  ">
          <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex justify-between border-b pb-2">
                  <span>Project A</span>
                  <span className="text-black font-semibold">Rs. 120,000</span>
                  <span className="bg-amber-500 text-black font-semibold p-1 rounded-3xl">Completed</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Project B</span>
                  <span className="text-black font-semibold">Rs. 45,000</span>
                  <span className="bg-amber-500 text-black font-semibold p-1 rounded-3xl">Completed</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Project C</span>
                  <span className="text-black font-semibold">Rs. 80,000</span>
                  <span className="bg-amber-500 text-black font-semibold p-1 rounded-3xl">Completed</span>
                </li>
                <li className="flex justify-between">
                  <span>Project D</span>
                  <span className="text-black font-semibold">Rs. 67,500</span>
                  <span className="bg-amber-500 text-black font-semibold p-1 rounded-3xl">Completed</span>
                </li>
              </ul>
        </div>
           
            
         
          
            
        </div>
    </Layout>
  );
};

export default Dashboard;
