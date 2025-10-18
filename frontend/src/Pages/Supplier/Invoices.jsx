import React, { useState, useEffect } from 'react'
import { FileText, Send, Plus, Clock, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign, Package } from 'lucide-react'
import { cn } from '../../Utils/cn'

// Custom Button Component
const Button = ({ children, variant = "default", size = "default", className, disabled, onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:shadow-md"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
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

// Enhanced Badge Component
const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800 border-blue-200 shadow-sm",
    pending: "bg-amber-100 text-amber-800 border-amber-200 shadow-sm animate-pulse",
    approved: "bg-green-100 text-green-800 border-green-200 shadow-sm",
    rejected: "bg-red-100 text-red-800 border-red-200 shadow-sm",
    delivered: "bg-green-100 text-green-800 border-green-200 shadow-sm",
    outline: "bg-white border-gray-200 text-gray-700 shadow-sm",
  }
  
  return (
    <div className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-md", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

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

// Custom Select Components
const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAAD00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none"
      >
        <option value="">Choose an order to invoice</option>
        {children}
      </select>
    </div>
  )
}

const SelectItem = ({ children, value }) => (
  <option value={value}>{children}</option>
)

// Custom Alert Component
const Alert = ({ children, className, ...props }) => (
  <div className={cn("relative w-full rounded-lg border border-amber-200 bg-amber-50 p-4", className)} {...props}>
    {children}
  </div>
)

const AlertDescription = ({ children, className, ...props }) => (
  <div className={cn("text-sm text-amber-800", className)} {...props}>
    {children}
  </div>
)

