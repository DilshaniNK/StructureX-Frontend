import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../Utils/cn'
import { 
  Package,
  FileText,
  Truck,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Plus,
  Send,
  Calendar,
  AlertCircle,
  X
} from "lucide-react"

// Mock data
const recentOrders = [
  {
    id: "ORD-001",
    project: "Downtown Office Complex",
    amount: 2150.0,
    status: "pending",
    date: "2024-01-16",
  },
  {
    id: "ORD-002",
    project: "Residential Tower Phase 2",
    amount: 1500.0,
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    project: "Highway Bridge Construction",
    amount: 8750.0,
    status: "paid",
    date: "2024-01-14",
  },
]

const recentQuotations = [
  {
    id: 1,
    project: "Shopping Mall Extension",
    items: ["Portland Cement (75 bags)", "Steel Rebar 12mm (3 tons)"],
    deadline: "2024-01-20",
    status: "pending",
  },
  {
    id: 2,
    project: "Medical Center Expansion",
    items: ["Concrete Blocks (200 pieces)", "Sand (15 cubic meters)"],
    deadline: "2024-01-18",
    status: "pending",
  },
]

const mockPendingOrders = [
  {
    id: "ORD-001",
    project: "Downtown Office Complex",
    amount: 2150.0,
    deliveryDate: "2024-01-16",
    status: "delivered",
  },
  {
    id: "ORD-004",
    project: "Shopping Mall Extension",
    amount: 1875.0,
    deliveryDate: "2024-01-17",
    status: "delivered",
  },
]

