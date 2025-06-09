//npm install recharts@latest
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../../../Hooks/UseTheme";
import { overviewData, recentSalesData, topProducts } from "../../../Constants/Index";
import Footer from "../../../Components/Admin/Footer";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";

const DashboardPage = () => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-y-6">
            
            {/* Enhanced Metrics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon products">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Products</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">25,154</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            25%
                        </span>
                    </div>
                </div>
                
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon orders">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Paid Orders</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">$16,000</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            12%
                        </span>
                    </div>
                </div>
                
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon customers">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Total Customers</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">15,400k</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            15%
                        </span>
                    </div>
                </div>
                
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon sales">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title">Sales</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">12,340</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            19%
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4 shadow-gold hover-bounce">
                    <div className="card-header">
                        <p className="card-title text-lg gradient-text">Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={overviewData}
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FAAD00" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FFC746" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                    labelFormatter={(label) => `Month: ${label}`}
                                />
                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#64748b" : "#cbd5e1"}
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#64748b" : "#cbd5e1"}
                                    tickFormatter={(value) => `$${value}`}
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#FAAD00"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="card col-span-1 md:col-span-2 lg:col-span-3 shadow-gold hover-bounce">
                    <div className="card-header">
                        <p className="card-title text-lg gradient-text">Recent Sales</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0 custom-scrollbar">
                        <div className="space-y-3 p-4">
                            {recentSalesData.map((sale, index) => (
                                <div
                                    key={sale.id}
                                    className="flex items-center justify-between gap-x-4 rounded-lg p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FAAD00]/10 hover:to-[#FFC746]/10 hover:shadow-md hover:scale-[1.02] dark:hover:from-[#FAAD00]/20 dark:hover:to-[#FFC746]/20"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <div className="relative">
                                            <img
                                                src={sale.image}
                                                alt={sale.name}
                                                className="size-12 flex-shrink-0 rounded-full object-cover ring-2 ring-[#FAAD00]/30 dark:ring-[#FFC746]/30"
                                            />
                                            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gradient-to-r from-[#FAAD00] to-[#FFC746] text-xs font-bold text-white flex items-center justify-center shadow-lg">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{sale.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{sale.email}</p>
                                        </div>
                                    </div>
                                    <p className="price text-slate-900 dark:text-white">${sale.total}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Enhanced Products Table */}
            <div className="card shadow-gold-lg hover-bounce">
                <div className="card-header">
                    <p className="card-title text-lg gradient-text">Top Products</p>
                    <div className="ml-auto">
                        <button className="btn-primary">
                            View All Products
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-lg custom-scrollbar">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Product</th>
                                    <th className="table-head">Price</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Rating</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {topProducts.map((product) => (
                                    <tr key={product.number} className="table-row">
                                        <td className="table-cell">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FAAD00] to-[#FFC746] text-sm font-bold text-white shadow-lg">
                                                {product.number}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex w-max items-center gap-x-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-16 rounded-xl object-cover shadow-md ring-2 ring-[#FAAD00]/30 dark:ring-[#FFC746]/30 transition-all duration-300 hover:ring-4 hover:scale-105"
                                                />
                                                <div className="flex flex-col gap-y-1">
                                                    <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-300 max-w-xs">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="gradient-text text-lg font-bold">${product.price}</span>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`status-badge ${product.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="star-rating">
                                                <Star size={18} className="star-filled" />
                                                <span className="ml-1 font-semibold text-slate-900 dark:text-white">{product.rating}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-2">
                                                <button className="action-btn edit">
                                                    <PencilLine size={18} />
                                                </button>
                                                <button className="action-btn delete">
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default DashboardPage;