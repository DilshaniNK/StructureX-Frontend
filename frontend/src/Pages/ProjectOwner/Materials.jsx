"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Truck, CheckCircle, Clock, AlertCircle, Package, DollarSign, TrendingUp, Plus, X } from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// UI Components (matching Dashboard.jsx style)
const Button = ({ children, className, variant = 'default', size = 'default', disabled, onClick, ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:shadow-md';

  const variants = {
    default: 'bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 hover:bg-[#FAAD00]/10 hover:text-gray-900 bg-white',
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

const Badge = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm',
    success: 'bg-green-100 text-green-800 border-green-200 shadow-sm',
    warning: 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm',
    danger: 'bg-red-100 text-red-800 border-red-200 shadow-sm',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200 shadow-sm',
    outline: 'bg-white text-gray-800 border-gray-300 shadow-sm',
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

const Materials = () => {
  // State Management
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
  const [siteVisits, setSiteVisits] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialSummary, setMaterialSummary] = useState(null);

  // Loading and Error States
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [isLoadingSiteVisits, setIsLoadingSiteVisits] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    visitType: '',
    date: '',
    timeSlot: '',
    purpose: ''
  });

  // Form errors state
  const [formErrors, setFormErrors] = useState({});

  // Form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get projectId from localStorage
  const projectId = localStorage.getItem('projectId') || 'PRJ_001';
  const API_BASE_URL = 'http://localhost:8086/api/project-owner/materials';

  // API Functions
  const fetchMaterials = async () => {
    try {
      setIsLoadingMaterials(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/${projectId}`);
      const data = await response.json();

      if (data.success) {
        setMaterials(data.materials || []);
      } else {
        setError(data.message || 'Failed to fetch materials');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Error connecting to server. Please try again later.');
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  const fetchMaterialSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/summary`);
      const data = await response.json();

      if (data.success) {
        setMaterialSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching material summary:', error);
    }
  };

  const fetchSiteVisits = async () => {
    try {
      setIsLoadingSiteVisits(true);
      const response = await fetch(`${API_BASE_URL}/site-visits/${projectId}`);
      const data = await response.json();

      if (data.success) {
        setSiteVisits(data.siteVisits || []);
      }
    } catch (error) {
      console.error('Error fetching site visits:', error);
    } finally {
      setIsLoadingSiteVisits(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMaterials();
    fetchMaterialSummary();
    fetchSiteVisits();
  }, [projectId]);

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.visitType.trim()) {
      errors.visitType = 'Visit type is required';
    }

    if (!formData.date.trim()) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.timeSlot.trim()) {
      errors.timeSlot = 'Time slot is required';
    }

    if (!formData.purpose.trim()) {
      errors.purpose = 'Purpose/Notes is required';
    } else if (formData.purpose.trim().length < 10) {
      errors.purpose = 'Purpose must be at least 10 characters long';
    }

    return errors;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmitSiteVisit = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare site visit data for backend
      const siteVisitData = {
        projectId: projectId,
        visitType: getVisitTypeLabel(formData.visitType),
        visitDate: formData.date,
        visitTime: getTimeSlotLabel(formData.timeSlot),
        purpose: formData.purpose.trim(),
        status: "Requested"
      };

      const response = await fetch(`${API_BASE_URL}/site-visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteVisitData)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh site visits list
        await fetchSiteVisits();

        // Reset form
        setFormData({
          visitType: '',
          date: '',
          timeSlot: '',
          purpose: ''
        });

        // Close modal
        setShowSiteVisitModal(false);

        // Show success message
        alert(data.message || 'Site visit request submitted successfully!');
      } else {
        alert(data.message || 'Error submitting request. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting site visit request:', error);
      alert('Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions
  const getVisitTypeLabel = (value) => {
    const types = {
      'inspection': 'Site Inspection',
      'progress': 'Progress Review',
      'quality': 'Quality Check',
      'meeting': 'Client Meeting'
    };
    return types[value] || value;
  };

  const getTimeSlotLabel = (value) => {
    const slots = {
      'morning': '10:00 AM',
      'afternoon': '2:00 PM',
      'evening': '5:30 PM'
    };
    return slots[value] || value;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "In Transit":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "Ordered":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "default";
      case "Ordered":
        return "warning";
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Requested":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100";
      case "In Transit":
        return "bg-blue-100";
      case "Ordered":
        return "bg-amber-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white">
      <div className="space-y-4 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Materials & Supplies</h2>
            <p className="text-gray-800 mt-1 font-medium text-sm">Track materials and site visits for your construction project</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Delivered</CardTitle>
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">
                {isLoadingMaterials ? '...' : (materialSummary?.deliveredCount || materials.filter((m) => m.status === "Delivered").length)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Materials received</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">In Transit</CardTitle>
              <div className="p-1 bg-blue-100 rounded-full">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-600">
                {isLoadingMaterials ? '...' : (materialSummary?.inTransitCount || materials.filter((m) => m.status === "In Transit").length)}
              </div>
              <p className="text-xs text-gray-600 mt-1">On the way</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 hover:border-l-amber-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
              <div className="p-1 bg-amber-100 rounded-full">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-amber-600">
                {isLoadingMaterials ? '...' : (materialSummary?.pendingCount || materials.filter((m) => m.status === "Pending" || m.status === "Ordered").length)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Awaiting delivery</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FAAD00] hover:border-l-[#FAAD00]/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Cost</CardTitle>
              <div className="p-1 bg-[#FAAD00]/10 rounded-full">
                <DollarSign className="h-4 w-4 text-[#FAAD00]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-[#FAAD00]">
                {isLoadingMaterials ? '...' : `Rs.${materialSummary?.totalCost || '0'}`}
              </div>
              <p className="text-xs text-gray-600 mt-1">Material expenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Materials List */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
            <CardTitle className="text-gray-800 text-lg flex items-center">
              <Package className="w-4 h-4 mr-2 text-[#FAAD00]" />
              Materials Inventory
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs">Track all materials used in your construction project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            {isLoadingMaterials ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAAD00] mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading materials...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No materials found for this project</p>
              </div>
            ) : (
              materials.map((material, index) => (
                <div key={material.materialId || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50/30 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getStatusColor(material.status)} rounded-full flex items-center justify-center shadow-sm`}>
                      {getStatusIcon(material.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{material.materialName || material.name}</p>
                      <p className="text-xs text-gray-600">Brand: {material.brand}</p>
                      <p className="text-xs text-gray-600">Quantity: {material.quantity} {material.unit || ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      material.status === "Delivered" ? "success" :
                      material.status === "In Transit" ? "default" :
                      material.status === "Ordered" ? "warning" : "secondary"
                    }>
                      {material.status}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">{material.deliveryDate}</p>
                    <p className="text-sm font-semibold text-[#FAAD00] mt-1">Rs.{material.cost || material.totalCost}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Summary Cards Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Material Summary */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
              <CardTitle className="text-gray-800 text-lg flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-[#FAAD00]" />
                Material Summary
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs">Overview of material status and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <span className="text-sm font-semibold text-gray-800">Total Materials</span>
                <span className="text-2xl font-bold text-[#FAAD00]">{materials.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-700">Delivered</span>
                <span className="text-lg font-semibold text-green-600">
                  {materials.filter((m) => m.status === "Delivered").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-700">In Transit</span>
                <span className="text-lg font-semibold text-blue-600">
                  {materials.filter((m) => m.status === "In Transit").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium text-gray-700">Pending</span>
                <span className="text-lg font-semibold text-amber-600">
                  {materials.filter((m) => m.status === "Pending" || m.status === "Ordered").length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Material Costs */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
              <CardTitle className="text-gray-800 text-lg flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-[#FAAD00]" />
                Material Costs
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs">Cost breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {isLoadingMaterials ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAAD00] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading cost data...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50/30">
                    <span className="font-semibold text-gray-800">Raw Materials</span>
                    <span className="font-bold text-gray-900">Rs.{materialSummary?.rawMaterialsCost || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50/30">
                    <span className="font-semibold text-gray-800">Finishing Materials</span>
                    <span className="font-bold text-gray-900">Rs.{materialSummary?.finishingMaterialsCost || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/30">
                    <span className="font-semibold text-gray-800">Total Material Cost</span>
                    <span className="font-bold text-[#FAAD00] text-lg">Rs.{materialSummary?.totalCost || '0'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Site Visit Requests */}
        <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-3">
            <CardTitle className="text-gray-800 text-lg flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[#FAAD00]" />
              Site Visit Requests ({isLoadingSiteVisits ? '...' : siteVisits.length})
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs">Schedule and track your site visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            <Button
              className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setShowSiteVisitModal(true)}
              disabled={isLoadingSiteVisits}
            >
              <Plus className="mr-2 h-4 w-4" />
              Request New Site Visit
            </Button>
            <div className="space-y-2">
              {isLoadingSiteVisits ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAAD00] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading site visits...</p>
                </div>
              ) : siteVisits.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No site visits scheduled yet</p>
                  <p className="text-xs text-gray-500 mt-1">Click the button above to request a new site visit</p>
                </div>
              ) : (
                siteVisits.map((visit) => (
                  <div key={visit.visitId || visit.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50/30 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{visit.visitType || visit.type}</p>
                        <p className="text-xs text-gray-600">
                          {visit.visitDate || visit.date} at {visit.visitTime || visit.time}
                        </p>
                        {visit.requestedBy && (
                          <p className="text-xs text-gray-500">Requested by {visit.requestedBy}</p>
                        )}
                        {visit.purpose && (
                          <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            Purpose: {visit.purpose}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(visit.status)}>
                      {visit.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Site Visit Request Modal */}
        <Dialog open={showSiteVisitModal} onOpenChange={setShowSiteVisitModal}>
          <DialogContent className="sm:max-w-[500px] shadow-2xl">
            <DialogHeader className="pb-3 border-b border-gray-100">
              <DialogTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#FAAD00]" />
                Request Site Visit
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                Schedule a visit to your construction site
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Visit Type *</label>
                <select 
                  className={`w-full h-9 rounded-md border ${formErrors.visitType ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm focus:border-[#FAAD00] focus:ring-2 focus:ring-[#FAAD00] focus:ring-offset-2`}
                  value={formData.visitType}
                  onChange={(e) => handleInputChange('visitType', e.target.value)}
                >
                  <option value="">Select visit type</option>
                  <option value="inspection">Site Inspection</option>
                  <option value="progress">Progress Review</option>
                  <option value="quality">Quality Check</option>
                  <option value="meeting">Client Meeting</option>
                </select>
                {formErrors.visitType && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.visitType}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Preferred Date *</label>
                <input 
                  type="date" 
                  className={`w-full h-9 rounded-md border ${formErrors.date ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm focus:border-[#FAAD00] focus:ring-2 focus:ring-[#FAAD00] focus:ring-offset-2`}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {formErrors.date && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Preferred Time *</label>
                <select 
                  className={`w-full h-9 rounded-md border ${formErrors.timeSlot ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm focus:border-[#FAAD00] focus:ring-2 focus:ring-[#FAAD00] focus:ring-offset-2`}
                  value={formData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                >
                  <option value="">Select time slot</option>
                  <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                  <option value="evening">Evening (5:00 PM - 7:00 PM)</option>
                </select>
                {formErrors.timeSlot && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.timeSlot}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Purpose/Notes *</label>
                <textarea 
                  className={`w-full min-h-[80px] rounded-md border ${formErrors.purpose ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm focus:border-[#FAAD00] focus:ring-2 focus:ring-[#FAAD00] focus:ring-offset-2 resize-none`}
                  placeholder="Describe the purpose of your visit... (minimum 10 characters)"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                />
                {formErrors.purpose && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.purpose}</p>
                )}
                <p className="text-xs text-gray-500">
                  {formData.purpose.length}/10 characters minimum
                </p>
              </div>
            </div>
            <DialogFooter className="pt-3 border-t border-gray-100 gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSiteVisitModal(false);
                  setFormData({
                    visitType: '',
                    date: '',
                    timeSlot: '',
                    purpose: ''
                  });
                  setFormErrors({});
                }}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitSiteVisit}
                disabled={isSubmitting}
                className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Materials;

