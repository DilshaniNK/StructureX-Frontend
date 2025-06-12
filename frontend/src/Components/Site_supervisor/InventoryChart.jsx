
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Project A', cement: 65, steel: 45, bricks: 80 },
  { name: 'Project B', cement: 40, steel: 30, bricks: 50 },
  { name: 'Project C', cement: 20, steel: 15, bricks: 25 }, // low stock here
  { name: 'Project D', cement: 75, steel: 55, bricks: 90 },
];

// Threshold for low stock
const LOW_STOCK_THRESHOLD = 30;

// Function to check if any project is low stock for a material
const isLowStock = (materialKey) => {
  return data.some(item => item[materialKey] < LOW_STOCK_THRESHOLD);
};

const InventoryChart = () => {
  // Decide colors based on low stock alert
  const cementColor = isLowStock('cement') ? '#faad00' : '#8884d8';  // red if low
  const steelColor = isLowStock('steel') ? '#faad00' : '#82ca9d';
  const bricksColor = isLowStock('bricks') ? '#faad00' : '#ffc658';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={cementColor} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={cementColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorSteel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={steelColor} stopOpacity={0.5}/>
            <stop offset="95%" stopColor={steelColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBricks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={bricksColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={bricksColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" fontSize={10} />
        
        <CartesianGrid strokeDasharray="3 0" />
        <Tooltip />
        <Area type="monotone" dataKey="cement" stroke={cementColor} fillOpacity={1} fill="url(#colorCement)" />
        <Area type="monotone" dataKey="steel" stroke={steelColor} fillOpacity={1} fill="url(#colorSteel)" />
        <Area type="monotone" dataKey="bricks" stroke={bricksColor} fillOpacity={1} fill="url(#colorBricks)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default InventoryChart;
