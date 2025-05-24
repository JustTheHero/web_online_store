import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartProducts } from '../data/products';
import './payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
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

  useEffect(() => {
    // Em um caso real, você buscaria os itens do carrinho de um estado global
    // Por enquanto, vamos usar os mesmos dados mockados
    setProducts(cartProducts.filter(product => product.quantity > 0));
  }, []);

  useEffect(() => {
    // Calcular o preço total
    const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    setTotalPrice(total);
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação específica para cada campo
    let formattedValue = value;
    
    if (name === 'number') {
      // Remover qualquer caractere que não seja número
      formattedValue = value.replace(/\D/g, '');
      // Limitar a 16 dígitos
      formattedValue = formattedValue.slice(0, 16);
    } else if (name === 'expiry') {
      // Formatar MM/AA
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    } else if (name === 'cvv') {
      // Limitar a 3-4 dígitos numéricos
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData({
      ...cardData,
      [name]: formattedValue
    });
    
    // Limpar erro do campo atual ao digitar
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
    
    // Limpar erro do campo atual ao digitar
    if (userErrors[name]) {
      setUserErrors({
        ...userErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar número do cartão (16 dígitos)
    if (cardData.number.length !== 16) {
      newErrors.number = 'O número do cartão deve ter 16 dígitos';
    }
    
    // Validar nome
    if (!cardData.name.trim()) {
      newErrors.name = 'Nome do titular é obrigatório';
    }
    
    // Validar data de expiração
    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = 'Data de validade inválida';
    }
    
    // Validar CVV
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateUserForm = () => {
    const newErrors = {};
    
    // Validar nome completo
    if (!userData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    // Validar senha
    if (!userData.password || userData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    setUserErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      // Mudar para a próxima etapa
      setPaymentStep('confirmation');
    }
  };
  
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setUserSubmitted(true);
    
    if (validateUserForm()) {
      // Em um cenário real, você enviaria os dados para processamento
      // Após processamento bem-sucedido, navegue para a página de confirmação
      // com os dados da compra
      navigate('/confirmation', {
        state: {
          paymentInfo: {
            cardLastFour: getLastFourDigits(cardData.number),
            cardName: cardData.name,
            cardExpiry: cardData.expiry
          },
          userData: userData,
          products: products,
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
          {paymentStep === 'confirmation' ? 'Voltar aos Dados do Cartão' : 'Voltar ao Carrinho'}
        </button>
        
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
            {paymentStep === 'card-details' ? (
              <>
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
                  
                  <button type="submit" className="btn">
                    Adicionar Cartão
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Confirmação de Pagamento</h2>
                
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
                  <h3>Dados da conta</h3>
                  
                  <div className="form_group">
                    <label htmlFor="fullName">Nome de usuario</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Nome do usuario"
                      value={userData.fullName}
                      onChange={handleUserInputChange}
                      className={userErrors.fullName && userSubmitted ? 'error' : ''}
                    />
                    {userErrors.fullName && userSubmitted && 
                      <p className="error_message">{userErrors.fullName}</p>
                    }
                  </div>
                  
                  <div className="form_group">
                    <label htmlFor="password">Senha</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Senha"
                      value={userData.password}
                      onChange={handleUserInputChange}
                      className={userErrors.password && userSubmitted ? 'error' : ''}
                    />
                    {userErrors.password && userSubmitted && 
                      <p className="error_message">{userErrors.password}</p>
                    }
                  </div>
                  
                  <button type="submit" className="btn">
                    Finalizar Compra
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