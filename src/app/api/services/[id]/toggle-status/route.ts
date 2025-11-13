import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// PATCH /api/services/[id]/toggle-status - Toggle service status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Toggling status for service:', params.id);
    await connectDB();
    
    // Find the current service
    const service = await Service.findOne({ id: params.id });
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Toggle the status
    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    
    // Update the service
    const updatedService = await Service.findOneAndUpdate(
      { id: params.id },
      { status: newStatus },
      { new: true, runValidators: true }
    );
    
    console.log('Service status updated:', updatedService?.status);
    
    return NextResponse.json({
      success: true,
      data: updatedService,
      message: `Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle service status' },
      { status: 500 }
    );
  }
}
