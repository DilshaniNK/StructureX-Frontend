import React, { useState } from 'react';
import { Calendar, CreditCard, FileText, MessageSquare, Clock, DollarSign, Hammer, AlertCircle, TrendingUp, Users, X, CheckCircle, Download, BookOpen, Edit } from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// UI Components
const Button = ({ children, className, variant = 'default', size = 'default', disabled, onClick, ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:shadow-md';

  const variants = {
    default: 'bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 hover:bg-[#FAAD00]/10 hover:text-gray-900 bg-white',
  };

  const sizes = {
    default: 'h-11 py-2 px-4', // Increased height for Quick Actions
    sm: 'h-9 px-3 rounded-md',
  };

  return (
    <button className={cn(baseClasses, variants[variant], sizes[size], className)} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }) => (
  <div className={cn('rounded-lg border-gray-200 border bg-white text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200', className)} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('flex flex-col space-y-1 p-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-xs text-muted-foreground', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={cn('p-4 pt-0', className)} {...props}>
    {children}
  </div>
);

const Progress = ({ value, className, ...props }) => (
  <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)} {...props}>
    <div className="h-full bg-[#FAAD00] transition-all duration-300 ease-out shadow-sm" style={{ width: `${value || 0}%` }} />
  </div>
);

const Badge = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm',
    success: 'bg-green-100 text-green-800 border-green-200 shadow-sm',
    warning: 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm',
    danger: 'bg-red-100 text-red-800 border-red-200 shadow-sm',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-md',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Alert Component for success/error messages
const Alert = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    default: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={cn('rounded-lg border p-3 text-sm', variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

// Custom Dialog Components
const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 animate-in fade-in-0 zoom-in-95 duration-300">{children}</div>
    </div>
  );
};

const DialogContent = ({ children, className, ...props }) => (
  <div
    className={cn(
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] gap-3 border bg-white p-4 shadow-xl duration-200 sm:rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DialogHeader = ({ children, className, ...props }) => (
  <div className={cn('flex flex-col space-y-1 text-center sm:text-left', className)} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className, ...props }) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className, ...props }) => (
  <p className={cn('text-sm text-gray-600', className)} {...props}>
    {children}
  </p>
);

const DialogFooter = ({ children, className, ...props }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>
    {children}
  </div>
);

// Custom Form Components
const Label = ({ children, className, htmlFor, ...props }) => (
  <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} htmlFor={htmlFor} {...props}>
    {children}
  </label>
);

const Input = ({ className, type = 'text', error, ...props }) => (
  <input
    type={type}
    className={cn(
      'flex h-9 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      error 
        ? 'border-red-300 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-[#FAAD00]',
      className
    )}
    {...props}
  />
);

const Textarea = ({ className, error, ...props }) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      error 
        ? 'border-red-300 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-[#FAAD00]',
      className
    )}
    {...props}
  />
);

