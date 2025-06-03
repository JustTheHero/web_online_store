// src/pages/ProductDescription.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './productDescription.css';

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { products, addToCart } = useCart();
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id, products]);

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="container_product_description">
        <p>Product not found</p>
        <button className="btn" onClick={handleGoBack}>Go back</button>
      </div>
    );
  }

  return (
    <section>
      <div className="container_product_description">
        <button className="btn" onClick={handleGoBack}>Go back</button>
        
        <div className="product_content">
          <div className="product_image">
            <img src={product.image} alt={product.title} />
          </div>
          
          <div className="product_details">
            <h1 className="product_name">{product.title}</h1>
            <p className="product_price">${product.price.toFixed(2)}</p>
            
            <div className="product_description">
              <h3>Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>

            <div className="product_stock">
              <h3>Stock</h3>
              <p>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            </div>
            
            <div className="quantity_control">
              <h3>Quantity</h3>
              <div className="quantity_buttons">
                <button 
                  className="quantity_btn" 
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity_value">{quantity}</span>
                <button 
                  className="quantity_btn" 
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="product_total">
              <p>Total: ${(product.price * quantity).toFixed(2)}</p>
            </div>
            
            <button 
              className="btn add_to_cart" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;