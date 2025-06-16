import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, Trash2, Loader, ArrowLeft, Eye, Filter, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './salesManagement.css';

const SalesManagement = ({ onBack }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    customerId: ''
  });
  const [stats, setStats] = useState(null);

  const { user: currentUser, requireAdmin } = useAuth();

  useEffect(() => {
    if (!requireAdmin()) {
      return;
    }
  }, [requireAdmin]);

  useEffect(() => {
    loadSales();
    loadStats();
  }, [filters]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.customerId) queryParams.append('customerId', filters.customerId);

      const response = await fetch(`http://localhost:5000/api/sales?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setSales(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Erro ao carregar vendas');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message, 'error');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`http://localhost:5000/api/sales/stats/general?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error(error);
      showToast(error.message, 'error');
    }
  };

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

  const handleEdit = (sale) => {
    setEditingId(sale._id);
    setEditData({
      productName: sale.productName || '',
      quantity: sale.quantity || '',
      unitPrice: sale.unitPrice || '',
      username: sale.username || '',
      status: sale.status || 'pending'
    });
  };

  const handleSave = async (saleId) => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:5000/api/sales/${saleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        await loadSales();
        await loadStats();
        setEditingId(null);
        setEditData({});
        showToast('Sale updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating sale');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error updating sale', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (saleId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta venda?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`http://localhost:5000/api/sales/${saleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadSales();
        await loadStats();
        showToast('Venda deletada com sucesso!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting sale');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error deleting sale', 'error');
    } finally {
      setSaving(false);
    }
  };

  

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const handleStatusChange = async (saleId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sales/${saleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await loadSales();
        await loadStats();
        showToast('Status updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating status');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error updating status', 'error');
    }
  };

  const updateEditData = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  
  return (
    <div className="sales-container">
      <div className="sales-wrapper">
        <div className="sales-card">
          <div className="sales-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn" onClick={handleBack}>
                <ArrowLeft size={18} />
                <span style={{ marginLeft: '0.5rem' }}>Back</span>
              </button>
              <h1 className="sales-title">Sales Management</h1>
            </div>
            <div className="header-buttons">
              <button className="btn" onClick={loadSales} disabled={saving}>
                Update
              </button>
 
            </div>
          </div>

          {stats && (
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Sales</h3>
                <p>{stats.totalSales}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="stat-card">
                <h3>Average Order Value</h3>
                <p>{formatCurrency(stats.averageOrderValue)}</p>
              </div>
              <div className="stat-card">
                <h3>Completed</h3>
                <p>{stats.statusBreakdown.completed}</p>
              </div>
            </div>
          )}

          <div className="sales-content">
            {sales.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No sales found</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(sale => (
                      <tr key={sale._id}>
                        <td>
                          {editingId === sale._id ? (
                            <input
                              type="text"
                              value={editData.productName}
                              onChange={(e) => updateEditData('productName', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            sale.productName || 'No name'
                          )}
                        </td>
                        <td>
                          {editingId === sale._id ? (
                            <input
                              type="number"
                              value={editData.quantity}
                              onChange={(e) => updateEditData('quantity', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            sale.quantity || 0
                          )}
                        </td>
                        <td>
                          {editingId === sale._id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editData.unitPrice}
                              onChange={(e) => updateEditData('unitPrice', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            formatCurrency(sale.unitPrice || 0)
                          )}
                        </td>
                        <td>{formatCurrency(sale.totalPrice || 0)}</td>
                        <td>
                          {editingId === sale._id ? (
                            <input
                              type="text"
                              value={editData.username}
                              onChange={(e) => updateEditData('username', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            sale.username || 'No username'
                          )}
                        </td>
                        <td>
                          {editingId === sale._id ? (
                            <select
                              value={editData.status}
                              onChange={(e) => updateEditData('status', e.target.value)}
                              className="input-field"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(sale.status) }}
                            >
                              {getStatusText(sale.status)}
                            </span>
                          )}
                        </td>
                        <td>{formatDate(sale.timestamp)}</td>
                        <td>
                          <div className="actions-container">
                            {editingId === sale._id ? (
                              <button
                                className="btn"
                                onClick={() => handleSave(sale._id)}
                                disabled={saving}
                              >
                                {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                              </button>
                            ) : (
                              <button
                                className="btn"
                                onClick={() => handleEdit(sale)}
                                disabled={saving}
                              >
                                <Edit size={14} />
                              </button>
                            )}
                            <button
                              className="btn"
                              onClick={() => handleDelete(sale._id)}
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
    </div>
  );
};

export default SalesManagement;