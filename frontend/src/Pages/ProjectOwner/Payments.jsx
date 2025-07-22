import React, { useState, useRef } from 'react';
import { DollarSign, Upload, FileText, AlertTriangle, CheckCircle, Calendar, CreditCard, X, Download, Trash2 } from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// UI Components (matching Project.jsx style)
const Button = ({ children, className, variant = 'default', size = 'default', disabled, onClick, ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:shadow-md';

  const variants = {
    default: 'bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 hover:bg-[#FAAD00]/10 hover:text-gray-900 bg-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    default: 'h-11 py-2 px-4',
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
    secondary: 'bg-gray-100 text-gray-800 border-gray-200 shadow-sm',
    outline: 'bg-white text-gray-600 border-gray-300 shadow-sm',
    success: 'bg-green-100 text-green-800 border-green-200 shadow-sm',
    warning: 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm',
    inProgress: 'bg-[#FAAD00]/20 text-[#FAAD00] border-[#FAAD00]/30 shadow-sm',
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

// Form Components
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

const Payments = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Bank Transfer Receipt', date: '2024-01-15', status: 'Verified', amount: 25000, size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'Check Payment Copy', date: '2024-01-01', status: 'Verified', amount: 30000, size: '1.8 MB', type: 'JPG' },
  ]);
  
  // File upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptAmountError, setReceiptAmountError] = useState('');
  const fileInputRef = useRef(null);

  const projectData = {
    name: 'Luxury Villa Construction',
    totalBudget: 250000,
    paidAmount: 150000,
    pendingAmount: 100000,
  };

  const recentPayments = [
    { id: 1, amount: 25000, date: "2024-01-15", status: "Completed", description: "Foundation work", phase: "Phase 3" },
    { id: 2, amount: 30000, date: "2024-01-01", status: "Completed", description: "Site preparation", phase: "Phase 2" },
    { id: 3, amount: 20000, date: "2023-12-15", status: "Completed", description: "Initial payment", phase: "Phase 1" },
    { id: 4, amount: 75000, date: "2023-12-01", status: "Completed", description: "Contract signing", phase: "Initial" },
  ];

  const upcomingPayments = [
    { id: 1, amount: 35000, dueDate: "2024-02-01", description: "Roofing work completion", phase: "Phase 4" },
    { id: 2, amount: 40000, dueDate: "2024-02-15", description: "Electrical & Plumbing", phase: "Phase 5" },
    { id: 3, amount: 25000, dueDate: "2024-03-01", description: "Final completion", phase: "Phase 6" },
  ];

  // File upload functions
  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== fileArray.length) {
      alert('Some files were rejected. Please ensure files are PDF, PNG, or JPG and under 10MB.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type.split('/')[1].toUpperCase(),
      status: 'ready'
    }))]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeSelectedFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const validateReceiptUpload = () => {
    if (selectedFiles.length === 0) {
      return 'Please select at least one file to upload';
    }
    
    if (!receiptAmount || parseFloat(receiptAmount) <= 0) {
      setReceiptAmountError('Please enter a valid payment amount');
      return 'Payment amount is required';
    }
    
    setReceiptAmountError('');
    return null;
  };

  const uploadFiles = async () => {
    const validationError = validateReceiptUpload();
    if (validationError) {
      return;
    }

    setIsSubmitting(true);
    
    for (const fileData of selectedFiles) {
      try {
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }));
        
        // Simulate upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }));
        }

        // Add to uploaded files with the entered amount
        const newUploadedFile = {
          id: Date.now() + Math.random(),
          name: fileData.name,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending Review',
          amount: parseFloat(receiptAmount),
          size: fileData.size,
          type: fileData.type
        };

        setUploadedFiles(prev => [newUploadedFile, ...prev]);
        
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    // Clear selected files and reset states
    setSelectedFiles([]);
    setUploadProgress({});
    setReceiptAmount('');
    setReceiptAmountError('');
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  const deleteUploadedFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

    const openModal = (modalType) => {
    setActiveModal(modalType);
    setFormData({});
    setErrors({});
    setSubmitStatus(null);
    setSelectedFiles([]);
    setUploadProgress({});
    setReceiptAmount('');
    setReceiptAmountError('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({});
    setErrors({});
    setSubmitStatus(null);
    setIsSubmitting(false);
    setSelectedFiles([]);
    setUploadProgress({});
    setReceiptAmount('');
    setReceiptAmountError('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleReceiptAmountChange = (value) => {
    setReceiptAmount(value);
    if (receiptAmountError) {
      setReceiptAmountError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      newErrors.paymentAmount = 'Valid payment amount is required';
    }
    if (!formData.transactionId || formData.transactionId.trim().length < 5) {
      newErrors.transactionId = 'Transaction ID must be at least 5 characters';
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';

    return newErrors;
  };

  const handleSubmit = async () => {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setSubmitStatus('success');
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

  // Get icon color classes (matching Project.jsx style)
  const getIconColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-500' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-500' },
    };
    return colorMap[color] || colorMap.blue;
  };

  const renderModalContent = () => {
    if (submitStatus === 'success') {
      return (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeModal === 'upload-receipt' ? 'Files Uploaded Successfully!' : 'Payment Submitted Successfully!'}
          </h3>
          <p className="text-sm text-gray-600">
            {activeModal === 'upload-receipt' 
              ? 'Your payment receipts have been uploaded and will be reviewed by our team.'
              : 'Your payment confirmation has been submitted and will be verified by our team.'
            }
          </p>
        </div>
      );
    }

    if (activeModal === 'upload-receipt') {
      return (
        <div className="space-y-4">
          {/* Payment Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="receipt-amount" className="text-sm font-semibold text-gray-700">
              Payment Amount (Rs.) *
            </Label>
            <Input
              id="receipt-amount"
              type="number"
              placeholder="Enter payment amount"
              error={receiptAmountError}
              value={receiptAmount}
              onChange={(e) => handleReceiptAmountChange(e.target.value)}
              className="w-full"
            />
            {receiptAmountError && <p className="text-xs text-red-600">{receiptAmountError}</p>}
            <p className="text-xs text-gray-500">Enter the amount shown on your payment receipt</p>
          </div>

          {/* File Upload Area */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
              isDragOver 
                ? "border-[#FAAD00] bg-[#FAAD00]/5" 
                : "border-gray-300 hover:border-[#FAAD00]/50 hover:bg-[#FAAD00]/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className={cn("mx-auto h-8 w-8", isDragOver ? "text-[#FAAD00]" : "text-gray-400")} />
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">
                {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
              {selectedFiles.map((fileData) => (
                <div key={fileData.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{fileData.name}</p>
                      <p className="text-xs text-gray-500">{fileData.size} • {fileData.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadProgress[fileData.id] !== undefined ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#FAAD00] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress[fileData.id]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{uploadProgress[fileData.id]}%</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedFile(fileData.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Upload Guidelines:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Enter the exact payment amount from your receipt</li>
              <li>• Accepted formats: PDF, PNG, JPG, JPEG</li>
              <li>• Maximum file size: 10MB per file</li>
              <li>• Ensure receipts are clear and readable</li>
              <li>• Include transaction details and amounts</li>
            </ul>
          </div>
        </div>
      );
    }

    // Payment form content
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="payment-amount" className="text-sm font-semibold text-gray-700">
            Payment Amount (Rs.)
          </Label>
          <Input
            id="payment-amount"
            type="number"
            placeholder="Enter amount"
            error={errors.paymentAmount}
            value={formData.paymentAmount || ''}
            onChange={(e) => handleInputChange('paymentAmount', parseFloat(e.target.value))}
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
        <div className="space-y-1">
          <Label htmlFor="payment-date" className="text-sm font-semibold text-gray-700">
            Payment Date
          </Label>
          <Input
            id="payment-date"
            type="date"
            error={errors.paymentDate}
            value={formData.paymentDate || ''}
            onChange={(e) => handleInputChange('paymentDate', e.target.value)}
          />
          {errors.paymentDate && <p className="text-xs text-red-600">{errors.paymentDate}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white">
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Payment Management</h2>
            <p className="text-gray-800 mt-1 font-medium text-sm">{projectData.name}</p>
          </div>
        </div>

        {/* Payment Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Total Budget</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Project total cost</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">Rs.{projectData.totalBudget.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Total project budget</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Amount Paid</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Completed payments</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">Rs.{projectData.paidAmount.toLocaleString()}</div>
                    <Progress value={(projectData.paidAmount / projectData.totalBudget) * 100} className="mt-2" />
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round((projectData.paidAmount / projectData.totalBudget) * 100)}% completed
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Pending Amount</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Remaining payments</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-[#FAAD00]">Rs.{projectData.pendingAmount.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Amount remaining</p>
                  </div>
                  <div className="p-2 bg-[#FAAD00]/10 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-[#FAAD00]" />
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#FAAD00] hover:bg-[#FAAD00]/90"
                  onClick={() => openModal('submit-payment')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History and Upcoming Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Payment History</CardTitle>
              <CardDescription className="text-gray-600 text-sm">All completed payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-green-50 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Rs.{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <p className="text-sm text-[#FAAD00] font-medium">{payment.phase}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" className="mb-1">
                      {payment.status}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {payment.date}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Upcoming Payments</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Scheduled payment milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-amber-50 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Rs.{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <p className="text-sm text-[#FAAD00] font-medium">{payment.phase}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning" className="mb-1">
                      Due Soon
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {payment.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Payment Confirmations */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
            <CardTitle className="text-gray-800 text-lg">Payment Confirmations</CardTitle>
            <CardDescription className="text-gray-600 text-sm">Submit payment receipts and confirmations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="border-2 border-dashed border-[#FAAD00]/30 rounded-lg p-6 text-center bg-gradient-to-br from-[#FAAD00]/5 to-white hover:border-[#FAAD00]/50 transition-colors">
              <div className="p-3 bg-[#FAAD00]/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-[#FAAD00]" />
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-800">Upload Payment Receipt</p>
                <p className="text-sm text-gray-600 mt-1">Drag and drop your payment receipt or click to browse</p>
              </div>
              <Button 
                className="mt-4 bg-[#FAAD00] hover:bg-[#FAAD00]/90"
                onClick={() => openModal('upload-receipt')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.map((file) => {
                const iconColors = getIconColorClasses('blue');
                return (
                  <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${iconColors.bg} rounded-full`}>
                        <FileText className={`h-5 w-5 ${iconColors.text}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">Uploaded {file.date}</p>
                        {file.amount > 0 && (
                          <p className="text-sm text-[#FAAD00] font-medium">Rs.{file.amount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={file.status === 'Verified' ? 'success' : 'warning'}>
                        {file.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300"
                          title="Download Document"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-red-50 hover:border-red-300"
                          onClick={() => deleteUploadedFile(file.id)}
                          title="Delete Document"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
            <CardTitle className="text-gray-800 text-lg">Payment Summary</CardTitle>
            <CardDescription className="text-gray-600 text-sm">Overview of payment progress and milestones</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{recentPayments.length}</div>
                <div className="text-sm text-gray-600">Completed Payments</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">{upcomingPayments.length}</div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{uploadedFiles.length}</div>
                <div className="text-sm text-gray-600">Verified Receipts</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <div className="text-2xl font-bold text-[#FAAD00]">
                  {Math.round((projectData.paidAmount / projectData.totalBudget) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Payment Progress</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[#FAAD00]/5 to-transparent rounded-lg border border-[#FAAD00]/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Overall Payment Progress</h4>
                <span className="text-sm font-medium text-[#FAAD00]">
                  Rs.{projectData.paidAmount.toLocaleString()} / Rs.{projectData.totalBudget.toLocaleString()}
                </span>
              </div>
              <Progress value={(projectData.paidAmount / projectData.totalBudget) * 100} className="mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Next payment due: Feb 1, 2024</span>
                <span>{Math.round((projectData.paidAmount / projectData.totalBudget) * 100)}% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Modal */}
        <Dialog open={activeModal !== null} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[500px] shadow-2xl">
            <DialogHeader className="pb-3 border-b border-gray-100">
              <DialogTitle className="text-lg font-bold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#FAAD00]" />
                {activeModal === 'submit-payment' ? 'Submit Payment Confirmation' : 'Upload Payment Receipt'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                <span className="font-medium text-[#FAAD00]">{projectData.name}</span> - 
                {activeModal === 'submit-payment' 
                  ? ' Provide payment details for verification'
                  : ' Upload your payment receipt documents with amount'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {renderModalContent()}
            </div>
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
                onClick={activeModal === 'upload-receipt' ? uploadFiles : handleSubmit}
                disabled={isSubmitting || submitStatus === 'success' || (activeModal === 'upload-receipt' && (selectedFiles.length === 0 || !receiptAmount))}
                                className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {activeModal === 'upload-receipt' ? 'Uploading...' : 'Submitting...'}
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Success!
                  </>
                ) : (
                  activeModal === 'upload-receipt' ? 'Upload Files' : 'Submit Payment'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Payments;

