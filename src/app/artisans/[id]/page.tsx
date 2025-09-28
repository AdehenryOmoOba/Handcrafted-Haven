import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { artisanProfiles, users, products, productImages, reviews, categories } from '@/lib/placeholder-data';

// Helper to get Unsplash fallback image by category
function getUnsplashImage(categoryId: string) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80';
  switch (category.slug) {
    case 'jewelry':
      return 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80';
    case 'pottery':
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
    case 'textiles':
      return 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';
    case 'woodwork':
      return 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80';
    case 'art-decor':
      return 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80';
    default:
      return 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80';
  }
}

// Custom image logic for specific products and classes
function getCustomImage(product: any) {
  const nameDesc = (product.name + ' ' + product.description).toLowerCase();
  
  // Specific product images
  if (product.name === 'Ceramic Coffee Mug Set') {
    return 'https://madebymonah.com/cdn/shop/files/Coastal_Mug-4_6979da24-9f2e-4e90-bc57-17b31d0c1022.jpg?v=1757350767&width=900';
  }
  if (product.name === 'Decorative Ceramic Vase') {
    return 'https://boxedupon.com/cdn/shop/files/61UeG8BT1mL._AC_SL1500.webp?v=1749441846&width=713';
  }
  
  // Class-based images
  if (nameDesc.includes('handcrafted')) {
    return 'https://ion.jamesallen.com/sets/Jewelry/Photoshoot/JamesAllen/Orbitvu/DiamondBasics/28008/28008_RND_0075CT_W_1_1600X1600.jpg';
  }
  if (nameDesc.includes('minimalist')) {
    return 'https://assets.vrai.com/25216/1662042666-duo-drop-earrings-round-pear-three-quarter-white.jpg?auto=compress&fit=crop&crop=focalpoint&crop=focalpoint&fm=avif&q=75&w=600&h=600&dpr=2';
  }
  return null;
}

export default async function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artisan = artisanProfiles.find((a) => a.id === id);
  if (!artisan) return notFound();

  const user = users.find((u) => u.id === artisan.user_id);
  const artisanProducts = products.filter((p) => p.artisan_id === artisan.id);

  // Get reviews for all this artisan's products
  const artisanProductIds = artisanProducts.map((p) => p.id);
  const artisanReviews = reviews.filter((r) => artisanProductIds.includes(r.product_id));

  // Use custom image for 'Handcrafted' or 'Minimalist', else Unsplash
  function getPrimaryImage(product: any) {
    const custom = getCustomImage(product);
    if (custom) return custom;
    return getUnsplashImage(product.category_id);
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-28 h-28 bg-sage-green rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-cream">
            <span className="text-5xl text-pure-white font-serif font-bold">
              {artisan.business_name.charAt(0)}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            {artisan.business_name}
          </h1>
          <div className="text-medium-gray text-sm mb-2">
            {user?.name} &bull; {artisan.years_experience} years experience
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {artisan.specialties.map((spec) => (
              <span
                key={spec}
                className="bg-cream border border-sage-green text-sage-green rounded-full px-3 py-1 text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
          <div className="flex gap-4 justify-center mb-4">
            {artisan.website_url && (
              <a
                href={artisan.website_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="hover:text-accent text-accent"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm0-12A5.5 5.5 0 1010 15.5 5.5 5.5 0 0010 2.5zm0 1a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/></svg>
              </a>
            )}
            {artisan.instagram_handle && (
              <a
                href={`https://instagram.com/${artisan.instagram_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-accent text-accent"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.721c-.49 0-.875.385-.875.875v8.958c0 .49.385.875.875.875h8.558c.49 0 .875-.385.875-.875V8.582c0-.49-.385-.875-.875-.875z"/></svg>
              </a>
            )}
            {artisan.facebook_url && (
              <a
                href={artisan.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-accent text-accent"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
          </div>
          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="inline-block mt-2 px-6 py-2 bg-accent text-pure-white rounded-lg hover:bg-primary transition-colors duration-200 font-medium text-sm shadow-md"
              aria-label={`Contact ${artisan.business_name}`}
            >
              Contact Artisan
            </a>
          )}
          {artisan.is_verified && (
            <div className="flex items-center gap-2 text-sage-green text-xs font-semibold mb-2 mt-4">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>
              Verified Artisan
            </div>
          )}
        </div>
        {/* About the Artisan section */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-deep-forest mb-3 text-left">About the Artisan</h2>
          <p className="text-charcoal text-base leading-relaxed bg-pure-white rounded-xl shadow-card p-6 border border-soft-gray">
            {artisan.description}
          </p>
        </div>
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-deep-forest mb-4 text-left">Products by {artisan.business_name}</h2>
          {artisanProducts.length === 0 ? (
            <div className="text-medium-gray text-center">No products listed yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {artisanProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-pure-white rounded-xl shadow-card p-5 flex flex-col items-start border border-soft-gray hover:shadow-lg transition-shadow duration-200 group"
                >
                  <div className="w-full h-40 relative mb-3">
                    <Image
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #E5E5E5' }}
                      className="group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>
                  <div className="font-serif text-lg font-semibold text-primary mb-1 group-hover:underline">
                    {product.name}
                  </div>
                  <div className="text-charcoal text-sm mb-2 line-clamp-2">{product.description}</div>
                  <div className="text-accent font-bold text-base mb-2">${product.price.toFixed(2)}</div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {product.materials.map((mat) => (
                      <span key={mat} className="bg-cream border border-sage-green text-sage-green rounded-full px-2 py-0.5 text-xs font-medium">{mat}</span>
                    ))}
                  </div>
                  <div className="text-xs text-medium-gray">Category: {product.category_id}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-deep-forest mb-4 text-left">Customer Reviews</h2>
          {/* Review submission form (placeholder, not functional) */}
          <form className="bg-pure-white rounded-xl shadow-card p-6 border border-soft-gray mb-8">
            <h3 className="font-serif text-lg font-semibold text-primary mb-2">Leave a Review</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-deep-forest mb-1">Your Name</label>
              <input type="text" className="w-full px-3 py-2 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your name" disabled />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-deep-forest mb-1">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="h-6 w-6 text-soft-gray" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-deep-forest mb-1">Title</label>
              <input type="text" className="w-full px-3 py-2 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Review title" disabled />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-deep-forest mb-1">Comment</label>
              <textarea className="w-full px-3 py-2 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Write your review..." disabled />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-primary text-pure-white rounded-lg font-medium hover:bg-deep-forest transition-colors duration-200" disabled>
              Submit Review (Coming Soon)
            </button>
          </form>
          {artisanReviews.length === 0 ? (
            <div className="text-medium-gray text-center">No reviews yet.</div>
          ) : (
            <div className="space-y-6">
              {artisanReviews.map((review) => {
                const reviewer = users.find((u) => u.id === review.user_id);
                const product = products.find((p) => p.id === review.product_id);
                return (
                  <div key={review.id} className="bg-pure-white rounded-xl shadow-card p-5 border border-soft-gray">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center text-pure-white font-bold">
                        {reviewer?.name ? reviewer.name.charAt(0) : '?'}
                      </div>
                      <div className="text-sm font-semibold text-primary">{reviewer?.name || 'Customer'}</div>
                      <div className="ml-auto flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`h-4 w-4 ${i < review.rating ? 'text-accent' : 'text-soft-gray'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-base font-serif font-semibold text-deep-forest mb-1">{review.title}</div>
                    <div className="text-charcoal text-sm mb-2">{review.comment}</div>
                    <div className="text-xs text-medium-gray">For: {product?.name || 'Product'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
