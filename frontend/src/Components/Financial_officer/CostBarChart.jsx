import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";

// Monthly data with additional metrics
const data = [
  { month: "Jan", cost: 120000, budget: 125000, trend: "up" },
  { month: "Feb", cost: 95000, budget: 100000, trend: "down" },
  { month: "Mar", cost: 134000, budget: 130000, trend: "up" },
  { month: "Apr", cost: 88000, budget: 95000, trend: "down" },
  { month: "May", cost: 145000, budget: 140000, trend: "up" },
  { month: "Jun", cost: 99000, budget: 105000, trend: "down" },
  { month: "Jul", cost: 110000, budget: 115000, trend: "up" },
  { month: "Aug", cost: 101000, budget: 110000, trend: "down" },
  { month: "Sep", cost: 93000, budget: 100000, trend: "down" },
  { month: "Oct", cost: 124000, budget: 120000, trend: "up" },
  { month: "Nov", cost: 138000, budget: 135000, trend: "up" },
  { month: "Dec", cost: 150000, budget: 145000, trend: "up" },
];

const MonthlyCostBarChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showBudget, setShowBudget] = useState(true);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Calculate summary statistics
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const avgCost = totalCost / data.length;
  const maxCost = Math.max(...data.map(item => item.cost));
  const minCost = Math.min(...data.map(item => item.cost));
  const budgetVariance = ((totalCost - totalBudget) / totalBudget * 100).toFixed(1);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const variance = ((data.cost - data.budget) / data.budget * 100).toFixed(1);
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label} 2024</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Actual Cost:</span> 
              <span className="ml-2 font-bold text-blue-600">Rs. {data.cost.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Budget:</span> 
              <span className="ml-2 font-bold text-gray-600">Rs. {data.budget.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Variance:</span>
              <span className={`ml-2 font-bold ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variance >= 0 ? '+' : ''}{variance}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Monthly Cost Analysis</h2>
            <p className="text-sm text-gray-600">Actual vs Budget Comparison</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowBudget(!showBudget)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showBudget 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showBudget ? 'Hide Budget' : 'Show Budget'}
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>2024</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">TOTAL COST</p>
              <p className="text-lg font-bold text-blue-900">Rs. {(totalCost / 1000000).toFixed(1)}M</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">AVG MONTHLY</p>
              <p className="text-lg font-bold text-green-900">Rs. {(avgCost / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">~</span>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">HIGHEST</p>
              <p className="text-lg font-bold text-purple-900">Rs. {(maxCost / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
        </div>
        
        <div className={`${budgetVariance >= 0 ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${budgetVariance >= 0 ? 'text-red-600' : 'text-green-600'} font-medium`}>
                BUDGET VAR
              </p>
              <p className={`text-lg font-bold ${budgetVariance >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                {budgetVariance >= 0 ? '+' : ''}{budgetVariance}%
              </p>
            </div>
            {budgetVariance >= 0 ? 
              <TrendingUp className="w-5 h-5 text-red-500" /> : 
              <TrendingDown className="w-5 h-5 text-green-500" />
            }
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#faad00" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#000000" stopOpacity={0.9}/>
              </linearGradient>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="#047857" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#D97706" stopOpacity={1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={{ stroke: '#D1D5DB' }}
            />
            
            <YAxis
              tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}K`}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={{ stroke: '#D1D5DB' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Average line */}
            <ReferenceLine 
              y={avgCost} 
              stroke="#9CA3AF" 
              strokeDasharray="5 5"
              label={{ value: "Average", position: "insideTopRight", fontSize: 10 }}
            />
            
            {/* Budget bars (background) */}
            {showBudget && (
              <Bar
                dataKey="budget"
                fill="url(#budgetGradient)"
                radius={[4, 4, 0, 0]}
                barSize={35}
                opacity={0.3}
              />
            )}
            
            {/* Actual cost bars */}
            <Bar
              dataKey="cost"
              barSize={35}
              radius={[4, 4, 0, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === activeIndex 
                      ? "url(#activeGradient)" 
                      : "url(#costGradient)"
                  }
                  stroke={index === activeIndex ? "#D97706" : "transparent"}
                  strokeWidth={index === activeIndex ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded"></div>
          <span className="text-gray-600">Actual Cost</span>
        </div>
        {showBudget && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded opacity-50"></div>
            <span className="text-gray-600">Budget</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 border-t-2 border-dashed border-gray-400"></div>
          <span className="text-gray-600">Average</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCostBarChart;