// src/pages/Cart.js
import React from 'react';
import CartItem from '../components/cartItem';
import { useCart } from '../contexts/CartContext';
import './cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  
  // Desestrutura funções e dados do contexto do carrinho
  const {
    items, 
    removeFromCart,
    updateQuantity,
    getTotalPrice, 
    getTotalItems, 
    clearCart
  } = useCart();

  // Navega para página de pagamento
  const handleCheckout = () => {
    navigate('/payment');
  };

  // Calcula totais do carrinho
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <section>
      <div className="container_cart">
        <h2>Cart</h2>
        {items.length > 0 ? (
          <>
            {/* Resumo do carrinho */}
            <div className="cart_summary">
              <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
            </div>
            
            {/* Lista de itens do carrinho */}
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
            
            {/* Total e ações do carrinho */}
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
          // Estado do carrinho vazio
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