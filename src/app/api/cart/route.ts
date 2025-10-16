import { auth } from '../../../../auth';
import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// GET - Fetch user's cart items
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID
    const users = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!users[0]) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Get cart items with product details
    const cartItems = await sql`
      SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.price_at_time,
        p.name,
        p.price,
        p.slug,
        p.is_active,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url,
        ap.business_name as artisan_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN artisan_profiles ap ON p.artisan_id = ap.id
      WHERE ci.user_id = ${userId}
      ORDER BY ci.created_at DESC
    `;

    return Response.json({ items: cartItems });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { product_id, quantity = 1 } = body;

    if (!product_id) {
      return Response.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Get user ID
    const users = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!users[0]) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Get product details
    const products = await sql<{ id: string; price: number; is_active: boolean }[]>`
      SELECT id, price, is_active FROM products WHERE id = ${product_id} LIMIT 1
    `;

    if (!products[0]) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!products[0].is_active) {
      return Response.json({ error: 'Product not available' }, { status: 400 });
    }

    const product = products[0];

    // Check if item already in cart
    const existing = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${product_id}
      LIMIT 1
    `;

    if (existing.length > 0) {
      // Update quantity
      await sql`
        UPDATE cart_items 
        SET quantity = quantity + ${quantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `;
    } else {
      // Insert new cart item
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity, price_at_time)
        VALUES (${userId}, ${product_id}, ${quantity}, ${product.price})
      `;
    }

    return Response.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return Response.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return Response.json({ error: 'Cart item ID required' }, { status: 400 });
    }

    // Get user ID
    const users = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!users[0]) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Delete cart item (only if it belongs to the user)
    await sql`
      DELETE FROM cart_items 
      WHERE id = ${cartItemId} AND user_id = ${userId}
    `;

    return Response.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return Response.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
