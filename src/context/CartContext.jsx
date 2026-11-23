import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

// Create the Context
const CartContext = createContext(null);

// Initial State
const initialCartState = {
  items: [
    // Pre-populate with 1 item so the user immediately sees a live cart
    {
      id: 1,
      name: "Aura Noise-Cancelling Headphones",
      category: "Electronics",
      price: 249.99,
      originalPrice: 299.99,
      rating: 4.8,
      stock: 12,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      quantity: 1
    }
  ],
  coupon: null, // { code: 'SAVE20', discountPercent: 20 }
};

/**
 * Pure Reducer Function
 * 
 * WHY useReducer:
 * Cart updates involve multi-step relational logic (checking if item exists,
 * capping at stock limits, recalculating item counts, applying percentage coupons).
 * Centralizing this in a reducer guarantees predictable, reproducible state mutations.
 */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        const currentItem = updatedItems[existingIndex];
        const newQty = Math.min(currentItem.quantity + (action.payload.quantity || 1), currentItem.stock);
        updatedItems[existingIndex] = { ...currentItem, quantity: newQty };
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id)
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id)
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
        )
      };
    }

    case 'APPLY_COUPON': {
      const code = action.payload.trim().toUpperCase();
      if (code === 'SAVE20') {
        return { ...state, coupon: { code: 'SAVE20', rate: 0.20, label: '20% Off' } };
      }
      if (code === 'HALFOFF') {
        return { ...state, coupon: { code: 'HALFOFF', rate: 0.50, label: '50% Flash Off' } };
      }
      if (code === 'FREESHIP') {
        return { ...state, coupon: { code: 'FREESHIP', rate: 0, freeShipping: true, label: 'Free Shipping' } };
      }
      return state;
    }

    case 'REMOVE_COUPON':
      return { ...state, coupon: null };

    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  /**
   * HOOK: useReducer
   * Used for robust, complex shopping cart state manipulation.
   */
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  /**
   * HOOK: useCallback
   * Memoizes dispatch action wrappers so they keep a stable reference across renders.
   * This prevents unnecessary re-renders in memoized child components like ProductCard and CartItem.
   */
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const applyCoupon = useCallback((code) => {
    dispatch({ type: 'APPLY_COUPON', payload: code });
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: 'REMOVE_COUPON' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  /**
   * HOOK: useMemo
   * Memoizes financial calculations (subtotal, discounts, taxes, shipping, grand total).
   * WHY: Prevents recalculating these numbers when unrelated component states (like search inputs,
   * filter tags, or theme toggles) cause re-renders.
   */
  const summary = useMemo(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let discount = 0;
    if (state.coupon?.rate) {
      discount = subtotal * state.coupon.rate;
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08; // 8% sales tax

    const isFreeShipping = state.coupon?.freeShipping || subtotal > 150 || state.items.length === 0;
    const shipping = isFreeShipping ? 0 : 15.00;

    const total = taxableAmount + tax + shipping;

    return {
      totalItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      hasFreeShipping: isFreeShipping
    };
  }, [state.items, state.coupon]);

  // Provide memoized context value to prevent unnecessary re-rendering of consumers
  const value = useMemo(() => ({
    cart: state.items,
    coupon: state.coupon,
    summary,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart
  }), [state.items, state.coupon, summary, addToCart, removeFromCart, updateQuantity, applyCoupon, removeCoupon, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Custom Hook: useCart
 * 
 * HOOK USED: useContext
 * WHY: Provides easy and typed access to CartContext from any nested component
 * without tedious prop drilling. Throws an informative error if used outside CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
