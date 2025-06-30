import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, Eye, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Reduced sample employee data (3-4 employees)
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
    status: 'Inactive',
    joinDate: '2023-06-05'
  }
];

// Employee Details Modal Component
const EmployeeDetailsModal = ({ employee, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-400">Employee Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-3">
        <div><span className="text-gray-400">ID:</span> <span className="text-white ml-2">{employee.employee_id}</span></div>
        <div><span className="text-gray-400">Name:</span> <span className="text-white ml-2">{employee.name}</span></div>
        <div><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{employee.email}</span></div>
        <div><span className="text-gray-400">Contact:</span> <span className="text-white ml-2">{employee.contact}</span></div>
        <div><span className="text-gray-400">Address:</span> <span className="text-white ml-2">{employee.address}</span></div>
        <div><span className="text-gray-400">Type:</span> <span className="text-white ml-2">{employee.type.replace(/_/g, ' ')}</span></div>
        <div><span className="text-gray-400">Status:</span> <span className={`ml-2 ${employee.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{employee.status}</span></div>
        <div><span className="text-gray-400">Join Date:</span> <span className="text-white ml-2">{employee.joinDate}</span></div>
      </div>
    </div>
  </div>
);

// Employee Edit Modal Component
const EmployeeEditModal = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState(employee);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-yellow-400">Edit Employee</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
          <input
            type="tel"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            rows="2"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          >
            <option value="QS_Officer">QS Officer</option>
            <option value="Senior_QS_Officer">Senior QS Officer</option>
            <option value="Project_Manager">Project Manager</option>
            <option value="Site_Supervisor">Site Supervisor</option>
          </select>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 rounded-lg font-semibold"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ employee, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full">
      <h3 className="text-xl font-bold text-red-400 mb-4">Confirm Deletion</h3>
      <p className="text-gray-300 mb-6">
        Are you sure you want to delete <span className="text-white font-semibold">{employee.name}</span>? 
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Modal states
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  // Get unique employee types for filter
  const employeeTypes = ['All', ...new Set(employees.map(emp => emp.type))];

  // Filter and search logic (removed status filter)
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.contact.includes(searchTerm);
      
      const matchesType = filterType === 'All' || employee.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [employees, searchTerm, filterType]);

  // Rest of the sorting and pagination logic remains the same...
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

  const handleAddEmployee = () => {
    console.log('Navigate to add employee page');
    // navigate('/admin/add-employee');
  };

  // Modal handlers
  const handleEditSave = (updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.employee_id === updatedEmployee.employee_id ? updatedEmployee : emp
    ));
  };

  const handleDeleteConfirm = () => {
    setEmployees(employees.filter(emp => emp.employee_id !== deleteEmployee.employee_id));
    setDeleteEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header section remains the same... */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Employee Management</h1>
            <p className="text-gray-400">Manage all system employees and their roles</p>
          </div>
          <button onClick={handleAddEmployee} className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg">
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Stats Cards - removed inactive count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
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
                <p className="text-gray-400 text-xs sm:text-sm truncate">Departments</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400 mt-1">{employeeTypes.length - 1}</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - removed status filter */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
            </div>
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

      {/* Table - removed status column */}
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
              {paginatedEmployees.map((employee) => (
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
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewEmployee(employee)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors p-1"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setEditEmployee(employee)}
                        className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteEmployee(employee)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1"
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

        {/* Pagination section remains the same... */}
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
      
      {editEmployee && (
        <EmployeeEditModal 
          employee={editEmployee} 
          onClose={() => setEditEmployee(null)}
          onSave={handleEditSave}
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