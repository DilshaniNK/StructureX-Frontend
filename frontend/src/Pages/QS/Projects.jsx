import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import DailyUpdatesView from '../../Components/QS/DailyUpdatesView'
import SiteVisitList from '../../Components/QS/SiteVisitList'
import PaymentPlanView from '../../Components/QS/PaymentPlanView'

// Materials Section Component
const MaterialsSection = ({ projectId }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      if (!projectId) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/purchase-order/project/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch purchase orders')
        }

        const data = await response.json()
        // Filter only active orders (where orderStatus is true)
        const activeOrders = data.orders?.filter(order => order.orderStatus === true) || []
        setPurchaseOrders(activeOrders)
      } catch (err) {
        console.error('Error fetching purchase orders:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseOrders()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading purchase orders: {error}</p>
      </div>
    )
  }

  if (purchaseOrders.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No active purchase orders found for this project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Material Management - Purchase Orders</h3>
      
      {purchaseOrders.map((order) => (
        <div key={order.orderId} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">Order #{order.orderId}</h4>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {order.orderStatusText}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.paymentStatusText}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estimated Delivery</p>
                    <p className="font-medium text-gray-900">{order.estimatedDeliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Item Count</p>
                    <p className="font-medium text-gray-900">{order.itemCount} items</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-semibold text-blue-900">Rs {order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={item.itemId || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item.itemId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Rs {item.unitPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rs {(item.quantity * item.unitPrice)?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    Order Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                    Rs {order.totalAmount?.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function Projects() {
  // TODO: Replace with actual employee ID from authentication/route params
  const QS_EMPLOYEE_ID = 'EMP_001'
  
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ongoing')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRole, setUserRole] = useState('')
  const [showMyProjects, setShowMyProjects] = useState(false) // For SQS filtering
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [parentTaskId, setParentTaskId] = useState(null)
  
  // Design files state
  const [designFiles, setDesignFiles] = useState([])
  const [loadingDesigns, setLoadingDesigns] = useState(false)
  const [designError, setDesignError] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [showDesignOverlay, setShowDesignOverlay] = useState(false)
  
  // Toggle states for Client Info and Project Team
  const [showClientInfo, setShowClientInfo] = useState(false)
  const [showProjectTeam, setShowProjectTeam] = useState(false)
  
  // BOQ state
  const [boqData, setBoqData] = useState(null)
  const [loadingBoq, setLoadingBoq] = useState(false)
  const [boqError, setBoqError] = useState(null)
  
  // Payment/Financial state for overview
  const [paymentData, setPaymentData] = useState(null)
  const [loadingPayment, setLoadingPayment] = useState(false)
  
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    status: 'pending',
    startDate: '',
    deadline: '',
    progress: 0,
    isMilestone: false
  })
  
  const [showBulkTaskModal, setShowBulkTaskModal] = useState(false)
  const [bulkTasks, setBulkTasks] = useState([
    { name: '', status: 'pending', milestone: false, parentId: null }
  ])
  const [bulkSubtaskParent, setBulkSubtaskParent] = useState(null)
  
  // Fetch user role from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserRole(decoded.role || '')
      } catch (err) {
        console.error('Error decoding token:', err)
      }
    }
  }, [])

  // Fetch projects from API - QS gets only their own projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // QS gets only their own projects by employee ID
        const currentEmployeeId = employeeId || QS_EMPLOYEE_ID
        const url = `http://localhost:8086/api/v1/qs/projects/employee/${currentEmployeeId}`
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        setAllProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [employeeId])
  
  // Fetch design files when a project is selected and design section is active
  useEffect(() => {
    const fetchDesignFiles = async () => {
      if (!selectedProject || activeSection !== 'design') return
      
      setLoadingDesigns(true)
      setDesignError(null)
      
      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/qs/projects/design/${selectedProject.project_id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch design files')
        }
        
        const data = await response.json()
        setDesignFiles(data)
      } catch (err) {
        console.error('Error fetching design files:', err)
        setDesignError(err.message)
      } finally {
        setLoadingDesigns(false)
      }
    }
    
    fetchDesignFiles()
  }, [selectedProject, activeSection])
  
  // Fetch BOQ data when project is selected and BOQ section is active
  useEffect(() => {
    const fetchBoqData = async () => {
      if (!selectedProject || activeSection !== 'boq') return
      
      setLoadingBoq(true)
      setBoqError(null)
      
      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/boq/project/${selectedProject.project_id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (response.status === 404) {
          // BOQ doesn't exist yet
          setBoqData(null)
          setBoqError(null)
        } else if (!response.ok) {
          throw new Error('Failed to fetch BOQ data')
        } else {
          const data = await response.json()
          setBoqData(data)
        }
      } catch (err) {
        console.error('Error fetching BOQ data:', err)
        setBoqError(err.message)
      } finally {
        setLoadingBoq(false)
      }
    }
    
    fetchBoqData()
  }, [selectedProject, activeSection])
  
  // Fetch Payment data when a project is selected
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!selectedProject) return
      
      setLoadingPayment(true)
      
      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/payment-plan/project/${selectedProject.project_id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment data')
        }
        
        const data = await response.json()
        setPaymentData(data)
      } catch (err) {
        console.error('Error fetching payment data:', err)
        setPaymentData(null)
      } finally {
        setLoadingPayment(false)
      }
    }
    
    fetchPaymentData()
  }, [selectedProject])
  
  // Fetch WBS data when project is selected (for overview and WBS sections)
  useEffect(() => {
    const fetchWBSData = async () => {
      if (!selectedProject) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/wbs/project/${selectedProject.project_id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (!response.ok) {
          if (response.status === 404) {
            // No WBS data found, start with empty array
            setWbsData([])
            return
          }
          throw new Error('Failed to fetch WBS data')
        }
        
        const data = await response.json()
        // Transform API data to component format
        const transformedData = transformWBSFromAPI(data)
        setWbsData(transformedData)
      } catch (err) {
        console.error('Error fetching WBS data:', err)
        setError(err.message)
        setWbsData([]) // Reset to empty on error
      } finally {
        setLoading(false)
      }
    }
    
    fetchWBSData()
  }, [selectedProject])
  
  // WBS Data with milestones and sub-tasks
  const [wbsData, setWbsData] = useState([
    {
      id: 1,
      name: 'Foundation Work',
      status: 'Completed',
      startDate: '2024-01-15',
      deadline: '2024-06-30',
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
          progress: 100,
          isMilestone: false,
          isExpanded: true,
          subTasks: [
            {
              id: 111,
              name: 'Soil Testing',
              status: 'Completed',
              startDate: '2024-01-15',
              deadline: '2024-01-20',
              progress: 100,
              isMilestone: false,
              isExpanded: false,
              subTasks: []
            }
          ]
        },
        {
          id: 12,
          name: 'Foundation Pouring',
          status: 'Completed',
          startDate: '2024-02-16',
          deadline: '2024-06-30',
          progress: 100,
          isMilestone: false,
          isExpanded: false,
          subTasks: []
        },
        {
          id: 13,
          name: 'Curing & Testing',
          status: 'Completed',
          startDate: '2024-06-20',
          deadline: '2024-06-30',
          progress: 100,
          isMilestone: true,
          isExpanded: false,
          subTasks: []
        }
      ]
    },
    {
      id: 2,
      name: 'Structural Framework',
      status: 'In Progress',
      startDate: '2024-07-01',
      deadline: '2024-09-15',
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
          progress: 60,
          isMilestone: false,
          isExpanded: false,
          subTasks: []
        },
        {
          id: 22,
          name: 'Concrete Column Casting',
          status: 'Pending',
          startDate: '2024-08-16',
          deadline: '2024-09-15',
          progress: 0,
          isMilestone: false,
          isExpanded: false,
          subTasks: []
        },
        {
          id: 23,
          name: 'Beam Installation',
          status: 'Pending',
          startDate: '2024-09-01',
          deadline: '2024-09-15',
          progress: 0,
          isMilestone: false,
          isExpanded: false,
          subTasks: []
        }
      ]
    },
    {
      id: 3,
      name: 'Electrical Installation',
      status: 'Pending',
      startDate: '2024-09-16',
      deadline: '2024-11-30',
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
          progress: 0,
          isMilestone: false,
          isExpanded: false,
          subTasks: []
        },
        {
          id: 32,
          name: 'Main Panel Installation',
          status: 'Pending',
          startDate: '2024-11-01',
          deadline: '2024-11-30',
          progress: 0,
          isMilestone: false,
          isExpanded: false,
          subTasks: []
        }
      ]
    },
    {
      id: 4,
      name: 'Final Inspection & Handover',
      status: 'Pending',
      startDate: '2024-12-01',
      deadline: '2024-12-15',
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

  // Filter projects based on status and user role
  const getFilteredProjects = () => {
    let filtered = allProjects
    
    // For SQS, filter by showMyProjects toggle
    const currentEmployeeId = employeeId || QS_EMPLOYEE_ID
    if (userRole === 'Senior_QS_Officer' && showMyProjects) {
      filtered = filtered.filter(project => project.qs_id === currentEmployeeId)
    }
    
    // Filter by status (ongoing or finished)
    if (activeTab === 'ongoing') {
      filtered = filtered.filter(project => 
        project.status?.toLowerCase() === 'ongoing' || 
        project.status?.toLowerCase() === 'in progress'
      )
    } else {
      filtered = filtered.filter(project => 
        project.status?.toLowerCase() === 'completed' || 
        project.status?.toLowerCase() === 'finished'
      )
    }
    
    return filtered
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setActiveSection('overview')
  }

  // Helper function to transform WBS data from API format to component format
  const transformWBSFromAPI = (apiData) => {
    if (!Array.isArray(apiData)) return []
    
    // Build a map of tasks by ID
    const taskMap = {}
    apiData.forEach(task => {
      taskMap[task.taskId] = {
        id: task.taskId,
        name: task.name,
        status: task.status,
        startDate: task.startDate || '',
        deadline: task.deadline || '',
        progress: task.progress || 0,
        isMilestone: task.milestone || false,
        isExpanded: false,
        subTasks: [],
        parentId: task.parentId
      }
    })
    
    // Build hierarchy
    const rootTasks = []
    Object.values(taskMap).forEach(task => {
      if (!task.parentId) {
        rootTasks.push(task)
      } else {
        const parent = taskMap[task.parentId]
        if (parent) {
          parent.subTasks.push(task)
        }
      }
    })
    
    return rootTasks
  }
  
  // Helper function to transform component format to API format
  const transformWBSToAPI = (componentData, projectId, parentId = null) => {
    const apiData = []
    
    componentData.forEach(task => {
      apiData.push({
        projectId: projectId,
        parentId: parentId,
        name: task.name,
        status: task.status,
        milestone: task.isMilestone
      })
      
      if (task.subTasks && task.subTasks.length > 0) {
        apiData.push(...transformWBSToAPI(task.subTasks, projectId, task.id))
      }
    })
    
    return apiData
  }
  
  // Helper function to generate unique ID
  const generateTaskId = () => {
    return Date.now() + Math.random()
  }

  // Helper function to find task by ID recursively
  const findTaskById = (tasks, id) => {
    for (const task of tasks) {
      if (task.id === id) return task
      if (task.subTasks && task.subTasks.length > 0) {
        const found = findTaskById(task.subTasks, id)
        if (found) return found
      }
    }
    return null
  }

  // Helper function to add task at any level
  const addTaskAtLevel = (tasks, parentId, newTask) => {
    if (!parentId) {
      // Add to root level
      return [...tasks, newTask]
    }
    
    return tasks.map(task => {
      if (task.id === parentId) {
        return {
          ...task,
          subTasks: [...(task.subTasks || []), newTask]
        }
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: addTaskAtLevel(task.subTasks, parentId, newTask)
        }
      }
      return task
    })
  }

  // Helper function to update task at any level
  const updateTaskAtLevel = (tasks, taskId, updatedTask) => {
    return tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updatedTask }
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: updateTaskAtLevel(task.subTasks, taskId, updatedTask)
        }
      }
      return task
    })
  }

  // Helper function to delete task at any level
  const deleteTaskAtLevel = (tasks, taskId) => {
    return tasks.filter(task => {
      if (task.id === taskId) {
        return false
      }
      if (task.subTasks && task.subTasks.length > 0) {
        task.subTasks = deleteTaskAtLevel(task.subTasks, taskId)
      }
      return true
    })
  }

  // Helper function to toggle expanded state
  const toggleExpandedAtLevel = (tasks, taskId) => {
    return tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isExpanded: !task.isExpanded }
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: toggleExpandedAtLevel(task.subTasks, taskId)
        }
      }
      return task
    })
  }

  // Helper function to toggle milestone state
  const toggleMilestoneAtLevel = (tasks, taskId) => {
    return tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isMilestone: !task.isMilestone }
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: toggleMilestoneAtLevel(task.subTasks, taskId)
        }
      }
      return task
    })
  }

  // Task form handlers
  const handleOpenTaskForm = (parentId = null) => {
    setParentTaskId(parentId)
    setEditingTask(null)
    setTaskFormData({
      name: '',
      status: 'pending',
      isMilestone: false
    })
    setShowTaskForm(true)
  }
  
  const handleOpenBulkSubtaskForm = (parentId) => {
    setBulkSubtaskParent(parentId)
    setBulkTasks([{ name: '', status: 'pending', milestone: false, parentId: parentId }])
    setShowBulkTaskModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setParentTaskId(null)
    setTaskFormData({
      name: task.name,
      status: task.status,
      isMilestone: task.isMilestone
    })
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task and all its subtasks?')) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:8086/api/v1/wbs/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      
      // Refresh WBS data
      await refreshWBSData()
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task. Please try again.')
    }
  }
  
  const handleDeleteAllWBS = async () => {
    if (!selectedProject) return
    
    if (!window.confirm('Are you sure you want to delete the entire WBS for this project? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:8086/api/v1/wbs/project/${selectedProject.project_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete WBS')
      }
      
      // Clear local state
      setWbsData([])
      alert('WBS deleted successfully')
    } catch (err) {
      console.error('Error deleting WBS:', err)
      alert('Failed to delete WBS. Please try again.')
    }
  }

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedProject) return
    
    try {
      if (editingTask) {
        // Update existing task - use PUT for all fields
        const response = await fetch('http://localhost:8086/api/v1/wbs/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            taskId: editingTask.id,
            projectId: selectedProject.project_id,
            parentId: editingTask.parentId || null,
            name: taskFormData.name,
            status: taskFormData.status,
            milestone: taskFormData.isMilestone
          })
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to update task: ${errorText}`)
        }
        
        // Try to parse JSON response, but don't fail if there's no body
        try {
          const updatedTask = await response.json()
          console.log('Task updated:', updatedTask)
        } catch (jsonError) {
          // Response might not have a JSON body, which is fine
          console.log('Task updated successfully (no JSON response)')
        }
        
        // Refresh WBS data
        await refreshWBSData()
      } else {
        // Create new task
        const response = await fetch('http://localhost:8086/api/v1/wbs/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            projectId: selectedProject.project_id,
            parentId: parentTaskId,
            name: taskFormData.name,
            status: taskFormData.status,
            milestone: taskFormData.isMilestone
          })
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to create task: ${errorText}`)
        }
        
        // Try to parse JSON response, but don't fail if there's no body
        try {
          const newTask = await response.json()
          console.log('Task created:', newTask)
        } catch (jsonError) {
          // Response might not have a JSON body, which is fine
          console.log('Task created successfully (no JSON response)')
        }
        
        // Refresh WBS data
        await refreshWBSData()
      }
      
      setShowTaskForm(false)
      setEditingTask(null)
      setParentTaskId(null)
    } catch (err) {
      console.error('Error saving task:', err)
      alert('Failed to save task. Please try again.')
    }
  }

  const handleTaskFormCancel = () => {
    setShowTaskForm(false)
    setEditingTask(null)
    setParentTaskId(null)
  }
  
  const handleBulkTaskSubmit = async () => {
    if (!selectedProject) return
    
    // Validate that at least one task has a name
    const validTasks = bulkTasks.filter(task => task.name.trim() !== '')
    
    if (validTasks.length === 0) {
      alert('Please add at least one task with a name')
      return
    }
    
    try {
      // Format tasks for API
      const formattedTasks = validTasks.map(task => ({
        projectId: selectedProject.project_id,
        parentId: task.parentId || bulkSubtaskParent || null,
        name: task.name.trim(),
        status: task.status,
        milestone: task.milestone
      }))
      
      const response = await fetch('http://localhost:8086/api/v1/wbs/bulk-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formattedTasks)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create bulk tasks')
      }
      
      // Refresh WBS data
      await refreshWBSData()
      
      setShowBulkTaskModal(false)
      setBulkTasks([{ name: '', status: 'pending', milestone: false, parentId: null }])
      setBulkSubtaskParent(null)
      alert(`Successfully created ${validTasks.length} task(s)!`)
    } catch (err) {
      console.error('Error creating bulk tasks:', err)
      alert(`Failed to create bulk tasks: ${err.message}`)
    }
  }
  
  const handleAddBulkTaskRow = () => {
    setBulkTasks([...bulkTasks, { name: '', status: 'pending', milestone: false, parentId: null }])
  }
  
  const handleRemoveBulkTaskRow = (index) => {
    if (bulkTasks.length > 1) {
      setBulkTasks(bulkTasks.filter((_, i) => i !== index))
    }
  }
  
  const handleBulkTaskChange = (index, field, value) => {
    const updatedTasks = [...bulkTasks]
    updatedTasks[index][field] = value
    setBulkTasks(updatedTasks)
  }
  
  const getAllTasksForParentDropdown = (tasks, level = 0, prefix = '') => {
    let options = []
    tasks.forEach(task => {
      options.push({
        id: task.id,
        name: `${prefix}${task.name}`,
        level: level
      })
      if (task.subTasks && task.subTasks.length > 0) {
        options = options.concat(getAllTasksForParentDropdown(task.subTasks, level + 1, prefix + '  ↳ '))
      }
    })
    return options
  }

  // Updated toggle functions with confirmation
  const toggleMilestone = async (taskId, currentValue, taskName) => {
    const action = currentValue ? 'remove milestone status from' : 'mark as milestone'
    const confirmed = window.confirm(`Are you sure you want to ${action} "${taskName}"?`)
    
    if (!confirmed) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:8086/api/v1/wbs/${taskId}/milestone?milestone=${!currentValue}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to update milestone status')
      }
      
      // Refresh WBS data from API
      await refreshWBSData()
    } catch (err) {
      console.error('Error updating milestone:', err)
      alert('Failed to update milestone status. Please try again.')
    }
  }
  
  const handleStatusUpdate = async (taskId, newStatus, taskName) => {
    const confirmed = window.confirm(`Update "${taskName}" status to "${formatStatusDisplay(newStatus)}"?`)
    
    if (!confirmed) {
      return
    }
    
    try {
      // Find the task to get its current data
      const task = findTaskById(wbsData, taskId)
      if (!task) {
        throw new Error('Task not found')
      }
      
      const response = await fetch('http://localhost:8086/api/v1/wbs/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          taskId: taskId,
          projectId: selectedProject.project_id,
          parentId: task.parentId || null,
          name: task.name,
          status: newStatus,
          milestone: task.isMilestone
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update task status')
      }
      
      // Refresh WBS data from API
      await refreshWBSData()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update task status. Please try again.')
    }
  }
  
  const refreshWBSData = async () => {
    if (!selectedProject) return
    
    try {
      const response = await fetch(
        `http://localhost:8086/api/v1/wbs/project/${selectedProject.project_id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const transformedData = transformWBSFromAPI(data)
        setWbsData(transformedData)
      }
    } catch (err) {
      console.error('Error refreshing WBS data:', err)
    }
  }

  const toggleExpanded = (taskId) => {
    setWbsData(prevData => toggleExpandedAtLevel(prevData, taskId))
  }

  // Helper function to get all milestones recursively
  const getAllMilestones = (tasks) => {
    let milestones = []
    tasks.forEach(task => {
      if (task.isMilestone) {
        milestones.push(task)
      }
      if (task.subTasks && task.subTasks.length > 0) {
        milestones = milestones.concat(getAllMilestones(task.subTasks))
      }
    })
    return milestones
  }

  // Recursive function to render tasks at any level
  const renderTaskRecursive = (task, level = 0) => {
    const indentClass = level > 0 ? `ml-${level * 8}` : ''
    const sizeClass = level === 0 ? 'p-4' : level === 1 ? 'p-3' : 'p-2'
    const borderClass = level === 0 ? 'border-2' : 'border'
    
    return (
      <div key={task.id} className={`space-y-3 ${indentClass}`}>
        <div className={`relative ${sizeClass} rounded-lg ${borderClass} transition-all duration-300 ${
          task.isMilestone 
            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-lg ring-2 ring-yellow-200' 
            : level === 0 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
        }`}>
          {/* Milestone Badge */}
          {task.isMilestone && (
            <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md z-10">
              <span className="mr-1">🏆</span>
              {level === 0 ? 'MILESTONE' : 'SUB-MILESTONE'}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex space-x-1">
            {/* Edit Button */}
            <button
              onClick={() => handleEditTask(task)}
              className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              title="Edit task"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              title="Delete task"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Milestone Toggle Button */}
            <button
              onClick={() => toggleMilestone(task.id, task.isMilestone, task.name)}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                task.isMilestone 
                  ? 'bg-yellow-500 text-white shadow-md hover:bg-yellow-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={task.isMilestone ? 'Remove from milestones' : 'Mark as milestone'}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
            
            {/* Add Bulk Subtasks Button */}
            <button
              onClick={() => handleOpenBulkSubtaskForm(task.id)}
              className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
              title="Add subtasks"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between pr-20">
            <div className="flex items-center space-x-4 flex-1">
              {/* Expand/Collapse Button for subtasks */}
              {task.subTasks && task.subTasks.length > 0 && (
                <button
                  onClick={() => toggleExpanded(task.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                >
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      task.isExpanded ? 'rotate-90' : ''
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h4 className={`font-semibold ${level === 0 ? 'text-base' : 'text-sm'} ${task.isMilestone ? 'text-yellow-900' : 'text-gray-900'}`}>
                      {task.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task.id, e.target.value, task.name)}
                      className={`text-xs px-2 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delayed">Delayed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Tasks */}
        {task.isExpanded && task.subTasks && task.subTasks.length > 0 && (
          <div className="space-y-2">
            {task.subTasks.map((subTask) => renderTaskRecursive(subTask, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || ''
    switch (statusLower) {
      case 'in progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'pending':
      case 'not started':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const formatStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'delayed': 'Delayed'
    }
    return statusMap[status] || status
  }
  
  // Helper function to calculate WBS completion percentage
  const calculateWBSCompletion = (tasks) => {
    if (!tasks || tasks.length === 0) return 0
    
    const calculateTaskWeight = (task) => {
      // If task has subtasks, its weight is the sum of subtask weights
      if (task.subTasks && task.subTasks.length > 0) {
        return task.subTasks.reduce((sum, subTask) => sum + calculateTaskWeight(subTask), 0)
      }
      // Leaf tasks have weight of 1
      return 1
    }
    
    const calculateTaskCompletion = (task) => {
      const taskWeight = calculateTaskWeight(task)
      
      // If task has subtasks, calculate based on subtasks
      if (task.subTasks && task.subTasks.length > 0) {
        const subtaskCompletion = task.subTasks.reduce((sum, subTask) => {
          return sum + calculateTaskCompletion(subTask)
        }, 0)
        return subtaskCompletion
      }
      
      // Leaf task: return weight if completed, 0 otherwise
      if (task.status?.toLowerCase() === 'completed') {
        return taskWeight
      }
      return 0
    }
    
    // Calculate total weight of all tasks
    const totalWeight = tasks.reduce((sum, task) => sum + calculateTaskWeight(task), 0)
    
    if (totalWeight === 0) return 0
    
    // Calculate completed weight
    const completedWeight = tasks.reduce((sum, task) => sum + calculateTaskCompletion(task), 0)
    
    // Return percentage
    return Math.round((completedWeight / totalWeight) * 100)
  }
  
  // Helper function to calculate payment completion percentage
  const calculatePaymentCompletion = () => {
    if (!paymentData || !paymentData.phases || paymentData.phases.length === 0) {
      return 0
    }
    
    const totalAmount = paymentData.phases.reduce((sum, phase) => sum + (phase.amount || 0), 0)
    
    if (totalAmount === 0) return 0
    
    const paidAmount = paymentData.phases
      .filter(phase => phase.paymentStatus?.toLowerCase() === 'paid')
      .reduce((sum, phase) => sum + (phase.amount || 0), 0)
    
    return Math.round((paidAmount / totalAmount) * 100)
  }

  const renderProjectList = () => {
    const projects = getFilteredProjects()
    
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading projects: {error}</p>
        </div>
      )
    }
    
    if (projects.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No {activeTab} projects found.</p>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.project_id} 
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
            onClick={() => handleProjectSelect(project)}
          >
            {/* Header Section with light yellow background */}
            <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#FFDD00' }}>
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <h3 className="font-bold text-xl text-black truncate">{project.name}</h3>
              </div>
              <p className="text-gray-800 text-sm flex items-center space-x-1">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-black">Client:</span>
                <span className="truncate font-medium">{project.client_name}</span>
              </p>
            </div>

            {/* Body Section with yellow background */}
            <div className="p-4 bg-yellow-200">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                  <span className="text-xs font-bold text-black">ID:</span>
                  <span className="text-xs font-semibold text-black">{project.project_id}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                  <span className="text-xs font-bold text-black">Location:</span>
                  <span className="text-xs font-semibold text-black truncate ml-2">{project.location}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                  <span className="text-xs font-bold text-black">Category:</span>
                  <span className="text-xs font-semibold text-black">{project.category}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                  <span className="text-xs font-bold text-black">Budget:</span>
                  <span className="text-xs font-semibold text-black">Rs {project.budget?.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-center pt-3 border-t border-yellow-400">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <button className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-200 flex items-center space-x-1 shadow-md">
                  <span>View</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
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
        const wbsCompletionPercentage = calculateWBSCompletion(wbsData)
        const paymentCompletionPercentage = calculatePaymentCompletion()
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
            
            {/* WBS Completion Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 text-lg">Work Breakdown Structure (WBS) Progress</h4>
                    <p className="text-sm text-blue-700">Overall project task completion</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900">{wbsCompletionPercentage}%</div>
                  <p className="text-xs text-blue-600 mt-1">Completed</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative w-full bg-blue-200 rounded-full h-6 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                  style={{ width: `${wbsCompletionPercentage}%` }}
                >
                  {wbsCompletionPercentage > 10 && (
                    <span className="text-xs font-semibold text-white">{wbsCompletionPercentage}%</span>
                  )}
                </div>
                {wbsCompletionPercentage <= 10 && wbsCompletionPercentage > 0 && (
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-blue-900">
                    {wbsCompletionPercentage}%
                  </span>
                )}
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-blue-700">
                  {wbsData.length} main {wbsData.length === 1 ? 'task' : 'tasks'}
                </span>
                <span className="text-blue-700">
                  Based on hierarchical task completion
                </span>
              </div>
            </div>
            
            {/* Payment Completion Progress */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 text-lg">Payment Progress</h4>
                    <p className="text-sm text-green-700">Financial milestone completion</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-900">{paymentCompletionPercentage}%</div>
                  <p className="text-xs text-green-600 mt-1">Received</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative w-full bg-green-200 rounded-full h-6 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                  style={{ width: `${paymentCompletionPercentage}%` }}
                >
                  {paymentCompletionPercentage > 10 && (
                    <span className="text-xs font-semibold text-white">{paymentCompletionPercentage}%</span>
                  )}
                </div>
                {paymentCompletionPercentage <= 10 && paymentCompletionPercentage > 0 && (
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-green-900">
                    {paymentCompletionPercentage}%
                  </span>
                )}
              </div>
              
              {loadingPayment ? (
                <div className="mt-3 text-sm text-green-700">Loading payment data...</div>
              ) : paymentData && paymentData.phases ? (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-green-700">
                    {paymentData.phases.filter(p => p.paymentStatus?.toLowerCase() === 'paid').length} of {paymentData.phases.length} phases paid
                  </span>
                  <span className="text-green-700 font-semibold">
                    Rs {paymentData.phases
                      .filter(p => p.paymentStatus?.toLowerCase() === 'paid')
                      .reduce((sum, p) => sum + (p.amount || 0), 0)
                      .toLocaleString()} received
                  </span>
                </div>
              ) : (
                <div className="mt-3 text-sm text-green-700">No payment data available</div>
              )}
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Project Status</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Phase:</span>
                    <span className={`font-medium px-2 py-0.5 rounded ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress Variance:</span>
                    <span className={`font-semibold ${
                      wbsCompletionPercentage >= paymentCompletionPercentage ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {wbsCompletionPercentage >= paymentCompletionPercentage ? 'On Track' : 'Payment Ahead'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Timeline</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">{selectedProject.start_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">{selectedProject.due_date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'design':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Design / Plan / Drawing Section</h3>
            </div>
            
            {loadingDesigns ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : designError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error loading design files: {designError}</p>
              </div>
            ) : designFiles.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">No design files available for this project.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {designFiles.map((design, index) => (
                  <div key={design.design_id || index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{design.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            design.status === 'completed' ? 'bg-green-100 text-green-800' :
                            design.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {design.status}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            design.priority === 'high' ? 'bg-red-100 text-red-800' :
                            design.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {design.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{design.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Type:</span> {design.type}
                          </div>
                          <div>
                            <span className="font-medium">Due:</span> {design.due_date}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> Rs {design.price?.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">By:</span> {design.employee_name}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button 
                          onClick={() => {
                            setSelectedDesign(design)
                            setShowDesignOverlay(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                          View
                        </button>
                        <a
                          href={`http://localhost:8086/${design.design_link}`}
                          download
                          className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition-colors text-center"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Design Details Overlay */}
            {showDesignOverlay && selectedDesign && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedDesign.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedDesign.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedDesign.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedDesign.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedDesign.priority === 'high' ? 'bg-red-100 text-red-800' :
                          selectedDesign.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedDesign.priority} priority
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowDesignOverlay(false)
                        setSelectedDesign(null)
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedDesign.description}</p>
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Design ID</p>
                        <p className="font-semibold text-gray-900">{selectedDesign.design_id}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Project ID</p>
                        <p className="font-semibold text-gray-900">{selectedDesign.project_id}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Type</p>
                        <p className="font-semibold text-gray-900 capitalize">{selectedDesign.type}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Due Date</p>
                        <p className="font-semibold text-gray-900">{selectedDesign.due_date}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Price</p>
                        <p className="font-semibold text-gray-900">Rs {selectedDesign.price?.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Client ID</p>
                        <p className="font-semibold text-gray-900">{selectedDesign.client_id}</p>
                      </div>
                    </div>
                    
                    {/* Employee Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Created By</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-blue-600">Name</p>
                          <p className="font-semibold text-blue-900">{selectedDesign.employee_name}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Position</p>
                          <p className="font-semibold text-blue-900">{selectedDesign.employee_position?.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Employee ID</p>
                          <p className="font-semibold text-blue-900">{selectedDesign.employee_id}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Notes */}
                    {selectedDesign.additional_note && selectedDesign.additional_note !== 'nothing' && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedDesign.additional_note}</p>
                      </div>
                    )}
                    
                    {/* Download Button */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowDesignOverlay(false)
                          setSelectedDesign(null)
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <a
                        href={`http://localhost:8086/${selectedDesign.design_link}`}
                        download
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Design</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'wbs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Work Breakdown Structure (WBS) & Milestones</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowBulkTaskModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Tasks</span>
                </button>
                {wbsData.length > 0 && (
                  <button 
                    onClick={handleDeleteAllWBS}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Task Form Modal */}
            {showTaskForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h4 className="text-lg font-semibold mb-4">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h4>
                  
                  <form onSubmit={handleTaskFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Name
                      </label>
                      <input
                        type="text"
                        value={taskFormData.name}
                        onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={taskFormData.status}
                        onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="milestone"
                        checked={taskFormData.isMilestone}
                        onChange={(e) => setTaskFormData({ ...taskFormData, isMilestone: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="milestone" className="ml-2 block text-sm text-gray-700">
                        Mark as Milestone
                      </label>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleTaskFormCancel}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {editingTask ? 'Update Task' : 'Add Task'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Bulk Task Modal */}
            {showBulkTaskModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">
                      {bulkSubtaskParent ? 'Add Multiple Subtasks' : 'Add Multiple Tasks'}
                    </h4>
                    <button
                      onClick={() => {
                        setShowBulkTaskModal(false)
                        setBulkTasks([{ name: '', status: 'pending', milestone: false, parentId: null }])
                        setBulkSubtaskParent(null)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Show parent task if adding subtasks */}
                    {bulkSubtaskParent && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-blue-900">
                          Adding subtasks to: <span className="font-bold">
                            {findTaskById(wbsData, bulkSubtaskParent)?.name || 'Selected Task'}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Task</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Milestone</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bulkTasks.map((task, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={task.name}
                                  onChange={(e) => handleBulkTaskChange(index, 'name', e.target.value)}
                                  placeholder="Enter task name"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={task.status}
                                  onChange={(e) => handleBulkTaskChange(index, 'status', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                  <option value="delayed">Delayed</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={task.parentId || ''}
                                  onChange={(e) => handleBulkTaskChange(index, 'parentId', e.target.value || null)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  disabled={bulkSubtaskParent !== null}
                                >
                                  <option value="">Root Level</option>
                                  {getAllTasksForParentDropdown(wbsData).map(option => (
                                    <option key={option.id} value={option.id}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={task.milestone}
                                  onChange={(e) => handleBulkTaskChange(index, 'milestone', e.target.checked)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleRemoveBulkTaskRow(index)}
                                  className="text-red-600 hover:text-red-800"
                                  disabled={bulkTasks.length === 1}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={handleAddBulkTaskRow}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      + Add Another Task
                    </button>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => {
                          setShowBulkTaskModal(false)
                          setBulkTasks([{ name: '', status: 'pending', milestone: false, parentId: null }])
                          setBulkSubtaskParent(null)
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkTaskSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Create All Tasks
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Render Tasks */}
            {wbsData.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No WBS Tasks Yet</h3>
                <p className="text-gray-600 mb-6">Start building your Work Breakdown Structure by adding tasks.</p>
                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={() => setShowBulkTaskModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Add Tasks
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {wbsData.map((task) => renderTaskRecursive(task, 0))}
              </div>
            )}
          </div>
        )
      
      case 'boq':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Bill of Quantities (BOQ)</h3>
            </div>

            {loadingBoq ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : boqError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error loading BOQ: {boqError}</p>
              </div>
            ) : boqData ? (
              <>
                {/* BOQ Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-blue-900">BOQ Details</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          boqData.boq?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          boqData.boq?.status === 'FINAL' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {boqData.boq?.status || 'DRAFT'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-600">BOQ ID</p>
                          <p className="font-medium text-blue-900">{boqData.boq?.boqId || boqData.boq_id || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Date</p>
                          <p className="font-medium text-blue-900">{boqData.boq?.date || new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">QS Officer</p>
                          <p className="font-medium text-blue-900">{boqData.boq?.qsId || selectedProject?.qs_id || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Total Items</p>
                          <p className="font-medium text-blue-900">{boqData.items?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-700 mb-1">Total Value</p>
                      <p className="text-3xl font-bold text-blue-900">
                        Rs {boqData.items?.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString() || '0'}
                      </p>
                      {/* Only show Edit button if the project's qs_id matches the current QS employee ID */}
                      {selectedProject?.qs_id === (employeeId || QS_EMPLOYEE_ID) ? (
                        <button 
                          onClick={() => navigate('/qs/boq', { 
                            state: { 
                              editBoqId: boqData.boq?.boqId || boqData.boq_id, 
                              projectId: selectedProject.project_id 
                            } 
                          })}
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit BOQ</span>
                        </button>
                      ) : (
                        <div className="mt-3 text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
                          <p>BOQ managed by QS: {boqData.boq?.qsId || selectedProject?.qs_id || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* BOQ Items Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rate (LKR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount (LKR)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {boqData.items?.map((item, index) => (
                          <tr key={item.itemId || item.boq_item_id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {item.itemDescription || item.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              Rs {item.rate?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              Rs {item.amount?.toLocaleString()}
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
                            Rs {boqData.items?.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString() || '0'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No BOQ Found</h3>
                <p className="text-gray-600 mb-6">This project doesn't have a Bill of Quantities yet.</p>
                {/* Only show Add BOQ button if the project's qs_id matches the current QS employee ID */}
                {selectedProject?.qs_id === (employeeId || QS_EMPLOYEE_ID) ? (
                  <button 
                    onClick={() => navigate('/qs/boq', { state: { createForProject: selectedProject.project_id } })}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add BOQ</span>
                  </button>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">BOQ hasn't been created yet.</span>
                      <br />
                      This project is assigned to another QS officer (ID: {selectedProject?.qs_id || 'N/A'}).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      
      case 'financial':
        return (
          <div className="space-y-6">
            <PaymentPlanView projectId={selectedProject?.project_id} />
          </div>
        )
      
      case 'materials':
        return <MaterialsSection projectId={selectedProject?.project_id} />
      
      case 'visits':
        return (
          <div className="space-y-6">
            <SiteVisitList projectId={selectedProject?.project_id} />
          </div>
        )
      
      case 'updates':
        return (
          <div className="space-y-6">
            <DailyUpdatesView projectId={selectedProject?.project_id} />
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
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Project ID:</span>
                  <p className="text-gray-600">{selectedProject.project_id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <p className="text-gray-600">{selectedProject.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <p className="text-gray-600">{selectedProject.category}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <p className="text-gray-600">{selectedProject.start_date}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Due Date:</span>
                  <p className="text-gray-600">{selectedProject.due_date}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Budget:</span>
                  <p className="text-gray-600">Rs {selectedProject.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estimated Value:</span>
                  <p className="text-gray-600">Rs {selectedProject.estimated_value?.toLocaleString()}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                
                {/* Toggle Buttons for Client Info and Project Team */}
                <div className="md:col-span-2 flex gap-4 mt-4">
                  <button
                    onClick={() => setShowClientInfo(!showClientInfo)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Client Information
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${showClientInfo ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setShowProjectTeam(!showProjectTeam)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Project Team
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${showProjectTeam ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Client Information - Collapsible */}
                {showClientInfo && (
                  <div className="md:col-span-2 border-t pt-4 mt-2 animate-fadeIn">
                    <h3 className="font-semibold text-gray-900 mb-2">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <p className="text-gray-600">{selectedProject.client_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <p className="text-gray-600">{selectedProject.client_type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-600">{selectedProject.client_email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <p className="text-gray-600">{selectedProject.client_phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Address:</span>
                        <p className="text-gray-600">{selectedProject.client_address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Team - Collapsible */}
                {showProjectTeam && (
                  <div className="md:col-span-2 border-t pt-4 mt-2 animate-fadeIn">
                    <h3 className="font-semibold text-gray-900 mb-2">Project Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-semibold text-blue-900">Project Manager</span>
                        </div>
                        <p className="text-sm text-blue-700 font-medium">{selectedProject.pm_name || 'Not Assigned'}</p>
                        <p className="text-xs text-blue-600">ID: {selectedProject.pm_id || 'N/A'}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-semibold text-green-900">QS Officer</span>
                        </div>
                        <p className="text-sm text-green-700 font-medium">{selectedProject.qs_name || 'Not Assigned'}</p>
                        <p className="text-xs text-green-600">ID: {selectedProject.qs_id || 'N/A'}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-semibold text-orange-900">Site Supervisor</span>
                        </div>
                        <p className="text-sm text-orange-700 font-medium">{selectedProject.ss_name || 'Not Assigned'}</p>
                        <p className="text-xs text-orange-600">ID: {selectedProject.ss_id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'design', label: 'Design/Plans' },
                { id: 'wbs', label: 'WBS & Milestones' },
                { id: 'boq', label: 'BOQ Summary' },
                { id: 'financial', label: 'Financial' },
                { id: 'materials', label: 'Materials' },
                { id: 'visits', label: 'Site Visits' },
                { id: 'updates', label: 'Daily Updates' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeSection === tab.id
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedProject ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('ongoing')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                    activeTab === 'ongoing' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Ongoing Projects
                </button>
                <button 
                  onClick={() => setActiveTab('finished')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                    activeTab === 'finished' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Finished Projects
                </button>
              </div>
              
              {/* Filter button for SQS to show only their projects */}
              {userRole === 'Senior_QS_Officer' && (
                <button 
                  onClick={() => setShowMyProjects(!showMyProjects)}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                    showMyProjects 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                  }`}
                >
                  {showMyProjects ? 'Showing My Projects' : 'Show My Projects Only'}
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'ongoing' ? 'Ongoing Projects' : 'Finished Projects'}
                  {userRole === 'Senior_QS_Officer' && showMyProjects && (
                    <span className="ml-2 text-sm text-green-600">(My Projects)</span>
                  )}
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