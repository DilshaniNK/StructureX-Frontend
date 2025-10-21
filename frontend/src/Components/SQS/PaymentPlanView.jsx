import React, { useState, useEffect } from 'react'

const PaymentPlanView = ({ projectId }) => {
  const [paymentPlan, setPaymentPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaymentPlan = async () => {
      if (!projectId) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/qs/projects/payment-plan/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        if (response.status === 404) {
          setPaymentPlan(null)
          setError(null)
        } else if (!response.ok) {
          throw new Error('Failed to fetch payment plan')
        } else {
          const data = await response.json()
          setPaymentPlan(data)
        }
      } catch (err) {
        console.error('Error fetching payment plan:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentPlan()
  }, [projectId])

  const calculatePaymentStats = () => {
    if (!paymentPlan || !paymentPlan.installments) {
      return {
        totalPaid: 0,
        totalPending: 0,
        paidCount: 0,
        pendingCount: 0,
        completionPercentage: 0
      }
    }

    const paidInstallments = paymentPlan.installments.filter(i => i.status === 'paid')
    const pendingInstallments = paymentPlan.installments.filter(i => i.status !== 'paid')
    
    const totalPaid = paidInstallments.reduce((sum, i) => sum + i.amount, 0)
    const totalPending = pendingInstallments.reduce((sum, i) => sum + i.amount, 0)
    const completionPercentage = paymentPlan.totalAmount > 0 
      ? (totalPaid / paymentPlan.totalAmount * 100).toFixed(1) 
      : 0

    return {
      totalPaid,
      totalPending,
      paidCount: paidInstallments.length,
      pendingCount: pendingInstallments.length,
      completionPercentage
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

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
        <p className="text-red-800">Error loading payment plan: {error}</p>
      </div>
    )
  }

  if (!paymentPlan) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Plan Found</h3>
        <p className="text-gray-600">This project doesn't have a payment plan yet.</p>
      </div>
    )
  }

  const stats = calculatePaymentStats()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Payment Plan & Installments</h3>
      
      {/* Payment Plan Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-blue-600 mb-1">Plan ID</p>
            <p className="text-lg font-bold text-blue-900">{paymentPlan.paymentPlanId}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Project ID</p>
            <p className="text-lg font-bold text-blue-900">{paymentPlan.projectId}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-blue-900">Rs {paymentPlan.totalAmount?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Installments</p>
            <p className="text-lg font-bold text-blue-900">{paymentPlan.numberOfInstallments} payments</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-200">
          <div>
            <p className="text-sm text-blue-600 mb-1">Start Date</p>
            <p className="text-sm font-semibold text-blue-900">{formatDate(paymentPlan.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">End Date</p>
            <p className="text-sm font-semibold text-blue-900">{formatDate(paymentPlan.endDate)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Created On</p>
            <p className="text-sm font-semibold text-blue-900">{formatDate(paymentPlan.createdDate)}</p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-green-700">Rs {stats.totalPaid.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{stats.paidCount} installment(s)</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">Rs {stats.totalPending.toLocaleString()}</p>
              <p className="text-xs text-yellow-600 mt-1">{stats.pendingCount} installment(s)</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-blue-700">Rs {paymentPlan.totalAmount?.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">{paymentPlan.numberOfInstallments} installments</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion</p>
              <p className="text-2xl font-bold text-purple-700">{stats.completionPercentage}%</p>
              <p className="text-xs text-purple-600 mt-1">of total amount</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Payment Progress</span>
          <span className="font-semibold text-gray-900">{stats.completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
            style={{width: `${stats.completionPercentage}%`}}
          >
            {parseFloat(stats.completionPercentage) > 10 && (
              <span className="text-xs font-bold text-white drop-shadow">{stats.completionPercentage}%</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Rs 0</span>
          <span>Rs {paymentPlan.totalAmount?.toLocaleString()}</span>
        </div>
      </div>

      {/* Installments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Installment Schedule</h4>
          <p className="text-sm text-gray-600 mt-1">
            Detailed breakdown of all {paymentPlan.numberOfInstallments} payment installments
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentPlan.installments && paymentPlan.installments.length > 0 ? (
                paymentPlan.installments.map((installment, index) => (
                  <tr 
                    key={installment.installmentId} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        #{installment.installmentId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rs {installment.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(installment.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {installment.paidDate ? (
                        <span className="text-green-600 font-medium">
                          {formatDate(installment.paidDate)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(installment.status)}`}>
                        {installment.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {installment.status === 'paid' ? (
                        <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          View Receipt
                        </button>
                      ) : (
                        <button className="text-gray-400 cursor-not-allowed" disabled>
                          Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No installments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-xl font-bold text-green-600">Rs {stats.totalPaid.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.paidCount} installment(s) completed</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Next Payment Due</p>
            <p className="text-xl font-bold text-yellow-600">
              {stats.pendingCount > 0 ? `Rs ${paymentPlan.installments.find(i => i.status !== 'paid')?.amount.toLocaleString() || '0'}` : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.pendingCount > 0 ? formatDate(paymentPlan.installments.find(i => i.status !== 'paid')?.dueDate) : 'All paid'}
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
            <p className="text-xl font-bold text-gray-700">Rs {stats.totalPending.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.pendingCount} installment(s) remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPlanView
