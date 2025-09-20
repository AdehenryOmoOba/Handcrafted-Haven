// Database type definitions for Handcrafted Haven
// This file contains type definitions for all database entities

// User types
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'artisan' | 'admin';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
};

// Artisan-specific types
export type ArtisanProfile = {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  specialties: string[];
  years_experience: number;
  website_url?: string;
  instagram_handle?: string;
  facebook_url?: string;
  is_verified: boolean;
  verification_date?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

// Category types
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Product types
export type Product = {
  id: string;
  artisan_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku?: string;
  inventory_quantity: number;
  low_stock_threshold: number;
  weight?: number;
  dimensions?: string;
  materials: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price?: number;
  inventory_quantity: number;
  attributes: Record<string, string>; // e.g., { size: 'Large', color: 'Blue' }
  created_at: string;
  updated_at: string;
};

// Shopping cart types
export type CartItem = {
  id: string;
  user_id?: string; // null for guest carts
  session_id?: string; // for guest carts
  product_id: string;
  variant_id?: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
  updated_at: string;
};

// Order types
export type Order = {
  id: string;
  user_id?: string; // null for guest orders
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  
  // Customer info
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  
  // Shipping address
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  
  // Billing address (can be same as shipping)
  billing_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  
  notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  artisan_id: string;
  quantity: number;
  price_at_time: number;
  product_name: string;
  product_image_url?: string;
  variant_details?: Record<string, string>;
  created_at: string;
};

// Review types
export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id?: string; // to verify purchase
  rating: number; // 1-5
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  is_featured: boolean;
  helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type ReviewResponse = {
  id: string;
  review_id: string;
  artisan_id: string;
  response: string;
  created_at: string;
  updated_at: string;
};

// Wishlist types
export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

// Address types
export type Address = {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  is_default: boolean;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  created_at: string;
  updated_at: string;
};

// Coupon types
export type Coupon = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minimum_amount?: number;
  maximum_discount?: number;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  starts_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
};

// Newsletter types
export type NewsletterSubscription = {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at?: string;
};

// Database query result types
export type ProductWithDetails = Product & {
  artisan: ArtisanProfile & { user: Pick<User, 'name' | 'email'> };
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  avg_rating: number;
  review_count: number;
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Pick<Product, 'name' | 'slug'>;
    artisan: Pick<ArtisanProfile, 'business_name'>;
  })[];
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'name'> & Pick<UserProfile, 'avatar_url'>;
  response?: ReviewResponse;
};

export type CartItemWithProduct = CartItem & {
  product: Pick<Product, 'name' | 'slug' | 'price' | 'is_active'> & {
    images: Pick<ProductImage, 'url' | 'alt_text'>[];
    artisan: Pick<ArtisanProfile, 'business_name'>;
  };
  variant?: Pick<ProductVariant, 'name' | 'attributes'>;
};

// Form types for API endpoints
export type CreateProductForm = Omit<Product, 'id' | 'slug' | 'created_at' | 'updated_at'>;
export type UpdateProductForm = Partial<CreateProductForm>;
export type CreateReviewForm = Omit<Review, 'id' | 'user_id' | 'is_verified_purchase' | 'is_featured' | 'helpful_count' | 'status' | 'created_at' | 'updated_at'>;
export type CreateOrderForm = Omit<Order, 'id' | 'order_number' | 'status' | 'payment_status' | 'created_at' | 'updated_at'>;

// Search and filter types
export type ProductFilters = {
  category_id?: string;
  artisan_id?: string;
  min_price?: number;
  max_price?: number;
  materials?: string[];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  is_featured?: boolean;
  rating_min?: number;
};

export type ProductSort = 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'popularity';

// Pagination types
export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};