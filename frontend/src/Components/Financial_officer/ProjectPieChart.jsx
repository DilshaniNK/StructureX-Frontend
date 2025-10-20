import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import axios from "axios";

const COLORS = ["#4F46E5", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444"];

const ProjectTypePieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProjectTypeData = async () => {
      try {
        // Fetch all projects
        const res = await axios.get("http://localhost:8086/api/v1/financial_officer");
        const projects = res.data;

        // Group by category
        const grouped = projects.reduce((acc, project) => {
          const category = project.category || "Unknown";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Convert to chart data format
        const chartData = Object.keys(grouped).map((key) => ({
          name: key,
          value: grouped[key],
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error fetching project type data:", err);
      }
    };

    fetchProjectTypeData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Type Distribution
        </h3>
        <PieIcon className="w-5 h-5 text-gray-500" />
      </div>

      <div className="h-64">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No project data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTypePieChart;
