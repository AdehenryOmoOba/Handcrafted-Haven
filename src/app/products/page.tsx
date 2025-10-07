'use client'; // Required for useState and interactivity

import { useState } from 'react';
import Link from 'next/link';

// Define 21 categories
const categories = [
  { id: 'jewelry', name: 'Jewelry', icon: '💎' },
  { id: 'pottery', name: 'Pottery', icon: '🏺' },
  { id: 'textiles', name: 'Textiles', icon: '🧵' },
  { id: 'woodwork', name: 'Woodwork', icon: '🪵' },
  { id: 'candles', name: 'Candles', icon: '🕯️' },
  { id: 'soap', name: 'Soap', icon: '🧼' },
  { id: 'leather', name: 'Leather Goods', icon: '👜' },
  { id: 'glass', name: 'Glass Art', icon: '🫙' },
  { id: 'metalwork', name: 'Metalwork', icon: '⚙️' },
  { id: 'basketry', name: 'Basketry', icon: '🧺' },
  { id: 'printmaking', name: 'Printmaking', icon: '🎨' },
  { id: 'embroidery', name: 'Embroidery', icon: '🪡' },
  { id: 'calligraphy', name: 'Calligraphy', icon: '✒️' },
  { id: 'paper', name: 'Paper Crafts', icon: '📄' },
  { id: 'macrame', name: 'Macramé', icon: '🪢' },
  { id: 'dyes', name: 'Natural Dyes', icon: '🌿' },
  { id: 'toys', name: 'Toy Making', icon: '🧸' },
  { id: 'bookbinding', name: 'Bookbinding', icon: '📚' },
  { id: 'enamel', name: 'Enamel Art', icon: '🔥' },
  { id: 'mosaic', name: 'Mosaic', icon: '🪩' },
  { id: 'resin', name: 'Resin Art', icon: '🌀' }
];

// Generate 10 sample products for each category
const generateProducts = (categoryId, categoryName) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${categoryId}-${i + 1}`,
    name: `${categoryName} Item ${i + 1}`,
    description: `Beautiful handcrafted ${categoryName.toLowerCase()} piece made with love and attention to detail.`,
    price: (25 + i * 5).toFixed(2), // $25, $30, $35, etc.
    icon: categories.find(c => c.id === categoryId)?.icon || '✨'
  }));
};

// Pre-generate all products
const allProducts = {};
categories.forEach(cat => {
  allProducts[cat.id] = generateProducts(cat.id, cat.name);
});

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('jewelry'); // Default to first category

  const productsToShow = allProducts[selectedCategory] || [];

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
                  <span className="mr-2">{category.icon}</span>
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

            {productsToShow.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productsToShow.map((product) => (
                  <div
                    key={product.id}
                    className="bg-pure-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="h-64 bg-gradient-to-br from-sage-green to-secondary flex items-center justify-center">
                      <span className="text-6xl text-pure-white">{product.icon}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                        {product.name}
                      </h3>
                      <p className="text-charcoal text-sm mb-4">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <button className="px-4 py-2 bg-accent text-pure-white rounded-lg hover:bg-primary transition-colors duration-200 text-sm font-medium">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-charcoal">No products found in this category.</p>
            )}

          
          </main>
        </div>
      </div>
    </div>
  );
}