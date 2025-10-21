import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ProjectCostChart = ({ projects }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) return;

    const fetchExpenses = async () => {
      try {
        const responses = await Promise.all(
          projects.map((p) =>
            axios.get(`http://localhost:8086/api/v1/financial_officer/expenses/${p.projectId}`)
          )
        );

        const formatted = projects.map((p, i) => ({
          name: p.projectName || p.projectId,
          Estimated: p.estimatedValue || 0,
          Expenses: responses[i].data || 0,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching project expenses:", err);
      }
    };

    fetchExpenses();
  }, [projects]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Cost Overview</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Estimated" fill="#93C5FD" name="Estimated Value (Rs)" />
          <Bar dataKey="Expenses" fill="#F59E0B" name="Expenses (Rs)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectCostChart;
