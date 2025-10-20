

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  DollarSign, Upload, FileText, AlertTriangle, CheckCircle,
  Calendar, CreditCard, X, Download, Trash2
} from 'lucide-react';



const CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086/api/v1',
  API_ENDPOINTS: {
    PAYMENT_SUMMARY: (projectId) => `/api/project-owner/materials/payments/${projectId}/summary`,
    PAYMENT_HISTORY: (projectId) => `/api/project-owner/materials/payments/${projectId}/history`,
    UPCOMING_PAYMENTS: (projectId) => `/api/project-owner/materials/payments/${projectId}/upcoming`,
    PAYMENT_RECEIPTS: (projectId) => `/api/project-owner/materials/payments/${projectId}/receipts`,
    UPLOAD_RECEIPT: '/api/project-owner/materials/payments/receipt',
  },

  // File Upload Settings
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
    ALLOWED_EXTENSIONS: ['PDF', 'PNG', 'JPG', 'JPEG'],
    MAX_FILES: 5,
  },

  // UI Messages
  MESSAGES: {
    LOADING: 'Loading payment data...',
    UPLOADING: 'Uploading...',
    UPLOAD_SUCCESS: 'Payment receipt uploaded successfully!',
    UPLOAD_ERROR: 'Failed to upload receipt. Please try again.',
    DELETE_ERROR: 'Failed to delete receipt. Please try again.',
    NETWORK_ERROR: 'Unable to connect to server. Please check your connection.',
    NO_DATA: 'No data available',
  },

  // LocalStorage Keys
  STORAGE_KEYS: {
    PROJECT_ID: 'projectId',
  },
};



/**
 * Format currency with proper localization
 */
const formatCurrency = (amount, currency = 'Rs.') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`;
  }
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${currency}${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format file size to human-readable format
 */
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date to display format
 */
const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Check if a date is overdue
 */
const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  try {
    const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj < now;
  } catch (error) {
    return false;
  }
};

/**
 * Get badge variant based on status
 */
const getStatusVariant = (status) => {
  if (!status) return 'default';
  const statusLower = status.toLowerCase();
  if (statusLower === 'completed' || statusLower === 'paid' || statusLower === 'verified') {
    return 'success';
  }
  if (statusLower === 'pending' || statusLower === 'pending review') {
    return 'warning';
  }
  if (statusLower === 'overdue' || statusLower === 'rejected') {
    return 'danger';
  }
  return 'default';
};

/**
 * Validate file for upload
 */
const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  if (file.size > CONFIG.FILE_UPLOAD.MAX_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(CONFIG.FILE_UPLOAD.MAX_SIZE)}`,
    };
  }
  if (!CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }
  return { valid: true, error: null };
};

/**
 * Validate amount
 */
const validateAmount = (amount) => {
  if (!amount || amount === '') {
    return { valid: false, error: 'Amount is required' };
  }
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount) || numAmount <= 0) {
    return { valid: false, error: 'Amount must be a valid number greater than 0' };
  }
  return { valid: true, error: null };
};

/**
 * Handle API errors and return user-friendly messages
 */
