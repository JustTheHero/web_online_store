// src/components/CartItem.js
import React, { useState } from 'react';
import './cartItem.css';

const CartItem = ({ product, quantity, productId, onRemove, onUpdateQuantity }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!product) {
    return (
      <div className="cart_item">
        <p>Product not found</p>
        <button onClick={onRemove} className="btn">
          Remove
        </button>
      </div>
    );
  }

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(newQuantity);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < (product.stock || 999)) {
      handleQuantityChange(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Do you want to remove ${product.title} from cart?`)) {
      try {
        await onRemove();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const itemTotal = (product.price || 0) * quantity;

  return (
    <div className="cart_item">
      <div className="item_image">
        <img 
          src={product.image || '/placeholder-image.jpg'} 
          alt={product.title || 'Product without name'} 
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      
      <div className="item_details">
        <h4 className="item_name">{product.title || 'Product without name'}</h4>
        <p className="item_price">R$ {(product.price || 0).toFixed(2)}</p>
        
        {product.stock !== undefined && (
          <p className="item_stock">
            Stock: {product.stock}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="stock_warning"> - Last units!</span>
            )}
          </p>
        )}
      </div>
      
      <div className="item_quantity">
        <label htmlFor={`quantity-${productId}`}>Quantity:</label>
        <div className="quantity_controls">
          <button 
            className="btn"
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1 || isUpdating}
            title="Decrease quantity"
          >
            -
          </button>
          
          <span className="quantity_display" id={`quantity-${productId}`}>
            {quantity}
          </span>
          
          <button 
            className="btn"
            onClick={handleIncreaseQuantity}
            disabled={quantity >= (product.stock || 999) || isUpdating}
            title="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="item_total">
        <p className="total_price">
          <strong>R$ {itemTotal.toFixed(2)}</strong>
        </p>
      </div>
      
      <div className="item_actions">
        <button 
          className="btn"
          onClick={handleRemove}
          disabled={isUpdating}
          title="Remove item from cart"
        >
          {isUpdating ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default CartItem;