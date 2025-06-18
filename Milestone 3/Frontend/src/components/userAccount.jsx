import { useState, useEffect } from "react";
import {
   Save,
   Users,
   Settings,
   ShieldCheck,
   Warehouse,
   Package,
  Star,
  X,
  LogOut,
  ShoppingCart
} from "lucide-react";
import "./UserAccount.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

const UserAccount = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, logout, updateUser, requireAuth } = useAuth();
  
  // Estados principais do componente
  const [activeSection, setActiveSection] = useState('profile'); // Seção ativa do menu
  const [showReviewModal, setShowReviewModal] = useState(false); // Controla modal de avaliação
  const [selectedOrder, setSelectedOrder] = useState(null); // Pedido selecionado para avaliar
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const [userOrders, setUserOrders] = useState([]); // Lista de pedidos do usuário
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    discord: ""
  });

  // Carrega dados do usuário e pedidos quando componente monta
  useEffect(() => {
    if (!loading && !requireAuth()) {
      return;
    }
    
    if (user) {
      setUserData({
        nome: user.nome || "",
        email: user.email || "",
        discord: user.discord || ""
      });
      loadUserOrders();
    }
  }, [user, loading]);

  // Busca pedidos do usuário na API
  const loadUserOrders = async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    try {
      const response = await fetch(`http://localhost:5000/api/sales?customerId=${user.id}`);
      if (response.ok) {
        const sales = await response.json();
        
        // Verifica se cada pedido já foi avaliado
        const salesWithReviewStatus = await Promise.all(
          sales.map(async (sale) => {
            try {
              const reviewResponse = await fetch(`http://localhost:5000/api/reviews/user/${user.id}`);
              if (reviewResponse.ok) {
                const userReviews = await reviewResponse.json();
                const hasReview = userReviews.some(review => 
                  review.orderId && review.orderId._id === sale._id
                );
                
                return {
                  ...sale,
                  hasReview
                };
              }
              return { ...sale, hasReview: false };
            } catch (error) {
              console.error('Erro ao verificar reviews:', error);
              return { ...sale, hasReview: false };
            }
          })
        );
        
        // Formata dados para exibição
        const formattedOrders = salesWithReviewStatus.map(sale => ({
          id: sale._id,
          date: new Date(sale.timestamp).toISOString().split('T')[0],
          status: sale.status === 'completed' ? 'Delivered' : 
                  sale.status === 'pending' ? 'Processing' : 
                  sale.status,
          total: `$${sale.totalPrice.toFixed(2)}`,
          product: sale.productName,
          canReview: sale.status === 'completed' && !sale.hasReview,
          saleData: sale
        }));
        
        setUserOrders(formattedOrders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Handlers para formulário de perfil
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({ ...prev, [id]: value }));
  };

  // Salva alterações do perfil
  const handleSave = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: userData.nome,
          email: userData.email,
          discord: userData.discord
        })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser({
          nome: updatedUser.nome,
          email: updatedUser.email,
          discord: updatedUser.discord
        });
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error updating profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert("Error updating profile!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/loginSection');
  };

  // Abre modal de avaliação para pedido específico
  const handleWriteReview = (order) => {
    if (!order.canReview) {
      alert("You can only review completed orders!");
      return;
    }
    setSelectedOrder(order);
    setReviewData({ rating: 0, comment: '' });
    setShowReviewModal(true);
  };

  // Fecha modal de avaliação
  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setReviewData({ rating: 0, comment: '' });
  };

  // Handlers para sistema de avaliação
  const handleStarClick = (rating) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setReviewData(prev => ({ ...prev, comment: e.target.value }));
  };

  // Envia avaliação para API
  const handleSubmitReview = async () => {
    if (reviewData.rating === 0) {
      alert("Please select a rating!");
      return;
    }
    
    try {
      const reviewPayload = {
        orderId: selectedOrder.id,  
        userId: user.id,            
        productId: selectedOrder.saleData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
  
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewPayload)
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(`Review submitted successfully! Rating: ${reviewData.rating} stars`);
        handleCloseModal();
        loadUserOrders(); // Recarrega pedidos para atualizar status de avaliação
      } else {
        const errorData = await response.json();
        alert(`Error submitting review: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro ao enviar review:', error);
      alert("Error submitting review!");
    }
  };
  
  // Configuração do menu lateral - adminOnly define se item é só para admin
  const menuItems = [
    { id: 'profile', label: 'Account Settings', icon: Settings, adminOnly: false },
    { id: 'orders', label: 'My Orders', icon: Package, adminOnly: false },
    { id: 'clients', label: 'Manage Clients', icon: Users, adminOnly: true },
    { id: 'storage', label: 'Storage', icon: Warehouse, adminOnly: true },
    { id: 'sales', label: 'Sales Management', icon: ShoppingCart, adminOnly: true },
  ];

  // Define classe CSS baseada no status do pedido
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'status-delivered';
      case 'processing':
      case 'pending':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  // Renderiza conteúdo baseado na seção ativa
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">User Profile</h2>
            </div>
            <div className="card-content">
              {/* Formulário de edição do perfil */}
              <div className="form-group">
                <label htmlFor="nome" className="form-label">Name</label>
                <input
                  id="nome"
                  value={userData.nome}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="discord" className="form-label">Discord Username</label>
                <div className="discord-input-container">
                  <div className="discord-icon">
                    <svg className="discord-svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"></path>
                    </svg>
                  </div>
                  <input
                    id="discord"
                    value={userData.discord}
                    onChange={handleChange}
                    className="discord-input"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button className="btn" onClick={handleSave}>
                  <Save className="button-icon" />
                  Save Changes
                </button>
                
                <button
                  className="btn"
                  onClick={handleLogout}
                >
                  <LogOut className="button-icon" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
       
      case 'orders':
        return (
          <>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">My Orders</h2>
              </div>
              <div className="card-content">
                {loadingOrders ? (
                  <div className="loading">Loading orders...</div>
                ) : userOrders.length === 0 ? (
                  <div className="no-orders">
                    <p>You don't have any orders yet.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {/* Lista de pedidos do usuário */}
                    {userOrders.map(order => (
                      <div key={order.id} className="order-item">
                        <div className="order-header">
                          <span className="order-id">Order #{order.id.slice(-8)}</span>
                          <span className={`order-status ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-details">
                          <p className="order-product">{order.product}</p>
                          <div className="order-meta">
                            <span className="order-date">{order.date}</span>
                            <span className="order-total">{order.total}</span>
                          </div>
                          {/* Botão de avaliação aparece apenas para pedidos elegíveis */}
                          {order.canReview && (
                            <button
                              className="review-button"
                              onClick={() => handleWriteReview(order)}
                            >
                              <Star className="review-button-icon" />
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
             
            {/* Modal de avaliação */}
            {showReviewModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title">Write Review</h3>
                    <button className="modal-close" onClick={handleCloseModal}>
                      <X />
                    </button>
                  </div>
                     
                  <div className="modal-body">
                    <div className="review-product-info">
                      <h4 className="review-product-name">{selectedOrder?.product}</h4>
                      <p className="review-order-date">Order Date: {selectedOrder?.date}</p>
                    </div>
                     
                    {/* Sistema de classificação por estrelas */}
                    <div className="rating-section">
                      <label className="rating-label">Rating *</label>
                      <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`star-button ${star <= reviewData.rating ? 'star-filled' : 'star-empty'}`}
                            onClick={() => handleStarClick(star)}
                          >
                            <Star className="star-icon" />
                          </button>
                        ))}
                      </div>
                    </div>
                     
                    <div className="comment-section">
                      <label className="comment-label">Comment</label>
                      <textarea
                        className="comment-textarea"
                        placeholder="Share your experience with this product..."
                        value={reviewData.comment}
                        onChange={handleCommentChange}
                        rows={4}
                      />
                    </div>
                  </div>
                   
                  <div className="modal-footer">
                    <button className="cancel-button" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button className="submit-button" onClick={handleSubmitReview}>
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
       
      // Seções administrativas - apenas redirecionam para outras páginas
      case 'clients':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Manage Clients</h2>
            </div>
            <div className="card-content">
              <p className="admin-content">View all users' contact information and choose to grant or revoke admin permissions for a user.</p>
              <button className="btn" onClick={() => navigate('/userManagement')}>
                <Users className="button-icon" />
                View All Clients
              </button>
            </div>
          </div>
        );
       //modal de storage
      case 'storage':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Storage Control</h2>
            </div>
            <div className="card-content">
              <p className="admin-content">View all product information, with the option to edit, remove, or add new products to the shop.</p>
              <button className="btn" onClick={() => navigate('/storage')}>
                <Warehouse className="button-icon" />
                Manage Storage
              </button>
            </div>
          </div>
        );
       //modal de sales
      case 'sales':
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Sales Management</h2>
            </div>
            <div className="card-content">
              <p className="admin-content">View all sales information, with the option to edit, remove, or add new sales to the shop.</p>
              <button className="btn" onClick={() => navigate('/salesManagement')}>
                <Warehouse className="button-icon" />
                Manage Sales
              </button>
            </div>
          </div>
        );
       
      default:
        return null;
    }
  };

  // Estados de carregamento e autenticação
  if (loading) {
    return (
      <div className="user-account-container">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-account-container">
      <div className="container">
        <div className="content-wrapper">
          {/* Menu lateral */}
          <div className="sidebar">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  {user.nome} {user.isAdmin && <ShieldCheck className="admin-badge" />}
                </h2>
                <p className="user-email">{user.email}</p>
              </div>
              <div className="card-content2">
                {menuItems.map(item => {
                  const IconComponent = item.icon;
                  // Oculta itens administrativos para usuários comuns
                  if (item.adminOnly && !user.isAdmin) {
                    return null;
                  }
                     
                  return (
                    <button
                      key={item.id}
                      className={`menu-button ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <IconComponent className="menu-icon" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
             
          {/* Conteúdo principal */}
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;