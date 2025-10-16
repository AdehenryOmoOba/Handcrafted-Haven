import { getCategories } from '@/lib/data';

export async function GET() {
  try {
    const categories = await getCategories();
    return Response.json(categories);
  } catch (error) {
    console.error('Categories API Error:', error);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}