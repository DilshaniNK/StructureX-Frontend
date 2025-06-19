import React, { useState } from 'react'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign, Truck } from 'lucide-react'
import { cn } from '../../Utils/cn'

const mockQuotations = [
  {
    id: 1,
    projectName: "Downtown Office Complex",
    requestedItems: ["Portland Cement (100 bags)", "Steel Rebar 12mm (5 tons)"],
    date: "2024-01-15",
    status: "pending",
    deadline: "2024-01-20",
  },
  {
    id: 2,
    projectName: "Residential Tower Phase 2",
    requestedItems: ["Concrete Blocks (500 pieces)", "Sand (20 cubic meters)"],
    date: "2024-01-14",
    status: "responded",
    deadline: "2024-01-18",
    response: {
      totalAmount: 15000,
      deliveryTime: 10,
      notes: "High quality materials with warranty included",
      submittedDate: "2024-01-15"
    }
  },
  {
    id: 3,
    projectName: "Highway Bridge Construction",
    requestedItems: ["Steel Rebar 16mm (10 tons)", "Portland Cement (200 bags)"],
    date: "2024-01-13",
    status: "pending",
    deadline: "2024-01-17",
  },
  {
    id: 4,
    projectName: "Shopping Mall Extension",
    requestedItems: ["Concrete Mix (15 cubic meters)", "Steel Beams (8 pieces)"],
    date: "2024-01-12",
    status: "rejected",
    deadline: "2024-01-16",
    rejectionDetails: {
      reason: "Price too high compared to market rates",
      rejectedDate: "2024-01-14",
      feedback: "The quoted amount of $25,000 exceeds our budget by 40%. We were expecting around $18,000 based on current market rates.",
      rejectedBy: "Project Manager - John Smith"
    }
  },
  {
    id: 5,
    projectName: "School Building Renovation",
    requestedItems: ["Paint (50 gallons)", "Tiles (200 sq ft)"],
    date: "2024-01-11",
    status: "expired",
    deadline: "2024-01-15",
  },
]

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

// Enhanced Badge Component with better styling
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
  const [quotations, setQuotations] = useState(mockQuotations)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [isRejectionDetailsModalOpen, setIsRejectionDetailsModalOpen] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "responded":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "expired":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "pending"
      case "responded":
        return "responded"
      case "rejected":
        return "rejected"
      case "expired":
        return "expired"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review"
      case "responded":
        return "Response Sent"
      case "rejected":
        return "Rejected"
      case "expired":
        return "Expired"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const handleRespond = (quotation) => {
    setSelectedQuotation(quotation)
    setIsResponseModalOpen(true)
  }

  const handleViewRejectionDetails = (quotation) => {
    setSelectedQuotation(quotation)
    setIsRejectionDetailsModalOpen(true)
  }

  const handleAction = (quotation) => {
    if (quotation.status === "rejected") {
      handleViewRejectionDetails(quotation)
    } else {
      handleRespond(quotation)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Quotation Requests</h2>
          <p className="text-gray-600 mt-1">Respond to project quotation requests</p>
        </div>
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
              {quotations.filter((q) => q.status === "pending").length}
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
              {quotations.filter((q) => q.status === "responded").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Successfully sent</p>
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
              {quotations.filter((q) => q.status === "rejected").length}
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
              {quotations.map((quotation) => (
                <TableRow key={quotation.id} className="hover:bg-gray-50/80 transition-colors">
                  <TableCell className="font-medium text-gray-900">{quotation.projectName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {quotation.requestedItems.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          {item}
                        </div>
                      ))}
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
                      variant={quotation.status === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAction(quotation)}
                      disabled={quotation.status === "expired"}
                      className={cn(
                        "transition-all duration-200 font-medium",
                        quotation.status === "pending" 
                          ? "bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg" 
                          : quotation.status === "responded"
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : quotation.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          : quotation.status === "expired"
                          ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
                          : ""
                      )}
                    >
                      {quotation.status === "pending" && "Respond Now"}
                      {quotation.status === "responded" && "View Response"}
                      {quotation.status === "rejected" && "View Details"}
                      {quotation.status === "expired" && "Expired"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Response Modal for Pending/Responded quotations */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="sm:max-w-[600px] shadow-2xl">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {selectedQuotation?.status === "pending" ? "Respond to Quotation Request" : "View Response Details"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              <span className="font-medium text-[#FAAD00]">{selectedQuotation?.projectName}</span> 
              {selectedQuotation?.status === "pending" ? " - Submit your quotation response" : " - Response details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Requested Items</Label>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                {selectedQuotation?.requestedItems.map((item, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1 flex items-center">
                    <div className="w-2 h-2 bg-[#FAAD00] rounded-full mr-3"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedQuotation?.status === "responded" ? (
              // Show response details for responded quotations
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Total Amount
                    </Label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <span className="text-lg font-bold text-green-700">${selectedQuotation?.response?.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      Delivery Time
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <span className="text-lg font-bold text-blue-700">{selectedQuotation?.response?.deliveryTime} days</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Response Notes</Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-gray-700">{selectedQuotation?.response?.notes}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Submitted on: {selectedQuotation?.response?.submittedDate}
                </div>
              </div>
            ) : (
              // Show input fields for pending quotations
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total-amount" className="text-sm font-semibold text-gray-700">Total Amount ($)</Label>
                    <Input
                      id="total-amount"
                      type="number"
                      placeholder="0.00"
                      className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time" className="text-sm font-semibold text-gray-700">Delivery Time (days)</Label>
                    <Input
                      id="delivery-time"
                      type="number"
                      placeholder="7"
                      className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or terms..."
                    className="min-h-[100px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 resize-none"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsResponseModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {selectedQuotation?.status === "pending" ? "Cancel" : "Close"}
            </Button>
            {selectedQuotation?.status === "pending" && (
              <Button
                onClick={() => setIsResponseModalOpen(false)}
                className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                Submit Quotation
              </Button>
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
                {selectedQuotation?.requestedItems.map((item, index) => (
                  <div key={index} className="text-sm text-red-700 py-1 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    {item}
                  </div>
                ))}
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
                    <span className="text-sm font-medium text-red-700">{selectedQuotation?.rejectionDetails?.rejectedDate}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Rejected By
                  </Label>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <span className="text-sm font-medium text-red-700">{selectedQuotation?.rejectionDetails?.rejectedBy}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Rejection Reason</Label>
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 font-medium">{selectedQuotation?.rejectionDetails?.reason}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Detailed Feedback</Label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-gray-700 leading-relaxed">{selectedQuotation?.rejectionDetails?.feedback}</p>
                </div>
              </div>
            </div>

            {/* Action Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 What you can do next:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Review your pricing strategy based on the </li>+/.
                <li>• Review your pricing strategy based on the feedback</li>
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
