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

<<<<<<< Updated upstream
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
=======
  return (
    <div className="cart_item">
      {/* Imagem do produto */}
      <div className="item_image">
        <img 
          src={product.image || '/placeholder-image.jpg'} 
          alt={product.title || 'Product without name'} 
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      
      {/* Detalhes do produto */}
      <div className="item_details">
        <h4 className="item_name">{product.title || 'Product without name'}</h4>
        <p className="item_price">R$ {(product.price || 0).toFixed(2)}</p>
        
        {/* Informações de estoque com alerta */}
        {product.stock !== undefined && (
          <p className="item_stock">
            Stock: {product.stock}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="stock_warning"> - Last units!</span>
            )}
          </p>
        )}
      </div>
      
      {/* Controles de quantidade */}
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
      
      {/* Total do item */}
      <div className="item_total">
        <p className="total_price">
          <strong>R$ {itemTotal.toFixed(2)}</strong>
        </p>
      </div>
      
      {/* Ação de remoção */}
>>>>>>> Stashed changes
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