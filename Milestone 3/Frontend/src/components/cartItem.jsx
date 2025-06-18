import React, { useState } from 'react';
import './cartItem.css';

const CartItem = ({ product, quantity, productId, onRemove, onUpdateQuantity }) => {
  // Estado para controlar loading durante atualizações
  const [isUpdating, setIsUpdating] = useState(false);

  // Renderiza erro se produto não existir
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

  // Função genérica para atualizar quantidade
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

  // Aumenta quantidade respeitando estoque
  const handleIncreaseQuantity = () => {
    if (quantity < (product.stock || 999)) {
      handleQuantityChange(quantity + 1);
    }
  };

  // Diminui quantidade (mínimo 1)
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  // Remove item com confirmação
  const handleRemove = async () => {
    if (window.confirm(`Do you want to remove ${product.title} from cart?`)) {
      try {
        await onRemove();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Calcula total do item
  const itemTotal = (product.price || 0) * quantity;

return (
  <div className="cart_item">
    <div className="item_image">
      <img src={product.image} alt={product.title} />
    </div>

    <div className="item_info_wrapper">
      <div className="item_text_details">
        <h4 className="item_name">{product.title}</h4>
        <p className="item_price">R$ {product.price.toFixed(2)}</p>
        <p className="item_quantity_text">Quantity: {quantity}</p>
        <p className="item_total">Total: R$ {(product.price * quantity).toFixed(2)}</p>
      </div>

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