import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { cn } from '../../Utils/cn'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Option 1: Fetch all orders
      // const response = await axios.get('http://localhost:8086/api/v1/api/supplier/orders')
      
      // Option 2: Fetch orders by supplier ID (if you have supplier ID stored)
      // const supplierId = localStorage.getItem('supplierId')
      // const response = await axios.get(`http://localhost:8086/api/v1/api/supplier/orders/supplier/${supplierId}`)
      
      // Option 3: Fetch orders by project ID (using your working endpoint)
      const projectId = 'PRJ_001' // You can get this from props, localStorage, or state
      const response = await axios.get(`http://localhost:8086/api/v1/api/supplier/orders/project/${projectId}`)
      
      // Debug: Log the response to see the actual structure
      console.log('API Response:', response.data)
      
      // Transform backend data to match frontend structure
      // Check if response.data is an array or if the orders are nested
      const ordersData = Array.isArray(response.data) ? response.data : response.data.orders || []
      
      const transformedOrders = ordersData.map(order => {
        console.log('Order item:', order) // Debug each order
        return {
          id: order.orderId?.toString() || order.id?.toString() || 'N/A',
          project: order.projectName || order.projectId || order.project || 'N/A',
          items: order.items || order.orderItems || [],
          orderDate: order.orderDate || order.createdDate || new Date().toISOString().split('T')[0],
          isUnread: order.status === 'PENDING' || order.isUnread === true || false,
          customerEmail: order.customerEmail || order.email || order.supplierEmail || 'N/A',
          totalValue: order.totalAmount || order.totalValue || order.amount || 0,
        }
      })
      
      console.log('Transformed Orders:', transformedOrders) // Debug transformed data
      setOrders(transformedOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      console.error('Error details:', err.response) // More detailed error logging
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, isUnread: false } : order)))
  }

  const unreadCount = orders.filter((order) => order.isUnread).length

  // Filter orders based on showUnreadOnly state
  const filteredOrders = showUnreadOnly 
    ? orders.filter((order) => order.isUnread)
    : orders

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDialog(true)
    if (order.isUnread) markAsRead(order.id)
  }

  const toggleUnreadFilter = () => {
    setShowUnreadOnly(!showUnreadOnly)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-red-800 font-medium">Error Loading Orders</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only show if not loading */}
      {!loading && (
        <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Material Orders</h2>
          <p className="text-gray-600 mt-1">
            {showUnreadOnly 
              ? "Showing only unread orders" 
              : "Orders received via email from construction projects"
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Show All Button - appears when filtering */}
          {showUnreadOnly && (
            <button
              onClick={toggleUnreadFilter}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="font-medium">Show All</span>
            </button>
          )}
          
          {/* Unread Filter Button */}
          <button
            onClick={toggleUnreadFilter}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
              showUnreadOnly
                ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">
              {showUnreadOnly ? `${unreadCount} Unread (Filtered)` : `${unreadCount} Unread`}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showUnreadOnly ? "Filtered Orders" : "Total Orders"}
              </p>
              <p className="text-2xl font-bold text-yellow-600">{filteredOrders.length}</p>
            </div>
            <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Orders</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredOrders.filter((order) => order.orderDate === "2024-01-16").length}
              </p>
            </div>
            <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">
                Rs.{filteredOrders.reduce((sum, order) => sum + order.totalValue, 0).toLocaleString()}
              </p>
            </div>
            <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div> */}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {showUnreadOnly ? "Unread Orders" : "Recent Orders"}
              </h3>
              <p className="text-sm text-gray-600">
                {showUnreadOnly 
                  ? `Showing ${filteredOrders.length} unread orders`
                  : "Material orders received from construction projects"
                }
              </p>
            </div>
            {showUnreadOnly && (
              <div className="flex items-center gap-2 text-red-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Filtered View</span>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={cn("hover:bg-gray-50", order.isUnread && "bg-red-50")}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                        {order.isUnread && <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.project}</td>
                    {/* <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-gray-500">+{order.items.length - 2} more items</div>
                        )}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs.{order.totalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full",
                        order.isUnread 
                          ? "bg-red-100 text-red-800 border border-red-200" 
                          : "bg-green-100 text-green-800 border border-green-200"
                      )}>
                        {order.isUnread && (
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        )}
                        {!order.isUnread && (
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {order.isUnread ? "Unread" : "Read"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-gray-500">
                          {showUnreadOnly 
                            ? "No unread orders at the moment. All orders have been read!"
                            : "No orders available."
                          }
                        </p>
                      </div>
                      {showUnreadOnly && (
                        <button
                          onClick={toggleUnreadFilter}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          Show All Orders
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Order Details - {selectedOrder.id}</h3>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full",
                      selectedOrder.isUnread 
                        ? "bg-red-100 text-red-800 border border-red-200" 
                        : "bg-green-100 text-green-800 border border-green-200"
                    )}>
                      {selectedOrder.isUnread && (
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                      {!selectedOrder.isUnread && (
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {selectedOrder.isUnread ? "Unread" : "Read"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Complete order information from {selectedOrder.project}</p>
                </div>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Project Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Project:</span> 
                      <span className="text-gray-600 ml-1">{selectedOrder.project}</span>
                    </p>
                    {/* <p className="text-sm">
                      <span className="font-medium text-gray-700">Email:</span> 
                      <span className="text-gray-600 ml-1">{selectedOrder.customerEmail}</span>
                    </p> */}
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Date:</span> 
                      <span className="text-gray-600 ml-1">{selectedOrder.orderDate}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Total Items:</span> 
                      <span className="text-gray-600 ml-1">{selectedOrder.items.length}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Total Value:</span> 
                      <span className="text-gray-600 ml-1">Rs.{selectedOrder.totalValue.toLocaleString()}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Status:</span> 
                      <span className={cn(
                        "ml-1 px-2 py-1 text-xs font-semibold rounded-full",
                        selectedOrder.isUnread 
                          ? "bg-red-100 text-red-800" 
                          : "bg-green-100 text-green-800"
                      )}>
                        {selectedOrder.isUnread ? "Unread" : "Read"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Requested Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-l-blue-200">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full",
                  selectedOrder.isUnread 
                    ? "bg-red-100 text-red-800 border border-red-200" 
                    : "bg-green-100 text-green-800 border border-green-200"
                )}>
                  {selectedOrder.isUnread && (
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                  {!selectedOrder.isUnread && (
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  Order Status: {selectedOrder.isUnread ? "Unread" : "Read"}
                </span>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  )
}

export default Orders