const Invoices = () => {
  const [pendingOrders, setPendingOrders] = useState([])
  const [submittedInvoices, setSubmittedInvoices] = useState([])
  const [selectedOrder, setSelectedOrder] = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submittingInvoice, setSubmittingInvoice] = useState(false)

  // Fetch pending orders (delivered orders without invoices)
  useEffect(() => {
    const fetchPendingOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch supplier orders with delivered status
        const response = await fetch('http://localhost:8086/api/v1/api/supplier/orders')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        console.log('Fetched orders:', data)

        // Filter orders that are delivered and don't have invoices yet
        const deliveredOrders = data
          .filter(order => order.status === 'delivered' || order.orderStatus === 'delivered')
          .map(order => ({
            id: order.orderId || order.id,
            project: order.projectName || order.project || 'Unknown Project',
            amount: order.totalAmount || order.amount || 0,
            deliveryDate: order.deliveryDate || order.orderDate || new Date().toISOString().split('T')[0],
            status: order.status || order.orderStatus || 'delivered',
          }))

        setPendingOrders(deliveredOrders)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching pending orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingOrders()
  }, [])

  // Fetch submitted invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Try to fetch invoices - if endpoint doesn't exist yet, just use empty array
        const response = await fetch('http://localhost:8086/api/v1/api/supplier/invoice')

        // If endpoint returns error or doesn't exist, just set empty array
        if (!response.ok) {
          console.warn('Invoices endpoint not available yet, using empty list')
          setSubmittedInvoices([])
          return
        }

        const data = await response.json()
        console.log('Fetched invoices:', data)

        // Handle both array and object responses
        let invoicesArray = []
        if (Array.isArray(data)) {
          invoicesArray = data
        } else if (data && typeof data === 'object') {
          if (data.invoices) {
            invoicesArray = data.invoices
          } else if (data.data) {
            invoicesArray = data.data
          } else {
            invoicesArray = [data]
          }
        }

        // Map backend data to frontend format
        const mappedInvoices = invoicesArray.map(invoice => ({
          id: invoice.invoiceId || invoice.id,
          orderId: invoice.orderId || 'N/A',
          project: invoice.projectName || invoice.project || 'Unknown Project',
          amount: invoice.amount || invoice.totalAmount || 0,
          submissionDate: invoice.submissionDate || invoice.createdDate || new Date().toISOString().split('T')[0],
          status: invoice.status || 'pending',
        }))

        setSubmittedInvoices(mappedInvoices)
      } catch (err) {
        // Don't show error for invoices - just log it and use empty array
        console.warn('Could not fetch invoices (endpoint may not be ready):', err.message)
        setSubmittedInvoices([])
      }
    }

    fetchInvoices()
  }, [])

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmitInvoice = async () => {
    if (!selectedOrder || !invoiceAmount || !uploadedFile) {
      alert('Please fill all required fields')
      return
    }

    const order = pendingOrders.find((o) => o.id === selectedOrder)
    if (!order) {
      alert('Order not found')
      return
    }

    setSubmittingInvoice(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('orderId', selectedOrder)
      formData.append('amount', invoiceAmount)
      formData.append('description', description)
      formData.append('file', uploadedFile)
      formData.append('projectName', order.project)

      // Submit invoice to backend
      const response = await fetch('http://localhost:8086/api/v1/api/supplier/invoice/create', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit invoice')
      }

      const newInvoice = await response.json()
      console.log('Invoice created:', newInvoice)

      // Map the response to match our frontend format
      const mappedInvoice = {
        id: newInvoice.invoiceId || newInvoice.id,
        orderId: newInvoice.orderId || selectedOrder,
        project: newInvoice.projectName || order.project,
        amount: newInvoice.amount || Number.parseFloat(invoiceAmount),
        submissionDate: newInvoice.submissionDate || new Date().toISOString().split("T")[0],
        status: newInvoice.status || "pending",
      }

      // Update state
      setSubmittedInvoices([mappedInvoice, ...submittedInvoices])
      setPendingOrders(pendingOrders.filter((o) => o.id !== selectedOrder))

      // Reset form
      setSelectedOrder("")
      setInvoiceAmount("")
      setDescription("")
      setUploadedFile(null)

      alert('Invoice submitted successfully!')
    } catch (err) {
      console.error('Error submitting invoice:', err)
      alert(`Failed to submit invoice: ${err.message}`)
    } finally {
      setSubmittingInvoice(false)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "pending"
      case "approved":
        return "approved"
      case "rejected":
        return "rejected"
      case "delivered":
        return "delivered"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAAD00]"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading invoice data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Invoice Submission</h2>
          <p className="text-gray-600 mt-1">Submit invoices for completed deliveries</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500 hover:border-l-amber-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Orders</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Package className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {pendingOrders.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Ready for invoicing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Invoices</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {submittedInvoices.filter((i) => i.status === "pending").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Approved</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {submittedInvoices.filter((i) => i.status === "approved").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Successfully approved</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:border-l-purple-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              Rs.{submittedInvoices.filter((i) => i.status === "approved").reduce((sum, invoice) => sum + invoice.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">From approved invoices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice Submission Form */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Plus className="h-5 w-5 text-[#FAAD00]" />
              Submit New Invoice
            </CardTitle>
            <CardDescription className="text-gray-600">Create and submit an invoice for a completed order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-select" className="text-sm font-semibold text-gray-700">Select Order</Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                {pendingOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.id} - {order.project} (Rs.{order.amount.toLocaleString()})
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice-amount" className="text-sm font-semibold text-gray-700">Invoice Amount (Rs.)</Label>
              <Input
                id="invoice-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="focus:border-[#FAAD00] focus:ring-[#FAAD00]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
              <Textarea
                id="description"
                placeholder="Invoice description or additional notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] focus:border-[#FAAD00] focus:ring-[#FAAD00] resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice-file" className="text-sm font-semibold text-gray-700">Invoice File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="invoice-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 focus:border-[#FAAD00] focus:ring-[#FAAD00]"
                />
                {uploadedFile && (
                  <Badge variant="outline" className="flex items-center gap-1 border-[#FAAD00] text-[#FAAD00] bg-[#FAAD00]/10">
                    <FileText className="h-3 w-3" />
                    {uploadedFile.name}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
            </div>
            
            {pendingOrders.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No pending orders available for invoicing. Complete some deliveries first.
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              onClick={handleSubmitInvoice}
              disabled={!selectedOrder || !invoiceAmount || !uploadedFile || submittingInvoice}
              className="w-full bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              {submittingInvoice ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Invoice
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-gray-800">Orders Ready for Invoicing</CardTitle>
            <CardDescription className="text-gray-600">Completed deliveries that need invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#FAAD00]/50 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.project}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          Delivered: {order.deliveryDate}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-lg text-gray-900">Rs.{order.amount.toLocaleString()}</p>
                        <Badge variant="delivered" className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-12 w-12 opacity-50" />
                </div>
                <p className="font-medium mb-2">No orders ready for invoicing</p>
                <p className="text-sm">Complete some deliveries to see them here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submitted Invoices */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
          <CardTitle className="text-gray-800">Submitted Invoices</CardTitle>
          <CardDescription className="text-gray-600">Track the status of your submitted invoices</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Invoice ID</TableHead>
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Submission Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submittedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50/80 transition-colors">
                  <TableCell className="font-medium text-gray-900">{invoice.id}</TableCell>
                  <TableCell className="text-gray-700">{invoice.orderId}</TableCell>
                  <TableCell className="text-gray-700">{invoice.project}</TableCell>
                  <TableCell className="font-semibold text-gray-900">Rs.{invoice.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-700">{invoice.submissionDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(invoice.status)} 
                      className="flex items-center gap-2 w-fit font-medium"
                    >
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {submittedInvoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-12 w-12 opacity-50" />
              </div>
              <p className="font-medium mb-2">No invoices submitted yet</p>
              <p className="text-sm">Submit your first invoice above to track its status</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Invoices
