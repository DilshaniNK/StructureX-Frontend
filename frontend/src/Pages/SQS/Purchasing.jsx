import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Download, Eye, FileDown, CheckCircle, Clock, 
  X, Calendar, Package, User, Building, MapPin, DollarSign
} from 'lucide-react';

const Purchasing = () => {
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotationFormData, setQuotationFormData] = useState({
    project: '',
    material: '',
    quantity: '',
    requiredDate: '',
    suppliers: []
  });

  // Sample data for ongoing projects
  const ongoingProjects = [
    { id: 1, name: 'Luxury Villa Construction', location: 'Colombo' },
    { id: 2, name: 'Office Complex Building', location: 'Kandy' },
    { id: 3, name: 'Shopping Mall Development', location: 'Galle' },
  ];

  // Sample data for suppliers
  const suppliers = [
    { id: 1, name: 'ABC Building Materials', rating: 4.5 },
    { id: 2, name: 'Quality Construction Supplies', rating: 4.2 },
    { id: 3, name: 'Premium Materials Ltd', rating: 4.8 },
    { id: 4, name: 'BuildPro Suppliers', rating: 4.0 },
  ];

  // Sample quotations data
  const [quotations] = useState([
    {
      id: 'Q001',
      project: 'Luxury Villa Construction',
      material: 'Cement Bags',
      quantity: '500 units',
      supplier: 'ABC Building Materials',
      requestDate: '2024-06-15',
      requiredDate: '2024-06-25',
      status: 'received',
      amount: 150000,
      quotationFile: 'quotation_Q001.pdf'
    },
    {
      id: 'Q002',
      project: 'Office Complex Building',
      material: 'Steel Bars',
      quantity: '200 tons',
      supplier: 'Quality Construction Supplies',
      requestDate: '2024-06-18',
      requiredDate: '2024-06-30',
      status: 'pending',
      amount: null,
      quotationFile: null
    },
    {
      id: 'Q003',
      project: 'Shopping Mall Development',
      material: 'Concrete Blocks',
      quantity: '1000 units',
      supplier: 'Premium Materials Ltd',
      requestDate: '2024-06-20',
      requiredDate: '2024-07-05',
      status: 'received',
      amount: 280000,
      quotationFile: 'quotation_Q003.pdf'
    }
  ]);

  // Sample purchased items data
  const [purchasedItems] = useState([
    {
      id: 'P001',
      project: 'Luxury Villa Construction',
      material: 'Ceramic Tiles',
      quantity: '2000 sq ft',
      supplier: 'Premium Materials Ltd',
      orderDate: '2024-06-10',
      deliveryDate: '2024-06-20',
      amount: 320000,
      paymentStatus: 'paid',
      invoiceFile: 'invoice_P001.pdf'
    },
    {
      id: 'P002',
      project: 'Office Complex Building',
      material: 'Glass Panels',
      quantity: '150 panels',
      supplier: 'BuildPro Suppliers',
      orderDate: '2024-06-12',
      deliveryDate: '2024-06-25',
      amount: 180000,
      paymentStatus: 'pending',
      invoiceFile: null
    },
    {
      id: 'P003',
      project: 'Shopping Mall Development',
      material: 'HVAC Systems',
      quantity: '5 units',
      supplier: 'ABC Building Materials',
      orderDate: '2024-06-14',
      deliveryDate: '2024-07-01',
      amount: 950000,
      paymentStatus: 'paid',
      invoiceFile: 'invoice_P003.pdf'
    }
  ]);  const handleQuotationSubmit = (e) => {
    e.preventDefault();
    
    // Validate that at least one supplier is selected
    if (quotationFormData.suppliers.length === 0) {
      alert('Please select at least one supplier');
      return;
    }
    
    // Handle form submission logic here
    console.log('Quotation Request:', quotationFormData);
    setShowQuotationForm(false);
    setQuotationFormData({
      project: '',
      material: '',
      quantity: '',
      requiredDate: '',
      suppliers: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSupplierToggle = (supplierName) => {
    setQuotationFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.includes(supplierName)
        ? prev.suppliers.filter(s => s !== supplierName)
        : [...prev.suppliers, supplierName]
    }));
  };

  const getStatusBadge = (status) => {
    if (status === 'received') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Received
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          
          <button
            onClick={() => setShowQuotationForm(true)}
            className="flex items-center px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Quotation Request
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">{quotations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Received Quotations</p>
              <p className="text-2xl font-bold text-gray-900">
                {quotations.filter(q => q.status === 'received').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Quotations</p>
              <p className="text-2xl font-bold text-gray-900">
                {quotations.filter(q => q.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{purchasedItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Quotation Requests</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search quotations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quotation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quotation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.material} ({quotation.quantity})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.requiredDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(quotation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {quotation.status === 'received' ? (
                        <button
                          className="text-[#FAAD00] hover:text-[#FAAD00]/80 flex items-center"
                          title="View Quotation"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Awaiting response</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchased Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search purchases..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchasedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.material} ({item.quantity})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(item.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {item.paymentStatus === 'paid' && item.invoiceFile ? (
                        <button
                          className="text-[#FAAD00] hover:text-[#FAAD00]/80 flex items-center"
                          title="Download Invoice"
                        >
                          <FileDown className="w-4 h-4 mr-1" />
                          Invoice
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">No invoice</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Request Form Modal */}
      {showQuotationForm && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  New Quotation Request
                </h3>
                <button
                  onClick={() => setShowQuotationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleQuotationSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Select Project
                </label>
                <select
                  name="project"
                  value={quotationFormData.project}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value="">Choose a project...</option>
                  {ongoingProjects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name} - {project.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Material/Service
                </label>
                <input
                  type="text"
                  name="material"
                  value={quotationFormData.material}
                  onChange={handleInputChange}
                  placeholder="Enter material or service description"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={quotationFormData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity (e.g., 100 units, 50 tons)"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Required Date
                </label>
                <input
                  type="date"
                  name="requiredDate"
                  value={quotationFormData.requiredDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Select Suppliers (Multiple)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {suppliers.map((supplier) => (
                    <label key={supplier.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quotationFormData.suppliers.includes(supplier.name)}
                        onChange={() => handleSupplierToggle(supplier.name)}
                        className="mr-3 h-4 w-4 text-[#FAAD00] focus:ring-[#FAAD00] border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {supplier.name} (Rating: {supplier.rating}/5)
                      </span>
                    </label>
                  ))}
                </div>
                {quotationFormData.suppliers.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">Please select at least one supplier</p>
                )}
                {quotationFormData.suppliers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected suppliers:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {quotationFormData.suppliers.map((supplier) => (
                        <span
                          key={supplier}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FAAD00] bg-opacity-10 text-[#000000]"
                        >
                          {supplier}
                          <button
                            type="button"
                            onClick={() => handleSupplierToggle(supplier)}
                            className="ml-1 text-[#FAAD00] hover:text-[#FAAD00]/80"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowQuotationForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchasing;