// Mock Products Context
const useProducts = () => {
  const [products, setProducts] = useState([])
  
  const addProduct = (product) => {
    const newProduct = {
      id: Date.now().toString(),
      ...product,
      unitPrice: parseFloat(product.unitPrice),
      stock: parseInt(product.stock)
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }
  
  return { products, addProduct }
}

const Dashboard = ({ setActiveSection }) => {
  const navigate = useNavigate()
  const { addProduct } = useProducts()
  const [supplierData, setSupplierData] = useState(null)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isSubmitInvoiceModalOpen, setIsSubmitInvoiceModalOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  // New state variables
  const [isQuotationResponseModalOpen, setIsQuotationResponseModalOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [quotationResponse, setQuotationResponse] = useState({
    items: [],
    totalAmount: '',
    deliveryDate: '',
    notes: ''
  })
  
  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    unitPrice: '',
    stock: '',
    unit: 'pieces'
  })

  // Invoice Form State
  const [selectedOrder, setSelectedOrder] = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)

  useEffect(() => {
    // Mock supplier data since localStorage is not available
    const mockSupplierData = {
      name: "ABC Construction Supplies",
      companyName: "ABC Construction Supplies",
      firstName: "John",
      username: "john_supplier"
    }
    setSupplierData(mockSupplierData)
  }, [])

  // Show success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
        setSuccessMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSupplierName = () => {
    if (!supplierData) return 'Supplier'
    
    return supplierData.name || 
           supplierData.companyName || 
           supplierData.firstName || 
           supplierData.username || 
           'Supplier'
  }

  // Handle Add Product
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.unitPrice && newProduct.stock) {
      const addedProduct = addProduct(newProduct)
      
      setSuccessMessage(`Product "${addedProduct.name}" has been added successfully to your catalogue!`)
      setShowSuccessMessage(true)
      
      setNewProduct({ name: '', category: '', unitPrice: '', stock: '', unit: 'pieces' })
      setIsAddProductModalOpen(false)
    }
  }

  // Handle Submit Invoice
  const handleSubmitInvoice = () => {
    if (!selectedOrder || !invoiceAmount || !uploadedFile) {
      return
    }

    const order = mockPendingOrders.find(o => o.id === selectedOrder)
    setSuccessMessage(`Invoice for ${order?.project || selectedOrder} has been submitted successfully!`)
    setShowSuccessMessage(true)

    setSelectedOrder("")
    setInvoiceAmount("")
    setDescription("")
    setUploadedFile(null)
    setIsSubmitInvoiceModalOpen(false)
  }

  // New handler functions for quotation response
  const handleQuotationRespond = (quotation) => {
    setSelectedQuotation(quotation)
    setQuotationResponse({
      items: quotation.items.map(item => ({ name: item, price: '', quantity: '' })),
      totalAmount: '',
      deliveryDate: '',
      notes: ''
    })
    setIsQuotationResponseModalOpen(true)
  }

  const handleSubmitQuotationResponse = () => {
    if (!quotationResponse.totalAmount || !quotationResponse.deliveryDate) {
      return
    }

    setSuccessMessage(`Quotation response for "${selectedQuotation?.project}" has been submitted successfully!`)
    setShowSuccessMessage(true)
    
    setIsQuotationResponseModalOpen(false)
    setSelectedQuotation(null)
    setQuotationResponse({ items: [], totalAmount: '', deliveryDate: '', notes: '' })
  }

  const closeQuotationResponseModal = () => {
    setIsQuotationResponseModalOpen(false)
    setSelectedQuotation(null)
    setQuotationResponse({ items: [], totalAmount: '', deliveryDate: '', notes: '' })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setIsAddProductModalOpen(false)
      setIsSubmitInvoiceModalOpen(false)
      setIsQuotationResponseModalOpen(false)
    }
  }

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false)
    setNewProduct({ name: '', category: '', unitPrice: '', stock: '', unit: 'pieces' })
  }

  const closeInvoiceModal = () => {
    setIsSubmitInvoiceModalOpen(false)
    setSelectedOrder("")
    setInvoiceAmount("")
    setDescription("")
    setUploadedFile(null)
  }

  // UI Components
  const Card = ({ children, className = "" }) => (
    <div className={cn("bg-white rounded-lg shadow-md border border-gray-200", className)}>
      {children}
    </div>
  )

  const CardHeader = ({ children, className = "" }) => (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  )

  const CardContent = ({ children, className = "" }) => (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  )

  const CardTitle = ({ children, className = "" }) => (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  )

  const CardDescription = ({ children, className = "" }) => (
    <p className={cn("text-sm text-gray-600 mt-1", className)}>
      {children}
    </p>
  )

  const Button = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    const variants = {
      primary: "bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white focus:ring-[#FAAD00]",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500"
    }
    
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }

    const disabledStyles = "opacity-50 cursor-not-allowed"

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses, 
          variants[variant], 
          sizes[size], 
          disabled ? disabledStyles : "",
          className
        )}
      >
        {children}
      </button>
    )
  }

  const Badge = ({ children, className = "" }) => (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
      {children}
    </span>
  )

  const Input = ({ className = "", type = "text", ...props }) => (
    <input
      type={type}
      className={cn("w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent", className)}
      {...props}
    />
  )

  const Textarea = ({ className = "", ...props }) => (
    <textarea
      className={cn("w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent resize-none", className)}
      {...props}
    />
  )

  const Select = ({ children, value, onChange, className = "", ...props }) => (
    <select
      value={value}
      onChange={onChange}
      className={cn("w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent", className)}
      {...props}
    >
      {children}
    </select>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{successMessage}</span>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="ml-2 text-green-700 hover:text-green-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-2xl p-6 border border-[#FAAD00]/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back, {getSupplierName()}! 👋
              </h1>
              <p className="text-gray-600">Here's what's happening with your construction material supplies today.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-[#FAAD00]/20 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-[#FAAD00]" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-[#FAAD00] hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Orders</CardTitle>
              <Truck className="h-4 w-4 text-[#FAAD00]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FAAD00]">5</div>
              <p className="text-xs text-gray-500">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-xs text-gray-500">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$45,280</div>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-xs text-gray-500">Across 8 clients</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FAAD00]" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts to help you manage your business efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                onClick={() => setIsAddProductModalOpen(true)}
                className="h-auto p-4 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white flex flex-col items-center gap-2"
              >
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Button>
              <Button
                onClick={() => navigate('/supplier/quotations')}
                variant="outline"
                className="h-auto p-4 border-[#FAAD00] text-[#FAAD00] hover:bg-[#FAAD00]/10 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>View Quotations</span>
              </Button>
              <Button
                onClick={() => navigate('/supplier/orders')}
                variant="outline"
                className="h-auto p-4 border-blue-500 text-blue-600 hover:bg-blue-50 flex flex-col items-center gap-2"
              >
                <Truck className="h-6 w-6" />
                <span>Check Orders</span>
              </Button>
              <Button
                onClick={() => setIsSubmitInvoiceModalOpen(true)}
                variant="outline"
                className="h-auto p-4 border-green-500 text-green-600 hover:bg-green-50 flex flex-col items-center gap-2"
              >
                <CreditCard className="h-6 w-6" />
                <span>Submit Invoice</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#FAAD00]" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Latest material orders from construction projects</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/supplier/quotations')}
                  className="text-[#FAAD00] hover:text-[#FAAD00]/80"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.project}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">${order.amount.toLocaleString()}</p>
                      <Badge className={`${getStatusColor(order.status)} text-xs`}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Quotations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Pending Quotations
                  </CardTitle>
                  <CardDescription>Quotation requests awaiting your response</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/supplier/invoices')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuotations.map((quotation) => (
                  <div key={quotation.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-800">{quotation.project}</p>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      {quotation.items.slice(0, 2).map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          • {item}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Deadline: {quotation.deadline}</p>
                      <Button
                        size="sm"
                        className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white"
                        onClick={() => handleQuotationRespond(quotation)}
                      >
                        Respond
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Modal */}
        {isAddProductModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleModalClose}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                  <p className="text-sm text-gray-600">Add a new product to your catalogue</p>
                </div>
                <button
                  onClick={closeAddProductModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <Input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <Select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel</option>
                    <option value="Blocks">Blocks</option>
                    <option value="Aggregates">Aggregates</option>
                    <option value="Tools">Tools</option>
                    <option value="Hardware">Hardware</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({...newProduct, unitPrice: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <Input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <Select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <option value="pieces">Pieces</option>
                    <option value="bags">Bags</option>
                    <option value="tons">Tons</option>
                    <option value="cubic meters">Cubic Meters</option>
                    <option value="meters">Meters</option>
                    <option value="liters">Liters</option>
                    <option value="kg">Kilograms</option>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={closeAddProductModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.category || !newProduct.unitPrice || !newProduct.stock}
                  className="flex-1 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white"
                >
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Invoice Modal */}
        {isSubmitInvoiceModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleModalClose}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Submit Invoice</h3>
                  <p className="text-sm text-gray-600">Create and submit an invoice for a completed order</p>
                </div>
                <button
                  onClick={closeInvoiceModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Order *</label>
                  <Select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    required
                  >
                    <option value="">Choose an order to invoice</option>
                    {mockPendingOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id} - {order.project} (${order.amount.toLocaleString()})
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Amount ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea
                    placeholder="Invoice description or additional notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice File *</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileUpload}
                      className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700"
                      required
                    />
                    {uploadedFile && (
                      <Badge className="flex items-center gap-1 border-[#FAAD00] text-[#FAAD00] bg-[#FAAD00]/10">
                        <FileText className="h-3 w-3" />
                        {uploadedFile.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                </div>
                
                {mockPendingOrders.length === 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <p className="text-sm text-amber-800">No pending orders available for invoicing. Complete some deliveries first.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={closeInvoiceModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitInvoice}
                  disabled={!selectedOrder || !invoiceAmount || !uploadedFile}
                  className="flex-1 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Invoice
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quotation Response Modal */}
        {isQuotationResponseModalOpen && selectedQuotation && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleModalClose}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Respond to Quotation</h3>
                  <p className="text-sm text-gray-600">{selectedQuotation.project}</p>
                </div>
                <button
                  onClick={closeQuotationResponseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Items Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Requested Items</label>
                  <div className="space-y-3">
                    {quotationResponse.items.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                        <p className="font-medium text-gray-800 mb-2">{item.name}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price ($)</label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={item.price}
                              onChange={(e) => {
                                const updatedItems = [...quotationResponse.items]
                                updatedItems[index].price = e.target.value
                                setQuotationResponse({...quotationResponse, items: updatedItems})
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Available Quantity</label>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedItems = [...quotationResponse.items]
                                updatedItems[index].quantity = e.target.value
                                setQuotationResponse({...quotationResponse, items: updatedItems})
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={quotationResponse.totalAmount}
                    onChange={(e) => setQuotationResponse({...quotationResponse, totalAmount: e.target.value})}
                    required
                  />
                </div>
                
                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date *</label>
                  <Input
                    type="date"
                    value={quotationResponse.deliveryDate}
                    onChange={(e) => setQuotationResponse({...quotationResponse, deliveryDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <Textarea
                    placeholder="Any additional information, terms, or conditions..."
                    value={quotationResponse.notes}
                    onChange={(e) => setQuotationResponse({...quotationResponse, notes: e.target.value})}
                    className="min-h-[80px]"
                  />
                </div>
                
                {/* Deadline Warning */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Deadline:</span> {selectedQuotation.deadline}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={closeQuotationResponseModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitQuotationResponse}
                  disabled={!quotationResponse.totalAmount || !quotationResponse.deliveryDate}
                  className="flex-1 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Response
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard