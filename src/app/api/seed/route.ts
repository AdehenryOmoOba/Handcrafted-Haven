import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { 
  users, 
  categories, 
  artisanProfiles, 
  products, 
  productImages, 
  reviews, 
  newsletters 
} from '@/lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers(tx: ReturnType<typeof postgres>) {
  console.log('Seeding users...');
  await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
  await tx`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'customer',
      email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return tx`
        INSERT INTO users (id, name, email, password, role, email_verified)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.email_verified});
      `;
    }),
  );

  return insertedUsers;
}

async function seedUserProfiles(tx: ReturnType<typeof postgres>) {
  console.log('Seeding user profiles...');
  await tx`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      phone VARCHAR(20),
      avatar_url TEXT,
      bio TEXT,
      location VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // Create basic profiles for all users
  const profiles = users.map(user => ({
    user_id: user.id,
    bio: user.role === 'artisan' ? 'Passionate artisan creating beautiful handcrafted items.' : 'Customer who loves unique handmade products.',
    location: 'United States'
  }));

  const insertedProfiles = await Promise.all(
    profiles.map((profile) => tx`
      INSERT INTO user_profiles (user_id, bio, location)
      VALUES (${profile.user_id}, ${profile.bio}, ${profile.location});
    `)
  );

  return insertedProfiles;
}

async function seedCategories(tx: ReturnType<typeof postgres>) {
  console.log('Seeding categories...');
  await tx`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      parent_id UUID,
      image_url TEXT,
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `;

  const insertedCategories = await Promise.all(
    categories.map((category) => tx`
      INSERT INTO categories (id, name, slug, description, parent_id, image_url, is_active, sort_order)
      VALUES (${category.id}, ${category.name}, ${category.slug}, ${category.description}, ${category.parent_id}, ${category.image_url}, ${category.is_active}, ${category.sort_order});
    `)
  );

  return insertedCategories;
}

async function seedArtisanProfiles(tx: ReturnType<typeof postgres>) {
  console.log('Seeding artisan profiles...');
  await tx`
    CREATE TABLE IF NOT EXISTS artisan_profiles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      business_name VARCHAR(255) NOT NULL,
      description TEXT,
      specialties TEXT[],
      years_experience INTEGER DEFAULT 0,
      website_url TEXT,
      instagram_handle VARCHAR(255),
      facebook_url TEXT,
      is_verified BOOLEAN DEFAULT false,
      verification_date DATE,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id)
    );
  `;

  const insertedProfiles = await Promise.all(
    artisanProfiles.map((profile) => tx`
      INSERT INTO artisan_profiles (id, user_id, business_name, description, specialties, years_experience, website_url, instagram_handle, facebook_url, is_verified, verification_date, featured)
      VALUES (${profile.id}, ${profile.user_id}, ${profile.business_name}, ${profile.description}, ${profile.specialties}, ${profile.years_experience}, ${profile.website_url}, ${profile.instagram_handle}, ${profile.facebook_url}, ${profile.is_verified}, ${profile.verification_date}, ${profile.featured});
    `)
  );

  return insertedProfiles;
}

async function seedProducts(tx: ReturnType<typeof postgres>) {
  console.log('Seeding products...');
  await tx`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      artisan_id UUID NOT NULL,
      category_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      compare_at_price DECIMAL(10,2),
      cost_price DECIMAL(10,2),
      sku VARCHAR(100),
      inventory_quantity INTEGER DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 5,
      weight DECIMAL(8,2),
      dimensions VARCHAR(255),
      materials TEXT[],
      colors TEXT[],
      sizes TEXT[],
      tags TEXT[],
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      seo_title VARCHAR(255),
      seo_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `;

  const insertedProducts = await Promise.all(
    products.map((product) => tx`
      INSERT INTO products (id, artisan_id, category_id, name, slug, description, price, compare_at_price, cost_price, sku, inventory_quantity, low_stock_threshold, weight, dimensions, materials, colors, sizes, tags, is_active, is_featured, seo_title, seo_description)
      VALUES (${product.id}, ${product.artisan_id}, ${product.category_id}, ${product.name}, ${product.slug}, ${product.description}, ${product.price}, ${product.compare_at_price}, ${product.cost_price}, ${product.sku}, ${product.inventory_quantity}, ${product.low_stock_threshold}, ${product.weight}, ${product.dimensions}, ${product.materials}, ${product.colors}, ${product.sizes}, ${product.tags}, ${product.is_active}, ${product.is_featured}, ${product.seo_title}, ${product.seo_description});
    `)
  );

  return insertedProducts;
}

async function seedProductImages(tx: ReturnType<typeof postgres>) {
  console.log('Seeding product images...');
  await tx`
    CREATE TABLE IF NOT EXISTS product_images (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL,
      url TEXT NOT NULL,
      alt_text VARCHAR(255),
      sort_order INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  const insertedImages = await Promise.all(
    productImages.map((image) => tx`
      INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
      VALUES (${image.id}, ${image.product_id}, ${image.url}, ${image.alt_text}, ${image.sort_order}, ${image.is_primary});
    `)
  );

  return insertedImages;
}

async function seedReviews(tx: ReturnType<typeof postgres>) {
  console.log('Seeding reviews...');
  await tx`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL,
      user_id UUID NOT NULL,
      order_item_id UUID,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(255) NOT NULL,
      comment TEXT,
      is_verified_purchase BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      helpful_count INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const insertedReviews = await Promise.all(
    reviews.map((review) => tx`
      INSERT INTO reviews (id, product_id, user_id, order_item_id, rating, title, comment, is_verified_purchase, is_featured, helpful_count, status)
      VALUES (${review.id}, ${review.product_id}, ${review.user_id}, ${review.order_item_id}, ${review.rating}, ${review.title}, ${review.comment}, ${review.is_verified_purchase}, ${review.is_featured}, ${review.helpful_count}, ${review.status});
    `)
  );

  return insertedReviews;
}

