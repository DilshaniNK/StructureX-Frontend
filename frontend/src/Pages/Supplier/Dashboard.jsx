import React, { useState, useEffect } from 'react'
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
} from "lucide-react"

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

const Dashboard = ({ setActiveSection }) => {
  const [supplierData, setSupplierData] = useState(null)

  useEffect(() => {
    // Fetch supplier data from localStorage, API, or context
    const fetchSupplierData = () => {
      try {
        // Try different possible keys for user data
        const userData = localStorage.getItem('user') || 
                        localStorage.getItem('supplierData') || 
                        localStorage.getItem('currentUser')
        
        if (userData) {
          setSupplierData(JSON.parse(userData))
        }
        
        // Alternative: Fetch from API
        // const response = await fetch('/api/supplier/profile')
        // const data = await response.json()
        // setSupplierData(data)
      } catch (error) {
        console.error('Error fetching supplier data:', error)
      }
    }

    fetchSupplierData()
  }, [])

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

  const Button = ({ children, onClick, variant = "primary", size = "md", className = "" }) => {
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

    return (
      <button
        onClick={onClick}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                onClick={() => setActiveSection && setActiveSection("products")}
                className="h-auto p-4 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white flex flex-col items-center gap-2"
              >
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Button>
              <Button
                onClick={() => setActiveSection && setActiveSection("quotations")}
                variant="outline"
                className="h-auto p-4 border-[#FAAD00] text-[#FAAD00] hover:bg-[#FAAD00]/10 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>View Quotations</span>
              </Button>
              <Button
                onClick={() => setActiveSection && setActiveSection("orders")}
                variant="outline"
                className="h-auto p-4 border-blue-500 text-blue-600 hover:bg-blue-50 flex flex-col items-center gap-2"
              >
                <Truck className="h-6 w-6" />
                <span>Check Orders</span>
              </Button>
              <Button
                onClick={() => setActiveSection && setActiveSection("invoices")}
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
                  onClick={() => setActiveSection && setActiveSection("orders")}
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
                  onClick={() => setActiveSection && setActiveSection("quotations")}
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
                        onClick={() => setActiveSection && setActiveSection("quotations")}
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

        {/* System Status */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">All Systems Operational</p>
                  <p className="text-sm text-green-600">Last updated: 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-blue-800">Inventory Synced</p>
                  <p className="text-sm text-blue-600">Last sync: 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FAAD00]/10 rounded-lg border border-[#FAAD00]/20">
                <DollarSign className="h-5 w-5 text-[#FAAD00]" />
                <div>
                  <p className="font-medium text-[#FAAD00]">Payments Processing</p>
                  <p className="text-sm text-[#FAAD00]/80">Next batch: 1 hour</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default Dashboard
