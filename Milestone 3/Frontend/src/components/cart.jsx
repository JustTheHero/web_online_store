// src/pages/Cart.js
import React from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import './cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const {
    items, 
    removeFromCart,
    updateQuantity,
    getTotalPrice, 
    getTotalItems, 
    clearCart
  } = useCart();

  const handleCheckout = () => {
    navigate('/payment');
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <section>
      <div className="container_cart">
        <h2>Cart</h2>
        {items.length > 0 ? (
          <>
            <div className="cart_summary">
              <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
            </div>
            
            <div className="cart_items">
              {items.map(item => (
                <CartItem
                  key={item.productId} 
                  product={item.product} 
                  quantity={item.quantity} 
                  productId={item.productId} 
                  productImage={item.image}
                  onRemove={() => removeFromCart(item.productId)}
                  onUpdateQuantity={(newQty) => updateQuantity(item.productId, newQty)}
                />
              ))}
            </div>
            
            <div className="cart_total">
              <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
              <div className="cart_actions">
                <button className="btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty_cart">
            <p>Cart is empty.</p>
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