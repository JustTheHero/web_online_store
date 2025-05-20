import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartProducts } from '../data/products';
import './payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setProducts(cartProducts.filter(product => product.quantity > 0));
  }, []);

  useEffect(() => {
    const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    setTotalPrice(total);
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '');
      formattedValue = formattedValue.slice(0, 16);
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

  const validateForm = () => {
    const newErrors = {};
    
    if (cardData.number.length !== 16) {
      newErrors.number = 'O número do cartão deve ter 16 dígitos';
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = 'Nome do titular é obrigatório';
    }
    
    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = 'Data de validade inválida';
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      alert('Pagamento processado com sucesso!');
      navigate('/confirmation');
    }
  };
  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };
  
  const handleGoBack = () => {
    navigate('/cart');
  };

  return (
    <section>
      <div className="container_payment">
        <button className="btn back_btn" onClick={handleGoBack}>← Voltar ao Carrinho</button>
        
        <h1 className="payment_title">Finalizar Compra</h1>
        
        <div className="payment_content">
          <div className="payment_summary">
            <h2>Resumo do Pedido</h2>
            
            <div className="order_items">
              {products.map(product => (
                <div key={product.id} className="order_item">
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
          
          <div className="payment_form_container">
            <h2>Dados de Pagamento</h2>
            
            <form className="payment_form" onSubmit={handleSubmit}>
              <div className="form_group">
                <label htmlFor="cardNumber">Número do Cartão</label>
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
                <label htmlFor="cardName">Nome do Titular</label>
                <input
                  type="text"
                  id="cardName"
                  name="name"
                  placeholder="Nome como está no cartão"
                  value={cardData.name}
                  onChange={handleInputChange}
                  className={errors.name && submitted ? 'error' : ''}
                />
                {errors.name && submitted && <p className="error_message">{errors.name}</p>}
              </div>
              
              <div className="form_row">
                <div className="form_group">
                  <label htmlFor="cardExpiry">Validade</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="expiry"
                    placeholder="MM/AA"
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
              
              <button type="submit" className="btn payment_btn">
                Pagar ${totalPrice.toFixed(2)} 
                {/*implementar logica de verificação de login antes de seguir com pagamento*/}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;