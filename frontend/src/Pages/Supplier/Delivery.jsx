import React, { useState } from 'react'
import { Truck, Clock, CheckCircle, Package } from 'lucide-react'
import { cn } from '../../Utils/cn'

const mockDeliveries = [
  {
    id: "ORD-001",
    project: "Downtown Office Complex",
    items: ["Portland Cement (50 bags)", "Steel Rebar 12mm (2 tons)"],
    orderDate: "2024-01-16",
    status: "pending",
    estimatedDelivery: "2024-01-18",
    totalValue: 2150.0,
  },
  {
    id: "ORD-002",
    project: "Residential Tower Phase 2",
    items: ["Concrete Blocks (300 pieces)", "Sand (15 cubic meters)"],
    orderDate: "2024-01-15",
    status: "in-transit",
    estimatedDelivery: "2024-01-17",
    totalValue: 1500.0,
  },
  {
    id: "ORD-003",
    project: "Highway Bridge Construction",
    items: ["Steel Rebar 16mm (8 tons)", "Portland Cement (150 bags)"],
    orderDate: "2024-01-14",
    status: "delivered",
    estimatedDelivery: "2024-01-16",
    deliveredDate: "2024-01-16",
    totalValue: 8750.0,
  },
  {
    id: "ORD-004",
    project: "Shopping Mall Extension",
    items: ["Concrete Blocks (200 pieces)", "Portland Cement (75 bags)"],
    orderDate: "2024-01-13",
    status: "in-transit",
    estimatedDelivery: "2024-01-17",
    totalValue: 1875.0,
  },
  {
    id: "ORD-005",
    project: "School Building Renovation",
    items: ["Sand (10 cubic meters)", "Concrete Blocks (150 pieces)"],
    orderDate: "2024-01-12",
    status: "delivered",
    estimatedDelivery: "2024-01-15",
    deliveredDate: "2024-01-15",
    totalValue: 862.5,
  },
]

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

// Custom Dialog Components
const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 animate-in fade-in-0 zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className, ...props }) => (
  <div className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-xl duration-200 sm:rounded-lg", className)} {...props}>
    {children}
  </div>
)

const DialogHeader = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className, ...props }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-gray-600", className)} {...props}>
    {children}
  </p>
)

const DialogFooter = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}>
    {children}
  </div>
)

// Custom Form Components
const Label = ({ children, className, htmlFor, ...props }) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} htmlFor={htmlFor} {...props}>
    {children}
  </label>
)

const Input = ({ className, type = "text", ...props }) => (
  <input
    type={type}
    className={cn("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAAD00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200", className)}
    {...props}
  />
)

const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAAD00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200", className)}
    {...props}
  />
)

const Delivery = () => {
  const [deliveries, setDeliveries] = useState(mockDeliveries)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

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

  const confirmDelivery = (orderId) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === orderId
          ? { ...delivery, status: "delivered", deliveredDate: new Date().toISOString().split("T")[0] }
          : delivery,
      ),
    )
    setIsConfirmModalOpen(false)
  }

  const handleConfirmDelivery = (delivery) => {
    setSelectedDelivery(delivery)
    setIsConfirmModalOpen(true)
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
      </div>

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

      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
          <CardTitle className="text-gray-800">Delivery Status</CardTitle>
          <CardDescription className="text-gray-600">Track the delivery status of all orders and confirm deliveries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Items</TableHead>
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
                  <TableCell className="font-medium text-gray-900">{delivery.project}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {delivery.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          {item}
                        </div>
                      ))}
                      {delivery.items.length > 2 && (
                        <div className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          +{delivery.items.length - 2} more
                        </div>
                      )}
                    </div>
                  </TableCell>
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
                    {delivery.status === "in-transit" && (
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
                    )}
                    {delivery.status === "delivered" && (
                      <Badge 
                        variant="outline" 
                        className="bg-yellow-50 text-yellow-900 border-yellow-300 hover:bg-yellow-100"
                      >
                        Completed
                      </Badge>
                    )}
                    {delivery.status === "pending" && (
                      <Badge 
                        variant="secondary"
                        className="bg-gray-50 text-gray-700 border-gray-200"
                      >
                        Preparing
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delivery Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[600px] shadow-2xl">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Confirm Delivery
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Confirm that the materials have been delivered to{" "}
              <span className="font-medium text-[#FAAD00]">{selectedDelivery?.project}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Order Details</Label>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900">{selectedDelivery?.id}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedDelivery?.project}</p>
                <div className="mt-3 space-y-2">
                  {selectedDelivery?.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-700 py-1 flex items-center">
                      <div className="w-2 h-2 bg-[#FAAD00] rounded-full mr-3"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-date" className="text-sm font-semibold text-gray-700">Delivery Date</Label>
              <Input
                id="delivery-date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-notes" className="text-sm font-semibold text-gray-700">Delivery Notes (Optional)</Label>
              <Textarea
                id="delivery-notes"
                placeholder="Any notes about the delivery..."
                className="min-h-[100px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 resize-none"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDelivery(selectedDelivery?.id)}
              className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Delivery
