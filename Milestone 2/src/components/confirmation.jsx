import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState({
    cardLastFour: '1234',
    cardName: 'Card Holder',
    cardExpiry: '12/25'
  });
  
  const [user, setUser] = useState({
    username: 'customer',
  });

  useEffect(() => {
    // Get the products and other data from location.state
    if (location.state) {
      if (location.state.products) {
        setProducts(location.state.products);
      }
      if (location.state.paymentInfo) {
        setPaymentInfo(location.state.paymentInfo);
      }
      if (location.state.userData) {
        setUser({
          username: location.state.userData.fullName
        });
      }
      if (location.state.totalPrice) {
        setTotalPrice(location.state.totalPrice);
      }
    }
  }, [location]);

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToAccount = () => {
    navigate('/userAccount');
  };

  // Generate random order number
  const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Estimated delivery date (7 days from now)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 7);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
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
          <h1 className="confirmation_title">Successful Purchase!</h1>
          <p className="confirmation_message">
            Thanks for your purchase, <span className="highlight">{user.username}</span>! Your order {orderNumber} was confirmed.
          </p>
          <p className="delivery_info">
            Expected delivery date: <span className="highlight">{formatDate(deliveryDate)}</span>
          </p>
        </div>
        
        <div className="confirmation_content">
          <div className="order_details">
            <h2>Order Details</h2>
            
            <div className="purchased_items">
              {products.map(product => (
                <div key={product.id} className="purchased_item">
                  <div className="item_info">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="item_image"
                    />
                    <div>
                      <p className="item_name">{product.title}</p>
                      <p className="item_quantity">Qty: {product.quantity}</p>
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
        
        <div className="confirmation_actions">
          <button className="home_btn" onClick={handleGoToHome}>
            Home page
          </button>
          <button className="btn account_btn" onClick={handleGoToAccount}>
            My Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;