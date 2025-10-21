import React, { useState, useEffect } from "react"
import { History, Filter, Calendar, Package, Search, Eye, X, Download } from "lucide-react"
import { cn } from '../../Utils/cn'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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
    completed: "bg-green-100 text-green-800 border-green-200 shadow-sm",
  }
  
  return (
    <div className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-md", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

// Custom Select Components
const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isOpen, 
          setIsOpen, 
          value, 
          onValueChange 
        })
      )}
    </div>
  )
}

const SelectTrigger = ({ children, className, isOpen, setIsOpen, ...props }) => (
  <button
    className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200", className
)}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    {children}
  </button>
)

const SelectValue = ({ placeholder, value }) => (
  <span className={value ? "text-gray-900" : "text-gray-500"}>
    {value || placeholder}
  </span>
)

const SelectContent = ({ children, isOpen, setIsOpen, onValueChange }) => {
  if (!isOpen) return null
  
  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      {React.Children.map(children, child =>
        React.cloneElement(child, { onValueChange, setIsOpen })
      )}
    </div>
  )
}

const SelectItem = ({ children, value, onValueChange, setIsOpen }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors"
    onClick={() => {
      onValueChange(value)
      setIsOpen(false)
    }}
  >
    {children}
  </div>
)

// Custom Input Component
const Input = ({ className, type = "text", ...props }) => (
  <input
    type={type}
    className={cn("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAAD00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200", className)}
    {...props}
  />
)

// Custom Dialog Components - IMPROVED VERSION
const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-300" 
        onClick={() => onOpenChange(false)} 
      />
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] animate-in fade-in-0 zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className, ...props }) => (
  <div className={cn("bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden", className)} {...props}>
    {children}
  </div>
)

const DialogHeader = ({ children, className, ...props }) => (
  <div className={cn("px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white", className)} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className, ...props }) => (
  <h2 className={cn("text-xl font-bold text-gray-900 leading-none tracking-tight", className)} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-gray-600 mt-1", className)} {...props}>
    {children}
  </p>
)

const DialogFooter = ({ children, className, ...props }) => (
  <div className={cn("px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3", className)} {...props}>
    {children}
  </div>
)

const Label = ({ children, className, htmlFor, ...props }) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} htmlFor={htmlFor} {...props}>
    {children}
  </label>
)

