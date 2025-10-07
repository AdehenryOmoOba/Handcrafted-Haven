// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate loading state (optional)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    updateQuantity(id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300); // Simulate API delay
  };

  const handleRemoveItem = (id: string) => {
    setIsUpdating(true);
    removeFromCart(id);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-charcoal">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-charcoal">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-pure-white rounded-2xl shadow-card p-12 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="font-serif text-2xl font-bold text-deep-forest mb-4">
              Your cart is empty
            </h2>
            <p className="text-charcoal mb-8 max-w-md mx-auto">
              Looks like you haven't added any items yet. Start shopping to fill your cart with beautiful handcrafted treasures!
            </p>
            <Link
              href="/products"
              className="px-6 py-3 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors duration-200 font-medium inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-pure-white rounded-2xl shadow-card overflow-hidden">
                <div className="border-b border-charcoal/10 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="font-serif text-xl font-bold text-deep-forest">
                      Cart Items ({cartCount})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-charcoal hover:text-primary transition-colors duration-200"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-charcoal/10">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-sage-green to-secondary rounded-lg flex items-center justify-center">
                          <span className="text-3xl text-pure-white">
                            {item.category === 'jewelry' ? '💎' :
                             item.category === 'pottery' ? '🏺' :
                             item.category === 'textiles' ? '🧵' :
                             item.category === 'woodwork' ? '🪵' : '🎨'}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <h3 className="font-serif text-lg font-semibold text-deep-forest">
                                {item.name}
                              </h3>
                              <p className="text-charcoal text-sm mt-1">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-2 sm:mt-0">
                              <div className="flex items-center border border-charcoal/20 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || isUpdating}
                                  className="px-3 py-1 text-charcoal hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={isUpdating}
                                  className="px-3 py-1 text-charcoal hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isUpdating}
                                className="text-sm text-charcoal hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-right sm:text-left">
                            <span className="font-bold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-cream border border-charcoal text-charcoal rounded-lg hover:bg-pure-white transition-colors duration-200 font-medium text-center flex-1"
                >
                  Continue Shopping
                </Link>
                
                <button
                  onClick={handleClearCart}
                  className="px-6 py-3 bg-pure-white border border-charcoal text-charcoal rounded-lg hover:bg-cream transition-colors duration-200 font-medium text-center flex-1"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-pure-white rounded-2xl shadow-card p-6 sticky top-8">
                <h2 className="font-serif text-xl font-bold text-deep-forest mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-charcoal">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-charcoal">Shipping</span>
                    <span className="font-medium">
                      {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-charcoal">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-charcoal/20 pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-deep-forest">Total</span>
                      <span className="font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={isUpdating}
                  className="w-full px-6 py-3 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-charcoal">
                    Secure checkout • Free returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}