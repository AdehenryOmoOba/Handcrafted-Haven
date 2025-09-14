import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream to-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-deep-forest mb-6">
              Discover Handcrafted
              <span className="text-primary block">Treasures</span>
            </h1>
            <p className="text-lg md:text-xl text-charcoal mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with talented artisans and find unique, handmade products that tell a story. 
              Every item is crafted with love, skill, and attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-3 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors duration-200 font-medium text-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/artisans"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-pure-white transition-colors duration-200 font-medium text-lg"
              >
                Meet Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-pure-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Explore our curated collection of handcrafted items across various categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Jewelry', icon: '💎', description: 'Handcrafted rings, necklaces, and accessories' },
              { name: 'Pottery', icon: '🏺', description: 'Unique ceramic pieces and pottery' },
              { name: 'Textiles', icon: '🧵', description: 'Handwoven fabrics and textile art' },
              { name: 'Woodwork', icon: '🪵', description: 'Custom wooden furniture and decor' }
            ].map((category) => (
              <div key={category.name} className="bg-cream rounded-xl p-6 text-center hover:shadow-card transition-shadow duration-200">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                  {category.name}
                </h3>
                <p className="text-charcoal text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Discover some of our most popular handcrafted items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-pure-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="h-64 bg-gradient-to-br from-sage-green to-secondary flex items-center justify-center">
                  <span className="text-6xl text-pure-white">🎨</span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                    Handcrafted Item {item}
                  </h3>
                  <p className="text-charcoal text-sm mb-4">
                    Beautiful handcrafted piece made with love and attention to detail.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">$49.99</span>
                    <button className="px-4 py-2 bg-accent text-pure-white rounded-lg hover:bg-primary transition-colors duration-200 text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="px-8 py-3 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors duration-200 font-medium text-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Handcrafted Haven */}
      <section className="py-16 bg-pure-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-4">
              Why Choose Handcrafted Haven?
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              We're more than just a marketplace - we're a community celebrating craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-pure-white">✨</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                Unique & Authentic
              </h3>
              <p className="text-charcoal">
                Every item is one-of-a-kind, crafted by skilled artisans who pour their passion into their work.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-pure-white">🤝</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                Support Artisans
              </h3>
              <p className="text-charcoal">
                Your purchase directly supports independent artisans and helps preserve traditional crafts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-pure-white">🌱</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                Sustainable Choice
              </h3>
              <p className="text-charcoal">
                Handcrafted items are often made with sustainable materials and ethical practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-deep-forest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-pure-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-cream mb-8">
            Join our community of artisans and customers who value authentic craftsmanship
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-pure-white text-primary rounded-lg hover:bg-cream transition-colors duration-200 font-medium text-lg"
            >
              Become an Artisan
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border-2 border-pure-white text-pure-white rounded-lg hover:bg-pure-white hover:text-primary transition-colors duration-200 font-medium text-lg"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
