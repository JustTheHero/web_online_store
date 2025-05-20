import React, { useState } from 'react';
import CartItem from './cartItem';
import { cartProducts } from '../data/products';
import './cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(cartProducts);
  
  const totalPrice = products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
  
  const handleRemoveItem = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };
  
  return (
    <section>
      <div className="container_cart">
        <h2>Cart</h2>
        {products.length > 0 ? (
          <>
            <div className="cart_items">
              {products.map(product => (
                <CartItem 
                  key={product.id} 
                  product={product} 
                  onRemove={handleRemoveItem} 
                />
              ))}
            </div>
            <div className="cart_total">
              <h3>Total: ${totalPrice.toFixed(2)}</h3>
              <button className="btn" onClick={() => navigate('/payment')}>Checkout</button>
            </div>
          </>
        ) : (
          <div>
            <p>Your cart is empty.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;