const getErrorMessage = (error) => {
  if (error.message === 'Failed to fetch' || !navigator.onLine) {
    return CONFIG.MESSAGES.NETWORK_ERROR;
  }
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Log errors (can be extended to send to error tracking service)
 */
const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error in ${context}]:`, error);
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    console.error(`[Error in ${context}]:`, error.message);
  }
};



const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({ children, className, variant = 'default', size = 'default', disabled, onClick, type = 'button', ...props }) => {
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
    <button
      type={type}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
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



const Payments = () => {
  // ========== STATE MANAGEMENT ==========

  // Get project ID from localStorage
  const projectId = localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECT_ID) || 'PRJ_001';

  // API Data States
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [paymentReceipts, setPaymentReceipts] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // File Upload States
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptAmountError, setReceiptAmountError] = useState('');

  const fileInputRef = useRef(null);

  
  /**
   * Fetch payment summary from backend
   */
  const fetchPaymentSummary = useCallback(async () => {
    try {
      const url = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.PAYMENT_SUMMARY(projectId)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setPaymentSummary(data.summary);
      } else {
        throw new Error(data.message || 'Failed to fetch payment summary');
      }
    } catch (err) {
      logError(err, 'fetchPaymentSummary');
      setError(getErrorMessage(err));
    }
  }, [projectId]);

  /**
   * Fetch payment history from backend
   */
  const fetchPaymentHistory = useCallback(async () => {
    try {
      const url = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.PAYMENT_HISTORY(projectId)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setPaymentHistory(data.paymentHistory || []);
      } else {
        throw new Error(data.message || 'Failed to fetch payment history');
      }
    } catch (err) {
      logError(err, 'fetchPaymentHistory');
      setError(getErrorMessage(err));
    }
  }, [projectId]);

  /**
   * Fetch upcoming payments from backend
   */
  const fetchUpcomingPayments = useCallback(async () => {
    try {
      const url = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.UPCOMING_PAYMENTS(projectId)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setUpcomingPayments(data.upcomingPayments || []);
      } else {
        throw new Error(data.message || 'Failed to fetch upcoming payments');
      }
    } catch (err) {
      logError(err, 'fetchUpcomingPayments');
      setError(getErrorMessage(err));
    }
  }, [projectId]);

  /**
   * Fetch payment receipts from backend
   */
  const fetchPaymentReceipts = useCallback(async () => {
    try {
      const url = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.PAYMENT_RECEIPTS(projectId)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setPaymentReceipts(data.receipts || []);
      } else {
        throw new Error(data.message || 'Failed to fetch payment receipts');
      }
    } catch (err) {
      logError(err, 'fetchPaymentReceipts');
      setError(getErrorMessage(err));
    }
  }, [projectId]);

  /**
   * Fetch all payment data from backend
   */
  const fetchAllPaymentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchPaymentSummary(),
        fetchPaymentHistory(),
        fetchUpcomingPayments(),
        fetchPaymentReceipts(),
      ]);
    } catch (err) {
      logError(err, 'fetchAllPaymentData');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPaymentSummary, fetchPaymentHistory, fetchUpcomingPayments, fetchPaymentReceipts]);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllPaymentData();
  }, [fetchAllPaymentData]);

 

  /**
   * Handle file selection
   */
  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type.split('/')[1].toUpperCase(),
          status: 'ready',
        });
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      alert(`Some files were rejected:\n${errors.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  /**
   * Remove selected file
   */
  const removeSelectedFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  /**
   * Validate receipt upload form
   */
  const validateReceiptForm = () => {
    if (selectedFiles.length === 0) {
      return 'Please select at least one file to upload';
    }

    const amountValidation = validateAmount(receiptAmount);
    if (!amountValidation.valid) {
      setReceiptAmountError(amountValidation.error);
      return amountValidation.error;
    }

    setReceiptAmountError('');
    return null;
  };

  /**
   * Upload receipt files to backend
   */
  const handleUploadReceipts = async () => {
    const validationError = validateReceiptForm();
    if (validationError) {
      return;
    }

    setIsUploading(true);
    setSubmitStatus(null);

    try {
      for (const fileData of selectedFiles) {
        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append('receiptFile', fileData.file);
        formData.append('projectId', projectId);
        formData.append('amount', receiptAmount);
        formData.append('paymentDate', new Date().toISOString().split('T')[0]);
        formData.append('phase', 'Payment Receipt');
        formData.append('description', `Payment receipt uploaded on ${new Date().toLocaleDateString()}`);
        formData.append('installmentId', '1'); // Note: Can be enhanced to allow installment selection

        setUploadProgress((prev) => ({ ...prev, [fileData.id]: 0 }));

        const url = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.UPLOAD_RECEIPT}`;
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setUploadProgress((prev) => ({ ...prev, [fileData.id]: 100 }));
        } else {
          throw new Error(data.message || CONFIG.MESSAGES.UPLOAD_ERROR);
        }
      }

      // Refresh receipts list
      await fetchPaymentReceipts();

      // Clear form and show success
      setSelectedFiles([]);
      setUploadProgress({});
      setReceiptAmount('');
      setReceiptAmountError('');
      setSubmitStatus('success');

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      logError(err, 'handleUploadReceipts');
      setSubmitStatus('error');
      alert(getErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete uploaded receipt
   */
  const handleDeleteReceipt = async (receiptId) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) {
      return;
    }

    try {
      // Note: Implement delete endpoint when available
      setPaymentReceipts((prev) => prev.filter((r) => r.receiptId !== receiptId));
      alert('Receipt deleted successfully');
    } catch (err) {
      logError(err, 'handleDeleteReceipt');
      alert(CONFIG.MESSAGES.DELETE_ERROR);
    }
  };

  // ========== MODAL FUNCTIONS ==========

  /**
   * Open modal
   */
  const openModal = (modalType) => {
    setActiveModal(modalType);
    setSelectedFiles([]);
    setUploadProgress({});
    setReceiptAmount('');
    setReceiptAmountError('');
    setSubmitStatus(null);
  };

  /**
   * Close modal
   */
  const closeModal = () => {
    setActiveModal(null);
    setSelectedFiles([]);
    setUploadProgress({});
    setReceiptAmount('');
    setReceiptAmountError('');
    setSubmitStatus(null);
  };

  /**
   * Handle receipt amount change
   */
  const handleReceiptAmountChange = (value) => {
    setReceiptAmount(value);
    if (receiptAmountError) {
      setReceiptAmountError('');
    }
  };

  

  /**
   * Get icon color classes
   */
  const getIconColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-500' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-500' },
    };
    return colorMap[color] || colorMap.blue;
  };

  /**
   * Render modal content
   */
  const renderModalContent = () => {
    // Success state
    if (submitStatus === 'success') {
      return (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {CONFIG.MESSAGES.UPLOAD_SUCCESS}
          </h3>
          <p className="text-sm text-gray-600">
            Your payment receipts have been uploaded and will be reviewed by our team.
          </p>
        </div>
      );
    }

    // Upload receipt form
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
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer',
            isDragOver
              ? 'border-[#FAAD00] bg-[#FAAD00]/5'
              : 'border-gray-300 hover:border-[#FAAD00]/50 hover:bg-[#FAAD00]/5'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={cn('mx-auto h-8 w-8', isDragOver ? 'text-[#FAAD00]' : 'text-gray-400')} />
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              {CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')} up to {formatFileSize(CONFIG.FILE_UPLOAD.MAX_SIZE)} each
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={CONFIG.FILE_UPLOAD.ALLOWED_TYPES.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
            {selectedFiles.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fileData.name}</p>
                    <p className="text-xs text-gray-500">
                      {fileData.size} • {fileData.type}
                    </p>
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
            <li>• Accepted formats: {CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}</li>
            <li>• Maximum file size: {formatFileSize(CONFIG.FILE_UPLOAD.MAX_SIZE)} per file</li>
            <li>• Ensure receipts are clear and readable</li>
            <li>• Include transaction details and amounts</li>
          </ul>
        </div>
      </div>
    );
  };

  

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAAD00] mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">{CONFIG.MESSAGES.LOADING}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !paymentSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchAllPaymentData}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Default values
  const summary = paymentSummary || {
    totalBudget: 0,
    amountPaid: 0,
    pendingAmount: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
  };

  const progressPercentage = summary.totalBudget > 0
    ? Math.round((summary.amountPaid / summary.totalBudget) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white">
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Payment Management</h2>
            <p className="text-gray-800 mt-1 font-medium text-sm">Project: {projectId}</p>
          </div>
        </div>

        {/* Payment Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Budget Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Total Budget</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Project total cost</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(summary.totalBudget)}
                    </div>
                    <p className="text-sm text-gray-600">Total project budget</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Paid Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Amount Paid</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Completed payments</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary.amountPaid)}
                    </div>
                    <Progress value={progressPercentage} className="mt-2" />
                    <p className="text-sm text-gray-600 mt-1">{progressPercentage}% completed</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Amount Card */}
          <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Pending Amount</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Remaining payments</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-[#FAAD00]">
                      {formatCurrency(summary.pendingAmount)}
                    </div>
                    <p className="text-sm text-gray-600">Amount remaining</p>
                  </div>
                  <div className="p-2 bg-[#FAAD00]/10 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-[#FAAD00]" />
                  </div>
                </div>
                <Button
                  className="w-full bg-[#FAAD00] hover:bg-[#FAAD00]/90"
                  onClick={() => openModal('upload-receipt')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History and Upcoming Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment History Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Payment History</CardTitle>
              <CardDescription className="text-gray-600 text-sm">All completed payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <div
                    key={payment.installmentId}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-green-50 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600">Installment #{payment.installmentId}</p>
                        <p className="text-sm text-[#FAAD00] font-medium">
                          Due: {formatDate(payment.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusVariant(payment.status)} className="mb-1">
                        {payment.status}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {payment.paidDate ? formatDate(payment.paidDate) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{CONFIG.MESSAGES.NO_DATA}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Payments Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Upcoming Payments</CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Scheduled payment milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {upcomingPayments.length > 0 ? (
                upcomingPayments.map((payment) => {
                  const overdueStatus = isOverdue(payment.dueDate);
                  return (
                    <div
                      key={payment.installmentId}
                      className={cn(
                        'flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200',
                        overdueStatus
                          ? 'bg-gradient-to-r from-white to-red-50'
                          : 'bg-gradient-to-r from-white to-amber-50'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn('p-2 rounded-full', overdueStatus ? 'bg-red-100' : 'bg-amber-100')}
                        >
                          <AlertTriangle
                            className={cn('h-5 w-5', overdueStatus ? 'text-red-500' : 'text-amber-500')}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-600">Installment #{payment.installmentId}</p>
                          <p className="text-sm text-[#FAAD00] font-medium">
                            Plan #{payment.paymentPlanId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={overdueStatus ? 'danger' : 'warning'} className="mb-1">
                          {overdueStatus ? 'Overdue' : payment.status}
                        </Badge>
                        <p className="text-sm text-gray-600">Due: {formatDate(payment.dueDate)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming payments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Confirmations Section */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
            <CardTitle className="text-gray-800 text-lg">Payment Confirmations</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Submit payment receipts and confirmations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Upload Prompt */}
            <div className="border-2 border-dashed border-[#FAAD00]/30 rounded-lg p-6 text-center bg-gradient-to-br from-[#FAAD00]/5 to-white hover:border-[#FAAD00]/50 transition-colors">
              <div className="p-3 bg-[#FAAD00]/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-[#FAAD00]" />
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-800">Upload Payment Receipt</p>
                <p className="text-sm text-gray-600 mt-1">
                  Drag and drop your payment receipt or click to browse
                </p>
              </div>
              <Button
                className="mt-4 bg-[#FAAD00] hover:bg-[#FAAD00]/90"
                onClick={() => openModal('upload-receipt')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>

            {/* Uploaded Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentReceipts.length > 0 ? (
                paymentReceipts.map((file) => {
                  const iconColors = getIconColorClasses('blue');
                  return (
                    <div
                      key={file.receiptId}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${iconColors.bg} rounded-full`}>
                          <FileText className={`h-5 w-5 ${iconColors.text}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.phase || 'Payment Receipt'}</p>
                          <p className="text-sm text-gray-600">Uploaded {formatDate(file.uploadedDate)}</p>
                          {file.amount > 0 && (
                            <p className="text-sm text-[#FAAD00] font-medium">
                              {formatCurrency(file.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusVariant(file.status)}>{file.status}</Badge>
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
                            onClick={() => handleDeleteReceipt(file.receiptId)}
                            title="Delete Document"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <p>No payment receipts uploaded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary Section */}
        <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
            <CardTitle className="text-gray-800 text-lg">Payment Summary</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Overview of payment progress and milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.completedPayments || 0}
                </div>
                <div className="text-sm text-gray-600">Completed Payments</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">
                  {summary.pendingPayments || 0}
                </div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{paymentReceipts.length}</div>
                <div className="text-sm text-gray-600">Uploaded Receipts</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <div className="text-2xl font-bold text-[#FAAD00]">{progressPercentage}%</div>
                <div className="text-sm text-gray-600">Payment Progress</div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#FAAD00]/5 to-transparent rounded-lg border border-[#FAAD00]/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Overall Payment Progress</h4>
                <span className="text-sm font-medium text-[#FAAD00]">
                  {formatCurrency(summary.amountPaid)} / {formatCurrency(summary.totalBudget)}
                </span>
              </div>
              <Progress value={progressPercentage} className="mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {upcomingPayments.length > 0
                    ? `Next payment due: ${formatDate(upcomingPayments[0].dueDate)}`
                    : 'No upcoming payments'}
                </span>
                <span>{progressPercentage}% Complete</span>
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
                Upload Payment Receipt
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                <span className="font-medium text-[#FAAD00]">Project {projectId}</span> - Upload your
                payment receipt documents with amount
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">{renderModalContent()}</div>
            {submitStatus !== 'success' && (
              <DialogFooter className="pt-3 border-t border-gray-100 gap-2">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadReceipts}
                  disabled={isUploading || selectedFiles.length === 0 || !receiptAmount}
                  className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {CONFIG.MESSAGES.UPLOADING}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </>
                  )}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Payments;
