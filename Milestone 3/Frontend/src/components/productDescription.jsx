// src/pages/ProductDescription.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './productDescription.css';
import ApiService from '../data/api.js';

const ProductDescription = () => {
  // Pega o ID do produto da URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para controle da página
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
    
  // Busca dados do produto quando o componente monta ou ID muda
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Controles de quantidade
  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // Adiciona produto ao carrinho e atualiza estoque
  const handleAddToCart = async () => {
    if (!product || quantity <= 0) return;
    
    try {
      // Adiciona ao carrinho
      await addToCart(product._id, quantity, product); 
      
      // Calcula e atualiza novo estoque
      const newStock = product.stock - quantity;
      await ApiService.atualizarProduto(product._id, {
        ...product,
        stock: newStock
      });
      
      // Atualiza estado local do produto
      setProduct(prev => ({
        ...prev,
        stock: newStock
      }));
      
      setQuantity(1); // Reset quantidade
      alert(`${quantity} ${product.title}(s) added to cart!`);
      
    } catch (error) {
      console.error(error);
      alert('Error adding product to cart. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Estados de carregamento e erro
  if (loading) {
    return (
      <div className="container_product_description">
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container_product_description">
        <p>{error || 'Product not found'}</p>
        <button className="btn" onClick={handleGoBack}>Back</button>
      </div>
    );
  }

  return (
    <section>
      <div className="container_product_description">
        <button className="btn" onClick={handleGoBack}>Back</button>
        
        <div className="product_content">
          {/* Imagem do produto */}
          <div className="product_image">
            <img src={product.image} alt={product.title} />
          </div>
          
          <div className="product_details">
            <h1 className="product_name">{product.title}</h1>
            <p className="product_price">R$ {product.price.toFixed(2)}</p>
            
            <div className="product_description">
              <h3>Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>

            {/* Exibe status do estoque com alertas visuais */}
            <div className="product_stock">
              <h3>Stock</h3>
              <p className={product.stock <= 5 ? 'low-stock' : ''}>
                {product.stock > 0 ? `${product.stock} available${product.stock === 1 ? '' : 'is'}` : 'Out of stock'}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="stock-warning"> - Last units!</span>
                )}
              </p>
            </div>
            
            {/* Controles de quantidade com validações */}
            <div className="quantity_control">
              <h3>Quantity</h3>
              <div className="quantity_buttons">
                <button 
                  className="quantity_btn" 
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  title="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity_value">{quantity}</span>
                <button 
                  className="quantity_btn" 
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  title="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="quantity_info">
                Maximum: {product.stock}
              </p>
            </div>
            
            {/* Cálculo do total em tempo real */}
            <div className="product_total">
              <p><strong>Total: R$ {(product.price * quantity).toFixed(2)}</strong></p>
            </div>
            
            {/* Botão principal com estados desabilitados */}
            <button 
              className="btn add_to_cart" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || quantity <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;