import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, quantity, product } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          updatedAt: new Date().toISOString()
        };
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        const newItem = {
          productId,
          quantity,
          product: { ...product },
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return {
          ...state,
          items: [...state.items, newItem]
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.productId !== productId)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.productId !== productId)
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.productId === productId
          ? { 
              ...item, 
              quantity,
              updatedAt: new Date().toISOString()
            }
          : item
      );
      
      return {
        ...state,
        items: updatedItems
      };
    }
    
    case 'UPDATE_PRODUCT_DATA': {
      const { productId, productData } = action.payload;
      const updatedItems = state.items.map(item =>
        item.productId === productId
          ? { 
              ...item, 
              product: { ...item.product, ...productData },
              updatedAt: new Date().toISOString()
            }
          : item
      );
      
      return {
        ...state,
        items: updatedItems
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'LOAD_CART': {
      const { items } = action.payload;
      return {
        ...state,
        items: Array.isArray(items) ? items : []
      };
    }
    default:
      return state;
  }
};

const initialState = {
  items: [],
  lastSync: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          
          if (parsedCart && Array.isArray(parsedCart.items)) {
            dispatch({
              type: 'LOAD_CART',
              payload: parsedCart
            });
          }
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('cart');
      }
    };

    loadCartFromStorage();
  }, []);

  useEffect(() => {
    try {
      const cartData = {
        items: state.items,
        lastSync: state.lastSync,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error(error);
    }
  }, [state]);

  const addToCart = async (productId, quantity, product) => {
    try {
      if (!productId || !product || quantity <= 0) {
        throw new Error('Invalid data to add to cart');
      }

      dispatch({
        type: 'ADD_ITEM',
        payload: { productId, quantity, product }
      });
      
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (!productId || quantity < 0) return;
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity }
    });
  };

  const updateProductData = (productId, productData) => {
    if (!productId || !productData) return;
    
    dispatch({
      type: 'UPDATE_PRODUCT_DATA',
      payload: { productId, productData }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);  
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getCartItem = (productId) => {
    return state.items.find(item => item.productId === productId) || null;
  };

  const validateCart = () => {
    const validItems = state.items.filter(item => {
      return item.productId && 
             item.product && 
             item.quantity > 0;
    });

    if (validItems.length !== state.items.length) {
      dispatch({
        type: 'LOAD_CART',
        payload: { items: validItems }
      });
    }

    return validItems;
  };

  const value = {
    items: state.items,
    lastSync: state.lastSync,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateProductData,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    getCartItem,
    validateCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  
  return context;
};