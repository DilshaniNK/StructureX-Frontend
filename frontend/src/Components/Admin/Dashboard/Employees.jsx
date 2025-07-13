import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, Plus, Trash2, Eye, ChevronDown, ChevronLeft, ChevronRight, X, Users, UserCheck, Building, RefreshCw } from 'lucide-react';

// Employee Details Modal Component
const EmployeeDetailsModal = ({ employee, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
          Employee Details
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {[
          { label: 'ID', value: employee.employee_id, color: 'text-yellow-400' },
          { label: 'Name', value: employee.name, color: 'text-white' },
          { label: 'Email', value: employee.email, color: 'text-blue-400' },
          { label: 'Phone', value: employee.phone_number || 'N/A', color: 'text-white' },
          { label: 'Address', value: employee.address || 'N/A', color: 'text-white' },
          { label: 'Type', value: employee.type.replace(/_/g, ' '), color: 'text-purple-400' },
          { label: 'Status', value: employee.availability ? 'Active' : 'Inactive', color: employee.availability ? 'text-green-400' : 'text-red-400' },
          { label: 'Join Date', value: new Date(employee.joined_date).toLocaleDateString(), color: 'text-white' }
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <span className="text-gray-400 font-medium">{label}:</span>
            <span className={`font-semibold ${color}`}>{value}</span>
          </div>
        ))}
        {employee.profile_image_url && (
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <span className="text-gray-400 font-medium">Profile Image:</span>
            <span className="text-green-400 font-semibold">Available</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Delete Confirmation Modal 
const DeleteConfirmModal = ({ employee, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-500/30">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Deactivate Employee</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to deactivate <span className="text-white font-semibold">{employee.name}</span>? 
          This will make them unavailable for new assignments.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg"
          >
            Deactivate
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-yellow-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
        <X className="w-4 h-4 text-red-400" />
      </div>
      <div className="flex-1">
        <p className="text-red-300 font-medium">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  </div>
);

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Modal states
  const [viewEmployee, setViewEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  // API Base URL
  const API_BASE_URL = 'http://localhost:8086/api/v1/admin';

  // Employee types for filtering
  const employeeTypes = [
    'All',
    'QS_Officer',
    'Senior_QS_Officer',
    'Project_Manager',
    'Site_Supervisor',
    'Legal_Officer',
    'Director',
    'Designer',
    'Finance_Department'
  ];

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching employees from:', `${API_BASE_URL}/get_employees`);
      
      const response = await fetch(`${API_BASE_URL}/get_employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed (like Authorization)
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Check if data is an array or wrapped in an object
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data.data && Array.isArray(data.data)) {
        setEmployees(data.data);
      } else if (data.employees && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        console.error('Unexpected data format:', data);
        setError('Unexpected data format received from server');
      }
      
    } catch (err) {
      setError(`Failed to fetch employees: ${err.message}`);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // CORRECTED: Deactivate Employee Function
  const deactivateEmployee = async (employeeId) => {
    try {
      console.log('Deactivating employee:', employeeId);
      
      const response = await fetch(`${API_BASE_URL}/deactivate/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          // Include Authorization header here if required
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to deactivate employee: ${response.status} - ${errorText}`);
      }

      const result = await response.text(); // backend returns a string message
      console.log('Deactivation result:', result);
      
      // Show success message
      alert('Employee deactivated successfully! An email notification has been sent.');

      // Close the modal
      setDeleteEmployee(null);

      // Refresh employee list after deactivation
      await fetchEmployees();

    } catch (err) {
      console.error('Error deactivating employee:', err);
      alert('Error deactivating employee: ' + err.message);
    }
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter and search logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.phone_number && employee.phone_number.includes(searchTerm));
      
      const matchesType = filterType === 'All' || employee.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [employees, searchTerm, filterType]);

  // Sorting logic
  const sortedEmployees = useMemo(() => {
    if (!sortConfig.key) return filteredEmployees;
    
    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + itemsPerPage);

  const formatEmployeeType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Navigate to add employee page
  const handleAddEmployee = () => {
    console.log('Navigating to add employee page...');
    // In a real application, you would use React Router or similar
    // For demonstration, we'll show an alert
    alert('Navigating to Add Employee page...\n\nIn a real application, this would navigate to /admin/add-employee');
    // Example with React Router: navigate('/admin/add-employee');
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteEmployee) return;
    
    try {
      // Call the deactivate function instead of delete
      await deactivateEmployee(deleteEmployee.employee_id);
    } catch (err) {
      console.error('Error in handleDeleteConfirm:', err);
      setError('Failed to deactivate employee. Please try again.');
    }
  };

  // UPDATED: Get availability status styling
  const getAvailabilityStyle = (availability) => {
    switch (availability) {
      case 'Available':
        return 'text-green-400 border border-green-500';
      case 'Assigned':
        return 'text-blue-400 border border-blue-500';
      case 'Deactive':
        return 'text-red-400 border border-red-500';
      default:
        return 'text-gray-400 border border-gray-500';
    }
  };

  // UPDATED: Get row styling for deactivated employees
  const getRowStyle = (availability) => {
    if (availability === 'Deactive') {
      return 'hover:bg-red-900/20 transition-colors opacity-60 bg-red-900/10';
    }
    return 'hover:bg-gray-750 transition-colors';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Employee Management
          </h1>
          <p className="text-gray-400">Loading employees...</p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
              Employee Management
            </h1>
            <p className="text-gray-400 text-lg">Manage all system employees and their roles</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAddEmployee} 
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              fetchEmployees();
            }} 
          />
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-white mt-2">{employees.length}</p>
                <p className="text-xs text-gray-500 mt-1">All registered employees</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-400 p-3 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm font-medium">Available Employees</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{employees.filter(e => e.availability === 'Available').length}</p>
                <p className="text-xs text-gray-500 mt-1">Ready for assignment</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-400 p-3 rounded-xl shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm font-medium">Assigned Employees</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{employees.filter(e => e.availability === 'Assigned').length}</p>
                <p className="text-xs text-gray-500 mt-1">Currently working</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-400 p-3 rounded-xl shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm font-medium">Deactivated Employees</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{employees.filter(e => e.availability === 'Deactive').length}</p>
                <p className="text-xs text-gray-500 mt-1">Inactive accounts</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-400 p-3 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-6 mb-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search employees by name, email, ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none pr-12 min-w-52 transition-all backdrop-blur-sm"
                >
                  {employeeTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Departments' : formatEmployeeType(type)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter size={16} />
              <span>Showing {sortedEmployees.length} of {employees.length} employees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="bg-gray-800 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-750 to-gray-800">
              <tr className="border-b border-gray-700">
                {[
                  { key: 'employee_id', label: 'Employee ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone_number', label: 'Phone' },
                  { key: 'address', label: 'Address' },
                  { key: 'type', label: 'Department' },
                  { key: 'availability', label: 'Status' },
                  { key: 'actions', label: 'Actions' }
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className={`px-6 py-5 text-left text-sm font-semibold text-gray-300 ${
                      key !== 'actions' ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''
                    }`}
                    onClick={key !== 'actions' ? () => handleSort(key) : undefined}                  >
                    <div className="flex items-center gap-2">
                      {label}
                      {sortConfig.key === key && (
                        <span className="text-yellow-400 font-bold">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {/* Assuming paginatedEmployees is available */}
              {paginatedEmployees.map((employee) => (
                <tr key={employee.employee_id} className={getRowStyle(employee.availability)}>
                  <td className={`px-6 py-4 text-sm font-medium ${employee.availability === 'Deactive' ? 'text-red-400/70' : 'text-yellow-400'}`}>
                    {employee.employee_id}
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${employee.availability === 'Deactive' ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {employee.name}
                  </td>
                  <td className={`px-6 py-4 text-sm ${employee.availability === 'Deactive' ? 'text-gray-500' : 'text-gray-300'}`}>
                    {employee.email}
                  </td>
                  <td className={`px-6 py-4 text-sm ${employee.availability === 'Deactive' ? 'text-gray-500' : 'text-gray-300'}`}>
                    {employee.phone_number || 'N/A'}
                  </td>
                  <td className={`px-6 py-4 text-sm max-w-xs truncate ${employee.availability === 'Deactive' ? 'text-gray-500' : 'text-gray-300'}`}>
                    {employee.address || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${employee.availability === 'Deactive' ? 'text-red-400/70 border border-red-500/50' : 'text-yellow-400 border border-yellow-500'}`}>
                      {formatEmployeeType(employee.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityStyle(employee.availability)}`}>
                      {employee.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewEmployee(employee)}
                        className={`transition-colors p-1 ${employee.availability === 'Deactive' ? 'text-gray-600 hover:text-gray-500' : 'text-gray-400 hover:text-yellow-400'}`}
                        title="View Details"
                        disabled={employee.availability === 'Deactive'}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteEmployee(employee)}
                        className={`transition-colors p-1 ${employee.availability === 'Deactive' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-red-400'}`}
                        title={employee.availability === 'Deactive' ? 'Already Deactivated' : 'Deactivate Employee'}
                        disabled={employee.availability === 'Deactive'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-750 px-6 py-4 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedEmployees.length)} of {sortedEmployees.length} results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-yellow-500 text-gray-900 font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewEmployee && (
        <EmployeeDetailsModal 
          employee={viewEmployee} 
          onClose={() => setViewEmployee(null)} 
        />
      )}
      
      {deleteEmployee && (
        <DeleteConfirmModal 
          employee={deleteEmployee} 
          onClose={() => setDeleteEmployee(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;