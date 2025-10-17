import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Truck, Clock, CheckCircle, Package } from 'lucide-react'
import { cn } from '../../Utils/cn'

// API Base URL
const API_BASE_URL = 'http://localhost:8086/api/v1'

// Custom Button Component
const Button = ({ children, variant = "default", size = "default", className, disabled, onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:shadow-md"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Custom Card Components
const Card = ({ children, className, ...props }) => (
  <div className={cn("rounded-lg border-gray-200 border bg-white text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200", className)} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
)

const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
)

// Custom Table Components
const Table = ({ children, className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
      {children}
    </table>
  </div>
)

const TableHeader = ({ children, className, ...props }) => (
  <thead className={cn("[&_tr]:border-b border-gray-200 bg-gray-50", className)} {...props}>
    {children}
  </thead>
)

const TableBody = ({ children, className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0 divide-y divide-gray-200", className)} {...props}>
    {children}
  </tbody>
)

const TableRow = ({ children, className, ...props }) => (
  <tr className={cn("border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-muted", className)} {...props}>
    {children}
  </tr>
)

const TableHead = ({ children, className, ...props }) => (
  <th className={cn("h-12 px-4 text-left align-middle font-semibold text-gray-700 [&:has([role=checkbox])]:pr-0", className)} {...props}>
    {children}
  </th>
)

const TableCell = ({ children, className, ...props }) => (
  <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props}>
    {children}
  </td>
)

// Enhanced Badge Component with better styling
const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm",
    secondary: "bg-gray-100 text-gray-800 border-gray-200 shadow-sm",
    outline: "bg-yellow-50 text-yellow-900 border-yellow-300 shadow-sm",
  }
  
  return (
    <div className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-md", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch deliveries from backend
  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch orders by project ID
      const projectId = localStorage.getItem('projectId') || 'PRJ_001' // Get from localStorage or use default
      const response = await axios.get(`${API_BASE_URL}/api/supplier/orders/project/${projectId}`)
      
      console.log('API Response:', response.data)
      
      // Transform backend data to match frontend structure
      const ordersData = Array.isArray(response.data.orders) ? response.data.orders : [];
      const projectName = response.data.project?.name || 'N/A';

      const transformedDeliveries = ordersData.map((order) => {
        // Map numeric status values from backend
        // 0 = PENDING, 1 = IN_TRANSIT, 2 = DELIVERED
        let deliveryStatus = 'pending';

        if (order.orderStatus === 2) {
          deliveryStatus = 'delivered';
        } else if (order.orderStatus === 1) {
          deliveryStatus = 'in-transit';
        } else {
          deliveryStatus = 'pending'; // orderStatus = 0 or any other value
        }

        return {
          id: order.orderId?.toString() || order.id?.toString() || 'N/A',
          projectName: projectName, // Use project name from response
          projectId: order.projectId || 'N/A',
          orderDate: order.orderDate || new Date().toISOString().split('T')[0],
          estimatedDelivery: order.expectedDeliveryDate || order.estimatedDelivery || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: deliveryStatus,
          deliveredDate: order.deliveredDate || (deliveryStatus === 'delivered' ? order.orderDate : null),
          items: order.items || order.orderItems || [],
          totalValue: order.totalAmount || order.totalValue || 0,
        };
      });

      console.log('Transformed Deliveries:', transformedDeliveries);
      setDeliveries(transformedDeliveries);
    } catch (err) {
      console.error('Error fetching deliveries:', err)
      console.error('Error details:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch deliveries')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in-transit":
        return "default"
      case "delivered":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Preparing"
      case "in-transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const handleConfirmDelivery = async (delivery) => {
    // Show confirmation popup
    const confirmed = window.confirm(`Are you sure you want to confirm delivery for Order ${delivery.id}?`)
    
    if (!confirmed) {
      return // User cancelled
    }

    try {
      setLoading(true)
      setError(null)
      
      // Update delivery status in the database
      // Send orderStatus as 2 (DELIVERED) based on the backend enum
      await axios.put(`${API_BASE_URL}/api/supplier/orders/${delivery.id}/status`, {
        orderStatus: 2 // 2 = DELIVERED (0=PENDING, 1=IN_TRANSIT, 2=DELIVERED)
      })
      
      // Refetch data from backend to get updated status
      await fetchDeliveries()
      
      // Show success message
      alert('Delivery confirmed successfully!')
      console.log('Delivery confirmed successfully for order:', delivery.id)
    } catch (err) {
      console.error('Error confirming delivery:', err)
      console.error('Error details:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to confirm delivery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const pendingCount = deliveries.filter((d) => d.status === "pending").length
  const inTransitCount = deliveries.filter((d) => d.status === "in-transit").length
  const deliveredCount = deliveries.filter((d) => d.status === "delivered").length

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Delivery Confirmation</h2>
          <p className="text-gray-600 mt-1">Track and confirm material deliveries</p>
        </div>
        <Button
          onClick={fetchDeliveries}
          variant="outline"
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAAD00]"></div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500 hover:border-l-amber-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {pendingCount}
            </div>
            <p className="text-xs text-gray-600 mt-1">Being prepared</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-400 hover:border-l-yellow-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">In Transit</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Truck className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inTransitCount}
            </div>
            <p className="text-xs text-gray-600 mt-1">On the way</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-600 hover:border-l-yellow-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            
            <CardTitle className="text-sm font-medium text-gray-700">Delivered</CardTitle>
            <div className="p-2 bg-yellow-200 rounded-full">
              <CheckCircle className="h-4 w-4 text-yellow-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">
              {deliveredCount}
            </div>
            <p className="text-xs text-gray-600 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:border-l-purple-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{deliveries.length}</div>
            <p className="text-xs text-gray-600 mt-1">All time orders</p>
          </CardContent>
        </Card>
      </div>

      {!loading && (
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-gray-800">Delivery Status</CardTitle>
            <CardDescription className="text-gray-600">Track the delivery status of all orders and confirm deliveries</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {deliveries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="h-16 w-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No deliveries found</p>
                <p className="text-sm">Orders will appear here when available</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Project Name</TableHead>
                    {/* <TableHead className="font-semibold">Items</TableHead> */}
                    <TableHead className="font-semibold">Order Date</TableHead>
                    <TableHead className="font-semibold">Est. Delivery</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                <TableRow key={delivery.id} className="hover:bg-gray-50/80 transition-colors">
                  <TableCell className="font-medium text-gray-900">{delivery.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{delivery.projectName}</TableCell>
                  {/* <TableCell>
                    <div className="space-y-1">
                      {delivery.items && delivery.items.length > 0 ? (
                        <>
                          {delivery.items.slice(0, 2).map((item, index) => {
                            // Handle both string items and object items
                            const itemText = typeof item === 'string' 
                              ? item 
                              : `${item.materialName || item.name || 'Item'} (${item.quantity || 0} ${item.unit || 'units'})`
                            
                            return (
                              <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                {itemText}
                              </div>
                            )
                          })}
                          {delivery.items.length > 2 && (
                            <div className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                              +{delivery.items.length - 2} more
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-gray-400 italic">No items</div>
                      )}
                    </div>
                  </TableCell> */}
                  <TableCell className="text-gray-700">{delivery.orderDate}</TableCell>
                  <TableCell className="text-gray-700">
                    {delivery.status === "delivered" ? delivery.deliveredDate : delivery.estimatedDelivery}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(delivery.status)} 
                      className="flex items-center gap-2 w-fit font-medium"
                    >
                      {getStatusIcon(delivery.status)}
                      {getStatusText(delivery.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {delivery.status !== "delivered" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleConfirmDelivery(delivery)}
                        className={cn(
                          "transition-all duration-200 font-medium",
                          "bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg"
                        )}
                      >
                        Confirm Delivery
                      </Button>
                    ) : (
                      <Badge 
                        variant="outline" 
                        className="bg-yellow-50 text-yellow-900 border-yellow-300 hover:bg-yellow-100"
                      >
                        Completed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Delivery
