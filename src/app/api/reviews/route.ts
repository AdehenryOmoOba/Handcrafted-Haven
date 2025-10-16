import { auth } from '../../../../auth';
import postgres from 'postgres';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ReviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(255),
  comment: z.string().optional(),
});

// GET - Fetch reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');

    if (!productId) {
      return Response.json({ error: 'Product ID required' }, { status: 400 });
    }

    const offset = (page - 1) * perPage;

    // Get reviews with user info
    const reviews = await sql`
      SELECT 
        r.id,
        r.rating,
        r.title,
        r.comment,
        r.is_verified_purchase,
        r.helpful_count,
        r.created_at,
        u.name as user_name,
        up.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE r.product_id = ${productId} AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    // Get total count
    const countResult = await sql<[{ count: string }]>`
      SELECT COUNT(*) as count
      FROM reviews 
      WHERE product_id = ${productId} AND status = 'approved'
    `;

    const totalCount = parseInt(countResult[0].count);

    // Get rating summary
    const ratingSummary = await sql<[{ avg_rating: number; total_reviews: string }]>`
      SELECT 
        COALESCE(AVG(rating), 0) as avg_rating,
        COUNT(*) as total_reviews
      FROM reviews 
      WHERE product_id = ${productId} AND status = 'approved'
    `;

    return Response.json({
      reviews,
      pagination: {
        page,
        per_page: perPage,
        total: totalCount,
        total_pages: Math.ceil(totalCount / perPage),
      },
      summary: {
        avg_rating: parseFloat(ratingSummary[0].avg_rating.toFixed(1)),
        total_reviews: parseInt(ratingSummary[0].total_reviews),
      }
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST - Create a new review
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized - Please login to review' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error }, { status: 400 });
    }

    const { product_id, rating, title, comment } = parsed.data;

    // Get user ID
    const users = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!users[0]) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Check if product exists
    const products = await sql`
      SELECT id FROM products WHERE id = ${product_id} AND is_active = true LIMIT 1
    `;

    if (products.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await sql`
      SELECT id FROM reviews 
      WHERE product_id = ${product_id} AND user_id = ${userId}
      LIMIT 1
    `;

    if (existingReview.length > 0) {
      return Response.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Create review
    const newReview = await sql`
      INSERT INTO reviews (product_id, user_id, rating, title, comment, status)
      VALUES (${product_id}, ${userId}, ${rating}, ${title}, ${comment || ''}, 'approved')
      RETURNING id, rating, title, comment, created_at
    `;

    return Response.json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: newReview[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return Response.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
