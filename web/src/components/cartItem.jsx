import React from 'react';

const CartItem = ({ product, onRemove }) => {
  return (
    <div className="cart_item">
      <img src={product.image} alt={product.name} />
      <div className="cart_item_info">
        <h3>{product.name}</h3>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>Quantity: {product.quantity}</p>
      </div>
      <button className="btn" onClick={() => onRemove(product.id)}>Remove</button>
    </div>
  );
};

export default CartItem;