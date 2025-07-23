import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Calendar, DollarSign, TrendingUp, AlertCircle, Package, Users, CheckCircle, Clock, UserCheck } from 'lucide-react'

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('project') // project, purchase, labor
  const [selectedPayments, setSelectedPayments] = useState([])

  // Sample project payment data
  const projectPaymentData = [
    {
      id: 'PAY-001',
      projectName: 'Website Redesign',
      clientName: 'Acme Corporation',
      amount: 15000,
      status: 'completed',
      dueDate: '2024-06-15',
      paidDate: '2024-06-14',
      method: 'Bank Transfer',
      invoice: 'INV-2024-001'
    },
    {
      id: 'PAY-002',
      projectName: 'Mobile App Development',
      clientName: 'TechStart Ltd',
      amount: 35000,
      status: 'pending',
      dueDate: '2024-06-25',
      paidDate: null,
      method: 'Wire Transfer',
      invoice: 'INV-2024-002'
    },
    {
      id: 'PAY-003',
      projectName: 'Brand Identity Package',
      clientName: 'Creative Studios',
      amount: 8500,
      status: 'overdue',
      dueDate: '2024-06-10',
      paidDate: null,
      method: 'Check',
      invoice: 'INV-2024-003'
    },
    {
      id: 'PAY-004',
      projectName: 'E-commerce Platform',
      clientName: 'RetailMax Inc',
      amount: 52000,
      status: 'completed',
      dueDate: '2024-06-20',
      paidDate: '2024-06-18',
      method: 'ACH Transfer',
      invoice: 'INV-2024-004'
    }
  ]

  // Sample purchase order payment data
  const purchaseOrderData = [
    {
      id: 'PO-001',
      orderNumber: 'PO-2024-001',
      supplierName: 'BuildMart Supplies',
      description: 'Steel Reinforcement Bars',
      amount: 12500,
      status: 'received',
      orderDate: '2024-06-10',
      receivedDate: '2024-06-15',
      paymentDue: '2024-06-25',
      paidDate: null,
      supervisor: 'John Smith'
    },
    {
      id: 'PO-002',
      orderNumber: 'PO-2024-002',
      supplierName: 'Concrete Solutions Ltd',
      description: 'Ready Mix Concrete',
      amount: 8750,
      status: 'paid',
      orderDate: '2024-06-05',
      receivedDate: '2024-06-08',
      paymentDue: '2024-06-18',
      paidDate: '2024-06-16',
      supervisor: 'Mike Johnson'
    },
    {
      id: 'PO-003',
      orderNumber: 'PO-2024-003',
      supplierName: 'Electric Components Co',
      description: 'Electrical Wiring & Fixtures',
      amount: 15200,
      status: 'pending_payment',
      orderDate: '2024-06-12',
      receivedDate: '2024-06-18',
      paymentDue: '2024-06-28',
      paidDate: null,
      supervisor: 'Sarah Wilson'
    },
    {
      id: 'PO-004',
      orderNumber: 'PO-2024-004',
      supplierName: 'Tools & Equipment Inc',
      description: 'Construction Tools',
      amount: 6800,
      status: 'ordered',
      orderDate: '2024-06-20',
      receivedDate: null,
      paymentDue: null,
      paidDate: null,
      supervisor: 'John Smith'
    }
  ]

  // Sample labor payment data
  const laborPaymentData = [
    {
      id: 'LAB-001',
      workerName: 'David Rodriguez',
      workerType: 'direct',
      position: 'Site Engineer',
      department: 'Construction',
      salary: 4500,
      month: '2024-06',
      status: 'paid',
      paidDate: '2024-06-30',
      overtimeHours: 12,
      overtimePay: 450
    },
    {
      id: 'LAB-002',
      workerName: 'Maria Garcia',
      workerType: 'direct',
      position: 'Project Manager',
      department: 'Management',
      salary: 6000,
      month: '2024-06',
      status: 'paid',
      paidDate: '2024-06-30',
      overtimeHours: 8,
      overtimePay: 320
    },
    {
      id: 'LAB-003',
      workerName: 'ABC Security Services',
      workerType: 'contractor',
      position: 'Security Guards',
      department: 'Security',
      salary: 3200,
      month: '2024-06',
      status: 'pending',
      paidDate: null,
      contractHours: 720,
      rate: 15
    },
    {
      id: 'LAB-004',
      workerName: 'Clean Pro Services',
      workerType: 'contractor',
      position: 'Cleaning Staff',
      department: 'Maintenance',
      salary: 1800,
      month: '2024-06',
      status: 'pending',
      paidDate: null,
      contractHours: 120,
      rate: 15
    },
    {
      id: 'LAB-005',
      workerName: 'James Wilson',
      workerType: 'direct',
      position: 'Foreman',
      department: 'Construction',
      salary: 5200,
      month: '2024-06',
      status: 'paid',
      paidDate: '2024-06-30',
      overtimeHours: 16,
      overtimePay: 640
    }
  ]

  const getStatusBadge = (status, type = 'general') => {
    let statusConfig = {}
    
    if (type === 'purchase') {
      statusConfig = {
        ordered: 'bg-blue-100 text-blue-800 border-blue-200',
        received: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        pending_payment: 'bg-orange-100 text-orange-800 border-orange-200',
        paid: 'bg-green-100 text-green-800 border-green-200'
      }
    } else {
      statusConfig = {
        completed: 'bg-green-100 text-green-800 border-green-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        overdue: 'bg-red-100 text-red-800 border-red-200',
        partial: 'bg-blue-100 text-blue-800 border-blue-200',
        paid: 'bg-green-100 text-green-800 border-green-200'
      }
    }
    
    const displayText = status.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status]}`}>
        {displayText}
      </span>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'project':
        return projectPaymentData
      case 'purchase':
        return purchaseOrderData
      case 'labor':
        return laborPaymentData
      default:
        return projectPaymentData
    }
  }

  const filteredPayments = getCurrentData().filter(payment => {
    let matchesSearch = false
    
    if (activeTab === 'project') {
      matchesSearch = payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    } else if (activeTab === 'purchase') {
      matchesSearch = payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
    } else if (activeTab === 'labor') {
      matchesSearch = payment.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     payment.workerType.toLowerCase().includes(searchTerm.toLowerCase())
    }
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatsForActiveTab = () => {
    const data = getCurrentData()
    
    if (activeTab === 'project') {
      const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0)
      const completedAmount = data.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0)
      const pendingAmount = data.filter(p => p.status === 'pending' || p.status === 'partial').reduce((sum, payment) => sum + payment.amount, 0)
      const overdueCount = data.filter(p => p.status === 'overdue').length
      
      return { totalAmount, completedAmount, pendingAmount, overdueCount }
    } else if (activeTab === 'purchase') {
      const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0)
      const paidAmount = data.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0)
      const pendingAmount = data.filter(p => p.status === 'pending_payment' || p.status === 'received').reduce((sum, payment) => sum + payment.amount, 0)
      const orderedCount = data.filter(p => p.status === 'ordered').length
      
      return { totalAmount, completedAmount: paidAmount, pendingAmount, overdueCount: orderedCount }
    } else if (activeTab === 'labor') {
      const directWorkers = data.filter(p => p.workerType === 'direct')
      const contractors = data.filter(p => p.workerType === 'contractor')
      const totalAmount = data.reduce((sum, payment) => {
        const overtime = payment.overtimePay || 0
        return sum + payment.salary + overtime
      }, 0)
      const paidAmount = data.filter(p => p.status === 'paid').reduce((sum, payment) => {
        const overtime = payment.overtimePay || 0
        return sum + payment.salary + overtime
      }, 0)
      const pendingAmount = data.filter(p => p.status === 'pending').reduce((sum, payment) => {
        const overtime = payment.overtimePay || 0
        return sum + payment.salary + overtime
      }, 0)
      
      return { 
        totalAmount, 
        completedAmount: paidAmount, 
        pendingAmount, 
        overdueCount: directWorkers.length,
        contractorCount: contractors.length
      }
    }
  }

  const stats = getStatsForActiveTab()

  const getStatsCards = () => {
    if (activeTab === 'labor') {
      return (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.completedAmount)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Direct Workers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.overdueCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contractors</p>
                <p className="text-2xl font-bold text-purple-600">{stats.contractorCount}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </>
      )
    } else {
      const labels = activeTab === 'purchase' 
        ? ['Total Orders', 'Paid', 'Pending Payment', 'Ordered']
        : ['Total Revenue', 'Completed', 'Pending', 'Overdue']
      
      return (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{labels[0]}</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                {activeTab === 'purchase' ? <Package className="h-6 w-6 text-blue-600" /> : <DollarSign className="h-6 w-6 text-blue-600" />}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{labels[1]}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.completedAmount)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{labels[2]}</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{labels[3]}</p>
                <p className="text-2xl font-bold text-red-600">{activeTab === 'purchase' ? stats.overdueCount : stats.overdueCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </>
      )
    }
  }

  const renderTable = () => {
    if (activeTab === 'project') {
      return (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment ID</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Project</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Due Date</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Paid Date</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-medium text-blue-600">{payment.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">{payment.projectName}</p>
                    <p className="text-sm text-gray-500">{payment.invoice}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">{payment.clientName}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{formatDate(payment.dueDate)}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{formatDate(payment.paidDate)}</span>
                </td>
                <td className="py-4 px-6">
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    } else if (activeTab === 'purchase') {
      return (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Order Number</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Supplier</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Received Date</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Supervisor</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-medium text-blue-600">{payment.orderNumber}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">{payment.supplierName}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">{payment.description}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(payment.status, 'purchase')}
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{formatDate(payment.receivedDate)}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{payment.supervisor}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    {payment.status === 'received' && (
                      <button className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Pay
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    } else if (activeTab === 'labor') {
      return (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Worker</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Position</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Base Salary</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Extra</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Total</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const extra = payment.overtimePay || 0
              const total = payment.salary + extra
              return (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{payment.workerName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.workerType === 'direct' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {payment.workerType === 'direct' ? 'Direct' : 'Contractor'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{payment.position}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{payment.department}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">{formatCurrency(payment.salary)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {payment.workerType === 'direct' ? (
                        <>
                          <span className="text-gray-600">{payment.overtimeHours}h OT</span>
                          <br />
                          <span className="font-medium text-green-600">{formatCurrency(extra)}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-600">{payment.contractHours}h @ ${payment.rate}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      {payment.status === 'pending' && (
                        <button className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Comprehensive overview of all payments across projects, purchases, and labor</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('project')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'project'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Project Payments
              </button>
              <button
                onClick={() => setActiveTab('purchase')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchase'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab('labor')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'labor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Labor Payments
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsCards()}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'project' ? "Search by project, client, or payment ID..." :
                      activeTab === 'purchase' ? "Search by order, supplier, or supervisor..." :
                      "Search by worker, position, or department..."
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    {activeTab === 'project' && (
                      <>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                        <option value="partial">Partial</option>
                      </>
                    )}
                    {activeTab === 'purchase' && (
                      <>
                        <option value="ordered">Ordered</option>
                        <option value="received">Received</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="paid">Paid</option>
                      </>
                    )}
                    {activeTab === 'labor' && (
                      <>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </>
                    )}
                  </select>
                </div>

                {activeTab === 'labor' && (
                  <div className="flex items-center gap-2">
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => {
                        // This would filter by worker type
                        console.log('Worker type filter:', e.target.value)
                      }}
                    >
                      <option value="all">All Workers</option>
                      <option value="direct">Direct Workers</option>
                      <option value="contractor">3rd Party Workers</option>
                    </select>
                  </div>
                )}

                {activeTab === 'labor' && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <input
                      type="month"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="2024-06"
                    />
                  </div>
                )}
              </div>

              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {renderTable()}
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payments found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments