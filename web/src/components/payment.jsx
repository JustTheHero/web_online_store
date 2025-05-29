import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  
  // Estado para os dados do cartão
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  // Estado para os dados do usuário (etapa final)
  const [userData, setUserData] = useState({
    fullName: '',
    password: ''
  });
  
  // Estado para erros de validação
  const [errors, setErrors] = useState({});
  const [userErrors, setUserErrors] = useState({});
  
  // Estado para controlar quando o formulário foi submetido
  const [submitted, setSubmitted] = useState(false);
  const [userSubmitted, setUserSubmitted] = useState(false);
  
  // Estado para controlar a etapa do pagamento
  const [paymentStep, setPaymentStep] = useState('card-details');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação específica para cada campo
    let formattedValue = value;
    
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData({
      ...cardData,
      [name]: formattedValue
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    
    setUserData({
      ...userData,
      [name]: value
    });
    
    if (userErrors[name]) {
      setUserErrors({
        ...userErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (cardData.number.length !== 16) {
      newErrors.number = 'Card number must be 16 digits';
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = 'Name on card is required';
    }
    
    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = 'Invalid expiry date (MM/YY)';
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateUserForm = () => {
    const newErrors = {};
    
    if (!userData.fullName.trim()) {
      newErrors.fullName = 'Complete name is required';
    }
    
    if (!userData.password || userData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters long';
    }
    
    setUserErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      setPaymentStep('confirmation');
    }
  };
  
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setUserSubmitted(true);
    
    if (validateUserForm()) {
      clearCart();
      navigate('/confirmation', {
        state: {
          paymentInfo: {
            cardLastFour: getLastFourDigits(cardData.number),
            cardName: cardData.name,
            cardExpiry: cardData.expiry
          },
          userData: userData,
          products: cartItems,
          totalPrice: totalPrice
        }
      });
    }
  };
  
  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };
  
  const getLastFourDigits = (number) => {
    return number.slice(-4);
  };
  
  const handleGoBack = () => {
    if (paymentStep === 'confirmation') {
      setPaymentStep('card-details');
      setSubmitted(false);
    } else {
      navigate('/cart');
    }
  };

  return (
    <section>
      <div className="container_payment">
        <button className="btn" onClick={handleGoBack}>
          {paymentStep === 'confirmation' ? 'Back to card details' : 'Back to Cart'}
        </button>
        
        <h1 className="payment_title">Finish Order</h1>
        
        <div className="payment_content">
          <div className="payment_summary">
            <h2>Order Summary</h2>
            
            <div className="order_items">
              {cartItems.map(product => (
                <div key={product.id} className="order_item">
                  <div className="item_info">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="item_image"
                    />
                    <div>
                      <p className="item_name">{product.title}</p>
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
          
          <div className="payment_form_container">
            {paymentStep === 'card-details' ? (
              <>
                <h2>Payment Details</h2>
                
                <form className="payment_form" onSubmit={handleSubmit}>
                  <div className="form_group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="number"
                      placeholder="0000 0000 0000 0000"
                      value={formatCardNumber(cardData.number)}
                      onChange={handleInputChange}
                      className={errors.number && submitted ? 'error' : ''}
                    />
                    {errors.number && submitted && <p className="error_message">{errors.number}</p>}
                  </div>
                  
                  <div className="form_group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="name"
                      placeholder="Name as shown on card"
                      value={cardData.name}
                      onChange={handleInputChange}
                      className={errors.name && submitted ? 'error' : ''}
                    />
                    {errors.name && submitted && <p className="error_message">{errors.name}</p>}
                  </div>
                  
                  <div className="form_row">
                    <div className="form_group">
                      <label htmlFor="cardExpiry">Expire Date</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={handleInputChange}
                        className={errors.expiry && submitted ? 'error' : ''}
                      />
                      {errors.expiry && submitted && <p className="error_message">{errors.expiry}</p>}
                    </div>
                    
                    <div className="form_group">
                      <label htmlFor="cardCvv">CVV</label>
                      <input
                        type="text"
                        id="cardCvv"
                        name="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={handleInputChange}
                        className={errors.cvv && submitted ? 'error' : ''}
                      />
                      {errors.cvv && submitted && <p className="error_message">{errors.cvv}</p>}
                    </div>
                  </div>
                  
                  <button type="submit" className="btn">
                    Add Credit Card
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Payment Confirmation</h2>
                
                <div className="card_summary">
                  <div className="card_summary_icon">
                    <i className="card_icon"></i>
                  </div>
                  <div className="card_summary_details">
                    <p className="card_summary_number">•••• •••• •••• {getLastFourDigits(cardData.number)}</p>
                    <div className="card_summary_info">
                      <p className="card_summary_name">{cardData.name}</p>
                      <p className="card_summary_expiry">{cardData.expiry}</p>
                    </div>
                  </div>
                </div>
                
                <form className="confirmation_form" onSubmit={handleFinalSubmit}>
                  <h3>Account Details</h3>
                  
                  <div className="form_group">
                    <label htmlFor="fullName">Username</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Full Name"
                      value={userData.fullName}
                      onChange={handleUserInputChange}
                      className={userErrors.fullName && userSubmitted ? 'error' : ''}
                    />
                    {userErrors.fullName && userSubmitted && 
                      <p className="error_message">{userErrors.fullName}</p>
                    }
                  </div>
                  
                  <div className="form_group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={userData.password}
                      onChange={handleUserInputChange}
                      className={userErrors.password && userSubmitted ? 'error' : ''}
                    />
                    {userErrors.password && userSubmitted && 
                      <p className="error_message">{userErrors.password}</p>
                    }
                  </div>
                  
                  <button type="submit" className="btn">
                    Finish Order
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;