'use client';

import Link from 'next/link';
import UserMenu from './UserMenu';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const { cartCount } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <header className="bg-pure-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-pure-white font-bold text-lg">H</span>
            </div>
            <span className="font-serif text-xl font-semibold text-primary">Handcrafted Haven</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-charcoal hover:text-primary transition-colors duration-200 font-medium">Products</Link>
            <Link href="/artisans" className="text-charcoal hover:text-primary transition-colors duration-200 font-medium">Artisans</Link>
            <Link href="/categories" className="text-charcoal hover:text-primary transition-colors duration-200 font-medium">Categories</Link>
            <Link href="/about" className="text-charcoal hover:text-primary transition-colors duration-200 font-medium">About</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 px-4 py-2 pl-10 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-medium-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <Link href="/favorites" className="p-2 text-charcoal hover:text-primary transition-colors duration-200" aria-label="Favorites">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <Link href="/cart" className="p-2 text-charcoal hover:text-primary transition-colors duration-200 relative" aria-label="Shopping Cart">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {isHydrated && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-pure-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* Login/Logout/Register Buttons */}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

