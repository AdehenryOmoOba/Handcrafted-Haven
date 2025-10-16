import postgres from 'postgres';
import {
  User,
  ProductWithDetails,
  ProductImage,
  ProductVariant,
  Category,
  ArtisanProfile,
  PaginatedResult,
  ProductFilters,
  ProductSort
} from './definitions';
import { getPaginationInfo } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// User functions
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const users = await sql<User[]>`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    return users[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const users = await sql<User[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
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
      SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, name ASC
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
    const whereConditions: string[] = ['p.is_active = true'];
    
    if (filters.category_id) whereConditions.push(`p.category_id = '${filters.category_id}'`);
    if (filters.artisan_id) whereConditions.push(`p.artisan_id = '${filters.artisan_id}'`);
    if (filters.min_price !== undefined) whereConditions.push(`p.price >= ${filters.min_price}`);
    if (filters.max_price !== undefined) whereConditions.push(`p.price <= ${filters.max_price}`);
    if (filters.is_featured !== undefined) whereConditions.push(`p.is_featured = ${filters.is_featured}`);

    let orderBy = 'p.created_at DESC';
    if (sort === 'oldest') orderBy = 'p.created_at ASC';
    else if (sort === 'price_low') orderBy = 'p.price ASC';
    else if (sort === 'price_high') orderBy = 'p.price DESC';

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');
    const query = `
      SELECT p.*, 
        json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'description', c.description) as category,
        json_build_object('id', ap.id, 'business_name', ap.business_name, 'description', ap.description, 
          'specialties', ap.specialties, 'years_experience', ap.years_experience, 'is_verified', ap.is_verified, 
          'featured', ap.featured, 'user', json_build_object('name', u.name, 'email', u.email)) as artisan,
        COALESCE(r.avg_rating, 0) as avg_rating, COALESCE(r.review_count, 0) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      LEFT JOIN users u ON ap.user_id = u.id
      LEFT JOIN (SELECT product_id, AVG(rating::numeric) as avg_rating, COUNT(*) as review_count 
        FROM reviews WHERE status = 'approved' GROUP BY product_id) r ON p.id = r.product_id
      ${whereClause} ORDER BY ${orderBy} LIMIT ${perPage} OFFSET ${offset}
    `;

    const products = await sql.unsafe(query) as ProductWithDetails[];
    const countQuery = `SELECT COUNT(*) as count FROM products p ${whereClause}`;
    const countResult = await sql.unsafe(countQuery) as [{ count: string }];
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
      SELECT p.*, 
        json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'description', c.description) as category,
        json_build_object('id', ap.id, 'business_name', ap.business_name, 'description', ap.description, 
          'specialties', ap.specialties, 'years_experience', ap.years_experience, 'is_verified', ap.is_verified, 
          'featured', ap.featured, 'user', json_build_object('name', u.name, 'email', u.email)) as artisan,
        COALESCE(r.avg_rating, 0) as avg_rating, COALESCE(r.review_count, 0) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisan_profiles ap ON p.artisan_id = ap.id
      LEFT JOIN users u ON ap.user_id = u.id
      LEFT JOIN (SELECT product_id, AVG(rating::numeric) as avg_rating, COUNT(*) as review_count 
        FROM reviews WHERE status = 'approved' GROUP BY product_id) r ON p.id = r.product_id
      WHERE p.slug = ${slug} AND p.is_active = true LIMIT 1
    `;
    
    if (!products[0]) return undefined;

    const images = await sql<ProductImage[]>`
      SELECT * FROM product_images WHERE product_id = ${products[0].id} ORDER BY sort_order ASC
    `;

    const variants = await sql<ProductVariant[]>`
      SELECT * FROM product_variants WHERE product_id = ${products[0].id} ORDER BY name ASC
    `;

    return { ...products[0], images, variants };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

// Artisan functions
export async function getArtisans(featured: boolean = false): Promise<ArtisanProfile[]> {
  try {
    const whereClause = featured ? 'WHERE ap.featured = true' : '';
    const query = `
      SELECT ap.*, u.name as user_name, u.email as user_email
      FROM artisan_profiles ap
      JOIN users u ON ap.user_id = u.id
      ${whereClause}
      ORDER BY ap.featured DESC, ap.created_at DESC
    `;
    return await sql.unsafe(query) as ArtisanProfile[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisans.');
  }
}

export async function getArtisanById(id: string): Promise<ArtisanProfile | undefined> {
  try {
    const artisans = await sql<ArtisanProfile[]>`
      SELECT ap.*, u.name as user_name, u.email as user_email
      FROM artisan_profiles ap JOIN users u ON ap.user_id = u.id
      WHERE ap.id = ${id} LIMIT 1
    `;
    return artisans[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisan.');
  }
}

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
