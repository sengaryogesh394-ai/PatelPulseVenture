import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from '@/lib/productController';

// GET /api/products/[id] - Get product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = request.nextUrl.searchParams.get('company') || undefined;
    
    // Try to get by slug first (for URLs like /shop/canva-templates)
    // If that fails, try by ID (for admin operations)
    let result = await ProductController.getProductBySlug(id, company);
    
    if (!result.success) {
      // If slug lookup failed, try by ID
      result = await ProductController.getProductById(id, company);
    }
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const company = request.nextUrl.searchParams.get('company') || (body as any)?.company;
    const result = await ProductController.updateProduct(id, body, company);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = request.nextUrl.searchParams.get('company') || undefined;
    const result = await ProductController.deleteProduct(id, company);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
