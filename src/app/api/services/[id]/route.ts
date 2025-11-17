import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// Helper to build a flexible filter supporting custom id, slug, or Mongo _id
function buildServiceFilter(idOrSlug: string) {
  const isObjectId = /^[a-fA-F0-9]{24}$/.test(idOrSlug);
  const or: any[] = [
    { id: idOrSlug },
    { slug: idOrSlug },
  ];
  if (isObjectId) or.push({ _id: idOrSlug });
  return { $or: or };
}

// GET /api/services/[id] - Get a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const service = await Service.findOne(buildServiceFilter(id));
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update a specific service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id } = await params;
    // Generate slug if name is updated but slug is not provided
    if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const service = await Service.findOneAndUpdate(
      buildServiceFilter(id),
      body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: service
    });
  } catch (error: any) {
    console.error('Error updating service:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Service with this name or slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete a specific service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const service = await Service.findOneAndDelete(buildServiceFilter(id));
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
