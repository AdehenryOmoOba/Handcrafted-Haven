import postgres from 'postgres';
import {
  User,
  ProductWithDetails,
  ProductImage,
  ProductVariant,
  Category,
  ArtisanProfile,
  ReviewWithUser,
  CartItemWithProduct,
  ProductFilters,
  ProductSort,
  PaginatedResult
} from './definitions';
import { getPaginationInfo } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// User functions
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const users = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    return users[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const users = await sql<User[]>`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `;
    return users[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Category functions
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await sql<Category[]>`
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `;
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const categories = await sql<Category[]>`
      SELECT * FROM categories WHERE slug = ${slug} AND is_active = true LIMIT 1
    `;
    return categories[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category.');
  }
}

// Product functions
export async function getProducts(
  page: number = 1,
  perPage: number = 12,
  filters: ProductFilters = {},
  sort: ProductSort = 'newest'
): Promise<PaginatedResult<ProductWithDetails>> {
  try {
    const offset = (page - 1) * perPage;
    
    // Build WHERE conditions
    const whereConditions: string[] = ['p.is_active = true'];
    const params: (string | number | boolean)[] = [];
    
    if (filters.category_id) {
      whereConditions.push('p.category_id = $' + (params.length + 1));
      params.push(filters.category_id);
    }
    
    if (filters.artisan_id) {
      whereConditions.push('p.artisan_id = $' + (params.length + 1));
      params.push(filters.artisan_id);
    }
    
    if (filters.min_price !== undefined) {
      whereConditions.push('p.price >= $' + (params.length + 1));
      params.push(filters.min_price);
    }
    
    if (filters.max_price !== undefined) {
      whereConditions.push('p.price <= $' + (params.length + 1));
      params.push(filters.max_price);
    }
    
    if (filters.is_featured !== undefined) {
      whereConditions.push('p.is_featured = $' + (params.length + 1));
      params.push(filters.is_featured);
    }

    // Build ORDER BY clause
    let orderBy = 'p.created_at DESC';
    switch (sort) {
      case 'oldest':
        orderBy = 'p.created_at ASC';
        break;
      case 'price_low':
        orderBy = 'p.price ASC';
        break;
      case 'price_high':
        orderBy = 'p.price DESC';
        break;
      case 'rating':
        orderBy = 'COALESCE(r.avg_rating, 0) DESC, p.created_at DESC';
        break;
      case 'popularity':
        orderBy = 'COALESCE(r.review_count, 0) DESC, p.created_at DESC';
        break;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Get products with all related data
    const products = await sql<ProductWithDetails[]>`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        ap.business_name as artisan_business_name,
        u.name as artisan_name,
        u.email as artisan_email,
        COALESCE(r.avg_rating, 0) as avg_rating,
        COALESCE(r.review_count, 0) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      LEFT JOIN users u ON ap.user_id = u.id
      LEFT JOIN (
        SELECT 
          product_id,
          AVG(rating::numeric) as avg_rating,
          COUNT(*) as review_count
        FROM reviews 
        WHERE status = 'approved'
        GROUP BY product_id
      ) r ON p.id = r.product_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ${perPage} OFFSET ${offset}
    `;

    // Get total count for pagination
    const countResult = await sql<[{ count: string }]>`
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      ${whereClause}
    `;

    const totalCount = parseInt(countResult[0].count);
    const paginationInfo = getPaginationInfo(totalCount, page, perPage);

    return {
      data: products,
      meta: {
        current_page: paginationInfo.currentPage,
        per_page: paginationInfo.perPage,
        total_count: paginationInfo.totalCount,
        total_pages: paginationInfo.totalPages,
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
  try {
    const products = await sql<ProductWithDetails[]>`
      SELECT 
        p.*,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'description', c.description
        ) as category,
        json_build_object(
          'id', ap.id,
          'business_name', ap.business_name,
          'description', ap.description,
          'specialties', ap.specialties,
          'years_experience', ap.years_experience,
          'is_verified', ap.is_verified,
          'featured', ap.featured,
          'user', json_build_object(
            'name', u.name,
            'email', u.email
          )
        ) as artisan,
        COALESCE(r.avg_rating, 0) as avg_rating,
        COALESCE(r.review_count, 0) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      LEFT JOIN users u ON ap.user_id = u.id
      LEFT JOIN (
        SELECT 
          product_id,
          AVG(rating::numeric) as avg_rating,
          COUNT(*) as review_count
        FROM reviews 
        WHERE status = 'approved'
        GROUP BY product_id
      ) r ON p.id = r.product_id
      WHERE p.slug = ${slug} AND p.is_active = true
      LIMIT 1
    `;
    
    if (!products[0]) return undefined;

    // Get product images
    const images = await sql<ProductImage[]>`
      SELECT * FROM product_images 
      WHERE product_id = ${products[0].id} 
      ORDER BY sort_order ASC
    `;

    // Get product variants
    const variants = await sql<ProductVariant[]>`
      SELECT * FROM product_variants 
      WHERE product_id = ${products[0].id}
      ORDER BY name ASC
    `;

    return {
      ...products[0],
      images,
      variants
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

// Artisan functions
export async function getArtisans(featured: boolean = false): Promise<ArtisanProfile[]> {
  try {
    let whereClause = '';
    if (featured) {
      whereClause = 'WHERE ap.featured = true';
    }

    const artisans = await sql<ArtisanProfile[]>`
      SELECT 
        ap.*,
        u.name as user_name,
        u.email as user_email
      FROM artisan_profiles ap
      JOIN users u ON ap.user_id = u.id
      ${whereClause}
      ORDER BY ap.featured DESC, ap.created_at DESC
    `;
    
    return artisans;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisans.');
  }
}

export async function getArtisanById(id: string): Promise<ArtisanProfile | undefined> {
  try {
    const artisans = await sql<ArtisanProfile[]>`
      SELECT 
        ap.*,
        u.name as user_name,
        u.email as user_email
      FROM artisan_profiles ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.id = ${id}
      LIMIT 1
    `;
    
    return artisans[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisan.');
  }
}

// Review functions
export async function getProductReviews(
  productId: string,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedResult<ReviewWithUser>> {
  try {
    const offset = (page - 1) * perPage;
    
    const reviews = await sql<ReviewWithUser[]>`
      SELECT 
        r.*,
        json_build_object(
          'name', u.name,
          'avatar_url', up.avatar_url
        ) as user,
        json_build_object(
          'id', rr.id,
          'response', rr.response,
          'created_at', rr.created_at
        ) as response
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN review_responses rr ON r.id = rr.review_id
      WHERE r.product_id = ${productId} AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const countResult = await sql<[{ count: string }]>`
      SELECT COUNT(*) as count
      FROM reviews 
      WHERE product_id = ${productId} AND status = 'approved'
    `;

    const totalCount = parseInt(countResult[0].count);
    const paginationInfo = getPaginationInfo(totalCount, page, perPage);

    return {
      data: reviews,
      meta: {
        current_page: paginationInfo.currentPage,
        per_page: paginationInfo.perPage,
        total_count: paginationInfo.totalCount,
        total_pages: paginationInfo.totalPages,
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reviews.');
  }
}

// Search function
export async function searchProducts(
  query: string,
  page: number = 1,
  perPage: number = 12
): Promise<PaginatedResult<ProductWithDetails>> {
  try {
    const offset = (page - 1) * perPage;
    const searchTerm = `%${query}%`;

    const products = await sql<ProductWithDetails[]>`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        ap.business_name as artisan_business_name,
        u.name as artisan_name,
        COALESCE(r.avg_rating, 0) as avg_rating,
        COALESCE(r.review_count, 0) as review_count,
        ts_rank(to_tsvector('english', p.name || ' ' || p.description || ' ' || array_to_string(p.tags, ' ')), plainto_tsquery('english', ${query})) as rank
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      LEFT JOIN users u ON ap.user_id = u.id
      LEFT JOIN (
        SELECT 
          product_id,
          AVG(rating::numeric) as avg_rating,
          COUNT(*) as review_count
        FROM reviews 
        WHERE status = 'approved'
        GROUP BY product_id
      ) r ON p.id = r.product_id
      WHERE 
        p.is_active = true AND (
          p.name ILIKE ${searchTerm} OR
          p.description ILIKE ${searchTerm} OR
          array_to_string(p.tags, ' ') ILIKE ${searchTerm} OR
          ap.business_name ILIKE ${searchTerm} OR
          c.name ILIKE ${searchTerm}
        )
      ORDER BY rank DESC, p.created_at DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const countResult = await sql<[{ count: string }]>`
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      WHERE 
        p.is_active = true AND (
          p.name ILIKE ${searchTerm} OR
          p.description ILIKE ${searchTerm} OR
          array_to_string(p.tags, ' ') ILIKE ${searchTerm} OR
          ap.business_name ILIKE ${searchTerm} OR
          c.name ILIKE ${searchTerm}
        )
    `;

    const totalCount = parseInt(countResult[0].count);
    const paginationInfo = getPaginationInfo(totalCount, page, perPage);

    return {
      data: products,
      meta: {
        current_page: paginationInfo.currentPage,
        per_page: paginationInfo.perPage,
        total_count: paginationInfo.totalCount,
        total_pages: paginationInfo.totalPages,
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to search products.');
  }
}

// Cart functions
export async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  try {
    const cartItems = await sql<CartItemWithProduct[]>`
      SELECT 
        ci.*,
        json_build_object(
          'name', p.name,
          'slug', p.slug,
          'price', p.price,
          'is_active', p.is_active,
          'images', (
            SELECT json_agg(json_build_object('url', pi.url, 'alt_text', pi.alt_text))
            FROM product_images pi 
            WHERE pi.product_id = p.id AND pi.is_primary = true
            LIMIT 1
          ),
          'artisan', json_build_object(
            'business_name', ap.business_name
          )
        ) as product,
        json_build_object(
          'name', pv.name,
          'attributes', pv.attributes
        ) as variant
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN artisan_profiles ap ON p.artisan_id = ap.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.user_id = ${userId}
      ORDER BY ci.created_at DESC
    `;
    
    return cartItems;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cart items.');
  }
}

// Dashboard stats (for artisans)
export async function getArtisanStats(artisanId: string) {
  try {
    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM products WHERE artisan_id = ${artisanId} AND is_active = true) as active_products,
        (SELECT COUNT(*) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE p.artisan_id = ${artisanId}) as total_orders,
        (SELECT SUM(oi.price_at_time * oi.quantity) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE p.artisan_id = ${artisanId}) as total_revenue,
        (SELECT AVG(r.rating) FROM reviews r JOIN products p ON r.product_id = p.id WHERE p.artisan_id = ${artisanId} AND r.status = 'approved') as avg_rating
    `;

    return {
      activeProducts: parseInt(stats[0].active_products) || 0,
      totalOrders: parseInt(stats[0].total_orders) || 0,
      totalRevenue: parseFloat(stats[0].total_revenue) || 0,
      avgRating: parseFloat(stats[0].avg_rating) || 0,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisan stats.');
  }
}