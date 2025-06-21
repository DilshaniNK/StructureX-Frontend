import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPayments, setSelectedPayments] = useState([])

  // Sample payment data
  const paymentData = [
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
    },
    {
      id: 'PAY-005',
      projectName: 'Data Analytics Dashboard',
      clientName: 'DataFlow Systems',
      amount: 28000,
      status: 'partial',
      dueDate: '2024-06-30',
      paidDate: '2024-06-22',
      method: 'Bank Transfer',
      invoice: 'INV-2024-005'
    }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      partial: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const filteredPayments = paymentData.filter(payment => {
    const matchesSearch = payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalAmount = paymentData.reduce((sum, payment) => sum + payment.amount, 0)
  const completedAmount = paymentData
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = paymentData
    .filter(p => p.status === 'pending' || p.status === 'partial')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const overdueCount = paymentData.filter(p => p.status === 'overdue').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h1>
          <p className="text-gray-600">Comprehensive overview of all project payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(completedAmount)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
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
                    placeholder="Search by project, client, or payment ID..."
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
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Method</th>
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
                      <span className="text-gray-600">{payment.method}</span>
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