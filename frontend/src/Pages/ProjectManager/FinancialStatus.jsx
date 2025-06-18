import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const FinancialStatus = () => {
  const budgetOverview = {
    totalBudget: 2400000,
    paidAmount: 1680000,
    pendingAmount: 720000,
    overdueAmount: 45000
  };

  const paymentHistory = [
    {
      id: 1,
      description: 'Material Supply - Steel & Concrete',
      amount: 250000,
      date: '2024-11-15',
      status: 'Paid',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      description: 'Labor Cost - October',
      amount: 180000,
      date: '2024-11-01',
      status: 'Paid',
      invoice: 'INV-2024-002'
    },
    {
      id: 3,
      description: 'Equipment Rental',
      amount: 75000,
      date: '2024-10-25',
      status: 'Pending',
      invoice: 'INV-2024-003'
    },
    {
      id: 4,
      description: 'Electrical Installation',
      amount: 120000,
      date: '2024-10-20',
      status: 'Overdue',
      invoice: 'INV-2024-004'
    },
    {
      id: 5,
      description: 'Foundation Work',
      amount: 450000,
      date: '2024-10-05',
      status: 'Paid',
      invoice: 'INV-2024-005'
    }
  ];

  const upcomingPayments = [
    {
      description: 'Material Supply - Next Phase',
      amount: 300000,
      dueDate: '2024-12-15',
      priority: 'High'
    },
    {
      description: 'Labor Cost - November',
      amount: 195000,
      dueDate: '2024-12-01',
      priority: 'Medium'
    },
    {
      description: 'Safety Equipment',
      amount: 25000,
      dueDate: '2024-11-30',
      priority: 'Low'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Status</h1>
        <p className="text-gray-600 mt-2">Monitor project budgets, payments, and financial health</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetOverview.totalBudget)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <DollarSign className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetOverview.paidAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetOverview.pendingAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Calendar className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetOverview.overdueAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <TrendingDown className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Utilization</h2>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Budget Used: {formatCurrency(budgetOverview.paidAmount)}</span>
            <span>Remaining: {formatCurrency(budgetOverview.totalBudget - budgetOverview.paidAmount)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(budgetOverview.paidAmount / budgetOverview.totalBudget) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div> */}

      {/* Payment History & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment History */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            {/* <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button> */}
          </div>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    payment.status === 'Paid' ? 'bg-green-100' :
                    payment.status === 'Pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {payment.status === 'Paid' ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <AlertCircle className={`${
                        payment.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                      }`} size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.description}</p>
                    <p className="text-sm text-gray-500">{payment.date} • {payment.invoice}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Payments</h2>
            {/* <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Schedule Payment
            </button> */}
          </div>
          <div className="space-y-4">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payment.description}</p>
                  <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(payment.priority)}`}>
                    {payment.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatus;