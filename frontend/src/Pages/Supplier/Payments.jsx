import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { slideUpVariants } from '../../Components/Home/animation'
import { DollarSign, Clock, CheckCircle, Calendar, AlertCircle, CreditCard } from 'lucide-react'
import { cn } from '../../Utils/cn'

const mockPayments = [
  {
    id: "INV-001",
    orderId: "ORD-001",
    project: "Downtown Office Complex",
    amount: 2150.0,
    date: "2024-01-16",
    dueDate: "2024-01-30",
    status: "pending",
  },
  {
    id: "INV-002",
    orderId: "ORD-002",
    project: "Residential Tower Phase 2",
    amount: 1500.0,
    date: "2024-01-15",
    dueDate: "2024-01-29",
    status: "paid",
    paidDate: "2024-01-16",
  },
  {
    id: "INV-003",
    orderId: "ORD-003",
    project: "Highway Bridge Construction",
    amount: 8750.0,
    date: "2024-01-14",
    dueDate: "2024-01-28",
    status: "paid",
    paidDate: "2024-01-15",
  },
  {
    id: "INV-004",
    orderId: "ORD-004",
    project: "Shopping Mall Extension",
    amount: 1875.0,
    date: "2024-01-13",
    dueDate: "2024-01-27",
    status: "pending",
  },
  {
    id: "INV-005",
    orderId: "ORD-005",
    project: "School Building Renovation",
    amount: 862.5,
    date: "2024-01-12",
    dueDate: "2024-01-26",
    status: "overdue",
  },
  {
    id: "INV-006",
    orderId: "ORD-006",
    project: "Medical Center Expansion",
    amount: 3200.0,
    date: "2024-01-11",
    dueDate: "2024-01-25",
    status: "paid",
    paidDate: "2024-01-14",
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
    paid: "bg-green-100 text-green-800 border-green-200 shadow-sm",
    overdue: "bg-red-100 text-red-800 border-red-200 shadow-sm",
  }
  
  return (
    <div className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-md", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

const Payments = () => {
  const [payments, setPayments] = useState(mockPayments)
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayments =
    statusFilter === "all" ? payments : payments.filter((payment) => payment.status === statusFilter)

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "overdue":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "pending"
      case "paid":
        return "paid"
      case "overdue":
        return "overdue"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Payment"
      case "paid":
        return "Payment Received"
      case "overdue":
        return "Overdue"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const handleMarkAsPaid = (paymentId) => {
    const currentDate = new Date().toISOString().split('T')[0]
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: "paid", paidDate: currentDate }
          : payment
      )
    )
  }

  const totalPending = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

  const lastPayment = payments
    .filter((p) => p.status === "paid" && p.paidDate)
    .sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime())[0]

  const overdueCount = payments.filter((p) => p.status === "overdue").length

  return (
    <motion.div 
      className="space-y-6 p-6 bg-gray-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={slideUpVariants}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Payment Tracking</h2>
          <p className="text-gray-600 mt-1">Monitor invoice payments and outstanding amounts</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500 hover:border-l-amber-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Pending</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              Rs.{totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {payments.filter((p) => p.status === "pending" || p.status === "overdue").length} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Paid</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rs.{totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {payments.filter((p) => p.status === "paid").length} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Last Payment</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {lastPayment ? lastPayment.paidDate : "N/A"}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {lastPayment ? `Rs.${lastPayment.amount.toLocaleString()}` : "No payments yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:border-l-red-600 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Overdue</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-gray-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800">Payment History</CardTitle>
              <CardDescription className="text-gray-600">Track all invoice payments and outstanding amounts</CardDescription>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] bg-white text-sm"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Invoice ID</TableHead>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Invoice Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Paid Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50/80 transition-colors">
                  <TableCell className="font-medium text-gray-900">{payment.id}</TableCell>
                  <TableCell className="text-gray-700">{payment.project}</TableCell>
                  <TableCell className="font-medium text-gray-900">
                    Rs.{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-700">{payment.date}</TableCell>
                  <TableCell className="text-gray-700">{payment.dueDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(payment.status)} 
                      className="flex items-center gap-2 w-fit font-medium"
                    >
                      {getStatusIcon(payment.status)}
                      {getStatusText(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {payment.paidDate || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === "pending" || payment.status === "overdue" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkAsPaid(payment.id)}
                        className={cn(
                          "transition-all duration-200 font-medium bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg"
                        )}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </Button>
                    ) : payment.status === "paid" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="bg-green-50 text-green-700 border-green-200 cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Payment Received
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payments found for the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Payments
