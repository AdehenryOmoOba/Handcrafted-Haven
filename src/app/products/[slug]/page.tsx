'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  artisan: {
    business_name: string;
  };
  avg_rating: number;
  review_count: number;
};

type Review = {
  id: string;
  rating: number;
  title: string;
  comment: string;
  user_name: string;
  created_at: string;
  is_verified_purchase: boolean;
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      const foundProduct = data.data?.find((p: Product & { slug: string }) => p.slug === slug);
      
      if (foundProduct) {
        setProduct(foundProduct);
        fetchReviews(foundProduct.id);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const fetchReviews = async (productId: string) => {
    try {
      const response = await fetch(`/api/reviews?product_id=${productId}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          ...reviewForm,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewForm({ rating: 5, title: '', comment: '' });
        fetchReviews(product.id);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-deep-forest mb-4">Product Not Found</h1>
          <Link href="/products" className="text-primary hover:text-deep-forest">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-charcoal">
          <Link href="/products" className="hover:text-deep-forest">Products</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gradient-to-br from-sage-green to-secondary rounded-2xl aspect-square flex items-center justify-center">
            <span className="text-9xl text-pure-white">✨</span>
          </div>

          <div>
            <h1 className="font-serif text-4xl font-bold text-deep-forest mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(product.avg_rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-charcoal">
                {product.avg_rating.toFixed(1)} ({product.review_count} reviews)
              </span>
            </div>

            <p className="text-charcoal mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-sm text-charcoal mb-1">Artisan</p>
              <p className="text-lg font-semibold text-deep-forest">
                {product.artisan.business_name}
              </p>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-bold text-primary mb-2">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category_id,
              })}
              className="w-full py-4 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors font-medium text-lg mb-4"
            >
              Add to Cart
            </button>

            <Link
              href="/cart"
              className="block text-center text-charcoal hover:text-deep-forest transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>

        <div className="bg-pure-white rounded-2xl shadow-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-deep-forest">
              Customer Reviews ({reviews.length})
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors"
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-cream rounded-lg">
              <h3 className="font-semibold text-deep-forest mb-4">Write Your Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-3xl ${
                        star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Sum up your experience"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-2">Comment (Optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Share your thoughts about this product"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 border border-charcoal/20 rounded-lg hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-charcoal py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-charcoal/20 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-deep-forest">{review.user_name}</span>
                        {review.is_verified_purchase && (
                          <span className="text-xs bg-sage-green/20 text-sage-green px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-charcoal">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-deep-forest mb-2">{review.title}</h4>
                  {review.comment && (
                    <p className="text-charcoal leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
