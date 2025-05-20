import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cartProducts } from '../data/products';
import './confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState({
    cardLastFour: '1234',
    cardName: 'Nome do Titular',
    cardExpiry: '12/25'
  });
  
  // Dados de exemplo para o usuário - em um cenário real, viriam do contexto
  const [user, setUser] = useState({
    username: 'usuarioComprador',
  });

  useEffect(() => {
    // Em um cenário real, você obteria esses dados do estado global ou do contexto
    // Por enquanto, vamos simular que recebemos os dados da página de pagamento
    const purchasedProducts = cartProducts.filter(product => product.quantity > 0);
    setProducts(purchasedProducts);
    
    // Recuperar dados de pagamento (simulado)
    if (location.state && location.state.paymentInfo) {
      setPaymentInfo(location.state.paymentInfo);
    }
    
    if (location.state && location.state.userData) {
      setUser({
        username: location.state.userData.fullName
      });
    }
  }, [location]);

  useEffect(() => {
    // Calcular o preço total
    const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    setTotalPrice(total);
  }, [products]);

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToAccount = () => {
    navigate('/account');
  };

  // Gera um número de pedido aleatório
  const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Data de entrega estimada (7 dias após a compra)
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

  return (
    <section>
      <div className="container_confirmation">
        <div className="confirmation_header">
          <div className="success_icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#00BFFF" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="#00BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="confirmation_title">Compra Realizada com Sucesso!</h1>
          <p className="confirmation_message">
            Obrigado pela sua compra, <span className="highlight">{user.username}</span>! Seu pedido {orderNumber} foi confirmado.
          </p>
          <p className="delivery_info">
            Previsão de entrega: <span className="highlight">{formatDate(deliveryDate)}</span>
          </p>
        </div>
        
        <div className="confirmation_content">
          <div className="order_details">
            <h2>Detalhes do Pedido</h2>
            
            <div className="purchased_items">
              {products.map(product => (
                <div key={product.id} className="purchased_item">
                  <div className="item_info">
                    <img 
                      src={product.image} 
                      alt={product.name || product.title} 
                      className="item_image"
                    />
                    <div>
                      <p className="item_name">{product.name || product.title}</p>
                      <p className="item_quantity">Qtd: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="item_price">${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="order_total">
              <h3>Total</h3>
              <h3 className="total_price">${totalPrice.toFixed(2)}</h3>
            </div>
          </div>
          
          <div className="payment_details">
            <h2>Método de Pagamento</h2>
            
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
        
        <div className="confirmation_actions">
          <button className="home_btn" onClick={handleGoToHome}>
            Voltar para Home
          </button>
          <button className="btn account_btn" onClick={handleGoToAccount}>
            Minha Conta
          </button>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;