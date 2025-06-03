// src/pages/Cart.js
import React from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import './cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    totalPrice,
    clearCart
  } = useCart();
  
  const handleCheckout = () => {
    navigate('/payment');
  };

  return (
    <section>
      <div className="container_cart">
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          <>
            <div className="cart_items">
              {cartItems.map(product => (
                <CartItem 
                  key={product.id} 
                  product={product} 
                  onRemove={() => removeFromCart(product.id)}
                  onUpdateQuantity={(newQty) => updateQuantity(product.id, newQty)}
                />
              ))}
            </div>
            <div className="cart_total">
              <h3>Total: ${totalPrice.toFixed(2)}</h3>
              <div className="cart_actions">
                <button className="btn btn_clear" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="btn btn_checkout" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty_cart">
            <p>Your cart is empty.</p>
            <button className="btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;