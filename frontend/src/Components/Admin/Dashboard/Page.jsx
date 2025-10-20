import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";
import defaultAvatar from "../../../assets/profile avatar.png";

const DashboardPage = () => {
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        activeProjects: 0,
        totalRevenue: 0,
        activeWorkers: 324,
        completedProjects: 0
    });

    const API_BASE_URL = 'http://localhost:8086/api/v1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const clientsResponse = await fetch(`${API_BASE_URL}/admin/get_all_clients`);
                if (!clientsResponse.ok) throw new Error('Failed to fetch clients');
                const clientsData = await clientsResponse.json();
                setClients(clientsData);

                const projectsResponse = await fetch(`${API_BASE_URL}/admin/get_all_projects`);
                if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);

                const activeProj = projectsData.filter(p => p.status === 'ongoing').length;
                const completedProj = projectsData.filter(p => p.status === 'completed').length;
                const totalRev = projectsData.reduce((sum, p) => sum + (p.budget || 0), 0);

                setMetrics({
                    activeProjects: activeProj,
                    totalRevenue: (totalRev / 1000000).toFixed(2),
                    activeWorkers: 324,
                    completedProjects: completedProj
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return defaultAvatar;
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${API_BASE_URL}${imageUrl}`;
    };

    const overviewData = [
        { name: 'Jan', total: 200 },
        { name: 'Feb', total: 350 },
        { name: 'Mar', total: 280 },
        { name: 'Apr', total: 450 },
        { name: 'May', total: 520 },
        { name: 'Jun', total: 680 }
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
    }

    return (
        <div className="flex flex-col gap-y-6">
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon products">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Active Projects</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">{metrics.activeProjects}</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            8%
                        </span>
                    </div>
                </div>
                
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon orders">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Revenue</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">${metrics.totalRevenue}M</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            15%
                        </span>
                    </div>
                </div>
                
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon customers">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Active Workers</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">{metrics.activeWorkers}</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            6%
                        </span>
                    </div>
                </div>
                
                <div className="metric-card hover-bounce">
                    <div className="card-header">
                        <div className="metric-icon sales">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title">Completed Projects</p>
                    </div>
                    <div className="card-body">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">{metrics.completedProjects}</p>
                        <span className="trend-badge positive">
                            <TrendingUp size={18} />
                            12%
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4 shadow-gold hover-bounce">
                    <div className="card-header">
                        <p className="card-title text-lg gradient-text">Project Revenue Overview</p>
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
                                    formatter={(value) => [`$${value}K`, 'Revenue']}
                                    labelFormatter={(label) => `Month: ${label}`}
                                />
                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke="#64748b"
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <YAxis
                                    strokeWidth={0}
                                    stroke="#64748b"
                                    tickFormatter={(value) => `$${value}K`}
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
                
                {/* Recent Clients */}
                <div className="card col-span-1 md:col-span-2 lg:col-span-3 shadow-gold hover-bounce">
                    <div className="card-header">
                        <p className="card-title text-lg gradient-text">Recent Project Updates</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0 custom-scrollbar">
                        <div className="space-y-3 p-4">
                            {clients.slice(0, 5).map((client, index) => (
                                <div
                                    key={`${client.client_id}-${index}`}
                                    className="flex items-center justify-between gap-x-4 rounded-lg p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FAAD00]/10 hover:to-[#FFC746]/10 hover:shadow-md hover:scale-[1.02] dark:hover:from-[#FAAD00]/20 dark:hover:to-[#FFC746]/20"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <div className="relative">
                                            <img
                                                src={getImageUrl(client.profile_image_url)}
                                                alt={client.name}
                                                className="size-12 flex-shrink-0 rounded-full object-cover ring-2 ring-[#FAAD00]/30 dark:ring-[#FFC746]/30"
                                                onError={(e) => { e.target.src = defaultAvatar; }}
                                            />
                                            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gradient-to-r from-[#FAAD00] to-[#FFC746] text-xs font-bold text-white flex items-center justify-center shadow-lg">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{client.name} - {client.client_id}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{client.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-1">
                                        <p className="price text-slate-900 dark:text-white">{client.project_name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{client.project_id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Projects Table */}
            <div className="card shadow-gold-lg hover-bounce">
                <div className="card-header">
                    <p className="card-title text-lg gradient-text">Current Projects ({projects.length})</p>
                    <div className="ml-auto">
                        <button className="btn-primary">
                            View All Projects
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="relative w-full overflow-x-auto rounded-lg custom-scrollbar" style={{ maxHeight: projects.length > 5 ? '600px' : 'auto' }}>
                        <table className="table w-full">
                            <thead className="table-header sticky top-0">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Project Name</th>
                                    <th className="table-head">Category</th>
                                    <th className="table-head">Budget</th>
                                    <th className="table-head">Location</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Duration</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {projects.map((project, index) => (
                                    <tr key={project.projectId} className="table-row hover:bg-opacity-50 transition-colors">
                                        <td className="table-cell">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FAAD00] to-[#FFC746] text-sm font-bold text-white shadow-lg">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex flex-col gap-y-1 min-w-[250px]">
                                                <p className="font-semibold text-slate-900 dark:text-white">{project.name}</p>
                                                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{project.projectId}</p>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <span className="gradient-text text-sm font-bold">${(project.budget / 1000000).toFixed(2)}M</span>
                                        </td>
                                        <td className="table-cell">
                                            <p className="text-slate-700 dark:text-slate-300 text-sm">{project.location}</p>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`status-badge text-xs font-semibold px-3 py-1 rounded-full ${
                                                project.status === 'ongoing' 
                                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                                                    : project.status === 'completed'
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                    : project.status === 'pending'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                            }`}>
                                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex flex-col gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                                                <p className="font-semibold text-slate-900 dark:text-white">{project.startDate}</p>
                                                <p>→ {project.dueDate}</p>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-2">
                                                <button className="action-btn edit hover:bg-blue-100 dark:hover:bg-blue-900 p-2 rounded transition-colors" title="Edit">
                                                    <PencilLine size={16} />
                                                </button>
                                                <button className="action-btn delete hover:bg-red-100 dark:hover:bg-red-900 p-2 rounded transition-colors" title="Delete">
                                                    <Trash size={16} />
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
        </div>
    );
};

export default DashboardPage;