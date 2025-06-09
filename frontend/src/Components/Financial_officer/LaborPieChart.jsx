import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Mason", value: 15 },
  { name: "Electrician", value: 8 },
  { name: "Plumber", value: 10 },
  { name: "Painter", value: 5 },
  { name: "Carpenter", value: 12 },
];

const COLORS = ["#faad00", "#000000",  "#868686","#fdeb87","#4a4a4a"];

const LaborPieChart = () => {
  return (
    <div className="w-full h-[300px] md:h-96 bg-white p-1 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="25%" // 👈 Add this line to make it a doughnut
            outerRadius="75%"
            fill="#8884d8"
            label={({ percent }) => `(${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={32}
            iconSize={10}
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LaborPieChart;
