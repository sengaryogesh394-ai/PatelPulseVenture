import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { generateUniqueProductSlug } from '@/lib/product-slug-generator';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET /api/products - Get all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: true, data: [], fallback: true, message: 'Using empty list - MongoDB connection failed' });
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Product name and description are required' },
        { status: 400 }
      );
    }

    // Check duplicate name only (case-insensitive)
    const existingByName = await Product.findOne({
      name: { $regex: new RegExp(`^${(body.name as string).trim()}$`, 'i') }
    });

    if (existingByName) {
      return NextResponse.json(
        {
          success: false,
          error: `A product with the name "${body.name}" already exists. Please choose a different name.`,
          conflictField: 'name',
          existingProduct: { name: existingByName.name, slug: existingByName.slug }
        },
        { status: 409 }
      );
    }

    // Always generate initial unique slug
    body.slug = await generateUniqueProductSlug(body.name);

    const MAX_ATTEMPTS = 5;
    let attempt = 0;
    while (attempt < MAX_ATTEMPTS) {
      try {
        if (!body.id || attempt > 0) {
          body.id = new mongoose.Types.ObjectId().toHexString();
        }
        if (attempt > 0) {
          body.slug = await generateUniqueProductSlug(body.name);
        }

        const product = new Product(body);
        await product.save();

        return NextResponse.json({ success: true, data: product, message: 'Product created successfully' }, { status: 201 });
      } catch (err: any) {
        if (err?.code === 11000) {
          attempt++;
          console.warn(`Duplicate key product on attempt ${attempt}, retrying...`, err?.keyValue);
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json(
      { success: false, error: 'Could not generate a unique slug/id for product after multiple attempts. Please try again.' },
      { status: 409 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      const fields = Object.keys(error.keyPattern || {});
      const fieldList = fields.length ? fields.join(', ') : 'unique field';
      return NextResponse.json(
        { success: false, error: `Conflict on ${fieldList}. Please try again.` },
        { status: 409 }
      );
    }
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
