// src/pages/ProductDescription.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './productDescription.css';
import ApiService from '../data/api.js';

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
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

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product || quantity <= 0) return;
    
    try {
      await addToCart(product._id, quantity, product); 
      const newStock = product.stock - quantity;
      await ApiService.atualizarProduto(product._id, {
        ...product,
        stock: newStock
      });
      
      setProduct(prev => ({
        ...prev,
        stock: newStock
      }));
      
      setQuantity(1);
      
      alert(`${quantity} ${product.title}(s) added to cart!`);
      
    } catch (error) {
      console.error(error);
      alert('Error adding product to cart. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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

            <div className="product_stock">
              <h3>Stock</h3>
              <p className={product.stock <= 5 ? 'low-stock' : ''}>
                {product.stock > 0 ? `${product.stock} available${product.stock === 1 ? '' : 'is'}` : 'Out of stock'}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="stock-warning"> - Last units!</span>
                )}
              </p>
            </div>
            
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
            
            <div className="product_total">
              <p><strong>Total: R$ {(product.price * quantity).toFixed(2)}</strong></p>
            </div>
            
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