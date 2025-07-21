import React, { useState, useEffect } from 'react'
import { cn } from '../../Utils/cn'

// API Base URL - updated to match your backend
const API_BASE_URL = 'http://localhost:8086/api/v1'

const Catalogue = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    rate: '',
    availability: true
  })

  // Fetch all catalogs on component mount
  useEffect(() => {
    fetchCatalogs()
  }, [])

  const fetchCatalogs = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching catalogs from:', `${API_BASE_URL}/catalogs`)
      
      const response = await fetch(`${API_BASE_URL}/catalogs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch catalogs: ${response.status} ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('Non-JSON response:', textResponse)
        throw new Error('Server returned non-JSON response')
      }
      
      const data = await response.json()
      console.log('Fetched catalogs:', data)
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('Expected array but got:', typeof data, data)
        setProducts([])
        setError('Invalid data format received from server')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please check if the backend is running on port 8086.')
      } else {
        setError(`Error loading catalogs: ${err.message}`)
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.rate || !newProduct.description) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        category: newProduct.category,
        rate: parseFloat(newProduct.rate),
        availability: newProduct.availability
      }
      
      console.log('Creating catalog with payload:', payload)
      
      const response = await fetch(`${API_BASE_URL}/catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload),
      })

      console.log('Create response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create error response:', errorText)
        throw new Error(errorText || `Failed to create product: ${response.status}`)
      }

      const createdProduct = await response.json()
      console.log('Created product:', createdProduct)
      
      setProducts(prevProducts => [...prevProducts, createdProduct])
      setNewProduct({ name: '', description: '', category: '', rate: '', availability: true })
      setIsAddModalOpen(false)
    } catch (err) {
      console.error('Error adding product:', err)
      setError(`Error adding product: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      rate: product.rate ? product.rate.toString() : '0'
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct.name || !editingProduct.category || !editingProduct.rate || !editingProduct.description) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: editingProduct.name.trim(),
        description: editingProduct.description.trim(),
        category: editingProduct.category,
        rate: parseFloat(editingProduct.rate),
        availability: editingProduct.availability
      }
      
      console.log('Updating catalog with payload:', payload)
      
      const response = await fetch(`${API_BASE_URL}/catalog/${editingProduct.item_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload),
      })

      console.log('Update response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update error response:', errorText)
        throw new Error(errorText || `Failed to update product: ${response.status}`)
      }

      const updatedProduct = await response.json()
      console.log('Updated product:', updatedProduct)
      
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.item_id === editingProduct.item_id ? updatedProduct : product
        )
      )
      setEditingProduct(null)
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Error updating product:', err)
      setError(`Error updating product: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (item_id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log('Deleting catalog with item_id:', item_id)
      
      const response = await fetch(`${API_BASE_URL}/catalog/${item_id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      })

      console.log('Delete response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete error response:', errorText)
        throw new Error(errorText || `Failed to delete product: ${response.status}`)
      }

      setProducts(prevProducts => prevProducts.filter(product => product.item_id !== item_id))
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(`Error deleting product: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityStatus = (availability) => {
    return availability 
      ? { text: 'Available', color: 'bg-green-100 text-green-800' }
      : { text: 'Unavailable', color: 'bg-red-100 text-red-800' }
  }

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setIsAddModalOpen(false)
      setIsEditModalOpen(false)
      setEditingProduct(null)
    }
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setNewProduct({ name: '', description: '', category: '', rate: '', availability: true })
    setError(null)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
    setError(null)
  }

  const handleRefresh = () => {
    fetchCatalogs()
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Product Catalogue</h2>
          <p className="text-gray-600 mt-1">Manage your construction materials inventory</p>
        </div>
        {/* <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:cursor-not-allowed"
          title="Refresh data"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button> */}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Search and Add Product Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 max-w-sm flex-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={loading}
          className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Products ({filteredProducts.length})</h3>
          <p className="text-sm text-gray-600">Your current product inventory and pricing</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAAD00]"></div>
              <span className="ml-3 text-gray-500">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-12">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <div className="text-gray-500 text-center">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first product to get started'}
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const status = getAvailabilityStatus(product.availability)
                  return (
                    <tr key={product.item_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={product.description}>
                        {product.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {typeof product.rate === 'number' ? product.rate.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full", status.color)}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            disabled={loading}
                            className="text-gray-400 hover:text-[#FAAD00] transition-colors disabled:cursor-not-allowed"
                            title="Edit product"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.item_id)}
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:cursor-not-allowed"
                            title="Delete product"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                <p className="text-sm text-gray-600">Add a new product to your catalogue</p>
              </div>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="Enter product description"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Blocks">Blocks</option>
                  <option value="Aggregates">Aggregates</option>
                  <option value="Tools">Tools</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Paint">Paint</option>
                  <option value="Tiles">Tiles</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.rate}
                  onChange={(e) => setNewProduct({...newProduct, rate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={newProduct.availability}
                  onChange={(e) => setNewProduct({...newProduct, availability: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAddModal}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={loading || !newProduct.name.trim() || !newProduct.category || !newProduct.rate || !newProduct.description.trim()}
                className="flex-1 px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
                <p className="text-sm text-gray-600">Update product information</p>
              </div>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="Enter product description"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Blocks">Blocks</option>
                  <option value="Aggregates">Aggregates</option>
                  <option value="Tools">Tools</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Paint">Paint</option>
                  <option value="Tiles">Tiles</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Rate ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingProduct.rate}
                  onChange={(e) => setEditingProduct({...editingProduct, rate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={editingProduct.availability}
                  onChange={(e) => setEditingProduct({...editingProduct, availability: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditModal}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                disabled={loading || !editingProduct.name.trim() || !editingProduct.category || !editingProduct.rate || !editingProduct.description.trim()}
                className="flex-1 px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalogue