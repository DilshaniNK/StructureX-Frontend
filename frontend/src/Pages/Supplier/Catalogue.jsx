import React, { useState } from 'react'
import { cn } from '../../Utils/cn'

const mockProducts = [
  {
    id: 1,
    name: "Portland Cement",
    category: "Cement",
    unitPrice: 12.5,
    stock: 500,
    unit: "bags",
  },
  {
    id: 2,
    name: "Steel Rebar 12mm",
    category: "Steel",
    unitPrice: 850.0,
    stock: 200,
    unit: "tons",
  },
  {
    id: 3,
    name: "Concrete Blocks",
    category: "Blocks",
    unitPrice: 2.75,
    stock: 1000,
    unit: "pieces",
  },
  {
    id: 4,
    name: "Sand (Fine)",
    category: "Aggregates",
    unitPrice: 45.0,
    stock: 50,
    unit: "cubic meters",
  },
]

const Catalogue = () => {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    unitPrice: '',
    stock: '',
    unit: 'pieces'
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.unitPrice && newProduct.stock) {
      const product = {
        id: Date.now(),
        name: newProduct.name,
        category: newProduct.category,
        unitPrice: parseFloat(newProduct.unitPrice),
        stock: parseInt(newProduct.stock),
        unit: newProduct.unit
      }
      setProducts([...products, product])
      setNewProduct({ name: '', category: '', unitPrice: '', stock: '', unit: 'pieces' })
      setIsAddModalOpen(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      unitPrice: product.unitPrice.toString(),
      stock: product.stock.toString()
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateProduct = () => {
    if (editingProduct.name && editingProduct.category && editingProduct.unitPrice && editingProduct.stock) {
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? {
              ...editingProduct,
              unitPrice: parseFloat(editingProduct.unitPrice),
              stock: parseInt(editingProduct.stock)
            }
          : product
      )
      setProducts(updatedProducts)
      setEditingProduct(null)
      setIsEditModalOpen(false)
    }
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const getStockStatus = (stock) => {
    if (stock > 100) return { text: 'In Stock', color: 'bg-green-100 text-green-800' }
    if (stock > 50) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'Critical', color: 'bg-red-100 text-red-800' }
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
    setNewProduct({ name: '', category: '', unitPrice: '', stock: '', unit: 'pieces' })
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Product Catalogue</h2>
        <p className="text-gray-600 mt-1">Manage your construction materials inventory</p>
      </div>

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
          className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm whitespace-nowrap"
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
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock)
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock} {product.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full", status.color)}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-gray-400 hover:text-[#FAAD00] transition-colors"
                          title="Edit product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
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
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.unitPrice}
                  onChange={(e) => setNewProduct({...newProduct, unitPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value="pieces">Pieces</option>
                  <option value="bags">Bags</option>
                  <option value="tons">Tons</option>
                  <option value="cubic meters">Cubic Meters</option>
                  <option value="meters">Meters</option>
                  <option value="liters">Liters</option>
                  <option value="kg">Kilograms</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAddModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.category || !newProduct.unitPrice || !newProduct.stock}
                className="flex-1 px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Product
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
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
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingProduct.unitPrice}
                  onChange={(e) => setEditingProduct({...editingProduct, unitPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={editingProduct.unit}
                  onChange={(e) => setEditingProduct({...editingProduct, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value="pieces">Pieces</option>
                  <option value="bags">Bags</option>
                  <option value="tons">Tons</option>
                  <option value="cubic meters">Cubic Meters</option>
                  <option value="meters">Meters</option>
                  <option value="liters">Liters</option>
                  <option value="kg">Kilograms</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                disabled={!editingProduct.name || !editingProduct.category || !editingProduct.unitPrice || !editingProduct.stock}
                className="flex-1 px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalogue

