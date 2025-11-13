import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { products } from '@/lib/data';

export const dynamic = 'force-dynamic';

// POST /api/products/seed - Seed database with existing products
export async function POST() {
  try {
    await connectDB();

    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Products already exist in database. Click "Reset & Seed" to update with new details.',
          existingCount,
        },
        { status: 400 }
      );
    }

    const productsWithDefaults = products.map((p) => ({
      ...p,
      imageUrl: p.imageUrl || '',
      status: p.status || 'active',
    }));

    const inserted = await Product.insertMany(productsWithDefaults);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} products`,
      data: inserted,
    });
  } catch (error: any) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed products', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/seed - Reset and reseed products
export async function DELETE() {
  try {
    await connectDB();

    await Product.deleteMany({});

    const productsWithDefaults = products.map((p) => ({
      ...p,
      imageUrl: p.imageUrl || '',
      status: p.status || 'active',
    }));

    const inserted = await Product.insertMany(productsWithDefaults);

    return NextResponse.json({
      success: true,
      message: `Successfully reset and seeded ${inserted.length} products`,
      data: inserted,
    });
  } catch (error: any) {
    console.error('Error resetting products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset products', details: error.message },
      { status: 500 }
    );
  }
}
