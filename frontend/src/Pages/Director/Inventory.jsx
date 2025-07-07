import React, { useState } from 'react';
import { Package, Plus, Minus, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: "Cement", 
      totalQuantity: 3000, 
      availableQuantity: 2450, 
      allocatedQuantity: 550,
      unit: "bags", 
      minThreshold: 500,
      cost: 25.50,
      supplier: "BuildMart Co."
    },
    { 
      id: 2, 
      name: "Steel Rods", 
      totalQuantity: 1500, 
      availableQuantity: 1200, 
      allocatedQuantity: 300,
      unit: "units", 
      minThreshold: 200,
      cost: 85.00,
      supplier: "SteelWorks Ltd."
    },
    { 
      id: 3, 
      name: "Bricks", 
      totalQuantity: 8000, 
      availableQuantity: 5000, 
      allocatedQuantity: 3000,
      unit: "units", 
      minThreshold: 1000,
      cost: 0.75,
      supplier: "Brick Masters"
    },
    { 
      id: 4, 
      name: "Paint", 
      totalQuantity: 200, 
      availableQuantity: 150, 
      allocatedQuantity: 50,
      unit: "gallons", 
      minThreshold: 50,
      cost: 35.00,
      supplier: "ColorTech Inc."
    }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, name: "Office Building A", status: "active" },
    { id: 2, name: "Residential Complex B", status: "active" },
    { id: 3, name: "Shopping Mall C", status: "pending" }
  ]);

  const [allocations, setAllocations] = useState([
    { id: 1, itemId: 1, itemName: "Cement", projectId: 1, projectName: "Office Building A", quantity: 300, date: "2025-06-15", status: "allocated" },
    { id: 2, itemId: 2, itemName: "Steel Rods", projectId: 1, projectName: "Office Building A", quantity: 150, date: "2025-06-16", status: "allocated" },
    { id: 3, itemId: 1, itemName: "Cement", projectId: 2, projectName: "Residential Complex B", quantity: 250, date: "2025-06-17", status: "delivered" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'allocate', 'adjust'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const getStatusColor = (item) => {
    const percentage = (item.availableQuantity / item.totalQuantity) * 100;
    if (percentage <= 20) return 'bg-red-100 text-red-800 border-red-200';
    if (percentage <= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = (item) => {
    const percentage = (item.availableQuantity / item.totalQuantity) * 100;
    if (percentage <= 20) return 'Critical';
    if (percentage <= 50) return 'Low Stock';
    return 'Available';
  };

  const getStatusIcon = (item) => {
    const percentage = (item.availableQuantity / item.totalQuantity) * 100;
    if (percentage <= 20) return <AlertTriangle className="w-4 h-4" />;
    if (percentage <= 50) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const handleAddInventory = () => {
    setModalType('add');
    setFormData({
      name: '',
      totalQuantity: '',
      unit: '',
      minThreshold: '',
      cost: '',
      supplier: ''
    });
    setShowModal(true);
  };

  const handleAllocateInventory = (item) => {
    setModalType('allocate');
    setSelectedItem(item);
    setFormData({
      projectId: '',
      quantity: '',
      notes: ''
    });
    setShowModal(true);
  };

  const handleAdjustInventory = (item) => {
    setModalType('adjust');
    setSelectedItem(item);
    setFormData({
      adjustmentType: 'add',
      quantity: '',
      reason: ''
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      const newItem = {
        id: inventory.length + 1,
        name: formData.name,
        totalQuantity: parseInt(formData.totalQuantity),
        availableQuantity: parseInt(formData.totalQuantity),
        allocatedQuantity: 0,
        unit: formData.unit,
        minThreshold: parseInt(formData.minThreshold),
        cost: parseFloat(formData.cost),
        supplier: formData.supplier
      };
      setInventory([...inventory, newItem]);
    } else if (modalType === 'allocate') {
      const project = projects.find(p => p.id === parseInt(formData.projectId));
      const quantity = parseInt(formData.quantity);
      
      if (quantity <= selectedItem.availableQuantity) {
        // Update inventory
        setInventory(inventory.map(item => 
          item.id === selectedItem.id 
            ? { 
                ...item, 
                availableQuantity: item.availableQuantity - quantity,
                allocatedQuantity: item.allocatedQuantity + quantity 
              }
            : item
        ));
        
        // Add allocation record
        const newAllocation = {
          id: allocations.length + 1,
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          projectId: parseInt(formData.projectId),
          projectName: project.name,
          quantity: quantity,
          date: new Date().toISOString().split('T')[0],
          status: 'allocated'
        };
        setAllocations([...allocations, newAllocation]);
      }
    } else if (modalType === 'adjust') {
      const quantity = parseInt(formData.quantity);
      const isAdding = formData.adjustmentType === 'add';
      
      setInventory(inventory.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              totalQuantity: isAdding ? item.totalQuantity + quantity : item.totalQuantity - quantity,
              availableQuantity: isAdding ? item.availableQuantity + quantity : item.availableQuantity - quantity
            }
          : item
      ));
    }
    
    setShowModal(false);
    setFormData({});
    setSelectedItem(null);
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.totalQuantity * item.cost), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-100 to bg-neutral-300 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600">Track and manage company inventory</p>
            </div>
            <button 
              onClick={handleAddInventory}
              // style={{backgroundColor: '#FFB22C'}}
              className="bg-yellow-500 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Inventory
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter(item => item.availableQuantity <= item.minThreshold).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Allocations</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allocations.filter(a => a.status === 'allocated').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(item)}`}>
                    {getStatusIcon(item)}
                    {getStatusText(item)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Total Stock:</span>
                    <span className="font-medium">{item.totalQuantity.toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-medium text-green-600">{item.availableQuantity.toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allocated:</span>
                    <span className="font-medium text-blue-600">{item.allocatedQuantity.toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Cost:</span>
                    <span className="font-medium">${item.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <span className="font-medium">{item.supplier}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gray-400 h-2 rounded-full" 
                    style={{ width: `${(item.availableQuantity / item.totalQuantity) * 100}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAllocateInventory(item)}
                    className="flex-1  bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Allocate
                  </button>
                  <button 
                    onClick={() => handleAdjustInventory(item)}
                    className="flex-1 bg-black hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Adjust
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Allocations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Allocations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-900">Item</th>
                  <th className="text-left py-2 font-medium text-gray-900">Project</th>
                  <th className="text-left py-2 font-medium text-gray-900">Quantity</th>
                  <th className="text-left py-2 font-medium text-gray-900">Date</th>
                  <th className="text-left py-2 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {allocations.slice(-5).reverse().map(allocation => (
                  <tr key={allocation.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{allocation.itemName}</td>
                    <td className="py-3 text-gray-600">{allocation.projectName}</td>
                    <td className="py-3 text-gray-600">{allocation.quantity.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{allocation.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        allocation.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {allocation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modalType === 'add' && 'Add New Inventory Item'}
              {modalType === 'allocate' && `Allocate ${selectedItem?.name}`}
              {modalType === 'adjust' && `Adjust ${selectedItem?.name} Stock`}
            </h3>
            
            <div className="space-y-4">
              {modalType === 'add' && (
                <>
                  <input
                    type="text"
                    placeholder="Item Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Total Quantity"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.totalQuantity || ''}
                    onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g., bags, units, gallons)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Minimum Threshold"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.minThreshold || ''}
                    onChange={(e) => setFormData({...formData, minThreshold: e.target.value})}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Cost"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.cost || ''}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Supplier"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.supplier || ''}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  />
                </>
              )}

              {modalType === 'allocate' && (
                <>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.projectId || ''}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder={`Quantity (max: ${selectedItem?.availableQuantity})`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    max={selectedItem?.availableQuantity}
                  />
                  <textarea
                    placeholder="Notes (optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </>
              )}

              {modalType === 'adjust' && (
                <>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.adjustmentType || 'add'}
                    onChange={(e) => setFormData({...formData, adjustmentType: e.target.value})}
                  >
                    <option value="add">Add Stock</option>
                    <option value="remove">Remove Stock</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Reason for adjustment"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.reason || ''}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {modalType === 'add' && 'Add Item'}
                {modalType === 'allocate' && 'Allocate'}
                {modalType === 'adjust' && 'Adjust Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;