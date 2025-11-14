import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export const dynamic = 'force-dynamic';

// GET /api/team/[id] - Get a specific team member
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const teamMember = await Team.findOne({ id });
    
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error: any) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/team/[id] - Update a team member
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    // Debug logging
    console.log('Updating team member:', id, 'with data:', body);
    console.log('ImageURL in request:', body.imageUrl);
    console.log('Full body:', JSON.stringify(body, null, 2));
    
    // Explicitly construct the update object
    const updateData = {
      name: body.name,
      position: body.position,
      bio: body.bio,
      imageId: body.imageId,
      imageUrl: body.imageUrl, // Explicitly include imageUrl
      socialLinks: body.socialLinks,
      status: body.status,
      order: body.order,
      updatedAt: new Date()
    };
    
    console.log('Update data being sent to MongoDB:', JSON.stringify(updateData, null, 2));
    
    // Try direct update first
    const updateResult = await Team.updateOne(
      { id },
      { $set: updateData }
    );
    
    console.log('Update operation result:', updateResult);
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    // Get the updated team member
    const updatedTeamMember = await Team.findOne({ id });
    console.log('Updated team member result:', JSON.stringify(updatedTeamMember, null, 2));
    
    if (!updatedTeamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found after update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedTeamMember,
      message: 'Team member updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Delete a team member
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedTeamMember = await Team.findOneAndDelete({ id });
    
    if (!deletedTeamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
