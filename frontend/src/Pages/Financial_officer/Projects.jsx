import React, { useState, useEffect } from "react";
import Layout from "../../Components/Financial_officer/Layout";

import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';

const sampleProjects = [
  { id: 1, name: "Tower A", budget: 500000, spent: 420000, status: "Active"},
  { id: 2, name: "Bridge Renovation", budget: 300000, spent: 280000, status: "Completed" },
  { id: 3, name: "Mall B", budget: 700000, spent: 400000, status: "Pending" },
  { id: 4, name: "Highway Extension", budget: 900000, spent: 750000, status: "Active"},
  { id: 5, name: "Office Park", budget: 600000, spent: 600000, status: "Completed"},
];

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Count-up animation states
  const [housingCount, setHousingCount] = useState(0);
  const [commercialCount, setCommercialCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);
  const [sportsCount, setSportsCount] = useState(0);

  useEffect(() => {
    const animateCount = (target, setter) => {
      let current = 0;
      const increment = Math.ceil(target / 30);
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setter(current);
      }, 100);
    };

    animateCount(12, setHousingCount);
    animateCount(5, setCommercialCount);
    animateCount(5, setEducationCount);
    animateCount(4, setSportsCount);
  }, []);

  const filteredProjects = sampleProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div>
        <h1 className="text-center justify-center align-middle text-3xl mb-15">Ongoing Projects</h1>
        
        {/* Top Cards */}
        <div className="flex flex-wrap gap-8 mb-20">
          <div className="flex-1 min-w-[200px] border-black border-4 hover:border-amber-500 p-6 rounded-lg text-center">
            <HomeWorkIcon className="text-amber-400" style={{ fontSize: '60px' }} />
            <h3 className="mb-2">Housing Complexes & Real Estate</h3>
            <p className="text-3xl font-bold text-amber-500">{housingCount}+</p>
          </div>

          <div className="flex-1 min-w-[200px] border-black border-4 hover:border-amber-500 p-6 rounded-lg text-center">
            <CorporateFareIcon className="text-amber-400" style={{ fontSize: '60px' }} />
            <h3 className="mb-2">Commercial Buildings</h3>
            <p className="text-3xl font-bold text-amber-500">{commercialCount}+</p>
          </div>

          <div className="flex-1 min-w-[200px] border-black border-4 hover:border-amber-500 p-6 rounded-lg text-center">
            <AccountBalanceIcon className="text-amber-400" style={{ fontSize: '60px' }} />
            <h3 className="mb-2">Educational Institutes</h3>
            <p className="text-3xl font-bold text-amber-500">{educationCount}+</p>
          </div>

          <div className="flex-1 min-w-[200px] border-black border-4 hover:border-amber-500 p-6 rounded-lg text-center">
            <HolidayVillageIcon className="text-amber-400" style={{ fontSize: '60px' }} />
            <h3 className="mb-2">Sports & Hotel Complexes</h3>
            <p className="text-3xl font-bold text-amber-500">{sportsCount}+</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by project name..."
          className="w-full md:w-1/2 p-2 border-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full md:w-1/4 p-2 border-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Budget ($)</th>
              <th className="px-4 py-2">Spent ($)</th>
              <th className="px-4 py-2">Remaining ($)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr key={project.id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 font-medium">{project.name}</td>
                  <td className="px-4 py-2">{project.budget.toLocaleString()}</td>
                  <td className="px-4 py-2">{project.spent.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {(project.budget - project.spent).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : project.status === "Active"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
