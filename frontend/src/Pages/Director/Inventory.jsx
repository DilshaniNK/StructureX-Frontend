import React, { useState, useEffect } from 'react';
import { Package, Users, Grid, Plus, TrendingUp, AlertCircle, Loader2, X, Save } from 'lucide-react';

export default function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: '',
    availability: true,
    category: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8086/api/v1/director/inventory');
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      
      const data = await response.json();
      setItems(data);
      
      // Group items by category
      const categoryMap = {};
      data.forEach(item => {
        const categoryName = item.category || 'Uncategorized';
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = {
            name: categoryName,
            items: [],
            totalItems: 0,
            availableItems: 0,
            unavailableItems: 0
          };
        }
        categoryMap[categoryName].items.push(item);
        categoryMap[categoryName].totalItems += 1;
        if (item.availability) {
          categoryMap[categoryName].availableItems += 1;
        } else {
          categoryMap[categoryName].unavailableItems += 1;
        }
      });
      
      // Convert to array and assign colors
      const colors = [
        'from-yellow-500 to-yellow-500',
        'from-purple-500 to-pink-500',
        'from-orange-500 to-red-500',
        'from-green-500 to-emerald-500',
        'from-indigo-500 to-blue-500',
        'from-pink-500 to-rose-500',
        'from-teal-500 to-cyan-500',
        'from-violet-500 to-purple-500'
      ];
      
      const categoryArray = Object.values(categoryMap).map((cat, index) => ({
        ...cat,
        id: index + 1,
        color: colors[index % colors.length]
      }));
      
      setCategories(categoryArray);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.length;
  const totalCategories = categories.length;
  const unavailableItems = items.filter(item => !item.availability).length;
  const totalSuppliers = 47;

  const handleAddItem = (categoryName) => {
    setExpandedCategory(categoryName);
    setFormData({
      name: '',
      description: '',
      rate: '',
      availability: true,
      category: categoryName
    });
  };

  const handleCancelAdd = () => {
    setExpandedCategory(null);
    setFormData({
      name: '',
      description: '',
      rate: '',
      availability: true,
      category: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter item name');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('http://localhost:8086/api/v1/director/add_inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          rate: parseFloat(formData.rate) || 0,
          availability: formData.availability,
          category: formData.category
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      // Refresh data after successful add
      await fetchInventoryData();
      
      // Reset form and close
      handleCancelAdd();
      alert('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

   if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading Inventory...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Error Loading Data</h2>
          <p className="text-slate-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchInventoryData}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-9xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Inventory Management</h1>
          <p className="text-slate-600">Monitor and manage your inventory in real-time</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Inventory */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                Live
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Total Inventory</h3>
            <p className="text-3xl font-bold text-slate-800">{totalItems.toLocaleString()}</p>
          </div>

          {/* Total Suppliers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-slate-500 text-sm font-semibold">
                Active
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Total Suppliers</h3>
            <p className="text-3xl font-bold text-slate-800">{totalSuppliers}</p>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-slate-500 text-sm font-semibold">
                —
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Total Categories</h3>
            <p className="text-3xl font-bold text-slate-800">{totalCategories}</p>
          </div>

          {/* Unavailable Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-red-600 text-sm font-semibold">
                {unavailableItems > 0 ? 'Alert' : 'Good'}
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Unavailable Items</h3>
            <p className="text-3xl font-bold text-slate-800">{unavailableItems}</p>
          </div>
        </div>

        {/* Category-wise Items Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-2xl font-bold text-slate-800">Category-wise Inventory</h2>
            <p className="text-slate-600 text-sm mt-1">View and manage items across all categories</p>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No inventory items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Total Items
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Unavailable
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                      <tr className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mr-3 shadow-md`}>
                              <Grid className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">{category.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-lg font-bold text-slate-800">{category.totalItems}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {category.availableItems} items
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            {category.unavailableItems} items
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {category.unavailableItems > 5 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Attention
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Good
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleAddItem(category.name)}
                            disabled={expandedCategory === category.name}
                            className="inline-flex items-center px-4 py-2 bg-[#FAAD00] text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Item
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expandable Form Row */}
                      {expandedCategory === category.name && (
                        <tr className="bg-blue-50">
                          <td colSpan="6" className="px-6 py-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-800">
                                  Add New Item to {category.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={handleCancelAdd}
                                  className="text-slate-500 hover:text-slate-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Item Name *
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="Enter item name"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rate
                                  </label>
                                  <input
                                    type="number"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="Enter rate"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                  </label>
                                  <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="Enter item description"
                                  />
                                </div>

                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="availability"
                                    checked={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                  />
                                  <label className="ml-2 text-sm font-medium text-slate-700">
                                    Item is available
                                  </label>
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 mt-6">
                                <button
                                  type="button"
                                  onClick={handleCancelAdd}
                                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={saving}
                                  className="inline-flex items-center px-6 py-2 bg-[#FAAD00] text-white font-semibold rounded-lg hover:bg-black transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {saving ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4 mr-2" />
                                      Add Item
                                    </>
                                  )}
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}