import React, { useState } from "react";
import Layout from "../../Components/Financial_officer/Layout";

const sampleProjects = [
  { id: 1, name: "Tower A", budget: 500000, spent: 420000, status: "Active" },
  { id: 2, name: "Bridge Renovation", budget: 300000, spent: 280000, status: "Completed" },
  { id: 3, name: "Mall B", budget: 700000, spent: 400000, status: "Pending" },
  { id: 4, name: "Highway Extension", budget: 900000, spent: 750000, status: "Active" },
  { id: 5, name: "Office Park", budget: 600000, spent: 600000, status: "Completed" },
];

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProjects = sampleProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="text-left"><h3>Ongoing projects</h3></div>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by project name..."
          className="w-full md:w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full md:w-1/4 p-2 border rounded"
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
          <thead className="bg-gray-200 text-gray-700">
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
    </div>
    </Layout>
  );
};

export default ProjectsPage;
