import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// PATCH /api/products/[id]/toggle-status - Toggle product status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Toggling status for product:', params.id);
    await connectDB();

    const product = await Product.findOne({ id: params.id });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const updated = await Product.findOneAndUpdate(
      { id: params.id },
      { status: newStatus },
      { new: true, runValidators: true }
    );

    console.log('Product status updated:', updated?.status);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle product status' },
      { status: 500 }
    );
  }
}
