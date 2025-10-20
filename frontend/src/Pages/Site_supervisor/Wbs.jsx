import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:8086/api/v1/site_supervisor";

const Wbs = () => {
    // Mock employeeId for demonstration - in real app, pass as prop
    const {employeeId} = useParams();
    const [wbs, setWbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWbs();
    }, [employeeId]);

    const fetchWbs = async () => {
        try {
            const res = await fetch(`${API_BASE}/wbs/${employeeId}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setWbs(data);
        } catch (err) {
            console.error("Error fetching WBS:", err);
            setError("Failed to fetch WBS tasks.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, projectId, parentId, newStatus) => {
        try {
            const res = await fetch(`${API_BASE}/wbs`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId,
                    projectId,
                    parentId,
                    status: newStatus,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setWbs((prev) =>
                prev.map((task) =>
                    task.taskId === taskId ? { ...task, status: newStatus } : task
                )
            );
            alert("Status updated successfully!");
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status!");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            in_progress: "bg-blue-100 text-blue-800 border-blue-200",
            completed: "bg-green-100 text-green-800 border-green-200",
            on_hold: "bg-gray-100 text-gray-800 border-gray-200"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: "Pending",
            in_progress: "In Progress",
            completed: "Completed",
            on_hold: "On Hold"
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading WBS...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white">Work Breakdown Structure helloooooo</h1>
                        <p className="text-blue-100 mt-1">Manage and track project tasks</p>
                    </div>

                    {wbs.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No WBS tasks found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Task ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Project ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Parent ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Task Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Milestone
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Update Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {wbs.map((task, index) => (
                                        <tr 
                                            key={task.taskId} 
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {task.taskId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {task.projectId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {task.parentId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {task.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                                    {getStatusLabel(task.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {task.milestone ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                        </svg>
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(task.taskId, task.projectId, task.parentId, e.target.value)
                                                    }
                                                    className="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 cursor-pointer hover:border-gray-400"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="on_hold">On Hold</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                    Showing {wbs.length} {wbs.length === 1 ? 'task' : 'tasks'}
                </div>
            </div>
        </div>
    );
};

export default Wbs;