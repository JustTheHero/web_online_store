import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, Trash2, Loader, ArrowLeft } from 'lucide-react';
import ApiService from '../data/api';
import './storage.css';

const Storage = ({ onBack }) => {
  // Estados principais do componente
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID do produto sendo editado
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState({}); // Dados temporários durante edição
  
  // Estado para novo produto no modal
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    description: ''
  });

  // Carrega produtos ao montar componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Busca produtos na API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error loading products', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Exibe notificação temporária
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ef4444' : '#10b981'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack();
    } else {
      window.history.back();
    }
  };

  // Inicia modo de edição para um produto
  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      title: product.title || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      image: product.image || '',
      description: product.description || ''
    });
  };

  // Salva alterações do produto editado
  const handleSave = async (productId) => {
    try {
      setSaving(true);
      await ApiService.atualizarProduto(productId, editData);
      await loadProducts();
      setEditingId(null);
      setEditData({});
      showToast('Produto atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error updating product', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Deleta produto após confirmação
  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deletarProduto(productId);
      await loadProducts();
      showToast('Produto deletado com sucesso!');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error deleting product', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Adiciona novo produto via modal
  const handleAddProduct = async () => {
    if (!newProduct.title.trim()) {
      showToast('Nome do produto é obrigatório', 'error');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        title: newProduct.title,
        price: parseFloat(newProduct.price) || 0,
        stock: parseInt(newProduct.stock) || 0,
        category: newProduct.category,
        image: newProduct.image,
        description: newProduct.description
      };
      
      await ApiService.criarProduto(productData);
      await loadProducts();
      setNewProduct({
        title: '',
        price: '',
        stock: '',
        category: '',
        image: '',
        description: ''
      });
      setShowAddModal(false);
      showToast('Produto adicionado com sucesso!');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error adding product', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Atualiza dados temporários durante edição
  const updateEditData = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Tela de loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Loader size={48} className="animate-spin" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="storage-container">
      <div className="storage-wrapper">
        <div className="storage-card">
          {/* Cabeçalho com navegação e ações */}
          <div className="storage-header">
            <button className="btn" onClick={handleBack}>
              <ArrowLeft size={18} />
              <span style={{ marginLeft: '0.5rem' }}>Voltar</span>
            </button>
            <h1 className="storage-title">Products Management</h1>
            <div className="header-buttons">
              <button 
                className="btn"
                onClick={loadProducts}
                disabled={saving}
              >
                Atualizar
              </button>
              <button 
                className="btn"
                onClick={() => setShowAddModal(true)}
                disabled={saving}
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          </div>
          
          {/* Tabela de produtos */}
          <div className="storage-content">
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No products found</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="storage-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Image</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        {/* Células editáveis quando em modo de edição */}
                        <td>
                          {editingId === product._id ? (
                            <input
                              type="text"
                              value={editData.title}
                              onChange={(e) => updateEditData('title', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            product.title || 'No name'
                          )}
                        </td>
                        <td>
                          {editingId === product._id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editData.price}
                              onChange={(e) => updateEditData('price', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            `R$ ${(product.price || 0).toFixed(2)}`
                          )}
                        </td>
                        <td>
                          {editingId === product._id ? (
                            <input
                              type="number"
                              value={editData.stock}
                              onChange={(e) => updateEditData('stock', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            product.stock || 0
                          )}
                        </td>
                        <td>
                          {editingId === product._id ? (
                            <input
                              type="text"
                              value={editData.category}
                              onChange={(e) => updateEditData('category', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            product.category || '-'
                          )}
                        </td>
                        <td>
                          {editingId === product._id ? (
                            <input
                              type="url"
                              value={editData.image}
                              onChange={(e) => updateEditData('image', e.target.value)}
                              className="input-field"
                              placeholder="URL da imagem"
                            />
                          ) : (
                            product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              'Sem imagem'
                            )
                          )}
                        </td>
                        <td>
                          {editingId === product._id ? (
                            <textarea
                              value={editData.description}
                              onChange={(e) => updateEditData('description', e.target.value)}
                              className="textarea-field"
                              rows="2"
                            />
                          ) : (
                            <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.description || '-'}
                            </div>
                          )}
                        </td>
                        <td>
                          {/* Botões de ação: editar/salvar e deletar */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {editingId === product._id ? (
                              <button
                                className="btn btn-primary btn-small"
                                onClick={() => handleSave(product._id)}
                                disabled={saving}
                              >
                                {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                              </button>
                            ) : (
                              <button
                                className="btn btn-ghost btn-small"
                                onClick={() => handleEdit(product)}
                                disabled={saving}
                              >
                                <Edit size={14} />
                              </button>
                            )}
                            <button
                              className="btn btn-ghost btn-small delete"
                              onClick={() => handleDelete(product._id)}
                              disabled={saving}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para adicionar novo produto */}
      {showAddModal && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Product</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            {/* Formulário do novo produto */}
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
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
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
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
                type="url"
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
                rows="3"
              />
            </div>
            
            <button 
              onClick={handleAddProduct}
              className="btn btn-primary btn-full-width"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storage;