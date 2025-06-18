// components/WorkerDistributionChart.js
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#60a5fa', '#34d399', '#f87171', '#faad00', '#a78bfa']; // Tailwind-inspired colors

const WorkerDistributionChart = ({ data }) => {
  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-1 text-gray-800">
        Project-wise Worker Distribution
      </h2>
      <p className="text-center text-gray-600 text-sm">
        This chart shows how workers are distributed across different projects.
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="workers"
            nameKey="project"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={80} // for doughnut shape
            paddingAngle={3}
            
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkerDistributionChart;
