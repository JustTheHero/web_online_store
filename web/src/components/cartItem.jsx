// src/components/CartItem.js
import React, { useState } from 'react';
import './cartItem.css';

const CartItem = ({ product, onRemove, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(product.quantity);

  return (
    <div className="cart_item">
      <div className="item_image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="item_details">
        <h3 className="item_title">{product.title}</h3>
        <p className="item_price">${product.price.toFixed(2)}</p>
        <p className='item_quantity'>Quantity: {quantity}</p>
        <p className="item_total">Total: ${(product.price * quantity).toFixed(2)}</p>
        
        <button className="remove_btn" onClick={() => onRemove(product.id)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;