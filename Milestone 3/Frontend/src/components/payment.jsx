import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth.js';
import './payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const { 
    items, 
    getTotalPrice, 
    getTotalItems, 
    clearCart 
  } = useCart();
  
  const { user, loading, isAuthenticated, requireAuth } = useAuth();
  
  // Estados para dados do cartão
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  // Estados para dados adicionais do usuário
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [userErrors, setUserErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Controla o passo atual do pagamento (cartão ou confirmação)
  const [paymentStep, setPaymentStep] = useState('card-details');

  // Verifica autenticação e redireciona se necessário
  useEffect(() => {
    if (!loading) {
      const isAuthValid = requireAuth('/loginSection');
      
      if (!isAuthValid) {
        navigate('/loginSection', {
          state: { 
            from: '/payment',
            message: 'You need to login to continue' 
          } 
        });
      }
    }
  }, [loading, isAuthenticated, requireAuth, navigate]);

  // Manipula mudanças nos campos do cartão com formatação
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatação específica para cada campo
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
    
    // Remove erro quando usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Manipula mudanças nos campos de dados do usuário
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

  // Valida dados do cartão
  const validateForm = () => {
    const newErrors = {};
    
    if (cardData.number.length !== 16) {
      newErrors.number = 'Card number must have 16 digits';
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = 'Card name is required';
    }
    
    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = 'Invalid expiry date (MM/AA)';
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Valida dados adicionais do usuário
  const validateUserForm = () => {
    const newErrors = {};
    
    if (!userData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!userData.password || userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setUserErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Processa o pagamento criando vendas na API
  const processPayment = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!user || !user.id) {
        throw new Error('User data not found');
      }
      
      // Prepara dados das vendas para cada item do carrinho
      const salesData = items.map(item => ({
        productId: item.productId,
        productName: item.product.name || item.product.title,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        username: userData.username,
        password: userData.password,
        customerId: user.id, 
        status: 'pending'
      }));

      // Cria uma venda para cada item do carrinho
      const salesPromises = salesData.map(async (saleData) => {
        const response = await fetch('http://localhost:5000/api/sales', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(saleData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error creating sale: ${errorData.message || response.statusText}`);
        }

        return response.json();
      });

      const createdSales = await Promise.all(salesPromises);
      
      return {
        success: true,
        sales: createdSales,
        paymentInfo: {
          cardLastFour: getLastFourDigits(cardData.number),
          cardName: cardData.name,
          totalAmount: getTotalPrice()
        }
      };
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Submete dados do cartão e avança para confirmação
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      setPaymentStep('confirmation');
    }
  };
  
  // Submete confirmação final e processa pagamento
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setUserSubmitted(true);
    
    if (!validateUserForm()) {
      return;
    }

    setProcessing(true);
    
    try {
      const result = await processPayment();
      
      if (result.success) {
        clearCart();
        
        // Navega para página de confirmação com todos os dados
        navigate('/confirmation', {
          state: {
            paymentInfo: {
              cardLastFour: getLastFourDigits(cardData.number),
              cardName: cardData.name,
              cardExpiry: cardData.expiry
            },
            userData: userData,
            products: items,
            totalPrice: getTotalPrice(),
            sales: result.sales,
            user: user,
            totalItems: getTotalItems()
          }
        });
      }
      
    } catch (error) {
      console.error(error);
      setUserErrors({
        general: `Payment processing error: ${error.message || 'Try again.'}`
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Formata número do cartão com espaços
  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };
  
  // Extrai últimos 4 dígitos do cartão
  const getLastFourDigits = (number) => {
    return number.slice(-4);
  };
  
  // Navega de volta baseado no passo atual
  const handleGoBack = () => {
    if (paymentStep === 'confirmation') {
      setPaymentStep('card-details');
      setSubmitted(false);
    } else {
      navigate('/cart');
    }
  };

  // Estados de loading e autenticação
  if (loading) {
    return (
      <section>
        <div className="container_payment">
          <div className="loading">
            <p>Verifying authentication...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Verifica se há itens no carrinho
  if (!items || items.length === 0) {
    return (
      <section>
        <div className="container_payment">
          <div className="empty_cart">
            <h2>Empty Cart</h2>
            <p>There are no items in the cart to complete the purchase.</p>
            <button className="btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <section>
      <div className="container_payment">
        <button className="btn" onClick={handleGoBack} disabled={processing}>
          {paymentStep === 'confirmation' ? 'Back to card details' : 'Back to Cart'}
        </button>
        
        <h1 className="payment_title">Finalize your purchase</h1>
        
        <div className="payment_content">
          {/* Resumo do pedido */}
          <div className="payment_summary">
            <h2>Order Summary</h2>
            
            <div className="order_items">
              {items.map(item => (
                <div key={item.productId} className="order_item">
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
            
            <div className="order_total">
              <div className="total_items">
                <p>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
              <div className="total_price">
                <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          
          {/* Formulário de pagamento com dois passos */}
          <div className="payment_form_container">
            {paymentStep === 'card-details' ? (
              // Passo 1: Dados do cartão
              <>
                <h2>Payment Details</h2>
                
                {errors.general && (
                  <div className="error_message general_error">
                    {errors.general}
                  </div>
                )}
                
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
                      disabled={processing}
                    />
                    {errors.number && submitted && <p className="error_message">{errors.number}</p>}
                  </div>
                  
                  <div className="form_group">
                    <label htmlFor="cardName">Card Name</label>
                    <input
                      type="text"
                      id="cardName"
                      name="name"
                      placeholder="Name as it appears on the card"
                      value={cardData.name}
                      onChange={handleInputChange}
                      className={errors.name && submitted ? 'error' : ''}
                      disabled={processing}
                    />
                    {errors.name && submitted && <p className="error_message">{errors.name}</p>}
                  </div>
                  
                  <div className="form_row">
                    <div className="form_group">
                      <label htmlFor="cardExpiry">Expiry Date</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="expiry"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={handleInputChange}
                        className={errors.expiry && submitted ? 'error' : ''}
                        disabled={processing}
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
                        disabled={processing}
                      />
                      {errors.cvv && submitted && <p className="error_message">{errors.cvv}</p>}
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={processing}
                  >
                    Add Credit Card
                  </button>
                </form>
              </>
            ) : (
              // Passo 2: Confirmação e dados adicionais
              <>
                <h2>Payment Confirmation</h2>
                
                {/* Resumo do cartão */}
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
                
                {userErrors.general && (
                  <div className="error_message general_error">
                    {userErrors.general}
                  </div>
                )}
                
                <form className="confirmation_form" onSubmit={handleFinalSubmit}>
                  <h3>Order Details</h3>
                  
                  <div className="form_group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username for order confirmation"
                      value={userData.username}
                      onChange={handleUserInputChange}
                      className={userErrors.username && userSubmitted ? 'error' : ''}
                      disabled={processing}
                    />
                    {userErrors.username && userSubmitted && 
                      <p className="error_message">{userErrors.username}</p>
                    }
                  </div>
                  
                  <div className="form_group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password for order confirmation"
                      value={userData.password}
                      onChange={handleUserInputChange}
                      className={userErrors.password && userSubmitted ? 'error' : ''}
                      disabled={processing}
                    />
                    {userErrors.password && userSubmitted && 
                      <p className="error_message">{userErrors.password}</p>
                    }
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Finalize Purchase'}
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