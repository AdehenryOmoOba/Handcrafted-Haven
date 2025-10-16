export default function CategoriesPage() {
  const categories = [
    { name: 'Jewelry', icon: '💎', description: 'Handcrafted rings, necklaces, and accessories' },
    { name: 'Pottery', icon: '🏺', description: 'Unique ceramic pieces and pottery' },
    { name: 'Textiles', icon: '🧵', description: 'Handwoven fabrics and textile art' },
    { name: 'Woodwork', icon: '🪵', description: 'Custom wooden furniture and decor' },
    { name: 'Candles', icon: '🕯️', description: 'Artisanal soy candles with natural scents' },
    { name: 'Soap', icon: '🧼', description: 'Handmade soaps with organic ingredients' },
    { name: 'Leather Goods', icon: '👜', description: 'Hand-stitched wallets, bags, and accessories' },
    { name: 'Glass Art', icon: '🫙', description: 'Blown and stained glass creations' },
    { name: 'Metalwork', icon: '⚙️', description: 'Forged iron and copper decorative items' },
    { name: 'Basketry', icon: '🧺', description: 'Woven baskets from natural fibers' },
    { name: 'Printmaking', icon: '🎨', description: 'Hand-pressed prints and block art' },
    { name: 'Embroidery', icon: '🪡', description: 'Intricate stitched designs on fabric' },
    { name: 'Calligraphy', icon: '✒️', description: 'Elegant hand-lettered art and stationery' },
    { name: 'Paper Crafts', icon: '📄', description: 'Handmade cards, journals, and origami' },
    { name: 'Macramé', icon: '🪢', description: 'Knotted wall hangings and plant hangers' },
    { name: 'Natural Dyes', icon: '🌿', description: 'Plant-based dyed fabrics and yarns' },
    { name: 'Toy Making', icon: '🧸', description: 'Wooden and fabric toys for all ages' },
    { name: 'Bookbinding', icon: '📚', description: 'Hand-bound journals and sketchbooks' },
    { name: 'Enamel Art', icon: '🔥', description: 'Vitreous enamel jewelry and decor' },
    { name: 'Mosaic', icon: '🪩', description: 'Tile and glass mosaic wall art' },
    { name: 'Resin Art', icon: '🌀', description: 'Epoxy resin coasters, trays, and decor' }
  ];

  return (
    <div className="min-h-screen">
      
      <section className="py-16 bg-pure-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-forest mb-4">
              All Categories
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Explore our curated collection of handcrafted items across various categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-cream rounded-xl p-6 text-center hover:shadow-card transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-deep-forest mb-2">
                  {category.name}
                </h3>
                <p className="text-charcoal text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}