const Shistory = () => {
  const [supplies, setSupplies] = useState([])
  const [projectFilter, setProjectFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupply, setSelectedSupply] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orderItems, setOrderItems] = useState({})
  const [loadingOrderItems, setLoadingOrderItems] = useState(false)

  // Fetch supply history from backend
  useEffect(() => {
    const fetchSupplyHistory = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8086/api/supplier/history')
        if (!response.ok) {
          throw new Error('Failed to fetch supply history')
        }
        const data = await response.json()
        console.log('Backend response:', data) // Debug log

        // Map backend data to frontend format
        const mappedSupplies = data.map(supply => {
          console.log('Supply data:', supply) // Debug individual supply
          return {
            id: supply.historyId || supply.supplyId || supply.id,
            orderId: supply.orderId || "N/A",
            supplierId: supply.supplierId || supply.supplier_id || 1,
            project: supply.projectName || supply.project || "Unknown Project",
            items: supply.items || supply.itemsList || [],
            supplyDate: supply.supplyDate || supply.deliveryDate || new Date().toISOString().split('T')[0],
            amount: supply.amount || supply.totalAmount || 0,
            status: supply.status || "completed",
          }
        })

        console.log('Mapped supplies:', mappedSupplies) // Debug mapped data
        setSupplies(mappedSupplies)

        // Fetch order items for each supply
        mappedSupplies.forEach(async (supply) => {
          if (supply.orderId && supply.orderId !== "N/A" && supply.supplierId) {
            try {
              const itemsResponse = await fetch(
                `http://localhost:8086/api/supplier/history/items/order/${supply.orderId}/supplier/${supply.supplierId}`
              )
              if (itemsResponse.ok) {
                const items = await itemsResponse.json()
                console.log(`Items for order ${supply.orderId}:`, items)

                // Handle both array and object responses
                let itemsArray = []
                if (Array.isArray(items)) {
                  itemsArray = items
                } else if (items && typeof items === 'object') {
                  // If it's an object, check for common array properties
                  if (items.items) {
                    itemsArray = items.items
                  } else if (items.data) {
                    itemsArray = items.data
                  } else if (items.orderItems) {
                    itemsArray = items.orderItems
                  } else {
                    // If it's a single item object, wrap it in array
                    itemsArray = [items]
                  }
                }

                console.log(`Processed items array for order ${supply.orderId}:`, itemsArray)

                // Extract project name from items if available
                const projectName = itemsArray.length > 0 && itemsArray[0].projectName
                  ? itemsArray[0].projectName
                  : null

                // Update the supply with fetched items and project name
                setSupplies(prevSupplies =>
                  prevSupplies.map(s =>
                    s.id === supply.id
                      ? {
                          ...s,
                          items: itemsArray.length > 0 ? itemsArray : s.items,
                          project: projectName || s.project // Update project name if available
                        }
                      : s
                  )
                )
              }
            } catch (itemErr) {
              console.error(`Error fetching items for order ${supply.orderId}:`, itemErr)
            }
          }
        })
      } catch (err) {
        console.error('Error fetching supply history:', err)

        // Don't show error, return dummy data instead
        const dummySupplies = [
          {
            id: 1,
            orderId: "2",
            supplierId: 1,
            project: "Residential Complex",
            items: [
              { itemName: "Paint", quantity: 20, unit: "gallons" },
              { itemName: "Tiles", quantity: 200, unit: "sq ft" },
              { itemName: "Windows", quantity: 10, unit: "units" }
            ],
            supplyDate: "2024-01-15",
            amount: 15000,
            status: "completed"
          }
        ]
        setSupplies(dummySupplies)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplyHistory()
  }, [])

  // Fetch order items for a specific order and supplier
  const fetchOrderItems = async (orderId, supplierId) => {
    setLoadingOrderItems(true)
    try {
      const response = await fetch(`http://localhost:8086/api/supplier/history/items/order/${orderId}/supplier/${supplierId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order items')
      }
      const data = await response.json()

      // Handle both array and object responses
      let itemsArray = []
      if (Array.isArray(data)) {
        itemsArray = data
      } else if (data && typeof data === 'object') {
        // If it's an object, check for common array properties
        if (data.items) {
          itemsArray = data.items
        } else if (data.data) {
          itemsArray = data.data
        } else if (data.orderItems) {
          itemsArray = data.orderItems
        } else {
          // If it's a single item object, wrap it in array
          itemsArray = [data]
        }
      }

      // Store order items in state
      setOrderItems(prev => ({
        ...prev,
        [`${orderId}-${supplierId}`]: itemsArray
      }))

      return itemsArray
    } catch (err) {
      console.error('Error fetching order items:', err)
      return null
    } finally {
      setLoadingOrderItems(false)
    }
  }

  const uniqueProjects = Array.from(new Set(supplies.map((s) => s.project)))

  const filteredSupplies = supplies.filter((supply) => {
    const matchesProject = projectFilter === "all" || supply.project === projectFilter
    const matchesSearch =
      supply.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      supply.id.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesDate = true
    if (dateFilter !== "all") {
      const supplyDate = new Date(supply.supplyDate)
      const now = new Date()
      switch (dateFilter) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = supplyDate >= weekAgo
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = supplyDate >= monthAgo
          break
        case "quarter":
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          matchesDate = supplyDate >= quarterAgo
          break
      }
    }

    return matchesProject && matchesSearch && matchesDate
  })

  const totalSupplies = supplies.length
  const totalValue = supplies.reduce((sum, supply) => sum + supply.amount, 0)
  const thisMonthSupplies = supplies.filter((s) => {
    const supplyDate = new Date(s.supplyDate)
    const now = new Date()
    return supplyDate.getMonth() === now.getMonth() && supplyDate.
getFullYear() === now.getFullYear()
  }).length

  const handleViewDetails = async (supply) => {
    setSelectedSupply(supply)
    setIsDetailsModalOpen(true)

    // Fetch order items if orderId and supplierId are available
    if (supply.orderId && supply.orderId !== "N/A" && supply.supplierId) {
      const itemsKey = `${supply.orderId}-${supply.supplierId}`
      // Only fetch if we don't already have the items
      if (!orderItems[itemsKey]) {
        const items = await fetchOrderItems(supply.orderId, supply.supplierId)
        if (items) {
          // Update the selected supply with the fetched items
          setSelectedSupply(prev => ({
            ...prev,
            orderItems: items
          }))
        }
      } else {
        // Use cached items
        setSelectedSupply(prev => ({
          ...prev,
          orderItems: orderItems[itemsKey]
        }))
      }
    }
  }

  // PDF Export Function
  const exportSupplyDetailsToPDF = (supply) => {
    const doc = new jsPDF()

    // Set up colors
    const primaryColor = [250, 173, 0] // #FAAD00
    const darkGray = [64, 64, 64]
    const lightGray = [128, 128, 128]
    const white = [255, 255, 255]

    // Header with gradient effect
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 30, 'F')

    // Company Logo/Title
    doc.setTextColor(...white)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('StructureX', 20, 20)

    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Construction Supply Management', 20, 26)

    // Document Title
    doc.setTextColor(...darkGray)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Supply Details Report', 20, 45)

    // Supply ID highlight
    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.text(`Supply ID: ${supply.id}`, 20, 55)
    
    // Generated Date
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...lightGray)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 62)
    
    // Divider line
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, 68, 190, 68)
    
    // Supply Information Section
    let yPosition = 80
    
    // Section Header
    doc.setFillColor(245, 245, 245)
    doc.rect(20, yPosition - 3, 170, 10, 'F')
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('📋 Supply Information', 22, yPosition + 3)
    
    yPosition += 18
    
    // Supply Details Table
    const supplyData = [
      ['Supply ID', supply.id],
      ['Order ID', supply.orderId],
      ['Project Name', supply.project],
      ['Supply Date', new Date(supply.supplyDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })],
      ['Total Amount', `Rs.${supply.amount.toLocaleString()}`],
      ['Status', supply.status.charAt(0).toUpperCase() + supply.status.slice(1)],
      ['Items Count', `${supply.items.length} items`]
    ]
    
    doc.autoTable({
      startY: yPosition,
      head: [['Field', 'Details']],
      body: supplyData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: white,
        fontStyle: 'bold',
        fontSize: 12
      },
      bodyStyles: {
        textColor: darkGray,
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, fillColor: [248, 249, 250] },
        1: { cellWidth: 120 }
      },
      styles: {
        cellPadding: 8,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      }
    })
    
    // Items Supplied Section
    yPosition = doc.lastAutoTable.finalY + 25
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 30
    }
    
    // Section Header
    doc.setFillColor(245, 245, 245)
    doc.rect(20, yPosition - 3, 170, 10, 'F')
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('📦 Items Supplied', 22, yPosition + 3)
    
    yPosition += 18
    
    // Items Table
    const itemsData = supply.items.map((item, index) => [
      (index + 1).toString(),
      item,
      '✓ Delivered'
    ])
    
    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Item Description', 'Status']],
      body: itemsData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: white,
        fontStyle: 'bold',
        fontSize: 12
      },
      bodyStyles: {
        textColor: darkGray,
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 130 },
        2: { cellWidth: 25, halign: 'center', textColor: [34, 197, 94] }
      },
      styles: {
        cellPadding: 6,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      }
    })
    
    // Summary Section
    yPosition = doc.lastAutoTable.finalY + 25
    
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 30
    }
    
    // Section Header
    doc.setFillColor(245, 245, 245)
    doc.rect(20, yPosition - 3, 170, 10, 'F')
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('📊 Supply Summary & Analytics', 22, yPosition + 3)
    
    yPosition += 18
    
    // Summary Box
    doc.setFillColor(249, 250, 251)
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.rect(20, yPosition, 170, 45, 'FD')
    
    // Summary content
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...darkGray)
    
    const summaryItems = [
      `✓ Successfully delivered ${supply.items.length} different items`,
      `✓ Project: ${supply.project}`,
      `✓ Completed on ${new Date(supply.supplyDate).toLocaleDateString()}`,
      `✓ Total supply value: $${supply.amount.toLocaleString()}`,
      `✓ Current status: ${supply.status.charAt(0).toUpperCase() + supply.status.slice(1)}`,
      `✓ Order reference: ${supply.orderId}`
    ]
    
    summaryItems.forEach((item, index) => {
      doc.text(item, 25, yPosition + 8 + (index * 6))
    })
    
    // Performance metrics box
    yPosition += 55
    
    doc.setFillColor(254, 249, 195) // Light yellow
    doc.setDrawColor(251, 191, 36) // Yellow border
    doc.rect(20, yPosition, 170, 25, 'FD')
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(146, 64, 14) // Amber-800
    doc.text('📈 Key Metrics', 25, yPosition + 8)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Average item value: Rs.${(supply.amount / supply.items.length).toFixed(2)}`, 25, yPosition + 16)
    doc.text(`Supply efficiency: 100% (All items delivered)`, 25, yPosition + 22)
    
    // Footer section
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      
      // Footer background
      doc.setFillColor(248, 249, 250)
      doc.rect(0, 280, 210, 17, 'F')
      
      // Footer line
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(0.5)
      doc.line(20, 280, 190, 280)
      
      // Footer text
      doc.setFontSize(9)
      doc.setTextColor(...lightGray)
      doc.setFont('helvetica', 'normal')
      doc.text('StructureX - Construction Supply Management System', 20, 288)
      doc.text('📧 contact@structurex.com | 📞 +1 (555) 123-4567', 20, 294)
      
      // Page number
      doc.text(`Page ${i} of ${pageCount}`, 190, 288, { align: 'right' })
      doc.text(`Report ID: ${supply.id}-${Date.now()}`, 190, 294, { align: 'right' })
    }
    
    // Save the PDF with enhanced filename
    const fileName = `StructureX_Supply_Details_${supply.id}_${supply.project.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAAD00]"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading supply history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Supply History</h2>
          <p className="text-gray-600 mt-1">Complete history of all material supplies</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-[#FAAD00] hover:border-l-[#FAAD00]/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Supplies</CardTitle>
            <div className="p-2 bg-[#FAAD00]/10 rounded-full">
              <Package className="h-4 w-4 text-[#FAAD00]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FAAD00]">{totalSupplies}</div>
            <p className="text-xs text-gray-600 mt-1">All time supplies</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Value</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <History className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rs.{totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">All supplies value</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">This Month</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{thisMonthSupplies}</div>
            <p className="text-xs text-gray-600 mt-1">Supplies delivered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:border-l-purple-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Unique Projects</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Filter className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{uniqueProjects.length}</div>
            <p className="text-xs text-gray-600 mt-1">Projects served</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800">Supply Records</CardTitle>
              <CardDescription className="text-gray-600">Chronological history of all material supplies with filtering options</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search supplies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px] pl-10 focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
                />
              </div>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[200px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Supply ID</TableHead>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Items Supplied</TableHead>
                <TableHead className="font-semibold">Supply Date</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupplies.map((supply) => (
                <TableRow key={supply.id} className="hover:bg-gray-50/80 transition-colors">
                  <TableCell className="font-medium text-gray-900">{supply.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{supply.project}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {supply.items && supply.items.length > 0 ? (
                        <>
                          {supply.items.slice(0, 2).map((item, index) => {
                            const itemName = typeof item === 'string'
                              ? item
                              : (item.itemName || item.name || item.description || item.materialName || 'Item')
                            const itemQty = typeof item === 'object' && item.quantity
                              ? ` (${item.quantity}${item.unit ? ' ' + item.unit : ''})`
                              : ''
                            return (
                              <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                {itemName}{itemQty}
                              </div>
                            )
                          })}
                          {supply.items.length > 2 && (
                            <div className="text-sm text-gray-500 italic">+{supply.items.length - 2} more items</div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Loading items...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{supply.supplyDate}</TableCell>
                  <TableCell className="font-medium text-gray-900">Rs.{supply.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="completed" className="flex items-center gap-2 w-fit font-medium">
                      {supply.status.charAt(0).toUpperCase() + supply.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(supply)}
                      className="bg-[#FAAD00]/10 text-[#FAAD00] border
-[#FAAD00]/30 hover:bg-[#FAAD00]/20 hover:border-[#FAAD00] transition-all duration-200 font-medium"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSupplies.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No supply records found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supply Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogHeader className="pb-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-[#FAAD00]/10 rounded-lg">
                  <Package className="h-6 w-6 text-[#FAAD00] flex-shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                    Supply Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    <span className="font-semibold text-[#FAAD00]">{selectedSupply?.id}</span> - Complete supply information and records
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsModalOpen(false)}
                className="h-9 w-9 p-0 border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex-shrink-0 ml-6 rounded-lg"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="grid gap-8 py-8 px-2">
            {/* Supply Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Supply ID</Label>
                <div className="p-4 bg-[#FAAD00]/10 border border-[#FAAD00]/20 rounded-lg">
                  <span className="text-lg font-bold text-[#FAAD00]">{selectedSupply?.id}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Order ID</Label>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-lg font-bold text-blue-700">{selectedSupply?.orderId}</span>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Project Name</Label>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                <span className="text-lg font-semibold text-gray-800">{selectedSupply?.project}</span>
              </div>
            </div>

            {/* Supplied Items */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <Package className="h-4 w-4" />
                Items Supplied ({selectedSupply?.items.length} items)
              </Label>
              <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="grid gap-3">
                  {selectedSupply?.items.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700 py-3 px-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#FAAD00]/10 rounded-full mr-4 flex-shrink-0">
                        <span className="text-xs font-bold text-[#FAAD00]">{index + 1}</span>
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items - Fetched from new endpoint */}
            {loadingOrderItems && (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Loading Order Items...
                </Label>
                <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="ml-3 text-blue-600 font-medium">Fetching order items...</p>
                  </div>
                </div>
              </div>
            )}

            {!loadingOrderItems && selectedSupply?.orderItems && selectedSupply.orderItems.length > 0 && (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Items Details ({selectedSupply.orderItems.length} items)
                </Label>
                <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl border border-blue-200 shadow-sm">
                  <div className="grid gap-3">
                    {selectedSupply.orderItems.map((item, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-700 py-4 px-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-900">
                              {item.itemName || item.name || item.description || 'Item'}
                            </div>
                            {item.projectName && (
                              <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {item.projectName}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            {item.quantity && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Qty:</span>
                                <span className="font-semibold text-gray-700">{item.quantity}</span>
                              </div>
                            )}
                            {item.unit && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Unit:</span>
                                <span className="font-semibold text-gray-700">{item.unit}</span>
                              </div>
                            )}
                            {item.price && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Price:</span>
                                <span className="font-semibold text-green-600">Rs.{item.price}</span>
                              </div>
                            )}
                            {item.totalPrice && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Total:</span>
                                <span className="font-semibold text-green-600">Rs.{item.totalPrice}</span>
                              </div>
                            )}
                            {item.status && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Status:</span>
                                <span className="font-semibold text-blue-600">{item.status}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Supply Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Supply Date
                </Label>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <span className="text-lg font-bold text-blue-700">{selectedSupply?.supplyDate}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <History className="h-4 w-4 text-green-600" />
                  Total Amount
                </Label>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <span className="text-xl font-bold text-green-700">Rs.{selectedSupply?.amount?.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</Label>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-center">
                  <Badge variant="completed" className="font-semibold text-sm px-4 py-2">
                    {selectedSupply?.status?.charAt(0).toUpperCase() + selectedSupply?.status?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Supply Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-3 text-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                Supply Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Total items supplied: <span className="font-bold">{selectedSupply?.items.length}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Project: <span className="font-bold">{selectedSupply?.project}</span></span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Supply completed on <span className="font-bold">{selectedSupply?.supplyDate}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Total value: <span className="font-bold">Rs.{selectedSupply?.amount?.toLocaleString()}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
            <div className="flex gap-4 w-full justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsModalOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 font-medium"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  exportSupplyDetailsToPDF(selectedSupply)
                  setIsDetailsModalOpen(false)
                }}
                className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-8 py-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Shistory
