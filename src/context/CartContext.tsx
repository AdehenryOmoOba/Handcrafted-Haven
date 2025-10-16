// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        console.error('Failed to parse cart items');
        setCartItems([]);
      }
    }
  }, []);

  // Save to localStorage whenever cartItems changes (only after hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  // Compute cartCount from cartItems (no separate state needed)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    // Ensure price is a number
    const normalizedItem = {
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
    };

    // Optimistic update
    setCartItems(prev => {
      const existing = prev.find(i => i.id === normalizedItem.id);
      if (existing) {
        return prev.map(i =>
          i.id === normalizedItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...normalizedItem, quantity: 1 }];
    });

    // Sync with backend
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: item.id, quantity: 1 }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to add to cart:', error);
        // Could revert optimistic update here if needed
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      // Cart still works with localStorage as fallback
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}