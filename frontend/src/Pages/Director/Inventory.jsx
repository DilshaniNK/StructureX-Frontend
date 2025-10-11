import React, { useState } from 'react';
import { Package, Users, ShoppingCart, Plus, Search } from 'lucide-react';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data
  const stats = {
    totalSuppliers: 45,
    totalItems: 1248,
    totalOrders: 326
  };

  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', quantity: 450, items: 89, color: 'bg-blue-500' },
    { id: 2, name: 'Clothing', quantity: 320, items: 156, color: 'bg-purple-500' },
    { id: 3, name: 'Food & Beverage', quantity: 178, items: 67, color: 'bg-green-500' },
    { id: 4, name: 'Furniture', quantity: 95, items: 34, color: 'bg-orange-500' },
    { id: 5, name: 'Books', quantity: 205, items: 98, color: 'bg-red-500' },
    { id: 6, name: 'Sports Equipment', quantity: 142, items: 52, color: 'bg-teal-500' },
    { id: 7, name: 'Beauty & Care', quantity: 267, items: 78, color: 'bg-pink-500' },
    { id: 8, name: 'Home Appliances', quantity: 89, items: 41, color: 'bg-indigo-500' }
  ]);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (categoryName) => {
    alert(`Add item to ${categoryName}`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview Of Inventory</h1>
          <p className="text-gray-600">Manage your stock and track inventory across categories</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-8 border-[#FAAD00]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Suppliers</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalSuppliers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-8 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Items</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalItems}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-8 border-[#FAAD00]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">No. of Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <ShoppingCart className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
          <div className='flex justify-center'>

          <div className="relative mb-4 ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 " />
            <input
              type="text"
              placeholder="Search category by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:outline-none focus:border-gray-900 transition-colors "
            />
          </div>
          </div>
       

        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Category-wise Inventory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition cursor-pointer">
                      <td className="px-6 py-4 text-gray-900 hover:text-blue-600">{category.name}</td>
                      <td className="px-6 py-4 text-gray-700">{category.quantity}</td>
                      <td>
                      <button className='flex justify-between gap-3  border-1 border-white hover:border-[#FDDA00] px-2 py-1 rounded-lg hover:mb-1 font-bold'>
                        <Plus/>
                        Add Item
                      </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                      No categories found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;