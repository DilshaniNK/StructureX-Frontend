// components/ProjectCompletionBarChart.js
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ProjectCompletionBarChart = ({ data = [] }) => {
  // Add a 100% target to each entry
  const processedData = data.map((item) => ({
    ...item,
    target: 100,
  }));

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-center mb-1 text-gray-800">
        Project Completion Overview
      </h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        Each project displays total target (100%) and current completion.
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 0" />
          <XAxis dataKey="project" fontSize={12}/>
          <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} fontSize={12} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="target" fill="#000000" name="Target (100%)" barSize={12} radius={[8, 8, 8, 8]}/>
          <Bar dataKey="completion" fill="#faad00" name="Completed" barSize={12} radius={[8, 8, 8, 8]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectCompletionBarChart;
