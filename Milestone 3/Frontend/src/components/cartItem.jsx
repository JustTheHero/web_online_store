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

  // Exemplo da nova estrutura dentro do return do seu componente CartItem
return (
  <div className="cart_item">
    {/* Coluna 1: Imagem */}
    <div className="item_image">
      <img src={product.image} alt={product.title} />
    </div>

    {/* Coluna 2: Wrapper para todas as informações */}
    <div className="item_info_wrapper">
      
      {/* Bloco de texto superior */}
      <div className="item_text_details">
        <h4 className="item_name">{product.title}</h4>
        <p className="item_price">R$ {product.price.toFixed(2)}</p>
        <p className="item_quantity_text">Quantity: {quantity}</p>
        <p className="item_total">Total: R$ {(product.price * quantity).toFixed(2)}</p>
      </div>

      {/* Bloco inferior com o botão */}
      <div className="item_actions">
        <button className="btn remove_btn" onClick={handleRemove}>
          Remove
        </button>
      </div>

    </div>
  </div>
);
};

export default CartItem;