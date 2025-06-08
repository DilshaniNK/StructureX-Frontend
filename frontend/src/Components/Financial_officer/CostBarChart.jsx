import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

// Monthly data
const data = [
  { month: "Jan", cost: 120000 },
  { month: "Feb", cost: 95000 },
  { month: "Mar", cost: 134000 },
  { month: "Apr", cost: 88000 },
  { month: "May", cost: 145000 },
  { month: "Jun", cost: 99000 },
  { month: "Jul", cost: 110000 },
  { month: "Aug", cost: 101000 },
  { month: "Sep", cost: 93000 },
  { month: "Oct", cost: 124000 },
  { month: "Nov", cost: 138000 },
  { month: "Dec", cost: 150000 },
];

const MonthlyCostBarChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full h-72 md:h-96 bg-white p-4 rounded-lg shadow mt-8">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Monthly Total Cost Deployed
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: '#374151', fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar
            dataKey="cost"
            barSize={30}
            radius={[4, 4, 0, 0]}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#f59e0b" : "#000000"}
                onMouseEnter={(e) => handleMouseEnter(e, index)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyCostBarChart;
