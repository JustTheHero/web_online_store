import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cartProducts } from '../data/products';
import './productDescription.css';

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    // Em um cenário real, você buscaria os dados da API
    // Esta implementação usa os dados mockados do carrinho
    const foundProduct = cartProducts.find(product => product.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };

  const handleAddToCart = () => {
    // Aqui você implementaria a lógica para adicionar ao carrinho
    // Por exemplo, disparar uma ação do Redux ou atualizar um Context
    alert(`Adicionado ao carrinho: ${quantity} x ${product.name}`);
    
    // Navegar para o carrinho após adicionar
    navigate('/cart');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="container_product_description">
        <p>Produto não encontrado</p>
        <button className="btn back_btn" onClick={handleGoBack}>Voltar</button>
      </div>
    );
  }

  return (
    <section>
      <div className="container_product_description">
        <button className="btn back_btn" onClick={handleGoBack}>← Voltar</button>
        
        <div className="product_content">
          <div className="product_image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product_details">
            <h1 className="product_name">{product.name}</h1>
            <p className="product_price">${product.price.toFixed(2)}</p>
            
            <div className="product_description">
              <h3>Descrição</h3>
              <p>{product.description || 'Sem descrição disponível para este produto.'}</p>
            </div>
            
            <div className="quantity_control">
              <h3>Quantidade</h3>
              <div className="quantity_buttons">
                <button className="quantity_btn" onClick={handleDecreaseQuantity}>-</button>
                <span className="quantity_value">{quantity}</span>
                <button className="quantity_btn" onClick={handleIncreaseQuantity}>+</button>
              </div>
            </div>
            
            <div className="product_total">
              <p>Total: ${(product.price * quantity).toFixed(2)}</p>
            </div>
            
            <button className="btn add_to_cart" onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;