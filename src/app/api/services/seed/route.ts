import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { services } from '@/lib/data';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// POST /api/services/seed - Seed database with existing services
export async function POST() {
  try {
    await connectDB();
    
    // Check if services already exist
    const existingCount = await Service.countDocuments();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: 'Services already exist in database. Click "Reset & Seed" to update with new details.',
        existingCount
      }, { status: 400 });
    }
    
    // Prepare services data with default values for new fields
    const servicesWithDefaults = services.map(service => ({
      ...service,
      imageUrl: service.imageUrl || '', // Default empty string
      status: service.status || 'active' // Default active status
    }));
    
    // Insert all services from data file
    const insertedServices = await Service.insertMany(servicesWithDefaults);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedServices.length} services with enhanced details`,
      data: insertedServices
    });
  } catch (error: any) {
    console.error('Error seeding services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed services', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/services/seed - Reset and reseed services
export async function DELETE() {
  try {
    await connectDB();
    
    // Clear existing services
    await Service.deleteMany({});
    
    // Prepare services data with default values for new fields
    const servicesWithDefaults = services.map(service => ({
      ...service,
      imageUrl: service.imageUrl || '', // Default empty string
      status: service.status || 'active' // Default active status
    }));
    
    // Insert all services from data file
    const insertedServices = await Service.insertMany(servicesWithDefaults);
    
    return NextResponse.json({
      success: true,
      message: `Successfully reset and seeded ${insertedServices.length} services with enhanced details`,
      data: insertedServices
    });
  } catch (error: any) {
    console.error('Error resetting services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset services', details: error.message },
      { status: 500 }
    );
  }
}
