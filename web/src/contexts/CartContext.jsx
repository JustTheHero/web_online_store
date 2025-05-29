import React, { createContext, useState, useContext } from 'react';
import products from '../data/products';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [productsData, setProductsData] = useState([...products]);

  const addToCart = (productId, quantity = 1) => {
    setProductsData(prevProducts => {
      return prevProducts.map(product => {
        if (product.id === productId) {
          const newStock = product.stock - quantity;
          return {
            ...product,
            stock: newStock >= 0 ? newStock : 0
          };
        }
        return product;
      });
    });

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        const productToAdd = productsData.find(p => p.id === productId);
        return [...prevItems, { ...productToAdd, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // Restaurar o estoque
    setProductsData(prevProducts => {
      const removedItem = cartItems.find(item => item.id === productId);
      if (!removedItem) return prevProducts;
      
      return prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            stock: product.stock + removedItem.quantity
          };
        }
        return product;
      });
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          // Encontrar o produto original para verificar o estoque
          const originalProduct = productsData.find(p => p.id === productId);
          const availableStock = originalProduct.stock + item.quantity;
          
          // Ajustar a quantidade se exceder o estoque disponível
          const adjustedQuantity = Math.min(newQuantity, availableStock);
          
          return { ...item, quantity: adjustedQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    // Restaurar todo o estoque
    setProductsData(prevProducts => {
      return prevProducts.map(product => {
        const cartItem = cartItems.find(item => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock + cartItem.quantity
          };
        }
        return product;
      });
    });
    
    setCartItems([]);
  };

  const value = {
    cartItems,
    products: productsData,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
