import { auth } from '../../../../../auth';
import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// PATCH - Update cart item quantity
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cart_item_id, quantity } = body;

    if (!cart_item_id || quantity === undefined) {
      return Response.json({ error: 'Cart item ID and quantity required' }, { status: 400 });
    }

    if (quantity < 1) {
      return Response.json({ error: 'Quantity must be at least 1' }, { status: 400 });
    }

    // Get user ID
    const users = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!users[0]) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Update quantity (only if it belongs to the user)
    await sql`
      UPDATE cart_items 
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${cart_item_id} AND user_id = ${userId}
    `;

    return Response.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    return Response.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
