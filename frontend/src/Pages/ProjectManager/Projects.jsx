import React, { useState } from 'react'

function Projects() {
  const [activeTab, setActiveTab] = useState('ongoing')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateFormData, setUpdateFormData] = useState({
    id: '',
    name: '',
    date: '',
    location: '',
    tools: ''
  })

  // WBS Data with milestones and sub-tasks
  const [wbsData, setWbsData] = useState([
    {
      id: 1,
      name: 'Foundation Work',
      status: 'Completed',
      startDate: '2024-01-15',
      deadline: '2024-06-30',
      responsible: 'Mike Johnson',
      progress: 100,
      isMilestone: true,
      isExpanded: true,
      subTasks: [
        {
          id: 11,
          name: 'Site Excavation',
          status: 'Completed',
          startDate: '2024-01-15',
          deadline: '2024-02-15',
          responsible: 'John Doe',
          progress: 100,
          isMilestone: false
        },
        {
          id: 12,
          name: 'Foundation Pouring',
          status: 'Completed',
          startDate: '2024-02-16',
          deadline: '2024-06-30',
          responsible: 'Mike Johnson',
          progress: 100,
          isMilestone: false
        },
        {
          id: 13,
          name: 'Curing & Testing',
          status: 'Completed',
          startDate: '2024-06-20',
          deadline: '2024-06-30',
          responsible: 'Sarah Davis',
          progress: 100,
          isMilestone: true
        }
      ]
    },
    {
      id: 2,
      name: 'Structural Framework',
      status: 'In Progress',
      startDate: '2024-07-01',
      deadline: '2024-09-15',
      responsible: 'Tom Wilson',
      progress: 45,
      isMilestone: true,
      isExpanded: false,
      subTasks: [
        {
          id: 21,
          name: 'Steel Framework Installation',
          status: 'In Progress',
          startDate: '2024-07-01',
          deadline: '2024-08-15',
          responsible: 'Tom Wilson',
          progress: 60,
          isMilestone: false
        },
        {
          id: 22,
          name: 'Concrete Column Casting',
          status: 'Pending',
          startDate: '2024-08-16',
          deadline: '2024-09-15',
          responsible: 'Sarah Davis',
          progress: 0,
          isMilestone: false
        },
        {
          id: 23,
          name: 'Beam Installation',
          status: 'Pending',
          startDate: '2024-09-01',
          deadline: '2024-09-15',
          responsible: 'Tom Wilson',
          progress: 0,
          isMilestone: false
        }
      ]
    },
    {
      id: 3,
      name: 'Electrical Installation',
      status: 'Pending',
      startDate: '2024-09-16',
      deadline: '2024-11-30',
      responsible: 'Sarah Davis',
      progress: 0,
      isMilestone: false,
      isExpanded: false,
      subTasks: [
        {
          id: 31,
          name: 'Wiring Layout Planning',
          status: 'Pending',
          startDate: '2024-09-16',
          deadline: '2024-10-30',
          responsible: 'Electric Team',
          progress: 0,
          isMilestone: false
        },
        {
          id: 32,
          name: 'Main Panel Installation',
          status: 'Pending',
          startDate: '2024-11-01',
          deadline: '2024-11-30',
          responsible: 'Sarah Davis',
          progress: 0,
          isMilestone: false
        }
      ]
    },
    {
      id: 4,
      name: 'Final Inspection & Handover',
      status: 'Pending',
      startDate: '2024-12-01',
      deadline: '2024-12-15',
      responsible: 'QS Team',
      progress: 0,
      isMilestone: true,
      isExpanded: false,
      subTasks: []
    }
  ])

  // Calendar state for updates section
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Sample daily updates data
  const dailyUpdates = [
    {
      date: '2024-06-17',
      time: '09:00 AM',
      type: 'Progress',
      description: 'Concrete pouring completed for east wing foundation.',
      author: 'Mike Johnson',
      attachments: ['foundation_photo.jpg']
    },
    {
      date: '2024-06-17',
      time: '02:30 PM',
      type: 'Material',
      description: 'Received delivery of steel reinforcement bars. Quality check passed.',
      author: 'Sarah Davis',
      attachments: ['delivery_receipt.pdf', 'quality_report.pdf']
    },
    {
      date: '2024-06-16',
      time: '10:15 AM',
      type: 'Issue',
      description: 'Steel reinforcement installation in progress. Encountered minor delay due to weather.',
      author: 'Tom Wilson',
      attachments: []
    },
    {
      date: '2024-06-15',
      time: '08:45 AM',
      type: 'Progress',
      description: 'Foundation excavation completed ahead of schedule.',
      author: 'Mike Johnson',
      attachments: ['excavation_complete.jpg']
    },
    {
      date: '2024-06-19',
      time: '11:20 AM',
      type: 'Progress',
      description: 'Electrical conduit installation completed in Block A.',
      author: 'Lisa Brown',
      attachments: ['electrical_progress.jpg']
    },
    {
      date: '2024-06-19',
      time: '03:45 PM',
      type: 'Safety',
      description: 'Weekly safety inspection conducted. All protocols followed.',
      author: 'Alex Turner',
      attachments: ['safety_checklist.pdf']
    }
  ]

  // Helper functions for calendar
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1)
    const lastDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      if (i < firstDayOfMonth.getDay() || currentDate > lastDayOfMonth) {
        days.push(null)
      } else {
        days.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      if (i < firstDayOfMonth.getDay()) {
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    return days
  }

  const getUpdatesForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return dailyUpdates.filter(update => update.date === dateString)
  }

  // Sample data - replace with actual API calls
  const projectsData = {
    ongoing: [
      {
        id: 'P001',
        name: 'Luxury Villa Construction',
        code: 'LVC-2024-001',
        location: 'Colombo 07',
        startDate: '2024-01-15',
        estimatedEndDate: '2024-12-30',
        status: 'In Progress',
        owner: 'John Smith',
        teamMembers: ['Site Supervisor: Mike Johnson', 'QS Officer: Sarah Davis'],
        image: "/Projects/site1.jpg"
      },
      {
        id: 'P002',
        name: 'Office Complex',
        code: 'OFC-2024-002',
        location: 'Galle Road',
        startDate: '2024-03-01',
        estimatedEndDate: '2025-02-28',
        status: 'Delayed',
        owner: 'ABC Corporation',
        teamMembers: ['Site Supervisor: Tom Wilson', 'QS Officer: Lisa Brown'],
        image: '/Projects/site2.png'
      }
    ],
    pending: [
      {
        id: 'P004',
        name: 'Shopping Mall Complex',
        code: 'SMC-2025-001',
        location: 'Kandy City',
        startDate: '2025-09-01',
        estimatedEndDate: '2026-08-30',
        status: 'Pending',
        description: 'Machine A , Machine B ',
      },
      {
        id: 'P005',
        name: 'Eco-Friendly Housing Project',
        code: 'EHP-2025-002',
        location: 'Gampaha District',
        startDate: '2025-11-15',
        estimatedEndDate: '2027-05-30',
        status: 'Pending',
        description: 'Machine A , Machine B '
      },
      {
        id: 'P006',
        name: 'Hospital Expansion Wing',
        code: 'HEW-2025-003',
        location: 'Colombo 08',
        startDate: '2025-12-01',
        estimatedEndDate: '2027-01-15',
        status: 'Pending',
        description: 'Machine A , Machine B '
      }
    ],
    finished: [
      {
        id: 'P003',
        name: 'Residential Apartment',
        code: 'RES-2023-003',
        location: 'Nugegoda',
        startDate: '2023-01-10',
        estimatedEndDate: '2023-11-30',
        status: 'Completed',
        owner: 'XYZ Holdings',
        teamMembers: ['Site Supervisor: James Lee', 'QS Officer: Emma White'],
        image: "/Projects/site3.jpg"
      }
    ]
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setActiveSection('overview')
  }

  const handleUpdateClick = (project) => {
    setUpdateFormData({
      id: project.code,
      name: project.name,
      date: project.startDate,
      location: project.location || '',
      tools: project.tools || ''
    })
    setShowUpdateForm(true)
  }

  const handleUpdateFormSubmit = (e) => {
    e.preventDefault()
    // Here you would typically update the project data
    console.log('Updating project:', updateFormData)
    setShowUpdateForm(false)
    // You can add your update logic here
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Get all projects for the main table
  const getAllProjects = () => {
    return [
      ...projectsData.ongoing,
      ...projectsData.pending,
      ...projectsData.finished
    ]
  }

  const toggleMilestone = (taskId, isSubTask = false, parentId = null) => {
    setWbsData(prevData => {
      return prevData.map(task => {
        if (!isSubTask && task.id === taskId) {
          return { ...task, isMilestone: !task.isMilestone }
        } else if (isSubTask && task.id === parentId) {
          return {
            ...task,
            subTasks: task.subTasks.map(subTask =>
              subTask.id === taskId
                ? { ...subTask, isMilestone: !subTask.isMilestone }
                : subTask
            )
          }
        }
        return task
      })
    })
  }

  const toggleExpanded = (taskId) => {
    setWbsData(prevData => {
      return prevData.map(task => {
        if (task.id === taskId) {
          return { ...task, isExpanded: !task.isExpanded }
        }
        return task
      })
    })
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'not started':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderProjectList = () => {
    const projects = projectsData[activeTab]
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className={`bg-white border border-gray-200 rounded-lg p-4 transition duration-200 transform ${activeTab === 'pending'
              ? 'hover:shadow-md'
              : 'hover:shadow-lg cursor-pointer hover:-translate-y-1'
              }`}
            onClick={() => activeTab !== 'pending' && handleProjectSelect(project)}
          >
            {/* Only show image for non-pending projects */}
            {activeTab !== 'pending' && (
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-2"><span className="font-bold">ID:</span> {project.code}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-bold">Location:</span> {project.location}</p>

              {/* Show description for pending projects */}
              {activeTab === 'pending' && project.description && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                  <h4 className="font-medium text-blue-900 mb-1 text-sm">Description:</h4>
                  <p className="text-blue-800 text-xs leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Show start date and due date for pending projects */}
              {activeTab === 'pending' && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600"><span className="font-bold">Start Date:</span> {project.startDate}</p>
                  <p className="text-sm text-gray-600"><span className="font-bold">Due Date:</span> {project.estimatedEndDate}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                {/* Only show "View Details" button for non-pending projects */}
                {activeTab !== 'pending' && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Progress Summary</h4>
                <p className="text-blue-700">Overall project progress: 65%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Budget Status</h4>
                <p className="text-green-700">Budget utilization: 58%</p>
              </div>
            </div>
          </div>
        )

      case 'design':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Design / Plan </h3>
            </div>
            <div className="space-y-4">
              {['Architectural Plan v1.pdf', 'Structural Drawing v2.dwg', 'Electrical Layout v1.pdf'].map((file, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{file}</span>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Preview</button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'wbs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Work Breakdown Structure (WBS) & Milestones</h3>
            </div>

            <div className="space-y-4">
              {wbsData.map((task) => (
                <div key={task.id} className="space-y-3">
                  {/* Main Task */}
                  <div className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${task.isMilestone
                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-lg ring-2 ring-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    {/* Milestone Badge */}
                    {task.isMilestone && (
                      <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md z-10">
                        <span className="mr-1">🏆</span>
                        MILESTONE
                      </div>
                    )}

                    {/* Milestone Toggle Button */}
                    <button
                      onClick={() => toggleMilestone(task.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${task.isMilestone
                        ? 'bg-yellow-500 text-white shadow-md hover:bg-yellow-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      title={task.isMilestone ? 'Remove from milestones' : 'Mark as milestone'}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>

                    <div className="flex items-center justify-between pr-12">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Expand/Collapse Button for subtasks */}
                        {task.subTasks.length > 0 && (
                          <button
                            onClick={() => toggleExpanded(task.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                          >
                            <svg
                              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${task.isExpanded ? 'rotate-90' : ''
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}

                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div className="md:col-span-2">
                              <h4 className={`font-semibold ${task.isMilestone ? 'text-yellow-900' : 'text-gray-900'}`}>
                                {task.name}
                              </h4>
                              <div className="mt-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-500 ${task.status === 'Completed' ? 'bg-green-500' :
                                        task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                                        }`}
                                      style={{ width: `${task.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600 min-w-0">{task.progress}%</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Due: {task.deadline}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Responsible: {task.responsible}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub Tasks */}
                  {task.isExpanded && task.subTasks.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {task.subTasks.map((subTask) => (
                        <div
                          key={subTask.id}
                          className={`relative p-3 rounded-lg border transition-all duration-300 ${subTask.isMilestone
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-md'
                            : 'bg-white border-gray-200'
                            }`}
                        >
                          {/* Sub-task Milestone Badge */}
                          {subTask.isMilestone && (
                            <div className="absolute -top-1 -left-1 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center shadow-sm z-10">
                              <span className="mr-1 text-xs">⭐</span>
                              SUB-MILESTONE
                            </div>
                          )}

                          {/* Sub-task Milestone Toggle */}
                          <button
                            onClick={() => toggleMilestone(subTask.id, true, task.id)}
                            className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-all duration-200 ${subTask.isMilestone
                              ? 'bg-yellow-400 text-white shadow-sm hover:bg-yellow-500'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                              }`}
                            title={subTask.isMilestone ? 'Remove from milestones' : 'Mark as milestone'}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>

                          <div className="pr-8">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                              <div className="md:col-span-2">
                                <h5 className={`font-medium text-sm ${subTask.isMilestone ? 'text-yellow-800' : 'text-gray-800'}`}>
                                  {subTask.name}
                                </h5>
                                <div className="mt-1">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${subTask.status === 'Completed' ? 'bg-green-500' :
                                          subTask.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                                          }`}
                                        style={{ width: `${subTask.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 min-w-0">{subTask.progress}%</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subTask.status)}`}>
                                  {subTask.status}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">Due: {subTask.deadline}</span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">Responsible: {subTask.responsible}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Milestones Summary */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                <span className="mr-2">🏆</span>
                Milestone Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {wbsData.filter(task => task.isMilestone).map(milestone => (
                  <div key={milestone.id} className="flex items-center space-x-3 p-2 bg-white rounded border border-yellow-200">
                    <div className={`w-3 h-3 rounded-full ${milestone.status === 'Completed' ? 'bg-green-500' :
                      milestone.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">{milestone.name}</p>
                      <p className="text-xs text-yellow-700">Due: {milestone.deadline}</p>
                    </div>
                  </div>
                ))}
                {wbsData.flatMap(task => task.subTasks.filter(sub => sub.isMilestone)).map(subMilestone => (
                  <div key={subMilestone.id} className="flex items-center space-x-3 p-2 bg-white rounded border border-yellow-200">
                    <div className={`w-3 h-3 rounded-full ${subMilestone.status === 'Completed' ? 'bg-green-500' :
                      subMilestone.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">{subMilestone.name}</p>
                      <p className="text-xs text-yellow-700">Due: {subMilestone.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'boq':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Bill of Quantities (BOQ)</h3>
            </div>

            {/* Total Value Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">Total Project Value</h4>
                  <p className="text-sm text-blue-700">Complete Bill of Quantities Summary</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-900">Rs 374,250,000.00</p>
                  <p className="text-sm text-blue-600">Including all materials and labor</p>
                </div>
              </div>
            </div>

            {/* BOQ Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate (LKR)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value (LKR)
                      </th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 1, material: 'Cement (OPC 53 Grade)', brand: 'ACC', quantity: '500 bags', rate: 135000, value: 67500000 },
                      { id: 2, material: 'Steel Reinforcement Bars', brand: 'Tata Steel', quantity: '25 tons', rate: 19500000, value: 487500000 },
                      { id: 3, material: 'Concrete Blocks', brand: 'Buildmate', quantity: '2000 blocks', rate: 13500, value: 27000000 },
                      { id: 4, material: 'Sand (River Sand)', brand: 'Local Supplier', quantity: '150 cubic ft', rate: 10500, value: 1575000 },
                      { id: 5, material: 'Gravel/Aggregate', brand: 'Holcim', quantity: '200 cubic ft', rate: 12000, value: 2400000 },
                      { id: 6, material: 'Paint (Exterior)', brand: 'Asian Paints', quantity: '50 liters', rate: 96000, value: 4800000 },
                      { id: 7, material: 'Roofing Tiles', brand: 'Monier', quantity: '1200 tiles', rate: 25500, value: 30600000 },
                      { id: 8, material: 'PVC Pipes', brand: 'Finolex', quantity: '500 meters', rate: 37500, value: 18750000 },
                      { id: 9, material: 'Electrical Wiring', brand: 'Havells', quantity: '2000 meters', rate: 13500, value: 27000000 },
                      { id: 10, material: 'Floor Tiles', brand: 'Kajaria', quantity: '150 sqm', rate: 255000, value: 38250000 }
                    ].map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.material}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Rs {item.rate.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          Rs {item.value.toLocaleString()}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        Grand Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                        Rs 705,375,000
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )

      case 'financial':
        return (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-medium text-green-900">Payments Received</h4>
                <p className="text-2xl font-bold text-green-700">Rs 36,000,000</p>
                <p className="text-sm text-green-600 mt-1">60% of total budget</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-medium text-yellow-900">Payments Pending</h4>
                <p className="text-2xl font-bold text-yellow-700">Rs 18,000,000</p>
                <p className="text-sm text-yellow-600 mt-1">30% of total budget</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-blue-900">Total Budget</h4>
                <p className="text-2xl font-bold text-blue-700">Rs 76,500,000</p>
                <p className="text-sm text-blue-600 mt-1">Project allocation</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-medium text-purple-900">Actual Cost</h4>
                <p className="text-2xl font-bold text-purple-700">Rs 54,000,000</p>
                <p className="text-sm text-purple-600 mt-1">71% of budget</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Payment Schedule & Installments</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-900">#</th>
                      <th className="px-4 py-3 font-medium text-gray-900">Milestone</th>
                      <th className="px-4 py-3 font-medium text-gray-900">Due Date</th>
                      <th className="px-4 py-3 font-medium text-gray-900">Amount (LKR)</th>
                      <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3 font-medium">Project Initiation</td>
                      <td className="px-4 py-3 text-gray-600">2024-01-15</td>
                      <td className="px-4 py-3 font-semibold text-green-600">Rs 15,300,000</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Paid</span>
                      </td>

                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3 font-medium">Foundation Completion</td>
                      <td className="px-4 py-3 text-gray-600">2024-03-01</td>
                      <td className="px-4 py-3 font-semibold text-green-600">Rs 12,750,000</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Paid</span>
                      </td>

                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">3</td>
                      <td className="px-4 py-3 font-medium">Structural Framework</td>
                      <td className="px-4 py-3 text-gray-600">2024-05-15</td>
                      <td className="px-4 py-3 font-semibold text-green-600">Rs 7,950,000</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Paid</span>
                      </td>

                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">4</td>
                      <td className="px-4 py-3 font-medium">Roofing & Electrical</td>
                      <td className="px-4 py-3 text-gray-600">2024-08-30</td>
                      <td className="px-4 py-3 font-semibold text-yellow-600">Rs 10,200,000</td>
                      <td className="px-4 py-3">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                      </td>

                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">5</td>
                      <td className="px-4 py-3 font-medium">Interior & Finishing</td>
                      <td className="px-4 py-3 text-gray-600">2024-11-15</td>
                      <td className="px-4 py-3 font-semibold text-gray-600">Rs 12,750,000</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Upcoming</span>
                      </td>

                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">6</td>
                      <td className="px-4 py-3 font-medium">Final Handover</td>
                      <td className="px-4 py-3 text-gray-600">2024-12-30</td>
                      <td className="px-4 py-3 font-semibold text-gray-600">Rs 17,550,000</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Upcoming</span>
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="text-lg font-semibold text-green-600">Rs 36,000,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Payment Due</p>
                    <p className="text-lg font-semibold text-yellow-600">Rs 10,200,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remaining Balance</p>
                    <p className="text-lg font-semibold text-gray-600">Rs 30,300,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'materials':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Material Management</h3>
            <div className="space-y-4">
              {[
                { item: 'Cement', remaining: '50 bags', status: 'Approved' },
                { item: 'Steel Bars', remaining: '200 units', status: 'Pending' },
                { item: 'Bricks', remaining: '5000 pieces', status: 'Approved' }
              ].map((material, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{material.item}</span>
                    <p className="text-sm text-gray-600">{material.remaining} remaining</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${material.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {material.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Select a section to view details</div>
    }
  }

  const renderProjectDetails = () => {
    if (!selectedProject) return null

    return (
      
      <div className="space-y-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Projects
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Only show image for non-pending projects */}
            {selectedProject.status !== 'Pending' && (
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full lg:w-80 h-64 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>

              {/* Show description for pending projects */}
              {selectedProject.description && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Project Description</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Project ID:</span>
                  <p className="text-gray-600">{selectedProject.code}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <p className="text-gray-600">{selectedProject.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <p className="text-gray-600">{selectedProject.startDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estimated End Date:</span>
                  <p className="text-gray-600">{selectedProject.estimatedEndDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>
                {/* Only show owner for non-pending projects */}
                {selectedProject.status !== 'Pending' && (
                  <div>
                    <span className="font-medium text-gray-700">Client:</span>
                    <p className="text-gray-600">{selectedProject.owner}</p>
                  </div>
                )}
                {/* Only show team members for non-pending projects */}
                {selectedProject.status !== 'Pending' && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Assigned Team Members:</span>
                    <p className="text-gray-600">{selectedProject.teamMembers.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Only show tabs for non-pending projects */}
          {selectedProject.status !== 'Pending' && (
            <>
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'design', label: 'Design/Plans' },
                    { id: 'wbs', label: 'WBS & Milestones' },
                    { id: 'boq', label: 'BOQ Summary' },
                    { id: 'financial', label: 'Financial' },
                    { id: 'materials', label: 'Materials' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeSection === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-6">
                {renderSectionContent()}
              </div>
            </>
          )}

          {/* Simple view for pending projects */}
          {/* {selectedProject.status === 'Pending' && (
            <div className="mt-6">
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-orange-900">Project Status: Pending</h3>
                </div>
                <p className="text-orange-800 mb-4">
                  This project is scheduled to begin on <span className="font-semibold">{selectedProject.startDate}</span> and 
                  is expected to be completed by <span className="font-semibold">{selectedProject.estimatedEndDate}</span>.
                </p>
                <p className="text-orange-700 text-sm">
                  Detailed project information including WBS, BOQ, and financial details will be available once the project begins.
                </p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedProject ? (
          <>
            {/* Main Projects Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Initial Projects</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getAllProjects().map((project, index) => (
                      <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {project.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUpdateClick(project)}
                            className="bg-amber-400 hover:bg-amber-200 text-black px-3 py-1 rounded text-xs transition duration-200"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Update Form Modal */}
            {showUpdateForm && (
              <div className="fixed inset-0   backdrop-blur-[2px] h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5  w-96 shadow-lg border-2 border-amber-400 rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Update Project</h3>
                    <form onSubmit={handleUpdateFormSubmit}>
                      <div className="space-y-4">
                        {/* Project ID (readonly) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project ID
                          </label>
                          <input
                            type="text"
                            value={updateFormData.id}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        {/* Project Name (readonly) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name
                          </label>
                          <input
                            type="text"
                            value={updateFormData.name}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                     

                        {/* Location (editable) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={updateFormData.location}
                            onChange={handleFormChange}
                            placeholder="Enter location"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Tools (editable) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tools
                          </label>
                          <textarea
                            name="tools"
                            value={updateFormData.tools}
                            onChange={handleFormChange}
                            placeholder="Enter tools (e.g., Machine A, Machine B, etc.)"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowUpdateForm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-200 text-black rounded-md transition duration-200"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('ongoing')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeTab === 'ongoing'
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-amber-400 border border-amber-400 hover:bg-blue-50'
                    }`}
                >
                  Ongoing Projects
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeTab === 'pending'
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-amber-400 border border-amber-400 hover:bg-blue-50'
                    }`}
                >
                  Pending Projects
                </button>
                <button
                  onClick={() => setActiveTab('finished')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeTab === 'finished'
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-amber-400 border border-amber-400 hover:bg-blue-50'
                    }`}
                >
                  Finished Projects
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'ongoing' ? 'Ongoing Projects' :
                    activeTab === 'pending' ? 'Pending Projects' :
                      'Finished Projects'}
                </h2>
              </div>

              {renderProjectList()}
            </div>
          </>
        ) : (
          renderProjectDetails()
        )}
      </div>
    </div>
  )
}

export default Projects