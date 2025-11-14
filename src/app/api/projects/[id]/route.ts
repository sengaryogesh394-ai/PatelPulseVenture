import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

// GET /api/projects/[id] - Get a specific project
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findOne({ id });
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    // Debug logging
    console.log('Updating project:', id, 'with data:', body);
    console.log('ImageURL in request:', body.imageUrl);
    console.log('Full body:', JSON.stringify(body, null, 2));
    
    // Explicitly construct the update object
    const updateData = {
      title: body.title,
      description: body.description,
      link: body.link,
      technologies: body.technologies,
      category: body.category,
      imageId: body.imageId,
      imageUrl: body.imageUrl, // Explicitly include imageUrl
      status: body.status,
      updatedAt: new Date()
    };
    
    console.log('Update data being sent to MongoDB:', JSON.stringify(updateData, null, 2));
    
    // Try direct update first
    const updateResult = await Project.updateOne(
      { id },
      { $set: updateData }
    );
    
    console.log('Update operation result:', updateResult);
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Get the updated project
    const updatedProject = await Project.findOne({ id });
    console.log('Updated project result:', JSON.stringify(updatedProject, null, 2));
    
    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found after update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deletedProject = await Project.findOneAndDelete({ id });
    
    if (!deletedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project', details: error.message },
      { status: 500 }
    );
  }
}
