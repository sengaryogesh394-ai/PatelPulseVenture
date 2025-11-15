import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from '@/lib/productController';

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const statusParam = searchParams.get('status');
    
    // Determine status filter:
    // - 'all' = undefined (fetch all statuses)
    // - specific status = use that status
    // - no param = default to 'active' (for customer-facing pages)
    let statusFilter: string | undefined;
    if (statusParam === 'all') {
      statusFilter = undefined; // Fetch all statuses
    } else if (statusParam) {
      statusFilter = statusParam; // Use specific status
    } else {
      statusFilter = 'active'; // Default for customer pages
    }
    
    const company = searchParams.get('company') || undefined;

    const limitParam = searchParams.get('limit');
    const options = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: limitParam === 'all' ? 100000 : parseInt(limitParam || '12'),
      category: searchParams.get('category') || undefined,
      isFeatured: searchParams.get('isFeatured') === 'true' ? true : undefined,
      status: statusFilter,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      company,
    };

    const result = await ProductController.getAllProducts(options);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const company = url.searchParams.get('company') || undefined;
    const body = await request.json();
    const result = await ProductController.createProduct(body, company || (body as any)?.company);
    
    return NextResponse.json(result, { 
      status: result.success ? 201 : 400 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
