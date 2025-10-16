import { NextRequest } from 'next/server';
import { getProducts } from '@/lib/data';
import { ProductFilters, ProductSort } from '@/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const sort = (searchParams.get('sort') || 'newest') as ProductSort;
    
    // Parse filters
    const filters: ProductFilters = {};
    
    if (searchParams.get('category_id')) {
      filters.category_id = searchParams.get('category_id')!;
    }
    
    if (searchParams.get('artisan_id')) {
      filters.artisan_id = searchParams.get('artisan_id')!;
    }
    
    if (searchParams.get('min_price')) {
      filters.min_price = parseFloat(searchParams.get('min_price')!);
    }
    
    if (searchParams.get('max_price')) {
      filters.max_price = parseFloat(searchParams.get('max_price')!);
    }
    
    if (searchParams.get('is_featured')) {
      filters.is_featured = searchParams.get('is_featured') === 'true';
    }

    // Get products from database
    const result = await getProducts(page, perPage, filters, sort);
    
    return Response.json(result);
  } catch (error) {
    console.error('Products API Error:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}