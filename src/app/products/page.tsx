'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Category, ProductWithDetails } from '@/lib/definitions';

// Category icons mapping
const categoryIcons: Record<string, string> = {
  'jewelry': '💎',
  'pottery': '🏺',
  'textiles': '🧵',
  'woodwork': '🪵',
  'art-decor': '🎨',
};

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?category_id=${selectedCategory}&per_page=20`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (error) {
    return (
      <div className="min-h-screen bg-light-gray py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-deep-forest mb-4">Error Loading Products</h1>
          <p className="text-charcoal">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest">
            All Products
          </h1>
          <p className="text-lg text-charcoal max-w-2xl mx-auto mt-2">
            Browse handcrafted items by category
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 bg-pure-white rounded-xl p-6 shadow-card h-fit">
            <h2 className="font-serif text-xl font-bold text-deep-forest mb-4">Categories</h2>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-pure-white font-medium'
                      : 'text-charcoal hover:bg-cream'
                  }`}
                >
                  <span className="mr-2">{categoryIcons[category.slug] || '✨'}</span>
                  {category.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Products Grid */}
          <main className="lg:w-3/4">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-deep-forest">
                {categories.find(c => c.id === selectedCategory)?.name || 'Products'}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-pure-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="h-64 bg-gradient-to-br from-sage-green to-secondary flex items-center justify-center cursor-pointer">
                        <span className="text-6xl text-pure-white">
                          {categoryIcons[categories.find(c => c.id === product.category_id)?.slug || ''] || '✨'}
                        </span>
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2 hover:text-primary cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-charcoal text-sm mb-2">
                        by {product.artisan?.business_name || 'Unknown Artisan'}
                      </p>
                      <p className="text-charcoal text-sm mb-4 line-clamp-3">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <button
                          onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            category: product.category_id
                          })}
                          className="px-4 py-2 bg-accent text-pure-white rounded-lg hover:bg-primary hover:text-pure-white transition-colors duration-200 text-sm font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-charcoal text-lg">No products found in this category.</p>
                <p className="text-charcoal text-sm mt-2">Try selecting a different category or check back later.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}