import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Plus, Edit, Trash2, Eye, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample employee data
const employeesData = [
  {
    employee_id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    contact: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    type: 'QS_Officer',
    status: 'Active',
    joinDate: '2023-01-15'
  },
  {
    employee_id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    contact: '+1-555-0102',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    type: 'Senior_QS_Officer',
    status: 'Active',
    joinDate: '2022-08-20'
  },
  {
    employee_id: 'EMP003',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    contact: '+1-555-0103',
    address: '789 Pine Rd, Chicago, IL 60601',
    type: 'Project_Manager',
    status: 'Active',
    joinDate: '2023-03-10'
  },
  {
    employee_id: 'EMP004',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    contact: '+1-555-0104',
    address: '321 Elm St, Houston, TX 77001',
    type: 'Site_Supervisor',
    status: 'Active',
    joinDate: '2023-06-05'
  },
  {
    employee_id: 'EMP005',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    contact: '+1-555-0105',
    address: '654 Cedar Ln, Phoenix, AZ 85001',
    type: 'Legal_Officer',
    status: 'Inactive',
    joinDate: '2022-11-15'
  },
  {
    employee_id: 'EMP006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    contact: '+1-555-0106',
    address: '987 Birch Dr, Philadelphia, PA 19101',
    type: 'Director',
    status: 'Active',
    joinDate: '2021-05-20'
  },
  {
    employee_id: 'EMP007',
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    contact: '+1-555-0107',
    address: '159 Maple Ave, San Antonio, TX 78201',
    type: 'Architect',
    status: 'Active',
    joinDate: '2023-02-14'
  },
  {
    employee_id: 'EMP008',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@company.com',
    contact: '+1-555-0108',
    address: '753 Walnut St, San Diego, CA 92101',
    type: 'Finance_Department',
    status: 'Active',
    joinDate: '2022-09-30'
  },
  {
    employee_id: 'EMP009',
    name: 'Christopher Lee',
    email: 'christopher.lee@company.com',
    contact: '+1-555-0109',
    address: '852 Spruce Ct, Dallas, TX 75201',
    type: 'QS_Officer',
    status: 'Active',
    joinDate: '2023-04-18'
  },
  {
    employee_id: 'EMP010',
    name: 'Amanda White',
    email: 'amanda.white@company.com',
    contact: '+1-555-0110',
    address: '426 Ash Blvd, San Jose, CA 95101',
    type: 'Site_Supervisor',
    status: 'Inactive',
    joinDate: '2022-12-08'
  }
];

const EmployeeManagement = () => {
  const [employees] = useState(employeesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Get unique employee types for filter
  const employeeTypes = ['All', ...new Set(employees.map(emp => emp.type))];
  const statusOptions = ['All', 'Active', 'Inactive'];

  // Filter and search logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.contact.includes(searchTerm);
      
      const matchesType = filterType === 'All' || employee.type === filterType;
      const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [employees, searchTerm, filterType, filterStatus]);

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

  // Pagination logic
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatEmployeeType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-400' : 'text-red-400';
  };

  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate('/admin/add-employee');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Employee Management</h1>
            <p className="text-gray-400">Manage all system employees and their roles</p>
          </div>
          <button onClick={handleAddEmployee} className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg">
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Total Employees</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{employees.length}</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400 mt-1">{employees.filter(e => e.status === 'Active').length}</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Inactive</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400 mt-1">{employees.filter(e => e.status === 'Inactive').length}</p>
              </div>
              <div className="bg-red-500 bg-opacity-20 p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Departments</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400 mt-1">{employeeTypes.length - 1}</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none pr-10 min-w-48"
                >
                  {employeeTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Types' : formatEmployeeType(type)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none pr-10"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'All Status' : status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <Filter size={18} />
                More Filters
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750">
              <tr className="border-b border-gray-700">
                {[
                  { key: 'employee_id', label: 'Employee ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'contact', label: 'Contact' },
                  { key: 'address', label: 'Address' },
                  { key: 'type', label: 'Type' },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: 'Actions' }
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 ${
                      key !== 'actions' ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''
                    }`}
                    onClick={key !== 'actions' ? () => handleSort(key) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {label}
                      {sortConfig.key === key && (
                        <span className="text-yellow-400">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedEmployees.map((employee, index) => (
                <tr key={employee.employee_id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-yellow-400">
                    {employee.employee_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {employee.contact}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                    {employee.address}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-yellow-400 border border-yellow-500">
                      {formatEmployeeType(employee.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'Active'
                        ? 'text-green-400 border border-green-500'
                        : 'text-red-400 border border-red-500'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-yellow-400 transition-colors p-1">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-blue-400 transition-colors p-1">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 transition-colors p-1">
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
    </div>
  );
};

export default EmployeeManagement;