import React, { useState } from 'react';
import { Plus, Save, Edit, Trash2} from 'lucide-react';
import products from '../data/products';
import './storage.css';

// Simple toast notification function
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4FD3E6;
      color: #0A2342;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      z-index: 1001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };
  
  const Storage = () => {
    // Transform products data to match the original component structure
    const initialProducts = products.map(product => ({
      id: product.id,
      name: product.title,
      price: `$${product.price.toFixed(2)}`,
      stock: product.quantity,
      image: product.image,
      description: product.description,
      category: product.category
    }));
  
    const [productList, setProductList] = useState(initialProducts);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
      name: "",
      price: "$0.00",
      stock: 0,
      image: "",
      description: "",
      category: ""
    });
  
    const handleEditProduct = (product) => {
      setEditingProduct({ ...product });
    };
  
    const handleUpdateProduct = (field, value) => {
      setEditingProduct(prev => ({ ...prev, [field]: value }));
    };
  
    const handleSaveEdit = () => {
      setProductList(productList.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      showToast("Product updated successfully!");
    };
  
    const handleDeleteProduct = (id) => {
      setProductList(productList.filter(p => p.id !== id));
      showToast("Product deleted successfully!");
    };
  
    const handleSaveAll = () => {
      // In a real app, this would send data to an API
      showToast("All changes saved successfully!");
    };
  
    const handleAddNewProduct = () => {
      const newId = Math.max(...productList.map(p => p.id)) + 1;
      setProductList([...productList, { ...newProduct, id: newId }]);
      setNewProduct({
        name: "",
        price: "",
        stock: 0,
        image: "",
        description: "",
        category: ""
      });
      setIsAddDialogOpen(false);
      showToast("New product added successfully!");
    };
  
    const handleModalClose = (e) => {
      if (e.target === e.currentTarget) {
        setIsAddDialogOpen(false);
      }
    };
  
    return (
      <div className="storage-container">
        <div className="storage-wrapper">
          <div className="storage-card">
            <div className="storage-header">
              <h1 className="storage-title">Storage Management</h1>
              <div className="header-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="btn-icon" />
                  Add Product
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveAll}
                >
                  <Save className="btn-icon" />
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="storage-content">
              <div className="table-container">
                <div className="table-scroll-wrapper">
                  <table className="storage-table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-th">Name</th>
                        <th className="table-th">Price</th>
                        <th className="table-th">Stock</th>
                        <th className="table-th">Category</th>
                        <th className="table-th">Image</th>
                        <th className="table-th">Description</th>
                        <th className="table-th actions-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map(product => (
                        <tr key={product.id} className="table-row">
                          <td className="table-cell">
                            {editingProduct?.id === product.id ? (
                              <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) => handleUpdateProduct('name', e.target.value)}
                                className="input-field"
                              />
                            ) : (
                              product.name
                            )}
                          </td>
                          <td className="table-cell">
                            {editingProduct?.id === product.id ? (
                              <input
                                type="text"
                                value={editingProduct.price}
                                onChange={(e) => handleUpdateProduct('price', e.target.value)}
                                className="input-field"
                              />
                            ) : (
                              product.price
                            )}
                          </td>
                          <td className="table-cell">
                            {editingProduct?.id === product.id ? (
                              <input
                                type="number"
                                value={editingProduct.stock}
                                onChange={(e) => handleUpdateProduct('stock', parseInt(e.target.value) || 0)}
                                className="input-field"
                              />
                            ) : (
                              product.stock
                            )}
                          </td>
                          <td className="table-cell">
                            {editingProduct?.id === product.id ? (
                              <input
                                type="text"
                                value={editingProduct.category || ''}
                                onChange={(e) => handleUpdateProduct('category', e.target.value)}
                                className="input-field"
                              />
                            ) : (
                              product.category
                            )}
                          </td>
                          <td className="table-cell">
                            {editingProduct?.id === product.id ? (
                              <input
                                type="text"
                                value={editingProduct.image}
                                onChange={(e) => handleUpdateProduct('image', e.target.value)}
                                className="input-field"
                              />
                            ) : (
                              <div className="image-preview">
                                {product.image}
                              </div>
                            )}
                          </td>
                          <td className="table-cell">
                            {editingProduct?.id === product.id ? (
                              <textarea
                                value={editingProduct.description}
                                onChange={(e) => handleUpdateProduct('description', e.target.value)}
                                className="textarea-field"
                              />
                            ) : (
                              <div className="description-preview">{product.description}</div>
                            )}
                          </td>
                          <td className="table-cell actions-cell">
                            <div className="actions-container">
                              {editingProduct?.id === product.id ? (
                                <button
                                  className="btn btn-primary btn-small"
                                  onClick={handleSaveEdit}
                                >
                                  <Save className="btn-icon" />
                                </button>
                              ) : (
                                <button
                                  className="btn btn-ghost btn-small"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="btn-icon" />
                                </button>
                              )}
                              <button
                                className="btn btn-ghost btn-small delete"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="btn-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mobile-scroll-hint">
                ← Scroll horizontally to see all columns →
              </div>
            </div>
          </div>
        </div>
  
        {/* Add Product Modal */}
        {isAddDialogOpen && (
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add New Product</h2>
              </div>
              
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  className="input-field"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="textarea-field"
                />
              </div>
              
              <button 
                onClick={handleAddNewProduct}
                className="btn btn-primary btn-full-width"
              >
                Add Product
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Storage;