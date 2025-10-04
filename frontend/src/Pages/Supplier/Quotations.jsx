import React, { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign, Truck } from 'lucide-react'

// API Configuration
const API_BASE_URL = 'http://localhost:8086/api/v1'

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(' ')

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
    responded: "bg-green-100 text-green-800 border-green-200 shadow-sm",
    rejected: "bg-red-100 text-red-800 border-red-200 shadow-sm",
    expired: "bg-gray-100 text-gray-800 border-gray-200 shadow-sm",
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

const Quotations = () => {
  const [quotations, setQuotations] = useState([])
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [selectedQuotationDetails, setSelectedQuotationDetails] = useState(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [isRejectionDetailsModalOpen, setIsRejectionDetailsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [responseFormData, setResponseFormData] = useState({
    totalAmount: '',
    deliveryTime: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supplierId, setSupplierId] = useState(null)

  // Get supplier ID from localStorage, sessionStorage, or context
  const getSupplierId = () => {
    // Try to get from localStorage first
    let storedSupplierId = localStorage.getItem('supplierId') || sessionStorage.getItem('supplierId')
    
    // Also try common alternative key names
    if (!storedSupplierId) {
      storedSupplierId = localStorage.getItem('userId') || sessionStorage.getItem('userId') ||
                       localStorage.getItem('user_id') || sessionStorage.getItem('user_id')
    }
    
    if (storedSupplierId && storedSupplierId !== 'undefined' && storedSupplierId !== 'null') {
      const parsedId = parseInt(storedSupplierId)
      if (!isNaN(parsedId) && parsedId > 0) {
        console.log(`Found supplier ID: ${parsedId}`)
        return parsedId
      }
    }
    
    // Fallback to default for development
    console.warn('No supplier ID found in storage, using default ID: 1')
    console.log('Checked storage keys: supplierId, userId, user_id in both localStorage and sessionStorage')
    return 1
  }

  // Initialize supplier ID
  useEffect(() => {
    const id = getSupplierId()
    setSupplierId(id)
  }, [])

  // Fetch quotations from backend
  const fetchQuotations = async () => {
    if (!supplierId) {
      console.log('Waiting for supplier ID to be set...')
      return
    }

    try {
      setLoading(true)
      
      // Use supplier-specific endpoint to get quotations for this supplier
      const response = await fetch(`${API_BASE_URL}/supplier/quotations/supplier/${supplierId}`)
      
      if (!response.ok) {
        // If supplier-specific endpoint fails, fallback to general requests endpoint
        console.warn('Supplier-specific endpoint failed, trying general endpoint...')
        const fallbackResponse = await fetch(`${API_BASE_URL}/supplier/quotations/requests`)
        
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`)
        }
        
        const fallbackData = await fallbackResponse.json()
        console.log('Successfully fetched data from fallback endpoint:', fallbackData)
        await processQuotationsData(fallbackData)
        return
      }
      
      const data = await response.json()
      console.log('Successfully fetched supplier-specific data:', data)
      await processQuotationsData(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching quotations:', err)
      
      // Set mock data for development/testing purposes with better error context
      const mockQuotations = [
        {
          id: 1,
          projectName: "Office Building Construction",
          requestedItems: ["Cement (100 bags)", "Steel bars (50 units)", "Bricks (1000 pieces)"],
          date: "2024-01-15",
          status: "PENDING",
          deadline: "2024-01-25",
          description: "Materials needed for foundation work"
        },
        {
          id: 2,
          projectName: "Residential Complex",
          requestedItems: ["Paint (20 gallons)", "Tiles (200 sq ft)", "Windows (10 units)"],
          date: "2024-01-10",
          status: "ACCEPTED",
          deadline: "2024-01-20",
          description: "Finishing materials for apartments"
        }
      ]
      setQuotations(mockQuotations)
      setError(`Backend connection failed: ${err.message}. Showing mock data for development.`)
    } finally {
      setLoading(false)
    }
  }

  // Process quotations data from backend
  const processQuotationsData = async (data) => {
    // Handle the response (data is directly an array from the backend)
    const quotationsArray = Array.isArray(data) ? data : []
    
    // Transform the data to match the expected structure
    const transformedQuotations = quotationsArray.map(quotation => ({
      id: quotation.qId || quotation.id,
      projectName: quotation.projectName || quotation.projectId || `Project ${quotation.qId || quotation.id}`,
      requestedItems: [], // Will be fetched separately
      date: quotation.date || quotation.createdAt,
      status: quotation.status || 'PENDING',
      deadline: quotation.deadline || quotation.dueDate,
      description: quotation.description || '',
      priority: quotation.priority || 'MEDIUM'
    }))
    
    // Fetch items for each quotation that has a valid ID
    for (const quotation of transformedQuotations) {
      if (quotation.id && quotation.id !== undefined && quotation.id !== null) {
        await fetchQuotationItems(quotation.id, quotation)
      } else {
        console.warn('Skipping quotation items fetch for invalid ID:', quotation)
        quotation.requestedItems = ['ID not available - items cannot be loaded']
      }
    }
    
    setQuotations(transformedQuotations)
    setError(null)
  }

  // Fetch quotation items using the correct endpoint
  const fetchQuotationItems = async (quotationId, quotationObj) => {
    // Validate quotationId before making the API call
    if (!quotationId || quotationId === undefined || quotationId === null || quotationId === 'undefined') {
      console.warn('Invalid quotation ID provided to fetchQuotationItems:', quotationId)
      quotationObj.requestedItems = ['Invalid quotation ID - items cannot be loaded']
      return
    }

    try {
      // Use the correct endpoint from SupplierQuotationController
      const response = await fetch(`${API_BASE_URL}/supplier/quotations/${quotationId}/items`)
      
      if (response.ok) {
        const items = await response.json()
        const itemsArray = Array.isArray(items) ? items : (items.items || items.data || [])
        
        if (itemsArray.length > 0) {
          quotationObj.requestedItems = itemsArray.map(item => 
            `${item.name || item.itemName || 'Unknown Item'} (${item.quantity || 0} units - Rs.${item.amount || item.price || 0})`
          )
        } else {
          quotationObj.requestedItems = ['No items found for this quotation']
        }
      } else {
        console.warn(`Failed to fetch items for quotation ${quotationId}:`, response.status, response.statusText)
        quotationObj.requestedItems = [`Items not available (${response.status})`]
      }
    } catch (err) {
      console.error(`Error fetching quotation items for ID ${quotationId}:`, err)
      quotationObj.requestedItems = ['Items not available - network error']
    }
  }

  // Check if quotation has existing response using correct endpoint
  const fetchExistingResponse = async (quotationId) => {
    try {
      // Use the correct endpoint from SupplierQuotationController
      const response = await fetch(`${API_BASE_URL}/supplier/quotations/response/${quotationId}`)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Raw backend response:', responseData)
        
        // Comprehensive field mapping for delivery time/days
        const deliveryTimeFields = [
          'deliveryTime', 'delivery_time', 'deliveryDays', 'delivery_days',
          'DeliveryTime', 'DeliveryDays', 'days', 'Days', 
          'deliveryPeriod', 'delivery_period', 'timeframe'
        ]
        
        // Find delivery time value from any possible field name
        let deliveryTimeValue = null
        for (const field of deliveryTimeFields) {
          if (responseData[field] !== undefined && responseData[field] !== null) {
            deliveryTimeValue = responseData[field]
            console.log(`Found delivery time in field '${field}':`, deliveryTimeValue)
            break
          }
        }
        
        // Comprehensive field mapping for notes
        const notesFields = [
          'notes', 'Notes', 'note', 'Note', 'comments', 'Comments',
          'description', 'Description', 'remarks', 'Remarks',
          'additionalInfo', 'additional_info', 'details', 'Details'
        ]
        
        // Find notes value from any possible field name
        let notesValue = null
        for (const field of notesFields) {
          if (responseData[field] !== undefined && responseData[field] !== null && responseData[field] !== '') {
            notesValue = responseData[field]
            console.log(`Found notes in field '${field}':`, notesValue)
            break
          }
        }
        
        // Create normalized response object
        const normalizedResponse = {
          ...responseData,
          deliveryTime: deliveryTimeValue,
          notes: notesValue,
          totalAmount: responseData.totalAmount || responseData.total_amount || responseData.amount || 0
        }
        
        console.log('Normalized response object:', normalizedResponse)
        console.log('Field mapping results:', {
          deliveryTime: deliveryTimeValue,
          notes: notesValue,
          totalAmount: normalizedResponse.totalAmount,
          allAvailableFields: Object.keys(responseData)
        })
        
        return normalizedResponse
      }
      return null
    } catch (err) {
      console.error('Error fetching existing response:', err)
      return null
    }
  }

  // Submit quotation response using the correct endpoint
  const submitQuotationResponse = async (action) => {
    if (!selectedQuotation) {
      alert('Please select a quotation')
      return
    }

    if (!supplierId) {
      alert('Supplier ID not found. Please log in again.')
      return
    }

    // Validation for different actions
    if (action === 'accept') {
      if (!responseFormData.totalAmount || parseFloat(responseFormData.totalAmount) <= 0) {
        alert('Please enter a valid total amount for submission')
        return
      }
    }

    // Confirm action with user
    const confirmMessage = action === 'accept' 
      ? `Are you sure you want to submit this quotation response with amount Rs.${responseFormData.totalAmount}?`
      : 'Are you sure you want to reject this quotation?'
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    setIsSubmitting(true)
    try {
      const responsePayload = {
        quotationId: selectedQuotation.id,
        supplierId: supplierId,
        totalAmount: parseFloat(responseFormData.totalAmount) || 0,
        deliveryTime: parseInt(responseFormData.deliveryTime) || 0,
        deliveryDays: parseInt(responseFormData.deliveryTime) || 0, // Include both field names
        days: parseInt(responseFormData.deliveryTime) || 0,
        notes: responseFormData.notes || '',
        comments: responseFormData.notes || '', // Include alternative field name
        status: 'SUBMITTED',
        respondDate: new Date().toISOString()
      }

      console.log('Submitting comprehensive response payload:', responsePayload)
      console.log('Form data being processed:', {
        deliveryTime: {
          originalValue: responseFormData.deliveryTime,
          parsedValue: parseInt(responseFormData.deliveryTime) || 0,
          type: typeof (parseInt(responseFormData.deliveryTime) || 0)
        },
        notes: {
          originalValue: responseFormData.notes,
          length: responseFormData.notes?.length || 0,
          hasContent: !!responseFormData.notes
        },
        totalAmount: {
          originalValue: responseFormData.totalAmount,
          parsedValue: parseFloat(responseFormData.totalAmount) || 0
        }
      })

      // Use the correct endpoint from SupplierQuotationController
      const response = await fetch(`${API_BASE_URL}/supplier/quotations/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responsePayload)
      })

      const result = await response.json()
      console.log('Backend response after submission:', result)
      
      if (response.ok) {
        const actionText = action === 'accept' ? 'submitted' : 'rejected'
        alert(`Quotation ${actionText} successfully! The database has been updated.`)
        setIsResponseModalOpen(false)
        setResponseFormData({ totalAmount: '', deliveryTime: '', notes: '' })
        setSelectedQuotation(null)
        setSelectedQuotationDetails(null)
        // Refresh quotations list to show updated status
        await fetchQuotations()
      } else {
        throw new Error(result.error || result.message || `Failed to ${action} quotation`)
      }
    } catch (err) {
      console.error(`Error ${action}ing quotation:`, err)
      alert(`Error ${action}ing quotation: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (supplierId) {
      fetchQuotations()
    }
  }, [supplierId])

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toUpperCase()
    switch (normalizedStatus) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "RESPONDED":
      case "SUBMITTED":
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <XCircle className="h-4 w-4" />
      case "EXPIRED":
      case "CLOSED":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status) => {
    const normalizedStatus = status?.toUpperCase()
    switch (normalizedStatus) {
      case "PENDING":
        return "pending"
      case "ACCEPTED":
      case "RESPONDED":
      case "SUBMITTED":
        return "responded"
      case "REJECTED":
        return "rejected"
      case "EXPIRED":
      case "CLOSED":
        return "expired"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    const normalizedStatus = status?.toUpperCase()
    switch (normalizedStatus) {
      case "PENDING":
        return "Pending Review"
      case "ACCEPTED":
        return "Accepted"
      case "RESPONDED":
      case "SUBMITTED":
        return "Response Sent"
      case "REJECTED":
        return "Rejected"
      case "EXPIRED":
        return "Expired"
      case "CLOSED":
        return "Closed"
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Unknown"
    }
  }

  const handleViewQuotation = async (quotation) => {
    console.log('Opening quotation details for:', quotation)
    setSelectedQuotation(quotation)
    
    try {
      // Check if there's already a response
      const existingResponse = await fetchExistingResponse(quotation.id)
      if (existingResponse) {
        console.log('Existing response data:', existingResponse)
        setSelectedQuotationDetails({ response: existingResponse })
      } else {
        setSelectedQuotationDetails(null)
      }
      
      setIsResponseModalOpen(true)
    } catch (err) {
      console.error('Error fetching quotation details:', err)
      setSelectedQuotationDetails(null)
      setIsResponseModalOpen(true)
    }
  }

  const handleFormChange = (field, value) => {
    setResponseFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FAAD00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Error Banner */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Connection Issue</h4>
              <p className="text-sm text-orange-700">{error}</p>
              <Button 
                onClick={fetchQuotations}
                size="sm"
                className="mt-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Try Reconnecting
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Quotation Requests</h2>
          <p className="text-gray-600 mt-1">Respond to project quotation requests</p>
        </div>
        <Button 
          onClick={fetchQuotations}
          className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white"
        >
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500 hover:border-l-amber-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Requests</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {quotations.filter((q) => q.status?.toUpperCase() === "PENDING").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Responded</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {quotations.filter((q) => {
                const status = q.status?.toUpperCase()
                return status === "ACCEPTED" || status === "RESPONDED" || status === "SUBMITTED"
              }).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Accepted/Responded</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:border-l-red-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Rejected</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {quotations.filter((q) => q.status?.toUpperCase() === "REJECTED").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Declined requests</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Requests</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{quotations.length}</div>
            <p className="text-xs text-gray-600 mt-1">All time requests</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
          <CardTitle className="text-gray-800">Quotation Requests</CardTitle>
          <CardDescription className="text-gray-600">Review and respond to quotation requests from construction projects</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Project Name</TableHead>
                <TableHead className="font-semibold">Requested Items</TableHead>
                <TableHead className="font-semibold">Request Date</TableHead>
                <TableHead className="font-semibold">Deadline</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8 text-gray-500">
                    No quotation requests found
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((quotation) => (
                  <TableRow key={quotation.id} className="hover:bg-gray-50/80 transition-colors">
                    <TableCell className="font-medium text-gray-900">{quotation.projectName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {quotation.requestedItems?.length > 0 ? (
                          quotation.requestedItems.map((item, index) => (
                            <div key={`${quotation.id}-item-${index}`} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                              {item}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 italic">Loading items...</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{quotation.date}</TableCell>
                    <TableCell className="text-gray-700">{quotation.deadline}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(quotation.status)} 
                        className="flex items-center gap-2 w-fit font-medium"
                      >
                        {getStatusIcon(quotation.status)}
                        {getStatusText(quotation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleViewQuotation(quotation)}
                        className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Response Modal for Pending/Responded quotations */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="sm:max-w-[600px] shadow-2xl">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Quotation Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              <span className="font-medium text-[#FAAD00]">{selectedQuotation?.projectName}</span> 
              - View complete quotation details and respond
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {/* Quotation Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Quotation ID
                </Label>
                <div className="p-3 border border-gray-200 rounded-md">
                  <span className="text-sm font-bold text-gray-700">#{selectedQuotation?.id}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Status
                </Label>
                <div className="p-3 border border-gray-200 rounded-md">
                  <Badge variant={getStatusVariant(selectedQuotation?.status)} className="font-medium">
                    {getStatusIcon(selectedQuotation?.status)}
                    {getStatusText(selectedQuotation?.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Project Information</Label>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-600 font-medium">Request Date</span>
                    <p className="text-sm font-semibold text-gray-800">{selectedQuotation?.date || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 font-medium">Deadline</span>
                    <p className="text-sm font-semibold text-gray-800">{selectedQuotation?.deadline || 'Not specified'}</p>
                  </div>
                </div>
                {selectedQuotation?.description && (
                  <div>
                    <span className="text-xs text-gray-600 font-medium">Description</span>
                    <p className="text-sm text-gray-700">{selectedQuotation.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Requested Items */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Requested Items</Label>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                {selectedQuotation?.requestedItems?.length > 0 ? (
                  selectedQuotation.requestedItems.map((item, index) => (
                    <div key={`modal-${selectedQuotation.id}-item-${index}`} className="text-sm text-gray-700 py-2 flex items-center border-b border-gray-200 last:border-b-0">
                      <div className="w-2 h-2 bg-[#FAAD00] rounded-full mr-3 flex-shrink-0"></div>
                      <span className="flex-1">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">No items available</div>
                )}
              </div>
            </div>
            
            {selectedQuotationDetails?.response ? (
              // Show response details for already responded quotations
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">Response Already Submitted</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-green-600 font-medium">Total Amount</span>
                      <p className="text-lg font-bold text-green-700">Rs.{selectedQuotationDetails.response.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-green-600 font-medium">Delivery Time</span>
                      <p className="text-lg font-bold text-green-700">
                        {selectedQuotationDetails.response.deliveryTime ? 
                          `${selectedQuotationDetails.response.deliveryTime} days` : 
                          'Not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {selectedQuotationDetails.response.notes && (
                    <div>
                      <span className="text-xs text-green-600 font-medium">Notes</span>
                      <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                        {selectedQuotationDetails.response.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Show input fields for quotation response
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Quotation Response</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="total-amount" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Total Amount (Rs.)
                      </Label>
                      <Input
                        id="total-amount"
                        type="number"
                        placeholder="Enter total amount"
                        value={responseFormData.totalAmount}
                        onChange={(e) => handleFormChange('totalAmount', e.target.value)}
                        className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        Delivery Days
                      </Label>
                      <Input
                        id="delivery-time"
                        type="number"
                        placeholder="Enter delivery days"
                        value={responseFormData.deliveryTime}
                        onChange={(e) => handleFormChange('deliveryTime', e.target.value)}
                        className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information or terms..."
                      value={responseFormData.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      className="min-h-[80px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsResponseModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            
            {selectedQuotationDetails?.response ? (
              // For already responded quotations - show only Close button
              <Button 
                variant="outline" 
                onClick={() => setIsResponseModalOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </Button>
            ) : (
              // For new quotations - show Reject and Submit buttons
              <>
                <Button
                  onClick={() => submitQuotationResponse('reject')}
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => submitQuotationResponse('accept')}
                  disabled={isSubmitting || (!responseFormData.totalAmount && !responseFormData.notes)}
                  className="bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Details Modal */}
      <Dialog open={isRejectionDetailsModalOpen} onOpenChange={setIsRejectionDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px] shadow-2xl">
          <DialogHeader className="pb-4 border-b border-red-100">
            <DialogTitle className="text-xl font-bold text-red-800 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              Quotation Rejected
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              <span className="font-medium text-red-600">{selectedQuotation?.projectName}</span> - Rejection details and feedback
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {/* Project Details */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Requested Items</Label>
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                {selectedQuotation?.requestedItems?.length > 0 ? (
                  selectedQuotation.requestedItems.map((item, index) => (
                    <div key={`rejection-${selectedQuotation.id}-item-${index}`} className="text-sm text-red-700 py-1 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-red-700">No items available</div>
                )}
              </div>
            </div>

            {/* Rejection Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-600" />
                    Rejection Date
                  </Label>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <span className="text-sm font-medium text-red-700">Information not available</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Rejected By
                  </Label>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <span className="text-sm font-medium text-red-700">Project Manager</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Rejection Reason</Label>
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 font-medium">Quotation was not accepted. Please contact the project manager for more details.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Detailed Feedback</Label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-gray-700 leading-relaxed">Detailed feedback is not available at this time. Please contact the project team for more information.</p>
                </div>
              </div>
            </div>

            {/* Action Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What you can do next:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Review your pricing strategy based on market rates</li>
                <li>• Contact the project manager for clarification</li>
                <li>• Consider submitting a revised quote for future projects</li>
                <li>• Update your market research to stay competitive</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsRejectionDetailsModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsRejectionDetailsModalOpen(false)
                // You can add logic here to open a contact form or redirect to pricing review
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              Contact Project Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Quotations