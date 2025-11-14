import { NextResponse } from 'next/server';
import { ProductController } from '@/lib/productController';

// GET /api/products/stats - Get product statistics
export async function GET() {
  try {
    const result = await ProductController.getProductStats();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