const Select = ({ children, className, error, ...props }) => (
  <select
    className={cn(
      'flex h-9 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      error 
        ? 'border-red-300 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-[#FAAD00]',
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add amendment tracking state
  const [amendmentRequests, setAmendmentRequests] = useState([
    // Example existing amendment (you can remove this in production)
    // {
    //   id: 1,
    //   subject: 'Change in bathroom tiles specification',
    //   status: 'pending',
    //   requestDate: '2024-01-15',
    //   description: 'Request to change bathroom tiles from ceramic to marble'
    // }
  ]);

  const projectData = {
    name: 'Luxury Villa Construction',
    progress: 65,
    remainingDays: 45,
    totalBudget: 250000,
    paidAmount: 150000,
    pendingAmount: 100000,
  };

  const quickActions = [
    {
      id: 'site-visit',
      icon: Calendar,
      label: 'Request Site Visit',
      title: 'Schedule Site Visit',
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'Submit Payment Confirmation',
      title: 'Payment Confirmation',
    },
    // {
    //   id: 'message',
    //   icon: MessageSquare,
    //   label: 'Message Site Supervisor',
    //   title: 'Send Message',
    // },
    {
      id: 'contract',
      icon: FileText,
      label: 'View Contract',
      title: 'Contract Details',
    },
  ];

  // Add new function to handle contract actions
  const handleContractAction = (actionType) => {
    switch (actionType) {
      case 'download':
        // Redirect to PDF viewer with contract document
        window.open('/contract-document.pdf', '_blank');
        break;
      case 'terms':
        // Redirect to company rules and regulations PDF
        window.open('/company-rules-regulations.pdf', '_blank');
        break;
      case 'amendment':
        // Close current modal and open amendment request modal
        setActiveModal('amendment-request');
        setFormData({});
        setErrors({});
        setSubmitStatus(null);
        break;
      default:
        break;
    }
  };

  const openModal = (actionId) => {
    setActiveModal(actionId);
    setFormData({});
    setErrors({});
    setSubmitStatus(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({});
    setErrors({});
    setSubmitStatus(null);
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    switch (activeModal) {
      case 'site-visit':
        if (!formData.visitDate) newErrors.visitDate = 'Date is required';
        if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
        if (!formData.purpose || formData.purpose.trim().length < 10) {
          newErrors.purpose = 'Purpose must be at least 10 characters';
        }
        break;

      case 'payment':
        if (!formData.paymentAmount || formData.paymentAmount <= 0) {
          newErrors.paymentAmount = 'Valid payment amount is required';
        }
        if (!formData.transactionId || formData.transactionId.trim().length < 5) {
          newErrors.transactionId = 'Transaction ID must be at least 5 characters';
        }
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
        break;

      // case 'message':
      //   if (!formData.messageSubject || formData.messageSubject.trim().length < 3) {
      //     newErrors.messageSubject = 'Subject must be at least 3 characters';
      //   }
      //   if (!formData.messageContent || formData.messageContent.trim().length < 10) {
      //     newErrors.messageContent = 'Message must be at least 10 characters';
      //   }
      //   if (!formData.priority) newErrors.priority = 'Priority is required';
      //   break;

      // Add validation for amendment request
      case 'amendment-request':
        if (!formData.amendmentSubject || formData.amendmentSubject.trim().length < 5) {
          newErrors.amendmentSubject = 'Subject must be at least 5 characters';
        }
        if (!formData.amendmentDescription || formData.amendmentDescription.trim().length < 20) {
          newErrors.amendmentDescription = 'Description must be at least 20 characters';
        }
        if (!formData.amendmentReason) newErrors.amendmentReason = 'Reason is required';
        break;

      default:
        break;
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    if (activeModal === 'contract') {
      closeModal();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle amendment request submission
      if (activeModal === 'amendment-request') {
        const newAmendment = {
          id: Date.now(),
          subject: formData.amendmentSubject,
          description: formData.amendmentDescription,
          reason: formData.amendmentReason,
          status: 'pending',
          requestDate: new Date().toISOString().split('T')[0]
        };
        
        setAmendmentRequests(prev => [newAmendment, ...prev]);
        setSubmitStatus('success');
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          closeModal();
        }, 2000);
        setIsSubmitting(false);
        return;
      }
      
      // Simulate random success/failure for other forms
      const isSuccess = Math.random() > 0.3; // 70% success rate
      
      if (isSuccess) {
        setSubmitStatus('success');
        // Auto close after 2 seconds on success
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModalContent = () => {
    if (submitStatus === 'success') {
      return (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Successfully Submitted!</h3>
          <p className="text-sm text-gray-600">
            {activeModal === 'amendment-request' 
              ? 'Your amendment request has been submitted and will be reviewed by our team.'
              : 'Your request has been processed and submitted successfully.'
            }
          </p>
        </div>
      );
    }

    switch (activeModal) {
      case 'site-visit':
        return (
          <div className="space-y-3">
            {submitStatus === 'error' && (
              <Alert variant="error" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Please correct the errors below and try again.
              </Alert>
            )}
            <div className="space-y-1">
              <Label htmlFor="visit-date" className="text-sm font-semibold text-gray-700">
                Preferred Date
              </Label>
              <Input 
                id="visit-date" 
                type="date" 
                error={errors.visitDate}
                value={formData.visitDate || ''}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300" 
              />
              {errors.visitDate && <p className="text-xs text-red-600">{errors.visitDate}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="time-slot" className="text-sm font-semibold text-gray-700">
                Time Slot
              </Label>
              <Select 
                id="time-slot"
                error={errors.timeSlot}
                value={formData.timeSlot || ''}
                onChange={(e) => handleInputChange('timeSlot', e.target.value)}
              >
                <option value="">Select a time slot</option>
                <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                <option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                <option value="evening">Evening (5:00 PM - 7:00 PM)</option>
              </Select>
              {errors.timeSlot && <p className="text-xs text-red-600">{errors.timeSlot}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="purpose" className="text-sm font-semibold text-gray-700">
                Purpose
              </Label>
              <Textarea
                id="purpose"
                placeholder="Reason for site visit..."
                error={errors.purpose}
                value={formData.purpose || ''}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className="min-h-[80px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 resize-none"
              />
              {errors.purpose && <p className="text-xs text-red-600">{errors.purpose}</p>}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-3">
            {submitStatus === 'error' && (
              <Alert variant="error" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Please correct the errors below and try again.
              </Alert>
            )}
            <div className="space-y-1">
              <Label htmlFor="payment-amount" className="text-sm font-semibold text-gray-700">
                Payment Amount ($)
              </Label>
              <Input
                id="payment-amount"
                type="number"
                placeholder="Enter amount"
                error={errors.paymentAmount}
                value={formData.paymentAmount || ''}
                onChange={(e) => handleInputChange('paymentAmount', parseFloat(e.target.value))}
                className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
              />
              {errors.paymentAmount && <p className="text-xs text-red-600">{errors.paymentAmount}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="transaction-id" className="text-sm font-semibold text-gray-700">
                Transaction ID
              </Label>
              <Input
                id="transaction-id"
                type="text"
                placeholder="Enter transaction ID"
                error={errors.transactionId}
                value={formData.transactionId || ''}
                onChange={(e) => handleInputChange('transactionId', e.target.value)}
                className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
              />
              {errors.transactionId && <p className="text-xs text-red-600">{errors.transactionId}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="payment-method" className="text-sm font-semibold text-gray-700">
                Payment Method
              </Label>
              <Select 
                id="payment-method"
                error={errors.paymentMethod}
                value={formData.paymentMethod || ''}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              >
                <option value="">Select payment method</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="online">Online Payment</option>
              </Select>
              {errors.paymentMethod && <p className="text-xs text-red-600">{errors.paymentMethod}</p>}
            </div>
          </div>
        );

      // case 'message':
      //   return (
      //     <div className="space-y-3">
      //       {submitStatus === 'error' && (
      //         <Alert variant="error" className="flex items-center">
      //           <AlertCircle className="h-4 w-4 mr-2" />
      //           Please correct the errors below and try again.
      //         </Alert>
      //       )}
      //       <div className="space-y-1">
      //         <Label htmlFor="message-subject" className="text-sm font-semibold text-gray-700">
      //           Subject
      //         </Label>
      //         <Input
      //           id="message-subject"
      //           type="text"
      //           placeholder="Message subject"
      //           error={errors.messageSubject}
      //           value={formData.messageSubject || ''}
      //           onChange={(e) => handleInputChange('messageSubject', e.target.value)}
      //           className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
      //         />
      //         {errors.messageSubject && <p className="text-xs text-red-600">{errors.messageSubject}</p>}
      //       </div>
      //       <div className="space-y-1">
      //         <Label htmlFor="message-content" className="text-sm font-semibold text-gray-700">
      //           Message
      //         </Label>
      //         <Textarea
      //           id="message-content"
      //           placeholder="Type your message here..."
      //           error={errors.messageContent}
      //           value={formData.messageContent || ''}
      //           onChange={(e) => handleInputChange('messageContent', e.target.value)}
      //           className="min-h-[80px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 resize-none"
      //         />
      //         {errors.messageContent && <p className="text-xs text-red-600">{errors.messageContent}</p>}
      //       </div>
      //       <div className="space-y-1">
      //         <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">
      //           Priority
      //         </Label>
      //         <Select 
      //           id="priority"
      //           error={errors.priority}
      //           value={formData.priority || ''}
      //           onChange={(e) => handleInputChange('priority', e.target.value)}
      //         >
      //           <option value="">Select priority</option>
      //           <option value="normal">Normal</option>
      //           <option value="high">High</option>
      //           <option value="urgent">Urgent</option>
      //         </Select>
      //         {errors.priority && <p className="text-xs text-red-600">{errors.priority}</p>}
      //       </div>
      //     </div>
      //   );

      case 'contract':
        return (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-[#FAAD00]" />
                Contract Information
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Contract ID:</span>
                  <span>VILLA-2024-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Start Date:</span>
                  <span>January 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Expected Completion:</span>
                  <span>March 30, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Value:</span>
                  <span className="font-bold text-[#FAAD00]">${projectData.totalBudget.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleContractAction('download')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Contract PDF
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleContractAction('terms')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Terms & Conditions
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleContractAction('amendment')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Request Amendment
              </Button>
            </div>
          </div>
        );

      // Add new amendment request modal
      case 'amendment-request':
        return (
          <div className="space-y-3">
            {submitStatus === 'error' && (
              <Alert variant="error" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Please correct the errors below and try again.
              </Alert>
            )}
            <div className="space-y-1">
              <Label htmlFor="amendment-subject" className="text-sm font-semibold text-gray-700">
                Amendment Subject
              </Label>
              <Input
                id="amendment-subject"
                type="text"
                placeholder="Brief description of the amendment"
                error={errors.amendmentSubject}
                value={formData.amendmentSubject || ''}
                onChange={(e) => handleInputChange('amendmentSubject', e.target.value)}
                className="focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300"
              />
              {errors.amendmentSubject && <p className="text-xs text-red-600">{errors.amendmentSubject}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="amendment-reason" className="text-sm font-semibold text-gray-700">
                Reason for Amendment
              </Label>
              <Select 
                id="amendment-reason"
                error={errors.amendmentReason}
                value={formData.amendmentReason || ''}
                onChange={(e) => handleInputChange('amendmentReason', e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="design-change">Design Change</option>
                <option value="material-upgrade">Material Upgrade</option>
                <option value="scope-addition">Scope Addition</option>
                <option value="timeline-adjustment">Timeline Adjustment</option>
                <option value="budget-revision">Budget Revision</option>
                <option value="other">Other</option>
              </Select>
              {errors.amendmentReason && <p className="text-xs text-red-600">{errors.amendmentReason}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="amendment-description" className="text-sm font-semibold text-gray-700">
                Detailed Description
              </Label>
              <Textarea
                id="amendment-description"
                placeholder="Provide detailed description of the requested changes..."
                error={errors.amendmentDescription}
                value={formData.amendmentDescription || ''}
                onChange={(e) => handleInputChange('amendmentDescription', e.target.value)}
                className="min-h-[100px] focus:border-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 resize-none"
              />
              {errors.amendmentDescription && <p className="text-xs text-red-600">{errors.amendmentDescription}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'under-review': return 'default';
      default: return 'default';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white">
      <div className="space-y-4 p-8 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Project Dashboard</h2>
            <p className="text-gray-800 mt-1 font-medium text-sm">{projectData.name}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-white hover:border-l-white/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Project Progress</CardTitle>
              <div className="p-1 bg-[#FAAD00]/10 rounded-full">
                <Hammer className="h-4 w-4 text-[#FAAD00]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-[#FAAD00]">{projectData.progress}%</div>
              <Progress value={projectData.progress} className="mt-1" />
              <p className="text-xs text-gray-600 mt-1">On track</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Days Remaining</CardTitle>
              <div className="p-1 bg-blue-100 rounded-full">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-600">{projectData.remainingDays}</div>
              <p className="text-xs text-gray-600 mt-1">Expected completion</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Amount Paid</CardTitle>
              <div className="p-1 bg-green-100 rounded-full">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">${projectData.paidAmount.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((projectData.paidAmount / projectData.totalBudget) * 100)}% of total budget
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:border-l-red-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending Amount</CardTitle>
              <div className="p-1 bg-red-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">${projectData.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Due in next phase</p>
            </CardContent>
          </Card>
        </div>

        {/* Amendment Requests Section - Only show if there are amendments */}
        {amendmentRequests.length > 0 && (
          <Card className="shadow-lg border border-amber-200 bg-gradient-to-br from-white to-amber-50/30">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg border-b border-amber-200 p-3">
              <CardTitle className="text-gray-800 text-lg flex items-center">
                <Edit className="w-4 h-4 mr-2 text-amber-600" />
                Amendment Requests
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs">Track your contract amendment requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {amendmentRequests.map((amendment) => (
                <div key={amendment.id} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{amendment.subject}</h4>
                      <p className="text-xs text-gray-600 mt-1">{amendment.description}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(amendment.status)} className="ml-2">
                      {amendment.status.charAt(0).toUpperCase() + amendment.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Requested: {new Date(amendment.requestDate).toLocaleDateString()}
                    </span>
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
                      {amendment.reason?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Project Overview Section */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
            <CardTitle className="text-gray-800 text-lg">Project Overview</CardTitle>
            <CardDescription className="text-gray-600 text-xs">Comprehensive project statistics and milestones</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <div className="text-lg font-bold text-[#FAAD00]">12</div>
                <div className="text-xs text-gray-600">Active Tasks</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <div className="text-lg font-bold text-blue-600">8</div>
                <div className="text-xs text-gray-600">Team Members</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-green-600">3</div>
                <div className="text-xs text-gray-600">Milestones</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-gray-600">95%</div>
                <div className="text-xs text-gray-600">Quality Score</div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-gradient-to-r from-[#FAAD00]/5 to-transparent rounded-lg border border-[#FAAD00]/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">Next Milestone: Structural Work</h4>
                <Badge variant="warning">In Progress</Badge>
              </div>
              <Progress value={75} className="mb-1" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Expected completion: Dec 15, 2024</span>
                <span>75% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
              <CardTitle className="text-gray-800 flex items-center text-lg">
                <Users className="w-4 h-4 mr-2 text-[#FAAD00]" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs">Latest updates on your construction project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              <div className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Foundation work completed</p>
                  <p className="text-xs text-gray-600">Concrete pouring finished successfully</p>
                  <Badge variant="success" className="mt-1">2 days ago</Badge>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Steel delivery scheduled</p>
                  <p className="text-xs text-gray-600">Materials arriving next Monday</p>
                  <Badge variant="default" className="mt-1">1 week ago</Badge>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Site inspection completed</p>
                  <p className="text-xs text-gray-600">All safety protocols verified</p>
                  <Badge variant="warning" className="mt-1">2 weeks ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
              <CardTitle className="text-gray-800 text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600 text-xs">Common tasks and requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    className="w-full justify-start font-semibold text-gray-800 hover:bg-[#FAAD00]/20 hover:border-[#FAAD00] shadow-sm transition-all duration-300"
                    variant="outline"
                    onClick={() => openModal(action.id)}
                  >
                    <IconComponent className="mr-2 h-5 w-5 text-[#FAAD00]" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Dialog Modal */}
        <Dialog open={activeModal !== null} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[500px] shadow-2xl">
            <DialogHeader className="pb-3 border-b border-gray-100">
              <DialogTitle className="text-lg font-bold text-gray-900">
                {activeModal === 'amendment-request' 
                  ? 'Request Contract Amendment'
                  : quickActions.find((action) => action.id === activeModal)?.title
                }
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                <span className="font-medium text-[#FAAD00]">{projectData.name}</span> - 
                {activeModal === 'amendment-request' 
                  ? ' Submit your contract amendment request'
                  : ' Complete the form below'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">{renderModalContent()}</div>
            <DialogFooter className="pt-3 border-t border-gray-100 gap-2">
              <Button 
                variant="outline" 
                onClick={closeModal} 
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || submitStatus === 'success'}
                className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Success!
                  </>
                ) : (
                  activeModal === 'contract' ? 'Close' : 'Submit'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
