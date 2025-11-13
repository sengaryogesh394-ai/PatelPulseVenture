import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { services as staticServices } from '@/lib/data';
import { generateUniqueSlug } from '@/lib/slug-generator';
import mongoose from 'mongoose';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// GET /api/services - Get all services
export async function GET() {
  try {
    console.log('GET /api/services - Starting...');
    await connectDB();
    console.log('Database connected successfully');
    
    const services = await Service.find({}).sort({ createdAt: 1 });
    console.log('Found services:', services.length);
    
    return NextResponse.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    
    // Fallback to static services if MongoDB fails
    console.log('Falling back to static services');
    return NextResponse.json({
      success: true,
      data: staticServices,
      fallback: true,
      message: 'Using static data - MongoDB connection failed'
    });
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Service name and description are required' },
        { status: 400 }
      );
    }
    
    // Only check for exact name duplicates (case-insensitive)
    const existingNameService = await Service.findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') }
    });
    
    if (existingNameService) {
      return NextResponse.json(
        { 
          success: false, 
          error: `A service with the name "${body.name}" already exists. Please choose a different name.`,
          conflictField: 'name',
          existingService: {
            name: existingNameService.name,
            slug: existingNameService.slug
          }
        },
        { status: 409 }
      );
    }

    // Always generate an initial unique slug to prevent conflicts
    body.slug = await generateUniqueSlug(body.name);
    console.log(`Generated unique slug: ${body.slug} for service: ${body.name}`);

    // Robust creation with retry on duplicate key (slug or id)
    const MAX_ATTEMPTS = 5;
    let attempt = 0;
    while (attempt < MAX_ATTEMPTS) {
      try {
        // Generate a robust unique ID each attempt if not provided or after a collision
        if (!body.id || attempt > 0) {
          body.id = new mongoose.Types.ObjectId().toHexString();
        }

        // Refresh slug after a collision
        if (attempt > 0) {
          body.slug = await generateUniqueSlug(body.name);
          console.log(`Retry ${attempt}: regenerated slug -> ${body.slug}`);
        }

        const service = new Service(body);
        await service.save();

        return NextResponse.json({
          success: true,
          data: service,
          message: 'Service created successfully'
        }, { status: 201 });
      } catch (err: any) {
        // Duplicate key error, try again with new slug/id
        if (err?.code === 11000) {
          attempt++;
          console.warn(`Duplicate key on attempt ${attempt}, retrying...`, err?.keyValue);
          continue;
        }
        // Non-duplicate error -> rethrow to outer catch
        throw err;
      }
    }

    // If we exhausted retries, return a clear conflict error
    return NextResponse.json(
      { success: false, error: 'Could not generate a unique slug/id after multiple attempts. Please try again.' },
      { status: 409 }
    );
  } catch (error: any) {
    console.error('Error creating service:', error);
    
    // Handle duplicate key error as explicit conflict (should be rare due to retries)
    if (error.code === 11000) {
      const fields = Object.keys(error.keyPattern || {});
      const fieldList = fields.length ? fields.join(', ') : 'unique field';
      return NextResponse.json(
        { success: false, error: `Conflict on ${fieldList}. Please try again.` },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create service', details: error.message },
      { status: 500 }
    );
  }
}
