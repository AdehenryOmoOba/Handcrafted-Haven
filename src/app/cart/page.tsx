'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (price * item.quantity);
  }, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light-gray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-pure-white rounded-2xl shadow-card p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="font-serif text-3xl font-bold text-deep-forest mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-charcoal mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-deep-forest">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-sm text-charcoal hover:text-deep-forest transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-pure-white rounded-xl shadow-card p-6 flex gap-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-sage-green to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl text-pure-white">✨</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold text-deep-forest mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-charcoal mb-3 capitalize">{item.category}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-charcoal/20 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-cream transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 border-x border-charcoal/20">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-cream transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-charcoal hover:text-deep-forest transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-charcoal">
                    ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-pure-white rounded-xl shadow-card p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-deep-forest mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-charcoal">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-charcoal/20 pt-3 flex justify-between text-lg font-bold text-deep-forest">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors font-medium mb-3">
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-sm text-charcoal hover:text-deep-forest transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