async function seedNewsletterSubscriptions(tx: ReturnType<typeof postgres>) {
  console.log('Seeding newsletter subscriptions...');
  await tx`
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      status VARCHAR(50) DEFAULT 'active',
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      unsubscribed_at TIMESTAMP
    );
  `;

  const insertedNewsletters = await Promise.all(
    newsletters.map((newsletter) => tx`
      INSERT INTO newsletter_subscriptions (id, email, status)
      VALUES (${newsletter.id}, ${newsletter.email}, ${newsletter.status});
    `)
  );

  return insertedNewsletters;
}

async function seedAdditionalTables(tx: ReturnType<typeof postgres>) {
  console.log('Creating additional tables...');

  // Create cart_items table
  await tx`
    CREATE TABLE IF NOT EXISTS cart_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID,
      session_id VARCHAR(255),
      product_id UUID NOT NULL,
      variant_id UUID,
      quantity INTEGER NOT NULL DEFAULT 1,
      price_at_time DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  // Create product_variants table
  await tx`
    CREATE TABLE IF NOT EXISTS product_variants (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100),
      price DECIMAL(10,2),
      inventory_quantity INTEGER DEFAULT 0,
      attributes JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  // Create orders table
  await tx`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID,
      order_number VARCHAR(50) NOT NULL UNIQUE,
      status VARCHAR(50) DEFAULT 'pending',
      payment_status VARCHAR(50) DEFAULT 'pending',
      subtotal DECIMAL(10,2) NOT NULL,
      tax_amount DECIMAL(10,2) DEFAULT 0,
      shipping_amount DECIMAL(10,2) DEFAULT 0,
      discount_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(20),
      shipping_address JSONB NOT NULL,
      billing_address JSONB NOT NULL,
      notes TEXT,
      tracking_number VARCHAR(255),
      shipped_at TIMESTAMP,
      delivered_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `;

  // Create order_items table
  await tx`
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID NOT NULL,
      product_id UUID NOT NULL,
      variant_id UUID,
      artisan_id UUID NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_time DECIMAL(10,2) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_image_url TEXT,
      variant_details JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE
    );
  `;

  // Create wishlist_items table
  await tx`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      product_id UUID NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    );
  `;

  // Create addresses table
  await tx`
    CREATE TABLE IF NOT EXISTS addresses (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      type VARCHAR(50) NOT NULL,
      is_default BOOLEAN DEFAULT false,
      name VARCHAR(255) NOT NULL,
      line1 VARCHAR(255) NOT NULL,
      line2 VARCHAR(255),
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      postal_code VARCHAR(20) NOT NULL,
      country VARCHAR(255) NOT NULL DEFAULT 'United States',
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // Create review_responses table
  await tx`
    CREATE TABLE IF NOT EXISTS review_responses (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      review_id UUID NOT NULL,
      artisan_id UUID NOT NULL,
      response TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
      FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE,
      UNIQUE(review_id)
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(async (tx) => {
      console.log('Starting database seed...');
      
      // Drop existing tables to ensure clean state
      console.log('Dropping existing tables...');
      await tx`DROP TABLE IF EXISTS review_responses CASCADE`;
      await tx`DROP TABLE IF EXISTS addresses CASCADE`;
      await tx`DROP TABLE IF EXISTS wishlist_items CASCADE`;
      await tx`DROP TABLE IF EXISTS order_items CASCADE`;
      await tx`DROP TABLE IF EXISTS orders CASCADE`;
      await tx`DROP TABLE IF EXISTS product_variants CASCADE`;
      await tx`DROP TABLE IF EXISTS cart_items CASCADE`;
      await tx`DROP TABLE IF EXISTS newsletter_subscriptions CASCADE`;
      await tx`DROP TABLE IF EXISTS reviews CASCADE`;
      await tx`DROP TABLE IF EXISTS product_images CASCADE`;
      await tx`DROP TABLE IF EXISTS products CASCADE`;
      await tx`DROP TABLE IF EXISTS artisan_profiles CASCADE`;
      await tx`DROP TABLE IF EXISTS categories CASCADE`;
      await tx`DROP TABLE IF EXISTS user_profiles CASCADE`;
      await tx`DROP TABLE IF EXISTS users CASCADE`;

      // Seed tables in correct order
      await seedUsers(tx);
      await seedUserProfiles(tx);
      await seedCategories(tx);
      await seedArtisanProfiles(tx);
      await seedProducts(tx);
      await seedProductImages(tx);
      await seedReviews(tx);
      await seedNewsletterSubscriptions(tx);
      await seedAdditionalTables(tx);

      console.log('Database seed completed successfully!');
    });

    return Response.json({ 
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}