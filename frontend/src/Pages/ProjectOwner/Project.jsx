import React, { useState } from 'react';
import { Eye, Download, FileText, Upload, X, Plus } from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// UI Components (matching Dashboard.jsx style)
const Button = ({ children, className, variant = 'default', size = 'default', disabled, onClick, ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:shadow-md';

  const variants = {
    default: 'bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 hover:bg-[#FAAD00]/10 hover:text-gray-900 bg-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
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

// File Upload Modal Component
const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) return;

    setIsUploading(true);
    
    try {
      // Simulate upload process - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocument = {
        id: Date.now(),
        name: documentName,
        lastUpdated: "Just uploaded",
        pdfPath: URL.createObjectURL(selectedFile),
        iconColor: "blue",
        file: selectedFile
      };
      
      onUpload(newDocument);
      
      // Reset form
      setSelectedFile(null);
      setDocumentName('');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#FAAD00] transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to select file"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </span>
              </label>
            </div>
          </div>

          {/* Document Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
            />
          </div>

          {/* Upload Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1"
              disabled={!selectedFile || !documentName.trim() || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Project = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [projectDocuments, setProjectDocuments] = useState([
    {
      id: 1,
      name: "Architectural Plans",
      lastUpdated: "Updated 2 days ago",
      pdfPath: "/documents/architectural-plans.pdf",
      iconColor: "blue",
    },
    {
      id: 2,
      name: "Construction Contract",
      lastUpdated: "Signed on Dec 1, 2023",
      pdfPath: "/documents/construction-contract.pdf",
      iconColor: "green",
    },
    {
      id: 3,
      name: "Structural Drawings",
      lastUpdated: "Updated 1 week ago",
      pdfPath: "/documents/structural-drawings.pdf",
      iconColor: "purple",
    },
  ]);

  const projectData = {
    name: "Luxury Villa Construction",
    progress: 65,
    remainingDays: 45,
    totalBudget: 250000,
    paidAmount: 150000,
    pendingAmount: 100000,
  };

  // Work progress timeline data
  const workProgressItems = [
    {
      id: 1,
      title: "Electrical Installation",
      expectedCompletion: "Feb 15, 2024",
      status: "in-progress",
      daysRemaining: 15,
    },
    {
      id: 2,
      title: "Plumbing Work",
      expectedCompletion: "Feb 28, 2024",
      status: "pending",
      daysRemaining: 28,
    },
    {
      id: 3,
      title: "Interior Painting",
      expectedCompletion: "Mar 15, 2024",
      status: "pending",
      daysRemaining: 45,
    },
    {
      id: 4,
      title: "Foundation Work",
      expectedCompletion: "Completed on Jan 10, 2024",
      status: "completed",
      daysRemaining: 0,
    },
  ];

  // Handle document upload
  const handleDocumentUpload = (newDocument) => {
    setProjectDocuments(prev => [...prev, newDocument]);
  };

  // Handle document view
  const handleViewDocument = (pdfPath) => {
    window.open(pdfPath, '_blank');
  };

  // Handle document download
  const handleDownloadDocument = (pdfPath, fileName) => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle document delete
  const handleDeleteDocument = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setProjectDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  // Get status badge variant and background color
  const getStatusStyling = (status) => {
    switch (status) {
      case 'completed':
        return {
          badgeVariant: 'success',
          bgClass: 'bg-gradient-to-r from-white to-green-50',
          borderClass: 'border-green-200',
        };
      case 'in-progress':
        return {
          badgeVariant: 'inProgress',
          bgClass: 'bg-gradient-to-r from-white to-[#FAAD00]/10',
          borderClass: 'border-[#FAAD00]/30',
        };
      case 'pending':
        return {
          badgeVariant: 'outline',
          bgClass: 'bg-gradient-to-r from-white to-gray-50',
          borderClass: 'border-gray-200',
        };
      default:
        return {
          badgeVariant: 'outline',
          bgClass: 'bg-gradient-to-r from-white to-gray-50',
          borderClass: 'border-gray-200',
        };
    }
  };

  // Get icon color classes
  const getIconColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-500' },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAAD00]/90 via-[#FAAD00]/45 to-white">
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Project Details</h2>
            <p className="text-gray-800 mt-1 font-medium text-sm">{projectData.name}</p>
          </div>
        </div>

        {/* Project Overview Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
            <CardTitle className="text-gray-800 text-lg">Project Overview</CardTitle>
            <CardDescription className="text-gray-600 text-sm">{projectData.name}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-[#FAAD00]/10 to-[#FAAD00]/5 rounded-lg border border-[#FAAD00]/20">
                <h4 className="font-semibold mb-2 text-gray-800">Progress</h4>
                <Progress value={projectData.progress} className="mb-2" />
                <p className="text-sm text-gray-600">{projectData.progress}% Complete</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 text-gray-800">Timeline</h4>
                <p className="text-2xl font-bold text-blue-600">{projectData.remainingDays}</p>
                <p className="text-sm text-gray-600">Days remaining</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-gray-800">Budget Status</h4>
                <p className="text-lg font-semibold text-green-600">Rs.{projectData.paidAmount.toLocaleString()} paid</p>
                <p className="text-sm text-gray-600">Rs.{projectData.pendingAmount.toLocaleString()} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents and Phases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Documents */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800 text-lg">Project Documents</CardTitle>
                  <CardDescription className="text-gray-600 text-sm">Plans, drawings, and contracts</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {projectDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No documents uploaded yet</p>
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Document
                  </Button>
                </div>
              ) : (
                projectDocuments.map((document) => {
                  const iconColors = getIconColorClasses(document.iconColor);
                  return (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${iconColors.bg} rounded-full`}>
                          <FileText className={`h-5 w-5 ${iconColors.text}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{document.name}</p>
                          <p className="text-sm text-gray-600">{document.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleViewDocument(document.pdfPath)}
                          title="View Document"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-green-50 hover:border-green-300"
                          onClick={() => handleDownloadDocument(document.pdfPath, document.name)}
                          title="Download Document"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:border-red-300 text-red-600"
                          onClick={() => handleDeleteDocument(document.id)}
                          title="Delete Document"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Construction Phases */}
          <Card className="shadow-lg border border-[#FAAD00]/20 bg-gradient-to-br from-white to-[#FAAD00]/5">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
              <CardTitle className="text-gray-800 text-lg">Construction Phases</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Current and upcoming work phases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Foundation & Structure</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <Badge variant="success">100%</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-[#FAAD00]/10 rounded-lg border border-[#FAAD00]/30">
                <div className="w-4 h-4 bg-[#FAAD00] rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Roofing & Walls</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <Badge variant="inProgress">65%</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-4 h-4 bg-gray-300 rounded-full shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Interior Work</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
                <Badge variant="outline">0%</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-4 h-4 bg-gray-300 rounded-full shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Finishing & Handover</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
                <Badge variant="outline">0%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Progress Timeline */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-200 p-4">
            <CardTitle className="text-gray-800 text-lg">Work Progress Timeline</CardTitle>
            <CardDescription className="text-gray-600 text-sm">Detailed timeline of remaining work</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {workProgressItems.map((item) => {
                const styling = getStatusStyling(item.status);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 ${styling.bgClass} ${styling.borderClass}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        {item.status === 'completed' 
                          ? item.expectedCompletion 
                          : `Expected completion: ${item.expectedCompletion}`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={styling.badgeVariant} className="mb-1">
                        {item.status === 'completed' 
                          ? 'Completed' 
                          : item.status === 'in-progress' 
                          ? 'In Progress' 
                          : 'Pending'
                        }
                      </Badge>
                      {item.status !== 'completed' && (
                        <p className="text-sm text-gray-600">
                          {item.daysRemaining} days remaining
                        </p>
                      )}
                      {item.status === 'completed' && (
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Done
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
};

export default Project;
