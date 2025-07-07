import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, DollarSign, Users, Phone, Mail, UserCheck, MapPin, Building, Check, User, Clock } from 'lucide-react';
import Project1 from '../../assets/Projects/p2.jpg'
import Project2 from '../../assets/Projects/P1_1.jpg'
import Project3 from '../../assets/Projects/P1_2.jpg'
import Project4 from '../../assets/Projects/P1.jpg'
import member1 from '../../assets/Aveter/member1.png';


const PendingProjectsManager = () => {
    const [assignedTeams, setAssignedTeams] = useState({}); // projectId: [memberIds]
    const [expandedProject, setExpandedProject] = useState(null);
    const [activeRoleTab, setActiveRoleTab] = useState('');

    // Mock pending projects data
    const pendingProjects = [
        {
            id: 1,
            title: "Luxury Resort Construction",
            client: "Asia Leisure / Belluna Co. Ltd.",
            expectedCompletion: "July 2025",
            location: "Kaluwella, Galle",
            totalbudget: "$2,500,000",
            description: "A luxury resort construction project featuring modern architecture and sustainable design principles.",
            image: Project1,
            priority: "High",
            deadline: "2025-07-15"
        },
        {
            id: 2,
            title: "Commercial Complex Development",
            client: "Metropolitan Holdings",
            expectedCompletion: "September 2025",
            location: "Colombo 03",
            totalbudget: "$3,200,000",
            description: "Multi-story commercial complex with retail and office spaces.",
            image: Project2,
            priority: "Medium",
            deadline: "2025-09-30"
        },
        {
            id: 3,
            title: "Residential Apartment Block",
            client: "Green Valley Developers",
            expectedCompletion: "December 2025",
            location: "Mount Lavinia",
            totalbudget: "$1,800,000",
            description: "Modern residential apartment complex with 48 units.",
            image: Project3,
            priority: "Low",
            deadline: "2025-12-20"
        },
        {
            id: 4,
            title: "Industrial Warehouse",
            client: "Logistics Solutions Ltd",
            expectedCompletion: "August 2025",
            location: "Kelaniya",
            totalbudget: "$950,000",
            description: "Large-scale industrial warehouse with automated systems.",
            image: Project4,
            priority: "High",
            deadline: "2025-08-10"
        }
    ];

    // Mock company team data
    const companyTeam = [
        {
            id: 1,
            name: "John Smith",
            role: "Project Manager",
            email: "john.smith@company.com",
            phone: "+94 77 123 4567",
            image: member1,
            skills: ["Leadership", "Planning", "Risk Management"],
            availability: "Available"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            role: "Site Supervisor",
            email: "sarah.johnson@company.com",
            phone: "+94 77 234 5678",
            skills: ["Quality Control", "Safety", "Team Management"],
            availability: "Available"
        },
        {
            id: 3,
            name: "Mike Chen",
            role: "QS Officer",
            email: "mike.chen@company.com",
            phone: "+94 77 345 6789",
            skills: ["Cost Estimation", "Budget Control", "Contract Management"],
            availability: "Busy"
        },
        {
            id: 4,
            name: "Emma Wilson",
            role: "Designer",
            email: "emma.wilson@company.com",
            phone: "+94 77 456 7890",
            skills: ["3D Modeling", "AutoCAD", "Creative Design"],
            availability: "Available"
        },
        {
            id: 5,
            name: "David Lee",
            role: "Project Manager",
            email: "david.lee@company.com",
            phone: "+94 77 567 8901",
            skills: ["Structural Analysis", "Foundation Design", "Steel Structures"],
            availability: "Available"
        },
        {
            id: 6,
            name: "Lisa Brown",
            role: "Project Manager",
            email: "lisa.brown@company.com",
            phone: "+94 77 678 9012",
            skills: ["Electrical Design", "Power Systems", "Automation"],
            availability: "Available"
        },
        {
            id: 7,
            name: "Robert Taylor",
            role: "QS Officer",
            email: "robert.taylor@company.com",
            phone: "+94 77 789 0123",
            skills: ["Road Construction", "Drainage", "Site Planning"],
            availability: "Available"
        },
        {
            id: 8,
            name: "Jennifer Davis",
            role: "QS Officer",
            email: "jennifer.davis@company.com",
            phone: "+94 77 890 1234",
            skills: ["Building Design", "3D Visualization", "Interior Design"],
            availability: "Available"
        },
        {
            id: 9,
            name: "Jennifer Davis",
            role: "Site Supervisor",
            email: "jennifer.davis@company.com",
            phone: "+94 77 890 1234",
            skills: ["Building Design", "3D Visualization", "Interior Design"],
            availability: "Available"
        }

    ];
    //mock  data for projecr requirements
    const projectRequirements = {
    1: { // Luxury Resort Construction
        "Project Manager": 2,
        "Site Supervisor": 2,
        "QS Officer": 1,
        "Engineer": 3
    },
    2: { // Commercial Complex Development
        "Project Manager": 1,
        "Site Supervisor": 3,
        "QS Officer": 2,
        "Engineer": 2
    },
    3: { // Residential Apartment Block
        "Project Manager": 1,
        "Site Supervisor": 2,
        "QS Officer": 1,
        "Engineer": 2
    },
    4: { // Industrial Warehouse
        "Project Manager": 1,
        "Site Supervisor": 1,
        "QS Officer": 1,
        "Engineer": 1
    }
};


    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-700 border-red-200';
            case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const toggleMemberAssignment = (projectId, memberId) => {
        setAssignedTeams(prev => {
            const currentTeam = prev[projectId] || [];
            if (currentTeam.includes(memberId)) {
                return {
                    ...prev,
                    [projectId]: currentTeam.filter(id => id !== memberId)
                };
            } else {
                return {
                    ...prev,
                    [projectId]: [...currentTeam, memberId]
                };
            }
        });
    };

    const startProject = (projectId) =>{
        const assignedMembers = assignedTeams[projectId] || [];

        const assignedMemberDetails = assignedMembers.map(id =>
            companyTeam.find(member => member.id === id)
        );

        const requirements = projectRequirements[projectId];

        const roleCounts = {};

        assignedMemberDetails.forEach(member => {
            if(!member) return;
            roleCounts[member.role] = (roleCounts[member.role] || 0) + 1;

        });

        for(const role in requirements){
            const requiredCount = requirements[role];
            const assignedCount = roleCounts[role] || 0;

            if(assignedCount < requiredCount){
                alert(`Cannot start project . you must assign ${requiredCount} ${role}${requiredCount > 1 ? 's' : ''}. Currently assigned: ${assignedCount} `);
                return;
            }
        }
        alert(`Project started with ${assignedMembers.length} team members assigned !`);
    };

    const toggleExpanded = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId);
    };

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
                        const assignedCount = (assignedTeams[project.id] || []).length;
                        const isExpanded = expandedProject === project.id;

                        return (
                            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                                                        <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
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
                                                        <p className="text-sm font-medium text-gray-900">{project.client}</p>
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
                                                        <p className="text-sm font-medium text-gray-900">{project.totalbudget}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-gray-400" size={16} />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Deadline</p>
                                                        <p className="text-sm font-medium text-gray-900">{project.expectedCompletion}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="text-gray-400" size={16} />
                                                        <span className="text-sm text-gray-600">
                                                            {assignedCount} of {companyTeam.length} assigned
                                                        </span>
                                                    </div>
                                                    {assignedCount > 0 && (
                                                        <div className="flex -space-x-2">
                                                            {(assignedTeams[project.id] || []).slice(0, 3).map(memberId => {
                                                                const member = companyTeam.find(m => m.id === memberId);
                                                                return (
                                                                    <div
                                                                        key={memberId}
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
                                                        onClick={() => toggleExpanded(project.id)}
                                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                                                    >
                                                        {isExpanded ? 'Hide Team' : 'Assign Team'}
                                                    </button>
                                                    <button
                                                        onClick={() => startProject(project.id)}
                                                        disabled={assignedCount === 0}
                                                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            assignedCount > 0
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
        
        {/* Project Requirements Overview */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Project Requirements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(projectRequirements[project.id] || {}).map(([role, required]) => {
                    const assignedForRole = (assignedTeams[project.id] || []).filter(memberId => {
                        const member = companyTeam.find(m => m.id === memberId);
                        return member?.role === role;
                    }).length;
                    
                    return (
                        <div key={role} className="text-center">
                            <p className="text-sm font-medium text-gray-700">{role}</p>
                            <div className={`text-lg font-bold ${assignedForRole >= required ? 'text-green-600' : 'text-red-500'}`}>
                                {assignedForRole}/{required}
                            </div>
                            <p className="text-xs text-gray-500">
                                {assignedForRole >= required ? 'Complete' : `${required - assignedForRole} needed`}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
        
        {(() => {
            // Group team members by role
            const groupedTeam = companyTeam.reduce((acc, member) => {
                if (!acc[member.role]) {
                    acc[member.role] = [];
                }
                acc[member.role].push(member);
                return acc;
            }, {});

            const roles = Object.keys(groupedTeam);
            const projectReqs = projectRequirements[project.id] || {};
            
            // Set default active tab if not set
            const activeTab = activeRoleTab || roles[0] || '';
            if (!activeRoleTab && roles.length > 0) {
                setActiveRoleTab(roles[0]);
            }

            return (
                <div>
                    {/* Role Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8" aria-label="Tabs">
                                {roles.map((role) => {
                                    const memberCount = groupedTeam[role].length;
                                    const availableCount = groupedTeam[role].filter(m => m.availability === 'Available').length;
                                    const requiredCount = projectReqs[role] || 0;
                                    const assignedForRole = (assignedTeams[project.id] || []).filter(memberId => {
                                        const member = companyTeam.find(m => m.id === memberId);
                                        return member?.role === role;
                                    }).length;
                                    
                                    const isRoleNeeded = requiredCount > 0;
                                    const isRoleComplete = assignedForRole >= requiredCount;
                                    
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => setActiveRoleTab(role)}
                                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                                                activeTab === role
                                                    ? 'border-black text-amber-500'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } ${!isRoleNeeded ? 'opacity-50' : ''}`}
                                        >
                                            {/* Role requirement indicator */}
                                           
                                            
                                            {role}
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                isRoleNeeded 
                                                    ? (isRoleComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {isRoleNeeded ? `${assignedForRole}/${requiredCount}` : `${availableCount}/${memberCount}`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Active Tab Content */}
                    {activeTab && groupedTeam[activeTab] && (
                        <div className="mb-6">
                            {/* Role requirement info */}
                            {projectReqs[activeTab] && (
                                <div className="mb-4 p-3 bg-amber-50 border border-black rounded-lg">
                                    <p className="text-sm text-gray-900">
                                        <strong>{activeTab}:</strong> {projectReqs[activeTab]} required for this project
                                        {(() => {
                                            const assignedForRole = (assignedTeams[project.id] || []).filter(memberId => {
                                                const member = companyTeam.find(m => m.id === memberId);
                                                return member?.role === activeTab;
                                            }).length;
                                            return assignedForRole >= projectReqs[activeTab] 
                                                ? ` ✅ Requirements met!`
                                                : ` (${projectReqs[activeTab] - assignedForRole} more needed)`;
                                        })()}
                                    </p>
                                </div>
                            )}
                            
                            {/* Team Grid for active role */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {groupedTeam[activeTab].map((member) => {
                                    const isAssigned = (assignedTeams[project.id] || []).includes(member.id);
                                    const isAvailable = member.availability === 'Available';
                                    const roleRequired = projectReqs[activeTab] || 0;
                                    const assignedForRole = (assignedTeams[project.id] || []).filter(memberId => {
                                        const m = companyTeam.find(m => m.id === memberId);
                                        return m?.role === activeTab;
                                    }).length;
                                    
                                    // Determine if this position is needed
                                    const isPositionNeeded = roleRequired > 0 && assignedForRole < roleRequired;
                                    const isPositionFilled = roleRequired > 0 && assignedForRole >= roleRequired;
                                    
                                    return (
                                        <div
                                            key={member.id}
                                            className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                                                isAssigned
                                                    ? 'border-gray-400 bg-gray-50'
                                                    : isAvailable
                                                    ? (isPositionNeeded 
                                                        ? 'border-amber-300 bg-amber-50 hover:border-black shadow-md' // Highlight available positions needed
                                                        : roleRequired > 0 && isPositionFilled
                                                        ? 'border-gray-200 bg-gray-50 opacity-60' // Dim positions not needed anymore
                                                        : 'border-gray-200 bg-white hover:border-gray-300') // Regular available
                                                    : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                            }`}
                                            onClick={() => isAvailable && toggleMemberAssignment(project.id, member.id)}
                                        >
                                            {/* Position requirement indicator */}
                                           
                                            
                                            {/* Assignment Indicator */}
                                            {isAssigned && (
                                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1">
                                                    <UserCheck size={12} />
                                                </div>
                                            )}
                                            
                                            {/* Avatar */}
                                            <div className="flex justify-center mb-3">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                   isAvailable ? (isAssigned ? 'bg-gray-300' : (isPositionNeeded ? 'bg-amber-200 ring-2 ring-black' : 'bg-gray-300'))
                                                   : 'bg-gray-300'
                                                }`}>
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className='w-full h-full object-cover rounded-full' />
                                                ):(
                                                   <User size={20} className={`${
                                                       isAvailable ? (isAssigned ? 'text-gray-600' : (isPositionNeeded ? 'text-red-800' : 'text-gray-600'))
                                                   : 'text-gray-600'
                                                    }`} />
                                                )}

                                                </div>
                                            </div>
                                            
                                            {/* Member Info */}
                                            <div className="text-center">
                                                <h4 className="font-medium text-gray-900 text-sm mb-1">{member.name}</h4>
                                                <p className="text-xs text-gray-600 mb-2">{member.role}</p>
                                                
                                                {/* Availability Status */}
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                                    isAvailable
                                                        ? (isAssigned ? 'bg-green-100 text-green-800' : (isPositionNeeded ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'))
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                                        isAvailable 
                                                            ? (isAssigned ? 'bg-green-500' : (isPositionNeeded ? 'bg-red-500' : 'bg-gray-400')) 
                                                            : 'bg-red-500'
                                                    }`} />
                                                    {isAvailable ? 
                                                    (isAssigned ? 'Done' : (isPositionNeeded ? 'Available' : 'Not Needed')) : 'Busy'}
                                                </div>
                                                
                                                {/* Skills */}
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
                    {(assignedTeams[project.id] || []).map(memberId => {
                        const member = companyTeam.find(m => m.id === memberId);
                        return (
                            <span
                                key={memberId}
                                className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-800"
                            >
                                {member?.name} - {member?.role}
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
                                {Object.values(assignedTeams).reduce((total, team) => total + team.length, 0)}
                            </p>
                            <p className="text-sm text-blue-800">Total Assignments</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                                {Object.keys(assignedTeams).filter(projectId => assignedTeams[projectId].length > 0).length}
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