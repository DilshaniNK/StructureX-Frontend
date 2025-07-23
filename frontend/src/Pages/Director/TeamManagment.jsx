import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, DollarSign, Users, Phone, Mail, UserCheck, MapPin, Building, Check, User, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PendingProjectsManager = () => {
    const [pendingProjects, setPendingProjects] = useState([]);
    const [assignedTeams, setAssignedTeams] = useState({}); // projectId: {role: employeeId}
    const [expandedProject, setExpandedProject] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [activeRoleTab, setActiveRoleTab] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const projectRefs = useRef({});

    const highlightedProjectId = location.state?.highlightedProjectId;
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace these with your actual API calls
                const projectsRes = await fetch('http://localhost:8086/api/v1/director/get_pending_projects');
                const employeeRes = await fetch('http://localhost:8086/api/v1/admin/get_employees');
                
                const projectsData = await projectsRes.json();
                const employeeData = await employeeRes.json();
                
                setPendingProjects(projectsData);
                setEmployees(employeeData);
            } catch (err) {
                alert('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (location.state?.highlightedProjectId && location.state?.fromNewProject) {
            console.log('New project navigation detected:', location.state.highlightedProjectId);
            setExpandedProject(location.state.highlightedProjectId);
            
            // Scroll to the highlighted project after data is loaded
            const scrollToProject = () => {
                const element = document.getElementById(`project-${location.state.highlightedProjectId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-project');
                }
            };

            if (!loading) {
                setTimeout(scrollToProject, 500);
            }
        }
    }, [location.state, loading]);

    const groupedEmployees = employees.reduce((acc, emp) => {
        if (!acc[emp.type]) acc[emp.type] = [];
        acc[emp.type].push(emp);
        return acc;
    }, {});
    useEffect(() => {
    if (!location.state?.fromNewProject) {
        setExpandedProject(null);
    }
}, [location.state]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-700 border-red-200';
            case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const toggleMemberAssignment = (projectId, type, employeeId) => {
        setAssignedTeams(prev => {
            const currentAssignments = prev[projectId] || {};
            return {
                ...prev,
                [projectId]: {
                    ...currentAssignments,
                    [type]: currentAssignments[type] === employeeId ? null : employeeId
                }
            };
        });
    };

    const startProject = async (project) => {
        const assigned = assignedTeams[project.project_id] || {};
        const requiredRoles = ['Senior_QS_Officer', 'Project_Manager','Site_Supervisor'];
        
        for (const type of requiredRoles) {
            if (!assigned[type]) {
                alert(`Please assign a ${type} before starting the project.`);
                return;
            }
        }
        
        try {
            const response = await fetch(`http://localhost:8086/api/v1/director/start_project/${project.project_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qs_id: assigned['Senior_QS_Officer'],
                    pm_id: assigned['Project_Manager'],
                    ss_id: assigned['Site_Supervisor'],
                    status: 'ongoing'
                })
            });
            
            if (response.ok) {
                alert('Project successfully started');
                // Remove the project from pending projects
                setPendingProjects(prev => prev.filter(p => p.project_id !== project.project_id));
                window.location.reload();
            } else {
                alert('Failed to start project');
            }
        } catch (err) {
            alert('Failed to start project');
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900">Pending Projects</h1>
                            <p className="text-gray-600 mt-2">Assign team members to projects and start execution</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-semibold text-gray-900">{pendingProjects.length}</p>
                            <p className="text-sm text-gray-600">Projects Waiting</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Projects Grid */}
                <div className="space-y-8">
                    {pendingProjects.map((project) => {
                        const isHighlighted = location.state?.fromNewProject && project.project_id === highlightedProjectId;
                        const assigned = assignedTeams[project.project_id] || {};
                        const assignedCount = Object.values(assigned).filter(id => id).length;
                        const isExpanded = expandedProject === project.project_id;

                        return (
                            <div  key={project.project_id}
                                id={`project-${project.project_id}`}
                                ref={el => (projectRefs.current[project.project_id] = el)}
                                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
                                    isHighlighted ? 'ring-2 ring-black bg-amber-50' : ''
                            }`}>
                                {/* Project Header */}
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Project Image */}
                                        <div className="lg:w-80 flex-shrink-0">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-48 lg:h-56 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Project Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                                                            {project.priority} Priority
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                                </div>
                                            </div>

                                            {/* Project Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Building className="text-gray-400" size={16} />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Client</p>
                                                        <p className="text-sm font-medium text-gray-900">{project.first_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="text-gray-400" size={16} />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Location</p>
                                                        <p className="text-sm font-medium text-gray-900">{project.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="text-gray-400" size={16} />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Budget</p>
                                                        <p className="text-sm font-medium text-gray-900">{project.budget}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-gray-400" size={16} />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Deadline</p>
                                                        <p className="text-sm font-medium text-gray-900">{project.due_date}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="text-gray-400" size={16} />
                                                        <span className="text-sm text-gray-600">
                                                            {assignedCount} of 3 assigned
                                                        </span>
                                                    </div>
                                                    {assignedCount > 0 && (
                                                        <div className="flex -space-x-2">
                                                            {Object.entries(assigned).filter(([type, id]) => id).slice(0, 3).map(([type, employeeId]) => {
                                                                const member = employees.find(emp => emp.employee_id === employeeId);
                                                                return (
                                                                    <div
                                                                        key={employeeId}
                                                                        className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                                                        title={member?.name}
                                                                    >
                                                                        {member?.name.charAt(0)}
                                                                    </div>
                                                                );
                                                            })}
                                                            {assignedCount > 3 && (
                                                                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                                                                    +{assignedCount - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setExpandedProject(isExpanded ? null : project.project_id)}
                                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                                                    >
                                                        {isExpanded ? 'Hide Team' : 'Assign Team'}
                                                    </button>
                                                    <button
                                                        onClick={() => startProject(project)}
                                                        disabled={assignedCount < 2}
                                                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            assignedCount >= 3
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <Check size={16} className="inline mr-2" />
                                                        Start Project
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Assignment Section */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Team Members</h3>

                                        {(() => {
                                            const roles = Object.keys(groupedEmployees);
                                            const activeTab = activeRoleTab || roles[0] || '';
                                            if (!activeRoleTab && roles.length > 0) {
                                                setActiveRoleTab(roles[0]);
                                            }
                                            const requiredRoles = ['Senior_QS_Officer','Project_Manager','Site_Supervisor'];
                                            const missingRoles = requiredRoles.filter(
                                                role => !groupedEmployees[role] || groupedEmployees[role].length ===0
                                            );
                                            if(missingRoles.length > 0){
                                                return (
                                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
                                                        Members not in yet: {missingRoles.join(', ')}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div>
                                                    {/* Role Tabs */}
                                                    <div className="mb-6">
                                                        <div className="border-b border-gray-200">
                                                            <nav className="flex space-x-8" aria-label="Tabs">
                                                                {roles.map((type) => {
                                                                    const isRoleAssigned = assigned[type];
                                                                    const isRoleRequired = ['Senior_QS_Officer', 'Project_Manager','Site_Supervisor'].includes(type);
                                                                    
                                                                    return (
                                                                        <button
                                                                            key={type}
                                                                            onClick={() => setActiveRoleTab(type)}
                                                                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                                                                                activeTab === type
                                                                                    ? 'border-blue-500 text-blue-600'
                                                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                            }`}
                                                                        >
                                                                            {type}
                                                                            {isRoleRequired && (
                                                                                <span className="ml-1 text-red-500">*</span>
                                                                            )}
                                                                            {isRoleAssigned && (
                                                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </nav>
                                                        </div>
                                                    </div>

                                                    {/* Active Tab Content */}
                                                    {activeTab && groupedEmployees[activeTab] && (
                                                        <div className="mb-6">
                                                            {/* Role requirement info */}
                                                            {['Senior_QS_Officer', 'Project_Manager','Site_Supervisor'].includes(activeTab) && (
                                                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                                    <p className="text-sm text-gray-900">
                                                                        <strong>{activeTab}:</strong> Required for this project
                                                                        {assigned[activeTab] ? ' ✅ Requirements met!' : ' (1 needed)'}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Team Grid for active role */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {groupedEmployees[activeTab].map((member) => {
                                                                    const isAssigned = assigned[activeTab] === member.employee_id;
                                                                    const isAvailable = member.availability === 'Available';
                                                                    const isRoleRequired = ['Senior_QS_Officer', 'Project_Manager','Site_Supervisor'].includes(activeTab);
                                                                    
                                                                    
                                                                    return (
                                                                        <div
                                                                            key={member.employee_id}
                                                                            className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                                                                                isAssigned
                                                                                    ? 'border-black bg-blue-50'
                                                                                    : isAvailable
                                                                                    ? (isRoleRequired 
                                                                                        ? 'border-amber-300 bg-amber-50 hover:border-amber-500 shadow-md'
                                                                                        : 'border-gray-200 bg-white hover:border-gray-300')
                                                                                    : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                                                            }`}
                                                                            onClick={() => isAvailable && toggleMemberAssignment(project.project_id, activeTab, member.employee_id)}
                                                                        >
                                                                            {/* Assignment Indicator */}
                                                                            {isAssigned && (
                                                                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                                                                                    <UserCheck size={12} />
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {/* Avatar */}
                                                                            <div className="flex justify-center mb-3">
                                                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                                                    isAvailable ? (isAssigned ? 'bg-blue-200 ring-2 ring-blue-400' : (isRoleRequired ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-gray-300'))
                                                                                    : 'bg-gray-300'
                                                                                }`}>
                                                                                    {member.image ? (
                                                                                        <img src={member.image} alt={member.name} className='w-full h-full object-cover rounded-full' />
                                                                                    ) : (
                                                                                        <User size={20} className={`${
                                                                                            isAvailable ? (isAssigned ? 'text-blue-600' : (isRoleRequired ? 'text-amber-800' : 'text-gray-600'))
                                                                                            : 'text-gray-600'
                                                                                        }`} />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {/* Member Info */}
                                                                            <div className="text-center">
                                                                                <h4 className="font-medium text-gray-900 text-sm mb-1">{member.name}</h4>
                                                                                <p className="text-xs text-gray-600 mb-2">{member.type}</p>
                                                                                
                                                                                {/* Availability Status */}
                                                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                                                                    isAvailable
                                                                                        ? (isAssigned ? 'bg-green-100 text-green-800' : (isRoleRequired ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'))
                                                                                        : 'bg-red-100 text-red-800'
                                                                                }`}>
                                                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                                                                        isAvailable 
                                                                                            ? (isAssigned ? 'bg-green-500' : (isRoleRequired ? 'bg-amber-500' : 'bg-gray-400')) 
                                                                                            : 'bg-red-500'
                                                                                    }`} />
                                                                                    {isAvailable ? 
                                                                                        (isAssigned ? 'Assigned' : (isRoleRequired ? 'Available' : 'Available')) : 'Busy'}
                                                                                </div>
                                                                                
                                                                                {/* Skills */}
                                                                                {member.skills && (
                                                                                    <div className="mt-2">
                                                                                        <div className="flex flex-wrap gap-1 justify-center">
                                                                                            {member.skills.slice(0, 2).map((skill, index) => (
                                                                                                <span
                                                                                                    key={index}
                                                                                                    className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs"
                                                                                                >
                                                                                                    {skill}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {/* Assignment Summary */}
                                        {assignedCount > 0 && (
                                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="font-medium text-blue-900 mb-2">
                                                    Selected Team Members ({assignedCount})
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(assigned).filter(([type, id]) => id).map(([type, employeeId]) => {
                                                        const member = employees.find(emp => emp.employee_id === employeeId);
                                                        return (
                                                            <span
                                                                key={employeeId}
                                                                className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-800"
                                                            >
                                                                {member?.name} - {type}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Summary Section */}
                <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{pendingProjects.length}</p>
                            <p className="text-sm text-yellow-800">Pending Projects</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                                {Object.values(assignedTeams).reduce((total, team) => Object.values(team).filter(id => id).length + total, 0)}
                            </p>
                            <p className="text-sm text-blue-800">Total Assignments</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                                {Object.keys(assignedTeams).filter(projectId => {
                                    const assigned = assignedTeams[projectId];
                                    return assigned?.Senior_QS_Officer && assigned?.Project_Manager && assigned?.Site_Supervisor;
                                }).length}
                            </p>
                            <p className="text-sm text-green-800">Ready to Start</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingProjectsManager;