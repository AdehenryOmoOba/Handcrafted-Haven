import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-light-gray">
      {/* Hero Section */}
      <section className="py-20 bg-pure-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-deep-forest mb-6">
            Our Story, Crafted with Care
          </h1>
          <p className="text-xl text-charcoal max-w-3xl mx-auto">
            We believe in the beauty of handmade, the soul in craftsmanship, and the power of slow, intentional creation.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-6">
                Why We Exist
              </h2>
              <p className="text-charcoal text-lg mb-4">
                Founded in 2025, 
Handcrafted Haven
 began as a small collective of artisans passionate about preserving traditional crafts in a digital age.
              </p>
              <p className="text-charcoal text-lg mb-6">
                Today, we connect over 200 independent makers with conscious buyers who value authenticity, sustainability, and human touch.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="text-primary text-xl mr-2">✓</span>
                  <span className="text-charcoal">Ethically sourced materials</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary text-xl mr-2">✓</span>
                  <span className="text-charcoal">Zero-waste packaging</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary text-xl mr-2">✓</span>
                  <span className="text-charcoal">Fair wages for artisans</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-sage-green to-secondary h-80 rounded-2xl shadow-card flex items-center justify-center">
              <span className="text-8xl text-pure-white">✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-pure-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-4">
              Guided by Craft & Conscience
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              These principles shape every decision we make—from sourcing to shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">Sustainability</h3>
              <p className="text-charcoal">
                We prioritize renewable materials and eco-friendly processes in every product.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">Community</h3>
              <p className="text-charcoal">
                We empower local artisans and foster collaborative, inclusive creative spaces.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">Quality</h3>
              <p className="text-charcoal">
                Every item is made with precision, patience, and pride—never rushed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-deep-forest text-pure-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Join Our Crafted Community
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Explore handcrafted treasures, support independent makers, and bring soulful design into your home.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-pure-white text-deep-forest rounded-lg font-medium text-lg hover:bg-cream transition-colors duration-200"
          >
            Discover Products
          </Link>
        </div>
      </section>
    </div>
  );
}