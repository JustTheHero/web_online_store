import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para dados da confirmação de compra
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState(0);
  
  const [userData, setUserData] = useState({
    username: 'customer',
    password: ''
  });

  const [user, setUser] = useState(null);
  const [sales, setSales] = useState([]);

  // Processa dados recebidos da navegação e redireciona se não há dados
  useEffect(() => {
    if (!location.state) {
      navigate('/', { replace: true });
      return;
    }

    const { 
      products: stateProducts, 
      paymentInfo: statePaymentInfo, 
      userData: stateUserData,
      totalPrice: stateTotalPrice,
      totalItems: stateTotalItems,
      user: stateUser,
      sales: stateSales
    } = location.state;

    // Atualiza estados com dados recebidos
    if (stateProducts) {
      setProducts(stateProducts);
    }
    if (statePaymentInfo) {
      setPaymentInfo(statePaymentInfo);
    }
    if (stateUserData) {
      setUserData(stateUserData);
    }
    if (stateTotalPrice) {
      setTotalPrice(stateTotalPrice);
    }
    if (stateTotalItems) {
      setTotalItems(stateTotalItems);
    }
    if (stateUser) {
      setUser(stateUser);
    }
    if (stateSales) {
      setSales(stateSales);
    }
    if (stateUser) {
      setUser(stateUser);
    }

  }, [location, navigate]);

  // Funções de navegação
  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToAccount = () => {
    navigate('/userAccount');
  };

  // Gera número do pedido baseado na venda ou aleatório
  const orderNumber = sales.length > 0 
    ? `#${sales[0]._id?.slice(-6).toUpperCase() || Math.floor(100000 + Math.random() * 900000)}` 
    : `#${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calcula data de entrega (7 dias a partir de hoje)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 7);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Renderiza erro se não há produtos
  if (!products || products.length === 0) {
    return (
      <section>
        <div className="container_confirmation">
          <div className="confirmation_header">
            <h1>Error in confirmation</h1>
            <p>No order data found.</p>
            <button className="btn" onClick={handleGoToHome}>
              Back to home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container_confirmation">
        {/* Cabeçalho de sucesso */}
        <div className="confirmation_header">
          <div className="success_icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#00BFFF" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="#00BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="confirmation_title">Purchase Completed Successfully!</h1>
          <p className="confirmation_message">
            Thank you for your purchase! Your order {orderNumber} has been confirmed.
          </p>
          <p className="delivery_info">
            Estimated delivery date: <span className="highlight">{formatDate(deliveryDate)}</span>
          </p>
        </div>
        
        <div className="confirmation_content">
          {/* Detalhes do pedido */}
          <div className="order_details">
            <h2>Order Details</h2>
            
            {/* Lista de itens comprados */}
            <div className="purchased_items">
              {products.map(item => (
                <div key={item.productId} className="purchased_item">
                  <div className="item_info">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name || item.product.title} 
                      className="item_image"
                    />
                    <div>
                      <p className="item_name">{item.product.name || item.product.title}</p>
                      <p className="item_quantity">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="item_price">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            {/* Resumo do pedido */}
            <div className="order_summary">
              <div className="summary_row">
                <span>Total of items:</span>
                <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
              </div>
              <div className="summary_row total_row">
                <span>Total:</span>
                <span className="total_price">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Detalhes do pagamento */}
          <div className="payment_details">
            <h2>Payment Method</h2>
            
            <div className="card_details">
              <div className="card_icon_container">
                <div className="card_icon"></div>
              </div>
              <div className="card_info">
                <p className="card_number">•••• •••• •••• {paymentInfo.cardLastFour}</p>
                <div className="card_extra_info">
                  <p className="card_name">{paymentInfo.cardName}</p>
                  <p className="card_expiry">{paymentInfo.cardExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ações finais */}
        <div className="confirmation_actions">
          <button className="btn" onClick={handleGoToHome}>
            Home Page
          </button>
          <button className="btn" onClick={handleGoToAccount}>
            My Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;