import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, RefreshCw } from 'lucide-react';

const Materials = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const materials = [
    {
      id: 1,
      name: 'Steel Beams',
      category: 'Structural',
      quantity: 45,
      unit: 'pieces',
      minQuantity: 20,
      projectName: 'Down Flow',
      lastUpdated: '2024-11-20',
      supplier: 'Steel Corp Ltd'
    },
    {
      id: 2,
      name: 'Concrete Blocks',
      category: 'Masonry',
      quantity: 8,
      unit: 'pallets',
      minQuantity: 15,
      projectName: 'Down Flow',
      lastUpdated: '2024-11-19',
      supplier: 'BuildRight Materials'
    },
    {
      id: 3,
      name: 'Electrical Cables',
      category: 'Electrical',
      quantity: 250,
      unit: 'meters',
      minQuantity: 100,
      projectName: 'Down Flow',
      lastUpdated: '2024-11-18',
      supplier: 'ElectroSupply Co'
    },
    {
      id: 4,
      name: 'PVC Pipes',
      category: 'Plumbing',
      quantity: 5,
      unit: 'bundles',
      minQuantity: 10,
      projectName: 'Down Flow',
      lastUpdated: '2024-11-17',
      supplier: 'PlumbPro Materials'
    },
    {
      id: 5,
      name: 'Cement Bags',
      category: 'Construction',
      quantity: 120,
      unit: 'bags',
      minQuantity: 50,
      projectName: 'Down Flow',
      lastUpdated: '2024-11-16',
      supplier: 'CementMax Inc'
    }
  ];

  const requests = [
    {
      id: 1,
      material: 'Steel Beams',
      quantity: 25,
      unit: 'pieces',
      projectName: 'Down Flow',
      requestDate: '2024-11-15',
      expectedDelivery: '2024-11-25'
    },
    {
      id: 2,
      material: 'Concrete Blocks',
      quantity: 20,
      unit: 'pallets',
      projectName: 'Down Flow',
      requestDate: '2024-11-14',
      expectedDelivery: 'TBD'
    }
  ];

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'In Stock':
  //       return 'text-green-600 bg-green-100';
  //     case 'Low Stock':
  //       return 'text-yellow-600 bg-yellow-100';
  //     case 'Critical':
  //       return 'text-red-600 bg-red-100';
  //     default:
  //       return 'text-gray-600 bg-gray-100';
  //   }
  // };

  // const getRequestStatusColor = (status) => {
  //   switch (status) {
  //     case 'Approved':
  //       return 'text-green-600 bg-green-100';
  //     case 'Pending':
  //       return 'text-yellow-600 bg-yellow-100';
  //     case 'Rejected':
  //       return 'text-red-600 bg-red-100';
  //     default:
  //       return 'text-gray-600 bg-gray-100';
  //   }
  // };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'low' && (material.status === 'Low Stock' || material.status === 'Critical')) ||
      (filterStatus === 'instock' && material.status === 'In Stock');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materials Management</h1>
          <p className="text-gray-600 mt-2">Monitor inventory levels and manage material requests</p>
        </div>
        {/* <button
          onClick={() => setShowRequestForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Request Materials
        </button> */}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Materials</p>
              <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Package className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {materials.filter(m => m.status === 'In Stock').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Package className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {materials.filter(m => m.status === 'Low Stock').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {materials.filter(m => m.status === 'Critical').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Request History */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{request.material}</h3>
                <p className="text-sm text-gray-600">
                  {request.quantity} {request.unit} • Requested: {request.requestDate}
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Request Materials
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Materials</option>
                <option value="instock">In Stock</option>
                <option value="low">Low/Critical Stock</option>
              </select>
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{material.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {material.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{material.quantity} {material.unit}</div>
                    <div className="text-sm text-gray-500">Min: {material.minQuantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {material.projectName}

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {material.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {material.lastUpdated}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium mr-4">
                      Update
                    </button>
                    {(material.status === 'Low Stock' || material.status === 'Critical') && (
                      <button 
                        onClick={() => setShowRequestForm(true)}
                        className="text-secondary-600 hover:text-secondary-800 text-sm font-medium"
                      >
                        Request
                      </button>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Materials</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Select material...</option>
                  <option>Steel Beams</option>
                  <option>Concrete Blocks</option>
                  <option>PVC Pipes</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Down Flow</option>
                  <option>Medium House</option>
                  <option>High Park</option>
                  <option>Home Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Additional notes or specifications..."
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 bg-amber-400 text-gray-900 rounded-lg py-2 hover:bg-primary-600 transition-colors"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;